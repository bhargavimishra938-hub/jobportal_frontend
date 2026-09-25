import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BriefcaseBusiness,
  MapPin,
  DollarSign,
  Clock3,
  CalendarDays,
  GraduationCap,
  Code2,
  FileText,
  Send,
  Plus,
  X,
  ChevronDown,
  Users,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* =========================================================
   API URLs
========================================================= */

const API_URL =
  "http://localhost/job_portal/job-portal-api/api/jobs/create.php";

const JOB_TYPES_API =
  "http://localhost/job_portal/job-portal-api/api/options/job-types.php";

const WORKPLACE_TYPES_API =
  "http://localhost/job_portal/job-portal-api/api/options/workplace-types.php";

const COMPANY_PROFILE_API =
  "http://localhost/job_portal/job-portal-api/api/recruiter/company-profile.php";

const CATEGORIES_API =
  "http://localhost/job_portal/job-portal-api/api/options/categories.php";

/* =========================================================
   Initial Form
========================================================= */

const initialFormData = {
  jobTitle: "",
  companyName: "",
  jobType: "",
  workplaceType: "",
  location: "",
  vacancies: "1",
  experience: "",
  salaryMin: "",
  salaryMax: "",
  salaryType: "Per Year",
  category: "",
  education: "",
  deadline: "",
  description: "",
  responsibilities: "",
  requirements: "",
};

/* =========================================================
   Logo URL Helper
========================================================= */

const getLogoUrl = (logo) => {
  if (!logo) return "";

  const value = String(logo).trim();

  if (!value) return "";

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("blob:") ||
    value.startsWith("data:")
  ) {
    return value;
  }

  if (value.startsWith("/")) {
    return `http://localhost${value}`;
  }

  if (value.startsWith("uploads/")) {
    return `http://localhost/job_portal/job-portal-api/${value}`;
  }

  return `http://localhost/job_portal/job-portal-api/uploads/${value}`;
};

/* =========================================================
   Component
========================================================= */

const PostJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [jobTypes, setJobTypes] = useState([]);
  const [workplaceTypes, setWorkplaceTypes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [companyLoading, setCompanyLoading] = useState(true);
  const [companyError, setCompanyError] = useState("");

  const [optionsLoading, setOptionsLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  /* =========================================================
     Recruiter Session
  ========================================================= */

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      alert("Please login as a recruiter first.");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      if (!user?.id) {
        alert("Recruiter ID not found.");
        navigate("/login", { replace: true });
        return;
      }

      if (user?.role?.toLowerCase() !== "recruiter") {
        alert("Only recruiters can post jobs.");
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Session Error:", error);

      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");

      alert("Your session is invalid. Please login again.");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  /* =========================================================
     Load Dropdown Options
  ========================================================= */

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [
          jobResponse,
          workplaceResponse,
          categoryResponse,
        ] = await Promise.all([
          axios.get(JOB_TYPES_API),
          axios.get(WORKPLACE_TYPES_API),
          axios.get(CATEGORIES_API),
        ]);

        if (jobResponse.data?.success) {
          setJobTypes(jobResponse.data.jobTypes || []);
        }

        if (workplaceResponse.data?.success) {
          setWorkplaceTypes(
            workplaceResponse.data.workplaceTypes || []
          );
        }

        if (categoryResponse.data?.success) {
          setCategories(categoryResponse.data.categories || []);
        }
      } catch (error) {
        console.error("Options Error:", error);

        alert(
          error.response?.data?.message ||
            "Unable to load job options."
        );
      } finally {
        setOptionsLoading(false);
      }
    };

    fetchOptions();
  }, []);

  /* =========================================================
     Load Company Profile
  ========================================================= */

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setCompanyLoading(false);
        return;
      }

      try {
        const user = JSON.parse(storedUser);

        if (!user?.id) {
          setCompanyError("Recruiter ID not found.");
          setCompanyLoading(false);
          return;
        }

        const response = await axios.get(
          `${COMPANY_PROFILE_API}?recruiterId=${Number(user.id)}`
        );

        console.log("Company Profile Response:", response.data);

        const result = response.data;

        if (result?.success && result?.data) {
          const companyName =
            result.data.company_name || "";

          const companyLogo =
            result.data.company_logo ||
            result.data.logo ||
            "";

          setFormData((previous) => ({
            ...previous,
            companyName,
          }));

          if (companyLogo) {
            setLogoPreview(getLogoUrl(companyLogo));
          }

          if (!companyName) {
            setCompanyError(
              "Please complete your Company Profile."
            );
          }
        } else {
          setCompanyError(
            result?.message ||
              "Company profile not found."
          );
        }
      } catch (error) {
        console.error(
          "Company Profile Error:",
          error
        );

        setCompanyError(
          error.response?.data?.message ||
            "Unable to load company profile."
        );
      } finally {
        setCompanyLoading(false);
      }
    };

    fetchCompanyProfile();
  }, []);

  /* =========================================================
     Input Change
  ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================================
     Logo Upload
  ========================================================= */

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Company logo must be less than 2 MB.");
      event.target.value = "";
      return;
    }

    if (logoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setLogoFile(file);
    setLogoPreview(previewUrl);
  };

  /* =========================================================
     Remove Logo
  ========================================================= */

  const removeLogo = () => {
    if (logoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogoFile(null);
    setLogoPreview("");
  };

  /* =========================================================
     Skills
  ========================================================= */

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    const exists = skills.some(
      (item) =>
        item.toLowerCase() === skill.toLowerCase()
    );

    if (exists) {
      alert("This skill is already added.");
      return;
    }

    setSkills((previous) => [
      ...previous,
      skill,
    ]);

    setSkillInput("");
  };

  const removeSkill = (skillToRemove) => {
    setSkills((previous) =>
      previous.filter(
        (skill) => skill !== skillToRemove
      )
    );
  };

  const handleSkillKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addSkill();
    }
  };

  /* =========================================================
     Reset
  ========================================================= */

  const resetForm = () => {
    if (logoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }

    setFormData(initialFormData);
    setSkills([]);
    setSkillInput("");
    setLogoFile(null);
    setLogoPreview("");
  };

  /* =========================================================
     Salary
  ========================================================= */

  const getSalary = () => {
    if (
      !formData.salaryMin &&
      !formData.salaryMax
    ) {
      return "";
    }

    const min =
      formData.salaryMin || "0";

    const max =
      formData.salaryMax || "0";

    return `₹${min} - ₹${max} ${formData.salaryType}`;
  };

  /* =========================================================
     Submit Job
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      alert("Please login as a recruiter first.");
      navigate("/login");
      return;
    }

    let user;

    try {
      user = JSON.parse(storedUser);
    } catch (error) {
      console.error("User Parse Error:", error);

      alert(
        "Invalid session. Please login again."
      );

      navigate("/login");
      return;
    }

    /* -------------------------------------------------------
       User Validation
    ------------------------------------------------------- */

    if (!user?.id) {
      alert("Recruiter ID not found.");
      navigate("/login");
      return;
    }

    if (
      user?.role?.toLowerCase() !==
      "recruiter"
    ) {
      alert("Only recruiters can post jobs.");
      return;
    }

    /* -------------------------------------------------------
       Form Validation
    ------------------------------------------------------- */

    if (!formData.jobTitle.trim()) {
      alert("Please enter job title.");
      return;
    }

    if (!formData.companyName.trim()) {
      alert(
        "Please complete your Company Profile first."
      );
      return;
    }

    if (!formData.category) {
      alert("Please select job category.");
      return;
    }

    if (!formData.jobType) {
      alert("Please select job type.");
      return;
    }

    if (!formData.location.trim()) {
      alert("Please enter job location.");
      return;
    }

    const vacancies = Number(
      formData.vacancies
    );

    if (
      !Number.isInteger(vacancies) ||
      vacancies < 1
    ) {
      alert(
        "Number of openings must be at least 1."
      );
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter job description.");
      return;
    }

    if (
      formData.salaryMin &&
      formData.salaryMax &&
      Number(formData.salaryMin) >
        Number(formData.salaryMax)
    ) {
      alert(
        "Minimum salary cannot be greater than maximum salary."
      );
      return;
    }

    if (skills.length === 0) {
      alert(
        "Please add at least one required skill."
      );
      return;
    }

    /* -------------------------------------------------------
       FormData
    ------------------------------------------------------- */

    const postData = new FormData();

    postData.append(
      "recruiter_id",
      String(Number(user.id))
    );

    postData.append(
      "job_title",
      formData.jobTitle.trim()
    );

    postData.append(
      "company_name",
      formData.companyName.trim()
    );

    postData.append(
      "location",
      formData.location.trim()
    );

    postData.append(
      "vacancies",
      String(vacancies)
    );

    postData.append(
      "job_type",
      formData.jobType
    );

    postData.append(
      "workplace_type",
      formData.workplaceType || ""
    );

    postData.append(
      "category",
      formData.category
    );

    postData.append(
      "experience",
      formData.experience || "Fresher"
    );

    postData.append(
      "education",
      formData.education.trim()
    );

    postData.append(
      "salary",
      getSalary()
    );

    postData.append(
      "description",
      formData.description.trim()
    );

    postData.append(
      "responsibilities",
      formData.responsibilities.trim()
    );

    postData.append(
      "requirements",
      formData.requirements.trim()
    );

    postData.append(
      "skills",
      skills.join(", ")
    );

    postData.append(
      "deadline",
      formData.deadline || ""
    );

    if (logoFile) {
      postData.append(
        "company_logo",
        logoFile
      );
    }

    /* -------------------------------------------------------
       Debug FormData
    ------------------------------------------------------- */

    console.log(
      "========== POST JOB DATA =========="
    );

    for (const [key, value] of postData.entries()) {
      if (value instanceof File) {
        console.log(
          key,
          value.name,
          value.type,
          value.size
        );
      } else {
        console.log(key, value);
      }
    }

    console.log(
      "==================================="
    );

    setLoading(true);

    /* -------------------------------------------------------
       API Request
    ------------------------------------------------------- */

    try {
      const response = await axios.post(
        API_URL,
        postData,
        {
          timeout: 30000,
        }
      );

      console.log(
        "========== JOB POST RESPONSE =========="
      );

      console.log(
        "HTTP Status:",
        response.status
      );

      console.log(
        "Response Data:",
        response.data
      );

      console.log(
        "Success:",
        response.data?.success
      );

      console.log(
        "Message:",
        response.data?.message
      );

      console.log(
        "Job ID:",
        response.data?.jobId
      );

      console.log(
        "======================================="
      );

      /* -----------------------------------------------------
         Success
      ----------------------------------------------------- */

      if (
        response.data?.success === true
      ) {
        alert(
          response.data?.message ||
            "Job posted successfully!"
        );

        resetForm();

        navigate(
          "/recruiter/my-jobs"
        );

        return;
      }

      /* -----------------------------------------------------
         Backend returned error
      ----------------------------------------------------- */

      console.error(
        "Backend returned success=false:",
        response.data
      );

      alert(
        response.data?.message ||
          response.data?.error ||
          "Unable to post job. Please try again."
      );
    } catch (error) {
      console.error(
        "========== CREATE JOB ERROR =========="
      );

      console.error(
        "Error:",
        error
      );

      console.error(
        "Response:",
        error.response?.data
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Request:",
        error.request
      );

      console.error(
        "======================================="
      );

      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error;

      alert(
        backendMessage ||
          "Unable to post job. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     Classes
  ========================================================= */

  const inputClass =
    "h-11 w-full min-w-0 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 shadow-sm hover:border-gray-300";

  const selectClass =
    "h-11 w-full min-w-0 appearance-none rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50 shadow-sm hover:border-gray-300";

  const textareaClass =
    "w-full min-w-0 resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 shadow-sm hover:border-gray-300";

  /* =========================================================
     Section Header
  ========================================================= */

  const SectionHeader = ({
    icon,
    title,
    subtitle,
  }) => (
    <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-sm">
          {icon}
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-bold text-gray-900">
            {title}
          </h2>

          <p className="mt-0.5 text-xs text-gray-500">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );

  /* =========================================================
     Select Arrow
  ========================================================= */

  const SelectArrow = () => (
    <ChevronDown
      size={16}
      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
    />
  );

  /* =========================================================
     JSX
  ========================================================= */

  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-gray-50 text-gray-900">
      <div className="mx-auto w-full max-w-[1500px] min-w-0 p-4 sm:p-6 lg:p-8">

        <form
          id="post-job-form"
          onSubmit={handleSubmit}
          className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]"
        >

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="min-w-0 space-y-6">

            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition hover:shadow-md">

              <SectionHeader
                icon={
                  <BriefcaseBusiness size={19} />
                }
                title="Basic Information"
                subtitle="Add the core details about this position"
              />

              <div className="p-5 sm:p-6">

                <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2">

                  {/* JOB TITLE */}

                  <div className="min-w-0 md:col-span-2">

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Job Title{" "}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      placeholder="e.g. Senior Frontend Developer"
                      className={inputClass}
                      required
                    />

                  </div>

                  {/* COMPANY LOGO */}

                  <div className="min-w-0 md:col-span-2">

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Company Logo
                    </label>

                    <div className="flex flex-wrap items-center gap-4">

                      {logoPreview ? (

                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                          <img
                            src={logoPreview}
                            alt="Company Logo Preview"
                            className="h-full w-full object-contain p-1"
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />

                          <button
                            type="button"
                            onClick={removeLogo}
                            className="absolute right-1 top-1 rounded-full bg-red-600 p-1 text-white shadow hover:bg-red-700"
                            title="Remove logo"
                          >
                            <X size={12} />
                          </button>

                        </div>

                      ) : (

                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-gray-400">
                          <ImageIcon size={26} />
                        </div>

                      )}

                      <div>

                        <label className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">

                          <Upload size={16} />

                          <span>
                            {logoPreview
                              ? "Change Logo"
                              : "Upload Logo"}
                          </span>

                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={
                              handleLogoChange
                            }
                            className="hidden"
                          />

                        </label>

                        <p className="mt-1.5 text-xs text-gray-400">
                          PNG, JPG or WEBP • Max 2 MB
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* COMPANY NAME */}

                  <div className="min-w-0">

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Company Name
                    </label>

                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      readOnly
                      placeholder={
                        companyLoading
                          ? "Loading company name..."
                          : "Complete company profile first"
                      }
                      className={`${inputClass} cursor-not-allowed bg-gray-50 text-gray-500`}
                    />

                    {companyError && (
                      <p className="mt-1 text-xs text-red-500">
                        {companyError}
                      </p>
                    )}

                  </div>

                  {/* CATEGORY */}

                  <div className="min-w-0">

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Job Category{" "}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <div className="relative">

                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={selectClass}
                        disabled={optionsLoading}
                        required
                      >

                        <option value="">
                          {optionsLoading
                            ? "Loading categories..."
                            : "Select category"}
                        </option>

                        {categories.map(
                          (item) => (
                            <option
                              key={item.id}
                              value={item.name}
                            >
                              {item.name}
                            </option>
                          )
                        )}

                      </select>

                      <SelectArrow />

                    </div>

                  </div>

                  {/* JOB TYPE */}

                  <div className="min-w-0">

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Job Type{" "}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <div className="relative">

                      <select
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleChange}
                        className={selectClass}
                        disabled={optionsLoading}
                        required
                      >

                        <option value="">
                          {optionsLoading
                            ? "Loading..."
                            : "Select job type"}
                        </option>

                        {jobTypes.map(
                          (item) => (
                            <option
                              key={item.id}
                              value={item.name}
                            >
                              {item.name}
                            </option>
                          )
                        )}

                        <option value="Other">
                          Other / Custom
                        </option>

                      </select>

                      <SelectArrow />

                    </div>

                  </div>

                  {/* WORKPLACE */}

                  <div className="min-w-0">

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Workplace Type
                    </label>

                    <div className="relative">

                      <select
                        name="workplaceType"
                        value={formData.workplaceType}
                        onChange={handleChange}
                        className={selectClass}
                        disabled={optionsLoading}
                      >

                        <option value="">
                          {optionsLoading
                            ? "Loading..."
                            : "Select workplace"}
                        </option>

                        {workplaceTypes.map(
                          (item) => (
                            <option
                              key={item.id}
                              value={item.name}
                            >
                              {item.name}
                            </option>
                          )
                        )}

                      </select>

                      <SelectArrow />

                    </div>

                  </div>

                  {/* LOCATION */}

                  <div className="min-w-0">

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Job Location{" "}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <div className="relative">

                      <MapPin
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Noida, Uttar Pradesh"
                        className={`${inputClass} pl-11`}
                        required
                      />

                    </div>

                  </div>

                  {/* VACANCIES */}

                  <div className="min-w-0">

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Number of Openings
                    </label>

                    <div className="relative">

                      <Users
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="number"
                        name="vacancies"
                        min="1"
                        step="1"
                        value={formData.vacancies}
                        onChange={handleChange}
                        placeholder="e.g. 4"
                        className={`${inputClass} pl-11`}
                      />

                    </div>

                    <p className="mt-1.5 text-xs text-gray-400">
                      Example: Enter 4 if you want to
                      hire 4 candidates.
                    </p>

                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                EXPERIENCE & SALARY
            ================================================= */}

            <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition hover:shadow-md">

              <SectionHeader
                icon={<DollarSign size={19} />}
                title="Experience & Compensation"
                subtitle="Define eligibility requirements and salary expectations"
              />

              <div className="p-5 sm:p-6">

                <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2">

                  {/* EXPERIENCE */}

                  <div className="min-w-0">

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Experience Required
                    </label>

                    <div className="relative">

                      <Clock3
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className={`${selectClass} pl-11`}
                      >

                        <option value="">
                          Select experience
                        </option>

                        <option value="Fresher">
                          Fresher
                        </option>

                        <option value="0-1 Years">
                          0 - 1 Years
                        </option>

                        <option value="1-2 Years">
                          1 - 2 Years
                        </option>

                        <option value="2-4 Years">
                          2 - 4 Years
                        </option>

                        <option value="4-6 Years">
                          4 - 6 Years
                        </option>

                        <option value="6+ Years">
                          6+ Years
                        </option>

                      </select>

                      <SelectArrow />

                    </div>

                  </div>

                  {/* EDUCATION */}

                  <div className="min-w-0">

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Education
                    </label>

                    <div className="relative">

                      <GraduationCap
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        placeholder="e.g. B.Tech / BCA / MCA"
                        className={`${inputClass} pl-11`}
                      />

                    </div>

                  </div>

                  {/* MIN SALARY */}

                  <div className="min-w-0">

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Minimum Salary
                    </label>

                    <div className="relative">

                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-400">
                        ₹
                      </span>

                      <input
                        type="number"
                        name="salaryMin"
                        min="0"
                        value={formData.salaryMin}
                        onChange={handleChange}
                        placeholder="300000"
                        className={`${inputClass} pl-9`}
                      />

                    </div>

                  </div>

                  {/* MAX SALARY */}

                  <div className="min-w-0">

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Maximum Salary
                    </label>

                    <div className="relative">

                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-400">
                        ₹
                      </span>

                      <input
                        type="number"
                        name="salaryMax"
                        min="0"
                        value={formData.salaryMax}
                        onChange={handleChange}
                        placeholder="600000"
                        className={`${inputClass} pl-9`}
                      />

                    </div>

                  </div>

                  {/* SALARY PERIOD */}

                  <div className="min-w-0">

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Salary Period
                    </label>

                    <div className="relative">

                      <select
                        name="salaryType"
                        value={formData.salaryType}
                        onChange={handleChange}
                        className={selectClass}
                      >

                        <option value="Per Year">
                          Per Year
                        </option>

                        <option value="Per Month">
                          Per Month
                        </option>

                        <option value="Per Day">
                          Per Day
                        </option>

                      </select>

                      <SelectArrow />

                    </div>

                  </div>

                  {/* DEADLINE */}

                  <div className="min-w-0">

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Application Deadline
                    </label>

                    <div className="relative">

                      <CalendarDays
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className={`${inputClass} pl-11`}
                      />

                    </div>

                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                SKILLS
            ================================================= */}

            <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition hover:shadow-md">

              <SectionHeader
                icon={<Code2 size={19} />}
                title="Required Skills"
                subtitle="Add key technical or soft skills required for this job"
              />

              <div className="p-5 sm:p-6">

                <div className="flex min-w-0 gap-2">

                  <input
                    type="text"
                    value={skillInput}
                    onChange={(event) =>
                      setSkillInput(
                        event.target.value
                      )
                    }
                    onKeyDown={
                      handleSkillKeyDown
                    }
                    placeholder="Type a skill, e.g. React.js and press Enter"
                    className={inputClass}
                  />

                  <button
                    type="button"
                    onClick={addSkill}
                    className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                  >

                    <Plus size={16} />

                    <span className="hidden sm:inline">
                      Add
                    </span>

                  </button>

                </div>

                {skills.length > 0 && (

                  <div className="mt-4 flex flex-wrap gap-2">

                    {skills.map(
                      (skill, index) => (

                        <span
                          key={`${skill}-${index}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                        >

                          {skill}

                          <button
                            type="button"
                            onClick={() =>
                              removeSkill(
                                skill
                              )
                            }
                            className="text-blue-400 hover:text-blue-700"
                          >
                            <X size={14} />
                          </button>

                        </span>

                      )
                    )}

                  </div>

                )}

              </div>

            </section>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition hover:shadow-md">

              <SectionHeader
                icon={<FileText size={19} />}
                title="Job Description & Requirements"
                subtitle="Provide detailed information about roles, responsibilities, and criteria"
              />

              <div className="space-y-5 p-5 sm:p-6">

                {/* DESCRIPTION */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Job Description{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <textarea
                    rows="4"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Write a brief overview of the role..."
                    className={textareaClass}
                    required
                  />

                </div>

                {/* RESPONSIBILITIES */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Key Responsibilities
                  </label>

                  <textarea
                    rows="4"
                    name="responsibilities"
                    value={
                      formData.responsibilities
                    }
                    onChange={handleChange}
                    placeholder="List responsibilities (bullet points or text)..."
                    className={textareaClass}
                  />

                </div>

                {/* REQUIREMENTS */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Requirements & Qualifications
                  </label>

                  <textarea
                    rows="4"
                    name="requirements"
                    value={
                      formData.requirements
                    }
                    onChange={handleChange}
                    placeholder="List qualifications and requirements..."
                    className={textareaClass}
                  />

                </div>

              </div>

            </section>

          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <div className="min-w-0 space-y-6">

            <div className="sticky top-6 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">

              <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4">

                <h3 className="text-base font-bold text-gray-900">
                  Actions
                </h3>

                <p className="mt-0.5 text-xs text-gray-500">
                  Review and publish your job
                </p>

              </div>

              <div className="space-y-4 p-5">

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <Send size={16} />

                  <span>
                    {loading
                      ? "Posting Job..."
                      : "Publish Job"}
                  </span>

                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Reset Form
                </button>

              </div>

            </div>

            {/* JOB SUMMARY */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <h3 className="text-sm font-bold text-gray-900">
                Job Summary
              </h3>

              <div className="mt-4 space-y-3 text-sm">

                <div className="flex items-center justify-between gap-3">

                  <span className="text-gray-500">
                    Openings
                  </span>

                  <span className="font-semibold text-gray-900">
                    {formData.vacancies || 1}
                  </span>

                </div>

                <div className="flex items-center justify-between gap-3">

                  <span className="text-gray-500">
                    Job Type
                  </span>

                  <span className="text-right font-semibold text-gray-900">
                    {formData.jobType ||
                      "Not selected"}
                  </span>

                </div>

                <div className="flex items-center justify-between gap-3">

                  <span className="text-gray-500">
                    Workplace
                  </span>

                  <span className="text-right font-semibold text-gray-900">
                    {formData.workplaceType ||
                      "Not selected"}
                  </span>

                </div>

                <div className="flex items-center justify-between gap-3">

                  <span className="text-gray-500">
                    Skills
                  </span>

                  <span className="font-semibold text-gray-900">
                    {skills.length}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
};

export default PostJob;