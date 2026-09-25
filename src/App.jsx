import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

// Common Components
import Header from "./Components/Header";

// Public Pages
import Home from "./Pages/Home";
import FindJob from "./Pages/FindJob";
import Companies from "./Pages/Companies";
import CompanyDetails from "./Pages/CompanyDetails";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import CareerAdvice from "./Pages/CareerAdvice";
import JobDetails from "./Pages/JobDetails";
import ForgotPassword from "./Pages/ForgotPassword";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsAndConditions from "./Pages/TermsAndConditions";
import HelpsAndSupport from "./Pages/HelpsAndSupport";

// Candidate Layout
import CandidateLayout from "./Pages/Candidate/CandidateLayout";

// Candidate Pages
import CandidateDashboard from "./Pages/Candidate/CandidateDashboard";
import ApplyJob from "./Pages/Candidate/ApplyJob";
import ApplicationDetails from "./Pages/Candidate/ApplicationDetails";
import AppliedJobs from "./Pages/AppliedJobs";
import Profile from "./Pages/Profile";
import SavedJobs from "./Pages/SavedJobs";

// Recruiter Layout
import RecruiterLayout from "./Pages/Recruiter/RecruiterLayout";

// Recruiter Pages
import RecruiterDashboard from "./Pages/Recruiter/RecruiterDashboard";
import Applicants from "./Pages/Recruiter/Applicants";
import ApplicantDetails from "./Pages/Recruiter/ApplicantDetails";

// Recruiter Common Pages
import CompanyProfile from "./Pages/CompanyProfile";
import PostJob from "./Pages/PostJob";
import MyJobs from "./Pages/MyJobs";
import Messages from "./Pages/Messages";
import Settings from "./Pages/Settings";
import Notifications from "./Pages/Notifications";
import ManageApplicants from "./Pages/ManageApplicants";
import HiringAnalytics from "./Pages/HiringAnalytics";
import EditJob from "./Pages/EditJob";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>

          {/* ================= PUBLIC ROUTES ================= */}

          <Route path="/" element={<Home />} />

          <Route path="/jobs" element={<FindJob />} />

          <Route path="/companies" element={<Companies />} />

          <Route
            path="/companies/:id"
            element={<CompanyDetails />}
          />

          <Route
            path="/jobs/:id"
            element={<JobDetails />}
          />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route
            path="/career-advice"
            element={<CareerAdvice />}
          />

          <Route path="/about" element={<About />} />

          <Route path="/contact" element={<Contact />} />

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


          {/* ================= CANDIDATE APPLY ROUTE ================= */}

          <Route
            path="/jobs/:id/apply"
            element={<ApplyJob />}
          />


          {/* ================= CANDIDATE ROUTES ================= */}

          <Route
            path="/candidate"
            element={<CandidateLayout />}
          >

            {/* Candidate Dashboard */}
            <Route
              path="dashboard"
              element={<CandidateDashboard />}
            />

            {/* Candidate Profile */}
            <Route
              path="profile"
              element={<Profile />}
            />

            {/* Saved Jobs */}
            <Route
              path="saved-jobs"
              element={<SavedJobs />}
            />

            {/* Applied Jobs */}
            <Route
              path="applications"
              element={<AppliedJobs />}
            />

            {/* Application Details */}
            <Route
              path="application/:id"
              element={<ApplicationDetails />}
            />

            {/* Notifications */}
            <Route
              path="notifications"
              element={<Notifications />}
            />

            {/* Messages */}
            <Route
              path="messages"
              element={<Messages />}
            />

            {/* Settings */}
            <Route
              path="settings"
              element={<Settings />}
            />

          </Route>


          {/* ================= RECRUITER ROUTES ================= */}

          <Route
            path="/recruiter"
            element={<RecruiterLayout />}
          >

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
              element={<Messages />}
            />

            <Route
              path="settings"
              element={<Settings />}
            />

            <Route
              path="notifications"
              element={<Notifications />}
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

        </Routes>
      </div>
    </Router>
  );
};

export default App;