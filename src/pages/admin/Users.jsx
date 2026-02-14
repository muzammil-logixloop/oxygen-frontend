import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser, getCustomers } from '../../services/adminService';
import { Plus, User, Trash2, Edit3 } from 'lucide-react';
import { toast } from 'react-toastify';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null); // ✅ Track editing user
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

    // Handle create or update
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                // Update existing user
                await updateUser(editingUser.id, formData);
            } else {
                // Create new user
                await createUser(formData);
                toast.success('User created successfully');
            }
            setShowModal(false);
            setEditingUser(null);
            setFormData({ username: '', email: '', password: '', role: 'Operator', customerId: '' });
            loadData();
            if (editingUser) toast.success('User updated successfully');
        } catch (error) {
            toast.error('Operation failed: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(id);
                toast.success('User deleted successfully');
                loadData();
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('Failed to delete user');
            }
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            password: '', // leave empty for optional change
            role: user.Role?.name || 'Operator',
            customerId: user.Customer?.id || ''
        });
        setShowModal(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-text-main mb-2">Users</h1>
                    <p className="text-text-muted">Manage system users, roles, and assignments.</p>
                </div>
                <button
                    onClick={() => { setEditingUser(null); setShowModal(true); }}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-all"
                >
                    <Plus size={20} />
                    <span>Add User</span>
                </button>
            </div>

            <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-text-muted">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Assigned Customer</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                                        <User size={16} />
                                    </div>
                                    <div>
                                        <div className="font-medium text-text-main">{user.username}</div>
                                        <div className="text-sm text-text-muted">{user.email}</div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${user.Role?.name === 'Oxygens Admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                        user.Role?.name === 'Engineer' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                            'bg-blue-50 text-blue-700 border-blue-200'
                                        }`}>
                                        {user.Role?.name}
                                    </span>
                                </td>
                                <td className="p-4 text-text-muted">{user.Customer?.name || '-'}</td>
                                <td className="p-4 flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="text-slate-500 hover:text-green-400 transition-colors"
                                        title="Edit User"
                                    >
                                        <Edit3 size={18} />
                                    </button>
                                    <button
                                    // ✅ Add delete functionality
                                        onClick={() => handleDelete(user.id)}
                                        className="text-slate-500 hover:text-red-400 transition-colors"
                                        title="Delete User"
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
                    <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <h2 className="text-xl font-bold text-text-main mb-4">{editingUser ? 'Edit User' : 'Add New User'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                placeholder="Username"
                                className="w-full bg-slate-50 border border-border rounded-lg px-4 py-2 text-text-main placeholder-slate-400"
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Email"
                                type="email"
                                className="w-full bg-slate-50 border border-border rounded-lg px-4 py-2 text-text-main placeholder-slate-400"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Password (leave blank to keep current)"
                                type="password"
                                className="w-full bg-slate-50 border border-border rounded-lg px-4 py-2 text-text-main placeholder-slate-400"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                            <select
                                className="w-full bg-slate-50 border border-border rounded-lg px-4 py-2 text-text-main"
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                required
                            >
                                <option value="Operator">Customer</option>
                                {/* <option value="Site Manager">Site Manager</option> */}
                                {/* <option value="Engineer">Engineer</option> */}
                                <option value="Oxygens Admin">Admin</option>
                            </select>

                            {(formData.role === 'Operator' || formData.role === 'Site Manager') && (
                                <select
                                    className="w-full bg-slate-50 border border-border rounded-lg px-4 py-2 text-text-main"
                                    value={formData.customerId}
                                    onChange={e => setFormData({ ...formData, customerId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Customer</option>
                                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            )}

                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={() => { setShowModal(false); setEditingUser(null); }} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">{editingUser ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
