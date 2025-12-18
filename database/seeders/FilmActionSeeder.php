<?php

namespace Database\Seeders;

use App\Models\FilmAction;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FilmActionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first user (or create one if none exists)
        $user = User::first();
        
        if (!$user) {
            $this->command->warn('No users found. Please create a user first.');
            return;
        }

        // Sample Studio Ghibli film data (using real Ghibli API IDs)
        $sampleFilms = [
            [
                'film_id' => '2baf70d1-42bb-4437-b551-e5fed5a87abe',
                'film_title' => 'Castle in the Sky',
                'action_type' => 'favorite',
            ],
            [
                'film_id' => '12cfb892-aac0-4c5b-94af-821852e2d56',
                'film_title' => 'Grave of the Fireflies',
                'action_type' => 'favorite',
            ],
            [
                'film_id' => '58611129-2dbc-4a81-a72f-77ddfc1b1b49',
                'film_title' => 'My Neighbor Totoro',
                'action_type' => 'finished',
            ],
            [
                'film_id' => 'ea660b10-85c4-4ae3-8d5b-2d88e219c1b6',
                'film_title' => 'Kiki\'s Delivery Service',
                'action_type' => 'finished',
            ],
            [
                'film_id' => '4e236f34-b981-41c3-8c65-f5525603b098',
                'film_title' => 'Only Yesterday',
                'action_type' => 'plan',
            ],
            [
                'film_id' => 'ebbb6b7c-945c-41ee-aeb4-5c3746cbb4f6',
                'film_title' => 'Porco Rosso',
                'action_type' => 'plan',
            ],
            [
                'film_id' => '0440483e-ca0e-4120-8c50-4c8cd9b38d6e',
                'film_title' => 'Pom Poko',
                'action_type' => 'on_hold',
            ],
            [
                'film_id' => '45204234-adfd-45cb-a505-a8e7d6764a15',
                'film_title' => 'Whisper of the Heart',
                'action_type' => 'on_hold',
            ],
        ];

        foreach ($sampleFilms as $film) {
            FilmAction::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'film_id' => $film['film_id'],
                    'action_type' => $film['action_type'],
                ],
                [
                    'film_title' => $film['film_title'],
                ]
            );
        }

        $this->command->info('Film actions seeded successfully!');
    }
}
