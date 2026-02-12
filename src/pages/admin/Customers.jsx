import React, { useState, useEffect } from 'react';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../../services/adminService';
import { Plus, Building, MapPin, Phone, Mail, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '', address: '', contactPerson: '', contactEmail: '', contactPhone: ''
    });
    const [editingId, setEditingId] = useState(null);

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

    const openAddModal = () => {
        setFormData({ name: '', address: '', contactPerson: '', contactEmail: '', contactPhone: '' });
        setEditingId(null);
        setShowModal(true);
    };

    const openEditModal = (customer) => {
        setFormData({
            name: customer.name,
            address: customer.address,
            contactPerson: customer.contactPerson,
            contactEmail: customer.contactEmail,
            contactPhone: customer.contactPhone
        });
        setEditingId(customer.id);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateCustomer(editingId, formData);
                toast.success('Customer updated successfully');
            } else {
                await createCustomer(formData);
                toast.success('Customer created successfully');
            }
            setShowModal(false);
            setFormData({ name: '', address: '', contactPerson: '', contactEmail: '', contactPhone: '' });
            setEditingId(null);
            loadCustomers();
        } catch (error) {
            console.error('Error saving customer:', error);
            toast.error('Failed to save customer');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await deleteCustomer(id);
                toast.success('Customer deleted successfully');
                loadCustomers();
            } catch (error) {
                console.error('Error deleting customer:', error);
                toast.error('Failed to delete customer');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-text-main mb-2">Customers</h1>
                    <p className="text-text-muted">Manage all customer accounts (Companies/Hospitals).</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-all"
                >
                    <Plus size={20} />
                    <span>Add Customer</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.map(customer => (
                    <div key={customer.id} className="bg-surface border border-border p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all relative">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
                                <Building size={24} />
                            </div>
                            {/* <span className="text-xs font-mono text-slate-500">ID: {customer.id}</span> */}
                        </div>
                        <h3 className="text-xl font-bold text-text-main mb-2">{customer.name}</h3>
                        <div className="space-y-2 text-sm text-text-muted">
                            <div className="flex items-center space-x-2">
                                <MapPin size={16} className="text-slate-400" />
                                <span>{customer.address}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <UserIcon size={16} className="text-slate-400" />
                                <span>{customer.contactPerson}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail size={16} className="text-slate-400" />
                                <span>{customer.contactEmail}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone size={16} className="text-slate-400" />
                                <span>{customer.contactPhone}</span>
                            </div>
                        </div>
                        {/* Action Buttons */}
                        <div className="absolute top-4 right-4 flex space-x-2">
                            <button onClick={() => openEditModal(customer)} className="text-slate-400 hover:text-yellow-400">
                                <Edit2 size={18} />
                            </button>
                            <button onClick={() => handleDelete(customer.id)} className="text-slate-400 hover:text-red-400">
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
                        <h2 className="text-xl font-bold text-text-main mb-4">
                            {editingId ? 'Edit Customer' : 'Add New Customer'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                placeholder="Company Name"
                                className="w-full bg-slate-50 border border-border rounded-lg px-4 py-2 text-text-main placeholder-slate-400"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Address"
                                className="w-full bg-slate-50 border border-border rounded-lg px-4 py-2 text-text-main placeholder-slate-400"
                                value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                            />
                            <input
                                placeholder="Contact Person"
                                className="w-full bg-slate-50 border border-border rounded-lg px-4 py-2 text-text-main placeholder-slate-400"
                                value={formData.contactPerson} onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                            />
                            <input
                                placeholder="Email" type="email"
                                className="w-full bg-slate-50 border border-border rounded-lg px-4 py-2 text-text-main placeholder-slate-400"
                                value={formData.contactEmail} onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                            />
                            <input
                                placeholder="Phone"
                                className="w-full bg-slate-50 border border-border rounded-lg px-4 py-2 text-text-main placeholder-slate-400"
                                value={formData.contactPhone} onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                            />
                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                                <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold">
                                    {editingId ? 'Update' : 'Create'}
                                </button>
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
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

export default Customers;
