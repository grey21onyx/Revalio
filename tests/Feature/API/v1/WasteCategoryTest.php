<?php

namespace Tests\Feature\API\v1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\WasteCategory;
use Laravel\Sanctum\Sanctum;

class WasteCategoryTest extends TestCase
{
    use RefreshDatabase, WithFaker;
    
    /**
     * Test retrieval of all waste categories.
     *
     * @return void
     */
    public function test_can_get_all_waste_categories()
    {
        // Create some waste categories
        WasteCategory::create([
            'nama_kategori' => 'Test Category 1',
            'deskripsi' => 'Test Description 1',
            'status' => 'AKTIF',
        ]);
        
        WasteCategory::create([
            'nama_kategori' => 'Test Category 2',
            'deskripsi' => 'Test Description 2',
            'status' => 'AKTIF',
        ]);
        
        // Public endpoint, no authentication needed
        $response = $this->getJson('/api/v1/waste-categories/public');
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'nama_kategori',
                        'deskripsi',
                    ],
                ],
                'meta',
            ]);
    }
    
    /**
     * Test retrieval of a specific waste category.
     *
     * @return void
     */
    public function test_can_get_specific_waste_category()
    {
        // Create a user with admin role
        $admin = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($admin, ['*']);
        
        // Create a waste category
        $wasteCategory = WasteCategory::create([
            'nama_kategori' => 'Test Category',
            'deskripsi' => 'Test Description',
            'status' => 'AKTIF',
        ]);
        
        // Make the request
        $response = $this->getJson("/api/v1/waste-categories/{$wasteCategory->category_id}");
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJsonFragment([
                'nama_kategori' => 'Test Category',
                'deskripsi' => 'Test Description',
            ]);
    }
    
    /**
     * Test creation of a waste category.
     *
     * @return void
     */
    public function test_admin_can_create_waste_category()
    {
        // Create a user with admin role
        $admin = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($admin, ['*']);
        
        // Data for the new waste category
        $data = [
            'nama_kategori' => 'New Test Category',
            'deskripsi' => 'New Test Description',
            'status' => 'AKTIF',
        ];
        
        // Make the request
        $response = $this->postJson('/api/v1/waste-categories', $data);
        
        // Assert the response
        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'waste_category' => [
                    'id',
                    'nama_kategori',
                    'deskripsi',
                ],
            ]);
        
        // Assert the waste category was created in the database
        $this->assertDatabaseHas('waste_categories', [
            'nama_kategori' => 'New Test Category',
            'deskripsi' => 'New Test Description',
        ]);
    }
    
    /**
     * Test non-admin users cannot create waste categories.
     *
     * @return void
     */
    public function test_non_admin_cannot_create_waste_category()
    {
        // Create a regular user
        $user = User::factory()->create(['role' => 'user']);
        Sanctum::actingAs($user, ['*']);
        
        // Data for the new waste category
        $data = [
            'nama_kategori' => 'Regular User Category',
            'deskripsi' => 'Regular User Description',
            'status' => 'AKTIF',
        ];
        
        // Make the request
        $response = $this->postJson('/api/v1/waste-categories', $data);
        
        // Assert the response (forbidden)
        $response->assertStatus(403);
    }
    
    /**
     * Test update of a waste category.
     *
     * @return void
     */
    public function test_admin_can_update_waste_category()
    {
        // Create a user with admin role
        $admin = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($admin, ['*']);
        
        // Create a waste category
        $wasteCategory = WasteCategory::create([
            'nama_kategori' => 'Original Category',
            'deskripsi' => 'Original Description',
            'status' => 'AKTIF',
        ]);
        
        // Data for the update
        $data = [
            'nama_kategori' => 'Updated Category',
            'deskripsi' => 'Updated Description',
            'status' => 'AKTIF',
        ];
        
        // Make the request with PUT method (sending the _method parameter)
        $response = $this->postJson("/api/v1/waste-categories/{$wasteCategory->category_id}?_method=PUT", $data);
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'waste_category' => [
                    'id',
                    'nama_kategori',
                    'deskripsi',
                ],
            ]);
        
        // Assert the waste category was updated in the database
        $this->assertDatabaseHas('waste_categories', [
            'category_id' => $wasteCategory->category_id,
            'nama_kategori' => 'Updated Category',
            'deskripsi' => 'Updated Description',
        ]);
    }
    
    /**
     * Test deletion of a waste category.
     *
     * @return void
     */
    public function test_admin_can_delete_waste_category()
    {
        // Create a user with admin role
        $admin = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($admin, ['*']);
        
        // Create a waste category
        $wasteCategory = WasteCategory::create([
            'nama_kategori' => 'Category to Delete',
            'deskripsi' => 'Description for Deletion',
            'status' => 'AKTIF',
        ]);
        
        // Make the request with DELETE method (sending the _method parameter)
        $response = $this->postJson("/api/v1/waste-categories/{$wasteCategory->category_id}?_method=DELETE");
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJsonFragment([
                'message' => 'Kategori sampah berhasil dihapus',
            ]);
        
        // Assert the waste category was deleted from the database
        $this->assertDatabaseMissing('waste_categories', [
            'category_id' => $wasteCategory->category_id,
            'nama_kategori' => 'Category to Delete',
        ]);
    }
} 