import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  BriefcaseBusiness,
  Users,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "../../Components/Footer";

const RecruiterLayout = () => {
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

      if (!parsedUser?.id || role !== "recruiter") {
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
      path: "/recruiter/dashboard",
    },
    {
      label: "Company Profile",
      icon: Building2,
      path: "/recruiter/company-profile",
    },
    {
      label: "Post a Job",
      icon: PlusCircle,
      path: "/recruiter/post-job",
    },
    {
      label: "Manage Jobs",
      icon: BriefcaseBusiness,
      path: "/recruiter/my-jobs",
    },
    {
      label: "Applicants",
      icon: Users,
      path: "/recruiter/applicants",
    },
    {
      label: "Messages",
      icon: MessageSquare,
      path: "/recruiter/messages",
    },
    {
      label: "Notifications",
      icon: Bell,
      path: "/recruiter/notifications",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/recruiter/settings",
    },
  ];

  const Sidebar = () => (
    <aside className="flex h-full flex-col border-r border-gray-200 bg-white">
      <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6">
        <Link to="/" className="text-2xl font-extrabold text-blue-600">
          Job<span className="text-gray-900">Portal</span>
        </Link>

        <button
          onClick={() => setMobileMenu(false)}
          className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <div className="border-b border-gray-100 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
            {user?.name?.charAt(0)?.toUpperCase() || "R"}
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-gray-900">
              {user?.name || "Recruiter"}
            </p>

            <p className="truncate text-xs text-gray-500">
              Recruiter Account
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;

          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenu(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading recruiter panel...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="fixed bottom-0 left-0 top-0 z-30 hidden w-64 lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {mobileMenu && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileMenu(false)}
          />

          <div className="fixed bottom-0 left-0 top-0 z-50 w-72 lg:hidden">
            <Sidebar />
          </div>
        </>
      )}

      {/* Main Area */}
      <main className="flex min-h-screen flex-1 flex-col lg:ml-64">
        <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenu(true)}
              className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Recruiter Panel
              </h1>

              <p className="hidden text-sm text-gray-500 sm:block">
                Manage your jobs and hiring activities
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/recruiter/notifications")}
              className="rounded-xl p-2.5 text-gray-600 hover:bg-gray-100"
            >
              <Bell size={20} />
            </button>

            <div className="hidden items-center gap-2 border-l border-gray-200 pl-3 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                {user?.name?.charAt(0)?.toUpperCase() || "R"}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {user?.name || "Recruiter"}
                </p>

                <p className="text-xs text-gray-500">Recruiter</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet context={{ user }} />
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default RecruiterLayout;