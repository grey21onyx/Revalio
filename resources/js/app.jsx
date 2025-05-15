import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import store dan theme
import theme from './theme/theme';
import store from './store';

// Import routes
import AppRoutes from './routes';

// Import CSS
import '../css/app.css';

function App() {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                {/* CssBaseline menormalisasi CSS */}
                <CssBaseline />
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </ThemeProvider>
        </Provider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
