import { useState } from "react";
import { registerUser } from "../services/authService";

function Register({ onLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      setSuccess("Account created successfully. You can now sign in.");

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080C18] text-[#F8FAFC]">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-5 py-8 sm:px-8 lg:px-10">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_440px] lg:gap-20">
          {/* LEFT SIDE */}
          <section className="hidden lg:block">
            <div className="max-w-xl">
              {/* Brand */}
              <div className="mb-12 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#6366F1]/30 bg-[#6366F1]/10">
                  <span className="text-sm font-bold text-[#818CF8]">
                    RA
                  </span>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#F8FAFC]">
                    Resume Analyzer
                  </p>

                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-[#64748B]">
                    Career intelligence
                  </p>
                </div>
              </div>

              {/* Intro */}
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#10B981]">
                  Start stronger
                </span>
              </div>

              <h1 className="mt-5 max-w-2xl text-5xl font-semibold leading-[1.05] tracking-[-0.045em] text-[#F8FAFC] xl:text-6xl">
                Build a clearer picture of your career profile.
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-[#94A3B8]">
                Create your workspace to understand your resume, discover
                important skills, and identify opportunities to improve.
              </p>

              {/* Process */}
              <div className="mt-12 max-w-xl overflow-hidden rounded-xl border border-white/[0.08] bg-[#121827]">
                <div className="grid grid-cols-3">
                  <div className="border-r border-white/[0.08] p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                      Phase
                    </p>

                    <p className="mt-3 text-2xl font-semibold text-[#6366F1]">
                      01
                    </p>

                    <p className="mt-1 text-xs text-[#94A3B8]">
                      Create
                    </p>
                  </div>

                  <div className="border-r border-white/[0.08] p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                      Phase
                    </p>

                    <p className="mt-3 text-2xl font-semibold text-[#F8FAFC]">
                      02
                    </p>

                    <p className="mt-1 text-xs text-[#94A3B8]">
                      Analyze
                    </p>
                  </div>

                  <div className="p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                      Phase
                    </p>

                    <p className="mt-3 text-2xl font-semibold text-[#10B981]">
                      03
                    </p>

                    <p className="mt-1 text-xs text-[#94A3B8]">
                      Improve
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* REGISTER CARD */}
          <section className="w-full">
            <div className="rounded-2xl border border-white/[0.08] bg-[#121827] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-8">
              {/* Mobile Brand */}
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#6366F1]/30 bg-[#6366F1]/10">
                  <span className="text-sm font-bold text-[#818CF8]">
                    RA
                  </span>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#F8FAFC]">
                    Resume Analyzer
                  </p>

                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#64748B]">
                    Career intelligence
                  </p>
                </div>
              </div>

              {/* Heading */}
              <div>
                <div className="mb-5 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#6366F1]" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#818CF8]">
                    Get started
                  </span>
                </div>

                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#F8FAFC]">
                  Create your account
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
                  Set up your personal resume analysis workspace.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2.5 block text-xs font-semibold uppercase tracking-[0.08em] text-[#CBD5E1]"
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    placeholder="Your name"
                    className="w-full rounded-lg border border-white/[0.08] bg-[#0D1220] px-4 py-3.5 text-sm text-[#F8FAFC] outline-none transition duration-200 placeholder:text-[#475569] hover:border-white/[0.14] focus:border-[#6366F1]/60 focus:ring-4 focus:ring-[#6366F1]/10"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="register-email"
                    className="mb-2.5 block text-xs font-semibold uppercase tracking-[0.08em] text-[#CBD5E1]"
                  >
                    Email address
                  </label>

                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-white/[0.08] bg-[#0D1220] px-4 py-3.5 text-sm text-[#F8FAFC] outline-none transition duration-200 placeholder:text-[#475569] hover:border-white/[0.14] focus:border-[#6366F1]/60 focus:ring-4 focus:ring-[#6366F1]/10"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="register-password"
                    className="mb-2.5 block text-xs font-semibold uppercase tracking-[0.08em] text-[#CBD5E1]"
                  >
                    Password
                  </label>

                  <input
                    id="register-password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    className="w-full rounded-lg border border-white/[0.08] bg-[#0D1220] px-4 py-3.5 text-sm text-[#F8FAFC] outline-none transition duration-200 placeholder:text-[#475569] hover:border-white/[0.14] focus:border-[#6366F1]/60 focus:ring-4 focus:ring-[#6366F1]/10"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="mb-2.5 block text-xs font-semibold uppercase tracking-[0.08em] text-[#CBD5E1]"
                  >
                    Confirm password
                  </label>

                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    className="w-full rounded-lg border border-white/[0.08] bg-[#0D1220] px-4 py-3.5 text-sm text-[#F8FAFC] outline-none transition duration-200 placeholder:text-[#475569] hover:border-white/[0.14] hover:bg-[#0D1220] focus:border-[#6366F1]/60 focus:ring-4 focus:ring-[#6366F1]/10"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-3 rounded-lg border border-[#EF4444]/20 bg-[#EF4444]/[0.06] px-4 py-3.5">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EF4444]/10 text-[11px] font-bold text-[#EF4444]">
                      !
                    </div>

                    <p className="text-sm leading-5 text-[#FCA5A5]">
                      {error}
                    </p>
                  </div>
                )}

                {/* Success */}
                {success && (
                  <div className="flex items-start gap-3 rounded-lg border border-[#10B981]/20 bg-[#10B981]/[0.06] px-4 py-3.5">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#10B981]/10 text-[11px] font-bold text-[#10B981]">
                      ✓
                    </div>

                    <p className="text-sm leading-5 text-[#34D399]">
                      {success}
                    </p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center rounded-lg bg-[#6366F1] px-5 py-3.5 text-sm font-semibold text-white transition duration-200 hover:bg-[#818CF8] focus:outline-none focus:ring-4 focus:ring-[#6366F1]/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </form>

              {/* Login */}
              <div className="mt-8 border-t border-white/[0.08] pt-6 text-center">
                <p className="text-sm text-[#64748B]">
                  Already have an account?
                </p>

                <button
                  type="button"
                  onClick={onLogin}
                  className="mt-2 text-sm font-semibold text-[#818CF8] transition hover:text-[#A5B4FC]"
                >
                  Sign in instead
                </button>
              </div>

              {/* Footer */}
              <div className="mt-6 flex items-center justify-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />

                <p className="text-[10px] uppercase tracking-[0.12em] text-[#64748B]">
                  Secure account creation
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Register;