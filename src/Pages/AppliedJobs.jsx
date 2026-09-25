import React, { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  MapPin,
  CalendarDays,
  Clock3,
  IndianRupee,
  ChevronRight,
  FileText,
  Search,
  Loader2,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  XCircle,
  UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const APPLICATIONS_API =
  "http://localhost/job_portal/job-portal-api/api/applications/get-my-applications.php";

const AppliedJobs = () => {
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // =====================================================
  // GET LOGGED-IN USER
  // =====================================================

  const getLoggedInUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.error("User Parse Error:", error);
      return null;
    }
  };

  // =====================================================
  // FETCH APPLICATIONS
  // =====================================================

  const fetchApplications = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const user = getLoggedInUser();

      console.log("Logged In Candidate:", user);

      if (!user) {
        setError("Please login to view your applied jobs.");
        return;
      }

      if (user.role !== "candidate") {
        setError("Only candidates can view applied jobs.");
        return;
      }

      if (!user.id) {
        setError("Candidate ID not found.");
        return;
      }

      const candidateId = Number(user.id);

      console.log(
        "Fetching Applications For Candidate:",
        candidateId
      );

      const response = await fetch(
        `${APPLICATIONS_API}?candidateId=${candidateId}`
      );

      const data = await response.json();

      console.log("My Applications API Response:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch applications"
        );
      }

      const applicationList = Array.isArray(data.applications)
        ? data.applications
        : [];

      setApplications(applicationList);
    } catch (err) {
      console.error("Applied Jobs Error:", err);

      setError(
        err.message ||
          "Something went wrong while loading applications."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(() => {
    fetchApplications();
  }, []);

  // =====================================================
  // SEARCH + STATUS FILTER
  // =====================================================

  useEffect(() => {
    let result = [...applications];

    // Search
    if (search.trim()) {
      const keyword = search.toLowerCase();

      result = result.filter((application) => {
        const jobTitle =
          application.job_title?.toLowerCase() || "";

        const companyName =
          application.company_name?.toLowerCase() || "";

        const location =
          application.location?.toLowerCase() || "";

        return (
          jobTitle.includes(keyword) ||
          companyName.includes(keyword) ||
          location.includes(keyword)
        );
      });
    }

    // Status filter
    if (statusFilter !== "All") {
      result = result.filter(
        (application) =>
          application.status === statusFilter
      );
    }

    setFilteredApplications(result);
  }, [search, statusFilter, applications]);

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "Not available";

    const formattedDate = new Date(
      String(date).replace(" ", "T")
    );

    if (Number.isNaN(formattedDate.getTime())) {
      return date;
    }

    return formattedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Shortlisted":
        return {
          badge:
            "bg-blue-50 text-blue-700 border-blue-200",
          icon: UserCheck,
        };

      case "Rejected":
        return {
          badge:
            "bg-red-50 text-red-700 border-red-200",
          icon: XCircle,
        };

      case "Hired":
        return {
          badge:
            "bg-green-50 text-green-700 border-green-200",
          icon: CheckCircle2,
        };

      default:
        return {
          badge:
            "bg-amber-50 text-amber-700 border-amber-200",
          icon: Clock3,
        };
    }
  };

  // =====================================================
  // STATUS MESSAGE
  // =====================================================

  const getStatusMessage = (status) => {
    switch (status) {
      case "Shortlisted":
        return "Congratulations! Your application has been shortlisted.";

      case "Rejected":
        return "This application has been rejected by the recruiter.";

      case "Hired":
        return "Congratulations! You have been hired.";

      default:
        return "Your application has been submitted successfully and is under review.";
    }
  };

  // =====================================================
  // VIEW JOB
  // =====================================================

  const handleViewJob = (jobId) => {
    if (!jobId) {
      return;
    }

    navigate(`/jobs/${jobId}`);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

          <p className="text-sm font-medium text-slate-600">
            Loading your applied jobs...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-52 w-52 rounded-full bg-cyan-300/20 blur-2xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-50">
                <BriefcaseBusiness className="h-4 w-4" />

                <span>Candidate Dashboard</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight">
                Applied Jobs
              </h1>

              <p className="mt-2 text-sm text-blue-100">
                Track all the jobs you have applied for.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Refresh */}

              <button
                type="button"
                onClick={() => fetchApplications(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />

                Refresh
              </button>

              {/* Total Applications */}

              <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 backdrop-blur-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-blue-50">
                  Total Applications
                </p>

                <p className="mt-1 text-2xl font-bold text-white">
                  {applications.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">
                Unable to load applications
              </p>

              <p className="mt-1 text-sm">{error}</p>

              <button
                type="button"
                onClick={() => fetchApplications(true)}
                className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* =================================================
            SEARCH + FILTER
        ================================================= */}

        {!error && (
          <>
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row">
                {/* Search */}

                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    placeholder="Search by job title, company or location..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Status */}

                <div className="md:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="All">
                      All Status
                    </option>

                    <option value="Applied">
                      Applied
                    </option>

                    <option value="Shortlisted">
                      Shortlisted
                    </option>

                    <option value="Rejected">
                      Rejected
                    </option>

                    <option value="Hired">
                      Hired
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* =================================================
                EMPTY
            ================================================= */}

            {filteredApplications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 shadow-sm">
                  <BriefcaseBusiness className="h-8 w-8 text-slate-300" />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  No applications found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                  {applications.length === 0
                    ? "You haven't applied for any jobs yet."
                    : "No applications match your current search or filter."}
                </p>

                {applications.length === 0 && (
                  <button
                    type="button"
                    onClick={() => navigate("/jobs")}
                    className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
                  >
                    Find Jobs
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                {/* Result Count */}

                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">
                    Showing{" "}
                    <span className="font-semibold text-slate-900">
                      {filteredApplications.length}
                    </span>{" "}
                    application
                    {filteredApplications.length !== 1
                      ? "s"
                      : ""}
                  </p>
                </div>

                {/* =================================================
                    APPLICATION CARDS
                ================================================= */}

                {filteredApplications.map(
                  (application) => {
                    const status =
                      application.status || "Applied";

                    const statusData =
                      getStatusStyle(status);

                    const StatusIcon =
                      statusData.icon;

                    return (
                      <div
                        key={application.application_id}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        <div className="p-5 sm:p-6">
                          {/* TOP */}

                          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                            {/* Job Info */}

                            <div className="flex gap-4">
                              {/* Company Logo */}

                              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-lg font-bold text-white shadow-sm shadow-blue-500/30">
                                {application.company_name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "C"}
                              </div>

                              <div className="min-w-0">
                                <h2 className="text-lg font-bold text-slate-900">
                                  {application.job_title ||
                                    "Job Title"}
                                </h2>

                                <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                                  <Building2 className="h-4 w-4 shrink-0" />

                                  <span>
                                    {application.company_name ||
                                      "Company"}
                                  </span>
                                </div>

                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
                                  <span className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4" />

                                    {application.location ||
                                      "Location not specified"}
                                  </span>

                                  <span className="flex items-center gap-1.5">
                                    <BriefcaseBusiness className="h-4 w-4" />

                                    {application.job_type ||
                                      "Job type not specified"}
                                  </span>

                                  <span className="flex items-center gap-1.5">
                                    <Clock3 className="h-4 w-4" />

                                    {application.experience ||
                                      "Experience not specified"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* STATUS */}

                            <div className="shrink-0">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${statusData.badge}`}
                              >
                                <StatusIcon className="h-4 w-4" />

                                {status}
                              </span>
                            </div>
                          </div>

                          {/* =================================================
                              JOB DETAILS
                          ================================================= */}

                          <div className="mt-6 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Salary */}

                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-xs text-slate-500">
                                Salary
                              </p>

                              <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-slate-800">
                                <IndianRupee className="h-4 w-4" />

                                {application.salary ||
                                  "Not specified"}
                              </p>
                            </div>

                            {/* Applied On */}

                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-xs text-slate-500">
                                Applied On
                              </p>

                              <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                                <CalendarDays className="h-4 w-4" />

                                {formatDate(
                                  application.applied_at
                                )}
                              </p>
                            </div>

                            {/* Deadline */}

                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-xs text-slate-500">
                                Deadline
                              </p>

                              <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                                <CalendarDays className="h-4 w-4" />

                                {formatDate(
                                  application.deadline
                                )}
                              </p>
                            </div>

                            {/* Application ID */}

                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-xs text-slate-500">
                                Application ID
                              </p>

                              <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                                <FileText className="h-4 w-4" />

                                #{application.application_id}
                              </p>
                            </div>
                          </div>

                          {/* =================================================
                              SKILLS
                          ================================================= */}

                          {Array.isArray(
                            application.skills
                          ) &&
                            application.skills.length >
                              0 && (
                              <div className="mt-5 flex flex-wrap gap-2">
                                {application.skills.map(
                                  (skill, index) => (
                                    <span
                                      key={index}
                                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-100"
                                    >
                                      {skill}
                                    </span>
                                  )
                                )}
                              </div>
                            )}

                          {/* =================================================
                              STATUS MESSAGE
                          ================================================= */}

                          <div
                            className={`mt-6 rounded-xl border p-4 ${
                              status === "Rejected"
                                ? "border-red-100 bg-red-50"
                                : status ===
                                  "Shortlisted"
                                ? "border-blue-100 bg-blue-50"
                                : status === "Hired"
                                ? "border-green-100 bg-green-50"
                                : "border-amber-100 bg-amber-50"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <StatusIcon className="mt-0.5 h-5 w-5 shrink-0" />

                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
                                  Application Status
                                </p>

                                <p className="mt-1 text-sm font-semibold">
                                  {getStatusMessage(status)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* =================================================
                              FOOTER
                          ================================================= */}

                          <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-xs text-slate-400">
                                Application submitted
                              </p>

                              <p className="mt-1 text-sm font-semibold text-slate-700">
                                {formatDate(
                                  application.applied_at
                                )}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleViewJob(
                                  application.job_id
                                )
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            >
                              View Job

                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AppliedJobs;