<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Expense;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        $expense = [
            ['name' => 'Groceries', 'amount' => 150.75, 'date' => '2024-06-01'],
            ['name' => 'Utilities', 'amount' => 80.50, 'date' => '2024-06-03'],
            ['name' => 'Transportation', 'amount' => 60.00, 'date' => '2024-06-05'],
        ];
        Expense::factory()->createMany($expense);
    }
}
