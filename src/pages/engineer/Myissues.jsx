import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyIssues } from "../../services/opsService";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Wrench,
} from "lucide-react";

const MyIssues = () => {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      const data = await getMyIssues();
      setIssues(data);
    } catch (err) {
      setError("Failed to load assigned issues.");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case "SafetyCritical":
        return "bg-red-500/20 text-red-400";
      case "Urgent":
        return "bg-orange-500/20 text-orange-400";
      case "Minor":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-blue-500/20 text-blue-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "New":
        return <AlertTriangle className="text-yellow-400" />;
      case "InProgress":
        return <Wrench className="text-blue-400" />;
      case "Resolved":
        return <CheckCircle className="text-green-400" />;
      default:
        return <Clock className="text-slate-400" />;
    }
  };

  if (loading) {
    return <div className="text-white p-6">Loading issues...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6">
        Assigned Issues (Engineer)
      </h1>

      {error && (
        <div className="bg-red-500/20 text-red-200 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {issues.length === 0 ? (
        <div className="bg-slate-800/50 border border-white/5 rounded-xl p-6 text-slate-400">
          No issues currently assigned to you.
        </div>
      ) : (
        <div className="space-y-4">
          {issues.map((issue) => (
            <div
              key={issue.issueId}
              className="bg-slate-800/50 border border-white/5 rounded-xl p-6 hover:bg-slate-800 transition cursor-pointer"
              onClick={() => navigate(`/engineer/issues/${issue.issueId}`)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    {getStatusIcon(issue.status)}
                    <h2 className="text-lg font-semibold text-white">
                      {issue.title}
                    </h2>
                  </div>

                  <p className="text-slate-400 text-sm mb-2">
                    Chamber: {issue.Chamber?.modelName || "N/A"} | Serial:{" "}
                    {issue.Chamber?.serialNumber || "N/A"}
                  </p>

                  <div className="flex space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${getSeverityStyle(
                        issue.severity
                      )}`}
                    >
                      {issue.severity}
                    </span>

                    <span className="px-3 py-1 rounded-full text-xs bg-slate-700 text-slate-300">
                      {issue.category}
                    </span>

                    <span className="px-3 py-1 rounded-full text-xs bg-slate-700 text-slate-300">
                      {issue.status}
                    </span>
                  </div>
                </div>

                <ArrowRight className="text-slate-500" />
              </div>

              {issue.doNotOperateRecommended && (
                <div className="mt-4 bg-red-500/20 text-red-300 p-3 rounded-lg text-sm">
                  ⚠ Do Not Operate Recommended
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyIssues;
