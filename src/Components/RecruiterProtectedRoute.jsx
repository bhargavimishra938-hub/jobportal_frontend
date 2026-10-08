import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const RecruiterProtectedRoute = ({ children }) => {
  const location = useLocation();

  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkRecruiterAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedLoginStatus =
          localStorage.getItem("isLoggedIn") === "true";

        // ================= NOT LOGGED IN =================
        if (!storedUser || !storedLoginStatus) {
          setAllowed(false);
          setChecking(false);
          return;
        }

        let user;

        try {
          user = JSON.parse(storedUser);
        } catch (error) {
          console.error(
            "Invalid user data:",
            error
          );

          clearRecruiterSession();

          setAllowed(false);
          setChecking(false);
          return;
        }

        // ================= CHECK ROLE =================
        const role = String(user?.role || "")
          .toLowerCase()
          .trim();

        if (!user?.id || role !== "recruiter") {
          clearRecruiterSession();

          setAllowed(false);
          setChecking(false);
          return;
        }

        // ================= REFRESH DETECTION =================
        const navigationEntries =
          performance.getEntriesByType("navigation");

        const navigation =
          navigationEntries?.[0];

        const isBrowserRefresh =
          navigation?.type === "reload";

        if (isBrowserRefresh) {
          console.log(
            "Recruiter browser refresh detected. Logging out..."
          );

          clearRecruiterSession();

          setAllowed(false);
          setChecking(false);

          return;
        }

        // ================= AUTHORIZED =================
        setAllowed(true);
        setChecking(false);
      } catch (error) {
        console.error(
          "Recruiter auth error:",
          error
        );

        clearRecruiterSession();

        setAllowed(false);
        setChecking(false);
      }
    };

    checkRecruiterAuth();
  }, []);

  // ================= CLEAR SESSION =================
  const clearRecruiterSession = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");

    localStorage.removeItem("id");
    localStorage.removeItem("userId");
    localStorage.removeItem("user_id");

    localStorage.removeItem("loginUpdated");

    sessionStorage.removeItem(
      "recruiterSession"
    );
  };

  // ================= LOADING =================
  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">

          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="text-sm text-gray-500">
            Checking authentication...
          </p>

        </div>
      </div>
    );
  }

  // ================= NOT AUTHORIZED =================
  if (!allowed) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname,
        }}
        replace
      />
    );
  }

  // ================= AUTHORIZED =================
  return children;
};

export default RecruiterProtectedRoute;