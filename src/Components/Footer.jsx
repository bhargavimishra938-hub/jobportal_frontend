import React from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300">

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                <BriefcaseBusiness size={20} />
              </div>

              <span className="text-xl font-bold text-white">
                Job<span className="text-blue-500">and<span className="text-xl font-bold text-white">Job</span></span> 
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
              Find your dream job and connect with the right companies.
              Build your career with opportunities that match your skills.
            </p>

            {/* Social */}
            <div className="mt-5 flex gap-3">
              <a
                href="#"
                className="rounded-lg bg-gray-800 p-2 hover:bg-blue-600"
              >
                <FaFacebookF size={17} />
              </a>

              <a
                href="#"
                className="rounded-lg bg-gray-800 p-2 hover:bg-blue-600"
              >
                <FaInstagram size={17} />
              </a>

              <a
                href="#"
                className="rounded-lg bg-gray-800 p-2 hover:bg-blue-600"
              >
                <FaLinkedinIn size={17} />
              </a>

              <a
                href="#"
                className="rounded-lg bg-gray-800 p-2 hover:bg-blue-600"
              >
                <FaTwitter size={17} />
              </a>
            </div>
          </div>

          {/* For Candidates */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              For Candidates
            </h3>

            <div className="flex flex-col gap-3 text-sm">
              <Link to="/jobs" className="hover:text-blue-500">
                Find Jobs
              </Link>

              <Link to="/companies" className="hover:text-blue-500">
                Browse Companies
              </Link>

              <Link to="/saved-jobs" className="hover:text-blue-500">
                Saved Jobs
              </Link>

              <Link to="/applications" className="hover:text-blue-500">
                My Applications
              </Link>

              <Link to="/profile" className="hover:text-blue-500">
                My Profile
              </Link>
            </div>
          </div>

         {/* For Employers */}
<div>
  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
    For Employers
  </h3>

  <div className="flex flex-col gap-3 text-sm">
    
    <Link
      to="/recruiter/post-job"
      className="hover:text-blue-500 transition"
    >
      Post a Job
    </Link>

    <Link
      to="/recruiter/dashboard"
      className="hover:text-blue-500 transition"
    >
      Recruiter Dashboard
    </Link>

    <Link
      to="/recruiter/applicants"
      className="hover:text-blue-500 transition"
    >
      Manage Applicants
    </Link>

    <Link
      to="/recruiter/analytics"
      className="hover:text-blue-500 transition"
    >
      Hiring Analytics
    </Link>

  </div>
</div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>

            <div className="flex flex-col gap-3 text-sm">
              <Link to="/about" className="hover:text-blue-500">
                About Us
              </Link>

              <Link to="/contact" className="hover:text-blue-500">
                Contact Us
              </Link>

              <Link to="/privacy-policy" className="hover:text-blue-500">
                Privacy Policy
              </Link>

              <Link to="/terms" className="hover:text-blue-500">
                Terms & Conditions
              </Link>

              <Link to="/help" className="hover:text-blue-500">
                Help & Support
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-sm text-gray-500 sm:flex-row sm:px-6 lg:px-8">

          <p>
            © {new Date().getFullYear()} JobPortal. All rights reserved.
          </p>

          <p>
            Built for candidates and recruiters.
          </p>

        </div>
      </div>

    </footer>
  );
};

export default Footer;