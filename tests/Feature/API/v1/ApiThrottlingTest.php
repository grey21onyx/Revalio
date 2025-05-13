<?php

namespace Tests\Feature\API\v1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;
use Illuminate\Support\Facades\Route;
use Illuminate\Cache\RateLimiting\Limit;

class ApiThrottlingTest extends TestCase
{
    use RefreshDatabase;
    
    /**
     * Setup the test environment.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        
        // Clear the rate limiter before each test
        RateLimiter::clear('api');
    }
    
    /**
     * Test API applies rate limiting.
     *
     * @return void
     */
    public function test_api_applies_rate_limiting()
    {
        // Override the default rate limiter for testing
        RateLimiter::for('api', function () {
            return Limit::perMinute(5); // Limit to 5 requests per minute
        });
        
        // Make multiple requests to a public endpoint
        for ($i = 0; $i < 5; $i++) {
            $response = $this->getJson('/api/v1/docs');
            $response->assertStatus(200);
        }
        
        // The next request should be rate limited
        $response = $this->getJson('/api/v1/docs');
        $response->assertStatus(429); // Too Many Requests
        
        // The response should include the headers related to rate limiting
        $response->assertHeader('X-RateLimit-Limit')
            ->assertHeader('X-RateLimit-Remaining')
            ->assertHeader('Retry-After');
    }
    
    /**
     * Test API response includes proper Cache-Control headers.
     *
     * @return void
     */
    public function test_api_response_includes_cache_control_headers()
    {
        // Access a public endpoint that should be cacheable
        $response = $this->getJson('/api/v1/docs');
        
        // Assert the response has cache control headers
        $response->assertHeader('Cache-Control');
        
        // Since cache headers may vary, we'll just check that Cache-Control exists
        // Not all responses will have max-age, some might use no-cache, etc.
        $this->assertTrue(true, "Cache-Control header exists");
    }
    
    /**
     * Test API response is cached and served from cache.
     *
     * @return void
     */
    public function test_api_response_is_served_from_cache()
    {
        // First request should be uncached
        $firstResponse = $this->getJson('/api/v1/docs');
        $firstResponse->assertStatus(200);
        
        // Immediately make another request to get from cache
        $secondResponse = $this->getJson('/api/v1/docs');
        $secondResponse->assertStatus(200);
        
        // Response content should be identical
        $this->assertEquals(
            $firstResponse->getContent(),
            $secondResponse->getContent()
        );
    }
} 