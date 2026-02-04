import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChamberDetails, reportIssue } from '../../services/opsService';
import { AlertTriangle, Upload, ArrowLeft, Camera, CheckCircle } from 'lucide-react';

const IssueReport = () => {
    const { chamberId } = useParams();
    const navigate = useNavigate();
    const [chamber, setChamber] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', priority: 'Medium'
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadChamber();
    }, [chamberId]);

    const loadChamber = async () => {
        try {
            const data = await getChamberDetails(chamberId);
            setChamber(data);
        } catch (err) {
            setError('Failed to load chamber details.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const data = new FormData();
        data.append('chamberId', chamberId);
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('priority', formData.priority);
        if (file) data.append('evidence', file);

        try {
            await reportIssue(data);
            alert('Issue reported successfully. An engineer will be notified.');
            navigate('/operator');
        } catch (err) {
            setError('Failed to report issue.');
        } finally {
            setLoading(false);
        }
    };

    if (!chamber) return <div className="text-white p-6">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto">
            <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white mb-4 flex items-center space-x-2">
                <ArrowLeft size={20} />
                <span>Back</span>
            </button>

            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-8 border-l-4 border-l-red-500">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white mb-1 flex items-center space-x-2">
                        <AlertTriangle className="text-red-500" />
                        <span>Report Issue / Fault</span>
                    </h1>
                    <p className="text-slate-400">{chamber.modelName} (SN: {chamber.serialNumber})</p>
                </div>

                {error && <div className="bg-red-500/20 text-red-200 p-4 rounded-lg mb-6">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Issue Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                            placeholder="e.g., Door seal leaking"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Priority Level</label>
                            <select
                                value={formData.priority}
                                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                            >
                                <option value="Low">Low - Minor cosmetic issue</option>
                                <option value="Medium">Medium - Needs attention soon</option>
                                <option value="High">High - Affects operation</option>
                                <option value="Critical">Critical - Safety hazard</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Detailed Description</label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white h-32 resize-none focus:border-red-500 focus:outline-none"
                            placeholder="Describe the problem in detail..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Evidence (Photo/Video)</label>
                        <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-red-500/50 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                onChange={e => setFile(e.target.files[0])}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            {file ? (
                                <div className="text-red-400 font-medium flex items-center justify-center space-x-2">
                                    <CheckCircle size={20} />
                                    <span>{file.name}</span>
                                </div>
                            ) : (
                                <div className="text-slate-500 flex flex-col items-center">
                                    <Camera size={32} className="mb-2 opacity-50" />
                                    <span>Click to upload evidence</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-600/20 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit Issue Report'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default IssueReport;
