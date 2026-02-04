import React, { useEffect, useState } from "react";
import axios from "../../services/apiClient";
import { User, MapPin, CheckCircle, AlertCircle } from "lucide-react";

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [assigning, setAssigning] = useState({});

  const fetchIssues = async () => {
    try {
      const res = await axios.get("/ops/issues");
      setIssues(res.data);
    } catch (err) {
      console.error("Error fetching issues:", err);
    }
  };

  const fetchEngineers = async () => {
    try {
      const res = await axios.get("/admin/users/engineers");
      setEngineers(res.data);
    } catch (err) {
      console.error("Error fetching engineers:", err);
    }
  };

  useEffect(() => {
    fetchIssues();
    fetchEngineers();
  }, []);

  const handleAssign = async (issueId, engineerId) => {
    try {
      setAssigning({ ...assigning, [issueId]: true });
      await axios.post("/api/issues/assign", { issueId, engineerId });
      fetchIssues();
    } catch (err) {
      console.error("Error assigning issue:", err);
    } finally {
      setAssigning({ ...assigning, [issueId]: false });
    }
  };

  // Color-coded status badges
  const statusColor = (status) => {
    switch (status) {
      case "Open": return "bg-red-600";
      case "In Progress": return "bg-yellow-500";
      case "Closed": return "bg-green-600";
      default: return "bg-slate-500";
    }
  };

  const priorityColor = (priority) => {
    switch (priority) {
      case "Critical": return "text-red-400";
      case "High": return "text-orange-400";
      case "Medium": return "text-yellow-400";
      case "Low": return "text-green-400";
      default: return "text-slate-400";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Issues</h1>
          <p className="text-slate-400">Track and assign reported issues to engineers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {issues.map((issue) => (
          <div key={issue.id} className="bg-slate-800/50 border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-white">{issue.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full font-mono ${statusColor(issue.status)}`}>
                {issue.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-slate-500" />
                <span>{issue.Chamber?.serialNumber || "-"} ({issue.Chamber?.modelName || "-"})</span>
              </div>
              <div className="flex items-center space-x-2">
                <User size={16} className="text-slate-500" />
                <span>Reported By: {issue.reporter?.username || "-"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User size={16} className="text-slate-500" />
                <span>Assigned To: {issue.assignee?.username || "Unassigned"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle size={16} className={`${priorityColor(issue.priority)}`} />
                <span>Priority: {issue.priority}</span>
              </div>
            </div>

            <div className="mt-4">
              <select
                disabled={assigning[issue.id]}
                value={issue.assignedToId || ""}
                onChange={(e) => handleAssign(issue.id, e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="">-- Assign to Engineer --</option>
                {engineers.map((eng) => (
                  <option key={eng.id} value={eng.id}>
                    {eng.username}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Issues;
