import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleGuard = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    // WAIT for authentication to finish
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.warn(`Access denied for role: ${user.role} to restricted route.`);

        if (user.role === 'Operator') return <Navigate to="/operator" replace />;
        if (user.role === 'Site Manager') return <Navigate to="/site-manager" replace />;
        if (user.role === 'Oxygens Admin') return <Navigate to="/admin" replace />;
        if (user.role === 'Engineer') return <Navigate to="/engineer" replace />;

        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default RoleGuard;
