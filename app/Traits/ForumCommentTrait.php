<?php

namespace App\Traits;

use App\Models\DeletedRecord;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

trait ForumCommentTrait
{
    /**
     * Override delete untuk menggunakan hard delete
     *
     * @return bool
     */
    public function delete()
    {
        // Langsung melakukan hard delete tanpa menggunakan SoftDeletes
        return $this->forceDelete();
    }
    
    /**
     * Override forceDelete untuk menghapus record secara permanen
     * dengan optimized performance
     * 
     * @return bool
     */
    public function forceDelete()
    {
        try {
            // Capture primary key sebelum dihapus
            $id = $this->getKey();
            
            // Hapus secara langsung menggunakan DB builder untuk performa yang lebih baik
            // daripada menghapus masing-masing relasi
            $deleted = DB::table($this->getTable())
                ->where($this->getKeyName(), $id)
                ->delete();
                
            return $deleted;
        } catch (\Exception $e) {
            Log::error('Error deleting forum comment', [
                'komentar_id' => $this->getKey(),
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
} 