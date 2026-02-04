import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-6 py-8 animate-fade-in">
                <Outlet />
            </main>
            <footer className="border-t border-white/5 py-6 mt-8">
                <div className="container mx-auto px-6 text-center text-slate-600 text-sm">
                    &copy; {new Date().getFullYear()} Oxygens Chamber Portal. Secure System.
                </div>
            </footer>
        </div>
    );
};

export default Layout;
