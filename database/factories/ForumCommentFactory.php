<?php

namespace Database\Factories;

use App\Models\ForumThread;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ForumComment>
 */
class ForumCommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'thread_id' => ForumThread::inRandomOrder()->first()->thread_id ?? 1,
            'user_id' => User::inRandomOrder()->first()->user_id ?? 1,
            'konten' => $this->faker->paragraphs($this->faker->numberBetween(1, 3), true),
            'tanggal_komentar' => $this->faker->dateTimeBetween('-3 months', 'now'),
            'parent_komentar_id' => null,
        ];
    }
    
    /**
     * Menentukan komentar sebagai balasan/reply
     */
    public function asReply(): static
    {
        return $this->state(function () {
            // Ambil komentar yang sudah ada untuk dijadikan parent
            $parentComment = \App\Models\ForumComment::inRandomOrder()->first();
            
            return [
                'thread_id' => $parentComment ? $parentComment->thread_id : 1, // Pastikan dalam thread yang sama
                'parent_komentar_id' => $parentComment ? $parentComment->komentar_id : null,
            ];
        });
    }
} 