import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, logoutUser, getMe } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const userData = await getMe();

                // Normalize role structure
                const normalizedUser = {
                    ...userData,
                    role: userData.Role?.name
                };

                setUser(normalizedUser);
            } catch (error) {
                console.error("Auth initialization failed", error);
                localStorage.removeItem('token');
                setUser(null);
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        const data = await loginUser(email, password);
        localStorage.setItem('token', data.token);

        // Normalize user from login response as well
        

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
