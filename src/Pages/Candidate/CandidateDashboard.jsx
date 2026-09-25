import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Briefcase,
  Heart,
  FileText,
  Bell,
  Search,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ArrowRight,
  MapPin,
  TrendingUp,
  Phone,
  RefreshCw,
  CalendarDays,
  Loader2,
  Code2,
  Pencil,
  CircleUserRound,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE =
  "http://localhost/job_portal/job-portal-api/api";

const PROFILE_API = `${API_BASE}/profile/get.php`;

const DASHBOARD_API =
  `${API_BASE}/candidate/dashboard.php`;

const APPLICATIONS_API =
  `${API_BASE}/applications/get-my-applications.php`;

const CandidateDashboard = () => {
  const navigate = useNavigate();

  // =====================================================
  // USER
  // =====================================================

  const getStoredUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch (error) {
      console.error("User parse error:", error);
      return null;
    }
  };

  const getUserId = () => {
    const currentUser = getStoredUser();

    return (
      currentUser?.id ||
      currentUser?.userId ||
      currentUser?.user_id ||
      localStorage.getItem("userId") ||
      localStorage.getItem("user_id") ||
      null
    );
  };

  const user = getStoredUser();

  // =====================================================
  // STATES
  // =====================================================

  const [profile, setProfile] = useState({});

  const [applications, setApplications] = useState([]);

  const [dashboardData, setDashboardData] = useState({
    stats: {
      savedJobs: 0,
      profileViews: 0,
    },
    recommendedJobs: [],
    recentSearches: [],
    notifications: [],
    recommendedCompanies: [],
  });

  const [profileCompletion, setProfileCompletion] =
    useState(0);

  const [loading, setLoading] = useState(true);

  const [applicationsLoading, setApplicationsLoading] =
    useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // PROFILE COMPLETION
  // =====================================================

  const calculateProfileCompletion = (profileData) => {
    if (!profileData) return 0;

    const fields = [
      profileData.name,
      profileData.email,
      profileData.phone,
      profileData.headline,
      profileData.bio,
      profileData.location,
      profileData.resume,

      Array.isArray(profileData.skills) &&
        profileData.skills.length > 0,

      Array.isArray(profileData.experience) &&
        profileData.experience.length > 0,

      Array.isArray(profileData.education) &&
        profileData.education.length > 0,

      Array.isArray(profileData.projects) &&
        profileData.projects.length > 0,

      profileData.linkedin,
      profileData.github,
      profileData.portfolio,
    ];

    const completed = fields.filter(Boolean).length;

    return Math.round(
      (completed / fields.length) * 100
    );
  };

  // =====================================================
  // FETCH PROFILE
  // =====================================================

  const fetchProfile = async () => {
    const userId = getUserId();

    if (!userId) {
      throw new Error(
        "User information not found. Please login again."
      );
    }

    const response = await axios.get(
      `${PROFILE_API}?user_id=${Number(userId)}`
    );

    console.log(
      "Candidate Profile Response:",
      response.data
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          "Unable to load candidate profile."
      );
    }

    return response.data.profile || {};
  };

  // =====================================================
  // FETCH APPLICATIONS
  // =====================================================

  const fetchApplications = async () => {
    setApplicationsLoading(true);

    try {
      const userId = getUserId();

      if (!userId) {
        return [];
      }

      const response = await axios.get(
        `${APPLICATIONS_API}?candidateId=${Number(userId)}`
      );

      console.log(
        "My Applications Response:",
        response.data
      );

      if (!response.data?.success) {
        return [];
      }

      const applicationList = Array.isArray(
        response.data.applications
      )
        ? response.data.applications
        : [];

      setApplications(applicationList);

      return applicationList;
    } catch (error) {
      console.error(
        "Fetch Applications Error:",
        error
      );

      setApplications([]);

      return [];
    } finally {
      setApplicationsLoading(false);
    }
  };

  // =====================================================
  // FETCH DASHBOARD
  // =====================================================

  const fetchDashboardAPI = async () => {
    const userId = getUserId();

    if (!userId) return null;

    try {
      const response = await axios.get(
        `${DASHBOARD_API}?userId=${Number(userId)}`
      );

      console.log(
        "Candidate Dashboard API Response:",
        response.data
      );

      if (response.data?.success) {
        return response.data.data || null;
      }

      return null;
    } catch (error) {
      console.warn(
        "Dashboard API unavailable:",
        error
      );

      return null;
    }
  };

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const currentUser = getStoredUser();
      const userId = getUserId();

      console.log("Current User:", currentUser);
      console.log("Candidate User ID:", userId);

      if (!userId) {
        setError(
          "User information not found. Please login again."
        );

        return;
      }

      const role = String(
        currentUser?.role || ""
      )
        .toLowerCase()
        .trim();

      if (role && role !== "candidate") {
        setError(
          "You are not authorized to access candidate dashboard."
        );

        return;
      }

      // Fetch profile
      const profileData = await fetchProfile();

      setProfile(profileData);

      setProfileCompletion(
        calculateProfileCompletion(profileData)
      );

      // Fetch applications and dashboard together
      const [
        applicationResult,
        dashboardResult,
      ] = await Promise.all([
        fetchApplications(),
        fetchDashboardAPI(),
      ]);

      console.log(
        "Total Applications:",
        applicationResult.length
      );

      if (dashboardResult) {
        const savedJobsCount = Number(
          dashboardResult?.stats?.savedJobs ?? 0
        );

        const profileViewsCount = Number(
          dashboardResult?.stats?.profileViews ?? 0
        );

        setDashboardData({
          stats: {
            savedJobs: savedJobsCount,
            profileViews: profileViewsCount,
          },

          recommendedJobs: Array.isArray(
            dashboardResult.recommendedJobs
          )
            ? dashboardResult.recommendedJobs
            : [],

          recentSearches: Array.isArray(
            dashboardResult.recentSearches
          )
            ? dashboardResult.recentSearches
            : [],

          notifications: Array.isArray(
            dashboardResult.notifications
          )
            ? dashboardResult.notifications
            : [],

          recommendedCompanies: Array.isArray(
            dashboardResult.recommendedCompanies
          )
            ? dashboardResult.recommendedCompanies
            : [],
        });

        if (
          dashboardResult.profileCompletion !==
          undefined
        ) {
          setProfileCompletion(
            Number(
              dashboardResult.profileCompletion
            ) || 0
          );
        }
      }
    } catch (error) {
      console.error(
        "Candidate Dashboard Error:",
        error
      );

      setError(
        error?.message ||
          "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadDashboard();
  }, []);

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    loadDashboard();
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const formattedDate = new Date(
      String(date).replace(" ", "T")
    );

    if (
      Number.isNaN(
        formattedDate.getTime()
      )
    ) {
      return date;
    }

    return formattedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // STATUS BADGE
  // =====================================================

  const getStatusBadge = (status) => {
    const currentStatus = String(
      status || ""
    ).toLowerCase();

    if (
      currentStatus === "shortlisted" ||
      currentStatus === "selected"
    ) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-200">
          <CheckCircle size={13} />
          {status}
        </span>
      );
    }

    if (currentStatus === "hired") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 ring-1 ring-inset ring-purple-200">
          <CheckCircle size={13} />
          {status}
        </span>
      );
    }

    if (
      currentStatus === "rejected" ||
      currentStatus === "declined"
    ) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200">
          <XCircle size={13} />
          {status}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">
        <Clock size={13} />
        {status || "Applied"}
      </span>
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

          <p className="mt-4 font-medium text-slate-600">
            Loading dashboard...
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Please wait
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <XCircle
              size={30}
              className="text-red-500"
            />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Unable to Load Dashboard
          </h2>

          <p className="mt-2 text-slate-500">
            {error}
          </p>

          <button
            onClick={handleRefresh}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-white transition hover:bg-blue-700"
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // DATA
  // =====================================================

  const dashboardStats =
    dashboardData?.stats || {};

  const recommendedJobs =
    dashboardData?.recommendedJobs || [];

  const recentSearches =
    dashboardData?.recentSearches || [];

  const notifications =
    dashboardData?.notifications || [];

  const recommendedCompanies =
    dashboardData?.recommendedCompanies || [];

  const candidateName =
    profile?.name ||
    user?.name ||
    "Candidate";

  const candidateEmail =
    profile?.email ||
    user?.email ||
    "candidate@email.com";

  const candidatePhone =
    profile?.phone ||
    user?.phone ||
    "Not added";

  const appliedJobsCount =
    applications.length;

  const shortlistedCount =
    applications.filter((application) => {
      const status = String(
        application.status || ""
      ).toLowerCase();

      return (
        status === "shortlisted" ||
        status === "selected"
      );
    }).length;

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="w-full space-y-6">

      {/* =================================================
          WELCOME SECTION
      ================================================= */}

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-600/20">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-52 w-52 rounded-full bg-cyan-300/20 blur-2xl" />

        <div className="relative flex flex-col gap-5 px-5 py-7 sm:px-8 sm:py-9 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-50 ring-1 ring-inset ring-white/20">
              <Sparkles size={12} />
              Candidate workspace
            </span>

            <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
              Welcome back, {candidateName} 👋
            </h1>

            <p className="mt-2 max-w-xl text-sm text-blue-100 sm:text-base">
              Manage your profile, applications and job
              search from one place.
            </p>
          </div>

          <button
            onClick={() => navigate("/jobs")}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-semibold text-blue-700 shadow-md transition hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-lg"
          >
            <Search size={18} />
            Find Jobs
          </button>
        </div>
      </section>

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Applied Jobs */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
          <div className="absolute right-0 top-0 h-20 w-20 -translate-y-6 translate-x-6 rounded-full bg-blue-50 opacity-70 transition group-hover:scale-125" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Applied Jobs
              </p>

              <h3 className="mt-1.5 text-3xl font-bold text-slate-900">
                {applicationsLoading ? (
                  <Loader2
                    size={24}
                    className="animate-spin text-blue-600"
                  />
                ) : (
                  appliedJobsCount
                )}
              </h3>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm shadow-blue-500/30">
              <Briefcase size={22} className="text-white" />
            </div>
          </div>
        </div>

        {/* Saved Jobs */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
          <div className="absolute right-0 top-0 h-20 w-20 -translate-y-6 translate-x-6 rounded-full bg-pink-50 opacity-70 transition group-hover:scale-125" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Saved Jobs
              </p>

              <h3 className="mt-1.5 text-3xl font-bold text-slate-900">
                {Number(dashboardStats?.savedJobs ?? 0)}
              </h3>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-sm shadow-pink-500/30">
              <Heart size={22} className="text-white" />
            </div>
          </div>
        </div>

        {/* Shortlisted */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
          <div className="absolute right-0 top-0 h-20 w-20 -translate-y-6 translate-x-6 rounded-full bg-green-50 opacity-70 transition group-hover:scale-125" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Shortlisted
              </p>

              <h3 className="mt-1.5 text-3xl font-bold text-slate-900">
                {shortlistedCount}
              </h3>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-sm shadow-green-500/30">
              <CheckCircle size={22} className="text-white" />
            </div>
          </div>
        </div>

        {/* Profile Views */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
          <div className="absolute right-0 top-0 h-20 w-20 -translate-y-6 translate-x-6 rounded-full bg-purple-50 opacity-70 transition group-hover:scale-125" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Profile Views
              </p>

              <h3 className="mt-1.5 text-3xl font-bold text-slate-900">
                {Number(dashboardStats?.profileViews ?? 0)}
              </h3>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 shadow-sm shadow-purple-500/30">
              <Eye size={22} className="text-white" />
            </div>
          </div>
        </div>

      </section>

      {/* =================================================
          PROFILE INFORMATION
      ================================================= */}

      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <CircleUserRound size={25} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                My Profile
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your basic candidate information
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
          >
            <Pencil size={15} />
            Edit Profile
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <InfoItem
            icon={<User size={19} />}
            label="Full Name"
            value={candidateName}
          />

          <InfoItem
            icon={<FileText size={19} />}
            label="Email"
            value={candidateEmail}
          />

          <InfoItem
            icon={<Phone size={19} />}
            label="Phone"
            value={candidatePhone}
          />

          <InfoItem
            icon={<TrendingUp size={19} />}
            label="Account Type"
            value={
              profile?.role ||
              user?.role ||
              "Candidate"
            }
          />

          <InfoItem
            icon={<MapPin size={19} />}
            label="Location"
            value={profile?.location || "Not added"}
          />

          <InfoItem
            icon={<Code2 size={19} />}
            label="Headline"
            value={profile?.headline || "Not added"}
          />

        </div>
      </section>

      {/* =================================================
          PROFILE COMPLETION
      ================================================= */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Profile Completion
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Complete your profile to get better job
              recommendations.
            </p>
          </div>

          <span
            className={`rounded-full px-3.5 py-1.5 text-lg font-bold ${
              profileCompletion >= 80
                ? "bg-green-50 text-green-600"
                : profileCompletion >= 40
                ? "bg-blue-50 text-blue-600"
                : "bg-amber-50 text-amber-600"
            }`}
          >
            {profileCompletion}%
          </span>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
            style={{
              width: `${profileCompletion}%`,
            }}
          />
        </div>

        <button
          onClick={() => navigate("/profile")}
          className="mt-4 inline-flex items-center gap-1 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
        >
          Complete Profile
          <ArrowRight
            size={15}
            className="ml-1 inline"
          />
        </button>
      </section>

      {/* =================================================
          SKILLS
      ================================================= */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            <Code2
              size={20}
              className="text-blue-600"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Skills
            </h2>

            <p className="text-sm text-slate-500">
              Your professional skills
            </p>
          </div>
        </div>

        {Array.isArray(profile?.skills) &&
        profile.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <span
                key={index}
                className="rounded-full bg-blue-50 px-3.5 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-100 transition hover:bg-blue-100"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            No skills added yet.
          </p>
        )}
      </section>

      {/* =================================================
          RECOMMENDED JOBS
      ================================================= */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <SectionHeader
          title="Recommended Jobs"
          subtitle="Jobs matching your profile"
          buttonText="View All"
          onClick={() => navigate("/jobs")}
        />

        {recommendedJobs.length === 0 ? (
          <EmptyState
            icon={<Briefcase size={35} />}
            title="No recommended jobs yet"
            description="New jobs matching your profile will appear here."
            buttonText="Find Jobs"
            onClick={() => navigate("/jobs")}
          />
        ) : (
          <div className="space-y-4">
            {recommendedJobs.map((job, index) => (
              <div
                key={job.id || index}
                className="group rounded-xl border border-slate-200 p-4 transition duration-150 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-5"
              >
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 transition group-hover:bg-blue-600">
                    <Briefcase
                      size={23}
                      className="text-blue-600 transition group-hover:text-white"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900">
                      {job.title ||
                        job.jobTitle ||
                        job.job_title ||
                        "Job"}
                    </h3>

                    <p className="mt-1 text-sm text-slate-600">
                      {job.company ||
                        job.companyName ||
                        job.company_name ||
                        "Company"}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} />
                        {job.location ||
                          "Location not specified"}
                      </span>

                      <span>
                        {job.type ||
                          job.jobType ||
                          job.job_type ||
                          "Full Time"}
                      </span>

                      <span>
                        {job.salary ||
                          "Salary not specified"}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate(`/jobs/${job.id}`)
                  }
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600"
                >
                  View Job
                  <ArrowRight size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =================================================
          APPLIED JOBS
      ================================================= */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <SectionHeader
          title="Applied Jobs"
          subtitle="Track your recent applications"
          buttonText="View All"
          onClick={() =>
            navigate("/candidate/applications")
          }
        />

        {applicationsLoading ? (
          <div className="flex justify-center py-10">
            <Loader2
              size={28}
              className="animate-spin text-blue-600"
            />
          </div>
        ) : applications.length === 0 ? (
          <EmptyState
            icon={<FileText size={35} />}
            title="No applications yet"
            description="Jobs you apply for will appear here."
            buttonText="Find Jobs"
            onClick={() => navigate("/jobs")}
          />
        ) : (
          <div className="space-y-4">
            {applications.slice(0, 5).map(
              (application, index) => (
                <div
                  key={
                    application.application_id ||
                    index
                  }
                  className="rounded-xl border border-slate-200 p-4 transition duration-150 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                        <Briefcase
                          size={23}
                          className="text-blue-600"
                        />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {application.job_title ||
                            "Job Title"}
                        </h3>

                        <p className="mt-1 flex items-center gap-1 text-sm text-slate-600">
                          <Building2 size={15} />
                          {application.company_name ||
                            "Company"}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin size={13} />
                            {application.location ||
                              "Location not specified"}
                          </span>

                          <span>
                            {application.job_type ||
                              "Full Time"}
                          </span>

                          <span>
                            {application.experience ||
                              "Experience not specified"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {getStatusBadge(
                        application.status
                      )}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-3">
                    <DetailItem
                      label="Salary"
                      value={
                        application.salary ||
                        "Not specified"
                      }
                    />

                    <DetailItem
                      label="Applied On"
                      value={formatDate(
                        application.applied_at
                      )}
                      icon={<CalendarDays size={14} />}
                    />

                    <DetailItem
                      label="Deadline"
                      value={formatDate(
                        application.deadline
                      )}
                    />
                  </div>

                  {Array.isArray(
                    application.skills
                  ) &&
                    application.skills.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {application.skills.map(
                          (skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    )}

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() =>
                        navigate(
                          `/jobs/${application.job_id}`
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      View Job
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )
            )}

            {applications.length > 5 && (
              <div className="pt-2 text-center">
                <button
                  onClick={() =>
                    navigate("/candidate/applications")
                  }
                  className="text-sm font-semibold text-blue-600"
                >
                  View all {applications.length} applications
                  <ArrowRight
                    size={15}
                    className="ml-1 inline"
                  />
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* =================================================
          RECENT SEARCHES
      ================================================= */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionTitle
          icon={<Search size={20} />}
          title="Recent Job Searches"
          subtitle="Your recent search activity"
        />

        {recentSearches.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            No recent searches found.
          </p>
        ) : (
          <div className="mt-4 flex flex-wrap gap-3">
            {recentSearches.map((search, index) => {
              const searchText =
                typeof search === "string"
                  ? search
                  : search.keyword ||
                    search.search ||
                    search.query ||
                    "";

              return (
                <button
                  key={index}
                  onClick={() => navigate("/jobs")}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Search size={13} className="text-slate-400" />
                  {searchText}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* =================================================
          NOTIFICATIONS
      ================================================= */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="mb-5 flex items-center justify-between">
          <SectionTitle
            icon={<Bell size={20} />}
            title="Notifications"
            subtitle="Latest updates"
          />

          {notifications.length > 0 && (
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 ring-1 ring-inset ring-red-100">
              {notifications.length} New
            </span>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="py-6 text-center">
            <Bell
              size={32}
              className="mx-auto text-slate-300"
            />

            <p className="mt-2 text-sm text-slate-500">
              No new notifications.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(
              (notification, index) => (
                <div
                  key={notification.id || index}
                  className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition hover:bg-slate-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                    <Bell
                      size={17}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <h3 className="font-medium text-slate-800">
                      {notification.title ||
                        "Notification"}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {notification.message ||
                        notification.description ||
                        ""}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      {notification.time ||
                        notification.createdAt ||
                        notification.created_at ||
                        ""}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>

      {/* =================================================
          RECOMMENDED COMPANIES
      ================================================= */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <SectionHeader
          title="Recommended Companies"
          subtitle="Companies you may want to explore"
          icon={<Building2 size={22} />}
        />

        {recommendedCompanies.length === 0 ? (
          <div className="py-6 text-center">
            <Building2
              size={35}
              className="mx-auto text-slate-300"
            />

            <p className="mt-2 text-sm text-slate-500">
              No recommended companies yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recommendedCompanies.map(
              (company, index) => {
                const companyName =
                  typeof company === "string"
                    ? company
                    : company.name ||
                      company.companyName ||
                      company.company_name ||
                      "Company";

                return (
                  <div
                    key={company.id || index}
                    className="group rounded-xl border border-slate-200 p-5 text-center transition duration-150 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 transition group-hover:bg-blue-600">
                      <Building2
                        size={23}
                        className="text-slate-600 transition group-hover:text-white"
                      />
                    </div>

                    <h3 className="mt-3 font-semibold text-slate-800">
                      {companyName}
                    </h3>

                    <button
                      onClick={() =>
                        navigate("/companies")
                      }
                      className="mt-2 text-sm font-medium text-blue-600"
                    >
                      View Company
                    </button>
                  </div>
                );
              }
            )}
          </div>
        )}
      </section>

    </div>
  );
};

// =====================================================
// REUSABLE COMPONENTS
// =====================================================

const InfoItem = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5 transition hover:border-blue-100 hover:bg-blue-50/50">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-400">
          {label}
        </p>

        <p className="break-words font-semibold capitalize text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
};

const DetailItem = ({
  label,
  value,
  icon,
}) => {
  return (
    <div>
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 flex items-center gap-1 text-sm font-medium text-slate-700">
        {icon}
        {value}
      </p>
    </div>
  );
};

const SectionTitle = ({
  icon,
  title,
  subtitle,
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900">
          {title}
        </h2>

        {subtitle && (
          <p className="text-sm text-slate-500">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

const SectionHeader = ({
  title,
  subtitle,
  buttonText,
  onClick,
  icon,
}) => {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            {icon}
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {buttonText && onClick && (
        <button
          onClick={onClick}
          className="inline-flex items-center gap-1 self-start rounded-lg px-2 py-1 text-sm font-medium text-blue-600 transition hover:bg-blue-50 hover:text-blue-700 sm:self-auto"
        >
          {buttonText}
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
};

const EmptyState = ({
  icon,
  title,
  description,
  buttonText,
  onClick,
}) => {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-300 shadow-sm">
        {icon}
      </div>

      <h3 className="mt-3 font-semibold text-slate-700">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>

      {buttonText && onClick && (
        <button
          onClick={onClick}
          className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default CandidateDashboard;