import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import axiosInstance from './api/axiosInstance';
import LoginPage from './pages/auth/login';
import AppLayout from './component/layout/AppLayout';
import Dashboard from './pages/dashboard/dashboard';

const ProtectedRoute = () => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};

function App() {
    React.useEffect(() => {
        const handleStorageChange = () => {
            if (!sessionStorage.getItem('token') && !localStorage.getItem('token')) {
                window.location.href = '/login';
            }
        };
        window.addEventListener('storage', handleStorageChange);
        const interceptor = axiosInstance.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    sessionStorage.removeItem('token');
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            axiosInstance.interceptors.response.eject(interceptor);
        };
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                        <Route path="/" element={<Dashboard />} />
                    </Route>
                </Route>

                <Route path="*" element={
                    <div className='flex h-screen flex-col items-center justify-center bg-[#F0F9FF]'>
                        <h1 className='text-4xl font-bold text-[#0284C7]'>404</h1>
                        <p className='text-lg text-gray-600 mt-2'>Halaman Tidak Ditemukan</p>
                    </div>
                } />
            </Routes>
        </Router>
    );
}

export default App;
