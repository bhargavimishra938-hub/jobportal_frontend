import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  CalendarDays,
  Eye,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  MessageCircle,
} from "lucide-react";

const API_BASE =
  "http://localhost/job_portal/job-portal-api/api";

const Applicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const navigate = useNavigate();

  // =====================================================
  // GET RECRUITER ID
  // =====================================================

  const getRecruiterId = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      const user = JSON.parse(storedUser);

      console.log("Logged in user:", user);
      console.log("User ID:", user?.id);
      console.log("User userId:", user?.userId);
      console.log("User user_id:", user?.user_id);
      console.log(
        "Local recruiterId:",
        localStorage.getItem("recruiterId")
      );

      return (
        user?.id ||
        user?.userId ||
        user?.user_id ||
        localStorage.getItem("recruiterId")
      );
    } catch (error) {
      console.error("User parse error:", error);
      return null;
    }
  };

  // =====================================================
  // FETCH RECRUITER APPLICATIONS
  // =====================================================

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const recruiterId = getRecruiterId();

      console.log("Recruiter ID:", recruiterId);

      if (!recruiterId) {
        setError("Recruiter ID not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_BASE}/applications/get-recruiter-applications.php?recruiterId=${recruiterId}`
      );

      console.log("Applications API:", response.data);

      if (response.data.success) {
        setApplications(response.data.applications || []);
      } else {
        setError(
          response.data.message ||
            "Failed to fetch applications"
        );
      }
    } catch (err) {
      console.error("Applications Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to fetch applications"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchApplications();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredApplications = applications.filter(
    (application) => {
      const searchText = search.toLowerCase().trim();

      return (
        application.candidate_name
          ?.toLowerCase()
          .includes(searchText) ||
        application.candidate_email
          ?.toLowerCase()
          .includes(searchText) ||
        application.job_title
          ?.toLowerCase()
          .includes(searchText) ||
        application.company_name
          ?.toLowerCase()
          .includes(searchText)
      );
    }
  );

  // =====================================================
  // UPDATE APPLICATION STATUS
  // =====================================================

  const updateApplicationStatus = async (
    applicationId,
    status
  ) => {
    try {
      setUpdatingId(applicationId);

      const response = await fetch(
        `${API_BASE}/applications/update-status.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            application_id: Number(applicationId),
            status: status,
          }),
        }
      );

      const rawResponse = await response.text();

      console.log(
        "Status Update RAW Response:",
        rawResponse
      );

      let data;

      try {
        data = JSON.parse(rawResponse);
      } catch (parseError) {
        console.error(
          "Status JSON Parse Error:",
          parseError
        );

        alert(
          "Server returned an invalid response. Please check PHP."
        );

        return;
      }

      console.log("Status Update Response:", data);

      if (!data.success) {
        alert(
          data.message ||
            "Failed to update application status"
        );

        return;
      }

      // Update UI immediately
      setApplications((prev) =>
        prev.map((application) =>
          Number(application.application_id) ===
          Number(applicationId)
            ? {
                ...application,
                status: status,
              }
            : application
        )
      );

      alert(
        `Application ${status} successfully!`
      );
    } catch (error) {
      console.error(
        "Status Update Error:",
        error
      );

      alert(
        "Something went wrong while updating status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // MESSAGE CANDIDATE
  // =====================================================

  const messageCandidate = (application) => {
    const candidateId = Number(
      application.candidate_id
    );

    if (!candidateId) {
      alert(
        "Candidate ID not found for this application."
      );

      console.error(
        "Candidate ID missing:",
        application
      );

      return;
    }

    console.log(
      "Opening message for candidate:",
      candidateId
    );

    navigate("/recruiter/messages", {
      state: {
        candidateId: candidateId,
        candidateName:
          application.candidate_name,
        candidateEmail:
          application.candidate_email,
      },
    });
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Shortlisted":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Hired":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />

          <span>Loading applicants...</span>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Applicants
        </h1>

        <p className="text-gray-500 mt-1">
          Manage candidates who have applied for your jobs.
        </p>
      </div>

      {/* TOP SECTION */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          {/* TOTAL APPLICATIONS */}
          <div>
            <p className="text-sm text-gray-500">
              Total Applications
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-1">
              {applications.length}
            </h2>
          </div>

          {/* SEARCH */}
          <div className="relative w-full md:w-80">

            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={19}
            />

            <input
              type="text"
              placeholder="Search applicants..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

          </div>

        </div>

      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertCircle size={20} />

          <span>{error}</span>
        </div>
      )}

      {/* EMPTY */}
      {!error &&
        filteredApplications.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">

            <User
              size={45}
              className="mx-auto text-gray-300 mb-4"
            />

            <h3 className="text-lg font-semibold text-gray-800">
              No applicants found
            </h3>

            <p className="text-gray-500 mt-1">
              No applications match your search.
            </p>

          </div>
        )}

      {/* APPLICATIONS */}
      <div className="space-y-5">

        {filteredApplications.map(
          (application) => {

            const isUpdating =
              Number(updatingId) ===
              Number(application.application_id);

            return (
              <div
                key={application.application_id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition"
              >

                {/* TOP */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                  {/* CANDIDATE */}
                  <div className="flex items-start gap-4">

                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                      <User
                        size={26}
                        className="text-blue-600"
                      />
                    </div>

                    <div>

                      <h2 className="text-lg font-bold text-gray-900">
                        {application.candidate_name}
                      </h2>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-gray-500">

                        <span className="flex items-center gap-1">
                          <Mail size={15} />

                          {application.candidate_email}
                        </span>

                        <span className="flex items-center gap-1">
                          <Phone size={15} />

                          {application.candidate_phone}
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* STATUS */}
                  <span
                    className={`inline-flex w-fit px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                      application.status
                    )}`}
                  >
                    {application.status}
                  </span>

                </div>

                {/* JOB INFO */}
                <div className="border-t border-gray-100 mt-5 pt-5">

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* JOB */}
                    <div>
                      <p className="text-xs text-gray-400 mb-1">
                        Applied For
                      </p>

                      <div className="flex items-center gap-2 text-gray-800 font-medium">
                        <Briefcase
                          size={17}
                          className="text-gray-400"
                        />

                        {application.job_title}
                      </div>
                    </div>

                    {/* LOCATION */}
                    <div>
                      <p className="text-xs text-gray-400 mb-1">
                        Location
                      </p>

                      <div className="flex items-center gap-2 text-gray-800">
                        <MapPin
                          size={17}
                          className="text-gray-400"
                        />

                        {application.location}
                      </div>
                    </div>

                    {/* EXPERIENCE */}
                    <div>
                      <p className="text-xs text-gray-400 mb-1">
                        Experience
                      </p>

                      <div className="text-gray-800">
                        {application.experience}
                      </div>
                    </div>

                    {/* APPLIED DATE */}
                    <div>
                      <p className="text-xs text-gray-400 mb-1">
                        Applied Date
                      </p>

                      <div className="flex items-center gap-2 text-gray-800">
                        <CalendarDays
                          size={17}
                          className="text-gray-400"
                        />

                        {application.applied_at}
                      </div>
                    </div>

                  </div>

                </div>

                {/* SKILLS */}
                <div className="mt-5">

                  <p className="text-xs text-gray-400 mb-2">
                    Skills
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {Array.isArray(
                      application.skills
                    ) &&
                    application.skills.length > 0 ? (
                      application.skills.map(
                        (skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        )
                      )
                    ) : (
                      <span className="text-sm text-gray-400">
                        No skills added
                      </span>
                    )}

                  </div>

                </div>

                {/* FOOTER */}
                <div className="border-t border-gray-100 mt-5 pt-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                  {/* APPLICATION ID */}
                  <div className="text-sm text-gray-500">
                    Application ID:{" "}
                    <span className="font-medium text-gray-700">
                      #{application.application_id}
                    </span>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex flex-wrap items-center gap-2">

                    {/* SHORTLIST */}
                    {application.status !==
                      "Shortlisted" &&
                      application.status !==
                        "Rejected" &&
                      application.status !==
                        "Hired" && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            updateApplicationStatus(
                              application.application_id,
                              "Shortlisted"
                            )
                          }
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                        >
                          {isUpdating ? (
                            <Loader2
                              size={17}
                              className="animate-spin"
                            />
                          ) : (
                            <CheckCircle size={17} />
                          )}

                          Shortlist
                        </button>
                      )}

                    {/* REJECT */}
                    {application.status !==
                      "Rejected" &&
                      application.status !==
                        "Hired" && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            updateApplicationStatus(
                              application.application_id,
                              "Rejected"
                            )
                          }
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                        >
                          {isUpdating ? (
                            <Loader2
                              size={17}
                              className="animate-spin"
                            />
                          ) : (
                            <XCircle size={17} />
                          )}

                          Reject
                        </button>
                      )}

                    {/* MESSAGE */}
                    <button
                      type="button"
                      onClick={() =>
                        messageCandidate(application)
                      }
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <MessageCircle size={17} />

                      Message
                    </button>

                    {/* VIEW DETAILS */}
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/recruiter/applicant/${application.application_id}`,
                          {
                            state: {
                              application:
                                application,
                            },
                          }
                        )
                      }
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                    >
                      <Eye size={17} />

                      View Details
                    </button>

                  </div>

                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
};

export default Applicants;