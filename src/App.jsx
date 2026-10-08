import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// =====================================================
// PUBLIC PAGES
// =====================================================

import Home from "./Pages/Home";
import FindJob from "./Pages/FindJob";
import Companies from "./Pages/Companies";
import CompanyDetails from "./Pages/CompanyDetails";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import CareerAdvice from "./Pages/CareerAdvice";
import CareerAdviceDetails from "./Pages/CareerAdviceDetails";
import JobDetails from "./Pages/JobDetails";
import ForgotPassword from "./Pages/ForgotPassword";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsAndConditions from "./Pages/TermsAndConditions";
import HelpsAndSupport from "./Pages/HelpsAndSupport";

// =====================================================
// CANDIDATE
// =====================================================

import CandidateLayout from "./Pages/Candidate/CandidateLayout";
import CandidateDashboard from "./Pages/Candidate/CandidateDashboard";
import ApplyJob from "./Pages/Candidate/ApplyJob";
import ApplicationDetails from "./Pages/Candidate/ApplicationDetails";

import Profile from "./Pages/Profile";
import SavedJobs from "./Pages/SavedJobs";
import AppliedJobs from "./Pages/AppliedJobs";

import Messages from "./Pages/Candidate/Messages";
import CandidateSettings from "./Pages/Candidate/Settings";
import CandidateNotifications from "./Pages/Candidate/Notifications";

// =====================================================
// RECRUITER
// =====================================================

import RecruiterLayout from "./Pages/Recruiter/RecruiterLayout";
import RecruiterDashboard from "./Pages/Recruiter/RecruiterDashboard";
import Applicants from "./Pages/Recruiter/Applicants";
import ApplicantDetails from "./Pages/Recruiter/ApplicantDetails";
import RecruiterMessages from "./Pages/Recruiter/RecruiterMessage";

import CompanyProfile from "./Pages/CompanyProfile";
import PostJob from "./Pages/PostJob";
import MyJobs from "./Pages/MyJobs";
import ManageApplicants from "./Pages/ManageApplicants";
import HiringAnalytics from "./Pages/HiringAnalytics";
import EditJob from "./Pages/EditJob";

import RecruiterSettings from "./Pages/Recruiter/Settings";
import RecruiterNotifications from "./Pages/Recruiter/Notifications";
import FindCandidates from "./Pages/Recruiter/FindCandidates";

// =====================================================
// SCROLL TO TOP
// =====================================================

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname, search]);

  return null;
};

// =====================================================
// APP
// =====================================================

const App = () => {
  return (
    <Router>
      <ScrollToTop />

      <div className="min-h-screen">
        <Routes>

          {/* =================================================
              PUBLIC ROUTES
          ================================================= */}

          <Route path="/" element={<Home />} />

          <Route path="/jobs" element={<FindJob />} />

          <Route
            path="/companies"
            element={<Companies />}
          />

          <Route
            path="/companies/:id"
            element={<CompanyDetails />}
          />

          <Route
            path="/jobs/:id"
            element={<JobDetails />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* =================================================
              CAREER ADVICE
          ================================================= */}

          {/* Career Advice Listing */}
          <Route
            path="/career-advice"
            element={<CareerAdvice />}
          />

          {/* Career Advice Details */}
          <Route
            path="/career-advice/:id"
            element={<CareerAdviceDetails />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/privacy-policy"
            element={<PrivacyPolicy />}
          />

          <Route
            path="/terms"
            element={<TermsAndConditions />}
          />

          <Route
            path="/help"
            element={<HelpsAndSupport />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          {/* =================================================
              APPLY FOR JOB
          ================================================= */}

          <Route
            path="/apply/:id"
            element={<ApplyJob />}
          />

          <Route
            path="/jobs/:id/apply"
            element={<ApplyJob />}
          />

          {/* =================================================
              CANDIDATE ROUTES
          ================================================= */}

          <Route
            path="/candidate"
            element={<CandidateLayout />}
          >

            <Route
              path="dashboard"
              element={<CandidateDashboard />}
            />

            <Route
              path="profile"
              element={<Profile />}
            />

            <Route
              path="saved-jobs"
              element={<SavedJobs />}
            />

            <Route
              path="applications"
              element={<AppliedJobs />}
            />

            <Route
              path="application/:id"
              element={<ApplicationDetails />}
            />

            <Route
              path="messages"
              element={<Messages />}
            />

            <Route
              path="notifications"
              element={<CandidateNotifications />}
            />

            <Route
              path="settings"
              element={<CandidateSettings />}
            />

          </Route>

          {/* =================================================
              RECRUITER ROUTES
          ================================================= */}

          <Route
            path="/recruiter"
            element={<RecruiterLayout />}
          >

            <Route
  path="find-candidates"
  element={<FindCandidates />}
/>

            <Route
              path="dashboard"
              element={<RecruiterDashboard />}
            />

            <Route
              path="company-profile"
              element={<CompanyProfile />}
            />

            <Route
              path="post-job"
              element={<PostJob />}
            />

            <Route
              path="my-jobs"
              element={<MyJobs />}
            />

            <Route
              path="applicants"
              element={<Applicants />}
            />

            <Route
              path="applicant/:id"
              element={<ApplicantDetails />}
            />

            <Route
              path="messages"
              element={<RecruiterMessages />}
            />

            <Route
              path="notifications"
              element={<RecruiterNotifications />}
            />

            <Route
              path="settings"
              element={<RecruiterSettings />}
            />

            <Route
              path="manage-applicants"
              element={<ManageApplicants />}
            />

            <Route
              path="analytics"
              element={<HiringAnalytics />}
            />

            <Route
              path="edit-job/:id"
              element={<EditJob />}
            />

          </Route>

          {/* =================================================
              404 FALLBACK
          ================================================= */}

          <Route
            path="*"
            element={
              <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                  <h1 className="text-6xl font-extrabold text-blue-600">
                    404
                  </h1>

                  <h2 className="mt-4 text-2xl font-bold text-gray-900">
                    Page Not Found
                  </h2>

                  <p className="mt-2 text-gray-500">
                    The page you are looking for does not exist.
                  </p>

                  <a
                    href="/"
                    className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    Go Home
                  </a>
                </div>
              </div>
            }
          />

        </Routes>
      </div>
    </Router>
  );
};

export default App;