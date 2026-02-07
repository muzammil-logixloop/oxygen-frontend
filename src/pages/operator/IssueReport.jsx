import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChamberDetails, reportIssue } from '../../services/opsService';
import { AlertTriangle, ArrowLeft, Camera, CheckCircle } from 'lucide-react';

const IssueReport = () => {
    const { chamberId } = useParams();
    const navigate = useNavigate();

    const [chamber, setChamber] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Other',
        severity: 'Minor',
        doNotOperateRecommended: false
    });

    const [files, setFiles] = useState([]);
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

    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const data = new FormData();

        data.append('chamberId', chamberId);
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('severity', formData.severity);
        data.append('doNotOperateRecommended', formData.doNotOperateRecommended);

        files.forEach((file) => {
            data.append('uploads', file);
        });

        try {
            await reportIssue(data);

            alert('Issue reported successfully. An engineer will be notified.');

            navigate('/operator');
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to report issue.');
        } finally {
            setLoading(false);
        }
    };

    if (!chamber) return <div className="text-white p-6">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="text-slate-400 hover:text-white mb-4 flex items-center space-x-2"
            >
                <ArrowLeft size={20} />
                <span>Back</span>
            </button>

            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-8 border-l-4 border-l-red-500">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white mb-1 flex items-center space-x-2">
                        <AlertTriangle className="text-red-500" />
                        <span>Report Issue / Fault</span>
                    </h1>
                    <p className="text-slate-400">
                        {chamber.modelName} (SN: {chamber.serialNumber})
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/20 text-red-200 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            Issue Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white"
                            placeholder="e.g., Door seal leaking"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                Issue Category
                            </label>

                            <select
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData({ ...formData, category: e.target.value })
                                }
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white"
                            >
                                <option value="Leak">Leak</option>
                                <option value="Zip">Zip</option>
                                <option value="Door">Door</option>
                                <option value="Window">Window</option>
                                <option value="Valves">Valves</option>
                                <option value="Gauge">Gauge</option>
                                <option value="Electrical">Electrical</option>
                                <option value="Noise">Noise</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                Severity Level
                            </label>

                            <select
                                value={formData.severity}
                                onChange={(e) =>
                                    setFormData({ ...formData, severity: e.target.value })
                                }
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white"
                            >
                                <option value="Info">Info</option>
                                <option value="Minor">Minor</option>
                                <option value="Urgent">Urgent</option>
                                <option value="SafetyCritical">
                                    Safety Critical
                                </option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            Detailed Description
                        </label>

                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value
                                })
                            }
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white h-32 resize-none"
                            placeholder="Describe the problem in detail..."
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-3 bg-red-500/10 p-4 rounded-lg">
                        <input
                            type="checkbox"
                            checked={formData.doNotOperateRecommended}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    doNotOperateRecommended: e.target.checked
                                })
                            }
                            className="h-5 w-5"
                        />
                        <span className="text-red-200">
                            Recommend Do Not Operate until resolved
                        </span>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            Upload Evidence (Photos / Videos)
                        </label>

                        <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center relative">
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />

                            {files.length > 0 ? (
                                <div className="text-red-400 font-medium">
                                    {files.length} file(s) selected
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
                        className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit Issue Report'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default IssueReport;
