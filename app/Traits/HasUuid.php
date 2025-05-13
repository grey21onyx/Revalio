<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasUuid
{
    /**
     * Boot trait untuk menyediakan UUID secara otomatis
     * Digunakan pada model yang membutuhkan UUID
     *
     * @return void
     */
    public static function bootHasUuid()
    {
        static::creating(function ($model) {
            if (empty($model->{$model->getUuidColumn()})) {
                $model->{$model->getUuidColumn()} = (string) Str::uuid();
            }
        });
    }

    /**
     * Mendapatkan nama kolom yang digunakan untuk UUID
     *
     * @return string
     */
    public function getUuidColumn()
    {
        return $this->uuidColumn ?? 'uuid';
    }
}