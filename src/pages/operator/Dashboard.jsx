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
      const response = await getMyCustomer();
      setCustomer(response.data);
    } catch (err) {
      setError("Failed to load customer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  const InfoItem = ({ icon: Icon, label, value, color }) => (
    <div className="flex items-center space-x-3">
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-full ${color} text-white`}
      >
        <Icon size={18} />
      </div>
      <div>
        <p className="text-sm text-text-muted">{label}</p>
        <p className="font-medium text-text-main">{value || "-"}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-12">
      {/* Header */}
      {/* <div className="mb-8">
        <h1 className="text-4xl font-bold text-text-main mb-2">Dashboard</h1>
        <p className="text-text-muted text-lg">
          Welcome back, <span className="font-semibold">{user?.username}</span>.
        </p>
      </div> */}

      {/* Customer Card */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-text-main mb-6">
          Customer Information
        </h2>

        {loading && <p className="text-text-muted">Loading customer...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !customer && (
          <p className="text-text-muted">No customer assigned.</p>
        )}

        {customer && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem
              icon={Building}
              label="Customer Name"
              value={customer.name}
              color="bg-blue-500"
            />
            <InfoItem
              icon={MapPin}
              label="Address"
              value={customer.address}
              color="bg-green-500"
            />
            <InfoItem
              icon={User}
              label="Contact Person"
              value={customer.contactPerson}
              color="bg-purple-500"
            />
            <InfoItem
              icon={Mail}
              label="Email"
              value={customer.contactEmail}
              color="bg-red-500"
            />
            <InfoItem
              icon={Phone}
              label="Phone"
              value={customer.contactPhone}
              color="bg-yellow-500"
            />
          </div>
        )}

        {/* Operator info under customer */}
        {customer && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-text-main mb-4">
              Operator
            </h3>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500 text-white">
                <User size={18} />
              </div>
              <div>
                <p className="text-sm text-text-muted">LOGGED IN AS</p>
                <p className="font-medium text-text-main">{user?.username}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperatorDashboard;
