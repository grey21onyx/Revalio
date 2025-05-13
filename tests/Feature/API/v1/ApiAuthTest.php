<?php

namespace Tests\Feature\API\v1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

class ApiAuthTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /**
     * Test user registration.
     *
     * @return void
     */
    public function test_user_can_register()
    {
        $userData = [
            'nama_lengkap' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'no_telepon' => '08123456789',
        ];

        $response = $this->postJson('/api/v1/register', $userData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'user',
                'access_token',
                'token_type',
            ]);
    }

    /**
     * Test user login.
     *
     * @return void
     */
    public function test_user_can_login()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'user',
                'access_token',
                'token_type',
            ]);
    }

    /**
     * Test user logout.
     *
     * @return void
     */
    public function test_user_can_logout()
    {
        $user = User::factory()->create();
        
        // Gunakan Sanctum::actingAs untuk testing dengan token yang valid
        Sanctum::actingAs($user, ['*']);

        $response = $this->postJson('/api/v1/logout');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Berhasil logout',
            ]);
    }

    /**
     * Test user cannot access protected route without authentication.
     *
     * @return void
     */
    public function test_user_cannot_access_protected_route_without_authentication()
    {
        $response = $this->getJson('/api/v1/user');

        $response->assertStatus(401);
    }

    /**
     * Test user can access protected route with authentication.
     *
     * @return void
     */
    public function test_user_can_access_protected_route_with_authentication()
    {
        $user = User::factory()->create();
        
        Sanctum::actingAs($user, ['*']);

        $response = $this->getJson('/api/v1/user');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'user',
            ]);
    }
} 