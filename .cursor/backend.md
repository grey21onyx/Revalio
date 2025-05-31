# Analisis dan Rencana Implementasi Backend Aplikasi Revalio

Berdasarkan analisis mendalam terhadap dokumen SKPPL, struktur database, dan komponen frontend, berikut adalah rencana implementasi backend untuk menyambungkan semua halaman dengan database:

## 1. Halaman Beranda (Home.jsx)

### Data yang diperlukan:
- Sampah bernilai terbaru (3-5 item)
- Tutorial populer (3-5 item)
- Artikel terbaru (3-5 item)
- Thread forum terbaru (3-5 item)
- Statistik pengguna (jika login)

### Implementasi:
1. Buat `HomeController` dengan metode `index`:
```php
public function index()
{
    $wasteTypes = WasteType::with(['category', 'values'])
        ->where('status_aktif', true)
        ->latest()
        ->take(5)
        ->get();
        
    $tutorials = Tutorial::withCount('views')
        ->orderBy('views_count', 'desc')
        ->take(5)
        ->get();
        
    $articles = Article::where('status', 'PUBLISHED')
        ->latest('tanggal_publikasi')
        ->take(5)
        ->get();
        
    $threads = ForumThread::with(['user', 'comments'])
        ->where('status', 'AKTIF')
        ->latest('tanggal_posting')
        ->take(5)
        ->get();
        
    $userStats = null;
    if (Auth::check()) {
        $userStats = [
            'total_waste' => UserWasteTracking::where('user_id', Auth::id())
                ->sum('jumlah'),
            'estimated_value' => UserWasteTracking::where('user_id', Auth::id())
                ->sum('nilai_estimasi'),
            'impact' => $this->calculateEnvironmentalImpact(Auth::id())
        ];
    }
    
    return response()->json([
        'waste_types' => WasteTypeResource::collection($wasteTypes),
        'tutorials' => TutorialResource::collection($tutorials),
        'articles' => ArticleResource::collection($articles),
        'threads' => ForumThreadResource::collection($threads),
        'user_stats' => $userStats
    ]);
}
```

2. Buat route API:
```php
Route::get('/home-data', [HomeController::class, 'index']);
```

## 2. Halaman Katalog Sampah (Katalog.jsx)

### Data yang diperlukan:
- Daftar kategori sampah
- Daftar jenis sampah dengan filter dan pagination
- Data favorit pengguna (jika login)

### Implementasi:
1. Buat `WasteCategoryController` untuk kategori:
```php
public function index()
{
    $categories = WasteCategory::all();
    return WasteCategoryResource::collection($categories);
}
```

2. Buat `WasteTypeController` dengan filter dan pagination:
```php
public function index(Request $request)
{
    $query = WasteType::with(['category', 'values'])
        ->where('status_aktif', true);
    
    // Filter by category
    if ($request->has('category_id')) {
        $query->where('kategori_id', $request->category_id);
    }
    
    // Search by name
    if ($request->has('search')) {
        $query->where('nama_sampah', 'like', "%{$request->search}%")
              ->orWhere('deskripsi', 'like', "%{$request->search}%");
    }
    
    // Sort
    $sortField = $request->sort_by ?? 'nama_sampah';
    $sortOrder = $request->sort_order ?? 'asc';
    
    if ($sortField === 'nilai') {
        // Special case for sorting by value
        $query->join('waste_values', 'waste_types.waste_id', '=', 'waste_values.waste_id')
              ->orderBy('waste_values.harga_maksimum', $sortOrder);
    } else {
        $query->orderBy($sortField, $sortOrder);
    }
    
    $perPage = $request->per_page ?? 12;
    $wasteTypes = $query->paginate($perPage);
    
    return WasteTypeResource::collection($wasteTypes);
}
```

3. Buat endpoint untuk favorit:
```php
public function getUserFavorites()
{
    if (!Auth::check()) {
        return response()->json(['favorites' => []]);
    }
    
    $favorites = Auth::user()
        ->favoriteWasteTypes()
        ->pluck('waste_id')
        ->toArray();
        
    return response()->json(['favorites' => $favorites]);
}

public function toggleFavorite($id)
{
    if (!Auth::check()) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }
    
    $user = Auth::user();
    
    if ($user->favoriteWasteTypes()->where('waste_id', $id)->exists()) {
        $user->favoriteWasteTypes()->detach($id);
        $message = 'Removed from favorites';
    } else {
        $user->favoriteWasteTypes()->attach($id);
        $message = 'Added to favorites';
    }
    
    return response()->json(['message' => $message]);
}
```

## 3. Halaman Detail Sampah (DetailSampah.jsx)

### Data yang diperlukan:
- Detail jenis sampah termasuk kategori
- Nilai ekonomis dan historisnya
- Panduan terkait sampah tersebut
- Pembeli potensial
- Estimasi dampak lingkungan

### Implementasi:
1. Tambahkan metode di `WasteTypeController`:
```php
public function show($id)
{
    $wasteType = WasteType::with([
        'category',
        'values',
        'tutorials',
        'buyerTypes.buyer',
    ])->findOrFail($id);
    
    $priceHistory = WasteValue::where('waste_id', $id)
        ->orderBy('tanggal_update', 'asc')
        ->get()
        ->groupBy(function($date) {
            return Carbon::parse($date->tanggal_update)->format('Y-m');
        })
        ->map(function($group) {
            return [
                'min' => $group->avg('harga_minimum'),
                'max' => $group->avg('harga_maksimum'),
            ];
        });
    
    return response()->json([
        'waste_type' => new WasteTypeDetailResource($wasteType),
        'price_history' => $priceHistory,
        'is_favorite' => Auth::check() ? 
            Auth::user()->favoriteWasteTypes()->where('waste_id', $id)->exists() : 
            false,
    ]);
}

public function getRelatedTutorials($id)
{
    $wasteType = WasteType::findOrFail($id);
    
    $tutorials = Tutorial::where('waste_id', $id)
        ->orWhere('kategori_id', $wasteType->kategori_id)
        ->take(5)
        ->get();
        
    return TutorialResource::collection($tutorials);
}

public function getPotentialBuyers($id)
{
    $buyers = WasteBuyer::whereHas('wasteTypes', function($query) use ($id) {
        $query->where('waste_id', $id);
    })->with(['wasteTypes' => function($query) use ($id) {
        $query->where('waste_id', $id);
    }])->get();
    
    return WasteBuyerResource::collection($buyers);
}
```

## 4. Halaman Daur Ulang & Reuse (DaurUlang.jsx)

### Data yang diperlukan:
- Daftar tutorial dengan filter dan pagination
- Status completed/saved untuk pengguna (jika login)

### Implementasi:
1. Buat `TutorialController` dengan filter dan pagination:
```php
public function index(Request $request)
{
    $query = Tutorial::query();
    
    // Filter by type
    if ($request->has('jenis_tutorial')) {
        $query->where('jenis_tutorial', $request->jenis_tutorial);
    }
    
    // Filter by difficulty
    if ($request->has('tingkat_kesulitan')) {
        $query->whereIn('tingkat_kesulitan', $request->tingkat_kesulitan);
    }
    
    // Filter by time
    if ($request->has('max_time')) {
        $query->where('estimasi_waktu', '<=', $request->max_time);
    }
    
    // Filter by waste type
    if ($request->has('waste_id')) {
        $query->where('waste_id', $request->waste_id);
    }
    
    // Search by title
    if ($request->has('search')) {
        $query->where('judul', 'like', "%{$request->search}%")
              ->orWhere('deskripsi', 'like', "%{$request->search}%");
    }
    
    // Filter tried/untried
    if ($request->has('tried') && Auth::check()) {
        $userId = Auth::id();
        if ($request->tried === 'true') {
            $query->whereHas('completedByUsers', function($q) use ($userId) {
                $q->where('user_id', $userId);
            });
        } else {
            $query->whereDoesntHave('completedByUsers', function($q) use ($userId) {
                $q->where('user_id', $userId);
            });
        }
    }
    
    $perPage = $request->per_page ?? 12;
    $tutorials = $query->paginate($perPage);
    
    // Attach user specific data
    $tutorials->getCollection()->transform(function($tutorial) {
        if (Auth::check()) {
            $userId = Auth::id();
            $tutorial->is_completed = $tutorial->completedByUsers()->where('user_id', $userId)->exists();
            $tutorial->is_saved = $tutorial->savedByUsers()->where('user_id', $userId)->exists();
        } else {
            $tutorial->is_completed = false;
            $tutorial->is_saved = false;
        }
        return $tutorial;
    });
    
    return TutorialResource::collection($tutorials);
}
```

## 5. Halaman Detail Panduan (DetailPanduan.jsx)

### Data yang diperlukan:
- Detail tutorial lengkap
- Komentar dan rating
- Status completed/saved untuk pengguna (jika login)

### Implementasi:
1. Tambahkan metode di `TutorialController`:
```php
public function show($id)
{
    $tutorial = Tutorial::with([
        'wasteType',
        'comments.user',
        'ratings'
    ])->findOrFail($id);
    
    // Increment view count
    $tutorial->incrementViewCount();
    
    // Add user specific data
    if (Auth::check()) {
        $userId = Auth::id();
        $tutorial->is_completed = $tutorial->completedByUsers()->where('user_id', $userId)->exists();
        $tutorial->is_saved = $tutorial->savedByUsers()->where('user_id', $userId)->exists();
        $tutorial->user_rating = $tutorial->ratings()->where('user_id', $userId)->value('rating');
    } else {
        $tutorial->is_completed = false;
        $tutorial->is_saved = false;
        $tutorial->user_rating = null;
    }
    
    return new TutorialDetailResource($tutorial);
}

public function toggleCompleted($id)
{
    if (!Auth::check()) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }
    
    $user = Auth::user();
    $tutorial = Tutorial::findOrFail($id);
    
    if ($tutorial->completedByUsers()->where('user_id', $user->id)->exists()) {
        $tutorial->completedByUsers()->detach($user->id);
        $message = 'Removed from completed';
        $isCompleted = false;
    } else {
        $tutorial->completedByUsers()->attach($user->id, ['completed_at' => now()]);
        $message = 'Marked as completed';
        $isCompleted = true;
    }
    
    return response()->json([
        'message' => $message,
        'is_completed' => $isCompleted
    ]);
}

public function toggleSaved($id)
{
    // Similar to toggleCompleted but for saved tutorials
}

public function rate($id, Request $request)
{
    $this->validate($request, [
        'rating' => 'required|integer|min:1|max:5'
    ]);
    
    if (!Auth::check()) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }
    
    $user = Auth::user();
    $tutorial = Tutorial::findOrFail($id);
    
    $tutorial->ratings()->updateOrCreate(
        ['user_id' => $user->id],
        ['rating' => $request->rating]
    );
    
    // Update average rating
    $avgRating = $tutorial->ratings()->avg('rating');
    $tutorial->update(['average_rating' => $avgRating]);
    
    return response()->json([
        'message' => 'Rating updated',
        'average_rating' => $avgRating,
        'user_rating' => $request->rating
    ]);
}

public function addComment($id, Request $request)
{
    $this->validate($request, [
        'content' => 'required|string|max:1000'
    ]);
    
    if (!Auth::check()) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }
    
    $user = Auth::user();
    $tutorial = Tutorial::findOrFail($id);
    
    $comment = $tutorial->comments()->create([
        'user_id' => $user->id,
        'content' => $request->content
    ]);
    
    return response()->json([
        'message' => 'Comment added',
        'comment' => new CommentResource($comment)
    ], 201);
}
```

## 6. Halaman Tracking Sampah (Tracking.jsx)

### Data yang diperlukan:
- Catatan tracking sampah pengguna dengan pagination
- Jenis-jenis sampah untuk form tambah
- Statistik dan visualisasi data tracking

### Implementasi:
1. Buat `UserWasteTrackingController`:
```php
public function index(Request $request)
{
    if (!Auth::check()) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }
    
    $userId = Auth::id();
    $query = UserWasteTracking::with('wasteType')
        ->where('user_id', $userId);
    
    // Filter by date range
    if ($request->has('start_date') && $request->has('end_date')) {
        $query->whereBetween('tanggal_pencatatan', [
            $request->start_date,
            $request->end_date.' 23:59:59'
        ]);
    }
    
    // Filter by waste type
    if ($request->has('waste_id')) {
        $query->where('waste_id', $request->waste_id);
    }
    
    // Filter by status
    if ($request->has('status_pengelolaan')) {
        $query->where('status_pengelolaan', $request->status_pengelolaan);
    }
    
    // Sort
    $sortField = $request->sort_by ?? 'tanggal_pencatatan';
    $sortOrder = $request->sort_order ?? 'desc';
    $query->orderBy($sortField, $sortOrder);
    
    $perPage = $request->per_page ?? 10;
    $trackingRecords = $query->paginate($perPage);
    
    return UserWasteTrackingResource::collection($trackingRecords);
}

public function store(Request $request)
{
    if (!Auth::check()) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }
    
    $this->validate($request, [
        'waste_id' => 'required|exists:waste_types,waste_id',
        'jumlah' => 'required|numeric|min:0',
        'satuan' => 'required|string',
        'tanggal_pencatatan' => 'required|date',
        'status_pengelolaan' => 'required|in:disimpan,dijual,didaur ulang',
        'catatan' => 'nullable|string',
        'foto' => 'nullable|image|max:2048'
    ]);
    
    $userId = Auth::id();
    $data = $request->except('foto');
    $data['user_id'] = $userId;
    
    // Upload foto jika ada
    if ($request->hasFile('foto')) {
        $path = $request->file('foto')->store('waste_tracking', 'public');
        $data['foto'] = $path;
    }
    
    // Hitung nilai estimasi
    $wasteType = WasteType::find($request->waste_id);
    $wasteValue = $wasteType->values()->latest('tanggal_update')->first();
    
    if ($wasteValue) {
        $avgPrice = ($wasteValue->harga_minimum + $wasteValue->harga_maksimum) / 2;
        $data['nilai_estimasi'] = $avgPrice * $request->jumlah;
    }
    
    $tracking = UserWasteTracking::create($data);
    
    return response()->json([
        'message' => 'Tracking record created',
        'tracking' => new UserWasteTrackingResource($tracking)
    ], 201);
}

public function stats(Request $request)
{
    if (!Auth::check()) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }
    
    $userId = Auth::id();
    
    // Filter by date range
    $startDate = $request->start_date ?? Carbon::now()->subYear();
    $endDate = $request->end_date ?? Carbon::now();
    
    // Total stats
    $totalStats = [
        'total_waste' => UserWasteTracking::where('user_id', $userId)
            ->whereBetween('tanggal_pencatatan', [$startDate, $endDate])
            ->sum('jumlah'),
        'total_value' => UserWasteTracking::where('user_id', $userId)
            ->whereBetween('tanggal_pencatatan', [$startDate, $endDate])
            ->sum('nilai_estimasi'),
        'total_records' => UserWasteTracking::where('user_id', $userId)
            ->whereBetween('tanggal_pencatatan', [$startDate, $endDate])
            ->count(),
    ];
    
    // Breakdown by waste category
    $categoryData = DB::table('user_waste_tracking')
        ->join('waste_types', 'user_waste_tracking.waste_id', '=', 'waste_types.waste_id')
        ->join('waste_categories', 'waste_types.kategori_id', '=', 'waste_categories.kategori_id')
        ->where('user_waste_tracking.user_id', $userId)
        ->whereBetween('tanggal_pencatatan', [$startDate, $endDate])
        ->select('waste_categories.nama_kategori', DB::raw('SUM(jumlah) as total_jumlah'))
        ->groupBy('waste_categories.nama_kategori')
        ->get();
    
    // Time series data for chart
    $timeSeriesData = UserWasteTracking::where('user_id', $userId)
        ->whereBetween('tanggal_pencatatan', [$startDate, $endDate])
        ->get()
        ->groupBy(function($date) {
            return Carbon::parse($date->tanggal_pencatatan)->format('Y-m');
        })
        ->map(function($group) {
            return [
                'jumlah' => $group->sum('jumlah'),
                'nilai' => $group->sum('nilai_estimasi')
            ];
        });
    
    // Environmental impact estimation
    $environmentalImpact = $this->calculateEnvironmentalImpact($userId, $startDate, $endDate);
    
    return response()->json([
        'total_stats' => $totalStats,
        'category_data' => $categoryData,
        'time_series' => $timeSeriesData,
        'environmental_impact' => $environmentalImpact
    ]);
}

protected function calculateEnvironmentalImpact($userId, $startDate = null, $endDate = null)
{
    // Implement calculation based on waste types and amounts
    // This is a simplified example
    $query = UserWasteTracking::where('user_id', $userId);
    
    if ($startDate && $endDate) {
        $query->whereBetween('tanggal_pencatatan', [$startDate, $endDate]);
    }
    
    $totalPlastic = $query->whereHas('wasteType.category', function($q) {
        $q->where('nama_kategori', 'Plastik');
    })->sum('jumlah');
    
    $totalPaper = $query->whereHas('wasteType.category', function($q) {
        $q->where('nama_kategori', 'Kertas');
    })->sum('jumlah');
    
    // Simplified impact calculations
    return [
        'co2_reduction' => $totalPlastic * 2.5 + $totalPaper * 1.8, // kg of CO2 saved
        'water_saved' => $totalPaper * 60, // liters of water saved
        'trees_saved' => $totalPaper / 100, // trees saved
        'energy_saved' => $totalPlastic * 5.8 + $totalPaper * 4.3, // kWh of energy saved
    ];
}
```

## 7. Halaman Forum (Forum.jsx & DetailForum.jsx)

### Data yang diperlukan:
- Daftar thread forum dengan filter dan pagination
- Detail thread dengan komentar
- Sistem CRUD untuk thread dan komentar

### Implementasi:
1. Buat `ForumController`:
```php
public function index(Request $request)
{
    $query = ForumThread::with(['user', 'comments'])
        ->where('status', 'AKTIF');
    
    // Filter by category (tags)
    if ($request->has('tags')) {
        $tags = explode(',', $request->tags);
        foreach($tags as $tag) {
            $query->where('tags', 'like', "%$tag%");
        }
    }
    
    // Search by title/content
    if ($request->has('search')) {
        $search = $request->search;
        $query->where(function($q) use ($search) {
            $q->where('judul', 'like', "%{$search}%")
              ->orWhere('konten', 'like', "%{$search}%");
        });
    }
    
    // Sort
    $sortField = $request->sort_by ?? 'tanggal_posting';
    $sortOrder = $request->sort_order ?? 'desc';
    
    if ($sortField === 'comments') {
        $query->withCount('comments')
              ->orderBy('comments_count', $sortOrder);
    } else {
        $query->orderBy($sortField, $sortOrder);
    }
    
    $perPage = $request->per_page ?? 15;
    $threads = $query->paginate($perPage);
    
    return ForumThreadResource::collection($threads);
}

public function show($id)
{
    $thread = ForumThread::with(['user'])->findOrFail($id);
    
    // Increment view count if needed
    
    return new ForumThreadDetailResource($thread);
}

public function store(Request $request)
{
    if (!Auth::check()) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }
    
    $this->validate($request, [
        'judul' => 'required|string|max:100',
        'konten' => 'required|string',
        'tags' => 'nullable|string|max:255',
    ]);
    
    $userId = Auth::id();
    
    $thread = ForumThread::create([
        'user_id' => $userId,
        'judul' => $request->judul,
        'konten' => $request->konten,
        'tags' => $request->tags,
        'tanggal_posting' => now(),
        'status' => 'AKTIF'
    ]);
    
    return response()->json([
        'message' => 'Thread created',
        'thread' => new ForumThreadResource($thread)
    ], 201);
}

public function update($id, Request $request)
{
    // Similar to store but with authorization check
}

public function destroy($id)
{
    // With authorization check
}

// Comment methods
public function getComments($threadId, Request $request)
{
    $thread = ForumThread::findOrFail($threadId);
    
    $query = ForumComment::with(['user'])
        ->where('thread_id', $threadId)
        ->whereNull('parent_komentar_id'); // Get top-level comments only
    
    // Sort
    $sortOrder = $request->sort_order ?? 'asc';
    $query->orderBy('tanggal_komentar', $sortOrder);
    
    $perPage = $request->per_page ?? 20;
    $comments = $query->paginate($perPage);
    
    // Load replies for each comment
    $comments->getCollection()->transform(function($comment) {
        $comment->replies = ForumComment::with(['user'])
            ->where('parent_komentar_id', $comment->komentar_id)
            ->orderBy('tanggal_komentar', 'asc')
            ->get();
        return $comment;
    });
    
    return ForumCommentResource::collection($comments);
}

public function storeComment($threadId, Request $request)
{
    if (!Auth::check()) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }
    
    $thread = ForumThread::findOrFail($threadId);
    
    $this->validate($request, [
        'konten' => 'required|string|max:1000',
        'parent_komentar_id' => 'nullable|exists:forum_comments,komentar_id'
    ]);
    
    $userId = Auth::id();
    
    $comment = ForumComment::create([
        'thread_id' => $threadId,
        'user_id' => $userId,
        'konten' => $request->konten,
        'tanggal_komentar' => now(),
        'parent_komentar_id' => $request->parent_komentar_id,
        'status' => 'AKTIF'
    ]);
    
    // Re-fetch with user relationship
    $comment = ForumComment::with(['user'])->find($comment->komentar_id);
    
    return response()->json([
        'message' => 'Comment added',
        'comment' => new ForumCommentResource($comment)
    ], 201);
}
```

## 8. Halaman Monetisasi (Monetisasi.jsx)

### Data yang diperlukan:
- Daftar pembeli sampah dengan filter
- Tips monetisasi dari artikel

### Implementasi:
1. Buat `WasteBuyerController`:
```php
public function index(Request $request)
{
    $query = WasteBuyer::with('wasteTypes.wasteType');
    
    // Filter by waste type
    if ($request->has('waste_id')) {
        $query->whereHas('wasteTypes', function($q) use ($request) {
            $q->where('waste_id', $request->waste_id);
        });
    }
    
    // Filter by location (using a simplified approach)
    if ($request->has('location')) {
        $query->where(function($q) use ($request) {
            $q->where('alamat', 'like', "%{$request->location}%");
        });
    }
    
    // Filter by buyer type
    if ($request->has('buyer_type')) {
        $query->where('jenis_pembeli', $request->buyer_type);
    }
    
    // Sort
    $sortField = $request->sort_by ?? 'nama_pembeli';
    $sortOrder = $request->sort_order ?? 'asc';
    $query->orderBy($sortField, $sortOrder);
    
    $perPage = $request->per_page ?? 10;
    $buyers = $query->paginate($perPage);
    
    return WasteBuyerResource::collection($buyers);
}

public function getMonetizationTips(Request $request)
{
    // Get articles related to monetization
    $tips = Article::where('kategori', 'Tips Monetisasi')
        ->where('status', 'PUBLISHED')
        ->latest('tanggal_publikasi')
        ->take(5)
        ->get();
    
    return ArticleResource::collection($tips);
}
```

## 10. Autentikasi & Manajemen User (Login.jsx, Register.jsx, Profile.jsx)

### Data yang diperlukan:
- Login, register, logout
- Profil pengguna
- Update profile

### Implementasi:
1. Buat `AuthController`:
```php
public function register(Request $request)
{
    $this->validate($request, [
        'nama_lengkap' => 'required|string|max:100',
        'email' => 'required|string|email|max:100|unique:users',
        'password' => 'required|string|min:8|confirmed',
        'no_telepon' => 'nullable|string|max:20',
    ]);
    
    $user = User::create([
        'nama_lengkap' => $request->nama_lengkap,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'no_telepon' => $request->no_telepon,
        'status_akun' => 'AKTIF',
        'tanggal_registrasi' => now(),
        'role' => 'USER',
    ]);
    
    // Assign user role
    $userRole = Role::where('nama', 'User')->first();
    if ($userRole) {
        $user->roles()->attach($userRole->role_id);
    }
    
    return response()->json([
        'message' => 'User registered successfully',
        'user' => new UserResource($user)
    ], 201);
}

public function login(Request $request)
{
    $this->validate($request, [
        'email' => 'required|string|email',
        'password' => 'required|string',
    ]);
    
    $credentials = $request->only('email', 'password');
    
    if (Auth::attempt($credentials)) {
        $user = Auth::user();
        
        // Check if user is active
        if ($user->status_akun !== 'AKTIF') {
            Auth::logout();
            return response()->json([
                'message' => 'Account is inactive'
            ], 401);
        }
        
        $token = $user->createToken('authToken')->plainTextToken;
        
        return response()->json([
            'message' => 'Login successful',
            'user' => new UserResource($user),
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
    
    return response()->json([
        'message' => 'Invalid credentials'
    ], 401);
}

public function logout(Request $request)
{
    if (Auth::check()) {
        Auth::user()->tokens()->delete();
    }
    
    return response()->json([
        'message' => 'Successfully logged out'
    ]);
}
```

2. Buat `UserController` untuk manajemen profil:
```php
public function profile()
{
    $user = Auth::user();
    $user->load('roles');
    
    return response()->json([
        'user' => new UserResource($user)
    ]);
}

public function updateProfile(Request $request)
{
    $user = Auth::user();
    
    $this->validate($request, [
        'nama_lengkap' => 'required|string|max:100',
        'no_telepon' => 'nullable|string|max:20',
        'alamat' => 'nullable|string',
        'preferensi_sampah' => 'nullable|string',
    ]);
    
    $user->update([
        'nama_lengkap' => $request->nama_lengkap,
        'no_telepon' => $request->no_telepon,
        'alamat' => $request->alamat,
        'preferensi_sampah' => $request->preferensi_sampah,
    ]);
    
    return response()->json([
        'message' => 'Profile updated successfully',
        'user' => new UserResource($user)
    ]);
}

public function updateAvatar(Request $request)
{
    $user = Auth::user();
    
    $this->validate($request, [
        'foto_profil' => 'required|image|max:2048',
    ]);
    
    // Delete old avatar if exists
    if ($user->foto_profil && $user->foto_profil !== 'profiles/default.jpg') {
        Storage::disk('public')->delete($user->foto_profil);
    }
    
    // Upload new avatar
    $path = $request->file('foto_profil')->store('profiles', 'public');
    $user->foto_profil = $path;
    $user->save();
    
    return response()->json([
        'message' => 'Avatar updated successfully',
        'foto_profil' => asset('storage/' . $path)
    ]);
}

public function updatePassword(Request $request)
{
    $user = Auth::user();
    
    $this->validate($request, [
        'current_password' => 'required|string',
        'password' => 'required|string|min:8|confirmed',
    ]);
    
    if (!Hash::check($request->current_password, $user->password)) {
        return response()->json([
            'message' => 'Current password is incorrect'
        ], 422);
    }
    
    $user->password = Hash::make($request->password);
    $user->save();
    
    return response()->json([
        'message' => 'Password updated successfully'
    ]);
}

public function getUserStats()
{
    if (!Auth::check()) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }
    
    $userId = Auth::id();
    
    // Get user's waste tracking stats
    $tracking = UserWasteTracking::where('user_id', $userId);
    
    $stats = [
        'total_waste' => $tracking->sum('jumlah'),
        'total_value' => $tracking->sum('nilai_estimasi'),
        'total_records' => $tracking->count(),
        'waste_types_count' => $tracking->distinct('waste_id')->count('waste_id'),
        'forum_threads' => ForumThread::where('user_id', $userId)->count(),
        'forum_comments' => ForumComment::where('user_id', $userId)->count(),
        'completed_tutorials' => Auth::user()->completedTutorials()->count(),
    ];
    
    return response()->json($stats);
}
```

## Rute API

Terakhir, kita perlu mendaftarkan semua rute API di `routes/api.php`:

```php
// Public routes
Route::prefix('v1')->group(function () {
    // Auth routes
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);
    
    // Home data
    Route::get('home-data', [HomeController::class, 'index']);
    
    // Waste categories and types
    Route::get('waste-categories', [WasteCategoryController::class, 'index']);
    Route::get('waste-types', [WasteTypeController::class, 'index']);
    Route::get('waste-types/{id}', [WasteTypeController::class, 'show']);
    Route::get('waste-types/{id}/tutorials', [WasteTypeController::class, 'getRelatedTutorials']);
    Route::get('waste-types/{id}/buyers', [WasteTypeController::class, 'getPotentialBuyers']);
    
    // Tutorials
    Route::get('tutorials', [TutorialController::class, 'index']);
    Route::get('tutorials/{id}', [TutorialController::class, 'show']);
    Route::get('tutorials/{id}/comments', [TutorialController::class, 'getComments']);
    
    // Articles
    Route::get('articles', [ArticleController::class, 'index']);
    Route::get('articles/{id}', [ArticleController::class, 'show']);
    
    // Forum threads
    Route::get('forum-threads', [ForumController::class, 'index']);
    Route::get('forum-threads/{id}', [ForumController::class, 'show']);
    Route::get('forum-threads/{threadId}/comments', [ForumController::class, 'getComments']);
    
    // Business opportunities
    Route::get('business-opportunities', [BusinessOpportunityController::class, 'index']);
    Route::get('business-opportunities/{id}', [BusinessOpportunityController::class, 'show']);
    
    // Waste buyers
    Route::get('waste-buyers', [WasteBuyerController::class, 'index']);
    Route::get('monetization-tips', [WasteBuyerController::class, 'getMonetizationTips']);
    
    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        // Auth
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [UserController::class, 'profile']);
        
        // User profile
        Route::put('user/profile', [UserController::class, 'updateProfile']);
        Route::post('user/avatar', [UserController::class, 'updateAvatar']);
        Route::put('user/password', [UserController::class, 'updatePassword']);
        Route::get('user/stats', [UserController::class, 'getUserStats']);
        
        // User favorites
        Route::get('favorites/waste-types', [WasteTypeController::class, 'getUserFavorites']);
        Route::post('favorites/waste-types/{id}', [WasteTypeController::class, 'toggleFavorite']);
        
        // User tutorial interactions
        Route::post('tutorials/{id}/complete', [TutorialController::class, 'toggleCompleted']);
        Route::post('tutorials/{id}/save', [TutorialController::class, 'toggleSaved']);
        Route::post('tutorials/{id}/rate', [TutorialController::class, 'rate']);
        Route::post('tutorials/{id}/comments', [TutorialController::class, 'addComment']);
        
        // Waste tracking
        Route::get('waste-tracking', [UserWasteTrackingController::class, 'index']);
        Route::post('waste-tracking', [UserWasteTrackingController::class, 'store']);
        Route::put('waste-tracking/{id}', [UserWasteTrackingController::class, 'update']);
        Route::delete('waste-tracking/{id}', [UserWasteTrackingController::class, 'destroy']);
        Route::get('waste-tracking/stats', [UserWasteTrackingController::class, 'stats']);
        
        // Forum management
        Route::post('forum-threads', [ForumController::class, 'store']);
        Route::put('forum-threads/{id}', [ForumController::class, 'update']);
        Route::delete('forum-threads/{id}', [ForumController::class, 'destroy']);
        Route::post('forum-threads/{threadId}/comments', [ForumController::class, 'storeComment']);
        Route::put('forum-comments/{id}', [ForumController::class, 'updateComment']);
        Route::delete('forum-comments/{id}', [ForumController::class, 'destroyComment']);
        
        // admin routes
        Route::middleware('role:admin')->group(function () {
            // admin dashboard stats
            Route::get('admin/stats', [adminController::class, 'getStats']);
            
            // Content management
            Route::apiResource('admin/waste-categories', adminWasteCategoryController::class);
            Route::apiResource('admin/waste-types', adminWasteTypeController::class);
            Route::apiResource('admin/waste-values', adminWasteValueController::class);
            Route::apiResource('admin/tutorials', adminTutorialController::class);
            Route::apiResource('admin/articles', adminArticleController::class);
            Route::apiResource('admin/waste-buyers', adminWasteBuyerController::class);
            Route::apiResource('admin/business-opportunities', adminBusinessOpportunityController::class);
            
            // User management
            Route::apiResource('admin/users', adminUserController::class);
            Route::put('admin/users/{id}/status', [adminUserController::class, 'updateStatus']);
            
            // Moderator tasks
            Route::put('admin/forum-threads/{id}/status', [adminForumController::class, 'updateThreadStatus']);
            Route::put('admin/forum-comments/{id}/status', [adminForumController::class, 'updateCommentStatus']);
        });
    });
});
```

## Implementasi Model dan Relasi

Berikut adalah contoh implementasi model dan relasi yang diperlukan untuk aplikasi Revalio:

### 1. Model User

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $primaryKey = 'user_id';

    protected $fillable = [
        'nama_lengkap', 'email', 'password', 'no_telepon',
        'alamat', 'foto_profil', 'status_akun', 'role',
        'preferensi_sampah', 'tanggal_registrasi'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'tanggal_registrasi' => 'datetime',
    ];

    // Relasi
    public function wasteTrackings()
    {
        return $this->hasMany(UserWasteTracking::class, 'user_id');
    }

    public function forumThreads()
    {
        return $this->hasMany(ForumThread::class, 'user_id');
    }

    public function forumComments()
    {
        return $this->hasMany(ForumComment::class, 'user_id');
    }

    public function favoriteWasteTypes()
    {
        return $this->belongsToMany(WasteType::class, 'user_favorite_waste_types', 'user_id', 'waste_id')
                    ->withTimestamps();
    }

    public function completedTutorials()
    {
        return $this->belongsToMany(Tutorial::class, 'user_completed_tutorials', 'user_id', 'tutorial_id')
                    ->withPivot('completed_at')
                    ->withTimestamps();
    }

    public function savedTutorials()
    {
        return $this->belongsToMany(Tutorial::class, 'user_saved_tutorials', 'user_id', 'tutorial_id')
                    ->withTimestamps();
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_user', 'user_id', 'role_id')
                    ->withTimestamps();
    }

    // Helpers
    public function hasRole($roleName)
    {
        return $this->roles()->where('nama', $roleName)->exists();
    }
}
```

### 2. Model WasteCategory

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WasteCategory extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'kategori_id';
    
    protected $fillable = [
        'nama_kategori', 'deskripsi', 'ikon'
    ];

    // Relasi
    public function wasteTypes()
    {
        return $this->hasMany(WasteType::class, 'kategori_id');
    }
}
```

### 3. Model WasteType

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WasteType extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'waste_id';
    
    protected $fillable = [
        'nama_sampah', 'kategori_id', 'deskripsi', 
        'cara_sortir', 'cara_penyimpanan', 'gambar', 
        'status_aktif'
    ];

    protected $casts = [
        'status_aktif' => 'boolean',
    ];

    // Relasi
    public function category()
    {
        return $this->belongsTo(WasteCategory::class, 'kategori_id');
    }

    public function values()
    {
        return $this->hasMany(WasteValue::class, 'waste_id');
    }

    public function tutorials()
    {
        return $this->hasMany(Tutorial::class, 'waste_id');
    }

    public function buyerTypes()
    {
        return $this->hasMany(WasteBuyerType::class, 'waste_id');
    }

    public function favoriteByUsers()
    {
        return $this->belongsToMany(User::class, 'user_favorite_waste_types', 'waste_id', 'user_id')
                    ->withTimestamps();
    }

    public function userTrackings()
    {
        return $this->hasMany(UserWasteTracking::class, 'waste_id');
    }
}
```

### 4. Model WasteValue

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WasteValue extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'nilai_id';
    
    protected $fillable = [
        'waste_id', 'harga_minimum', 'harga_maksimum', 
        'satuan', 'tanggal_update', 'sumber_data'
    ];

    protected $casts = [
        'harga_minimum' => 'float',
        'harga_maksimum' => 'float',
        'tanggal_update' => 'datetime',
    ];

    // Relasi
    public function wasteType()
    {
        return $this->belongsTo(WasteType::class, 'waste_id');
    }
}
```

## Implementasi API Resource

Untuk memformat response API dengan konsisten, kita perlu membuat API Resource untuk setiap entitas:

### 1. UserResource

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->user_id,
            'nama_lengkap' => $this->nama_lengkap,
            'email' => $this->email,
            'no_telepon' => $this->no_telepon,
            'alamat' => $this->alamat,
            'foto_profil' => $this->foto_profil ? asset('storage/' . $this->foto_profil) : null,
            'status_akun' => $this->status_akun,
            'role' => $this->role,
            'preferensi_sampah' => $this->preferensi_sampah,
            'tanggal_registrasi' => $this->tanggal_registrasi->format('Y-m-d H:i:s'),
            'roles' => RoleResource::collection($this->whenLoaded('roles')),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
```

### 2. WasteTypeResource

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class WasteTypeResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->waste_id,
            'nama' => $this->nama_sampah,
            'deskripsi' => $this->deskripsi,
            'cara_sortir' => $this->cara_sortir,
            'cara_penyimpanan' => $this->cara_penyimpanan,
            'gambar' => $this->gambar ? asset('storage/' . $this->gambar) : null,
            'status_aktif' => (bool) $this->status_aktif,
            'kategori' => $this->whenLoaded('category', function() {
                return [
                    'id' => $this->category->kategori_id,
                    'nama' => $this->category->nama_kategori,
                    'ikon' => $this->category->ikon ? asset('storage/' . $this->category->ikon) : null,
                ];
            }),
            'nilai' => $this->whenLoaded('values', function() {
                $latestValue = $this->values->sortByDesc('tanggal_update')->first();
                if ($latestValue) {
                    return [
                        'min' => (float) $latestValue->harga_minimum,
                        'max' => (float) $latestValue->harga_maksimum,
                        'satuan' => $latestValue->satuan,
                        'tanggal_update' => $latestValue->tanggal_update->format('Y-m-d'),
                    ];
                }
                return null;
            }),
            'is_favorite' => $this->when(isset($this->is_favorite), $this->is_favorite),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
```

### 3. TutorialResource

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TutorialResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->tutorial_id,
            'judul' => $this->judul,
            'deskripsi' => $this->deskripsi,
            'jenis_tutorial' => $this->jenis_tutorial,
            'media' => $this->media ? json_decode($this->media, true) : null,
            'tingkat_kesulitan' => $this->tingkat_kesulitan,
            'estimasi_waktu' => $this->estimasi_waktu,
            'waste_type' => $this->whenLoaded('wasteType', function() {
                return [
                    'id' => $this->wasteType->waste_id,
                    'nama' => $this->wasteType->nama_sampah,
                ];
            }),
            'rating_average' => $this->when(isset($this->average_rating), $this->average_rating),
            'is_completed' => $this->when(isset($this->is_completed), $this->is_completed),
            'is_saved' => $this->when(isset($this->is_saved), $this->is_saved),
            'user_rating' => $this->when(isset($this->user_rating), $this->user_rating),
            'comments_count' => $this->when(isset($this->comments_count), $this->comments_count),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
```

## Tahapan Implementasi

Berikut adalah tahapan implementasi backend untuk menyambungkan halaman-halaman frontend dengan database:

### Tahap 1: Persiapan & Dasar

1. **Model dan Migrasi**
   - Verifikasi semua migrasi database yang dibutuhkan
   - Buat model Laravel untuk semua tabel
   - Definisikan relasi antar model

2. **Auth & User Management**
   - Implementasi login dan register (AuthController)
   - Pasang Laravel Sanctum untuk autentikasi token
   - Implementasi profile management (UserController)

3. **Setup API Resource**
   - Buat API Resource untuk semua entitas
   - Definisikan struktur response yang konsisten

### Tahap 2: Katalog & Detail Sampah

1. **WasteCategory dan WasteType**
   - Implementasi endpoint untuk daftar kategori
   - Implementasi endpoint untuk daftar sampah dengan filter dan pagination
   - Implementasi endpoint untuk detail sampah

2. **Favorit Feature**
   - Buat tabel pivot user_favorite_waste_types
   - Implementasi endpoint toggle favorit
   - Sambungkan dengan frontend Katalog.jsx dan DetailSampah.jsx

### Tahap 3: Panduan Daur Ulang

1. **Tutorial Management**
   - Implementasi endpoint untuk daftar tutorial dengan filter
   - Implementasi endpoint untuk detail tutorial

2. **User-Tutorial Interaction**
   - Buat tabel pivot untuk completed dan saved tutorials
   - Implementasi endpoint untuk toggle completed/saved
   - Implementasi rating dan komentar tutorial
   - Sambungkan dengan frontend DaurUlang.jsx dan DetailPanduan.jsx

### Tahap 4: Tracking Sampah

1. **User Waste Tracking**
   - Implementasi CRUD untuk user_waste_tracking
   - Implementasi statistik dan visualisasi data
   - Hitung estimasi nilai dan dampak lingkungan
   - Sambungkan dengan frontend Tracking.jsx

### Tahap 5: Forum Diskusi

1. **Thread & Comment Management**
   - Implementasi CRUD untuk thread dan comment
   - Implementasi nested comments
   - Implementasi paginasi dan filtering
   - Sambungkan dengan frontend Forum.jsx dan DetailForum.jsx



### Tahap 7: Home & Dashboard

1. **Home Data**
   - Implementasi endpoint agregat untuk data beranda
   - Sambungkan dengan frontend Home.jsx

2. **User Dashboard**
   - Implementasi statistik user
   - Sambungkan dengan dashboard di frontend

### Tahap 8: Testing & Optimasi

1. **Unit & Feature Testing**
   - Tulis unit test untuk model dan controller
   - Tulis feature test untuk API endpoints

2. **Optimasi**
   - Implementasi caching untuk query yang berat
   - Optimasi query database dengan eager loading
   - Implementasi indexing untuk pencarian yang efisien

## Kesimpulan

Implementasi backend untuk aplikasi Revalio akan mengikuti arsitektur RESTful API dengan Laravel. Setiap halaman frontend akan terhubung dengan endpoint API yang sesuai untuk mengambil dan mengelola data dari database.

Penting untuk memperhatikan:

1. **Autentikasi & Otorisasi** - Pastikan setiap endpoint dilindungi dengan autentikasi yang sesuai
2. **Validasi** - Validasi input dengan ketat untuk mencegah data yang tidak valid
3. **Error Handling** - Berikan response error yang informatif dan konsisten
4. **Optimization** - Optimasi query database dan gunakan caching untuk performa yang baik
5. **Testing** - Tulis test untuk memastikan API bekerja sesuai harapan

Dengan mengikuti tahapan implementasi dan best practice di atas, backend Revalio akan berfungsi dengan baik dan mendukung semua fitur yang diperlukan oleh frontend.
