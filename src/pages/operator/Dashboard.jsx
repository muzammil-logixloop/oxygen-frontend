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
                <h1 className="text-3xl font-bold text-text-main mb-2">Operator</h1>
                <p className="text-text-muted">Welcome back, {user?.username}.</p>
            </div>

            {/* <MyChambers /> */}
        </div>
    );
};

export default OperatorDashboard;
