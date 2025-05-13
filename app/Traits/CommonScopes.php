<?php

namespace App\Traits;

trait CommonScopes
{
    /**
     * Scope untuk hanya mendapatkan data aktif
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        $statusColumn = $this->getStatusColumn();
        $activeValue = $this->getActiveStatusValue();
        
        return $query->where($statusColumn, $activeValue);
    }
    
    /**
     * Scope untuk mencari data berdasarkan kata kunci
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $keyword
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearch($query, $keyword)
    {
        $fields = $this->getSearchableFields();
        
        return $query->where(function($q) use ($fields, $keyword) {
            foreach ($fields as $field) {
                $q->orWhere($field, 'LIKE', "%{$keyword}%");
            }
        });
    }
    
    /**
     * Scope untuk mendapatkan data terbaru berdasarkan tanggal
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeLatest($query, $limit = 10)
    {
        $dateColumn = $this->getDateColumn();
        
        return $query->orderBy($dateColumn, 'desc')->limit($limit);
    }
    
    /**
     * Ambil nama kolom status, dapat di-override oleh model jika berbeda
     *
     * @return string
     */
    public function getStatusColumn()
    {
        return $this->statusColumn ?? 'status';
    }
    
    /**
     * Ambil nilai status aktif, dapat di-override oleh model jika berbeda
     *
     * @return mixed
     */
    public function getActiveStatusValue()
    {
        return $this->activeStatusValue ?? 'AKTIF';
    }
    
    /**
     * Ambil daftar kolom yang bisa dicari, dapat di-override oleh model
     *
     * @return array
     */
    public function getSearchableFields()
    {
        return $this->searchableFields ?? ['nama', 'judul', 'deskripsi'];
    }
    
    /**
     * Ambil nama kolom tanggal, dapat di-override oleh model jika berbeda
     *
     * @return string
     */
    public function getDateColumn()
    {
        return $this->dateColumn ?? 'updated_at';
    }
}