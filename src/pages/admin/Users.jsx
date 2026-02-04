import React, { useState, useEffect } from 'react';
import { getUsers, createUser, deleteUser, getCustomers } from '../../services/adminService';
import { Plus, User, Trash2, Shield } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', role: 'Operator', customerId: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [usersData, customersData] = await Promise.all([getUsers(), getCustomers()]);
            setUsers(usersData);
            setCustomers(customersData);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createUser(formData);
            setShowModal(false);
            setFormData({ username: '', email: '', password: '', role: 'Operator', customerId: '' });
            loadData();
        } catch (error) {
            alert('Failed to create user: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(id);
                loadData();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Users</h1>
                    <p className="text-slate-400">Manage system users, roles, and assignments.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-all"
                >
                    <Plus size={20} />
                    <span>Add User</span>
                </button>
            </div>

            <div className="bg-slate-800/50 border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-700/50 text-slate-300">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Assigned Customer</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-400">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{user.username}</div>
                                            <div className="text-sm text-slate-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${user.Role?.name === 'Oxygens Admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                            user.Role?.name === 'Engineer' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        }`}>
                                        {user.Role?.name}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-400">
                                    {user.Customer?.name || '-'}
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="text-slate-500 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Add New User</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                placeholder="Username"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Email" type="email"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Password" type="password"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
                            />

                            <select
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                                required
                            >
                                <option value="Operator">Operator</option>
                                <option value="Site Manager">Site Manager</option>
                                <option value="Engineer">Engineer</option>
                                <option value="Oxygens Admin">Oxygens Admin</option>
                            </select>

                            {(formData.role === 'Operator' || formData.role === 'Site Manager') && (
                                <select
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                    value={formData.customerId} onChange={e => setFormData({ ...formData, customerId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Customer</option>
                                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            )}

                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
