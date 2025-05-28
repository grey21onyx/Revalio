<?php

namespace Tests\Feature\API\v1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\WasteType;
use App\Models\WasteCategory;
use Laravel\Sanctum\Sanctum;

class WasteTypeTest extends TestCase
{
    use RefreshDatabase, WithFaker;
    
    /**
     * Setup the test environment.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a waste category for testing
        $this->wasteCategory = WasteCategory::create([
            'kategori_name' => 'Test Category',
            'deskripsi' => 'Test Description',
        ]);
    }
    
    /**
     * Test retrieval of all waste types.
     *
     * @return void
     */
    public function test_can_get_all_waste_types()
    {
        // Create some waste types
        WasteType::create([
            'jenis_name' => 'Test Type 1',
            'deskripsi' => 'Test Description 1',
            'harga_pergram' => 1000,
            'kategori_id' => $this->wasteCategory->id,
        ]);
        
        WasteType::create([
            'jenis_name' => 'Test Type 2',
            'deskripsi' => 'Test Description 2',
            'harga_pergram' => 2000,
            'kategori_id' => $this->wasteCategory->id,
        ]);
        
        // Make the request
        $response = $this->getJson('/api/v1/waste-types');
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'jenis_name',
                        'deskripsi',
                        'harga_pergram',
                        'kategori_id',
                        'created_at',
                        'updated_at',
                    ]
                ],
            ]);
    }
    
    /**
     * Test creation of a waste type.
     *
     * @return void
     */
    public function test_admin_can_create_waste_type()
    {
        // Create admin user
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        
        // Authenticate as admin
        Sanctum::actingAs($admin, ['*']);
        
        // Prepare data
        $data = [
            'jenis_name' => 'New Waste Type',
            'deskripsi' => 'New Description',
            'harga_pergram' => 1500,
            'kategori_id' => $this->wasteCategory->id,
        ];
        
        // Make the request
        $response = $this->postJson('/api/v1/waste-types', $data);
        
        // Assert the response
        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'jenis_name',
                    'deskripsi',
                    'harga_pergram',
                    'kategori_id',
                    'created_at',
                    'updated_at',
                ],
            ]);
        
        // Check database
        $this->assertDatabaseHas('waste_types', [
            'jenis_name' => 'New Waste Type',
            'harga_pergram' => 1500,
        ]);
    }
    
    /**
     * Test non-admin cannot create waste type.
     *
     * @return void
     */
    public function test_non_admin_cannot_create_waste_type()
    {
        // Create regular user
        $user = User::factory()->create([
            'role' => 'user',
        ]);
        
        // Authenticate as regular user
        Sanctum::actingAs($user, ['*']);
        
        // Prepare data
        $data = [
            'jenis_name' => 'New Waste Type',
            'deskripsi' => 'New Description',
            'harga_pergram' => 1500,
            'kategori_id' => $this->wasteCategory->id,
        ];
        
        // Make the request
        $response = $this->postJson('/api/v1/waste-types', $data);
        
        // Assert the response (forbidden)
        $response->assertStatus(403);
    }
    
    /**
     * Test update of a waste type.
     *
     * @return void
     */
    public function test_admin_can_update_waste_type()
    {
        // Create a waste type
        $wasteType = WasteType::create([
            'jenis_name' => 'Test Type',
            'deskripsi' => 'Test Description',
            'harga_pergram' => 1000,
            'kategori_id' => $this->wasteCategory->id,
        ]);
        
        // Create admin user
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        
        // Authenticate as admin
        Sanctum::actingAs($admin, ['*']);
        
        // Prepare update data
        $data = [
            'jenis_name' => 'Updated Type',
            'deskripsi' => 'Updated Description',
            'harga_pergram' => 2000,
        ];
        
        // Make the request
        $response = $this->putJson("/api/v1/waste-types/{$wasteType->id}", $data);
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'jenis_name',
                    'deskripsi',
                    'harga_pergram',
                    'kategori_id',
                    'created_at',
                    'updated_at',
                ],
            ]);
        
        // Check database
        $this->assertDatabaseHas('waste_types', [
            'id' => $wasteType->id,
            'jenis_name' => 'Updated Type',
            'harga_pergram' => 2000,
        ]);
    }
    
    /**
     * Test deletion of a waste type.
     *
     * @return void
     */
    public function test_admin_can_delete_waste_type()
    {
        // Create a waste type
        $wasteType = WasteType::create([
            'jenis_name' => 'Test Type',
            'deskripsi' => 'Test Description',
            'harga_pergram' => 1000,
            'kategori_id' => $this->wasteCategory->id,
        ]);
        
        // Create admin user
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        
        // Authenticate as admin
        Sanctum::actingAs($admin, ['*']);
        
        // Make the request
        $response = $this->deleteJson("/api/v1/waste-types/{$wasteType->id}");
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Waste type deleted',
            ]);
        
        // Check database
        $this->assertDatabaseMissing('waste_types', [
            'id' => $wasteType->id,
        ]);
    }
} 