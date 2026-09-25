import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Save,
  Loader2,
  BriefcaseBusiness,
  MapPin,
  Building2,
  IndianRupee,
  CalendarDays,
  Code2,
  FileText,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const GET_MY_JOBS_API =
  "http://localhost/job_portal/job-portal-api/api/jobs/get-my-jobs.php";

const UPDATE_JOB_API =
  "http://localhost/job_portal/job-portal-api/api/jobs/update.php";

const EditJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    job_title: "",
    company_name: "",
    location: "",
    job_type: "Full Time",
    experience: "Fresher",
    salary: "",
    description: "",
    skills: "",
    deadline: "",
  });

  // =====================================================
  // GET LOGGED-IN USER
  // =====================================================

  const getUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.error("User parse error:", error);
      return null;
    }
  };

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // FETCH JOB DETAILS
  // =====================================================

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const user = getUser();

        if (!user || !user.id) {
          navigate("/login");
          return;
        }

        if (user.role !== "recruiter") {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${GET_MY_JOBS_API}?recruiterId=${user.id}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch jobs"
          );
        }

        const foundJob = (data.jobs || []).find(
          (job) => Number(job.id) === Number(id)
        );

        if (!foundJob) {
          throw new Error(
            "Job not found or you are not authorized to edit this job."
          );
        }

        setFormData({
          job_title: foundJob.job_title || "",
          company_name: foundJob.company_name || "",
          location: foundJob.location || "",
          job_type: foundJob.job_type || "Full Time",
          experience: foundJob.experience || "Fresher",
          salary: foundJob.salary || "",
          description: foundJob.description || "",
          skills: Array.isArray(foundJob.skills)
            ? foundJob.skills.join(", ")
            : foundJob.skills || "",
          deadline: foundJob.deadline || "",
        });
      } catch (error) {
        console.error("Fetch Job Error:", error);

        setError(
          error.message || "Failed to load job."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id, navigate]);

  // =====================================================
  // UPDATE JOB
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const user = getUser();

      if (!user || !user.id) {
        alert("Please login as recruiter.");
        navigate("/login");
        return;
      }

      if (user.role !== "recruiter") {
        alert("Only recruiter can update jobs.");
        navigate("/login");
        return;
      }

      if (!formData.job_title.trim()) {
        alert("Job title is required.");
        return;
      }

      if (!formData.company_name.trim()) {
        alert("Company name is required.");
        return;
      }

      if (!formData.location.trim()) {
        alert("Location is required.");
        return;
      }

      // =================================================
      // UPDATE PAYLOAD
      // =================================================

      const payload = {
        job_id: Number(id),
        recruiter_id: Number(user.id),

        job_title: formData.job_title.trim(),
        company_name: formData.company_name.trim(),
        location: formData.location.trim(),
        job_type: formData.job_type,
        experience: formData.experience,
        salary: formData.salary.trim(),
        description: formData.description.trim(),
        skills: formData.skills.trim(),
        deadline: formData.deadline || "",
      };

      console.log("Update Job Payload:", payload);

      // =================================================
      // API CALL
      // =================================================

      const response = await fetch(UPDATE_JOB_API, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log("Update Job Response:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update job"
        );
      }

      alert("Job updated successfully.");

      navigate("/recruiter/my-jobs");
    } catch (error) {
      console.error("Update Job Error:", error);

      setError(
        error.message ||
          "Something went wrong while updating the job."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2
            size={35}
            className="mx-auto animate-spin text-cyan-500"
          />

          <p className="mt-4 text-sm font-semibold text-gray-700">
            Loading job details...
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Please wait
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR SCREEN
  // =====================================================

  if (error && !formData.job_title) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-7 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <FileText size={25} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-gray-900">
            Unable to load job
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {error}
          </p>

          <button
            onClick={() =>
              navigate("/recruiter/my-jobs")
            }
            className="mt-5 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
          >
            Back to My Jobs
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white">
        <div className="mx-auto flex min-h-16 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

          <button
            type="button"
            onClick={() =>
              navigate("/recruiter/my-jobs")
            }
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-cyan-600"
          >
            <ArrowLeft size={18} />

            <span>Back to My Jobs</span>
          </button>

          <h1 className="hidden text-base font-bold text-gray-900 sm:block">
            Edit Job
          </h1>

          <div className="w-28" />
        </div>
      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">

        {/* PAGE TITLE */}

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600">
            Recruiter
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Edit Job Posting
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Update your job details and save the changes.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div className="space-y-6 lg:col-span-2">

              {/* BASIC INFORMATION */}

              <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-6 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    <BriefcaseBusiness size={19} />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      Basic Information
                    </h3>

                    <p className="text-xs text-gray-400">
                      Update the basic job details
                    </p>
                  </div>

                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  {/* JOB TITLE */}

                  <div className="sm:col-span-2">

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Job Title *
                    </label>

                    <div className="relative">

                      <BriefcaseBusiness
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        name="job_title"
                        value={formData.job_title}
                        onChange={handleChange}
                        placeholder="e.g. MERN Stack Developer"
                        className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
                      />

                    </div>

                  </div>

                  {/* COMPANY */}

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Company Name *
                    </label>

                    <div className="relative">

                      <Building2
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        placeholder="Company name"
                        className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
                      />

                    </div>

                  </div>

                  {/* LOCATION */}

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Location *
                    </label>

                    <div className="relative">

                      <MapPin
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Noida"
                        className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
                      />

                    </div>

                  </div>

                  {/* JOB TYPE */}

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Job Type
                    </label>

                    <select
                      name="job_type"
                      value={formData.job_type}
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none focus:border-cyan-400 focus:bg-white"
                    >
                      <option value="Full Time">
                        Full Time
                      </option>

                      <option value="Part Time">
                        Part Time
                      </option>

                      <option value="Internship">
                        Internship
                      </option>

                      <option value="Contract">
                        Contract
                      </option>
                    </select>

                  </div>

                  {/* EXPERIENCE */}

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Experience
                    </label>

                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none focus:border-cyan-400 focus:bg-white"
                    >
                      <option value="Fresher">
                        Fresher
                      </option>

                      <option value="0-1 Years">
                        0-1 Years
                      </option>

                      <option value="1-3 Years">
                        1-3 Years
                      </option>

                      <option value="3-5 Years">
                        3-5 Years
                      </option>

                      <option value="5+ Years">
                        5+ Years
                      </option>
                    </select>

                  </div>

                </div>
              </section>

              {/* SALARY & DEADLINE */}

              <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-6 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <IndianRupee size={19} />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      Salary & Deadline
                    </h3>

                    <p className="text-xs text-gray-400">
                      Update compensation and closing date
                    </p>
                  </div>

                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  {/* SALARY */}

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Salary
                    </label>

                    <div className="relative">

                      <IndianRupee
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        placeholder="e.g. ₹3 - ₹6 LPA"
                        className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
                      />

                    </div>

                  </div>

                  {/* DEADLINE */}

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Application Deadline
                    </label>

                    <div className="relative">

                      <CalendarDays
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
                      />

                    </div>

                  </div>

                </div>
              </section>

              {/* SKILLS */}

              <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-5 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <Code2 size={19} />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      Required Skills
                    </h3>

                    <p className="text-xs text-gray-400">
                      Separate skills using commas
                    </p>
                  </div>

                </div>

                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React.js, Node.js, MongoDB, Express.js"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
                />

              </section>

              {/* DESCRIPTION */}

              <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-5 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <FileText size={19} />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      Job Description
                    </h3>

                    <p className="text-xs text-gray-400">
                      Describe the role and responsibilities
                    </p>
                  </div>

                </div>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={8}
                  placeholder="Write a detailed description of the job..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 outline-none focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
                />

              </section>

            </div>

            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div className="lg:col-span-1">

              <div className="sticky top-24 space-y-5">

                {/* PREVIEW */}

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                  <h3 className="font-bold text-gray-900">
                    Job Preview
                  </h3>

                  <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                      <BriefcaseBusiness size={20} />
                    </div>

                    <h4 className="mt-4 font-bold text-gray-900">
                      {formData.job_title || "Job Title"}
                    </h4>

                    <p className="mt-1 text-sm text-gray-500">
                      {formData.company_name || "Company Name"}
                    </p>

                    <div className="mt-4 space-y-2">

                      <p className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin size={14} />
                        {formData.location || "Location"}
                      </p>

                      <p className="flex items-center gap-2 text-xs text-gray-500">
                        <BriefcaseBusiness size={14} />
                        {formData.job_type}
                      </p>

                      <p className="flex items-center gap-2 text-xs text-gray-500">
                        <IndianRupee size={14} />
                        {formData.salary || "Salary not specified"}
                      </p>

                    </div>

                    {formData.skills && (
                      <div className="mt-4 flex flex-wrap gap-1.5">

                        {formData.skills
                          .split(",")
                          .map((skill) => skill.trim())
                          .filter(Boolean)
                          .slice(0, 5)
                          .map((skill) => (
                            <span
                              key={skill}
                              className="rounded-md bg-white px-2 py-1 text-[10px] font-medium text-gray-500"
                            >
                              {skill}
                            </span>
                          ))}

                      </div>
                    )}

                  </div>
                </div>

                {/* SAVE */}

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {saving ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save size={17} />
                        Save Changes
                      </>
                    )}

                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      navigate("/recruiter/my-jobs")
                    }
                    className="mt-3 h-11 w-full rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-60"
                  >
                    Cancel
                  </button>

                </div>

                {/* TIP */}

                <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5">

                  <h4 className="text-sm font-bold text-cyan-800">
                    Editing Tip
                  </h4>

                  <p className="mt-2 text-xs leading-5 text-cyan-700">
                    Keep your job title, skills, salary and
                    description accurate so candidates get
                    the right information.
                  </p>

                </div>

              </div>

            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditJob;