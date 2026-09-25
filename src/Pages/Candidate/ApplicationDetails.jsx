import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  MapPin,
  Clock,
  CalendarDays,
  IndianRupee,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  Loader2,
  AlertCircle,
  Hash,
} from "lucide-react";

const API_BASE =
  "http://localhost/job_portal/job-portal-api/api";

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      setError("");

      // Get logged-in user
      const storedUser = localStorage.getItem("user");

      let user = null;

      try {
        user = storedUser ? JSON.parse(storedUser) : null;
      } catch (parseError) {
        console.error("User data parse error:", parseError);
      }

      // Get candidate ID from logged-in user
      const candidateId =
        user?.id ||
        localStorage.getItem("id") ||
        localStorage.getItem("userId") ||
        localStorage.getItem("user_id");

      console.log("Application ID:", id);
      console.log("Logged-in User:", user);
      console.log("Candidate ID:", candidateId);

      // Candidate ID is required
      if (!candidateId) {
        setError("Candidate login information not found. Please login again.");
        return;
      }

      const response = await fetch(
        `${API_BASE}/applications/get-candidate-application-by-id.php?applicationId=${id}&candidateId=${candidateId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      console.log("Application API Response:", data);

      if (data.success && data.application) {
        setApplication(data.application);
      } else {
        setError(data.message || "Application not found.");
      }
    } catch (error) {
      console.error("Application details error:", error);
      setError("Unable to load application details.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Shortlisted":
        return "bg-green-50 text-green-700 border-green-200";

      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";

      case "Hired":
        return "bg-blue-50 text-blue-700 border-blue-200";

      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Shortlisted":
      case "Hired":
        return <CheckCircle size={18} />;

      case "Rejected":
        return <XCircle size={18} />;

      default:
        return <Clock size={18} />;
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2
            className="animate-spin mx-auto text-blue-600"
            size={32}
          />

          <p className="mt-4 text-slate-600 font-medium">
            Loading application details...
          </p>
        </div>
      </div>
    );
  }

  // Error
  if (error || !application) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <AlertCircle
                size={32}
                className="text-red-500"
              />
            </div>

            <h2 className="text-xl font-bold text-slate-900 mt-5">
              Application Not Found
            </h2>

            <p className="text-slate-500 mt-2">
              {error || "Unable to find this application."}
            </p>

            <button
              onClick={() => navigate("/candidate/applied-jobs")}
              className="mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition"
            >
              Back to Applied Jobs
            </button>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Header */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

            <div>

              <div className="flex items-center gap-3 mb-3">

                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm shadow-blue-500/30 flex items-center justify-center shrink-0">
                  <Briefcase
                    size={22}
                    className="text-white"
                  />
                </div>

                <div>

                  <h1 className="text-2xl font-bold text-slate-900">
                    {application.job_title}
                  </h1>

                  <div className="flex items-center gap-2 text-slate-500 mt-1">
                    <Building2 size={16} />
                    {application.company_name}
                  </div>

                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-4">

                <div className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-slate-400" />
                  {application.location}
                </div>

                <div className="flex items-center gap-1.5">
                  <Briefcase size={16} className="text-slate-400" />
                  {application.job_type}
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-slate-400" />
                  {application.experience}
                </div>

              </div>
            </div>

            {/* Status */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-semibold shrink-0 ${getStatusStyle(
                application.status
              )}`}
            >
              {getStatusIcon(application.status)}
              {application.status}
            </div>

          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* Job Information */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

              <h2 className="text-lg font-bold text-slate-900 mb-5">
                Job Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                  <p className="text-xs text-slate-400">
                    Company
                  </p>

                  <p className="font-semibold text-slate-800 mt-1">
                    {application.company_name}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                  <p className="text-xs text-slate-400">
                    Location
                  </p>

                  <p className="font-semibold text-slate-800 mt-1">
                    {application.location}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                  <p className="text-xs text-slate-400">
                    Job Type
                  </p>

                  <p className="font-semibold text-slate-800 mt-1">
                    {application.job_type}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                  <p className="text-xs text-slate-400">
                    Experience
                  </p>

                  <p className="font-semibold text-slate-800 mt-1">
                    {application.experience}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                  <p className="text-xs text-slate-400">
                    Salary
                  </p>

                  <p className="font-semibold text-slate-800 mt-1 flex items-center gap-1">
                    <IndianRupee size={14} />
                    {application.salary || "Not specified"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                  <p className="text-xs text-slate-400">
                    Application Date
                  </p>

                  <p className="font-semibold text-slate-800 mt-1 flex items-center gap-1">
                    <CalendarDays size={14} />
                    {application.applied_at}
                  </p>
                </div>

              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Job Description
              </h2>

              <p className="text-slate-600 leading-7 whitespace-pre-line">
                {application.description ||
                  "No description available."}
              </p>

            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Required Skills
              </h2>

              <div className="flex flex-wrap gap-2">

                {Array.isArray(application.skills) &&
                application.skills.length > 0 ? (
                  application.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-100 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 text-sm">
                    No skills specified.
                  </span>
                )}

              </div>
            </div>

            {/* Cover Letter */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Your Cover Letter
              </h2>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">

                <p className="text-slate-600 leading-7 whitespace-pre-line">
                  {application.cover_letter ||
                    "No cover letter provided."}
                </p>

              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* Application Status */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

              <h2 className="text-lg font-bold text-slate-900 mb-5">
                Application Status
              </h2>

              <div
                className={`rounded-xl border p-4 ${getStatusStyle(
                  application.status
                )}`}
              >

                <div className="flex items-center gap-3">

                  {getStatusIcon(application.status)}

                  <div>

                    <p className="font-semibold">
                      {application.status}
                    </p>

                    <p className="text-sm mt-1 opacity-80">
                      {application.status === "Shortlisted"
                        ? "Your application has been shortlisted."
                        : application.status === "Rejected"
                        ? "Your application was not selected."
                        : application.status === "Hired"
                        ? "Congratulations! You have been selected."
                        : "Your application has been submitted."}
                    </p>

                  </div>
                </div>

              </div>
            </div>

            {/* Resume */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Submitted Resume
              </h2>

              <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">

                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                  <FileText
                    size={20}
                    className="text-red-500"
                  />
                </div>

                <div className="flex-1 min-w-0">

                  <p className="font-medium text-slate-800 truncate">
                    Resume
                  </p>

                  <p className="text-xs text-slate-500">
                    Submitted with application
                  </p>

                </div>

              </div>

              {application.resume && (
                <a
                  href={application.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition"
                >
                  <Download size={17} />
                  View / Download Resume
                </a>
              )}

            </div>

            {/* Application ID */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <Hash size={16} className="text-slate-500" />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Application ID
                  </p>

                  <p className="font-bold text-slate-900 mt-0.5">
                    #{application.application_id}
                  </p>
                </div>

              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;