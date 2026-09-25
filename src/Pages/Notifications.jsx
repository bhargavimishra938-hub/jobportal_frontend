import React, { useEffect, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Briefcase,
  UserPlus,
  MessageCircle,
  Info,
  Clock,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const GET_NOTIFICATIONS_API =
  "http://localhost/job_portal/job-portal-api/api/notifications/get.php";

const MARK_READ_API =
  "http://localhost/job_portal/job-portal-api/api/notifications/mark-read.php";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // =========================
  // GET LOGGED-IN USER
  // =========================
  const getLoggedInUser = () => {
    try {
      const userData = localStorage.getItem("user");

      if (!userData) {
        console.log("No user found in localStorage");
        return null;
      }

      const user = JSON.parse(userData);

      console.log("Logged in user:", user);

      return user;
    } catch (error) {
      console.error("User parsing error:", error);
      return null;
    }
  };

  // =========================
  // GET LOGGED-IN USER ID
  // =========================
  const getUserId = () => {
    const user = getLoggedInUser();

    if (user?.id) {
      return Number(user.id);
    }

    if (user?.userId) {
      return Number(user.userId);
    }

    if (user?.user_id) {
      return Number(user.user_id);
    }

    // Fallback localStorage keys
    const id =
      localStorage.getItem("id") ||
      localStorage.getItem("userId") ||
      localStorage.getItem("user_id");

    return Number(id || 0);
  };

  // =========================
  // FETCH NOTIFICATIONS
  // =========================
  const fetchNotifications = async () => {
    const userId = getUserId();

    console.log("Fetching notifications for User ID:", userId);

    if (!userId) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${GET_NOTIFICATIONS_API}?userId=${userId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      console.log("Notifications Response:", data);

      if (data.success) {
        setNotifications(
          Array.isArray(data.notifications)
            ? data.notifications
            : []
        );

        setUnreadCount(Number(data.unreadCount || 0));
      } else {
        setError(
          data.message || "Failed to load notifications."
        );
      }
    } catch (error) {
      console.error("Fetch notifications error:", error);
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // MARK SINGLE NOTIFICATION AS READ
  // =========================
  const markAsRead = async (notificationId) => {
    console.log("================================");
    console.log("MARK AS READ CLICKED");
    console.log("Notification ID:", notificationId);

    const userId = getUserId();

    console.log("User ID:", userId);

    if (!userId) {
      alert("User ID nahi mila. Please login again.");
      return false;
    }

    if (!notificationId) {
      alert("Notification ID nahi mila.");
      return false;
    }

    try {
      setMarkingId(notificationId);

      const response = await fetch(MARK_READ_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: Number(userId),
          notification_id: Number(notificationId),
        }),
      });

      console.log("HTTP Status:", response.status);

      const data = await response.json();

      console.log("Mark Read Response:", data);

      if (data.success) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) => {
            if (
              Number(notification.id) ===
              Number(notificationId)
            ) {
              return {
                ...notification,
                is_read: 1,
              };
            }

            return notification;
          })
        );

        setUnreadCount((prevCount) =>
          Math.max(0, Number(prevCount) - 1)
        );

        console.log(
          "Notification marked as read successfully"
        );

        return true;
      } else {
        alert(
          data.message ||
            "Notification mark as read nahi ho saki."
        );

        return false;
      }
    } catch (error) {
      console.error("Mark read API error:", error);
      alert(
        "Backend API error. Browser Console check karo."
      );

      return false;
    } finally {
      setMarkingId(null);
    }
  };

  // =========================
  // LOAD ON PAGE OPEN
  // =========================
  useEffect(() => {
    fetchNotifications();
  }, []);

  // =========================
  // NOTIFICATION ICON
  // =========================
  const getNotificationIcon = (type) => {
    switch (type) {
      case "application":
        return <UserPlus size={20} />;

      case "job":
        return <Briefcase size={20} />;

      case "message":
        return <MessageCircle size={20} />;

      default:
        return <Info size={20} />;
    }
  };

  // =========================
  // NOTIFICATION CLICK
  // =========================
  const handleNotificationClick = async (notification) => {
    console.log("Notification clicked:", notification);

    const user = getLoggedInUser();

    if (!user) {
      alert("Please login again.");
      navigate("/login");
      return;
    }

    const role = user?.role;

    console.log("Logged-in role:", role);

    // =========================
    // APPLICATION NOTIFICATION
    // =========================
    if (
      notification.type === "application" &&
      notification.related_id
    ) {
      // Mark as read if unread
      if (Number(notification.is_read) === 0) {
        await markAsRead(notification.id);
      }

      // Candidate
      if (role === "candidate") {
        console.log(
          "Opening candidate application details:",
          notification.related_id
        );

        navigate(
          `/candidate/application/${notification.related_id}`
        );

        return;
      }

      // Recruiter
      if (role === "recruiter") {
        console.log(
          "Opening recruiter applicant details:",
          notification.related_id
        );

        navigate(
          `/recruiter/applicant/${notification.related_id}`
        );

        return;
      }

      console.log(
        "Unknown role for application notification:",
        role
      );

      return;
    }

    // =========================
    // MESSAGE NOTIFICATION
    // =========================
    if (notification.type === "message") {
      if (role === "recruiter") {
        navigate("/recruiter/messages");
        return;
      }

      console.log(
        "Candidate message navigation is not configured yet."
      );

      return;
    }

    // =========================
    // OTHER NOTIFICATIONS
    // =========================
    console.log(
      "No navigation available for this notification"
    );
  };

  // =========================
  // DATE FORMAT
  // =========================
  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }

    const date = new Date(
      String(dateString).replace(" ", "T")
    );

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <Bell size={25} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Notifications
                </h1>

                <p className="text-gray-500 mt-1">
                  Stay updated with your latest activities
                </p>
              </div>
            </div>

            {/* UNREAD COUNT */}
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold w-fit">
              {unreadCount} Unread
            </div>
          </div>
        </div>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-5">
            {error}
          </div>
        )}

        {/* ================= LOADING ================= */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 flex flex-col items-center justify-center">
            <Loader2
              size={35}
              className="text-blue-600 animate-spin mb-3"
            />

            <p className="text-gray-500">
              Loading notifications...
            </p>
          </div>
        ) : notifications.length === 0 ? (

          /* ================= EMPTY ================= */
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell
                size={30}
                className="text-gray-400"
              />
            </div>

            <h2 className="text-xl font-semibold text-gray-800">
              No Notifications
            </h2>

            <p className="text-gray-500 mt-2">
              You don't have any notifications yet.
            </p>
          </div>

        ) : (

          /* ================= LIST ================= */
          <div className="space-y-4">

            {notifications.map((notification) => {
              const isUnread =
                Number(notification.is_read) === 0;

              const isMarking =
                Number(markingId) ===
                Number(notification.id);

              return (
                <div
                  key={notification.id}
                  onClick={() =>
                    handleNotificationClick(notification)
                  }
                  className={`bg-white rounded-2xl border p-5 transition cursor-pointer hover:shadow-md ${
                    isUnread
                      ? "border-blue-200 bg-blue-50/30"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex gap-4">

                    {/* ICON */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isUnread
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {getNotificationIcon(
                        notification.type
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 min-w-0">

                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                        {/* TEXT */}
                        <div className="flex-1">

                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              {notification.title}
                            </h3>

                            {isUnread && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                          </div>

                          <p className="text-gray-600 mt-2 leading-relaxed">
                            {notification.message}
                          </p>

                          <div className="flex items-center gap-2 text-sm text-gray-400 mt-3">
                            <Clock size={15} />

                            <span>
                              {formatDate(
                                notification.created_at
                              )}
                            </span>
                          </div>
                        </div>

                        {/* ACTION */}
                        <div className="flex-shrink-0">

                          {isUnread ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              disabled={isMarking}
                              className="relative z-10 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {isMarking ? (
                                <>
                                  <Loader2
                                    size={16}
                                    className="animate-spin"
                                  />
                                  Marking...
                                </>
                              ) : (
                                <>
                                  <Check size={16} />
                                  Mark as Read
                                </>
                              )}
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                              <CheckCheck size={17} />
                              Read
                            </div>
                          )}

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

