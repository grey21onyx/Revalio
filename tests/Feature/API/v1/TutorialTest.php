<?php

namespace Tests\Feature\API\v1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Tutorial;
use App\Models\WasteType;
use App\Models\WasteCategory;
use Laravel\Sanctum\Sanctum;

class TutorialTest extends TestCase
{
    use RefreshDatabase, WithFaker;
    
    protected $wasteCategory;
    protected $wasteType;
    
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
            'nama_kategori' => 'Test Category',
            'deskripsi' => 'Test Description',
        ]);
        
        // Create a waste type for testing
        $this->wasteType = WasteType::create([
            'nama_sampah' => 'Test Type',
            'kategori_id' => $this->wasteCategory->id,
            'deskripsi' => 'Test Description',
        ]);
    }
    
    /**
     * Test retrieval of all tutorials.
     *
     * @return void
     */
    public function test_can_get_all_tutorials()
    {
        // Create some tutorials
        Tutorial::create([
            'waste_id' => $this->wasteType->id,
            'judul' => 'Test Tutorial 1',
            'deskripsi' => 'Test Description 1',
            'jenis_tutorial' => 'daur ulang',
            'konten' => 'Test Content 1',
            'tingkat_kesulitan' => 'EASY',
            'estimasi_waktu' => 30
        ]);
        
        Tutorial::create([
            'waste_id' => $this->wasteType->id,
            'judul' => 'Test Tutorial 2',
            'deskripsi' => 'Test Description 2',
            'jenis_tutorial' => 'reuse',
            'konten' => 'Test Content 2',
            'tingkat_kesulitan' => 'MODERATE',
            'estimasi_waktu' => 60
        ]);
        
        // Make the request
        $response = $this->getJson('/api/v1/tutorials/public');
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'waste_id',
                        'judul',
                        'deskripsi',
                        'jenis_tutorial',
                        'konten',
                        'tingkat_kesulitan',
                        'estimasi_waktu',
                        'created_at',
                        'updated_at',
                    ]
                ],
            ]);
    }
    
    /**
     * Test creation of a tutorial.
     *
     * @return void
     */
    public function test_admin_can_create_tutorial()
    {
        // Create admin user
        $admin = User::factory()->create([
            'role' => 'ADMIN',
        ]);
        
        // Authenticate as admin
        Sanctum::actingAs($admin, ['*']);
        
        // Prepare data
        $data = [
            'waste_id' => $this->wasteType->id,
            'judul' => 'New Tutorial',
            'deskripsi' => 'New Description',
            'jenis_tutorial' => 'daur ulang',
            'konten' => 'New Content with detailed steps',
            'media' => 'tutorial-video.mp4',
            'tingkat_kesulitan' => 'EASY',
            'estimasi_waktu' => 45
        ];
        
        // Make the request
        $response = $this->postJson('/api/v1/tutorials', $data);
        
        // Assert the response
        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'waste_id',
                    'judul',
                    'deskripsi',
                    'jenis_tutorial',
                    'konten',
                    'media',
                    'tingkat_kesulitan',
                    'estimasi_waktu',
                    'created_at',
                    'updated_at',
                ],
            ]);
        
        // Check database
        $this->assertDatabaseHas('tutorials', [
            'judul' => 'New Tutorial',
            'waste_id' => $this->wasteType->id,
            'jenis_tutorial' => 'daur ulang',
        ]);
    }
    
    /**
     * Test non-admin cannot create tutorial.
     *
     * @return void
     */
    public function test_non_admin_cannot_create_tutorial()
    {
        // Create regular user
        $user = User::factory()->create([
            'role' => 'USER',
        ]);
        
        // Authenticate as regular user
        Sanctum::actingAs($user, ['*']);
        
        // Prepare data
        $data = [
            'waste_id' => $this->wasteType->id,
            'judul' => 'New Tutorial',
            'deskripsi' => 'New Description',
            'jenis_tutorial' => 'daur ulang',
            'konten' => 'New Content with detailed steps',
            'tingkat_kesulitan' => 'EASY',
            'estimasi_waktu' => 45
        ];
        
        // Make the request
        $response = $this->postJson('/api/v1/tutorials', $data);
        
        // Assert the response (forbidden)
        $response->assertStatus(403);
    }
    
    /**
     * Test get tutorials by waste type.
     *
     * @return void
     */
    public function test_can_get_tutorials_by_waste_type()
    {
        // Create a tutorial
        Tutorial::create([
            'waste_id' => $this->wasteType->id,
            'judul' => 'Test Tutorial',
            'deskripsi' => 'Test Description',
            'jenis_tutorial' => 'daur ulang',
            'konten' => 'Test Content',
            'tingkat_kesulitan' => 'EASY',
            'estimasi_waktu' => 30
        ]);
        
        // Create a user
        $user = User::factory()->create();
        
        // Authenticate as user
        Sanctum::actingAs($user, ['*']);
        
        // Make the request
        $response = $this->getJson("/api/v1/tutorials/waste-type/{$this->wasteType->id}");
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'waste_id',
                        'judul',
                        'deskripsi',
                        'jenis_tutorial',
                        'konten',
                        'tingkat_kesulitan',
                        'estimasi_waktu',
                        'created_at',
                        'updated_at',
                    ]
                ],
            ]);
        
        // Check that the tutorial is for the correct waste type
        $response->assertJson([
            'data' => [
                [
                    'waste_id' => $this->wasteType->id,
                ]
            ]
        ]);
    }
} 