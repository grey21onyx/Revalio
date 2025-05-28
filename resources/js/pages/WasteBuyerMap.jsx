import React, { useState, useEffect, useRef, useCallback } from 'react';
import MapView from '../components/gis/MapView';
import axios from '../config/axios';
import { useAuth } from '../contexts/AuthContext';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Container, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix untuk icon Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const WasteBuyerMap = () => {
  // Context untuk auth
  const { user, isAuthenticated } = useAuth();
  const isadmin = user?.role === 'admin';
  
  // State untuk data
  const [wasteTypes, setWasteTypes] = useState([]);
  const [cities, setCities] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [wasteBuyers, setWasteBuyers] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  
  // State untuk admin
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  
  // Refs untuk peta
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markerRef = useRef(null);
  
  // Ambil data untuk filter
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        setLoading(true);
        
        // Gunakan endpoint publik untuk waste types
        const wasteTypesResponse = await axios.get('/v1/public/waste-types');
        setWasteTypes(wasteTypesResponse.data.data || []);
        
        try {
          // Gunakan endpoint publik untuk kota
          const citiesResponse = await axios.get('/v1/public/waste-buyers/cities');
          setCities(citiesResponse.data.cities || []);
        } catch (cityError) {
          console.warn('Error fetching cities:', cityError);
          // Jika gagal, gunakan default
          setCities([]);
        }
        
        try {
          // Gunakan endpoint publik untuk provinsi
          const provincesResponse = await axios.get('/v1/public/waste-buyers/provinces');
          setProvinces(provincesResponse.data.provinces || []);
        } catch (provinceError) {
          console.warn('Error fetching provinces:', provinceError);
          // Jika gagal, gunakan default
          setProvinces([]);
        }
        
        // Jika user adalah admin dan terotentikasi, ambil semua pengepul
        if (isadmin && isAuthenticated) {
          try {
            const wasteBuyersResponse = await axios.get('/v1/waste-buyers', {
              params: { status: 'AKTIF' }
            });
            setWasteBuyers(wasteBuyersResponse.data.data || []);
          } catch (adminError) {
            console.error('Error fetching waste buyers:', adminError);
            setError('Gagal memuat data pengepul. Pastikan Anda memiliki izin admin.');
          }
        }
      } catch (error) {
        console.error('Error fetching filter data:', error);
        setError('Gagal memuat data filter');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFilterData();
  }, [isadmin, isAuthenticated]);
  
  // Handle perubahan filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    if (value) {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      // Hapus filter jika valuenya kosong
      const newFilters = { ...filters };
      delete newFilters[name];
      setFilters(newFilters);
    }
  };
  
  // Reset semua filter
  const handleResetFilters = () => {
    setFilters({});
  };
  
  // Handle perubahan tab
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Fungsi untuk inisialisasi peta
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !mapDialogOpen) return;
    
    // Destroy map if it exists to avoid issues
    if (leafletMap.current) {
      leafletMap.current.remove();
      leafletMap.current = null;
    }
    
    // Buat instance peta baru
    leafletMap.current = L.map(mapRef.current, {
      center: [-6.200000, 106.816666],
      zoom: 10,
      attributionControl: true
    });
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(leafletMap.current);
    
    // Add click handler to map
    leafletMap.current.on('click', (e) => {
      const { lat, lng } = e.latlng;
      setCoordinates({ lat, lng });
      
      // Update marker position
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(leafletMap.current);
      }
    });
    
    // Check if buyer already has coordinates
    if (selectedBuyer?.lokasi) {
      const { latitude, longitude } = selectedBuyer.lokasi;
      setCoordinates({ lat: latitude, lng: longitude });
      
      // Update map view to buyer location
      leafletMap.current.setView([latitude, longitude], 15);
      
      // Add marker
      markerRef.current = L.marker([latitude, longitude]).addTo(leafletMap.current);
    }
    
    setMapReady(true);
    
    // Invalidate size after a delay to ensure container is fully rendered
    setTimeout(() => {
      if (leafletMap.current) {
        leafletMap.current.invalidateSize(true);
      }
    }, 300);
  }, [mapDialogOpen, selectedBuyer]);
  
  // Set up dialog opened event handler
  useEffect(() => {
    if (mapDialogOpen && mapRef.current) {
      // Delay initialization slightly to ensure the dialog is rendered
      setTimeout(initializeMap, 100);
    } else {
      setMapReady(false);
      // Clean up map when dialog closes
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
      if (markerRef.current) {
        markerRef.current = null;
      }
    }
  }, [mapDialogOpen, initializeMap]);
  
  // Handle window resize to update map
  useEffect(() => {
    const handleResize = () => {
      if (mapDialogOpen && leafletMap.current) {
        leafletMap.current.invalidateSize(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mapDialogOpen]);
  
  // Filter buyers berdasarkan pencarian
  const filteredBuyers = wasteBuyers.filter(buyer => 
    buyer.nama_pembeli.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buyer.alamat.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (buyer.kota && buyer.kota.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Handle buyer selection
  const handleSelectBuyer = (buyer) => {
    setSelectedBuyer(buyer);
    setMapDialogOpen(true);
    setError(null);
    setSuccess(null);
  };
  
  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle saving location
  const handleSaveLocation = async () => {
    try {
      if (!selectedBuyer) {
        setError('Tidak ada pengepul yang dipilih');
        return;
      }
      
      if (!coordinates.lat || !coordinates.lng) {
        setError('Silakan pilih lokasi pada peta');
        return;
      }
      
      const buyerId = selectedBuyer.buyer_id;
      
      // CSRF protection - get token dari cookies
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      };

      // Dapatkan CSRF token
      let csrfToken = getCookie('XSRF-TOKEN');
      if (csrfToken) {
        csrfToken = decodeURIComponent(csrfToken);
      }
      
      // Kirim request ke API untuk update lokasi
      await axios.put(`/v1/gis/location/${buyerId}`, {
        latitude: coordinates.lat,
        longitude: coordinates.lng
      }, {
        headers: {
          'X-CSRF-TOKEN': csrfToken
        }
      });
      
      // Update lokasi di state
      setWasteBuyers(prevBuyers => {
        return prevBuyers.map(buyer => {
          if (buyer.buyer_id === buyerId) {
            return {
              ...buyer,
              lokasi: {
                latitude: coordinates.lat,
                longitude: coordinates.lng
              }
            };
          }
          return buyer;
        });
      });
      
      // Set success message
      setSuccess('Lokasi pengepul berhasil diperbarui');
      
      // Close dialog
      setMapDialogOpen(false);
    } catch (error) {
      console.error('Error saving location:', error);
      setError('Gagal menyimpan lokasi: ' + (error.response?.data?.message || error.message));
    }
  };
  
  // Tutup dialog
  const handleCloseMapDialog = () => {
    setMapDialogOpen(false);
  };
  
  // Handle dialog setelah terbuka sepenuhnya
  const handleDialogEntered = () => {
    initializeMap();
  };
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
        Peta Lokasi Pengepul Sampah
      </Typography>
      
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      {isadmin && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="peta pengepul tabs">
            <Tab label="Lihat Peta" />
            <Tab label="Kelola Lokasi" />
          </Tabs>
        </Box>
      )}
      
      {(!isadmin || activeTab === 0) && (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Filter Peta" />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel id="waste-type-label">Jenis Sampah</InputLabel>
                        <Select
                          labelId="waste-type-label"
                          name="waste_id"
                          value={filters.waste_id || ''}
                          onChange={handleFilterChange}
                          label="Jenis Sampah"
                        >
                          <MenuItem key="all-waste-types" value="">Semua Jenis Sampah</MenuItem>
                          {wasteTypes.map(type => (
                            <MenuItem key={`waste-type-${type.waste_id}`} value={type.waste_id}>
                              {type.nama_sampah}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel id="buyer-type-label">Jenis Pengepul</InputLabel>
                        <Select
                          labelId="buyer-type-label"
                          name="jenis_pembeli"
                          value={filters.jenis_pembeli || ''}
                          onChange={handleFilterChange}
                          label="Jenis Pengepul"
                        >
                          <MenuItem key="all-types" value="">Semua Jenis</MenuItem>
                          <MenuItem key="bank-sampah" value="bank sampah">Bank Sampah</MenuItem>
                          <MenuItem key="pengepul" value="pengepul">Pengepul</MenuItem>
                          <MenuItem key="pabrik" value="pabrik">Pabrik</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel id="city-label">Kota</InputLabel>
                        <Select
                          labelId="city-label"
                          name="kota"
                          value={filters.kota || ''}
                          onChange={handleFilterChange}
                          label="Kota"
                        >
                          <MenuItem key="all-cities" value="">Semua Kota</MenuItem>
                          {cities.map((city, index) => (
                            <MenuItem key={`city-${index}-${city.replace(/\s+/g, '-').toLowerCase()}`} value={city}>
                              {city}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel id="province-label">Provinsi</InputLabel>
                        <Select
                          labelId="province-label"
                          name="provinsi"
                          value={filters.provinsi || ''}
                          onChange={handleFilterChange}
                          label="Provinsi"
                        >
                          <MenuItem value="">Semua</MenuItem>
                          {provinces.map((province) => (
                            <MenuItem key={province} value={province}>
                              {province}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ textAlign: 'right', mt: 2 }}>
                    <Button 
                      variant="contained" 
                      color="secondary"
                      onClick={handleResetFilters}
                      disabled={Object.keys(filters).length === 0}
                    >
                      Reset Filter
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Card>
            <CardContent>
              <MapView height="600px" filters={filters} />
            </CardContent>
          </Card>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Petunjuk Penggunaan</Typography>
            <ul>
              <li>Gunakan filter di atas untuk menyaring lokasi pengepul sampah berdasarkan jenis sampah, jenis pengepul, kota, atau provinsi.</li>
              <li>Klik tombol "Cari Lokasi Terdekat" pada peta untuk menemukan pengepul sampah di sekitar lokasi Anda (membutuhkan izin akses lokasi).</li>
              <li>Klik marker pada peta untuk melihat informasi detail tentang pengepul sampah tersebut.</li>
            </ul>
          </Box>
        </>
      )}
      
      {isadmin && activeTab === 1 && (
        <Card>
          <CardHeader title="Kelola Lokasi Pengepul Sampah" />
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <TextField 
                sx={{ flexGrow: 1, mr: 2 }}
                variant="outlined"
                placeholder="Cari pengepul sampah..."
                value={searchQuery}
                onChange={handleSearch}
              />
              {/* 
                TODO: Update the URL '/admin/waste-buyers/create' below with the actual URL 
                for creating a new waste buyer in your application.
              */}
              <Button
                variant="contained"
                color="success"
                onClick={() => window.location.href = '/admin/waste-buyers/create'}
                startIcon={<AddIcon />}
              >
                Tambah Pengepul Baru
              </Button>
            </Box>
            
            <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
              {loading ? (
                <Typography>Memuat data pengepul...</Typography>
              ) : filteredBuyers.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography>Tidak ada data pengepul yang sesuai dengan pencarian</Typography>
                  {searchQuery ? (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Coba ubah kata kunci pencarian atau kosongkan pencarian untuk melihat semua pengepul
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Database pengepul sampah masih kosong. Klik tombol "Tambah Pengepul Baru" di atas untuk mulai menambahkan data pengepul sampah.
                    </Typography>
                  )}
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Nama Pengepul</TableCell>
                        <TableCell>Alamat</TableCell>
                        <TableCell>Status Lokasi</TableCell>
                        <TableCell>Aksi</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredBuyers.map(buyer => (
                        <TableRow 
                          key={buyer.buyer_id}
                          selected={selectedBuyer?.buyer_id === buyer.buyer_id}
                        >
                          <TableCell>{buyer.nama_pembeli}</TableCell>
                          <TableCell>{buyer.alamat}</TableCell>
                          <TableCell>
                            {buyer.lokasi ? (
                              <Chip color="success" size="small" label="Sudah Ada" />
                            ) : (
                              <Chip color="error" size="small" label="Belum Ada" />
                            )}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outlined" 
                              size="small"
                              onClick={() => handleSelectBuyer(buyer)}
                            >
                              {buyer.lokasi ? 'Edit Lokasi' : 'Tambah Lokasi'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </CardContent>
        </Card>
      )}
      
      {/* Dialog untuk peta lokasi */}
      <Dialog
        open={mapDialogOpen}
        onClose={handleCloseMapDialog}
        maxWidth="lg"
        fullWidth
        TransitionProps={{
          onEntered: handleDialogEntered
        }}
      >
        <DialogTitle>
          {selectedBuyer ? 
            (selectedBuyer.lokasi ? 'Edit Lokasi' : 'Tambah Lokasi') + ' - ' + selectedBuyer.nama_pembeli 
            : 'Lokasi Pengepul'}
        </DialogTitle>
        <DialogContent>
          {selectedBuyer && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography><strong>Nama:</strong> {selectedBuyer.nama_pembeli}</Typography>
                <Typography><strong>Jenis:</strong> {selectedBuyer.jenis_pembeli}</Typography>
                <Typography><strong>Alamat:</strong> {selectedBuyer.alamat}</Typography>
                {selectedBuyer.kota && <Typography><strong>Kota:</strong> {selectedBuyer.kota}</Typography>}
                {selectedBuyer.provinsi && <Typography><strong>Provinsi:</strong> {selectedBuyer.provinsi}</Typography>}
                <Typography><strong>Kontak:</strong> {selectedBuyer.kontak}</Typography>
                
                {coordinates.lat && coordinates.lng && (
                  <Box sx={{ my: 2 }}>
                    <Typography sx={{ fontWeight: 'bold' }}>Koordinat yang Dipilih:</Typography>
                    <Typography>Latitude: {coordinates.lat.toFixed(6)}</Typography>
                    <Typography>Longitude: {coordinates.lng.toFixed(6)}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={8}>
                <Box 
                  ref={mapRef} 
                  sx={{ height: 400, width: '100%', border: '1px solid #ccc' }}
                  className="map-container"
                />
                <Typography sx={{ mt: 1, fontSize: '0.875rem', color: 'text.secondary' }}>
                  Klik pada peta untuk menentukan lokasi pengepul sampah
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMapDialog}>Batal</Button>
          <Button 
            onClick={handleSaveLocation}
            variant="contained" 
            color="primary"
            disabled={loading || !coordinates.lat || !coordinates.lng}
          >
            {loading ? 'Menyimpan...' : 'Simpan Lokasi'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WasteBuyerMap; 