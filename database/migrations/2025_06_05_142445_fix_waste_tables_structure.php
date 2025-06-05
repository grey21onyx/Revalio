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
        // Create the waste_values_new table that the model expects
        Schema::create('waste_values_new', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('waste_type_id');
            $table->decimal('price_per_unit', 10, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Add foreign key if waste_types exists and has the proper column
            if (Schema::hasTable('waste_types') && Schema::hasColumn('waste_types', 'waste_id')) {
                $table->foreign('waste_type_id')
                    ->references('waste_id')
                    ->on('waste_types')
                    ->onDelete('cascade');
            }
        });

        // Create the user_waste_trackings table (plural) that the model expects
        Schema::create('user_waste_trackings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('waste_type_id');
            $table->decimal('amount', 10, 2);
            $table->string('unit', 20)->default('kg');
            $table->date('tracking_date');
            $table->enum('management_status', ['disimpan', 'dijual', 'didaur ulang'])->default('disimpan');
            $table->decimal('estimated_value', 10, 2)->default(0);
            $table->text('notes')->nullable();
            $table->string('photo', 255)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Add foreign keys if tables exist with proper columns
            if (Schema::hasTable('users') && Schema::hasColumn('users', 'id')) {
                $table->foreign('user_id')
                    ->references('id')
                    ->on('users')
                    ->onDelete('cascade');
            }
            
            if (Schema::hasTable('waste_types') && Schema::hasColumn('waste_types', 'waste_id')) {
                $table->foreign('waste_type_id')
                    ->references('waste_id')
                    ->on('waste_types')
                    ->onDelete('cascade');
            }
        });

        // Add missing columns to waste_types if they don't exist
        if (Schema::hasTable('waste_types')) {
            Schema::table('waste_types', function (Blueprint $table) {
                if (!Schema::hasColumn('waste_types', 'waste_category_id')) {
                    $table->unsignedBigInteger('waste_category_id')->nullable()->after('kategori_id');
                }
                
                if (!Schema::hasColumn('waste_types', 'name')) {
                    $table->string('name')->nullable()->after('nama_sampah');
                }
                
                if (!Schema::hasColumn('waste_types', 'description')) {
                    $table->text('description')->nullable()->after('deskripsi');
                }
            });
            
            // Mirror data between old and new columns for waste_types
            if (Schema::hasColumn('waste_types', 'kategori_id') && Schema::hasColumn('waste_types', 'waste_category_id')) {
                DB::statement('UPDATE waste_types SET waste_category_id = kategori_id WHERE waste_category_id IS NULL');
            }
            
            if (Schema::hasColumn('waste_types', 'nama_sampah') && Schema::hasColumn('waste_types', 'name')) {
                DB::statement('UPDATE waste_types SET name = nama_sampah WHERE name IS NULL');
            }
            
            if (Schema::hasColumn('waste_types', 'deskripsi') && Schema::hasColumn('waste_types', 'description')) {
                DB::statement('UPDATE waste_types SET description = deskripsi WHERE description IS NULL');
            }
        }

        // Migrate data from waste_values to waste_values_new if needed
        if (Schema::hasTable('waste_values') && Schema::hasTable('waste_values_new')) {
            // Get all waste values from old table
            $oldValues = DB::table('waste_values')->get();
            
            \Log::info('Migrating ' . count($oldValues) . ' waste values from waste_values to waste_values_new');
            
            foreach ($oldValues as $oldValue) {
                // Verify waste_id exists and is valid
                if (empty($oldValue->waste_id)) {
                    \Log::warning('Skipping waste value with empty waste_id', ['value_id' => $oldValue->nilai_id]);
                    continue;
                }
                
                // Check if waste type exists
                $wasteTypeExists = DB::table('waste_types')->where('waste_id', $oldValue->waste_id)->exists();
                if (!$wasteTypeExists) {
                    \Log::warning('Skipping waste value - waste type not found', ['waste_id' => $oldValue->waste_id]);
                    continue;
                }
                
                // Check if already migrated
                $exists = DB::table('waste_values_new')
                    ->where('waste_type_id', $oldValue->waste_id)
                    ->exists();
                
                if (!$exists) {
                    // Insert into new table
                    try {
                        DB::table('waste_values_new')->insert([
                            'waste_type_id' => $oldValue->waste_id,
                            'price_per_unit' => $oldValue->harga_minimum,
                            'is_active' => true,
                            'created_at' => $oldValue->created_at ?? now(),
                            'updated_at' => $oldValue->updated_at ?? now()
                        ]);
                        
                        \Log::info('Migrated waste value', [
                            'old_id' => $oldValue->nilai_id,
                            'waste_id' => $oldValue->waste_id
                        ]);
                    } catch (\Exception $e) {
                        \Log::error('Failed to migrate waste value', [
                            'error' => $e->getMessage(),
                            'waste_id' => $oldValue->waste_id
                        ]);
                    }
                }
            }
        }
        
        // Fix any inconsistencies in waste_types
        if (Schema::hasTable('waste_types')) {
            // Update status_aktif if null
            DB::statement('UPDATE waste_types SET status_aktif = true WHERE status_aktif IS NULL');
            
            // Try to fix any inconsistent name/description fields
            DB::statement("
                UPDATE waste_types 
                SET name = nama_sampah 
                WHERE name IS NULL AND nama_sampah IS NOT NULL
            ");
            
            DB::statement("
                UPDATE waste_types 
                SET nama_sampah = name 
                WHERE nama_sampah IS NULL AND name IS NOT NULL
            ");
            
            DB::statement("
                UPDATE waste_types 
                SET description = deskripsi 
                WHERE description IS NULL AND deskripsi IS NOT NULL
            ");
            
            DB::statement("
                UPDATE waste_types 
                SET deskripsi = description 
                WHERE deskripsi IS NULL AND description IS NOT NULL
            ");
            
            // Set kategori_id = waste_category_id where inconsistent
            DB::statement("
                UPDATE waste_types 
                SET kategori_id = waste_category_id 
                WHERE waste_category_id IS NOT NULL AND (kategori_id IS NULL OR kategori_id != waste_category_id)
            ");
            
            DB::statement("
                UPDATE waste_types 
                SET waste_category_id = kategori_id 
                WHERE kategori_id IS NOT NULL AND (waste_category_id IS NULL OR waste_category_id != kategori_id)
            ");
        }

        // Migrate data from user_waste_tracking to user_waste_trackings if needed
        if (Schema::hasTable('user_waste_tracking') && Schema::hasTable('user_waste_trackings')) {
            // Get all records from old user_waste_tracking table
            $oldTrackings = DB::table('user_waste_tracking')->get();
            
            foreach ($oldTrackings as $oldTracking) {
                // Check if already exists in new table
                $exists = DB::table('user_waste_trackings')
                    ->where('waste_type_id', $oldTracking->waste_id)
                    ->where('user_id', $oldTracking->user_id)
                    ->where('tracking_date', $oldTracking->tanggal_pencatatan)
                    ->exists();
                
                if (!$exists) {
                    // Insert into new table
                    DB::table('user_waste_trackings')->insert([
                        'user_id' => $oldTracking->user_id,
                        'waste_type_id' => $oldTracking->waste_id,
                        'amount' => $oldTracking->jumlah,
                        'unit' => $oldTracking->satuan,
                        'tracking_date' => $oldTracking->tanggal_pencatatan,
                        'management_status' => $oldTracking->status_pengelolaan,
                        'estimated_value' => $oldTracking->nilai_estimasi,
                        'notes' => $oldTracking->catatan,
                        'photo' => $oldTracking->foto,
                        'created_at' => now(),
                        'updated_at' => $oldTracking->updated_at
                    ]);
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('waste_values_new');
        Schema::dropIfExists('user_waste_trackings');
    }
}; 