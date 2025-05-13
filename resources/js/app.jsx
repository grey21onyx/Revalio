import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import store dan theme
import { store } from './store';
import theme from './theme/theme';

// Import komponen halaman
import Home from './pages/Home';
import About from './pages/About';
import Katalog from './pages/Katalog';
import DaurUlang from './pages/DaurUlang';
import Tracking from './pages/Tracking';
import Forum from './pages/Forum';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';

// Import CSS
import '../css/app.css';

function App() {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                {/* CssBaseline menormalisasi CSS */}
                <CssBaseline />
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/katalog" element={<Katalog />} />
                        <Route path="/daur-ulang" element={<DaurUlang />} />
                        <Route path="/tracking" element={<Tracking />} />
                        <Route path="/forum" element={<Forum />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </Provider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
