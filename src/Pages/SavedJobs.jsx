import React, { useEffect, useMemo, useState } from "react";
import {
  Heart,
  Search,
  MapPin,
  BriefcaseBusiness,
  Clock3,
  Trash2,
  ArrowRight,
  SlidersHorizontal,
  IndianRupee,
} from "lucide-react";



const SAVED_JOBS_API =
  "http://localhost/job_portal/job-portal-api/api/savedJobs/get.php";

const REMOVE_SAVED_JOB_API =
  "http://localhost/job_portal/job-portal-api/api/savedJobs/remove.php";

const SavedJobs = () => {
  const [search, setSearch] = useState("");
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // GET CURRENT USER ID
  // =========================
  const getCandidateId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      return (
        user?.id ||
        user?.userId ||
        user?.user_id ||
        localStorage.getItem("userId") ||
        localStorage.getItem("user_id")
      );
    } catch (error) {
      return (
        localStorage.getItem("userId") ||
        localStorage.getItem("user_id")
      );
    }
  };

  // =========================
  // FORMAT SAVED DATE
  // =========================
  const formatSavedDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(String(date).replace(" ", "T"));

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    const now = new Date();
    const difference = now - parsedDate;

    const minutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "just now";

    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }

    if (hours < 24) {
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }

    if (days < 30) {
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }

    return parsedDate.toLocaleDateString();
  };

  // =========================
  // FETCH SAVED JOBS
  // =========================
  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const candidateId = getCandidateId();

      console.log("Candidate ID:", candidateId);

      if (!candidateId) {
        setError("Candidate ID not found. Please login again.");
        setSavedJobs([]);
        return;
      }

      const response = await fetch(
        `${SAVED_JOBS_API}?candidate_id=${candidateId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      console.log("Saved Jobs API Response:", data);

      if (data.success) {
        const jobs = Array.isArray(data.saved_jobs)
          ? data.saved_jobs.map((job) => ({
              id: Number(job.job_id),
              savedJobId: Number(job.saved_job_id),

              title: job.job_title || "Untitled Job",
              company: job.company_name || "Company",

              location: job.location || "Location not specified",

              salary: job.salary || "Salary not specified",

              jobType: job.job_type || "Not specified",

              experience: job.experience || "Not specified",

              workMode:
                job.work_mode ||
                job.mode ||
                "",

              skills: Array.isArray(job.skills)
                ? job.skills
                : typeof job.skills === "string" && job.skills
                ? job.skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean)
                : [],

              savedAt: formatSavedDate(job.saved_at),

              description: job.description || "",
              deadline: job.deadline || "",
              status: job.status || "",
            }))
          : [];

        setSavedJobs(jobs);
      } else {
        setSavedJobs([]);
        setError(data.message || "Unable to fetch saved jobs.");
      }
    } catch (error) {
      console.error("Fetch Saved Jobs Error:", error);

      setSavedJobs([]);
      setError("Unable to load saved jobs.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD SAVED JOBS
  // =========================
  useEffect(() => {
    fetchSavedJobs();
  }, []);

  // =========================
  // SEARCH
  // =========================
  const filteredJobs = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return savedJobs;
    }

    return savedJobs.filter((job) => {
      return (
        job.title.toLowerCase().includes(searchText) ||
        job.company.toLowerCase().includes(searchText) ||
        job.location.toLowerCase().includes(searchText) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(searchText)
        )
      );
    });
  }, [savedJobs, search]);

  // =========================
  // REMOVE JOB
  // =========================
  const removeJob = async (job) => {
    try {
      const candidateId = getCandidateId();

      if (!candidateId) {
        alert("Please login again.");
        return;
      }

      const response = await fetch(REMOVE_SAVED_JOB_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidate_id: Number(candidateId),
          job_id: Number(job.id),
        }),
      });

      const data = await response.json();

      console.log("Remove Saved Job Response:", data);

      if (data.success) {
        setSavedJobs((prev) =>
          prev.filter((item) => item.id !== job.id)
        );
      } else {
        alert(data.message || "Unable to remove saved job.");
      }
    } catch (error) {
      console.error("Remove Saved Job Error:", error);
      alert("Unable to remove saved job.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          {/* HEADER */}
          <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-6 text-white shadow-lg shadow-blue-600/10 sm:px-8 sm:py-8">

            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

            <div className="relative flex items-center gap-3">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-inset ring-white/20">
                <Heart className="h-6 w-6 fill-white text-white" />
              </div>

              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  Saved Jobs
                </h1>

                <p className="mt-1 text-blue-100">
                  Jobs you've saved for later
                </p>
              </div>

            </div>
          </div>

          {/* SEARCH + COUNT */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              {/* SEARCH */}
              <div className="relative w-full sm:max-w-md">

                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  placeholder="Search saved jobs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

              </div>

              {/* COUNT */}
              <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3.5 py-2 text-sm text-blue-700">

                <SlidersHorizontal className="h-4 w-4" />

                <span>
                  <strong className="font-bold">
                    {filteredJobs.length}
                  </strong>{" "}
                  saved jobs
                </span>

              </div>

            </div>

          </div>

          {/* =========================
              LOADING
          ========================= */}
          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-4 text-slate-500">
                Loading saved jobs...
              </p>

            </div>
          )}

          {/* =========================
              ERROR
          ========================= */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">

              <p className="font-medium text-red-600">
                {error}
              </p>

              <button
                onClick={fetchSavedJobs}
                className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
              >
                Try Again
              </button>

            </div>
          )}

          {/* =========================
              JOB LIST
          ========================= */}
          {!loading &&
            !error &&
            filteredJobs.length > 0 && (
              <div className="space-y-4">

                {filteredJobs.map((job) => (

                  <div
                    key={job.savedJobId}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 transition duration-150 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg sm:p-6"
                  >

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      {/* JOB INFO */}
                      <div className="flex gap-4">

                        {/* COMPANY LOGO */}
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm shadow-blue-500/30 transition group-hover:scale-105">

                          <BriefcaseBusiness className="h-7 w-7 text-white" />

                        </div>

                        <div className="min-w-0">

                          {/* TITLE */}
                          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                            {job.title}
                          </h2>

                          {/* COMPANY */}
                          <p className="mt-1 font-medium text-blue-600">
                            {job.company}
                          </p>

                          {/* META */}
                          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">

                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 text-slate-400" />
                              {job.location}
                            </span>

                            <span className="flex items-center gap-1.5 font-medium text-slate-700">
                              <IndianRupee className="h-3.5 w-3.5" />
                              {job.salary}
                            </span>

                            <span className="flex items-center gap-1.5">
                              <BriefcaseBusiness className="h-4 w-4 text-slate-400" />
                              {job.jobType}
                            </span>

                            <span>
                              {job.experience}
                            </span>

                            {job.workMode && (
                              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                {job.workMode}
                              </span>
                            )}

                          </div>

                          {/* SKILLS */}
                          {job.skills.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">

                              {job.skills.map((skill) => (

                                <span
                                  key={skill}
                                  className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-100"
                                >
                                  {skill}
                                </span>

                              ))}

                            </div>
                          )}

                          {/* SAVED DATE */}
                          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">

                            <Clock3 className="h-3.5 w-3.5" />

                            Saved {job.savedAt}

                          </div>

                        </div>

                      </div>

                      {/* ACTIONS */}
                      <div className="flex gap-3 lg:min-w-[230px] lg:flex-col xl:flex-row">

                        {/* APPLY */}
                        <button
                          onClick={() => {
                            window.location.href = `/jobs/${job.id}/apply`;
                          }}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
                        >
                          Apply Now

                          <ArrowRight className="h-4 w-4" />
                        </button>

                        {/* REMOVE */}
                        <button
                          onClick={() => removeJob(job)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >

                          <Trash2 className="h-4 w-4" />

                          Remove

                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>
            )}

          {/* =========================
              EMPTY STATE
          ========================= */}
          {!loading &&
            !error &&
            filteredJobs.length === 0 && (

              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 shadow-sm">

                  <Heart className="h-10 w-10 text-slate-300" />

                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  No saved jobs found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-slate-500">

                  {search
                    ? "Try searching with a different keyword."
                    : "Jobs you save will appear here. Start exploring jobs and save the ones you like."}

                </p>

                {!search && (
                  <button
                    onClick={() => {
                      window.location.href = "/jobs";
                    }}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
                  >
                    Find Jobs

                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}

              </div>
            )}

        </div>
      </main>

    </div>
  );
};

export default SavedJobs;