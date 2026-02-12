import React, { useEffect, useState } from "react";
import axios from "../../services/apiClient";
import { User, MapPin, AlertTriangle, CheckCircle, Wrench, Loader2 } from "lucide-react";
import { toast } from 'react-toastify';

const AdminIssues = () => {
  const [issues, setIssues] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [assigning, setAssigning] = useState({});
  const [selectedEngineer, setSelectedEngineer] = useState({});
  const [showAssignPanel, setShowAssignPanel] = useState({});

  // Fetch issues
  const fetchIssues = async () => {
    try {
      const res = await axios.get("/ops/issues/my");
      setIssues(res.data);
    } catch (err) {
      console.error("Error fetching issues:", err);
    }
  };

  // Fetch engineers
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

  // Assign engineer
  const handleAssign = async (issueId) => {
    const val = selectedEngineer[issueId];
    if (!val) return;

    const engineerId = Number(val);
    if (!engineerId) return;

    try {
      setAssigning({ ...assigning, [issueId]: true });
      console.log("Assigning issue", issueId, "to engineer", engineerId);

      await axios.post("/ops/issues/assign", { issueId, engineerId });

      fetchIssues();
      setShowAssignPanel({ ...showAssignPanel, [issueId]: false });
      setSelectedEngineer({ ...selectedEngineer, [issueId]: "" });
      toast.success('Engineer assigned successfully');
    } catch (err) {
      console.error("Error assigning engineer:", err);
      toast.error('Failed to assign engineer');
    } finally {
      setAssigning({ ...assigning, [issueId]: false });
    }
  };

  const toggleAssignPanel = (issueId) => {
    setShowAssignPanel({ ...showAssignPanel, [issueId]: !showAssignPanel[issueId] });
    if (showAssignPanel[issueId]) setSelectedEngineer({ ...selectedEngineer, [issueId]: "" });
  };

  // Helpers
  const statusColor = (status) => ({
    New: "bg-emerald-600 text-white",
    InProgress: "bg-yellow-500 text-black",
    Resolved: "bg-green-600 text-white",
    Closed: "bg-slate-500 text-white",
  }[status] || "bg-slate-700 text-white");

  const severityColor = (severity) => ({
    SafetyCritical: "bg-red-500 text-white",
    Urgent: "bg-orange-500 text-white",
    Minor: "bg-yellow-400 text-black",
  }[severity] || "bg-slate-400 text-black");

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-text-main">Issue Management</h1>
        <span className="text-sm text-text-muted mt-2 md:mt-0">
          Total Issues: <strong className="text-text-main">{issues.length}</strong>
        </span>
      </div>

      {/* No issues */}
      {issues.length === 0 ? (
        <div className="text-center py-12 bg-surface rounded-2xl border border-border">
          <Wrench className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-text-muted">No issues reported yet.</p>
        </div>
      ) : (
        // Table
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-lg">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-text-main">ID / Title</th>
                <th className="px-4 py-3 text-left text-text-main">Chamber</th>
                <th className="px-4 py-3 text-left text-text-main">Reported By</th>
                <th className="px-4 py-3 text-left text-text-main">Assigned To</th>
                <th className="px-4 py-3 text-left text-text-main">Severity</th>
                <th className="px-4 py-3 text-left text-text-main">Status</th>
                <th className="px-4 py-3 text-left text-text-main">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {issues.map((issue) => (
                <tr key={issue.issueId} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 text-text-main">
                    <div className="font-medium">{issue.title}</div>
                    <div className="text-text-muted text-xs">ID: {issue.issueId}</div>
                  </td>
                  <td className="px-4 py-3 text-text-main">
                    {issue.Chamber?.modelName || "-"} (SN: {issue.Chamber?.serialNumber || "-"})
                  </td>
                  <td className="px-4 py-3 text-text-main">{issue.creator?.username || issue.createdByName || "-"}</td>
                  <td className="px-4 py-3 text-text-main">{issue.engineer?.username || "Unassigned"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${severityColor(issue.severity)}`}>
                      {issue.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${statusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-y-2">
                    {/* Assign / Reassign Panel */}
                    {showAssignPanel[issue.issueId] ? (
                      <>
                        <select
                          value={selectedEngineer[issue.issueId] || ""}
                          onChange={(e) =>
                            setSelectedEngineer({ ...selectedEngineer, [issue.issueId]: e.target.value })
                          }
                          className="w-full bg-slate-50 border border-border rounded-lg px-2 py-1 text-text-main focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                        >
                          <option value="">Select an engineer...</option>
                          {engineers.map((eng) => (
                            <option key={eng.id} value={eng.id.toString()}>
                              {eng.username} • {eng.email || "Engineering"}
                            </option>
                          ))}
                        </select>

                        <div className="flex space-x-2 mt-1">
                          <button
                            onClick={() => handleAssign(issue.issueId)}
                            disabled={!selectedEngineer[issue.issueId] || assigning[issue.issueId]}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 text-xs"
                          >
                            {assigning[issue.issueId] ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                            <span>{assigning[issue.issueId] ? "Assigning" : "Confirm"}</span>
                          </button>

                          <button
                            onClick={() => toggleAssignPanel(issue.issueId)}
                            className="px-2 py-1 text-text-muted hover:text-text-main hover:bg-slate-200 rounded transition text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        disabled={!!issue.engineer?.username} // disable if already assigned
                        className={`w-full px-2 py-1 rounded text-xs text-white transition flex items-center justify-center space-x-1 ${issue.engineer?.username
                          ? "bg-slate-200 text-slate-500 cursor-not-allowed" // looks disabled
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                          }`}
                      >
                        <Wrench size={14} />
                        <span>
                          {issue.engineer?.username ? `Already Assigned to ${issue.engineer.username}` : "Assign"}
                        </span>
                      </button>

                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminIssues;
