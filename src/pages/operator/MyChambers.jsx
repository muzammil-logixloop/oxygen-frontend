import React, { useState, useEffect } from 'react';
import { getMyChambers } from '../../services/opsService';
import { Box, ClipboardList, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyChambers = () => {
    const [chambers, setChambers] = useState([]);
    const [loading, setLoading] = useState(true); // ✅ loader state
    const navigate = useNavigate();

    useEffect(() => {
        loadChambers();
    }, []);

    const loadChambers = async () => {
        try {
            setLoading(true); // show loader while fetching
            const data = await getMyChambers();
            setChambers(data);
        } catch (error) {
            console.error('Error loading chambers:', error);
        } finally {
            setLoading(false); // hide loader
        }
    };

    return (
        <div className="relative">
            {/* 🔄 Full-page loader overlay */}
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-text-muted text-sm">Loading chambers...</p>
                    </div>
                </div>
            )}

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-main mb-2">My Chambers</h1>
                <p className="text-text-muted">Select a chamber to perform checks or report issues.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chambers.map(chamber => (
                    <div key={chamber.id} className="bg-surface border border-border p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                                <Box size={24} />
                            </div>
                            <span className={`text-xs px-2 py-1 rounded border ${chamber.warrantyStatus === 'Active' ? 'text-blue-700 border-blue-200 bg-blue-50' : 'text-red-700 border-red-200 bg-red-50'}`}>
                                {chamber.warrantyStatus}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-text-main mb-1">{chamber.modelName}</h3>
                        <p className="text-sm text-text-muted mb-6 font-mono">SN: {chamber.serialNumber}</p>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => navigate(`/operator/checklist/${chamber.id}`)}
                                className="bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2 text-sm"
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

                {chambers.length === 0 && !loading && (
                    <div className="col-span-3 text-center py-10 text-text-muted">
                        No chambers assigned to your customer account.
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyChambers;
