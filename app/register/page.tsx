"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      setIsSubmitting(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "An error occurred during registration");
        return;
      }

      if (data.success) {
        router.push("/login");
      }
    } catch (error) {
      console.log(error, "Error during registration");
      setError("An error occurred during registration");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10">
      <section className="grid w-full overflow-hidden rounded-3xl border border-orange-200/70 bg-card shadow-[0_20px_60px_-35px_rgba(106,57,27,0.45)] lg:grid-cols-[1fr_1.05fr]">
        <div className="p-6 sm:p-10">
          <div className="mx-auto max-w-md">
            <h1 className="text-3xl font-bold text-stone-900">Create account</h1>
            <p className="mt-2 text-sm text-muted">Start publishing your video projects with Vertix.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <label className="block space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-stone-600">Email</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2.5 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-ring/50"
                  required
                />
              </label>
              <label className="block space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-stone-600">Password</span>
                <input
                  type="password"
                  placeholder="Choose a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2.5 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-ring/50"
                  required
                />
              </label>
              <label className="block space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-stone-600">Confirm password</span>
                <input
                  type="password"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2.5 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-ring/50"
                  required
                />
              </label>

              {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-brand to-brand-2 px-4 py-2.5 font-semibold text-white transition hover:brightness-105 disabled:opacity-70"
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>
            </form>

            <p className="mt-6 text-sm text-stone-700">
              Already have an account? {" "}
              <Link href="/login" className="font-semibold text-orange-700 hover:text-orange-900">
                Login
              </Link>
            </p>
          </div>
        </div>

        <div className="relative hidden p-10 lg:block">
          <div className="absolute inset-0 bg-gradient-to-tl from-amber-100/90 via-orange-50 to-rose-100/80" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-orange-300 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
                Creator Workspace
              </p>
              <h2 className="max-w-sm text-4xl font-bold leading-tight text-stone-900">
                Build your own living video library.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-700">
                Organize thumbnails, improve discoverability, and keep your media pipeline elegant from day one.
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/70 p-4 text-sm text-stone-700 backdrop-blur">
              Secure authentication and optimized uploads are already included.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default RegisterPage;
