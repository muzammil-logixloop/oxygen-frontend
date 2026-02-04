import React, { useState, useEffect } from 'react';
import { getChambers, createChamber, getCustomers } from '../../services/adminService';
import { Plus, Box, Calendar, Award } from 'lucide-react';

const Chambers = () => {
    const [chambers, setChambers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [showModal, setShowModal] = useState(false);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createChamber(formData);
            setShowModal(false);
            setFormData({ serialNumber: '', modelName: '', customerId: '', installationDate: '', warrantyExpiryDate: '' });
            loadData();
        } catch (error) {
            console.error('Error creating chamber:', error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Chambers</h1>
                    <p className="text-slate-400">Manage oxygen chambers and warranty status.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-all"
                >
                    <Plus size={20} />
                    <span>Add Chamber</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chambers.map(chamber => (
                    <div key={chamber.id} className="bg-slate-800/50 border border-white/5 p-6 rounded-2xl hover:border-emerald-500/30 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-emerald-500/20 p-3 rounded-lg text-emerald-400">
                                <Box size={24} />
                            </div>
                            <span className={`text-xs px-2 py-1 rounded border ${chamber.warrantyStatus === 'Active' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10'}`}>
                                {chamber.warrantyStatus}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{chamber.modelName}</h3>
                        <p className="text-sm text-slate-400 mb-4 font-mono">SN: {chamber.serialNumber}</p>

                        <div className="border-t border-white/5 pt-4 space-y-2 text-sm text-slate-400">
                            <div className="flex justify-between">
                                <span>Customer:</span>
                                <span className="text-white font-medium">{chamber.Customer?.name || 'Unassigned'}</span>
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
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Add New Chamber</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="Serial Number"
                                    className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white w-full"
                                    value={formData.serialNumber} onChange={e => setFormData({ ...formData, serialNumber: e.target.value })}
                                    required
                                />
                                <input
                                    placeholder="Model Name"
                                    className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white w-full"
                                    value={formData.modelName} onChange={e => setFormData({ ...formData, modelName: e.target.value })}
                                    required
                                />
                            </div>

                            <select
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                value={formData.customerId} onChange={e => setFormData({ ...formData, customerId: e.target.value })}
                                required
                            >
                                <option value="">Select Customer</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>

                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Installation Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                    value={formData.installationDate} onChange={e => setFormData({ ...formData, installationDate: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Warranty Expiry</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                    value={formData.warrantyExpiryDate} onChange={e => setFormData({ ...formData, warrantyExpiryDate: e.target.value })}
                                />
                            </div>

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

export default Chambers;
