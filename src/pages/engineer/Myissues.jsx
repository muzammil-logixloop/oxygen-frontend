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
        return "bg-red-50 text-red-700 border border-red-200";
      case "Urgent":
        return "bg-orange-50 text-orange-700 border border-orange-200";
      case "Minor":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      default:
        return "bg-blue-50 text-blue-700 border border-blue-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "New":
        return <AlertTriangle className="text-yellow-600" />;
      case "InProgress":
        return <Wrench className="text-blue-600" />;
      case "Resolved":
        return <CheckCircle className="text-green-600" />;
      default:
        return <Clock className="text-text-muted" />;
    }
  };

  if (loading) {
    return <div className="text-text-main p-6">Loading issues...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-text-main mb-6">
        Assigned Issues (Engineer)
      </h1>

      {error && (
        <div className="bg-red-500/20 text-red-200 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {issues.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-6 text-text-muted shadow-sm">
          No issues currently assigned to you.
        </div>
      ) : (
        <div className="space-y-4">
          {issues.map((issue) => (
            <div
              key={issue.issueId}
              className="bg-surface border border-border rounded-xl p-6 hover:shadow-md transition-all cursor-pointer shadow-sm"
              onClick={() => navigate(`/engineer/issues/${issue.issueId}`)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    {getStatusIcon(issue.status)}
                    <h2 className="text-lg font-semibold text-text-main">
                      {issue.title}
                    </h2>
                  </div>

                  <p className="text-text-muted text-sm mb-2">
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

                    <span className="px-3 py-1 rounded-full text-xs bg-slate-100 text-slate-600 border border-slate-200">
                      {issue.category}
                    </span>

                    <span className="px-3 py-1 rounded-full text-xs bg-slate-100 text-slate-600 border border-slate-200">
                      {issue.status}
                    </span>
                  </div>
                </div>

                <ArrowRight className="text-slate-500" />
              </div>

              {issue.doNotOperateRecommended && (
                <div className="mt-4 bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg text-sm">
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
