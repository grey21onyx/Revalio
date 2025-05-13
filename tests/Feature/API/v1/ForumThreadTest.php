<?php

namespace Tests\Feature\API\v1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\ForumThread;
use App\Models\ForumComment;
use Laravel\Sanctum\Sanctum;

class ForumThreadTest extends TestCase
{
    use RefreshDatabase, WithFaker;
    
    protected $user;
    protected $moderator;
    
    /**
     * Setup the test environment.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a regular user
        $this->user = User::factory()->create([
            'role' => 'USER',
        ]);
        
        // Create a moderator user
        $this->moderator = User::factory()->create([
            'role' => 'MODERATOR',
        ]);
    }
    
    /**
     * Test retrieval of all forum threads.
     *
     * @return void
     */
    public function test_can_get_all_forum_threads()
    {
        // Create some forum threads
        ForumThread::create([
            'user_id' => $this->user->id,
            'judul' => 'Test Thread 1',
            'konten' => 'Test content for thread 1',
            'tanggal_posting' => now(),
            'status' => 'AKTIF',
            'tags' => 'tag1,tag2',
        ]);
        
        ForumThread::create([
            'user_id' => $this->user->id,
            'judul' => 'Test Thread 2',
            'konten' => 'Test content for thread 2',
            'tanggal_posting' => now(),
            'status' => 'AKTIF',
            'tags' => 'tag3,tag4',
        ]);
        
        // Create an inactive thread that shouldn't show up in public list
        ForumThread::create([
            'user_id' => $this->user->id,
            'judul' => 'Inactive Thread',
            'konten' => 'This thread is inactive',
            'tanggal_posting' => now(),
            'status' => 'NONAKTIF',
            'tags' => 'tag5',
        ]);
        
        // Make the request
        $response = $this->getJson('/api/v1/forum-threads');
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'user_id',
                        'judul',
                        'konten',
                        'tanggal_posting',
                        'status',
                        'tags',
                        'created_at',
                        'updated_at',
                    ]
                ],
                'links',
                'meta',
            ])
            // Only active threads should be returned (2 of 3)
            ->assertJsonCount(2, 'data');
    }
    
    /**
     * Test retrieval of a specific forum thread.
     *
     * @return void
     */
    public function test_can_get_specific_forum_thread()
    {
        // Create a forum thread
        $thread = ForumThread::create([
            'user_id' => $this->user->id,
            'judul' => 'Test Thread',
            'konten' => 'Test content for thread',
            'tanggal_posting' => now(),
            'status' => 'AKTIF',
            'tags' => 'tag1,tag2',
        ]);
        
        // Make the request
        $response = $this->getJson("/api/v1/forum-threads/{$thread->id}");
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'user_id',
                    'judul',
                    'konten',
                    'tanggal_posting',
                    'status',
                    'tags',
                    'created_at',
                    'updated_at',
                    'user' => [
                        'id',
                        'nama_lengkap',
                    ],
                    'comments_count',
                ],
            ])
            ->assertJson([
                'data' => [
                    'judul' => 'Test Thread',
                    'user_id' => $this->user->id,
                ]
            ]);
    }
    
    /**
     * Test authenticated user can create a forum thread.
     *
     * @return void
     */
    public function test_authenticated_user_can_create_forum_thread()
    {
        // Authenticate as user
        Sanctum::actingAs($this->user, ['*']);
        
        // Prepare data
        $data = [
            'judul' => 'New Forum Thread',
            'konten' => 'Content for the new forum thread',
            'tags' => 'plastic,recycling,question',
        ];
        
        // Make the request
        $response = $this->postJson('/api/v1/forum-threads', $data);
        
        // Assert the response
        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'user_id',
                    'judul',
                    'konten',
                    'tanggal_posting',
                    'status',
                    'tags',
                    'created_at',
                    'updated_at',
                ],
                'message',
            ])
            ->assertJson([
                'data' => [
                    'judul' => 'New Forum Thread',
                    'user_id' => $this->user->id,
                    'status' => 'AKTIF',
                ],
                'message' => 'Forum thread created successfully',
            ]);
        
        // Check database
        $this->assertDatabaseHas('forum_threads', [
            'judul' => 'New Forum Thread',
            'user_id' => $this->user->id,
            'status' => 'AKTIF',
        ]);
    }
    
    /**
     * Test unauthenticated user cannot create a forum thread.
     *
     * @return void
     */
    public function test_unauthenticated_user_cannot_create_forum_thread()
    {
        // Prepare data
        $data = [
            'judul' => 'New Forum Thread',
            'konten' => 'Content for the new forum thread',
            'tags' => 'plastic,recycling,question',
        ];
        
        // Make the request without authentication
        $response = $this->postJson('/api/v1/forum-threads', $data);
        
        // Assert the response (unauthorized)
        $response->assertStatus(401);
    }
    
    /**
     * Test user can update their own forum thread.
     *
     * @return void
     */
    public function test_user_can_update_own_forum_thread()
    {
        // Create a forum thread
        $thread = ForumThread::create([
            'user_id' => $this->user->id,
            'judul' => 'Original Title',
            'konten' => 'Original content',
            'tanggal_posting' => now(),
            'status' => 'AKTIF',
            'tags' => 'original,tags',
        ]);
        
        // Authenticate as the thread creator
        Sanctum::actingAs($this->user, ['*']);
        
        // Prepare update data
        $data = [
            'judul' => 'Updated Title',
            'konten' => 'Updated content',
            'tags' => 'updated,tags',
        ];
        
        // Make the request
        $response = $this->putJson("/api/v1/forum-threads/{$thread->id}", $data);
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'judul',
                    'konten',
                    'tags',
                ],
                'message',
            ])
            ->assertJson([
                'data' => [
                    'judul' => 'Updated Title',
                    'konten' => 'Updated content',
                    'tags' => 'updated,tags',
                ],
                'message' => 'Forum thread updated successfully',
            ]);
        
        // Check database
        $this->assertDatabaseHas('forum_threads', [
            'id' => $thread->id,
            'judul' => 'Updated Title',
            'konten' => 'Updated content',
            'tags' => 'updated,tags',
        ]);
    }
    
    /**
     * Test user cannot update another user's forum thread.
     *
     * @return void
     */
    public function test_user_cannot_update_another_users_forum_thread()
    {
        // Create another user
        $anotherUser = User::factory()->create();
        
        // Create a forum thread owned by another user
        $thread = ForumThread::create([
            'user_id' => $anotherUser->id,
            'judul' => 'Another User Thread',
            'konten' => 'Content by another user',
            'tanggal_posting' => now(),
            'status' => 'AKTIF',
        ]);
        
        // Authenticate as user (not the thread creator)
        Sanctum::actingAs($this->user, ['*']);
        
        // Prepare update data
        $data = [
            'judul' => 'Trying to Update',
            'konten' => 'Trying to update content',
        ];
        
        // Make the request
        $response = $this->putJson("/api/v1/forum-threads/{$thread->id}", $data);
        
        // Assert the response (forbidden)
        $response->assertStatus(403);
        
        // Check database (thread should remain unchanged)
        $this->assertDatabaseHas('forum_threads', [
            'id' => $thread->id,
            'judul' => 'Another User Thread',
            'konten' => 'Content by another user',
        ]);
    }
    
    /**
     * Test moderator can update any forum thread.
     *
     * @return void
     */
    public function test_moderator_can_update_any_forum_thread()
    {
        // Create a forum thread owned by regular user
        $thread = ForumThread::create([
            'user_id' => $this->user->id,
            'judul' => 'User Thread',
            'konten' => 'Content by user',
            'tanggal_posting' => now(),
            'status' => 'AKTIF',
        ]);
        
        // Authenticate as moderator
        Sanctum::actingAs($this->moderator, ['*']);
        
        // Prepare update data
        $data = [
            'judul' => 'Moderator Updated',
            'konten' => 'Updated by moderator',
            'status' => 'AKTIF', // Can also change status
        ];
        
        // Make the request
        $response = $this->putJson("/api/v1/forum-threads/{$thread->id}", $data);
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'judul' => 'Moderator Updated',
                    'konten' => 'Updated by moderator',
                ],
            ]);
        
        // Check database
        $this->assertDatabaseHas('forum_threads', [
            'id' => $thread->id,
            'judul' => 'Moderator Updated',
            'konten' => 'Updated by moderator',
        ]);
    }
    
    /**
     * Test user can delete their own forum thread.
     *
     * @return void
     */
    public function test_user_can_delete_own_forum_thread()
    {
        // Create a forum thread
        $thread = ForumThread::create([
            'user_id' => $this->user->id,
            'judul' => 'Thread to Delete',
            'konten' => 'Content to delete',
            'tanggal_posting' => now(),
            'status' => 'AKTIF',
        ]);
        
        // Authenticate as the thread creator
        Sanctum::actingAs($this->user, ['*']);
        
        // Make the request
        $response = $this->deleteJson("/api/v1/forum-threads/{$thread->id}");
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Forum thread deleted successfully',
            ]);
        
        // Check database
        $this->assertDatabaseMissing('forum_threads', [
            'id' => $thread->id,
        ]);
    }
    
    /**
     * Test search functionality for forum threads.
     *
     * @return void
     */
    public function test_can_search_forum_threads()
    {
        // Create threads with different content
        ForumThread::create([
            'user_id' => $this->user->id,
            'judul' => 'Recycling Plastic Bottles',
            'konten' => 'How to properly recycle plastic bottles',
            'tanggal_posting' => now(),
            'status' => 'AKTIF',
            'tags' => 'plastic,recycling,bottles',
        ]);
        
        ForumThread::create([
            'user_id' => $this->user->id,
            'judul' => 'Metal Collection Tips',
            'konten' => 'Tips for collecting metal scrap',
            'tanggal_posting' => now(),
            'status' => 'AKTIF',
            'tags' => 'metal,collection,scrap',
        ]);
        
        // Search for plastic related threads
        $response = $this->getJson('/api/v1/forum-threads/search?q=plastic');
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'judul',
                        'konten',
                    ]
                ],
            ])
            // Should only find the plastic thread
            ->assertJsonCount(1, 'data')
            ->assertJson([
                'data' => [
                    [
                        'judul' => 'Recycling Plastic Bottles',
                    ]
                ]
            ]);
        
        // Search for metal related threads
        $metalResponse = $this->getJson('/api/v1/forum-threads/search?q=metal');
        
        // Assert the response
        $metalResponse->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJson([
                'data' => [
                    [
                        'judul' => 'Metal Collection Tips',
                    ]
                ]
            ]);
    }
    
    /**
     * Test retrieving threads for a specific tag.
     *
     * @return void
     */
    public function test_can_get_threads_by_tag()
    {
        // Create threads with different tags
        ForumThread::create([
            'user_id' => $this->user->id,
            'judul' => 'Thread with Tag 1',
            'konten' => 'Content with tag1',
            'tanggal_posting' => now(),
            'status' => 'AKTIF',
            'tags' => 'tag1,common',
        ]);
        
        ForumThread::create([
            'user_id' => $this->user->id,
            'judul' => 'Thread with Tag 2',
            'konten' => 'Content with tag2',
            'tanggal_posting' => now(),
            'status' => 'AKTIF',
            'tags' => 'tag2,common',
        ]);
        
        // Get threads with tag1
        $response = $this->getJson('/api/v1/forum-threads/tag/tag1');
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJson([
                'data' => [
                    [
                        'judul' => 'Thread with Tag 1',
                    ]
                ]
            ]);
        
        // Get threads with common tag (should find both)
        $commonResponse = $this->getJson('/api/v1/forum-threads/tag/common');
        
        // Assert the response
        $commonResponse->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }
} 