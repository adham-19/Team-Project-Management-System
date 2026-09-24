import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

import { registerUser } from "../services/user.service";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    username: "",
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
    const {
      firstName,
      secondName,
      username,
      email,
      password,
    } = formData;

    if (
      !firstName.trim() ||
      !secondName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password
    ) {
      return "All fields are required";
    }

    if (firstName.trim().length < 2) {
      return "First name must be at least 2 characters";
    }

    if (secondName.trim().length < 2) {
      return "Second name must be at least 2 characters";
    }

    if (username.trim().length < 2) {
      return "Username must be at least 2 characters";
    }

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(email.trim())) {
      return "Please enter a valid email address";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }

    return "";
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setFormError("");

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser({
        firstName: formData.firstName.trim(),
        secondName: formData.secondName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate("/login");
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
              <UserPlus className="h-6 w-6" />
            </div>

            <h1 className="text-2xl font-bold text-text-main">
              Create your account
            </h1>

            <p className="mt-1 text-sm text-text-secondary">
              Join the team and start managing your projects
            </p>
          </div>

          {/* REGISTER CARD */}
          <section className="rounded-2xl border border-border-light bg-surface p-6 shadow-sm sm:p-8">
            {formError && (
              <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <p className="text-xs font-medium leading-relaxed text-error">
                  {formError}
                </p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* FIRST NAME */}
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-1.5 block text-xs font-semibold text-text-main"
                >
                  First Name <span className="text-primary">*</span>
                </label>

                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  autoComplete="given-name"
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-border-light bg-main-bg px-4 py-2.5 text-sm text-text-main placeholder:text-text-secondary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* SECOND NAME */}
              <div>
                <label
                  htmlFor="secondName"
                  className="mb-1.5 block text-xs font-semibold text-text-main"
                >
                  Second Name <span className="text-primary">*</span>
                </label>

                <input
                  id="secondName"
                  type="text"
                  name="secondName"
                  value={formData.secondName}
                  onChange={handleInputChange}
                  placeholder="Enter your second name"
                  autoComplete="family-name"
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-border-light bg-main-bg px-4 py-2.5 text-sm text-text-main placeholder:text-text-secondary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* USERNAME */}
              <div>
                <label
                  htmlFor="username"
                  className="mb-1.5 block text-xs font-semibold text-text-main"
                >
                  Username <span className="text-primary">*</span>
                </label>

                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Choose a username"
                  autoComplete="username"
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-border-light bg-main-bg px-4 py-2.5 text-sm text-text-main placeholder:text-text-secondary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

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
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-semibold text-text-main"
                >
                  Password <span className="text-primary">*</span>
                </label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-border-light bg-main-bg px-4 py-2.5 text-sm text-text-main placeholder:text-text-secondary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-1.5 text-xs text-text-secondary">
                  Password must be at least 8 characters.
                </p>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Registering..." : "Create Account"}
              </button>
            </form>

            {/* LOGIN LINK */}
            <div className="mt-6 border-t border-border-light pt-5 text-center">
              <p className="text-sm text-text-secondary">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-primary transition-colors hover:text-primary-dark"
                >
                  Login
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}