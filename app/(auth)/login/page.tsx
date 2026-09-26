"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      await login(cleanEmail, password);

      // Successful login
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Invalid email or password.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#090f1d] text-cloud">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-[420px]">
          {/* Brand */}
          <div className="mb-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber text-xl text-ink shadow-lg">
                ☁
              </span>

              <span className="font-display text-lg font-bold text-cloud">
                {process.env.NEXT_PUBLIC_APP_NAME ||
                  "WeatherSphere Pro"}
              </span>
            </Link>
          </div>

          {/* Card */}
          <section className="rounded-3xl border border-white/10 bg-[#121b31]/95 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
            <div className="mb-6">
              <h1 className="font-display text-2xl font-bold text-cloud sm:text-3xl">
                Welcome back
              </h1>

              <p className="mt-1.5 text-sm text-slate">
                Sign in to your dashboard.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-medium text-slate"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  className="
                    w-full rounded-xl border border-white/10
                    bg-[#0b1222] px-4 py-3
                    text-sm text-cloud
                    outline-none transition
                    placeholder:text-slate/50
                    focus:border-amber/70
                    focus:ring-2 focus:ring-amber/10
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium text-slate"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-[11px] text-amber hover:text-amber/80"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    className="
                      w-full rounded-xl border border-white/10
                      bg-[#0b1222] px-4 py-3 pr-12
                      text-sm text-cloud
                      outline-none transition
                      placeholder:text-slate/50
                      focus:border-amber/70
                      focus:ring-2 focus:ring-amber/10
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="
                      absolute right-3 top-1/2
                      -translate-y-1/2
                      rounded-lg p-1.5
                      text-slate transition
                      hover:bg-white/5
                      hover:text-cloud
                      disabled:opacity-50
                    "
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="
                    rounded-xl border border-red-500/20
                    bg-red-500/10 px-3 py-2.5
                    text-xs leading-5 text-red-400
                  "
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  mt-1 flex w-full items-center
                  justify-center rounded-xl
                  bg-amber px-4 py-3
                  text-sm font-semibold text-ink
                  shadow-lg shadow-amber/10
                  transition
                  hover:bg-amber/90
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span
                      className="
                        h-4 w-4 animate-spin rounded-full
                        border-2 border-ink/30
                        border-t-ink
                      "
                    />
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* Signup */}
            <p className="mt-6 text-center text-xs text-slate">
              No account?{" "}
              <Link
                href="/signup"
                className="font-medium text-amber hover:text-amber/80"
              >
                Sign up
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}