<?php

namespace Tests\Feature\API\v1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\WasteType;
use App\Models\WasteCategory;
use App\Models\UserWasteTracking;
use Laravel\Sanctum\Sanctum;

class UserWasteTrackingTest extends TestCase
{
    use RefreshDatabase, WithFaker;
    
    protected $user;
    protected $wasteType;
    protected $wasteCategory;
    
    /**
     * Setup the test environment.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        
        // Create user
        $this->user = User::factory()->create();
        
        // Create waste category
        $this->wasteCategory = WasteCategory::create([
            'nama_kategori' => 'Test Category',
            'deskripsi' => 'Test Description',
        ]);
        
        // Create waste type
        $this->wasteType = WasteType::create([
            'nama_sampah' => 'Test Type',
            'kategori_id' => $this->wasteCategory->id,
            'deskripsi' => 'Test Description',
        ]);
    }
    
    /**
     * Test user can record waste tracking.
     *
     * @return void
     */
    public function test_user_can_record_waste_tracking()
    {
        // Authenticate as user
        Sanctum::actingAs($this->user, ['*']);
        
        // Prepare data
        $data = [
            'waste_id' => $this->wasteType->id,
            'jumlah' => 2.5,
            'satuan' => 'kg',
            'status_pengelolaan' => 'disimpan',
            'catatan' => 'Kumpulan botol plastik dari rumah',
        ];
        
        // Make the request
        $response = $this->postJson('/api/v1/user-waste-trackings', $data);
        
        // Assert the response
        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'user_id',
                    'waste_id',
                    'jumlah',
                    'satuan',
                    'tanggal_pencatatan',
                    'status_pengelolaan',
                    'catatan',
                    'created_at',
                    'updated_at',
                ],
            ]);
        
        // Check database
        $this->assertDatabaseHas('user_waste_trackings', [
            'user_id' => $this->user->id,
            'waste_id' => $this->wasteType->id,
            'jumlah' => 2.5,
            'satuan' => 'kg',
            'status_pengelolaan' => 'disimpan',
        ]);
    }
    
    /**
     * Test user can get their waste tracking records.
     *
     * @return void
     */
    public function test_user_can_get_their_waste_tracking_records()
    {
        // Create waste tracking records for the user
        UserWasteTracking::create([
            'user_id' => $this->user->id,
            'waste_id' => $this->wasteType->id,
            'jumlah' => 1.5,
            'satuan' => 'kg',
            'status_pengelolaan' => 'disimpan',
            'catatan' => 'Test record 1',
        ]);
        
        UserWasteTracking::create([
            'user_id' => $this->user->id,
            'waste_id' => $this->wasteType->id,
            'jumlah' => 0.8,
            'satuan' => 'kg',
            'status_pengelolaan' => 'dijual',
            'catatan' => 'Test record 2',
        ]);
        
        // Authenticate as user
        Sanctum::actingAs($this->user, ['*']);
        
        // Make the request
        $response = $this->getJson('/api/v1/user-waste-trackings');
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'user_id',
                        'waste_id',
                        'jumlah',
                        'satuan',
                        'tanggal_pencatatan',
                        'status_pengelolaan',
                        'catatan',
                        'created_at',
                        'updated_at',
                    ]
                ],
            ]);
        
        // Check that the response has two records
        $response->assertJsonCount(2, 'data');
        
        // Check that records belong to the authenticated user
        $response->assertJson([
            'data' => [
                [
                    'user_id' => $this->user->id,
                ],
                [
                    'user_id' => $this->user->id,
                ]
            ]
        ]);
    }
    
    /**
     * Test user can get waste tracking summary.
     *
     * @return void
     */
    public function test_user_can_get_waste_tracking_summary()
    {
        // Create waste tracking records for the user
        UserWasteTracking::create([
            'user_id' => $this->user->id,
            'waste_id' => $this->wasteType->id,
            'jumlah' => 1.5,
            'satuan' => 'kg',
            'status_pengelolaan' => 'disimpan',
            'catatan' => 'Test record 1',
        ]);
        
        UserWasteTracking::create([
            'user_id' => $this->user->id,
            'waste_id' => $this->wasteType->id,
            'jumlah' => 0.8,
            'satuan' => 'kg',
            'status_pengelolaan' => 'dijual',
            'catatan' => 'Test record 2',
        ]);
        
        // Authenticate as user
        Sanctum::actingAs($this->user, ['*']);
        
        // Make the request
        $response = $this->getJson('/api/v1/user-waste-trackings/summary');
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJsonStructure([
                'total_records',
                'total_weight',
                'total_by_status' => [
                    'disimpan',
                    'dijual',
                    'didaur ulang'
                ],
                'total_by_type',
                'recent_records',
            ]);
        
        // Check that totals are correct
        $response->assertJson([
            'total_records' => 2,
            'total_weight' => [
                'kg' => 2.3 // 1.5 + 0.8 = 2.3
            ],
            'total_by_status' => [
                'disimpan' => 1.5,
                'dijual' => 0.8,
                'didaur ulang' => 0
            ]
        ]);
    }
    
    /**
     * Test user can update their waste tracking record.
     *
     * @return void
     */
    public function test_user_can_update_their_waste_tracking_record()
    {
        // Create a waste tracking record
        $tracking = UserWasteTracking::create([
            'user_id' => $this->user->id,
            'waste_id' => $this->wasteType->id,
            'jumlah' => 1.5,
            'satuan' => 'kg',
            'status_pengelolaan' => 'disimpan',
            'catatan' => 'Original record',
        ]);
        
        // Authenticate as user
        Sanctum::actingAs($this->user, ['*']);
        
        // Prepare update data
        $data = [
            'jumlah' => 2.0,
            'status_pengelolaan' => 'dijual',
            'catatan' => 'Updated record',
        ];
        
        // Make the request
        $response = $this->putJson("/api/v1/user-waste-trackings/{$tracking->id}", $data);
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'user_id',
                    'waste_id',
                    'jumlah',
                    'satuan',
                    'tanggal_pencatatan',
                    'status_pengelolaan',
                    'catatan',
                    'created_at',
                    'updated_at',
                ],
            ]);
        
        // Check database
        $this->assertDatabaseHas('user_waste_trackings', [
            'id' => $tracking->id,
            'jumlah' => 2.0,
            'status_pengelolaan' => 'dijual',
            'catatan' => 'Updated record',
        ]);
    }
    
    /**
     * Test user can delete their waste tracking record.
     *
     * @return void
     */
    public function test_user_can_delete_their_waste_tracking_record()
    {
        // Create a waste tracking record
        $tracking = UserWasteTracking::create([
            'user_id' => $this->user->id,
            'waste_id' => $this->wasteType->id,
            'jumlah' => 1.5,
            'satuan' => 'kg',
            'status_pengelolaan' => 'disimpan',
            'catatan' => 'Test record',
        ]);
        
        // Authenticate as user
        Sanctum::actingAs($this->user, ['*']);
        
        // Make the request
        $response = $this->deleteJson("/api/v1/user-waste-trackings/{$tracking->id}");
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Waste tracking record deleted',
            ]);
        
        // Check database
        $this->assertDatabaseMissing('user_waste_trackings', [
            'id' => $tracking->id,
        ]);
    }
    
    /**
     * Test user cannot access another user's waste tracking record.
     *
     * @return void
     */
    public function test_user_cannot_access_another_users_waste_tracking_record()
    {
        // Create another user
        $anotherUser = User::factory()->create();
        
        // Create a waste tracking record for the other user
        $tracking = UserWasteTracking::create([
            'user_id' => $anotherUser->id,
            'waste_id' => $this->wasteType->id,
            'jumlah' => 1.5,
            'satuan' => 'kg',
            'status_pengelolaan' => 'disimpan',
            'catatan' => 'Other user record',
        ]);
        
        // Authenticate as original user
        Sanctum::actingAs($this->user, ['*']);
        
        // Make the request
        $response = $this->getJson("/api/v1/user-waste-trackings/{$tracking->id}");
        
        // Assert the response (forbidden)
        $response->assertStatus(403);
    }
} 