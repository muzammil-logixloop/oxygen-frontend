import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Database, User } from 'lucide-react';
import { statistics } from '../../services/adminService';

const Dashboard = () => {
    const [stats, setStats] = React.useState([]);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await statistics();

                const statsArray = [
                    { label: 'Total Users', value: data.userCount, color: 'text-text-main' },
                    { label: 'Total Customers', value: data.customerCount, color: 'text-emerald-400' },
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
                <h1 className="text-3xl font-bold text-text-main mb-2">Admin Dashboard</h1>
                <p className="text-text-muted">System-wide administration and monitoring.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
                        <div className="text-text-muted text-sm font-medium mb-2">{stat.label}</div>
                        <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                    </div>
                ))}
            </div>

            <h2 className="text-xl font-bold text-text-main mb-6">Admin Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/admin/profile" className="group p-6 bg-surface border border-border rounded-2xl hover:bg-emerald-50 hover:border-emerald-200 transition-all cursor-pointer shadow-sm">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                        <User size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-text-main mb-2">My Profile</h3>
                    <p className="text-sm text-text-muted">View and edit your personal details.</p>
                </Link>

                <Link to="/admin/users" className="group p-6 bg-surface border border-border rounded-2xl hover:bg-slate-50 hover:border-indigo-200 transition-all cursor-pointer shadow-sm">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                        <Users size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-text-main mb-2">Manage Users</h3>
                    <p className="text-sm text-text-muted">Add, remove, or modify user roles.</p>
                </Link>

                {/* <div className="group p-6 bg-surface border-border border rounded-2xl hover:bg-slate-50 hover:border-purple-200 transition-all cursor-pointer shadow-sm">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                        <Database size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-text-main mb-2">System Data</h3>
                    <p className="text-sm text-text-muted">Access raw data and logs.</p>
                </div> */}
            </div>
        </div>
    );
};

export default Dashboard;
