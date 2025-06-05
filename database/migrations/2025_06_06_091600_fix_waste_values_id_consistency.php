<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Log::info('Running fix_waste_values_id_consistency migration');
        
        // STEP 1: Fix any inconsistencies in waste_types table
        if (Schema::hasTable('waste_types')) {
            Log::info('Fixing waste_types table inconsistencies');
            
            // Make sure all waste_types have correct primary key setup
            DB::statement('SET FOREIGN_KEY_CHECKS=0');
            
            // Check if waste_id column exists before trying to update it
            if (Schema::hasColumn('waste_types', 'waste_id') && Schema::hasColumn('waste_types', 'id')) {
                // Set waste_id to match id if they're different
                try {
                    DB::statement('UPDATE waste_types SET waste_id = id WHERE waste_id IS NULL OR waste_id = 0');
                    Log::info('Updated waste_id values from id column');
                } catch (\Exception $e) {
                    Log::error('Failed to update waste_id: ' . $e->getMessage());
                }
            } else if (!Schema::hasColumn('waste_types', 'waste_id')) {
                // Create waste_id if missing and set to id value
                try {
                    Schema::table('waste_types', function (Blueprint $table) {
                        $table->bigInteger('waste_id')->after('id')->nullable();
                    });
                    Log::info('Added waste_id column to waste_types table');
                    
                    // Now fill it with id values if id column exists
                    if (Schema::hasColumn('waste_types', 'id')) {
                        DB::statement('UPDATE waste_types SET waste_id = id');
                        Log::info('Populated waste_id column with id values');
                    }
                } catch (\Exception $e) {
                    Log::error('Failed to add waste_id column: ' . $e->getMessage());
                }
            }
            
            // Check if required columns exist before updating them
            if (Schema::hasColumn('waste_types', 'nama_sampah')) {
                try {
                    DB::statement("UPDATE waste_types SET nama_sampah = CONCAT('Waste Type ', id) WHERE nama_sampah IS NULL OR nama_sampah = ''");
                    Log::info('Updated empty nama_sampah values');
                } catch (\Exception $e) {
                    Log::error('Failed to update nama_sampah: ' . $e->getMessage());
                }
            }
            
            if (Schema::hasColumn('waste_types', 'nama_sampah') && Schema::hasColumn('waste_types', 'name')) {
                try {
                    DB::statement("UPDATE waste_types SET name = nama_sampah WHERE name IS NULL OR name = ''");
                    Log::info('Updated empty name values from nama_sampah');
                } catch (\Exception $e) {
                    Log::error('Failed to update name: ' . $e->getMessage());
                }
            }
            
            // Make sure waste_category_id matches kategori_id
            if (Schema::hasColumn('waste_types', 'kategori_id') && Schema::hasColumn('waste_types', 'waste_category_id')) {
                try {
                    DB::statement("UPDATE waste_types SET waste_category_id = kategori_id WHERE kategori_id IS NOT NULL AND (waste_category_id IS NULL OR waste_category_id != kategori_id)");
                    Log::info('Synchronized waste_category_id with kategori_id');
                } catch (\Exception $e) {
                    Log::error('Failed to update waste_category_id: ' . $e->getMessage());
                }
            }
            
            DB::statement('SET FOREIGN_KEY_CHECKS=1');
            
            Log::info('Finished fixing waste_types table');
        }
        
        // STEP 2: Fix waste_values_new table to ensure each waste_type has a price entry
        if (Schema::hasTable('waste_values_new') && Schema::hasTable('waste_types')) {
            Log::info('Fixing waste_values_new table');
            
            try {
                // Get all waste types
                $wasteTypes = DB::table('waste_types')
                    ->select('waste_id', 'id')
                    ->get();
                    
                Log::info('Found ' . count($wasteTypes) . ' waste types to process');
                
                foreach ($wasteTypes as $wasteType) {
                    // Make sure waste_type_id in waste_values_new is using waste_id from waste_types
                    $wasteTypeId = $wasteType->waste_id ?? $wasteType->id;
                    
                    if (empty($wasteTypeId)) {
                        Log::warning('Skipping waste type with empty waste_id/id');
                        continue;
                    }
                    
                    // Check if this waste type already has a value entry
                    $hasValue = DB::table('waste_values_new')
                        ->where('waste_type_id', $wasteTypeId)
                        ->exists();
                    
                    if ($hasValue) {
                        // Make sure waste_type_id is correctly set
                        DB::table('waste_values_new')
                            ->where('waste_type_id', $wasteTypeId)
                            ->update([
                                'waste_type_id' => $wasteTypeId, // Ensure it's explicitly set
                                'updated_at' => now()
                            ]);
                            
                        Log::info("Updated waste value for waste_type_id=$wasteTypeId");
                    } else {
                        // Check if there's a value in the old table
                        $oldValue = null;
                        $price = 0;
                        
                        if (Schema::hasTable('waste_values')) {
                            $oldValue = DB::table('waste_values')
                                ->where('waste_id', $wasteTypeId)
                                ->first();
                                
                            if ($oldValue && isset($oldValue->harga_minimum)) {
                                $price = $oldValue->harga_minimum;
                            }
                        }
                        
                        // Insert a new value
                        DB::table('waste_values_new')->insert([
                            'waste_type_id' => $wasteTypeId,
                            'price_per_unit' => $price,
                            'is_active' => true,
                            'created_at' => now(),
                            'updated_at' => now()
                        ]);
                        
                        Log::info("Created new waste value for waste_type_id=$wasteTypeId");
                    }
                }
                
                Log::info('Finished fixing waste_values_new table');
            } catch (\Exception $e) {
                Log::error('Error fixing waste_values_new table: ' . $e->getMessage());
            }
        }
        
        // STEP 3: Fix any user_waste_trackings table inconsistencies
        if (Schema::hasTable('user_waste_trackings') && Schema::hasTable('waste_types')) {
            Log::info('Fixing user_waste_trackings table');
            
            try {
                // Check if both tables have the required columns
                if (Schema::hasColumn('user_waste_trackings', 'waste_type_id') && 
                    Schema::hasColumn('waste_types', 'id') &&
                    Schema::hasColumn('waste_types', 'waste_id')) {
                    
                    // Make sure waste_type_id in user_waste_trackings matches waste_id in waste_types
                    DB::statement('UPDATE user_waste_trackings u
                                JOIN waste_types w ON u.waste_type_id = w.id
                                SET u.waste_type_id = w.waste_id
                                WHERE w.waste_id != w.id AND u.waste_type_id = w.id');
                                
                    Log::info('Fixed waste_type_id references in user_waste_trackings');
                } else {
                    Log::warning('Missing required columns to update user_waste_trackings');
                }
            } catch (\Exception $e) {
                Log::error('Error fixing user_waste_trackings table: ' . $e->getMessage());
            }
        }
        
        Log::info('Migration fix_waste_values_id_consistency completed');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This migration only fixes data, no need for down method
        Log::info('Reversal of fix_waste_values_id_consistency is not needed');
    }
}; 