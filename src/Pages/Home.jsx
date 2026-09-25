import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import {
  Search,
  MapPin,
  BriefcaseBusiness,
  ShieldCheck,
  Zap,
  ArrowRight,
  Laptop,
  Megaphone,
  Palette,
  TrendingUp,
  Coins,
  UserRound,
  Users,
  FileText,
  MessageSquare,
  CheckCircle2,
  Building2,
  RefreshCw,
} from "lucide-react";

import Footer from "../Components/Footer";
import Header from "../Components/Header";

const API_ROOT = "http://localhost/job_portal/job-portal-api";
const API_BASE = `${API_ROOT}/api`;

const categoryIcons = {
  "IT & Software": Laptop,
  Marketing: Megaphone,
  Design: Palette,
  Sales: TrendingUp,
  Finance: Coins,
  "Human Resources": UserRound,
};

const features = [
  {
    title: "Verified Jobs",
    description:
      "Every job listing is carefully checked to provide genuine opportunities.",
    icon: ShieldCheck,
  },
  {
    title: "Safe & Secure",
    description:
      "Your profile and application data are protected with secure technology.",
    icon: ShieldCheck,
  },
  {
    title: "Top Companies",
    description:
      "Connect with leading companies and growing startups.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Easy to Apply",
    description:
      "Find relevant jobs and apply quickly with your profile.",
    icon: Zap,
  },
];

const steps = [
  {
    number: "01",
    title: "Search Jobs",
    description:
      "Search jobs by title, skills, location and experience.",
    icon: Search,
  },
  {
    number: "02",
    title: "Apply",
    description:
      "Apply to jobs that match your skills and career goals.",
    icon: FileText,
  },
  {
    number: "03",
    title: "Get Interviewed",
    description:
      "Connect with recruiters and attend interviews.",
    icon: MessageSquare,
  },
  {
    number: "04",
    title: "Get Hired",
    description:
      "Receive an offer and start your next career journey.",
    icon: CheckCircle2,
  },
];

const Home = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);

  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError("");

      const requests = await Promise.allSettled([
        axios.get(`${API_BASE}/jobs/get-all.php`),
        axios.get(`${API_BASE}/companies/get-all.php`),
        axios.get(`${API_BASE}/categories/get-all.php`),
        axios.get(`${API_BASE}/articles/get-all.php`),
      ]);

      const [
        jobsResponse,
        companiesResponse,
        categoriesResponse,
        articlesResponse,
      ] = requests;

      if (jobsResponse.status === "fulfilled") {
        const jobsData = jobsResponse.value.data;

        setJobs(
          Array.isArray(jobsData?.jobs)
            ? jobsData.jobs
            : []
        );
      }

      if (companiesResponse.status === "fulfilled") {
        const companiesData = companiesResponse.value.data;

        setCompanies(
          Array.isArray(companiesData?.companies)
            ? companiesData.companies
            : []
        );
      }

      if (categoriesResponse.status === "fulfilled") {
        const categoriesData = categoriesResponse.value.data;

        setCategories(
          Array.isArray(categoriesData?.categories)
            ? categoriesData.categories
            : []
        );
      }

      if (articlesResponse.status === "fulfilled") {
        const articlesData = articlesResponse.value.data;

        setArticles(
          Array.isArray(articlesData?.articles)
            ? articlesData.articles
            : []
        );
      }

      if (requests.every((request) => request.status === "rejected")) {
        setError("Unable to connect with backend APIs.");
      }
    } catch (err) {
      console.error("Home API Error:", err);
      setError("Unable to load home page data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (jobTitle.trim()) {
      params.set("search", jobTitle.trim());
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    const query = params.toString();

    navigate(query ? `/jobs?${query}` : "/jobs");
  };

  // Converts relative image paths into complete URLs.
  const getAssetUrl = (value) => {
    if (!value) {
      return "";
    }

    const assetPath = String(value).trim();

    if (!assetPath) {
      return "";
    }

    if (/^https?:\/\//i.test(assetPath)) {
      return assetPath;
    }

    return `${API_ROOT}/${assetPath.replace(/^\/+/, "")}`;
  };

  const getJobRole = (job) => {
    return (
      job?.job_title ||
      job?.role ||
      job?.title ||
      job?.job_role ||
      "Software Developer"
    );
  };

  const getJobCompany = (job) => {
    return (
      job?.company_name ||
      job?.company ||
      job?.companyName ||
      "Company"
    );
  };

  const getCompanyLogo = (job) => {
    return getAssetUrl(
      job?.company_logo_url ||
        job?.company_logo ||
        job?.companyLogo ||
        job?.logo ||
        ""
    );
  };

  const getJobLocation = (job) => {
    return (
      job?.location ||
      job?.job_location ||
      "Remote / On-site"
    );
  };

  const getJobType = (job) => {
    return (
      job?.job_type ||
      job?.type ||
      "Full Time"
    );
  };

  const getJobExperience = (job) => {
    return (
      job?.experience ||
      job?.experience_level ||
      "0-2 Yrs"
    );
  };

  const getJobSalary = (job) => {
    return (
      job?.salary ||
      job?.salary_range ||
      "Not disclosed"
    );
  };

  const getJobOpenings = (job) => {
    const openings = Number(job?.vacancies);

    if (!Number.isFinite(openings) || openings <= 0) {
      return 1;
    }

    return openings;
  };

  const getCompanyName = (company) => {
    return (
      company?.company_name ||
      company?.name ||
      company?.company ||
      "Company"
    );
  };

  const getCompanyLogoFromCompany = (company) => {
    return getAssetUrl(
      company?.logo ||
        company?.company_logo ||
        company?.companyLogo ||
        ""
    );
  };

  const getCompanyJobCount = (company) => {
    const companyName = getCompanyName(company).toLowerCase();

    return jobs
      .filter((job) => {
        return getJobCompany(job).toLowerCase() === companyName;
      })
      .reduce((total, job) => {
        return total + getJobOpenings(job);
      }, 0);
  };

  const getArticleImage = (article) => {
    return getAssetUrl(
      article?.image ||
        article?.image_url ||
        article?.thumbnail ||
        ""
    );
  };

  const displayCompanies =
    companies.length > 0
      ? companies
      : Array.from(
          new Map(
            jobs
              .filter(
                (job) => getJobCompany(job) !== "Company"
              )
              .map((job) => [
                getJobCompany(job).toLowerCase(),
                {
                  ...job,
                  company_name: getJobCompany(job),
                  fromJob: true,
                },
              ])
          ).values()
        );

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />

      {error && (
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            <span>{error}</span>

            <button
              onClick={fetchHomeData}
              className="flex shrink-0 items-center gap-1 font-semibold hover:underline"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-16 xl:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] xl:gap-16">
            <div className="min-w-0">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3.5 py-2 text-xs font-semibold text-blue-600 shadow-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                Find Your Next Opportunity
              </div>

              <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[48px] xl:text-6xl">
                Find Your{" "}
                <span className="block text-blue-600">
                  Dream Job
                </span>{" "}
                & Build Your Future
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                Discover job opportunities from top companies.
                Find the right role that matches your skills.
              </p>

              <form
                onSubmit={handleSearch}
                className="mt-7 rounded-2xl bg-white p-2 shadow-xl shadow-blue-100/60 ring-1 ring-slate-100"
              >
                <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                  <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 px-3 py-3 sm:px-4">
                    <Search
                      size={20}
                      className="shrink-0 text-slate-400"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-400">
                        Job title / skills
                      </p>

                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(event) =>
                          setJobTitle(event.target.value)
                        }
                        placeholder="e.g. MERN Developer"
                        className="mt-1 block w-full min-w-0 truncate border-none bg-transparent p-0 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 px-3 py-3 sm:px-4">
                    <MapPin
                      size={20}
                      className="shrink-0 text-slate-400"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-400">
                        Location
                      </p>

                      <input
                        type="text"
                        value={location}
                        onChange={(event) =>
                          setLocation(event.target.value)
                        }
                        placeholder="City or Remote"
                        className="mt-1 block w-full min-w-0 truncate border-none bg-transparent p-0 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex min-h-[58px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 lg:px-6"
                  >
                    <Search size={18} />
                    <span className="whitespace-nowrap">
                      Search Jobs
                    </span>
                  </button>
                </div>
              </form>
            </div>

            <div className="relative hidden min-h-[520px] items-center justify-center lg:flex">
              <div className="relative z-10 flex h-[390px] w-[390px] items-center justify-center rounded-full bg-gradient-to-br from-blue-50 via-white to-cyan-100">
                <div className="flex h-[290px] w-[290px] items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 shadow-2xl shadow-blue-300">
                  <div className="text-center text-white">
                    <BriefcaseBusiness
                      size={88}
                      strokeWidth={1.4}
                      className="mx-auto"
                    />

                    <p className="mt-4 text-sm font-semibold tracking-wide">
                      FIND YOUR
                    </p>

                    <h3 className="text-3xl font-extrabold">
                      DREAM JOB
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                Explore opportunities
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                Browse Jobs by Category
              </h2>
            </div>

            <Link
              to="/jobs"
              className="hidden items-center gap-1 text-sm font-semibold text-blue-600 sm:flex"
            >
              View All
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
            {loading ? (
              <div className="col-span-full py-8 text-center text-slate-500">
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div className="col-span-full py-8 text-center text-slate-500">
                No categories available.
              </div>
            ) : (
              categories.map((category) => {
                const Icon =
                  categoryIcons[category.name] ||
                  BriefcaseBusiness;

                return (
                  <Link
                    key={category.id}
                    to={`/jobs?category=${encodeURIComponent(
                      category.name
                    )}`}
                    className="group rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg sm:p-5"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                      <Icon size={21} />
                    </div>

                    <h3 className="mt-4 text-sm font-bold text-slate-900">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {category.job_count || 0} Jobs
                    </p>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* FEATURED JOBS SECTION */}
      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                Latest opportunities
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                Featured Jobs
              </h2>
            </div>

            <Link
              to="/jobs"
              className="hidden items-center gap-1 text-sm font-semibold text-blue-600 sm:flex"
            >
              View All Jobs
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading ? (
              <div className="col-span-full py-10 text-center text-slate-500">
                Loading jobs...
              </div>
            ) : jobs.length === 0 ? (
              <div className="col-span-full py-10 text-center text-slate-500">
                No jobs available right now.
              </div>
            ) : (
              jobs.slice(0, 4).map((job) => {
                const logo = getCompanyLogo(job);
                const role = getJobRole(job);
                const company = getJobCompany(job);
                const locationValue = getJobLocation(job);
                const openings = getJobOpenings(job);

                return (
                  <div
                    key={job.id}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
                  >
                    <div>
                      {/* Company Logo and Featured Badge */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 text-blue-600 ring-1 ring-slate-100">
                          {logo ? (
                            <img
                              src={logo}
                              alt={company}
                              className="h-full w-full object-cover"
                              onError={(event) => {
                                event.currentTarget.style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <Building2 size={24} />
                          )}
                        </div>

                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-600 ring-1 ring-green-100">
                          Featured
                        </span>
                      </div>

                      {/* Job Title */}
                      <h3 className="mt-4 text-lg font-bold text-slate-900 transition group-hover:text-blue-600">
                        {role}
                      </h3>

                      {/* Company Name */}
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {company}
                      </p>

                      {/* Job Details */}
                      <div className="mt-4 space-y-2.5 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <MapPin
                            size={15}
                            className="shrink-0 text-slate-400"
                          />

                          <span className="truncate">
                            {locationValue}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <BriefcaseBusiness
                            size={15}
                            className="shrink-0 text-slate-400"
                          />

                          <span className="truncate">
                            {getJobType(job)} •{" "}
                            {getJobExperience(job)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 font-semibold text-slate-800">
                          <Coins
                            size={15}
                            className="shrink-0 text-blue-600"
                          />

                          <span className="truncate">
                            {getJobSalary(job)}
                          </span>
                        </div>

                        {/* Openings */}
                        <div className="flex items-center gap-2 font-semibold text-blue-600">
                          <Users
                            size={15}
                            className="shrink-0"
                          />

                          <span>
                            {openings}{" "}
                            {openings === 1
                              ? "Opening"
                              : "Openings"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* View Details */}
                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-blue-600">
                      <span>View Details</span>

                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* TOP COMPANIES */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold text-blue-600">
              Trusted by candidates
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Top Companies Hiring
            </h2>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              <div className="col-span-full py-8 text-center text-slate-500">
                Loading companies...
              </div>
            ) : displayCompanies.length === 0 ? (
              <div className="col-span-full py-8 text-center text-slate-500">
                No companies available.
              </div>
            ) : (
              displayCompanies.slice(0, 8).map((company) => {
                const companyName = getCompanyName(company);
                const companyLogo =
                  company.fromJob
                    ? getCompanyLogo(company)
                    : getCompanyLogoFromCompany(company);

                const jobCount = getCompanyJobCount(company);

                return (
                  <Link
                    key={
                      company.fromJob
                        ? `job-company-${company.id}`
                        : company.id
                    }
                    to={
                      company.fromJob
                        ? `/jobs?search=${encodeURIComponent(
                            companyName
                          )}`
                        : `/companies/${company.id}`
                    }
                    className="group flex min-h-[132px] flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                        {companyLogo ? (
                          <img
                            src={companyLogo}
                            alt={companyName}
                            className="h-full w-full object-cover"
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <Building2 size={23} />
                        )}
                      </div>

                      <ArrowRight
                        size={18}
                        className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                      />
                    </div>

                    <div className="mt-5 min-w-0">
                      <h3 className="truncate text-sm font-bold text-slate-800 group-hover:text-blue-600">
                        {companyName}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {jobCount} open{" "}
                        {jobCount === 1
                          ? "position"
                          : "positions"}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-blue-600">
              Why JobandJob?
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Everything You Need to Build Your Career
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              We make job searching simple, secure and effective
              for candidates and recruiters.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-4 text-base font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold text-blue-600">
              Simple process
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              How It Works
            </h2>
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon size={21} />
                    </div>

                    <span className="text-3xl font-black text-slate-100">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-5 text-base font-bold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                Career resources
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                Career Advice & Tips
              </h2>
            </div>

            <Link
              to="/career-advice"
              className="hidden items-center gap-1 text-sm font-semibold text-blue-600 sm:flex"
            >
              View All
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            {loading ? (
              <div className="col-span-full py-8 text-center text-slate-500">
                Loading articles...
              </div>
            ) : articles.length === 0 ? (
              <div className="col-span-full py-8 text-center text-slate-500">
                No articles available.
              </div>
            ) : (
              articles.slice(0, 4).map((article) => {
                const articleImage = getArticleImage(article);

                return (
                  <Link
                    key={article.id}
                    to="/career-advice"
                    className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
                  >
                    <div className="h-44 overflow-hidden bg-slate-100">
                      {articleImage ? (
                        <img
                          src={articleImage}
                          alt={article.title || "Career article"}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-400">
                          <FileText size={40} />
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <span className="text-xs font-semibold text-blue-600">
                        {article.category || "Career Tips"}
                      </span>

                      <h3 className="mt-2 line-clamp-2 text-base font-bold leading-6 text-slate-900">
                        {article.title || "Career Advice"}
                      </h3>

                      <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600">
                        Read Article
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-blue-600 px-6 py-10 text-center sm:px-10 lg:flex lg:items-center lg:justify-between lg:text-left">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Ready to take the next step in your career?
            </h2>

            <p className="mt-2 text-sm text-blue-100">
              Join thousands of job seekers who found their dream
              role through our portal.
            </p>
          </div>

          <div className="mt-6 flex justify-center gap-4 lg:mt-0">
            <Link
              to="/jobs"
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-600 transition hover:bg-blue-50"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;