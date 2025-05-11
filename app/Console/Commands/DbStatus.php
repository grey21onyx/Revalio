<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DbStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Menampilkan jumlah data pada tabel-tabel utama di database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $tables = [
            'users',
            'waste_categories',
            'waste_types',
            'waste_values',
            'tutorials',
            'articles',
            'waste_buyers',
            'waste_buyer_types',
            'user_waste_tracking',
            'forum_threads',
            'forum_comments',
            'business_opportunities',
            'deleted_records',
        ];

        $this->info('Status Database Revalio:');
        $this->info('=========================');

        $headers = ['Tabel', 'Jumlah Data'];
        $data = [];

        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                $count = DB::table($table)->count();
                $data[] = [$table, $count];
            } else {
                $data[] = [$table, 'Tabel tidak ditemukan'];
            }
        }

        $this->table($headers, $data);
        
        return Command::SUCCESS;
    }
}
