
import React, { useEffect, useState } from "react";
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  Globe,
  Save,
  Loader2,
} from "lucide-react";

const API_URL =
  "http://localhost/job_portal/job-portal-api/api/recruiter/company-profile.php";

const CompanyProfile = () => {
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    company_name: "",
    email: "",
    phone: "",
    location: "",
    website: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setError("Please login first");
      setLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      if (!parsedUser.id) {
        setError("Recruiter ID not found");
        setLoading(false);
        return;
      }

      fetchProfile(parsedUser.id);
    } catch (err) {
      setError("Invalid user data");
      setLoading(false);
    }
  }, []);

  const fetchProfile = async (recruiterId) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}?recruiterId=${Number(recruiterId)}`
      );

      const result = await response.json();

      if (result.success && result.data) {
        setFormData({
          company_name: result.data.company_name || "",
          email: result.data.email || "",
          phone: result.data.phone || "",
          location: result.data.location || "",
          website: result.data.website || "",
        });
      }
    } catch (err) {
      setError("Unable to load company profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user?.id) {
      setError("Recruiter ID not found");
      return;
    }

    if (!formData.company_name.trim()) {
      setError("Company name is required");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recruiter_id: Number(user.id),
          ...formData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage(result.message || "Profile saved successfully");
      } else {
        setError(result.message || "Failed to save profile");
      }
    } catch (err) {
      setError("Server error. Please try again");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-gray-200 pb-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 sm:h-16 sm:w-16">
          <Building2 size={30} />
        </div>

        <div className="min-w-0">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Company Profile
          </h2>

          <p className="text-sm text-gray-500">
            Manage your company information
          </p>
        </div>
      </div>

      {message && (
        <div className="mb-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid min-w-0 gap-5 md:grid-cols-2">
          <div className="min-w-0">
            <label className="text-sm font-medium text-gray-600">
              Company Name *
            </label>

            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Enter company name"
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="min-w-0">
            <label className="text-sm font-medium text-gray-600">
              Email
            </label>

            <div className="mt-2 flex min-w-0 items-center gap-2 rounded-lg border border-gray-300 p-3">
              <Mail size={18} className="shrink-0 text-gray-500" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="company@example.com"
                className="min-w-0 w-full outline-none"
              />
            </div>
          </div>

          <div className="min-w-0">
            <label className="text-sm font-medium text-gray-600">
              Phone
            </label>

            <div className="mt-2 flex min-w-0 items-center gap-2 rounded-lg border border-gray-300 p-3">
              <Phone size={18} className="shrink-0 text-gray-500" />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                className="min-w-0 w-full outline-none"
              />
            </div>
          </div>

          <div className="min-w-0">
            <label className="text-sm font-medium text-gray-600">
              Location
            </label>

            <div className="mt-2 flex min-w-0 items-center gap-2 rounded-lg border border-gray-300 p-3">
              <MapPin size={18} className="shrink-0 text-gray-500" />

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Lucknow, India"
                className="min-w-0 w-full outline-none"
              />
            </div>
          </div>

          <div className="min-w-0 md:col-span-2">
            <label className="text-sm font-medium text-gray-600">
              Website
            </label>

            <div className="mt-2 flex min-w-0 items-center gap-2 rounded-lg border border-gray-300 p-3">
              <Globe size={18} className="shrink-0 text-gray-500" />

              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://www.example.com"
                className="min-w-0 w-full outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Profile
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CompanyProfile;