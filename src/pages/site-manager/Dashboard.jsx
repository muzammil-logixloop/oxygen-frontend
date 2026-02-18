import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, FileText, User } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();

    const stats = [
        { label: 'Site Compliance', value: '92%', color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Pending Reviews', value: '5', color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Active Operators', value: '8', color: 'text-blue-600', bg: 'bg-blue-50' },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-main mb-2">Site Manager Dashboard</h1>
                <p className="text-text-muted">Overview of site operations and compliance status.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
                        <div className="text-text-muted text-sm font-medium mb-2">{stat.label}</div>
                        <div className={`text-4xl font-bold ${stat.color}`}>{stat.value}</div>
                    </div>
                ))}
            </div>

            <h2 className="text-xl font-bold text-text-main mb-6">Management Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/site-manager/profile" className="group p-6 bg-surface border border-border rounded-2xl hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer shadow-sm">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                        <User size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-text-main mb-2">My Profile</h3>
                    <p className="text-sm text-text-muted">View and edit your personal details.</p>
                </Link>

                <div className="group p-6 bg-surface border-border border rounded-2xl hover:bg-slate-50 hover:border-green-200 transition-all cursor-pointer shadow-sm">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
                        <ShieldCheck size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-text-main mb-2">Compliance</h3>
                    <p className="text-sm text-text-muted">Review site safety compliance reports.</p>
                </div>

                <div className="group p-6 bg-surface border-border border rounded-2xl hover:bg-slate-50 hover:border-amber-200 transition-all cursor-pointer shadow-sm">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                        <FileText size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-text-main mb-2">Reports</h3>
                    <p className="text-sm text-text-muted">Generate monthly usage reports.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
