import React, { useEffect, useState } from "react";
import { ArrowLeft, ClipboardList, Eye, Image, Film } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMyChecklists } from "../../services/opsService";

const MyChecklists = () => {
  const navigate = useNavigate();
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyChecklists();
        setChecklists(data);
      } catch (err) {
        setError("Failed to load checklists.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const ChecklistCard = ({ submission }) => {
    const [showDetails, setShowDetails] = useState(false);

    return (
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-text-main font-bold text-lg">
              {submission.chamberSerialNumber} ({submission.chamberModelName})
            </h3>
            <p className="text-text-muted text-sm mt-1">
              Type: {submission.checkType} | Result:{" "}
              <span
                className={`font-semibold ${submission.overallResult === "Pass"
                  ? "text-green-400"
                  : submission.overallResult === "Fail"
                    ? "text-red-400"
                    : "text-yellow-400"
                  }`}
              >
                {submission.overallResult}
              </span>
            </p>
            <p className="text-text-muted text-xs mt-0.5">
              Submitted: {new Date(submission.submittedAt).toLocaleString()}
            </p>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors"
          >
            <Eye size={18} />
            <span>{showDetails ? "Hide" : "View"}</span>
          </button>
        </div>

        {showDetails && (
          <div className="mt-6 border-t border-border pt-4 space-y-4">
            <p className="text-text-muted">
              <b>Signature:</b> {submission.signatureName}
            </p>

            <p className="text-text-muted">
              <b>General Notes:</b> {submission.notesGeneral || "None"}
            </p>

            {submission.videoUrl && (
              <div>
                <a
                  href={submission.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 flex items-center space-x-2 hover:underline"
                >
                  <Film size={18} />
                  <span>View Uploaded Video</span>
                </a>
              </div>
            )}

            <h4 className="text-text-main font-semibold mt-4 mb-2">Responses</h4>
            <div className="space-y-2">
              {submission.responses.map((r, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-border rounded-xl p-3 flex justify-between items-center"
                >
                  <div>
                    <span className="text-text-main font-medium">{r.itemId}</span>
                    {r.notes && (
                      <p className="text-text-muted text-sm mt-1">{r.notes}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    <span
                      className={`font-semibold ${r.result === "Pass"
                        ? "text-green-400"
                        : r.result === "Fail"
                          ? "text-red-400"
                          : "text-yellow-400"
                        }`}
                    >
                      {r.result}
                    </span>

                    {r.attachmentUrl && (
                      <a
                        href={r.attachmentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:underline flex items-center space-x-1"
                      >
                        <Image size={16} />
                        <span>View</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="text-white p-6">Loading submissions...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="text-text-muted hover:text-text-main mb-6 flex items-center space-x-2"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-main mb-1 flex items-center space-x-2">
            <ClipboardList className="text-blue-400" />
            <span>My Submitted Checklists</span>
          </h1>
          <p className="text-text-muted">
            View a detailed history of all checklists you have submitted
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {checklists.length === 0 ? (
          <div className="text-text-muted text-center py-10">
            You have not submitted any checklists yet.
          </div>
        ) : (
          <div className="space-y-4">
            {checklists.map((item) => (
              <ChecklistCard key={item.submissionId} submission={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChecklists;
