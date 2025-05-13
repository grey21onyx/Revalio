<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasSlug
{
    /**
     * Boot trait untuk menghasilkan slug secara otomatis
     * Digunakan pada model yang membutuhkan slug untuk URL yang friendly
     *
     * @return void
     */
    public static function bootHasSlug()
    {
        static::creating(function ($model) {
            if (empty($model->{$model->getSlugColumn()})) {
                $model->{$model->getSlugColumn()} = $model->generateSlug();
            }
        });

        static::updating(function ($model) {
            $sourceColumn = $model->getSlugSourceColumn();
            
            // Jika kolom sumber slug berubah, update slugnya
            if ($model->isDirty($sourceColumn)) {
                $model->{$model->getSlugColumn()} = $model->generateSlug();
            }
        });
    }

    /**
     * Mendapatkan nama kolom yang digunakan untuk slug
     *
     * @return string
     */
    public function getSlugColumn()
    {
        return $this->slugColumn ?? 'slug';
    }

    /**
     * Mendapatkan nama kolom yang digunakan sebagai sumber slug
     *
     * @return string
     */
    public function getSlugSourceColumn()
    {
        return $this->slugSourceColumn ?? 'title';
    }

    /**
     * Menghasilkan slug dari field yang ditentukan
     *
     * @return string
     */
    public function generateSlug()
    {
        $sourceColumn = $this->getSlugSourceColumn();
        $value = $this->{$sourceColumn};
        $slug = Str::slug($value);
        
        $increment = 1;
        $baseSlug = $slug;
        
        // Periksa apakah slug sudah ada
        while ($this->slugExists($slug)) {
            $slug = $baseSlug . '-' . $increment;
            $increment++;
        }
        
        return $slug;
    }
    
    /**
     * Memeriksa apakah slug sudah ada di database
     *
     * @param string $slug
     * @return bool
     */
    protected function slugExists($slug)
    {
        $query = static::where($this->getSlugColumn(), $slug);
        
        // Jika model sudah memiliki ID, exclude model ini dari pengecekan
        if ($this->exists) {
            $query->where($this->getKeyName(), '!=', $this->getKey());
        }
        
        return $query->exists();
    }
} 