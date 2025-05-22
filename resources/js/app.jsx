import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import theme dan AuthProvider
import theme from './theme/theme';
import { AuthProvider } from './contexts/AuthContext';

// Import routes
import AppRoutes from './routes';

// Import CSS
import '../css/app.css';

function App() {
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
