import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  GraduationCap,
  FolderKanban,
  FileText,
  Download,
  Eye,
  Upload,
  Pencil,
  ExternalLink,
  X,
  Save,
  Link2,
  Globe,
} from "lucide-react";


const API_BASE =
  "http://localhost/job_portal/job-portal-api/api/profile";

const Profile = () => {
  // ================= PROFILE STATE =================

  const [profile, setProfile] = useState({
    name: "",
    designation: "",
    location: "",
    email: "",
    phone: "",
    about: "",
    profileImage: null,
    resume: null,
    linkedin: "",
    github: "",
    portfolio: "",
  });

  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [projects, setProjects] = useState([]);

  // ================= EDIT STATE =================

  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const [editForm, setEditForm] = useState({
    designation: "",
    location: "",
    about: "",
    skills: "",
    education: "[]",
    experience: "[]",
    projects: "[]",
    linkedin: "",
    github: "",
    portfolio: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= GET USER ID =================

  const getUserId = () => {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      return storedUser?.id || null;
    } catch (error) {
      console.error("User data error:", error);
      return null;
    }
  };

  // ================= FETCH PROFILE =================

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const userId = getUserId();

      if (!userId) {
        setError("User not logged in");
        return;
      }

      const response = await axios.get(
        `${API_BASE}/get.php?user_id=${userId}`
      );

      if (response.data.success) {
        const data = response.data.profile;

        // ================= BASIC PROFILE =================

        setProfile({
          name: data.name || "",
          designation: data.headline || "",
          location: data.location || "",
          email: data.email || "",
          phone: data.phone || "",
          about: data.bio || "",
          profileImage: data.profile_image || null,
          resume: data.resume || null,
          linkedin: data.linkedin || "",
          github: data.github || "",
          portfolio: data.portfolio || "",
        });

        // ================= SKILLS =================

        setSkills(
          Array.isArray(data.skills)
            ? data.skills
            : []
        );

        // ================= EXPERIENCE =================

        setExperiences(
          Array.isArray(data.experience)
            ? data.experience
            : []
        );

        // ================= EDUCATION =================

        setEducation(
          Array.isArray(data.education)
            ? data.education
            : []
        );

        // ================= PROJECTS =================

        setProjects(
          Array.isArray(data.projects)
            ? data.projects
            : []
        );
      } else {
        setError(
          response.data.message ||
            "Failed to load profile"
        );
      }
    } catch (err) {
      console.error("Profile fetch error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to connect with server"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= INITIAL LOAD =================

  useEffect(() => {
    fetchProfile();
  }, []);

  // ================= OPEN EDIT MODAL =================

  const handleEditProfile = () => {
    setSaveMessage("");
    setSaveError("");

    setEditForm({
      designation: profile.designation || "",
      location: profile.location || "",
      about: profile.about || "",

      // Convert array into comma separated text
      skills: skills.join(", "),

      // Convert arrays into JSON text
      education: JSON.stringify(
        education,
        null,
        2
      ),

      experience: JSON.stringify(
        experiences,
        null,
        2
      ),

      projects: JSON.stringify(
        projects,
        null,
        2
      ),

      linkedin: profile.linkedin || "",
      github: profile.github || "",
      portfolio: profile.portfolio || "",
    });

    setShowEditModal(true);
  };

  // ================= CLOSE MODAL =================

  const handleCloseModal = () => {
    if (!saving) {
      setShowEditModal(false);
      setSaveMessage("");
      setSaveError("");
    }
  };

  // ================= FORM CHANGE =================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= JSON PARSER =================

  const parseJsonArray = (value, fieldName) => {
    try {
      const parsed = JSON.parse(value || "[]");

      if (!Array.isArray(parsed)) {
        throw new Error(
          `${fieldName} must be an array`
        );
      }

      return parsed;
    } catch (error) {
      throw new Error(
        `Invalid ${fieldName} format. Please check the JSON.`
      );
    }
  };

  // ================= SAVE PROFILE =================

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setSaveMessage("");
      setSaveError("");

      const userId = getUserId();

      if (!userId) {
        setSaveError("User not logged in");
        return;
      }

      // ================= SKILLS =================

      const skillsArray = editForm.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      // ================= PARSE JSON =================

      let educationArray;
      let experienceArray;
      let projectsArray;

      try {
        educationArray = parseJsonArray(
          editForm.education,
          "education"
        );

        experienceArray = parseJsonArray(
          editForm.experience,
          "experience"
        );

        projectsArray = parseJsonArray(
          editForm.projects,
          "projects"
        );
      } catch (error) {
        setSaveError(error.message);
        return;
      }

      // ================= REQUEST DATA =================

      const payload = {
        user_id: Number(userId),

        profile_image:
          profile.profileImage || null,

        headline:
          editForm.designation.trim(),

        bio:
          editForm.about.trim(),

        location:
          editForm.location.trim(),

        date_of_birth: "",

        education: educationArray,

        projects: projectsArray,

        skills: skillsArray,

        experience: experienceArray,

        resume:
          profile.resume || null,

        linkedin:
          editForm.linkedin.trim(),

        github:
          editForm.github.trim(),

        portfolio:
          editForm.portfolio.trim(),
      };

      // ================= API CALL =================

      const response = await axios.post(
        `${API_BASE}/save.php`,
        payload
      );

      if (response.data.success) {
        setSaveMessage(
          "Profile saved successfully!"
        );

        // Refresh profile from database
        await fetchProfile();

        // Close after short delay
        setTimeout(() => {
          setShowEditModal(false);
          setSaveMessage("");
        }, 1000);
      } else {
        setSaveError(
          response.data.message ||
            "Failed to save profile"
        );
      }
    } catch (err) {
      console.error("Save profile error:", err);

      setSaveError(
        err.response?.data?.message ||
          "Failed to save profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // ================= PROFILE COMPLETION =================

  const calculateCompletion = () => {
    const fields = [
      profile.name,
      profile.designation,
      profile.location,
      profile.about,
      profile.email,
      profile.phone,
      skills.length > 0,
      experiences.length > 0,
      education.length > 0,
      projects.length > 0,
      profile.resume,
    ];

    const completed = fields.filter(
      Boolean
    ).length;

    return Math.round(
      (completed / fields.length) * 100
    );
  };

  const completion = calculateCompletion();

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="text-slate-500 mt-4">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white border border-red-200 rounded-2xl shadow-sm p-8 text-center max-w-md">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <X className="w-7 h-7 text-red-500" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 mt-5">
            Unable to Load Profile
          </h2>

          <p className="text-slate-500 mt-2">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchProfile}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ================= MAIN UI =================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* ================= PROFILE CONTENT ================= */}

      <main className="py-8 px-4 sm:px-6 lg:px-8">

        <div className="max-w-7xl mx-auto">

          {/* ================= PAGE HEADER ================= */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                My Profile
              </h1>

              <p className="text-slate-500 mt-1">
                Manage your professional profile and resume
              </p>
            </div>

            <button
              type="button"
              onClick={handleEditProfile}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow-sm shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </button>

          </div>

          {/* ================= MAIN GRID ================= */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ================= LEFT PROFILE CARD ================= */}

            <div className="lg:col-span-1">

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden lg:sticky lg:top-24">

                {/* ================= COVER + AVATAR ================= */}

                <div className="relative h-20 bg-gradient-to-r from-blue-600 to-cyan-500">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-xl" />
                </div>

                <div className="px-6 pb-6">

                  <div className="flex justify-center -mt-12">

                    <div className="relative">

                      {profile.profileImage ? (
                        <img
                          src={profile.profileImage}
                          alt={profile.name}
                          className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                        />
                      ) : (
                        <div className="w-28 h-28 rounded-full bg-blue-50 border-4 border-white shadow-md flex items-center justify-center">
                          <User className="w-14 h-14 text-blue-500" />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleEditProfile}
                        className="absolute bottom-0 right-0 w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center border-4 border-white transition shadow-sm"
                      >
                        <Upload className="w-4 h-4" />
                      </button>

                    </div>

                  </div>

                  {/* ================= NAME ================= */}

                  <div className="text-center mt-4">

                    <h2 className="text-2xl font-bold text-slate-900">
                      {profile.name || "Your Name"}
                    </h2>

                    <p className="text-blue-600 font-semibold mt-1">
                      {profile.designation ||
                        "Add your designation"}
                    </p>

                    {profile.location && (
                      <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-slate-400">
                        <MapPin size={12} />
                        {profile.location}
                      </p>
                    )}

                  </div>

                  {/* ================= SOCIAL LINKS ================= */}

                  {(profile.linkedin || profile.github || profile.portfolio) && (
                    <div className="flex justify-center gap-2 mt-4">

                      {profile.linkedin && (
                        <a
                          href={profile.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                          <Link2 size={16} />
                        </a>
                      )}

                      {profile.github && (
                        <a
                          href={profile.github}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                          <Github size={16} />
                        </a>
                      )}

                      {profile.portfolio && (
                        <a
                          href={profile.portfolio}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                          <Globe size={16} />
                        </a>
                      )}

                    </div>
                  )}

                  {/* ================= CONTACT ================= */}

                  <div className="border-t border-slate-100 mt-6 pt-6 space-y-4">

                    {/* LOCATION */}

                    <div className="flex items-start gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Location
                        </p>

                        <p className="text-sm font-medium text-slate-700">
                          {profile.location ||
                            "Not added"}
                        </p>
                      </div>

                    </div>

                    {/* EMAIL */}

                    <div className="flex items-start gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>

                      <div className="min-w-0">

                        <p className="text-xs text-slate-400">
                          Email
                        </p>

                        <p className="text-sm font-medium text-slate-700 break-all">
                          {profile.email ||
                            "Not added"}
                        </p>

                      </div>

                    </div>

                    {/* PHONE */}

                    <div className="flex items-start gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                        <Phone className="w-4 h-4 text-blue-600" />
                      </div>

                      <div>

                        <p className="text-xs text-slate-400">
                          Phone
                        </p>

                        <p className="text-sm font-medium text-slate-700">
                          {profile.phone ||
                            "Not added"}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* ================= PROFILE COMPLETION ================= */}

                  <div className="border-t border-slate-100 mt-6 pt-6">

                    <div className="flex justify-between mb-2">

                      <span className="text-sm font-medium text-slate-700">
                        Profile Completion
                      </span>

                      <span
                        className={`text-sm font-bold ${
                          completion >= 80
                            ? "text-green-600"
                            : completion >= 40
                            ? "text-blue-600"
                            : "text-amber-600"
                        }`}
                      >
                        {completion}%
                      </span>

                    </div>

                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${completion}%`,
                        }}
                      />

                    </div>

                    <p className="text-xs text-slate-400 mt-2">
                      Complete your profile to improve your chances of getting hired.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* ================= RIGHT CONTENT ================= */}

            <div className="lg:col-span-2 space-y-6">

              {/* ================= ABOUT ME ================= */}

              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                <SectionTitle
                  icon={<User className="w-5 h-5" />}
                  title="About Me"
                />

                <p className="text-slate-600 leading-7 mt-5">
                  {profile.about ||
                    "No information added yet."}
                </p>

              </section>

              {/* ================= SKILLS ================= */}

              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                <SectionTitle
                  icon={
                    <BriefcaseBusiness className="w-5 h-5" />
                  }
                  title="Skills"
                />

                <div className="flex flex-wrap gap-2.5 mt-5">

                  {skills.length > 0 ? (
                    skills.map(
                      (skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-100 rounded-full text-sm font-medium transition hover:bg-blue-100"
                        >
                          {skill}
                        </span>
                      )
                    )
                  ) : (
                    <p className="text-slate-400 text-sm">
                      No skills added yet.
                    </p>
                  )}

                </div>

              </section>

              {/* ================= EXPERIENCE ================= */}

              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                <SectionTitle
                  icon={
                    <BriefcaseBusiness className="w-5 h-5" />
                  }
                  title="Experience"
                />

                <div className="mt-6 space-y-7">

                  {experiences.length > 0 ? (
                    experiences.map(
                      (experience, index) => (

                        <div
                          key={index}
                          className="relative pl-7 border-l-2 border-blue-100"
                        >

                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-[3px] border-blue-600" />

                          <h3 className="text-lg font-bold text-slate-900">
                            {experience.designation}
                          </h3>

                          <p className="text-blue-600 font-medium mt-1">
                            {experience.company}
                          </p>

                          <p className="text-xs text-slate-400 mt-1.5 inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
                            {experience.duration}
                          </p>

                          <p className="text-slate-600 text-sm leading-6 mt-3">
                            {experience.description}
                          </p>

                        </div>
                      )
                    )
                  ) : (
                    <p className="text-slate-400 text-sm">
                      No experience added yet.
                    </p>
                  )}

                </div>

              </section>

              {/* ================= EDUCATION ================= */}

              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                <SectionTitle
                  icon={
                    <GraduationCap className="w-5 h-5" />
                  }
                  title="Education"
                />

                <div className="mt-6 space-y-4">

                  {education.length > 0 ? (
                    education.map(
                      (item, index) => (

                        <div
                          key={index}
                          className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 transition hover:border-blue-100 hover:bg-blue-50/40"
                        >

                          <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">

                            <GraduationCap className="w-5 h-5 text-blue-600" />

                          </div>

                          <div>

                            <h3 className="font-bold text-slate-900">
                              {item.degree}
                            </h3>

                            <p className="text-sm text-slate-600 mt-1">
                              {item.university}
                            </p>

                            <p className="text-xs text-slate-400 mt-1">
                              {item.duration}
                            </p>

                          </div>

                        </div>
                      )
                    )
                  ) : (
                    <p className="text-slate-400 text-sm">
                      No education added yet.
                    </p>
                  )}

                </div>

              </section>

              {/* ================= PROJECTS ================= */}

              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                <SectionTitle
                  icon={
                    <FolderKanban className="w-5 h-5" />
                  }
                  title="Projects"
                />

                <div className="grid sm:grid-cols-2 gap-4 mt-6">

                  {projects.length > 0 ? (
                    projects.map(
                      (project, index) => (

                        <div
                          key={index}
                          className="group p-5 rounded-xl border border-slate-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md transition duration-150"
                        >

                          <div className="flex items-start justify-between gap-3">

                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center transition group-hover:bg-blue-600">

                              <FolderKanban className="w-5 h-5 text-blue-600 transition group-hover:text-white" />

                            </div>

                            <button
                              type="button"
                              className="text-slate-400 hover:text-blue-600 transition"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>

                          </div>

                          <h3 className="font-bold text-slate-900 mt-4">
                            {project.name}
                          </h3>

                          <p className="text-sm text-slate-500 leading-6 mt-2">
                            {project.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-4">

                            {Array.isArray(
                              project.technologies
                            ) &&
                              project.technologies.map(
                                (
                                  tech,
                                  techIndex
                                ) => (

                                  <span
                                    key={techIndex}
                                    className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md"
                                  >
                                    {tech}
                                  </span>

                                )
                              )}

                          </div>

                        </div>
                      )
                    )
                  ) : (
                    <p className="text-slate-400 text-sm">
                      No projects added yet.
                    </p>
                  )}

                </div>

              </section>

              {/* ================= RESUME ================= */}

              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                <SectionTitle
                  icon={
                    <FileText className="w-5 h-5" />
                  }
                  title="Resume"
                />

                <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">

                  {/* RESUME INFO */}

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">

                      <FileText className="w-6 h-6 text-red-500" />

                    </div>

                    <div className="min-w-0">

                      <h3 className="font-semibold text-slate-900 truncate">

                        {profile.resume
                          ? profile.resume
                              .split("/")
                              .pop()
                          : "No resume uploaded"}

                      </h3>

                      <p className="text-xs text-slate-400 mt-1">

                        {profile.resume
                          ? "PDF Document"
                          : "Upload your resume to apply for jobs"}

                      </p>

                    </div>

                  </div>

                  {/* RESUME ACTIONS */}

                  <div className="flex flex-wrap gap-2">

                    <button
                      type="button"
                      disabled={!profile.resume}
                      onClick={() => {
                        if (profile.resume) {
                          window.open(
                            profile.resume,
                            "_blank"
                          );
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>

                    <button
                      type="button"
                      disabled={!profile.resume}
                      onClick={() => {
                        if (profile.resume) {
                          const link =
                            document.createElement(
                              "a"
                            );

                          link.href =
                            profile.resume;

                          link.download = "";
                          link.target = "_blank";

                          document.body.appendChild(
                            link
                          );

                          link.click();

                          document.body.removeChild(
                            link
                          );
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm shadow-blue-600/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>

                    <button
                      type="button"
                      onClick={handleEditProfile}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 rounded-lg text-sm font-medium transition"
                    >
                      <Upload className="w-4 h-4" />
                      Replace
                    </button>

                  </div>

                </div>

              </section>

            </div>

          </div>

        </div>

      </main>

      {/* ================= EDIT PROFILE MODAL ================= */}

      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">

            {/* ================= MODAL HEADER ================= */}

            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Edit Profile
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Update your professional information
                </p>

              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={saving}
                className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* ================= FORM ================= */}

            <form
              onSubmit={handleSaveProfile}
              className="p-6 space-y-6"
            >

              {/* ================= BASIC INFORMATION ================= */}

              <div>

                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* NAME */}

                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Name
                    </label>

                    <input
                      type="text"
                      value={profile.name}
                      disabled
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-100 text-slate-500"
                    />

                    <p className="text-xs text-slate-400 mt-1">
                      Name comes from your account.
                    </p>

                  </div>

                  {/* EMAIL */}

                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email
                    </label>

                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-100 text-slate-500"
                    />

                  </div>

                  {/* HEADLINE */}

                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Professional Headline
                    </label>

                    <input
                      type="text"
                      name="designation"
                      value={
                        editForm.designation
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="MERN Stack Developer"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />

                  </div>

                  {/* LOCATION */}

                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Location
                    </label>

                    <input
                      type="text"
                      name="location"
                      value={
                        editForm.location
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="Lucknow"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />

                  </div>

                </div>

              </div>

              {/* ================= ABOUT ================= */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1">
                  About Me
                </label>

                <textarea
                  name="about"
                  rows="4"
                  value={editForm.about}
                  onChange={
                    handleInputChange
                  }
                  placeholder="Tell recruiters about yourself..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition"
                />

              </div>

              {/* ================= SKILLS ================= */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Skills
                </label>

                <input
                  type="text"
                  name="skills"
                  value={editForm.skills}
                  onChange={
                    handleInputChange
                  }
                  placeholder="React.js, Node.js, Express.js, MongoDB"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />

                <p className="text-xs text-slate-400 mt-1">
                  Separate skills with commas.
                </p>

              </div>

              {/* ================= EDUCATION ================= */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Education
                </label>

                <textarea
                  name="education"
                  rows="6"
                  value={editForm.education}
                  onChange={
                    handleInputChange
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition"
                />

                <p className="text-xs text-slate-400 mt-1">
                  Example: [{"{"}"degree":"BCA","university":"CSJMU","duration":"2022 - 2025"{"}"}]
                </p>

              </div>

              {/* ================= EXPERIENCE ================= */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Experience
                </label>

                <textarea
                  name="experience"
                  rows="7"
                  value={editForm.experience}
                  onChange={
                    handleInputChange
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition"
                />

                <p className="text-xs text-slate-400 mt-1">
                  Use JSON array format.
                </p>

              </div>

              {/* ================= PROJECTS ================= */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Projects
                </label>

                <textarea
                  name="projects"
                  rows="8"
                  value={editForm.projects}
                  onChange={
                    handleInputChange
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition"
                />

                <p className="text-xs text-slate-400 mt-1">
                  Use JSON array format.
                </p>

              </div>

              {/* ================= SOCIAL LINKS ================= */}

              <div>

                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Social Links
                </h3>

                <div className="space-y-4">

                  <div className="relative">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      name="linkedin"
                      value={editForm.linkedin}
                      onChange={
                        handleInputChange
                      }
                      placeholder="LinkedIn URL"
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>

                  <div className="relative">
                    <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      name="github"
                      value={editForm.github}
                      onChange={
                        handleInputChange
                      }
                      placeholder="GitHub URL"
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>

                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      name="portfolio"
                      value={editForm.portfolio}
                      onChange={
                        handleInputChange
                      }
                      placeholder="Portfolio URL"
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>

                </div>

              </div>

              {/* ================= MESSAGE ================= */}

              {saveMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                  {saveMessage}
                </div>
              )}

              {saveError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {saveError}
                </div>
              )}

              {/* ================= BUTTONS ================= */}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">

                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="px-5 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm shadow-blue-600/20 transition disabled:opacity-50"
                >

                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Profile
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};


// ===============================
// SECTION TITLE
// ===============================

const SectionTitle = ({
  icon,
  title,
}) => {
  return (
    <div className="flex items-center gap-3">

      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
        {icon}
      </div>

      <h2 className="text-xl font-bold text-slate-900">
        {title}
      </h2>

    </div>
  );
};

export default Profile;