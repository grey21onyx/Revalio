import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import axios, { fetchCsrfCookie } from './config/axios';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import '../css/gis.css'; // Import CSS untuk komponen GIS

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Import theme dan AuthProvider
import theme from './theme/theme';
import { AuthProvider } from './contexts/AuthContext';

// Import routes
import AppRoutes from './routes';

// Import CSS
import '../css/app.css';

function App() {
    useEffect(() => {
        const getCsrfToken = async () => {
            try {
                console.log('Mengambil CSRF cookie dengan retry logic...');
                await fetchCsrfCookie(3, 30000); // 3 percobaan, timeout 30 detik
                console.log('CSRF cookie berhasil diambil.');
                
                // Tambahkan meta tag CSRF token untuk axios
                const token = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('XSRF-TOKEN='))
                    ?.split('=')[1];
                
                if (token) {
                    // Decode token karena cookie di-encode
                    const decodedToken = decodeURIComponent(token);
                    
                    // Tambahkan atau perbarui meta tag
                    let metaTag = document.querySelector('meta[name="csrf-token"]');
                    if (!metaTag) {
                        metaTag = document.createElement('meta');
                        metaTag.name = 'csrf-token';
                        document.head.appendChild(metaTag);
                    }
                    metaTag.content = decodedToken;
                    
                    console.log('Meta tag CSRF token berhasil dibuat');
                }
            } catch (error) {
                console.error('Error fetching CSRF cookie:', error);
                // Pertimbangkan untuk menampilkan notifikasi ke user jika ini gagal
                // Tapi kita tidak perlu menghentikan aplikasi berjalan
            }
        };

        getCsrfToken();
    }, []);

    return (
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
                v7_fetcherPersist: true,
                v7_normalizeFormMethod: true,
                v7_partialHydration: true,
                v7_skipActionErrorRevalidation: true
            }}
        >
            <AuthProvider>
                <ThemeProvider theme={theme}>
                    {/* CssBaseline menormalisasi CSS */}
                    <CssBaseline />
                    <AppRoutes />
                </ThemeProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
