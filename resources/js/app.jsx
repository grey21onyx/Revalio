import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import axios from './config/axios';

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
                console.log('Attempting to fetch CSRF cookie...');
                await axios.get('/sanctum/csrf-cookie');
                console.log('CSRF cookie fetched successfully.');
            } catch (error) {
                console.error('Error fetching CSRF cookie:', error);
                // Pertimbangkan untuk menampilkan notifikasi ke user jika ini gagal
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
