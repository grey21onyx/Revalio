<?php

namespace App\Traits;

use App\Models\DeletedRecord;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

trait RecyclableTrait
{
    use SoftDeletes;

    /**
     * Boot trait untuk menangani proses soft delete dan pencatatan ke recycle bin
     *
     * @return void
     */
    public static function bootRecyclableTrait()
    {
        static::deleting(function ($model) {
            if (!$model->isForceDeleting()) {
                // Simpan data ke tabel deleted_records
                DeletedRecord::create([
                    'table_name' => $model->getTable(),
                    'record_id' => $model->getKey(),
                    'record_data' => $model->toJson(),
                    'deletion_date' => now(),
                    'user_id' => Auth::id(),
                    'restoration_status' => 'NOT_RESTORED',
                ]);
            }
        });
    }

    /**
     * Memulihkan data yang telah dihapus (soft delete)
     *
     * @return bool
     */
    public function restore()
    {
        // Update status pada tabel deleted_records
        $deletedRecord = DeletedRecord::where('table_name', $this->getTable())
            ->where('record_id', $this->getKey())
            ->where('restoration_status', 'NOT_RESTORED')
            ->first();

        if ($deletedRecord) {
            $deletedRecord->update([
                'restoration_status' => 'RESTORED',
                'updated_at' => now(),
            ]);
        }

        return $this->withTrashed()->restore();
    }
}