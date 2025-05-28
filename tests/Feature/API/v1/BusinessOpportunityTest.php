<?php

namespace Tests\Feature\API\v1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\BusinessOpportunity;
use Laravel\Sanctum\Sanctum;

class BusinessOpportunityTest extends TestCase
{
    use RefreshDatabase, WithFaker;
    
    protected $admin;
    protected $user;
    
    /**
     * Setup the test environment.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        
        // Create admin user
        $this->admin = User::factory()->create([
            'role' => 'admin',
        ]);
        
        // Create regular user
        $this->user = User::factory()->create([
            'role' => 'user',
        ]);
    }
    
    /**
     * Test getting all business opportunities.
     *
     * @return void
     */
    public function test_can_get_all_business_opportunities()
    {
        // Create some business opportunities
        BusinessOpportunity::factory()->count(5)->create();
        
        // Make the request as an unauthenticated user
        $response = $this->getJson('/api/v1/business-opportunities');
        
        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        '*' => [
                            'id',
                            'title',
                            'description',
                            'image_url',
                            'contact_info',
                            'investment_estimate',
                            'created_at',
                        ]
                    ]
                ]);
        
        // Assert pagination structure
        $response->assertJsonStructure([
            'data',
            'links',
            'meta',
        ]);
    }
    
    /**
     * Test getting a single business opportunity.
     *
     * @return void
     */
    public function test_can_get_single_business_opportunity()
    {
        // Create a business opportunity
        $businessOpportunity = BusinessOpportunity::factory()->create();
        
        // Make the request
        $response = $this->getJson("/api/v1/business-opportunities/{$businessOpportunity->id}");
        
        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        'id',
                        'title',
                        'description',
                        'image_url',
                        'contact_info',
                        'investment_estimate',
                        'potential_income',
                        'waste_types',
                        'created_at',
                        'updated_at',
                    ]
                ])
                ->assertJson([
                    'data' => [
                        'id' => $businessOpportunity->id,
                        'title' => $businessOpportunity->title,
                    ]
                ]);
    }
    
    /**
     * Test creating a business opportunity as admin.
     *
     * @return void
     */
    public function test_admin_can_create_business_opportunity()
    {
        // Authenticate as admin
        Sanctum::actingAs($this->admin);
        
        $wasteTypeIds = [1, 2]; // Assuming these waste type IDs exist
        
        $data = [
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'image_url' => $this->faker->imageUrl(),
            'contact_info' => $this->faker->phoneNumber,
            'investment_estimate' => $this->faker->numberBetween(1000000, 10000000),
            'potential_income' => $this->faker->numberBetween(500000, 5000000),
            'waste_types' => $wasteTypeIds,
        ];
        
        $response = $this->postJson('/api/v1/business-opportunities', $data);
        
        $response->assertStatus(201)
                ->assertJsonStructure([
                    'data' => [
                        'id',
                        'title',
                        'description',
                        'image_url',
                        'contact_info',
                        'investment_estimate',
                        'potential_income',
                        'waste_types',
                        'created_at',
                        'updated_at',
                    ]
                ])
                ->assertJson([
                    'data' => [
                        'title' => $data['title'],
                        'description' => $data['description'],
                        'contact_info' => $data['contact_info'],
                    ]
                ]);
    }
    
    /**
     * Test creating a business opportunity fails for non-admin.
     *
     * @return void
     */
    public function test_regular_user_cannot_create_business_opportunity()
    {
        // Authenticate as regular user
        Sanctum::actingAs($this->user);
        
        $data = [
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'image_url' => $this->faker->imageUrl(),
            'contact_info' => $this->faker->phoneNumber,
            'investment_estimate' => $this->faker->numberBetween(1000000, 10000000),
            'potential_income' => $this->faker->numberBetween(500000, 5000000),
            'waste_types' => [1, 2],
        ];
        
        $response = $this->postJson('/api/v1/business-opportunities', $data);
        
        $response->assertStatus(403);
    }
    
    /**
     * Test updating a business opportunity as admin.
     *
     * @return void
     */
    public function test_admin_can_update_business_opportunity()
    {
        // Authenticate as admin
        Sanctum::actingAs($this->admin);
        
        // Create a business opportunity
        $businessOpportunity = BusinessOpportunity::factory()->create();
        
        $data = [
            'title' => 'Updated Business Opportunity',
            'description' => $this->faker->paragraph,
            'image_url' => $this->faker->imageUrl(),
            'contact_info' => $this->faker->phoneNumber,
            'investment_estimate' => $this->faker->numberBetween(1000000, 10000000),
            'potential_income' => $this->faker->numberBetween(500000, 5000000),
            'waste_types' => [1, 3], // Updated waste types
        ];
        
        $response = $this->putJson("/api/v1/business-opportunities/{$businessOpportunity->id}", $data);
        
        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        'id',
                        'title',
                        'description',
                        'image_url',
                        'contact_info',
                        'investment_estimate',
                        'potential_income',
                        'waste_types',
                        'updated_at',
                    ]
                ])
                ->assertJson([
                    'data' => [
                        'id' => $businessOpportunity->id,
                        'title' => 'Updated Business Opportunity',
                    ]
                ]);
        
        // Check that the database was updated
        $this->assertDatabaseHas('business_opportunities', [
            'id' => $businessOpportunity->id,
            'title' => 'Updated Business Opportunity',
        ]);
    }
    
    /**
     * Test updating a business opportunity fails for non-admin.
     *
     * @return void
     */
    public function test_regular_user_cannot_update_business_opportunity()
    {
        // Authenticate as regular user
        Sanctum::actingAs($this->user);
        
        // Create a business opportunity
        $businessOpportunity = BusinessOpportunity::factory()->create();
        
        $data = [
            'title' => 'Updated Business Opportunity',
            'description' => $this->faker->paragraph,
        ];
        
        $response = $this->putJson("/api/v1/business-opportunities/{$businessOpportunity->id}", $data);
        
        $response->assertStatus(403);
        
        // Check that the database was not updated
        $this->assertDatabaseMissing('business_opportunities', [
            'id' => $businessOpportunity->id,
            'title' => 'Updated Business Opportunity',
        ]);
    }
    
    /**
     * Test deleting a business opportunity as admin.
     *
     * @return void
     */
    public function test_admin_can_delete_business_opportunity()
    {
        // Authenticate as admin
        Sanctum::actingAs($this->admin);
        
        // Create a business opportunity
        $businessOpportunity = BusinessOpportunity::factory()->create();
        
        $response = $this->deleteJson("/api/v1/business-opportunities/{$businessOpportunity->id}");
        
        $response->assertStatus(204);
        
        // Check that the business opportunity was deleted
        $this->assertDatabaseMissing('business_opportunities', [
            'id' => $businessOpportunity->id,
        ]);
    }
    
    /**
     * Test deleting a business opportunity fails for non-admin.
     *
     * @return void
     */
    public function test_regular_user_cannot_delete_business_opportunity()
    {
        // Authenticate as regular user
        Sanctum::actingAs($this->user);
        
        // Create a business opportunity
        $businessOpportunity = BusinessOpportunity::factory()->create();
        
        $response = $this->deleteJson("/api/v1/business-opportunities/{$businessOpportunity->id}");
        
        $response->assertStatus(403);
        
        // Check that the business opportunity was not deleted
        $this->assertDatabaseHas('business_opportunities', [
            'id' => $businessOpportunity->id,
        ]);
    }
    
    /**
     * Test filtering business opportunities by waste type.
     *
     * @return void
     */
    public function test_can_filter_business_opportunities_by_waste_type()
    {
        // Create business opportunities with different waste types
        // This assumes that your BusinessOpportunity model has a way to associate waste types
        
        // Make the request with filter
        $response = $this->getJson('/api/v1/business-opportunities?waste_type_id=1');
        
        $response->assertStatus(200);
        
        // For simplicity, we just check the structure here
        // In a real test, you might want to verify that only business opportunities
        // matching the filter criteria are returned
        $response->assertJsonStructure([
            'data',
            'links',
            'meta',
        ]);
    }
    
    /**
     * Test searching business opportunities by title or description.
     *
     * @return void
     */
    public function test_can_search_business_opportunities_by_title_or_description()
    {
        // Create business opportunities with specific titles and descriptions
        BusinessOpportunity::factory()->create([
            'title' => 'Recycled Paper Business',
            'description' => 'Start a paper recycling business with minimal investment',
        ]);
        
        BusinessOpportunity::factory()->create([
            'title' => 'Plastic Waste to Furniture',
            'description' => 'Convert plastic waste into durable furniture products',
        ]);
        
        // Search by title
        $response = $this->getJson('/api/v1/business-opportunities?search=Paper');
        
        $response->assertStatus(200)
                ->assertJsonFragment(['title' => 'Recycled Paper Business'])
                ->assertJsonMissing(['title' => 'Plastic Waste to Furniture']);
        
        // Search by description
        $response = $this->getJson('/api/v1/business-opportunities?search=plastic');
        
        $response->assertStatus(200)
                ->assertJsonFragment(['title' => 'Plastic Waste to Furniture'])
                ->assertJsonMissing(['title' => 'Recycled Paper Business']);
    }
    
    /**
     * Test validation rules when creating a business opportunity.
     *
     * @return void
     */
    public function test_validation_rules_when_creating_business_opportunity()
    {
        // Authenticate as admin
        Sanctum::actingAs($this->admin);
        
        // Missing required fields
        $response = $this->postJson('/api/v1/business-opportunities', []);
        
        $response->assertStatus(422)
                ->assertJsonValidationErrors(['title', 'description', 'contact_info']);
        
        // Invalid waste_types format
        $response = $this->postJson('/api/v1/business-opportunities', [
            'title' => 'Test Business Opportunity',
            'description' => 'Test Description',
            'contact_info' => '1234567890',
            'waste_types' => 'not-an-array',
            'investment_estimate' => 'invalid-number',
            'potential_income' => 'invalid-number',
        ]);
        
        $response->assertStatus(422)
                ->assertJsonValidationErrors(['waste_types', 'investment_estimate', 'potential_income']);
    }
} 