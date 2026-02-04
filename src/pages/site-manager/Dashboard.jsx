import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, FileText, User } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();

    const stats = [
        { label: 'Site Compliance', value: '92%', color: 'text-green-400', bg: 'bg-green-400/10' },
        { label: 'Pending Reviews', value: '5', color: 'text-amber-400', bg: 'bg-amber-400/10' },
        { label: 'Active Operators', value: '8', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Site Manager Dashboard</h1>
                <p className="text-slate-400">Overview of site operations and compliance status.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-slate-800/50 border border-white/5 p-6 rounded-2xl">
                        <div className="text-slate-400 text-sm font-medium mb-2">{stat.label}</div>
                        <div className={`text-4xl font-bold ${stat.color}`}>{stat.value}</div>
                    </div>
                ))}
            </div>

            <h2 className="text-xl font-bold text-white mb-6">Management Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/site-manager/profile" className="group p-6 bg-slate-800 border border-slate-700 rounded-2xl hover:bg-slate-700/80 hover:border-blue-500/50 transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                        <User size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-white mb-2">My Profile</h3>
                    <p className="text-sm text-slate-400">View and edit your personal details.</p>
                </Link>

                <div className="group p-6 bg-slate-800 border-slate-700 border rounded-2xl hover:bg-slate-700/80 hover:border-green-500/50 transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400 mb-4 group-hover:scale-110 transition-transform">
                        <ShieldCheck size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-white mb-2">Compliance</h3>
                    <p className="text-sm text-slate-400">Review site safety compliance reports.</p>
                </div>

                <div className="group p-6 bg-slate-800 border-slate-700 border rounded-2xl hover:bg-slate-700/80 hover:border-amber-500/50 transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                        <FileText size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-white mb-2">Reports</h3>
                    <p className="text-sm text-slate-400">Generate monthly usage reports.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
