import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../guards/ProtectedRoute';
import RoleGuard from '../guards/RoleGuard';
import Layout from '../components/Layout';

// Auth Pages
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';

// Shared
import Profile from '../pages/shared/Profile';

// Placeholder Pages
import OperatorDashboard from '../pages/operator/Dashboard';
import ChecklistForm from '../pages/operator/ChecklistForm';
import IssueReport from '../pages/operator/IssueReport';
import SiteManagerDashboard from '../pages/site-manager/Dashboard';
import AdminDashboard from '../pages/admin/Dashboard';
import Customers from '../pages/admin/Customers';
import Chambers from '../pages/admin/Chambers';
import Users from '../pages/admin/Users';
import EngineerDashboard from '../pages/engineer/Dashboard';
import MyChambers from '../pages/operator/MyChambers';
import Issues from '../pages/admin/Issues';
import MyChecklists from '../pages/operator/MyChecklists';
import Myissues from '../pages/engineer/Myissues';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>

                    {/* Operator Routes */}
                    <Route element={<RoleGuard allowedRoles={['Operator']} />}>
                        <Route path="/operator" element={<OperatorDashboard />} />
                        <Route path="/operator/profile" element={<Profile />} />
                        <Route path="/operator/checklists" element={<MyChambers />} />
                        <Route path="/operator/submissions" element={<MyChecklists />} />
                        <Route path="/operator/checklist/:chamberId" element={<ChecklistForm />} />
                        <Route path="/operator/report-issue/:chamberId" element={<IssueReport />} />
                    </Route>

                    {/* Site Manager Routes */}
                    <Route element={<RoleGuard allowedRoles={['Site Manager']} />}>
                        <Route path="/site-manager" element={<SiteManagerDashboard />} />
                        <Route path="/site-manager/profile" element={<Profile />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route element={<RoleGuard allowedRoles={['Oxygens Admin']} />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/profile" element={<Profile />} />
                        <Route path="/admin/customers" element={<Customers />} />
                        <Route path="/admin/chambers" element={<Chambers />} />
                        <Route path="/admin/users" element={<Users />} />
                        <Route path="/admin/issues" element={<Issues />} />
                    </Route>

                    {/* Engineer Routes */}
                    <Route element={<RoleGuard allowedRoles={['Engineer']} />}>
                        <Route path="/engineer" element={<EngineerDashboard />} />
                        <Route path="/engineer/profile" element={<Profile />} />
                        <Route path="/engineer/my-issues" element={<Myissues />} />
                    </Route>

                </Route>
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;
