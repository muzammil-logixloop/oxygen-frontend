import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { ClipboardList, AlertCircle, User } from 'lucide-react';
import MyChambers from './MyChambers';

const OperatorDashboard = () => {
    const { user } = useAuth();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Operator Dashboard</h1>
                <p className="text-slate-400">Welcome back, {user?.username}. Here are your assigned chambers.</p>
            </div>

            <MyChambers />
        </div>
    );
};

export default OperatorDashboard;
