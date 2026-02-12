import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Bell } from 'lucide-react';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    const getNavItems = () => {
        switch (user.role) {
            case 'Operator':
                return [
                    { label: 'Dashboard', path: '/operator' },
                    { label: 'Chambers', path: '/operator/checklists' },
                    { label: 'Checklists', path: '/operator/submissions' },
                ];
            case 'Site Manager':
                return [
                    { label: 'Dashboard', path: '/site-manager' },
                    { label: 'Compliance', path: '/site-manager/compliance' },
                ];
            case 'Oxygens Admin':
                return [
                    { label: 'Dashboard', path: '/admin' },
                    { label: 'Customers', path: '/admin/customers' },
                    { label: 'Users', path: '/admin/users' },
                    { label: 'Chambers', path: '/admin/chambers' },
                    { label: 'Issues', path: '/admin/issues' },
                ];
            case 'Engineer':
                return [
                    { label: 'Dashboard', path: '/engineer' },
                    { label: 'My Issues', path: '/engineer/my-issues' },
                ];
            default:
                return [];
        }
    };

    const navItems = getNavItems();

    return (
        <header className="bg-surface/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-8">
                    {/* Logo */}
                    <Link to="/">
                        <img
                            src="/logo1.png"
                            alt="Oxygens Logo"
                            className="h-20 w-auto object-contain"
                        />
                    </Link>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex space-x-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-primary hover:bg-background rounded-lg transition-all"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center space-x-6">
                    {/* Notification Bell */}
                    <button className="text-text-muted hover:text-primary transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* User Info + Logout */}
                    <div className="flex items-center space-x-3 pl-6 border-l border-border">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-medium text-text-main">{user.username}</div>
                            <div className="text-xs text-text-muted">{user.role}</div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-background text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
