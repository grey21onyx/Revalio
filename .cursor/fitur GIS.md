sekarang implementasikan fitur ini sepenuhnya, hingga siap digunakan. pastikan kamu menggunakan MCP context7 untuk melihat dokumentasi terbaru. gunakan apa terapkan apa yang direkomendasikan Web Workspace

## Analisis Kebutuhan Fitur GIS Lokasi Pengepul untuk Revalio

Berdasarkan analisis mendalam terhadap proyek Revalio dan penelitian tentang implementasi peta gratis, berikut adalah analisis lengkap kebutuhan fitur GIS:

### 🎯 **Kebutuhan Fungsional**

#### **1. Fitur admin (Penentuan Lokasi)**

- Interface untuk admin login dan akses modul peta

- Location picker interaktif untuk menandai titik di peta

- Form input data pengepul (nama, alamat, kontak, jenis sampah yang diterima)

- Validasi koordinat dan data pengepul

- CRUD operations untuk mengelola lokasi pengepul

#### **2. Fitur User (Melihat Lokasi)**

- Peta publik menampilkan semua lokasi pengepul aktif

- Marker dengan popup informasi detail pengepul

- Filter berdasarkan jenis sampah atau jarak

- Pencarian lokasi terdekat dari posisi user

### 🗄️ **Perubahan Database**

#### **Tabel Baru: `waste_collectors`**

```sql

CREATE TABLE waste_collectors (

id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

nama_pengepul VARCHAR(255) NOT NULL,

alamat TEXT NOT NULL,

latitude DECIMAL(10, 8) NOT NULL,

longitude DECIMAL(11, 8) NOT NULL,

kontak VARCHAR(255),

jenis_sampah_diterima JSON, -- Array kategori sampah

jam_operasional VARCHAR(255),

status_aktif BOOLEAN DEFAULT TRUE,

created_at TIMESTAMP NULL,

updated_at TIMESTAMP NULL,

deleted_at TIMESTAMP NULL

);

```

#### **Index untuk Performance**

```sql

ALTER TABLE waste_collectors ADD INDEX idx_coordinates (latitude, longitude);

ALTER TABLE waste_collectors ADD INDEX idx_status (status_aktif);

```

### 🛠️ **Implementasi Backend (Laravel)**

#### **1. Model dan Migration**

```php

// app/Models/WasteCollector.php

class WasteCollector extends Model

{

use SoftDeletes;

protected $fillable = [

'nama_pengepul', 'alamat', 'latitude', 'longitude',

'kontak', 'jenis_sampah_diterima', 'jam_operasional', 'status_aktif'

];

protected $casts = [

'jenis_sampah_diterima' => 'array',

'status_aktif' => 'boolean'

];

}

```

#### **2. API Controller**

```php

// app/Http/Controllers/Api/V1/WasteCollectorController.php

class WasteCollectorController extends Controller

{

// GET /api/v1/waste-collectors - Public endpoint

public function index()

{

return WasteCollector::where('status_aktif', true)

->select(['id', 'nama_pengepul', 'alamat', 'latitude', 'longitude', 'kontak', 'jenis_sampah_diterima', 'jam_operasional'])

->get();

}

// POST /api/v1/admin/waste-collectors - admin only

public function store(Request $request)

{

$validated = $request->validate([

'nama_pengepul' => 'required|string|max:255',

'alamat' => 'required|string',

'latitude' => 'required|numeric|between:-90,90',

'longitude' => 'required|numeric|between:-180,180',

'kontak' => 'nullable|string|max:255',

'jenis_sampah_diterima' => 'required|array',

'jam_operasional' => 'nullable|string|max:255'

]);

return WasteCollector::create($validated);

}

}

```

#### **3. Routes**

```php

// routes/api.php

Route::prefix('v1')->group(function () {

// Public routes

Route::get('/waste-collectors', [WasteCollectorController::class, 'index']);

// admin routes

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {

Route::apiResource('waste-collectors', WasteCollectorController::class)->except(['index']);

});

});

```

### 🗺️ **Solusi Peta Gratis**

#### **Pilihan 1: OpenStreetMap + Leaflet (Rekomendasi)**

**Keunggulan:**

- Sepenuhnya gratis tanpa batas penggunaan <mcreference link=" https://leafletjs.com/ " index="2">2</mcreference>

- Ringan (42KB) dan performa tinggi <mcreference link=" https://leafletjs.com/ " index="2">2</mcreference>

- Dokumentasi lengkap dan komunitas besar

- Tidak memerlukan API key

#### **Pilihan 2: Google Maps API**

**Keunggulan:**

- Interface familiar untuk user <mcreference link=" https://laraveldaily.com/post/laravel-find-addresses-with-coordinates-via-google-maps-api " index="1">1</mcreference>

- Fitur geocoding dan autocomplete ya