import React, { useState, useEffect } from 'react';
import { getCustomers, createCustomer } from '../../services/adminService';
import { Plus, Building, MapPin, Phone, Mail } from 'lucide-react';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '', address: '', contactPerson: '', contactEmail: '', contactPhone: ''
    });

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const data = await getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error('Error loading customers:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createCustomer(formData);
            setShowModal(false);
            setFormData({ name: '', address: '', contactPerson: '', contactEmail: '', contactPhone: '' });
            loadCustomers();
        } catch (error) {
            console.error('Error creating customer:', error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Customers</h1>
                    <p className="text-slate-400">Manage all customer accounts (Companies/Hospitals).</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-all"
                >
                    <Plus size={20} />
                    <span>Add Customer</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.map(customer => (
                    <div key={customer.id} className="bg-slate-800/50 border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400">
                                <Building size={24} />
                            </div>
                            <span className="text-xs font-mono text-slate-500">ID: {customer.id}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{customer.name}</h3>
                        <div className="space-y-2 text-sm text-slate-400">
                            <div className="flex items-center space-x-2">
                                <MapPin size={16} className="text-slate-500" />
                                <span>{customer.address}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <UserIcon size={16} className="text-slate-500" />
                                <span>{customer.contactPerson}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail size={16} className="text-slate-500" />
                                <span>{customer.contactEmail}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone size={16} className="text-slate-500" />
                                <span>{customer.contactPhone}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Add New Customer</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                placeholder="Company Name"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Address"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                            />
                            <input
                                placeholder="Contact Person"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                value={formData.contactPerson} onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                            />
                            <input
                                placeholder="Email" type="email"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                value={formData.contactEmail} onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                            />
                            <input
                                placeholder="Phone"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                value={formData.contactPhone} onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                            />
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

// Helper Icon
const UserIcon = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
)

export default Customers;
