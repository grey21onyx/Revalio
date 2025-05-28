import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from '../../config/axios';
import { Box, CircularProgress, Typography } from '@mui/material';

// Fix untuk icon Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Default icon
const defaultIcon = new L.Icon.Default();

// Inisialisasi ikon yang berbeda untuk tiap jenis pengepul
const createMarkerIcon = (color) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color};" class="marker-pin"></div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -36]
  });
};

// Gunakan warna berbeda untuk tiap jenis pengepul
const wasteIcons = {
  default: defaultIcon,
  'bank sampah': createMarkerIcon('#4CAF50'), // Hijau
  'pengepul': createMarkerIcon('#2196F3'), // Biru
  'pabrik': createMarkerIcon('#FF9800')  // Oranye
};

const MapView = ({ height = '500px', filters = {} }) => {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const userMarkerRef = useRef(null);
  const styleRef = useRef(null);

  // Tambah CSS untuk marker kustom
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .marker-pin {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        position: relative;
      }
      .marker-pin::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 10px;
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 10px solid inherit;
      }
      .user-location-marker {
        position: relative;
      }
      .pulse {
        width: 20px;
        height: 20px;
        background: rgba(0, 128, 255, 0.7);
        border-radius: 50%;
        position: relative;
      }
      .pulse:after {
        content: "";
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: rgba(0, 128, 255, 0.3);
        animation: pulse 1.5s infinite;
        left: 0;
        top: 0;
      }
      @keyframes pulse {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        100% {
          transform: scale(3);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    styleRef.current = style;

    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
      }
    };
  }, []);

  // Inisialisasi peta
  useEffect(() => {
    if (!mapRef.current) return;
    
    if (!leafletMap.current) {
      // Default view ke Indonesia
      leafletMap.current = L.map(mapRef.current).setView([-2.5489, 118.0149], 5);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(leafletMap.current);
      
      // Tambahkan tombol lokasi pengguna
      const LocateControl = L.Control.extend({
        options: {
          position: 'topleft'
        },
        
        onAdd: function(map) {
          const button = L.DomUtil.create('button', 'locate-button');
          button.innerHTML = 'Cari Lokasi Terdekat';
          button.style.padding = '8px 12px';
          button.style.backgroundColor = '#fff';
          button.style.border = '2px solid #ccc';
          button.style.borderRadius = '4px';
          button.style.cursor = 'pointer';
          
          L.DomEvent.on(button, 'click', function(e) {
            L.DomEvent.stop(e);
            getUserLocation();
          });
          
          return button;
        }
      });
      
      new LocateControl().addTo(leafletMap.current);
    }
    
    return () => {
      if (leafletMap.current && mapRef.current) {
        clearMarkers(); // Bersihkan marker saat component unmount
      }
    };
  }, []);
  
  // Load data pengepul sampah dari API
  useEffect(() => {
    fetchWasteBuyerLocations();
  }, [filters]);
  
  // Mengambil data lokasi pengepul sampah dari API
  const fetchWasteBuyerLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Bersihkan marker yang ada
      clearMarkers();
      
      // Buat parameter API dari filter yang ada
      const params = { ...filters };
      
      // Gunakan endpoint publik agar bisa diakses tanpa login
      const response = await axios.get('/v1/public/waste-buyers', { params });
      const locations = response.data.data || [];
      
      // Tambahkan marker untuk setiap lokasi
      locations.forEach(location => {
        if (location.latitude && location.longitude) {
          addMarker(location);
        }
      });
      
      // Jika hanya ada 1 lokasi, zoom ke lokasi tersebut
      if (locations.length === 1 && locations[0].latitude && locations[0].longitude) {
        leafletMap.current.setView([locations[0].latitude, locations[0].longitude], 15);
      } 
      // Jika ada beberapa lokasi, fit bounds ke semua lokasi
      else if (locations.length > 1) {
        const bounds = [];
        locations.forEach(loc => {
          if (loc.latitude && loc.longitude) {
            bounds.push([loc.latitude, loc.longitude]);
          }
        });
        
        if (bounds.length > 0) {
          leafletMap.current.fitBounds(bounds, {
            padding: [50, 50],
            maxZoom: 15
          });
        }
      }
    } catch (err) {
      console.error('Error fetching waste buyer locations:', err);
      setError('Gagal memuat data lokasi pengepul sampah');
    } finally {
      setLoading(false);
    }
  };
  
  // Tambah marker untuk satu lokasi pengepul sampah
  const addMarker = (location) => {
    try {
      // Pilih icon berdasarkan jenis pembeli
      let icon;
      try {
        if (location.jenis_pembeli && location.jenis_pembeli.toLowerCase() in wasteIcons) {
          icon = wasteIcons[location.jenis_pembeli.toLowerCase()];
        } else {
          icon = wasteIcons.default;
        }
      } catch (err) {
        icon = wasteIcons.default;
      }
      
      // Buat marker dan tambahkan ke peta
      const marker = L.marker([location.latitude, location.longitude], { icon })
        .addTo(leafletMap.current);
      
      // Buat konten popup
      const popupContent = `
        <div class="waste-buyer-popup">
          <h5>${location.nama_pembeli}</h5>
          <p><strong>Jenis:</strong> ${location.jenis_pembeli}</p>
          <p><strong>Alamat:</strong> ${location.alamat}</p>
          ${location.kontak ? `<p><strong>Kontak:</strong> ${location.kontak}</p>` : ''}
          ${userLocation ? `
            <p><strong>Jarak:</strong> ${calculateDistance(
              userLocation.lat, 
              userLocation.lng, 
              location.latitude, 
              location.longitude
            ).toFixed(2)} km</p>
          ` : ''}
          <a href="/waste-buyer/${location.pembeli_id}" class="map-popup-link">Detail Lengkap</a>
        </div>
      `;
      
      // Tambahkan popup ke marker
      marker.bindPopup(popupContent);
      
      // Simpan marker ke ref untuk keperluan cleanup
      markersRef.current.push(marker);
      
      return marker;
    } catch (err) {
      console.error('Error adding marker:', err);
      return null;
    }
  };
  
  // Bersihkan semua marker dari peta
  const clearMarkers = () => {
    if (leafletMap.current) {
      markersRef.current.forEach(marker => {
        leafletMap.current.removeLayer(marker);
      });
      markersRef.current = [];
    }
  };
  
  // Dapatkan lokasi pengguna
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          // Update tampilan peta ke lokasi pengguna
          leafletMap.current.setView([latitude, longitude], 14);
          
          // Tambahkan marker lokasi pengguna
          if (userMarkerRef.current) {
            leafletMap.current.removeLayer(userMarkerRef.current);
          }
          
          // Buat marker dengan ikon khusus untuk lokasi pengguna
          userMarkerRef.current = L.marker([latitude, longitude], {
            icon: L.divIcon({
              className: 'user-location-marker',
              html: '<div class="pulse"></div>',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })
          }).addTo(leafletMap.current);
        },
        (error) => {
          console.error('Error getting user location:', error);
          setError('Tidak dapat mengakses lokasi Anda. Pastikan izin lokasi diaktifkan.');
        }
      );
    } else {
      setError('Geolocation tidak didukung oleh browser Anda.');
    }
  };
  
  // Hitung jarak antara dua titik koordinat menggunakan Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius bumi dalam km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Jarak dalam km
  };
  
  // Konversi derajat ke radian
  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  return (
    <Box sx={{ position: 'relative', height, width: '100%' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      
      {loading && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 10, 
            right: 10, 
            padding: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <CircularProgress size={20} />
          <Typography variant="body2">Memuat data...</Typography>
        </Box>
      )}
      
      {error && (
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: 10, 
            left: 10, 
            right: 10,
            padding: 1,
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            border: '1px solid #ff0000',
            borderRadius: 1
          }}
        >
          <Typography color="error" variant="body2">{error}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default MapView; 