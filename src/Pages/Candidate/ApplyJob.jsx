import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  MapPin,
  IndianRupee,
  Upload,
  FileText,
  Send,
  Loader2,
} from "lucide-react";

const JOBS_API =
  "http://localhost/job_portal/job-portal-api/api/jobs/get-all.php";

const APPLY_API =
  "http://localhost/job_portal/job-portal-api/api/applications/apply.php";

const ApplyJob = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [job, setJob] = useState(location.state?.job || null);
  const [loadingJob, setLoadingJob] = useState(!job);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    coverLetter: "",
    resume: null,
  });

  const [error, setError] = useState("");

  // =====================================================
  // GET JOB
  // =====================================================

  useEffect(() => {
    if (job) return;

    const fetchJob = async () => {
      try {
        setLoadingJob(true);
        setError("");

        const response = await fetch(JOBS_API);

        const rawResponse = await response.text();

        console.log("Jobs API Status:", response.status);
        console.log("Jobs API Raw Response:", rawResponse);

        let data;

        try {
          data = JSON.parse(rawResponse);
        } catch (jsonError) {
          throw new Error("Jobs API returned invalid JSON.");
        }

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch job"
          );
        }

        const foundJob = (data.jobs || []).find(
          (item) => Number(item.id) === Number(id)
        );

        if (!foundJob) {
          throw new Error("Job not found");
        }

        setJob({
          id: Number(foundJob.id),
          title: foundJob.job_title || "Untitled Job",
          company: foundJob.company_name || "Company",
          location:
            foundJob.location || "Location not specified",
          salary:
            foundJob.salary || "Salary not specified",
          experience:
            foundJob.experience || "Fresher",
          type:
            foundJob.job_type || "Full Time",
          description:
            foundJob.description ||
            "No description available.",
        });
      } catch (err) {
        console.error("Job Fetch Error:", err);
        setError(
          err.message || "Unable to load job."
        );
      } finally {
        setLoadingJob(false);
      }
    };

    fetchJob();
  }, [id, job]);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const selectedFile = files[0];

      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      const fileExtension = selectedFile.name
        .split(".")
        .pop()
        .toLowerCase();

      const allowedExtensions = ["pdf", "doc", "docx"];

      // File type validation
      if (
        !allowedTypes.includes(selectedFile.type) &&
        !allowedExtensions.includes(fileExtension)
      ) {
        setError(
          "Only PDF, DOC and DOCX files are allowed."
        );

        setFormData((prev) => ({
          ...prev,
          resume: null,
        }));

        return;
      }

      // File size validation - 5MB
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Resume must be less than 5 MB.");

        setFormData((prev) => ({
          ...prev,
          resume: null,
        }));

        return;
      }

      setError("");

      setFormData((prev) => ({
        ...prev,
        resume: selectedFile,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // SUBMIT APPLICATION
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // -----------------------------------------------
    // CHECK LOGIN
    // -----------------------------------------------

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      alert("Please login as a candidate first.");
      navigate("/login");
      return;
    }

    let user;

    try {
      user = JSON.parse(storedUser);
    } catch (err) {
      console.error("User JSON Error:", err);

      localStorage.removeItem("user");

      alert("Session expired. Please login again.");

      navigate("/login");
      return;
    }

    console.log("Logged In User:", user);

    // -----------------------------------------------
    // CHECK USER ID
    // -----------------------------------------------

    if (!user?.id) {
      alert(
        "Candidate information not found. Please login again."
      );

      navigate("/login");
      return;
    }

    // -----------------------------------------------
    // CHECK ROLE
    // -----------------------------------------------

    if (user.role !== "candidate") {
      alert("Only candidates can apply for jobs.");
      return;
    }

    // -----------------------------------------------
    // CHECK JOB
    // -----------------------------------------------

    if (!job?.id) {
      setError("Job information is missing.");
      return;
    }

    // -----------------------------------------------
    // CHECK RESUME
    // -----------------------------------------------

    if (!formData.resume) {
      setError("Please upload your resume.");
      return;
    }

    // -----------------------------------------------
    // CREATE FORM DATA
    // -----------------------------------------------

    const data = new FormData();

    data.append("job_id", Number(job.id));
    data.append("candidate_id", Number(user.id));
    data.append(
      "cover_letter",
      formData.coverLetter.trim()
    );
    data.append("resume", formData.resume);

    console.log("Submitting Application:", {
      job_id: Number(job.id),
      candidate_id: Number(user.id),
      cover_letter: formData.coverLetter.trim(),
      resume: formData.resume.name,
      resume_size: formData.resume.size,
      resume_type: formData.resume.type,
    });

    try {
      setSubmitting(true);

      // ---------------------------------------------
      // API REQUEST
      // ---------------------------------------------

      const response = await fetch(APPLY_API, {
        method: "POST",
        body: data,
      });

      console.log(
        "Apply API HTTP Status:",
        response.status
      );

      // IMPORTANT:
      // First read text because PHP may return HTML error
      const rawResponse = await response.text();

      console.log(
        "Apply API RAW Response:",
        rawResponse
      );

      // ---------------------------------------------
      // TRY JSON PARSE
      // ---------------------------------------------

      let result;

      try {
        result = JSON.parse(rawResponse);
      } catch (jsonError) {
        console.error(
          "JSON Parse Error:",
          jsonError
        );

        console.error(
          "PHP RAW ERROR:",
          rawResponse
        );

        setError(
          "Backend PHP error aa raha hai. Browser Console me 'Apply API RAW Response' check karein."
        );

        return;
      }

      // ---------------------------------------------
      // API RESPONSE
      // ---------------------------------------------

      console.log(
        "Apply API Response:",
        result
      );

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to submit application"
        );
      }

      // ---------------------------------------------
      // SUCCESS
      // ---------------------------------------------

      console.log(
        "Application Submitted Successfully:",
        result
      );

      alert(
        "Application submitted successfully! 🎉"
      );

      navigate("/candidate/applied-jobs");

    } catch (err) {
      console.error(
        "Application Error:",
        err
      );

      setError(
        err.message ||
          "Unable to submit application."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loadingJob) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading job...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR / JOB NOT FOUND
  // =====================================================

  if (error && !job) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-red-600">
            Unable to load job
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => navigate("/jobs")}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= HEADER ================= */}

      <section className="bg-slate-900 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Job
          </button>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">
              {job?.company
                ?.charAt(0)
                ?.toUpperCase() || "C"}
            </div>

            <div>

              <h1 className="text-3xl font-bold text-white">
                Apply for {job?.title}
              </h1>

              <p className="mt-2 flex items-center gap-2 text-slate-300">
                <Building2 className="h-4 w-4" />
                {job?.company}
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* ================= MAIN ================= */}

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="grid gap-7 lg:grid-cols-[1fr_360px]">

          {/* ================= FORM ================= */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-7">

              <h2 className="text-xl font-bold text-slate-900">
                Submit Your Application
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Complete the form below to apply for this position.
              </p>

            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* ================= RESUME ================= */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Resume{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50">

                  <Upload className="h-8 w-8 text-slate-400" />

                  <span className="mt-3 max-w-full break-all text-sm font-semibold text-slate-700">
                    {formData.resume
                      ? formData.resume.name
                      : "Upload your resume"}
                  </span>

                  <span className="mt-1 text-xs text-slate-400">
                    PDF, DOC or DOCX • Maximum 5 MB
                  </span>

                  <input
                    type="file"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleChange}
                    className="hidden"
                  />

                </label>

                {formData.resume && (
                  <p className="mt-2 text-xs text-green-600">
                    ✓ Resume selected successfully
                  </p>
                )}

              </div>

              {/* ================= COVER LETTER ================= */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Cover Letter
                </label>

                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  rows="7"
                  placeholder="Tell the recruiter why you are a good fit for this job..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Optional
                </p>

              </div>

              {/* ================= SUBMIT ================= */}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Submit Application
                  </>
                )}

              </button>

            </form>

          </section>

          {/* ================= JOB SUMMARY ================= */}

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold text-slate-900">
              Job Summary
            </h2>

            <div className="mt-5 space-y-4">

              {/* Job Type */}

              <div className="flex gap-3">

                <BriefcaseBusiness className="mt-0.5 h-5 w-5 text-blue-600" />

                <div>

                  <p className="text-xs text-slate-400">
                    Job Type
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {job?.type}
                  </p>

                </div>

              </div>

              {/* Location */}

              <div className="flex gap-3">

                <MapPin className="mt-0.5 h-5 w-5 text-blue-600" />

                <div>

                  <p className="text-xs text-slate-400">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {job?.location}
                  </p>

                </div>

              </div>

              {/* Salary */}

              <div className="flex gap-3">

                <IndianRupee className="mt-0.5 h-5 w-5 text-blue-600" />

                <div>

                  <p className="text-xs text-slate-400">
                    Salary
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {job?.salary}
                  </p>

                </div>

              </div>

              {/* Experience */}

              <div className="flex gap-3">

                <BriefcaseBusiness className="mt-0.5 h-5 w-5 text-blue-600" />

                <div>

                  <p className="text-xs text-slate-400">
                    Experience
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {job?.experience}
                  </p>

                </div>

              </div>

            </div>

            <div className="my-6 border-t border-slate-100" />

            {/* Description */}

            <div>

              <div className="flex items-center gap-2">

                <FileText className="h-5 w-5 text-blue-600" />

                <h3 className="font-semibold text-slate-900">
                  Job Description
                </h3>

              </div>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {job?.description}
              </p>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
};

export default ApplyJob;