<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Remove specific waste types that show up with zero prices
        if (Schema::hasTable('waste_types')) {
            // Find and delete waste types with specific names
            $typesToDelete = ['Botol PET', 'Kardus', 'Kaleng Aluminium'];
            
            // Check if we're using the new column name structure or old one
            $nameColumn = Schema::hasColumn('waste_types', 'name') ? 'name' : 'nama_sampah';
            
            foreach ($typesToDelete as $typeName) {
                // Find the waste type IDs
                $wasteType = DB::table('waste_types')->where($nameColumn, $typeName)->first();
                
                if ($wasteType) {
                    // Get waste type ID
                    $wasteIdColumn = Schema::hasColumn('waste_types', 'id') ? 'id' : 'waste_id';
                    $wasteTypeId = $wasteType->$wasteIdColumn;
                    
                    // Delete related records in waste_values, waste_values_new and user_waste_trackings
                    if (Schema::hasTable('waste_values')) {
                        DB::table('waste_values')->where('waste_id', $wasteTypeId)->delete();
                    }
                    
                    if (Schema::hasTable('waste_values_new')) {
                        DB::table('waste_values_new')->where('waste_type_id', $wasteTypeId)->delete();
                    }
                    
                    if (Schema::hasTable('waste_buyer_types')) {
                        DB::table('waste_buyer_types')->where('waste_id', $wasteTypeId)->delete();
                    }
                    
                    if (Schema::hasTable('user_waste_trackings')) {
                        DB::table('user_waste_trackings')->where('waste_type_id', $wasteTypeId)->delete();
                    }
                    
                    if (Schema::hasTable('user_waste_tracking')) {
                        DB::table('user_waste_tracking')->where('waste_id', $wasteTypeId)->delete();
                    }
                    
                    // Delete the waste type itself
                    DB::table('waste_types')->where($wasteIdColumn, $wasteTypeId)->delete();
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to restore data in down method
        // If you need to add these waste types back, use seeders
    }
}; 