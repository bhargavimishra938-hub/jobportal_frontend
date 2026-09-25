import React, { useState } from "react";
import {
  User,
  Bell,
  Lock,
  ShieldCheck,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  Settings as SettingsIcon,
} from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");

  const [account, setAccount] = useState({
    emailNotifications: true,
    jobAlerts: true,
    applicationUpdates: true,
    profileVisibility: true,
  });

  const [password, setPassword] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    {
      id: "account",
      label: "Account Settings",
      icon: User,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "privacy",
      label: "Privacy & Security",
      icon: ShieldCheck,
    },
  ];

  const handleToggle = (field) => {
    setAccount((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlePasswordChange = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (
      !password.current ||
      !password.newPassword ||
      !password.confirm
    ) {
      alert("Please fill all password fields.");
      return;
    }

    if (password.newPassword !== password.confirm) {
      alert("New password and confirm password do not match.");
      return;
    }

    alert("Password validation successful. Connect your API here.");

    setPassword({
      current: "",
      newPassword: "",
      confirm: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
            <SettingsIcon size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Settings
            </h1>

            <p className="text-sm text-gray-500">
              Manage your account and preferences
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar Tabs */}
        <div className="h-fit rounded-xl border bg-white p-3 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Account Settings */}
          {activeTab === "account" && (
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-lg font-semibold text-gray-800">
                Account Settings
              </h2>

              <p className="mb-6 text-sm text-gray-500">
                Manage your account preferences.
              </p>

              <div className="space-y-5">
                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <Mail className="text-blue-600" size={22} />

                  <div>
                    <h3 className="font-medium text-gray-800">
                      Email Address
                    </h3>

                    <p className="text-sm text-gray-500">
                      Your registered email address
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <Smartphone className="text-blue-600" size={22} />

                  <div>
                    <h3 className="font-medium text-gray-800">
                      Mobile Number
                    </h3>

                    <p className="text-sm text-gray-500">
                      Manage your registered mobile number
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-lg font-semibold text-gray-800">
                Notification Settings
              </h2>

              <p className="mb-6 text-sm text-gray-500">
                Choose which notifications you want to receive.
              </p>

              <div className="space-y-5">
                {[
                  {
                    field: "emailNotifications",
                    title: "Email Notifications",
                    description: "Receive important updates through email.",
                  },
                  {
                    field: "jobAlerts",
                    title: "Job Alerts",
                    description: "Get notified about matching job openings.",
                  },
                  {
                    field: "applicationUpdates",
                    title: "Application Updates",
                    description: "Receive updates about your applications.",
                  },
                ].map((item) => (
                  <div
                    key={item.field}
                    className="flex items-center justify-between gap-4 border-b pb-4"
                  >
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {item.title}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleToggle(item.field)}
                      className={`relative h-6 w-11 rounded-full transition ${
                        account[item.field]
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                          account[item.field]
                            ? "left-6"
                            : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => alert("Notification preferences saved")}
                className="mt-6 flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Save size={17} />
                Save Preferences
              </button>
            </div>
          )}

          {/* Privacy & Security */}
          {activeTab === "privacy" && (
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-lg font-semibold text-gray-800">
                Privacy & Security
              </h2>

              <p className="mb-6 text-sm text-gray-500">
                Manage your privacy and account password.
              </p>

              {/* Profile Visibility */}
              <div className="mb-6 flex items-center justify-between gap-4 border-b pb-5">
                <div className="flex items-center gap-3">
                  <Eye className="text-blue-600" size={21} />

                  <div>
                    <h3 className="font-medium text-gray-800">
                      Profile Visibility
                    </h3>

                    <p className="text-sm text-gray-500">
                      Allow recruiters to view your profile.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggle("profileVisibility")}
                  className={`relative h-6 w-11 rounded-full ${
                    account.profileVisibility
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white ${
                      account.profileVisibility
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Change Password */}
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-800">
                <Lock size={19} />
                Change Password
              </h3>

              <form
                onSubmit={handlePasswordSubmit}
                className="space-y-4"
              >
                <input
                  type={showPassword ? "text" : "password"}
                  name="current"
                  value={password.current}
                  onChange={handlePasswordChange}
                  placeholder="Current Password"
                  className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-blue-500"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={password.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="New Password"
                  className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-blue-500"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="confirm"
                  value={password.confirm}
                  onChange={handlePasswordChange}
                  placeholder="Confirm New Password"
                  className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}

                  {showPassword ? "Hide Password" : "Show Password"}
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Lock size={17} />
                  Update Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;