import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleGuard = ({ allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Determine fallback based on role (prevent infinite loops if redirection is wrong elsewhere)
        console.warn(`Access denied for role: ${user.role} to restricted route.`);

        // Redirect to their appropriate dashboard
        if (user.role === 'Operator') return <Navigate to="/operator" replace />;
        if (user.role === 'Site Manager') return <Navigate to="/site-manager" replace />;
        if (user.role === 'Oxygens Admin') return <Navigate to="/admin" replace />;
        if (user.role === 'Engineer') return <Navigate to="/engineer" replace />;

        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default RoleGuard;
