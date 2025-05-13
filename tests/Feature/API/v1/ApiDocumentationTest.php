<?php

namespace Tests\Feature\API\v1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ApiDocumentationTest extends TestCase
{
    /**
     * Test that the OpenAPI documentation UI is accessible.
     *
     * @return void
     */
    public function test_openapi_ui_is_accessible()
    {
        $response = $this->get('/api-docs');
        
        $response->assertStatus(200);
    }
    
    /**
     * Test that the OpenAPI JSON specification is accessible and valid.
     *
     * @return void
     */
    public function test_openapi_json_is_accessible_and_valid()
    {
        $response = $this->get('/api/v1/docs');
        
        $response->assertStatus(200)
                ->assertHeader('Content-Type', 'application/json')
                ->assertJsonStructure([
                    'openapi',
                    'info' => [
                        'title',
                        'description',
                        'version',
                    ],
                    'paths',
                    'components' => [
                        'schemas',
                        'securitySchemes',
                    ],
                ]);
        
        // Verify version is 3.0.0 or later
        $responseData = json_decode($response->getContent(), true);
        $this->assertStringStartsWith('3.', $responseData['openapi']);
        
        // Verify Sanctum authentication is defined
        $this->assertArrayHasKey('bearerAuth', $responseData['components']['securitySchemes']);
    }
    
    /**
     * Test that all required API endpoints are documented.
     *
     * @return void
     */
    public function test_all_required_endpoints_are_documented()
    {
        $response = $this->get('/api/v1/docs');
        $responseData = json_decode($response->getContent(), true);
        
        // Core endpoints that must be documented
        $requiredEndpoints = [
            '/register',
            '/login',
            '/waste-types'
        ];
        
        $paths = array_keys($responseData['paths']);
        
        // Normalize paths for comparison
        $normalizedPaths = [];
        foreach ($paths as $path) {
            // Extract base path without parameters
            $basePath = preg_replace('/{.*?}/', '', $path);
            $basePath = rtrim($basePath, '/');
            $normalizedPaths[] = $basePath;
        }
        
        foreach ($requiredEndpoints as $endpoint) {
            $found = false;
            foreach ($normalizedPaths as $path) {
                if (strpos($path, $endpoint) !== false) {
                    $found = true;
                    break;
                }
            }
            
            $this->assertTrue($found, "Required endpoint {$endpoint} is not documented");
        }
    }
    
    /**
     * Test that API response schemas are documented.
     *
     * @return void
     */
    public function test_api_response_schemas_are_documented()
    {
        $response = $this->get('/api/v1/docs');
        $responseData = json_decode($response->getContent(), true);
        
        // Check that common schemas are defined
        $requiredSchemas = [
            'User',
            'WasteType',
            'LoginResponse',
            'RegistrationResponse',
            'ErrorResponse',
            'ValidationError'
        ];
        
        $schemas = array_keys($responseData['components']['schemas']);
        
        foreach ($requiredSchemas as $schema) {
            $found = false;
            foreach ($schemas as $definedSchema) {
                if (strpos($definedSchema, $schema) !== false) {
                    $found = true;
                    break;
                }
            }
            
            $this->assertTrue($found, "Required schema {$schema} is not documented");
        }
    }
    
    /**
     * Test that all API operations have appropriate response codes documented.
     *
     * @return void
     */
    public function test_all_operations_have_appropriate_response_codes()
    {
        $response = $this->get('/api/v1/docs');
        $responseData = json_decode($response->getContent(), true);
        
        // Check a subset of paths to verify response codes
        foreach (['login', 'register'] as $path) {
            $fullPath = null;
            
            // Find the path
            foreach (array_keys($responseData['paths']) as $p) {
                if (strpos($p, $path) !== false) {
                    $fullPath = $p;
                    break;
                }
            }
            
            $this->assertNotNull($fullPath, "Path containing '{$path}' not found");
            
            // Check if POST method exists
            $this->assertArrayHasKey('post', $responseData['paths'][$fullPath], "POST method not found for {$fullPath}");
            
            // Check if responses are defined
            $this->assertArrayHasKey('responses', $responseData['paths'][$fullPath]['post'], "Responses not defined for POST {$fullPath}");
            
            // Login should have 200 response
            if (strpos($fullPath, 'login') !== false) {
                $this->assertArrayHasKey('200', $responseData['paths'][$fullPath]['post']['responses'], "200 response not defined for {$fullPath}");
                // Login should have 401 response
                $this->assertArrayHasKey('401', $responseData['paths'][$fullPath]['post']['responses'], "401 response not defined for {$fullPath}");
            }
            
            // Register should have 201 response
            if (strpos($fullPath, 'register') !== false) {
                $this->assertArrayHasKey('201', $responseData['paths'][$fullPath]['post']['responses'], "201 response not defined for {$fullPath}");
                // Register should have 422 response
                $this->assertArrayHasKey('422', $responseData['paths'][$fullPath]['post']['responses'], "422 response not defined for {$fullPath}");
            }
        }
    }
    
    /**
     * Test that authentication documentation is correct.
     *
     * @return void
     */
    public function test_authentication_documentation_is_correct()
    {
        $response = $this->get('/api/v1/docs');
        $responseData = json_decode($response->getContent(), true);
        
        // Check that BearerAuth security scheme is defined
        $this->assertArrayHasKey('bearerAuth', $responseData['components']['securitySchemes']);
        
        $bearerAuth = $responseData['components']['securitySchemes']['bearerAuth'];
        $this->assertEquals('http', $bearerAuth['type']);
        $this->assertEquals('bearer', $bearerAuth['scheme']);
        $this->assertEquals('JWT', $bearerAuth['bearerFormat']);
        
        // Check that login endpoint is documented
        $loginPath = null;
        foreach ($responseData['paths'] as $path => $methods) {
            if (strpos($path, '/login') !== false && isset($methods['post'])) {
                $loginPath = $path;
                break;
            }
        }
        
        $this->assertNotNull($loginPath, "Login endpoint is not documented");
        
        // Check that login responses have a 200 status code
        $loginResponses = $responseData['paths'][$loginPath]['post']['responses'];
        $this->assertArrayHasKey('200', $loginResponses);
        
        // Verify a response schema is defined
        $this->assertTrue(
            isset($loginResponses['200']['content']['application/json']['schema']['$ref']) ||
            isset($loginResponses['200']['content']['application/json']['schema']),
            "Login response schema not properly defined"
        );
    }
} 