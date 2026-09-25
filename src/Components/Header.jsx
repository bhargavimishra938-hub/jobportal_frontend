
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  Heart,
  BriefcaseBusiness,
  ChevronRight,
} from "lucide-react";

const Header = () => {
  const [mobileMenu, setMobileMenu] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Find Jobs", path: "/jobs" },
    { name: "Companies", path: "/companies" },
    { name: "Career Advice", path: "/career-advice" },
  ];

  const isActive = (path) => location.pathname === path;

  const closeMobileMenu = () => {
    setMobileMenu(false);
  };

 const handlePostJob = () => {
  closeMobileMenu();

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch (error) {
    console.error("User parse error:", error);
    user = null;
  }

  const token = localStorage.getItem("token");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // Login check
  if (!user || !token || isLoggedIn !== "true") {
    alert("Please login as a recruiter to post a job.");
    navigate("/login");
    return;
  }

  // Recruiter role check
  const role = String(user.role || "").toLowerCase().trim();

  if (role !== "recruiter") {
    alert("Only recruiters can post jobs.");
    return;
  }

  // Recruiter ko Post Job page par bhejna
  navigate("/recruiter/post-job");
};

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ================= LOGO ================= */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20 transition duration-300 group-hover:scale-105 group-hover:bg-blue-700">
            <BriefcaseBusiness size={21} strokeWidth={2.3} />
          </div>

          <span className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
            Job<span className="text-blue-600">Portal</span>
          </span>
        </Link>

        {/* ================= DESKTOP NAVIGATION ================= */}
        <nav className="hidden items-center gap-5 min-[900px]:flex min-[1100px]:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative whitespace-nowrap px-1 py-6 text-sm font-semibold transition-all duration-200 ${
                isActive(link.path)
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {link.name}

              {isActive(link.path) && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-blue-600" />
              )}
            </Link>
          ))}
        </nav>

        {/* ================= DESKTOP ACTIONS ================= */}
        <div className="hidden items-center gap-2 min-[900px]:flex min-[1100px]:gap-3">

          {/* Saved Jobs */}
          <Link
            to="/saved-jobs"
            className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
              isActive("/saved-jobs")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
            }`}
          >
            <Heart
              size={17}
              strokeWidth={2}
              className={isActive("/saved-jobs") ? "fill-blue-100" : ""}
            />
            <span className="hidden min-[1100px]:inline">
              Saved Jobs
            </span>
          </Link>

          {/* Login */}
          <Link
            to="/login"
            className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all duration-200 min-[1100px]:px-4 ${
              isActive("/login")
                ? "border-blue-600 bg-blue-50 text-blue-600"
                : "border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600"
            }`}
          >
            <User size={17} strokeWidth={2} />
            Login
          </Link>

          {/* Post a Job */}
          <button
            type="button"
            onClick={handlePostJob}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg min-[1100px]:px-5"
          >
            Post a Job
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* ================= MOBILE MENU BUTTON ================= */}
        <button
          type="button"
          onClick={() => setMobileMenu((prev) => !prev)}
          className="rounded-xl border border-gray-200 p-2.5 text-gray-700 transition hover:bg-gray-100 min-[900px]:hidden"
          aria-label={mobileMenu ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenu}
        >
          {mobileMenu ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenu && (
        <div className="border-t border-gray-100 bg-white shadow-lg min-[900px]:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">

            <nav className="flex flex-col gap-1">

              {/* Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                    isActive(link.path)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <ChevronRight size={17} />
                  )}
                </Link>
              ))}

              {/* Saved Jobs */}
              <Link
                to="/saved-jobs"
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                  isActive("/saved-jobs")
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                <Heart size={18} />
                Saved Jobs
              </Link>

              {/* Divider */}
              <div className="my-3 border-t border-gray-200" />

              {/* Login */}
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3.5 text-sm font-semibold transition ${
                  isActive("/login")
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600"
                }`}
              >
                <User size={18} />
                Login
              </Link>

              {/* Post a Job */}
              <button
                type="button"
                onClick={handlePostJob}
                className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Post a Job
                <ChevronRight size={17} />
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;