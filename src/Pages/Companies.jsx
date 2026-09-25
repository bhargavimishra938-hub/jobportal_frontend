import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  Building2,
  MapPin,
  Briefcase,
  Search,
  Loader2,
  AlertCircle,
  ExternalLink,
  Users,
  Calendar,
} from "lucide-react";

import Header from "../Components/Header";
import Footer from "../Components/Footer";

// Base API URL
const API_BASE_URL = "http://localhost/job_portal/job-portal-api";

// Dynamic logo helper
const getLogoUrl = (logo) => {
  if (!logo) return null;

  const logoString = String(logo).trim();

  if (logoString.startsWith("http://") || logoString.startsWith("https://")) {
    return logoString;
  }

  return `${API_BASE_URL}/${logoString.replace(/^\/+/, "")}`;
};

// Dynamic website link helper
const getWebsiteUrl = (website) => {
  if (!website) return null;

  const websiteString = String(website).trim();

  if (websiteString.startsWith("http://") || websiteString.startsWith("https://")) {
    return websiteString;
  }

  return `https://${websiteString}`;
};

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // State for View All toggle
  const [showAll, setShowAll] = useState(false);

  // PHP API Se Dynamic Data Fetch karne ka Function
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/api/companies/get-all.php`
      );

      console.log("Companies API Response:", response.data);

      if (response.data && response.data.success) {
        // Safe check dynamic array binding
        const rawData = response.data.companies || response.data.data || [];
        const companyData = Array.isArray(rawData) ? rawData : [];

        setCompanies(companyData);
      } else {
        setCompanies([]);
        setError(
          response.data?.message || "No dynamic company data received."
        );
      }
    } catch (err) {
      console.error("Companies API Error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to connect to the backend server. Please verify your API URL."
      );
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Live Dynamic Filtering (Search Bar)
  const filteredCompanies = companies.filter((company) => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) return true;

    const companyName = String(company.company_name || "").toLowerCase();
    const location = String(company.location || "").toLowerCase();
    const industry = String(company.industry || "").toLowerCase();

    return (
      companyName.includes(searchText) ||
      location.includes(searchText) ||
      industry.includes(searchText)
    );
  });

  // Dynamic slice logic: Search context active hone par ya showAll true hone par sabhi dikhegi, warna initial 4
  const visibleCompanies = (search.trim() || showAll)
    ? filteredCompanies
    : filteredCompanies.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        <Header />

        {/* Hero & Search Header */}
        <section className="border-b bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
                Explore Companies
              </h1>

              <p className="mt-4 text-lg text-gray-600">
                Discover top organizations hiring right now, explore their culture, and direct positions.
              </p>

              {/* Dynamic Search Box */}
              <div className="relative mx-auto mt-8 max-w-2xl">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by company name, location, or industry..."
                  className="w-full rounded-xl border border-gray-300 bg-white py-4 pl-12 pr-4 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Loading Indicator */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={40} className="animate-spin text-blue-600" />
              <p className="mt-4 text-sm font-medium text-gray-600">
                Fetching dynamic company listings...
              </p>
            </div>
          )}

          {/* Error Message */}
          {!loading && error && (
            <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
              <AlertCircle size={40} className="mx-auto text-red-500" />
              <h3 className="mt-3 text-lg font-semibold text-red-700">
                Data Load Error
              </h3>
              <p className="mt-2 text-sm text-red-600">{error}</p>

              <button
                type="button"
                onClick={fetchCompanies}
                className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 active:scale-95"
              >
                Try Reloading
              </button>
            </div>
          )}

          {/* Empty Records State */}
          {!loading && !error && filteredCompanies.length === 0 && (
            <div className="py-20 text-center">
              <Building2 size={56} className="mx-auto text-gray-300" />
              <h3 className="mt-4 text-xl font-semibold text-gray-800">
                No Companies Found
              </h3>
              <p className="mt-2 text-gray-500">
                {search
                  ? "No dynamic results matched your search terms."
                  : "No registered companies are available in the system yet."}
              </p>
            </div>
          )}

          {/* Dynamic Grid Listing */}
          {!loading && !error && filteredCompanies.length > 0 && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Companies Directory
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Showing <span className="font-semibold text-gray-800">{visibleCompanies.length}</span> of{" "}
                    <span className="font-semibold text-gray-800">{filteredCompanies.length}</span> dynamic employer record(s)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visibleCompanies.map((company) => {
                  const logoUrl = getLogoUrl(company.logo);
                  const websiteUrl = getWebsiteUrl(company.website);
                  const openJobs = Number(company.open_jobs || 0);

                  // Unique key identification
                  const companyKey = company.id || company.company_id || company.user_id;

                  return (
                    <div
                      key={companyKey}
                      className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                    >
                      <div>
                        {/* Company Logo and Name */}
                        <div className="flex items-start gap-4">
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-1">
                            {logoUrl ? (
                              <img
                                src={logoUrl}
                                alt={company.company_name || "Company Logo"}
                                className="h-full w-full object-contain"
                                onError={(e) => {
                                  // Image fail-safe fallback
                                  e.target.onerror = null;
                                  e.target.style.display = "none";
                                  e.target.parentElement.innerHTML = `<div class="text-blue-600 font-bold text-xl">${(
                                    company.company_name || "C"
                                  )
                                    .charAt(0)
                                    .toUpperCase()}</div>`;
                                }}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-blue-50 font-bold text-xl text-blue-600">
                                {(company.company_name || "C")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-lg font-bold text-gray-900">
                              {company.company_name || "Untitled Company"}
                            </h3>

                            {company.industry && (
                              <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700">
                                {company.industry}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="mt-4 line-clamp-3 text-sm text-gray-600 leading-relaxed">
                          {company.description || "No company description provided."}
                        </p>

                        {/* Meta Specs */}
                        <div className="mt-5 space-y-2.5 border-t border-gray-100 pt-4 text-xs text-gray-600">
                          {company.location && (
                            <div className="flex items-center gap-2">
                              <MapPin size={15} className="shrink-0 text-gray-400" />
                              <span className="truncate">{company.location}</span>
                            </div>
                          )}

                          {company.company_size && (
                            <div className="flex items-center gap-2">
                              <Users size={15} className="shrink-0 text-gray-400" />
                              <span>{company.company_size} Employees</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 font-medium text-emerald-600">
                            <Briefcase size={15} className="shrink-0 text-emerald-500" />
                            <span>
                              {openJobs} {openJobs === 1 ? "Open Position" : "Open Positions"}
                            </span>
                          </div>

                          {company.founded_year && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <Calendar size={15} className="shrink-0" />
                              <span>Founded in {company.founded_year}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Links */}
                      <div className="mt-6 flex items-center gap-3 pt-2">
                        <Link
                          to={
                            company.is_profile_fallback
                              ? `/jobs?search=${encodeURIComponent(company.company_name || "")}`
                              : `/companies/${company.id || company.company_id}`
                          }
                          className="flex-1 rounded-xl bg-blue-600 py-2.5 text-center text-xs font-semibold text-white transition hover:bg-blue-700 active:scale-95"
                        >
                          {company.is_profile_fallback ? "View Openings" : "View Details"}
                        </Link>

                        {websiteUrl && (
                          <a
                            href={websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center rounded-xl border border-gray-300 p-2.5 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                            title="Visit Official Website"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* View All / Show Less Button */}
              {!search.trim() && filteredCompanies.length > 4 && (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAll(!showAll)}
                    className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-95"
                  >
                    {showAll
                      ? "Show Less"
                      : `View All Companies (${filteredCompanies.length - 4} More)`}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Companies;