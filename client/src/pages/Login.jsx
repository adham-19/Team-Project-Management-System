import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

import { login } from "../services/user.service";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim() || !formData.password) {
      return "Email and password are required";
    }

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(formData.email.trim())) {
      return "Please enter a valid email address";
    }

    return "";
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setFormError("");

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      const { user, token } = res.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/");
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Something went wrong",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-main-bg px-4 py-8 sm:px-6">
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="w-full max-w-md">
          {/* BRAND / HEADER */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
              <LogIn className="h-6 w-6" />
            </div>

            <h1 className="text-2xl font-bold text-text-main">
              Welcome back
            </h1>

            <p className="mt-1 text-sm text-text-secondary">
              Login to continue managing your projects
            </p>
          </div>

          {/* LOGIN CARD */}
          <section className="rounded-2xl border border-border-light bg-surface p-6 shadow-sm sm:p-8">
            {formError && (
              <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <p className="text-xs font-medium leading-relaxed text-error">
                  {formError}
                </p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-semibold text-text-main"
                >
                  Email <span className="text-primary">*</span>
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-border-light bg-main-bg px-4 py-2.5 text-sm text-text-main placeholder:text-text-secondary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-text-main"
                  >
                    Password <span className="text-primary">*</span>
                  </label>
                </div>

                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-border-light bg-main-bg px-4 py-2.5 text-sm text-text-main placeholder:text-text-secondary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* REGISTER LINK */}
            <div className="mt-6 border-t border-border-light pt-5 text-center">
              <p className="text-sm text-text-secondary">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-primary transition-colors hover:text-primary-dark"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}