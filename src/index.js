import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { ProductsContextProvider } from './context/ProductContext';
import { AdminAuthContextProvider } from './context/AdminAuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <BrowserRouter>
        <React.StrictMode>
            <AuthContextProvider>
            <AdminAuthContextProvider>
                    <ProductsContextProvider>
                        <App />
                    </ProductsContextProvider>
                </AdminAuthContextProvider>
            </AuthContextProvider>
        </React.StrictMode>
    </BrowserRouter>

);