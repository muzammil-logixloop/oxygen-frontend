import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChamberDetails, getChecklistTemplate, submitChecklist } from '../../services/opsService';
import { ArrowLeft, Camera, CheckCircle, AlertTriangle, Video } from 'lucide-react';
import { toast } from 'react-toastify';

const ChecklistForm = () => {
  const { chamberId } = useParams();
  const navigate = useNavigate();

  const [chamber, setChamber] = useState(null);
  const [type, setType] = useState('Daily');
  const [template, setTemplate] = useState(null);

  const [responses, setResponses] = useState({});
  const [attachments, setAttachments] = useState({});
  const [video, setVideo] = useState(null);

  const [videoPreview, setVideoPreview] = useState(null);
  const [notesGeneral, setNotesGeneral] = useState('');
  const [signatureName, setSignatureName] = useState('');
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadChamber();
  }, [chamberId]);

  useEffect(() => {
    loadTemplate();
  }, [type]);

  const loadChamber = async () => {
    try {
      const data = await getChamberDetails(chamberId);
      setChamber(data);
    } catch {
      setError('Failed to load chamber details');
    }
  };

  const loadTemplate = async () => {
    try {
      const data = await getChecklistTemplate(type);
      setTemplate(data);
      setResponses({});
      setAttachments({});
      setVideo(null);
      setVideoPreview(null);
    } catch {
      setError('Failed to load checklist template');
    }
  };

  const handleResponse = (itemId, result) => {
    setResponses(prev => ({ ...prev, [itemId]: result }));
  };

  const handleAttachment = (itemId, file) => {
    setAttachments(prev => ({ ...prev, [itemId]: file }));
  };

  const handleVideo = (file) => {
    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const validateBeforeSubmit = () => {
    if (!template) return false;

    for (let item of template.ChecklistItems) {
      if (!responses[item.itemId]) {
        setError(`Please complete item: ${item.title}`);
        toast.error(`Please complete item: ${item.title}`);
        return false;
      }
      if (item.requiresPhotoOnFail && responses[item.itemId] === 'Fail' && !attachments[item.itemId]) {
        setError(`Photo required for failed item: ${item.title}`);
        toast.error(`Photo required for failed item: ${item.title}`);
        return false;
      }
    }

    if (type === 'Monthly' && !video) {
      setError('Monthly checklist requires video upload');
      toast.error('Monthly checklist requires video upload');
      return false;
    }

    if (!declarationAccepted) {
      setError('You must accept the declaration');
      toast.error('You must accept the declaration');
      return false;
    }

    if (!signatureName) {
      setError('Signature name is required');
      toast.error('Signature name is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateBeforeSubmit()) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('chamberId', chamberId);
      formData.append('checkType', type);
      formData.append('declarationAccepted', declarationAccepted);
      formData.append('signatureName', signatureName);
      formData.append('notesGeneral', notesGeneral);

      // Responses JSON
      formData.append(
        'responses',
        JSON.stringify(
          template.ChecklistItems.map(item => ({
            itemId: item.itemId,
            result: responses[item.itemId],
            notes: '' // add notes if needed
          }))
        )
      );


      Object.entries(attachments).forEach(([itemId, file]) => {
        // Send each file under its itemId key
        formData.append(`attachments[${itemId}]`, file);
      });


      // Video
      if (video) {
        formData.append('videoUpload', video);
      }

      await submitChecklist(formData, true);

      toast.success('Checklist submitted successfully');
      navigate('/operator');
    } catch (err) {
      const errorMessage = err.message || 'Submission failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!chamber || !template) {
    return <div className="text-white p-6">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">

      <button onClick={() => navigate(-1)} className="text-text-muted hover:text-text-main mb-4 flex items-center space-x-2">
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">

        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-main mb-1">{type} Checklist</h1>
            <p className="text-text-muted">{chamber.modelName} (SN: {chamber.serialNumber})</p>
          </div>

          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="bg-slate-50 border border-border text-text-main rounded-lg px-4 py-2"
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2 border border-red-200">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {template.ChecklistItems.map(item => (
            <div key={item.itemId} className="p-5 bg-slate-50 rounded-xl border border-border">

              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-text-main font-semibold">{item.title}</h3>
                  <p className="text-text-muted text-sm mt-1">{item.instruction}</p>
                </div>

                <div className="flex space-x-2 ml-4">
                  {['Pass', 'Fail', 'NA'].map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleResponse(item.itemId, status)}
                      className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${responses[item.itemId] === status
                        ? status === 'Pass' ? 'bg-green-600 text-white'
                          : status === 'Fail' ? 'bg-red-600 text-white'
                            : 'bg-gray-600 text-white'
                        : 'bg-white border border-border text-text-muted hover:bg-slate-100'
                        }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {item.requiresPhotoOnFail && responses[item.itemId] === 'Fail' && (
                <div className="mt-4">
                  <label className="text-text-muted text-sm block mb-2">Photo Required</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center relative bg-white">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={e => handleAttachment(item.itemId, e.target.files[0])}
                    />
                    {attachments[item.itemId] ? (
                      <div className="text-emerald-600 flex items-center justify-center gap-2">
                        <CheckCircle size={18} />
                        {attachments[item.itemId].name}
                      </div>
                    ) : (
                      <div className="text-text-muted flex flex-col items-center">
                        <Camera className="mb-1" />
                        Upload Photo Evidence
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {type === 'Monthly' && (
            <div>
              <label className="text-text-muted block mb-2">Monthly Video Upload (Required)</label>
              <input
                type="file"
                accept="video/*"
                onChange={e => handleVideo(e.target.files[0])}
                className="text-text-main"
              />
              {videoPreview && (
                <video controls className="mt-2 w-full rounded-lg">
                  <source src={videoPreview} type={video.type} />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}

          <div>
            <label className="text-text-muted block mb-2">General Notes</label>
            <textarea
              value={notesGeneral}
              onChange={e => setNotesGeneral(e.target.value)}
              className="w-full bg-slate-50 border border-border rounded-xl text-text-main p-3"
              rows={4}
            />
          </div>

          <div className="border-t border-border pt-4">
            <label className="flex items-center gap-2 text-text-muted">
              <input
                type="checkbox"
                checked={declarationAccepted}
                onChange={e => setDeclarationAccepted(e.target.checked)}
              />
              I confirm this checklist is completed truthfully
            </label>

            <input
              type="text"
              placeholder="Signature Name"
              value={signatureName}
              onChange={e => setSignatureName(e.target.value)}
              className="mt-3 w-full bg-slate-50 border border-border rounded-xl text-text-main p-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl"
          >
            {loading ? 'Submitting...' : 'Submit Checklist'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ChecklistForm;
