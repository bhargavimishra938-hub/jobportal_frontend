import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  UserRound,
  Search,
  Bookmark,
  BriefcaseBusiness,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

const CandidateLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        navigate("/login");
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      const role = String(parsedUser?.role || "")
        .toLowerCase()
        .trim();

      if (!parsedUser?.id || role !== "candidate") {
        navigate("/login");
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      console.error("User Error:", error);
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("id");
    localStorage.removeItem("userId");
    localStorage.removeItem("user_id");

    navigate("/login");
  };

  const sidebarItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/candidate/dashboard",
    },
    {
      label: "My Profile",
      icon: UserRound,
      path: "/candidate/profile",
    },
    {
      label: "Find Jobs",
      icon: Search,
      path: "/jobs",
    },
    {
      label: "Saved Jobs",
      icon: Bookmark,
      path: "/candidate/saved-jobs",
    },
    {
      label: "My Applications",
      icon: BriefcaseBusiness,
      path: "/candidate/applications",
    },
    {
      label: "Messages",
      icon: MessageSquare,
      path: "/candidate/messages",
    },
    {
      label: "Notifications",
      icon: Bell,
      path: "/candidate/notifications",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/candidate/settings",
    },
  ];

  const Sidebar = () => (
    <aside className="flex h-full flex-col bg-white">
      {/* USER MINI PROFILE */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-base font-bold text-white shadow-sm">
          {user?.name?.charAt(0)?.toUpperCase() || "C"}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">
            {user?.name || "Candidate"}
          </p>
          <p className="text-xs text-slate-400">
            Candidate account
          </p>
        </div>
      </div>

      <p className="px-5 pb-2 pt-5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        Menu
      </p>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-3">
        {sidebarItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            location.pathname === item.path ||
            (item.path === "/jobs" &&
              location.pathname.startsWith("/jobs"));

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenu(false)}
              className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:translate-x-0.5 hover:bg-slate-50 hover:text-blue-600"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-blue-600" />
              )}

              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                }`}
              >
                <Icon size={16} />
              </span>

              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <LogOut size={16} />
          </span>
          Logout
        </button>
      </div>
    </aside>
  );

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading candidate panel...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* TOP HEADER (shared site navbar) */}
      <Header />

      {/* Mobile menu toggle for the candidate sidebar (site Header has no sidebar toggle) */}
      <div className="flex items-center border-b border-slate-200 bg-white px-4 py-2 sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileMenu(true)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          <Menu size={20} />
          Menu
        </button>
      </div>

      {/* SIDEBAR + CONTENT */}
      <div className="flex flex-1">
        {/* DESKTOP SIDEBAR */}
        <div className="hidden w-64 shrink-0 border-r border-slate-200 bg-white shadow-sm lg:block">
          <div className="sticky top-[72px] flex h-[calc(100vh-72px)] flex-col">
            <Sidebar />
          </div>
        </div>

        {/* MOBILE SIDEBAR */}
        {mobileMenu && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setMobileMenu(false)}
            />

            <div className="fixed bottom-0 left-0 top-0 z-50 w-72 bg-white lg:hidden">
              <div className="flex items-center justify-between border-b border-slate-100 p-4">
                <Link
                  to="/"
                  className="text-xl font-extrabold text-blue-600"
                >
                  Job<span className="text-slate-900">Portal</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileMenu(false)}
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="h-[calc(100vh-73px)]">
                <Sidebar />
              </div>
            </div>
          </>
        )}

        {/* MAIN CONTENT */}
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="w-full flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet context={{ user }} />
          </main>
        </div>
      </div>

      {/* FOOTER - FULL WIDTH, BELOW HEADER + SIDEBAR/CONTENT */}
      <Footer />
    </div>
  );
};

export default CandidateLayout;