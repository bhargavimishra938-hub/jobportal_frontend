
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showToast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      background: "#ffffff",
      color: "#1f2937",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      showToast("warning", "Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost/job_portal/job-portal-api/api/auth/login.php",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      console.log("Login Response:", response.data);

      if (response.data.success) {
        const user = response.data.user;

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");

        if (user.id) {
          localStorage.setItem("id", String(user.id));
          localStorage.setItem("userId", String(user.id));
          localStorage.setItem("user_id", String(user.id));
        }

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("rememberedEmail");
        }

        localStorage.setItem(
          "loginUpdated",
          Date.now().toString()
        );

        showToast(
          "success",
          `Sign in successful! Welcome ${user.name || ""}`
        );

        setTimeout(() => {
          const role = String(user.role || "")
            .toLowerCase()
            .trim();

          if (role === "recruiter") {
            navigate("/recruiter/dashboard");
          } else if (role === "candidate") {
            navigate("/candidate/dashboard");
          } else {
            navigate("/");
          }
        }, 1200);
      } else {
        const message = String(response.data.message || "")
          .toLowerCase();

        if (
          message.includes("account not found") ||
          message.includes("register first")
        ) {
          navigate("/register");
          return;
        }

        showToast(
          "error",
          response.data.message || "Invalid email or password."
        );
      }
    } catch (error) {
      console.error("Login Error:", error);

      showToast(
        "error",
        error.response?.data?.message ||
          "Unable to connect with the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* HEADER */}

      <Header />

      {/* MAIN CONTENT */}

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:p-8">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Welcome Back
              </h1>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Login to your Job Portal account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* EMAIL */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* PASSWORD */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* REMEMBER ME */}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />

                  Remember Me
                </label>

                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* REGISTER */}

            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-semibold text-blue-600 hover:underline"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}

      <Footer />
    </div>
  );
};

export default Login;