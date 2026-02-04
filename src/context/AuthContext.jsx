import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, logoutUser, getMe } from '../services/authService';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await getMe();
                    setUser(userData);
                } catch (error) {
                    console.error("Auth initialization failed", error);
                    logoutUser();
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email, password) => {
        const data = await loginUser(email, password);
        localStorage.setItem('token', data.token);
        // Decode token or use response user data. For simplicity, use response.
        // If we want exact persistence, we can rely on getMe, but response is faster.
        setUser(data.user);
        return data.user;
    };

    const logout = () => {
        logoutUser();
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
