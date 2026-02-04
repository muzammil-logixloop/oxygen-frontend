import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Database, Settings, User } from 'lucide-react';

const Dashboard = () => {
    const stats = [
        { label: 'Total Customers', value: '12', color: 'text-white', bg: 'bg-slate-700' },
        { label: 'Active Chambers', value: '45', color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Open Issues', value: '7', color: 'text-red-400', bg: 'bg-red-500/10' },
        { label: 'System Health', value: '99%', color: 'text-green-400', bg: 'bg-green-500/10' },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                <p className="text-slate-400">System-wide administration and monitoring.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-slate-800/50 border border-white/5 p-6 rounded-2xl">
                        <div className="text-slate-400 text-sm font-medium mb-2">{stat.label}</div>
                        <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                    </div>
                ))}
            </div>

            <h2 className="text-xl font-bold text-white mb-6">Admin Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/admin/profile" className="group p-6 bg-slate-800 border border-slate-700 rounded-2xl hover:bg-slate-700/80 hover:border-blue-500/50 transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                        <User size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-white mb-2">My Profile</h3>
                    <p className="text-sm text-slate-400">View and edit your personal details.</p>
                </Link>

                <Link to="/admin/users" className="group p-6 bg-slate-800 border border-slate-700 rounded-2xl hover:bg-slate-700/80 hover:border-indigo-500/50 transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                        <Users size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-white mb-2">Manage Users</h3>
                    <p className="text-sm text-slate-400">Add, remove, or modify user roles.</p>
                </Link>

                <div className="group p-6 bg-slate-800 border-slate-700 border rounded-2xl hover:bg-slate-700/80 hover:border-purple-500/50 transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                        <Database size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-white mb-2">System Data</h3>
                    <p className="text-sm text-slate-400">Access raw data and logs.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
