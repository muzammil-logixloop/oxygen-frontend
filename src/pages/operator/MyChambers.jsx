import React, { useState, useEffect } from 'react';
import { getMyChambers } from '../../services/opsService';
import { Box, ClipboardList, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyChambers = () => {
    const [chambers, setChambers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadChambers();
    }, []);

    const loadChambers = async () => {
        try {
            const data = await getMyChambers();
            setChambers(data);
        } catch (error) {
            console.error('Error loading chambers:', error);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">My Chambers</h1>
                <p className="text-slate-400">Select a chamber to perform checks or report issues.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chambers.map(chamber => (
                    <div key={chamber.id} className="bg-slate-800/50 border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400">
                                <Box size={24} />
                            </div>
                            <span className={`text-xs px-2 py-1 rounded border ${chamber.warrantyStatus === 'Active' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10'}`}>
                                {chamber.warrantyStatus}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{chamber.modelName}</h3>
                        <p className="text-sm text-slate-400 mb-6 font-mono">SN: {chamber.serialNumber}</p>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => navigate(`/operator/checklist/${chamber.id}`)}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2 text-sm"
                            >
                                <ClipboardList size={16} />
                                <span>Checklist</span>
                            </button>
                            <button
                                onClick={() => navigate(`/operator/report-issue/${chamber.id}`)}
                                className="bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2 text-sm"
                            >
                                <AlertCircle size={16} />
                                <span>Report Issue</span>
                            </button>
                        </div>
                    </div>
                ))}

                {chambers.length === 0 && (
                    <div className="col-span-3 text-center py-10 text-slate-500">
                        No chambers assigned to your customer account.
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyChambers;
