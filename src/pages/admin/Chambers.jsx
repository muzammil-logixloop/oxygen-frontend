import React, { useState, useEffect } from 'react';
import { getChambers, createChamber, updateChamber, deleteChamber, getCustomers } from '../../services/adminService';
import { Plus, Box, Trash2, Edit } from 'lucide-react';
import { toast } from 'react-toastify';

const Chambers = () => {
    const [chambers, setChambers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingChamber, setEditingChamber] = useState(null); // NEW: track editing chamber
    const [formData, setFormData] = useState({
        serialNumber: '', modelName: '', customerId: '', installationDate: '', warrantyExpiryDate: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [chambersData, customersData] = await Promise.all([getChambers(), getCustomers()]);
            setChambers(chambersData);
            setCustomers(customersData);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    // Handle create or update
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingChamber) {
                await updateChamber(editingChamber.id, formData);
                toast.success('Chamber updated successfully');
            } else {
                await createChamber(formData);
                toast.success('Chamber created successfully');
            }
            setShowModal(false);
            setEditingChamber(null);
            setFormData({ serialNumber: '', modelName: '', customerId: '', installationDate: '', warrantyExpiryDate: '' });
            loadData();
        } catch (error) {
            console.error('Error saving chamber:', error);
            toast.error('Failed to save chamber');
        }
    };

    // Handle edit
    const handleEdit = (chamber) => {
        setEditingChamber(chamber);
        setFormData({
            serialNumber: chamber.serialNumber || '',
            modelName: chamber.modelName || '',
            customerId: chamber.customerId || '',
            installationDate: chamber.installationDate || '',
            warrantyExpiryDate: chamber.warrantyExpiryDate || ''
        });
        setShowModal(true);
    };

    // Handle delete
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this chamber?')) {
            try {
                await deleteChamber(id);
                toast.success('Chamber deleted successfully');
                loadData();
            } catch (error) {
                console.error('Error deleting chamber:', error);
                toast.error('Failed to delete chamber');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-text-main mb-2">Chambers</h1>
                    <p className="text-text-muted">Manage oxygen chambers and warranty status.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-all"
                >
                    <Plus size={20} />
                    <span>Add Chamber</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chambers.map(chamber => (
                    <div key={chamber.id} className="bg-surface border border-border p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
                                <Box size={24} />
                            </div>
                            <span className={`text-xs px-2 py-1 rounded border ${chamber.warrantyStatus === 'Active' ? 'text-emerald-700 border-emerald-200 bg-emerald-50' : 'text-red-700 border-red-200 bg-red-50'}`}>
                                {chamber.warrantyStatus}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-text-main mb-1">{chamber.modelName}</h3>
                        <p className="text-sm text-text-muted mb-4 font-mono">SN: {chamber.serialNumber}</p>

                        <div className="border-t border-border pt-4 space-y-2 text-sm text-text-muted">
                            <div className="flex justify-between">
                                <span>Customer:</span>
                                <span className="text-text-main font-medium">{chamber.Customer?.name || 'Unassigned'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Installed:</span>
                                <span>{chamber.installationDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Warranty Exp:</span>
                                <span>{chamber.warrantyExpiryDate}</span>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-4">
                            <button onClick={() => handleEdit(chamber)} className="text-slate-400 hover:text-yellow-400">
                                <Edit size={18} />
                            </button>
                            <button onClick={() => handleDelete(chamber.id)} className="text-slate-400 hover:text-red-400">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <h2 className="text-xl font-bold text-text-main mb-4">{editingChamber ? 'Edit Chamber' : 'Add New Chamber'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="Serial Number"
                                    className="bg-slate-50 border border-border rounded-lg px-4 py-2 text-text-main w-full placeholder-slate-400"
                                    value={formData.serialNumber} onChange={e => setFormData({ ...formData, serialNumber: e.target.value })}
                                    required
                                />
                                <input
                                    placeholder="Model Name"
                                    className="bg-slate-50 border border-border rounded-lg px-4 py-2 text-text-main w-full placeholder-slate-400"
                                    value={formData.modelName} onChange={e => setFormData({ ...formData, modelName: e.target.value })}
                                    required
                                />
                            </div>

                            <select
                                className="w-full bg-slate-50 border border-border rounded-lg px-4 py-2 text-text-main"
                                value={formData.customerId} onChange={e => setFormData({ ...formData, customerId: e.target.value })}
                                required
                            >
                                <option value="">Select Customer</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>

                            <div>
                                <label className="block text-xs text-text-muted mb-1">Installation Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-50 border border-border rounded-lg px-4 py-2 text-text-main"
                                    value={formData.installationDate} onChange={e => setFormData({ ...formData, installationDate: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-text-muted mb-1">Warranty Expiry</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-50 border border-border rounded-lg px-4 py-2 text-text-main"
                                    value={formData.warrantyExpiryDate} onChange={e => setFormData({ ...formData, warrantyExpiryDate: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={() => { setShowModal(false); setEditingChamber(null); }} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                                <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold">{editingChamber ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chambers;
