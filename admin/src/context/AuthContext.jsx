import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        // Kiểm tra token trong localStorage khi component mount
        const token = localStorage.getItem('adminToken');
        if (token) {
            // Verify token với backend
            axios.get(`${url}/api/admin/verify`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    if (response.data.success) {
                        setAdmin(response.data.admin);
                    } else {
                        localStorage.removeItem('adminToken');
                    }
                })
                .catch(() => {
                    localStorage.removeItem('adminToken');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${url}/api/admin/login`, {
                email,
                password
            });

            if (response.data.success) {
                localStorage.setItem('adminToken', response.data.token);
                setAdmin(response.data.admin);
                return { success: true };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Đăng nhập thất bại'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setAdmin(null);
    };

    return (
        <AuthContext.Provider value={{ admin, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 