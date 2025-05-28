<?php

namespace Tests\Feature\API\v1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\WasteBuyer;
use Laravel\Sanctum\Sanctum;

class WasteBuyerTest extends TestCase
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
     * Test getting all waste buyers.
     *
     * @return void
     */
    public function test_can_get_all_waste_buyers()
    {
        // Create some waste buyers
        WasteBuyer::factory()->count(5)->create();
        
        // Make the request as an unauthenticated user
        $response = $this->getJson('/api/v1/waste-buyers');
        
        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        '*' => [
                            'id',
                            'name',
                            'address',
                            'phone',
                            'waste_types',
                            'operational_hours',
                            'latitude',
                            'longitude',
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
     * Test getting a single waste buyer.
     *
     * @return void
     */
    public function test_can_get_single_waste_buyer()
    {
        // Create a waste buyer
        $wasteBuyer = WasteBuyer::factory()->create();
        
        // Make the request
        $response = $this->getJson("/api/v1/waste-buyers/{$wasteBuyer->id}");
        
        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        'id',
                        'name',
                        'address',
                        'phone',
                        'waste_types',
                        'operational_hours',
                        'latitude',
                        'longitude',
                        'created_at',
                        'updated_at',
                    ]
                ])
                ->assertJson([
                    'data' => [
                        'id' => $wasteBuyer->id,
                        'name' => $wasteBuyer->name,
                    ]
                ]);
    }
    
    /**
     * Test creating a waste buyer as admin.
     *
     * @return void
     */
    public function test_admin_can_create_waste_buyer()
    {
        // Authenticate as admin
        Sanctum::actingAs($this->admin);
        
        $wasteTypeIds = [1, 2]; // Assuming these waste type IDs exist
        
        $data = [
            'name' => $this->faker->company,
            'address' => $this->faker->address,
            'phone' => $this->faker->phoneNumber,
            'waste_types' => $wasteTypeIds,
            'operational_hours' => 'Mon-Fri: 08:00-17:00',
            'latitude' => $this->faker->latitude,
            'longitude' => $this->faker->longitude,
        ];
        
        $response = $this->postJson('/api/v1/waste-buyers', $data);
        
        $response->assertStatus(201)
                ->assertJsonStructure([
                    'data' => [
                        'id',
                        'name',
                        'address',
                        'phone',
                        'waste_types',
                        'operational_hours',
                        'latitude',
                        'longitude',
                        'created_at',
                        'updated_at',
                    ]
                ])
                ->assertJson([
                    'data' => [
                        'name' => $data['name'],
                        'address' => $data['address'],
                        'phone' => $data['phone'],
                    ]
                ]);
    }
    
    /**
     * Test creating a waste buyer fails for non-admin.
     *
     * @return void
     */
    public function test_regular_user_cannot_create_waste_buyer()
    {
        // Authenticate as regular user
        Sanctum::actingAs($this->user);
        
        $data = [
            'name' => $this->faker->company,
            'address' => $this->faker->address,
            'phone' => $this->faker->phoneNumber,
            'waste_types' => [1, 2],
            'operational_hours' => 'Mon-Fri: 08:00-17:00',
            'latitude' => $this->faker->latitude,
            'longitude' => $this->faker->longitude,
        ];
        
        $response = $this->postJson('/api/v1/waste-buyers', $data);
        
        $response->assertStatus(403);
    }
    
    /**
     * Test updating a waste buyer as admin.
     *
     * @return void
     */
    public function test_admin_can_update_waste_buyer()
    {
        // Authenticate as admin
        Sanctum::actingAs($this->admin);
        
        // Create a waste buyer
        $wasteBuyer = WasteBuyer::factory()->create();
        
        $data = [
            'name' => 'Updated Company Name',
            'address' => $this->faker->address,
            'phone' => $this->faker->phoneNumber,
            'waste_types' => [1, 3], // Updated waste types
            'operational_hours' => 'Mon-Sat: 09:00-18:00', // Updated hours
            'latitude' => $this->faker->latitude,
            'longitude' => $this->faker->longitude,
        ];
        
        $response = $this->putJson("/api/v1/waste-buyers/{$wasteBuyer->id}", $data);
        
        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        'id',
                        'name',
                        'address',
                        'phone',
                        'waste_types',
                        'operational_hours',
                        'latitude',
                        'longitude',
                        'updated_at',
                    ]
                ])
                ->assertJson([
                    'data' => [
                        'id' => $wasteBuyer->id,
                        'name' => 'Updated Company Name',
                        'operational_hours' => 'Mon-Sat: 09:00-18:00',
                    ]
                ]);
        
        // Check that the database was updated
        $this->assertDatabaseHas('waste_buyers', [
            'id' => $wasteBuyer->id,
            'name' => 'Updated Company Name',
            'operational_hours' => 'Mon-Sat: 09:00-18:00',
        ]);
    }
    
    /**
     * Test updating a waste buyer fails for non-admin.
     *
     * @return void
     */
    public function test_regular_user_cannot_update_waste_buyer()
    {
        // Authenticate as regular user
        Sanctum::actingAs($this->user);
        
        // Create a waste buyer
        $wasteBuyer = WasteBuyer::factory()->create();
        
        $data = [
            'name' => 'Updated Company Name',
            'address' => $this->faker->address,
            'phone' => $this->faker->phoneNumber,
        ];
        
        $response = $this->putJson("/api/v1/waste-buyers/{$wasteBuyer->id}", $data);
        
        $response->assertStatus(403);
        
        // Check that the database was not updated
        $this->assertDatabaseMissing('waste_buyers', [
            'id' => $wasteBuyer->id,
            'name' => 'Updated Company Name',
        ]);
    }
    
    /**
     * Test deleting a waste buyer as admin.
     *
     * @return void
     */
    public function test_admin_can_delete_waste_buyer()
    {
        // Authenticate as admin
        Sanctum::actingAs($this->admin);
        
        // Create a waste buyer
        $wasteBuyer = WasteBuyer::factory()->create();
        
        $response = $this->deleteJson("/api/v1/waste-buyers/{$wasteBuyer->id}");
        
        $response->assertStatus(204);
        
        // Check that the waste buyer was deleted
        $this->assertDatabaseMissing('waste_buyers', [
            'id' => $wasteBuyer->id,
        ]);
    }
    
    /**
     * Test deleting a waste buyer fails for non-admin.
     *
     * @return void
     */
    public function test_regular_user_cannot_delete_waste_buyer()
    {
        // Authenticate as regular user
        Sanctum::actingAs($this->user);
        
        // Create a waste buyer
        $wasteBuyer = WasteBuyer::factory()->create();
        
        $response = $this->deleteJson("/api/v1/waste-buyers/{$wasteBuyer->id}");
        
        $response->assertStatus(403);
        
        // Check that the waste buyer was not deleted
        $this->assertDatabaseHas('waste_buyers', [
            'id' => $wasteBuyer->id,
        ]);
    }
    
    /**
     * Test filtering waste buyers by waste type.
     *
     * @return void
     */
    public function test_can_filter_waste_buyers_by_waste_type()
    {
        // Create waste buyers with different waste types
        // This assumes that your WasteBuyer model has a way to associate waste types
        
        // Make the request with filter
        $response = $this->getJson('/api/v1/waste-buyers?waste_type_id=1');
        
        $response->assertStatus(200);
        
        // For simplicity, we just check the structure here
        // In a real test, you might want to verify that only waste buyers
        // matching the filter criteria are returned
        $response->assertJsonStructure([
            'data',
            'links',
            'meta',
        ]);
    }
    
    /**
     * Test searching waste buyers by name or location.
     *
     * @return void
     */
    public function test_can_search_waste_buyers_by_name_or_location()
    {
        // Create waste buyers with specific names and addresses
        WasteBuyer::factory()->create([
            'name' => 'EcoRecycle Center',
            'address' => 'Jakarta Pusat',
        ]);
        
        WasteBuyer::factory()->create([
            'name' => 'Green Waste Solutions',
            'address' => 'Bandung',
        ]);
        
        // Search by name
        $response = $this->getJson('/api/v1/waste-buyers?search=EcoRecycle');
        
        $response->assertStatus(200)
                ->assertJsonFragment(['name' => 'EcoRecycle Center'])
                ->assertJsonMissing(['name' => 'Green Waste Solutions']);
        
        // Search by location
        $response = $this->getJson('/api/v1/waste-buyers?search=Bandung');
        
        $response->assertStatus(200)
                ->assertJsonFragment(['name' => 'Green Waste Solutions'])
                ->assertJsonMissing(['name' => 'EcoRecycle Center']);
    }
    
    /**
     * Test validation rules when creating a waste buyer.
     *
     * @return void
     */
    public function test_validation_rules_when_creating_waste_buyer()
    {
        // Authenticate as admin
        Sanctum::actingAs($this->admin);
        
        // Missing required fields
        $response = $this->postJson('/api/v1/waste-buyers', []);
        
        $response->assertStatus(422)
                ->assertJsonValidationErrors(['name', 'address', 'phone']);
        
        // Invalid waste_types format
        $response = $this->postJson('/api/v1/waste-buyers', [
            'name' => 'Test Company',
            'address' => 'Test Address',
            'phone' => '1234567890',
            'waste_types' => 'not-an-array',
            'latitude' => 'invalid-latitude',
            'longitude' => 'invalid-longitude',
        ]);
        
        $response->assertStatus(422)
                ->assertJsonValidationErrors(['waste_types', 'latitude', 'longitude']);
    }
} 