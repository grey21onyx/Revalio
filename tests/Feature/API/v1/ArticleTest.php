<?php

namespace Tests\Feature\API\v1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Article;
use Laravel\Sanctum\Sanctum;

class ArticleTest extends TestCase
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
            'role' => 'ADMIN',
        ]);
        
        // Create regular user
        $this->user = User::factory()->create([
            'role' => 'USER',
        ]);
    }
    
    /**
     * Test retrieval of all published articles.
     *
     * @return void
     */
    public function test_can_get_all_published_articles()
    {
        // Create some articles
        Article::create([
            'judul' => 'Test Article 1',
            'deskripsi_singkat' => 'Short description 1',
            'konten' => 'Content for article 1',
            'kategori' => 'WASTE_CLASSIFICATION',
            'penulis_id' => $this->admin->id,
            'tanggal_publikasi' => now(),
            'status' => 'PUBLISHED',
        ]);
        
        Article::create([
            'judul' => 'Test Article 2',
            'deskripsi_singkat' => 'Short description 2',
            'konten' => 'Content for article 2',
            'kategori' => 'MONETIZATION_TIP',
            'penulis_id' => $this->admin->id,
            'tanggal_publikasi' => now(),
            'status' => 'PUBLISHED',
        ]);
        
        // Create a draft article that shouldn't be in public response
        Article::create([
            'judul' => 'Draft Article',
            'deskripsi_singkat' => 'Draft description',
            'konten' => 'Draft content',
            'kategori' => 'WASTE_CLASSIFICATION',
            'penulis_id' => $this->admin->id,
            'tanggal_publikasi' => now(),
            'status' => 'DRAFT',
        ]);
        
        // Make the request
        $response = $this->getJson('/api/v1/articles/public');
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'judul',
                        'deskripsi_singkat',
                        'kategori',
                        'penulis_id',
                        'tanggal_publikasi',
                        'created_at',
                        'updated_at',
                    ]
                ],
                'links',
                'meta',
            ])
            // Only published articles should be returned (2 of 3)
            ->assertJsonCount(2, 'data');
    }
    
    /**
     * Test retrieval of a specific article.
     *
     * @return void
     */
    public function test_can_get_specific_article()
    {
        // Create an article
        $article = Article::create([
            'judul' => 'Test Article',
            'deskripsi_singkat' => 'Short description',
            'konten' => 'Detailed content for the article',
            'kategori' => 'WASTE_CLASSIFICATION',
            'penulis_id' => $this->admin->id,
            'tanggal_publikasi' => now(),
            'status' => 'PUBLISHED',
            'tags' => 'tag1,tag2,tag3',
        ]);
        
        // Make the request
        $response = $this->getJson("/api/v1/articles/{$article->id}");
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'judul',
                    'deskripsi_singkat',
                    'konten',
                    'kategori',
                    'penulis_id',
                    'tanggal_publikasi',
                    'status',
                    'tags',
                    'created_at',
                    'updated_at',
                ],
            ])
            ->assertJson([
                'data' => [
                    'judul' => 'Test Article',
                    'kategori' => 'WASTE_CLASSIFICATION',
                ]
            ]);
    }
    
    /**
     * Test search functionality for articles.
     *
     * @return void
     */
    public function test_can_search_articles()
    {
        // Create some articles with different content
        Article::create([
            'judul' => 'Plastic Recycling Tips',
            'deskripsi_singkat' => 'Learn how to recycle plastic properly',
            'konten' => 'Detailed guide on plastic recycling',
            'kategori' => 'WASTE_CLASSIFICATION',
            'penulis_id' => $this->admin->id,
            'tanggal_publikasi' => now(),
            'status' => 'PUBLISHED',
            'tags' => 'plastic,recycling,guide',
        ]);
        
        Article::create([
            'judul' => 'Metal Scrap Value',
            'deskripsi_singkat' => 'Understanding metal scrap market',
            'konten' => 'Guide to selling metal scrap for money',
            'kategori' => 'MONETIZATION_TIP',
            'penulis_id' => $this->admin->id,
            'tanggal_publikasi' => now(),
            'status' => 'PUBLISHED',
            'tags' => 'metal,market,monetization',
        ]);
        
        // Search for plastic related articles
        $response = $this->getJson('/api/v1/articles/search?q=plastic');
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'judul',
                        'deskripsi_singkat',
                        'kategori',
                    ]
                ],
            ])
            // Should only find the plastic article
            ->assertJsonCount(1, 'data')
            ->assertJson([
                'data' => [
                    [
                        'judul' => 'Plastic Recycling Tips',
                    ]
                ]
            ]);
            
        // Search for metal related articles
        $metalResponse = $this->getJson('/api/v1/articles/search?q=metal');
        
        // Assert the response
        $metalResponse->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJson([
                'data' => [
                    [
                        'judul' => 'Metal Scrap Value',
                    ]
                ]
            ]);
    }
    
    /**
     * Test filter articles by category.
     *
     * @return void
     */
    public function test_can_filter_articles_by_category()
    {
        // Create articles in different categories
        Article::create([
            'judul' => 'Article in Category 1',
            'deskripsi_singkat' => 'Description 1',
            'konten' => 'Content 1',
            'kategori' => 'WASTE_CLASSIFICATION',
            'penulis_id' => $this->admin->id,
            'tanggal_publikasi' => now(),
            'status' => 'PUBLISHED',
        ]);
        
        Article::create([
            'judul' => 'Article in Category 2',
            'deskripsi_singkat' => 'Description 2',
            'konten' => 'Content 2',
            'kategori' => 'MONETIZATION_TIP',
            'penulis_id' => $this->admin->id,
            'tanggal_publikasi' => now(),
            'status' => 'PUBLISHED',
        ]);
        
        // Filter by WASTE_CLASSIFICATION category
        $response = $this->getJson('/api/v1/articles/public?kategori=WASTE_CLASSIFICATION');
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJson([
                'data' => [
                    [
                        'kategori' => 'WASTE_CLASSIFICATION',
                    ]
                ]
            ]);
    }
    
    /**
     * Test admin can create an article.
     *
     * @return void
     */
    public function test_admin_can_create_article()
    {
        // Authenticate as admin
        Sanctum::actingAs($this->admin, ['*']);
        
        // Prepare data
        $data = [
            'judul' => 'New Test Article',
            'deskripsi_singkat' => 'New short description',
            'konten' => 'New detailed content',
            'kategori' => 'ENVIRONMENTAL_IMPACT',
            'tanggal_publikasi' => now()->format('Y-m-d H:i:s'),
            'status' => 'PUBLISHED',
            'tags' => 'tag1,tag2,tag3',
        ];
        
        // Make the request
        $response = $this->postJson('/api/v1/articles', $data);
        
        // Assert the response
        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'judul',
                    'deskripsi_singkat',
                    'konten',
                    'kategori',
                    'penulis_id',
                    'tanggal_publikasi',
                    'status',
                    'tags',
                    'created_at',
                    'updated_at',
                ],
            ])
            ->assertJson([
                'data' => [
                    'judul' => 'New Test Article',
                    'kategori' => 'ENVIRONMENTAL_IMPACT',
                    'penulis_id' => $this->admin->id,
                ]
            ]);
        
        // Check database
        $this->assertDatabaseHas('articles', [
            'judul' => 'New Test Article',
            'kategori' => 'ENVIRONMENTAL_IMPACT',
            'penulis_id' => $this->admin->id,
        ]);
    }
    
    /**
     * Test non-admin cannot create article.
     *
     * @return void
     */
    public function test_non_admin_cannot_create_article()
    {
        // Authenticate as regular user
        Sanctum::actingAs($this->user, ['*']);
        
        // Prepare data
        $data = [
            'judul' => 'New Test Article',
            'deskripsi_singkat' => 'New short description',
            'konten' => 'New detailed content',
            'kategori' => 'ENVIRONMENTAL_IMPACT',
            'tanggal_publikasi' => now()->format('Y-m-d H:i:s'),
            'status' => 'PUBLISHED',
        ];
        
        // Make the request
        $response = $this->postJson('/api/v1/articles', $data);
        
        // Assert the response (forbidden)
        $response->assertStatus(403);
    }
    
    /**
     * Test admin can update article.
     *
     * @return void
     */
    public function test_admin_can_update_article()
    {
        // Create an article
        $article = Article::create([
            'judul' => 'Original Title',
            'deskripsi_singkat' => 'Original description',
            'konten' => 'Original content',
            'kategori' => 'WASTE_CLASSIFICATION',
            'penulis_id' => $this->admin->id,
            'tanggal_publikasi' => now(),
            'status' => 'PUBLISHED',
        ]);
        
        // Authenticate as admin
        Sanctum::actingAs($this->admin, ['*']);
        
        // Prepare update data
        $data = [
            'judul' => 'Updated Title',
            'deskripsi_singkat' => 'Updated description',
            'konten' => 'Updated content',
            'kategori' => 'REUSE_IDEA',
        ];
        
        // Make the request
        $response = $this->putJson("/api/v1/articles/{$article->id}", $data);
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'judul',
                    'deskripsi_singkat',
                    'konten',
                    'kategori',
                ],
            ])
            ->assertJson([
                'data' => [
                    'judul' => 'Updated Title',
                    'kategori' => 'REUSE_IDEA',
                ]
            ]);
        
        // Check database
        $this->assertDatabaseHas('articles', [
            'id' => $article->id,
            'judul' => 'Updated Title',
            'kategori' => 'REUSE_IDEA',
        ]);
    }
    
    /**
     * Test admin can delete article.
     *
     * @return void
     */
    public function test_admin_can_delete_article()
    {
        // Create an article
        $article = Article::create([
            'judul' => 'Article to Delete',
            'deskripsi_singkat' => 'This will be deleted',
            'konten' => 'Content to delete',
            'kategori' => 'WASTE_CLASSIFICATION',
            'penulis_id' => $this->admin->id,
            'tanggal_publikasi' => now(),
            'status' => 'PUBLISHED',
        ]);
        
        // Authenticate as admin
        Sanctum::actingAs($this->admin, ['*']);
        
        // Make the request
        $response = $this->deleteJson("/api/v1/articles/{$article->id}");
        
        // Assert the response
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Article deleted successfully',
            ]);
        
        // Check database
        $this->assertDatabaseMissing('articles', [
            'id' => $article->id,
        ]);
    }
} 