'use client'

import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const LoginPage = () => {
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect : false
            })

            if(res?.error){
                setError("Invalid email or password")
            } else {
                router.push('/')
            }
        } catch (error) {
            console.log(error)
            setError("Login failed. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }
  return (
        <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10">
            <section className="grid w-full overflow-hidden rounded-3xl border border-orange-200/70 bg-card shadow-[0_20px_60px_-35px_rgba(106,57,27,0.45)] lg:grid-cols-[1.1fr_1fr]">
                <div className="relative hidden p-10 lg:block">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-100/90 via-amber-50 to-rose-100/80" />
                    <div className="relative z-10 flex h-full flex-col justify-between">
                        <div>
                            <p className="mb-4 inline-flex rounded-full border border-orange-300 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
                                Vertix Studio
                            </p>
                            <h1 className="max-w-sm text-4xl font-bold leading-tight text-stone-900">
                                Publish cinematic stories in minutes.
                            </h1>
                            <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-700">
                                Upload, manage, and share your video catalog from one beautifully simple workspace.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/70 bg-white/70 p-4 text-sm text-stone-700 backdrop-blur">
                            Fast uploads, secure auth, and instant playback previews.
                        </div>
                    </div>
                </div>

                <div className="p-6 sm:p-10">
                    <div className="mx-auto max-w-md">
                        <h2 className="text-3xl font-bold text-stone-900">Welcome back</h2>
                        <p className="mt-2 text-sm text-muted">Sign in to continue managing your videos.</p>

                        <form onSubmit={handleLogin} className="mt-8 space-y-4">
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
                                    placeholder="Your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                                {isSubmitting ? "Logging in..." : "Login"}
                            </button>
                        </form>

                        <p className="mt-6 text-sm text-stone-700">
                            Don&apos;t have an account? {" "}
                            <Link href="/register" className="font-semibold text-orange-700 hover:text-orange-900">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </main>
  )
}

export default LoginPage