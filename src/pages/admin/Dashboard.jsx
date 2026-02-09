import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Database, User } from 'lucide-react';
import { statstics } from '../../services/adminService';

const Dashboard = () => {
    const [stats, setStats] = React.useState([]);

    React.useEffect(() => { 
        const fetchStats = async () => {
            try {
                const data = await statstics();

                const statsArray = [
                    { label: 'Total Users', value: data.userCount, color: 'text-white' },
                    { label: 'Total Customers', value: data.customerCount, color: 'text-blue-400' },
                    { label: 'Total Chambers', value: data.chamberCount, color: 'text-purple-400' },
                    { label: 'Suspended Chambers', value: data.suspendedChamberCount, color: 'text-red-400' },
                    { label: 'Open Issues', value: data.openIssuesCount, color: 'text-yellow-400' },
                    { label: 'Closed Issues', value: data.closedIssuesCount, color: 'text-green-400' }
                ];

                setStats(statsArray);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
        };
        fetchStats();
    }, []);

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
