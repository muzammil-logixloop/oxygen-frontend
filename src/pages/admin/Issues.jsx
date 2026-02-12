import React, { useEffect, useState, useMemo } from "react";
import axios from "../../services/apiClient";
import {
  User,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Wrench,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 10;

const AdminIssues = () => {
  const [issues, setIssues] = useState([]);

  /* ==============================
     🔽 COMMENTED ASSIGNMENT STATES
  ============================== */

  // const [engineers, setEngineers] = useState([]);
  // const [assigning, setAssigning] = useState({});
  // const [selectedEngineer, setSelectedEngineer] = useState({});
  // const [showAssignPanel, setShowAssignPanel] = useState({});

  /* ==============================
     🔽 FILTER + PAGINATION STATES
  ============================== */

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch issues
  const fetchIssues = async () => {
    try {
      const res = await axios.get("/ops/issues/my");
      setIssues(res.data);
    } catch (err) {
      console.error("Error fetching issues:", err);
    }
  };

  /*
  // Fetch engineers
  const fetchEngineers = async () => {
    try {
      const res = await axios.get("/admin/users/engineers");
      setEngineers(res.data);
    } catch (err) {
      console.error("Error fetching engineers:", err);
    }
  };
  */

  useEffect(() => {
    fetchIssues();
    // fetchEngineers();
  }, []);

  /*
  // Assign engineer
  const handleAssign = async (issueId) => {
    const val = selectedEngineer[issueId];
    if (!val) return;

    const engineerId = Number(val);
    if (!engineerId) return;

    try {
      setAssigning({ ...assigning, [issueId]: true });

      await axios.post("/ops/issues/assign", { issueId, engineerId });

      fetchIssues();
      setShowAssignPanel({ ...showAssignPanel, [issueId]: false });
      setSelectedEngineer({ ...selectedEngineer, [issueId]: "" });

      toast.success("Engineer assigned successfully");
    } catch (err) {
      console.error("Error assigning engineer:", err);
      toast.error("Failed to assign engineer");
    } finally {
      setAssigning({ ...assigning, [issueId]: false });
    }
  };

  const toggleAssignPanel = (issueId) => {
    setShowAssignPanel({
      ...showAssignPanel,
      [issueId]: !showAssignPanel[issueId],
    });

    if (showAssignPanel[issueId]) {
      setSelectedEngineer({
        ...selectedEngineer,
        [issueId]: "",
      });
    }
  };
  */

  /* ==============================
     🔎 FILTERING LOGIC
  ============================== */

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchesSearch =
        issue.title?.toLowerCase().includes(search.toLowerCase()) ||
        issue.issueId?.toString().includes(search);

      const matchesStatus = statusFilter
        ? issue.status === statusFilter
        : true;

      const matchesSeverity = severityFilter
        ? issue.severity === severityFilter
        : true;

      return matchesSearch && matchesStatus && matchesSeverity;
    });
  }, [issues, search, statusFilter, severityFilter]);

  /* ==============================
     📄 PAGINATION LOGIC
  ============================== */

  const totalPages = Math.ceil(filteredIssues.length / ITEMS_PER_PAGE);

  const paginatedIssues = filteredIssues.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* ==============================
     🎨 UI HELPERS
  ============================== */

  const statusColor = (status) =>
    ({
      New: "bg-emerald-600 text-white",
      InProgress: "bg-yellow-500 text-black",
      Resolved: "bg-green-600 text-white",
      Closed: "bg-slate-500 text-white",
    }[status] || "bg-slate-700 text-white");

  const severityColor = (severity) =>
    ({
      SafetyCritical: "bg-red-500 text-white",
      Urgent: "bg-orange-500 text-white",
      Minor: "bg-yellow-400 text-black",
    }[severity] || "bg-slate-400 text-black");

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-text-main">
          Issue Management
        </h1>
        <span className="text-sm text-text-muted mt-2 md:mt-0">
          Total Issues:{" "}
          <strong className="text-text-main">
            {filteredIssues.length}
          </strong>
        </span>
      </div>

      {/* Filters */}
      <div className="bg-surface border border-border rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by Title or ID..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-1 bg-slate-50 border border-border rounded-lg px-3 py-2 text-text-main focus:ring-2 focus:ring-emerald-500 outline-none"
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-slate-50 border border-border rounded-lg px-3 py-2 text-text-main"
        >
          <option value="">All Status</option>
          <option value="New">New</option>
          <option value="InProgress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        <select
          value={severityFilter}
          onChange={(e) => {
            setSeverityFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-slate-50 border border-border rounded-lg px-3 py-2 text-text-main"
        >
          <option value="">All Severity</option>
          <option value="SafetyCritical">Safety Critical</option>
          <option value="Urgent">Urgent</option>
          <option value="Minor">Minor</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-lg">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-slate-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-text-main">ID / Title</th>
              <th className="px-4 py-3 text-left text-text-main">Chamber</th>
              <th className="px-4 py-3 text-left text-text-main">Reported By</th>
              {/* <th className="px-4 py-3 text-left text-text-main">Assigned To</th> */}
              <th className="px-4 py-3 text-left text-text-main">Severity</th>
              <th className="px-4 py-3 text-left text-text-main">Status</th>

              {/* <th className="px-4 py-3 text-left text-text-main">Action</th> */}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {paginatedIssues.map((issue) => (
              <tr key={issue.issueId} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3">
                  <div className="font-semibold text-text-main">
                    {issue.title}
                  </div>
                  <div className="text-xs text-text-muted">
                    ID: {issue.issueId}
                  </div>
                </td>

                <td className="px-4 py-3 text-text-main">
                  {issue.Chamber?.modelName || "-"}
                  <div className="text-xs text-text-muted">
                    SN: {issue.Chamber?.serialNumber || "-"}
                  </div>
                </td>

                <td className="px-4 py-3 text-text-main">
                  {issue.creator?.username || issue.createdByName || "-"}
                </td>

                {/* <td className="px-4 py-3 text-text-main">
                  {issue.engineer?.username || "Unassigned"}
                </td> */}

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${severityColor(
                      issue.severity
                    )}`}
                  >
                    {issue.severity}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${statusColor(
                      issue.status
                    )}`}
                  >
                    {issue.status}
                  </span>
                </td>

                {/*
                <td className="px-4 py-3 space-y-2">
                  // 🔥 FULL ASSIGNMENT UI COMMENTED
                  // Original assignment select + confirm button was here
                </td>
                */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 bg-slate-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm text-text-main">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 bg-slate-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminIssues;
