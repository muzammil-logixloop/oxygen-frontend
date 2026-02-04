import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChamberDetails, submitChecklist } from '../../services/opsService';
import { CheckCircle, Upload, ArrowLeft, Camera } from 'lucide-react';

const ChecklistForm = () => {
    const { chamberId } = useParams();
    const navigate = useNavigate();
    const [chamber, setChamber] = useState(null);
    const [type, setType] = useState('Daily');
    const [items, setItems] = useState({});
    const [notes, setNotes] = useState('');
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

    // Dummy Checklist Items
    const dailyItems = [
        "Oxygen pressure normal", "Door seal intact", "Emergency stops functional", "Interior clean"
    ];
    const weeklyItems = [
        "Filter check", "Electronics verification", "Visual inspection of hull"
    ];

    const currentItems = type === 'Daily' ? dailyItems : weeklyItems;

    const handleCheck = (item, status) => {
        setItems(prev => ({ ...prev, [item]: status }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic Validation
        if (Object.keys(items).length < currentItems.length) {
            setError('Please complete all checklist items.');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('chamberId', chamberId);
        formData.append('type', type);
        formData.append('status', 'Pass'); // Simplified logic
        formData.append('data', JSON.stringify(items));
        formData.append('notes', notes);
        if (file) formData.append('evidence', file);

        try {
            await submitChecklist(formData);
            alert('Checklist submitted successfully!');
            navigate('/operator');
        } catch (err) {
            setError('Submission failed.');
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

            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Perform Checklist</h1>
                        <p className="text-slate-400">{chamber.modelName} (SN: {chamber.serialNumber})</p>
                    </div>
                    <select
                        value={type}
                        onChange={e => { setType(e.target.value); setItems({}); }}
                        className="bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2"
                    >
                        <option value="Daily">Daily Check</option>
                        <option value="Weekly">Weekly Check</option>
                        <option value="Monthly">Monthly Check</option>
                    </select>
                </div>

                {error && <div className="bg-red-500/20 text-red-200 p-4 rounded-lg mb-6">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {currentItems.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl border border-white/5">
                                <span className="text-white font-medium">{item}</span>
                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => handleCheck(item, 'Pass')}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${items[item] === 'Pass' ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                                    >
                                        Pass
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleCheck(item, 'Fail')}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${items[item] === 'Fail' ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                                    >
                                        Fail
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleCheck(item, 'N/A')}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${items[item] === 'N/A' ? 'bg-gray-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                                    >
                                        N/A
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Evidence (Photo/Video)</label>
                        <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-blue-500/50 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                onChange={e => setFile(e.target.files[0])}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            {file ? (
                                <div className="text-blue-400 font-medium flex items-center justify-center space-x-2">
                                    <CheckCircle size={20} />
                                    <span>{file.name}</span>
                                </div>
                            ) : (
                                <div className="text-slate-500 flex flex-col items-center">
                                    <Camera size={32} className="mb-2 opacity-50" />
                                    <span>Click to upload photo or video</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Notes</label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white h-24 resize-none focus:border-blue-500 focus:outline-none"
                            placeholder="Any additional observations..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit Checklist'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChecklistForm;
