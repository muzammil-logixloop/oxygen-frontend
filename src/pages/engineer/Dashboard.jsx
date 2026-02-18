import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, CheckSquare, User } from 'lucide-react';

const Dashboard = () => {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-main mb-2">Engineer Dashboard</h1>
                <p className="text-text-muted">Manage assigned issues and maintenance tasks.</p>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-8 mb-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                    <CheckSquare size={32} />
                </div>
                <h2 className="text-xl font-semibold text-text-main mb-2">No Verified Issues</h2>
                <p className="text-text-muted">You have no pending issues assigned to you at the moment.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/engineer/profile" className="group p-6 bg-surface border border-border rounded-2xl hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer shadow-sm">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                        <User size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-text-main mb-2">My Profile</h3>
                    <p className="text-sm text-text-muted">View and edit your personal details.</p>
                </Link>

                <div className="group p-6 bg-surface border-border border rounded-2xl hover:bg-slate-50 hover:border-orange-200 transition-all cursor-pointer shadow-sm">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
                        <Wrench size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-text-main mb-2">Maintenance Log</h3>
                    <p className="text-sm text-text-muted">View history of repairs and services.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
