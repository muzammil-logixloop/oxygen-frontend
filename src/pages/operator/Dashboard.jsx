import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building, MapPin, Mail, Phone, User } from 'lucide-react';
import { getMyCustomer } from '../../services/operatorService';

const OperatorDashboard = () => {
    const { user } = useAuth();

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCustomer = async () => {
        try {
            const data = await getMyCustomer();
            setCustomer(data);
        } catch (err) {
            setError("Failed to load customer.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomer();
    }, []);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-main mb-2">Operator</h1>
                <p className="text-text-muted">Welcome back, {user?.username}.</p>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-text-main mb-4">
                    My Customer
                </h2>

                {loading && (
                    <p className="text-text-muted">Loading customer...</p>
                )}

                {error && (
                    <p className="text-red-500">{error}</p>
                )}

                {!loading && !customer && (
                    <p className="text-text-muted">
                        No customer assigned to this operator.
                    </p>
                )}

                {customer && (
                    <div className="space-y-3 text-sm text-text-main">
                        <div className="flex items-center space-x-2">
                            <Building size={18} />
                            <span className="font-semibold">{customer.name}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <MapPin size={16} />
                            <span>{customer.address || "-"}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <User size={16} />
                            <span>{customer.contactPerson || "-"}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Mail size={16} />
                            <span>{customer.contactEmail || "-"}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Phone size={16} />
                            <span>{customer.contactPhone || "-"}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OperatorDashboard;
