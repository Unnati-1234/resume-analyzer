import { useState } from 'react'
import { loginUser } from '../services/authService'
import { useAuth } from '../context/AuthContext.jsx'

function Login({ onRegister }) {
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')

    if (!formData.email.trim() || !formData.password) {
      setError('Please enter your email and password.')
      return
    }

    try {
      setLoading(true)

      const data = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      })

      if (!data.token) {
        throw new Error('Login succeeded but no authentication token was returned.')
      }

      login(data.token)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0d2024] text-[#edf5f2]">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10 sm:px-8 lg:px-12">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[1fr_440px] lg:gap-24">
          <section className="hidden lg:block">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border border-[#8fcdbc]/20 bg-[#8fcdbc]/[0.07] text-sm font-bold text-[#8fcdbc]">
                RA
              </div>

              <span className="text-sm font-semibold tracking-wide text-[#dce9e5]">
                Resume Analyzer
              </span>
            </div>

            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#8fcdbc]">
              Your career workspace
            </p>

            <h1 className="max-w-xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#f1f6f3]">
              Build a resume that gets noticed.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-[#91a6a3]">
              Analyze your experience, understand your skill profile, and
              measure your resume against the opportunities that matter.
            </p>

            <div className="mt-10 flex items-center gap-8 text-sm text-[#78908c]">
              <div>
                <p className="text-lg font-semibold text-[#c8d9d4]">01</p>
                <p className="mt-1">Upload</p>
              </div>

              <div className="h-px w-10 bg-white/[0.08]" />

              <div>
                <p className="text-lg font-semibold text-[#c8d9d4]">02</p>
                <p className="mt-1">Analyze</p>
              </div>

              <div className="h-px w-10 bg-white/[0.08]" />

              <div>
                <p className="text-lg font-semibold text-[#c8d9d4]">03</p>
                <p className="mt-1">Improve</p>
              </div>
            </div>
          </section>

          <section className="w-full">
            <div className="border border-white/[0.09] bg-[#142c30]/90 p-7 shadow-[0_30px_90px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-9">
              <div className="mb-8 lg:hidden">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center border border-[#8fcdbc]/20 bg-[#8fcdbc]/[0.07] text-sm font-bold text-[#8fcdbc]">
                    RA
                  </div>

                  <span className="text-sm font-semibold text-[#dce9e5]">
                    Resume Analyzer
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#78908c]">
                  Welcome back
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#f0f5f2]">
                  Sign in to your workspace
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#829894]">
                  Continue analyzing and improving your resume.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-[#c5d3d0]"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full border border-white/[0.09] bg-[#0d2024]/70 px-4 py-3.5 text-sm text-[#edf5f2] outline-none transition placeholder:text-[#526b68] focus:border-[#8fcdbc]/50 focus:bg-[#10262a] focus:ring-2 focus:ring-[#8fcdbc]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-[#c5d3d0]"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full border border-white/[0.09] bg-[#0d2024]/70 px-4 py-3.5 text-sm text-[#edf5f2] outline-none transition placeholder:text-[#526b68] focus:border-[#8fcdbc]/50 focus:bg-[#10262a] focus:ring-2 focus:ring-[#8fcdbc]/10"
                  />
                </div>

                {error && (
                  <div className="border border-[#d89572]/20 bg-[#d89572]/[0.08] px-4 py-3 text-sm leading-6 text-[#e7b49c]">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#8fcdbc] px-5 py-3.5 text-sm font-semibold text-[#10282c] shadow-[0_10px_30px_rgba(143,205,188,0.12)] transition duration-200 hover:bg-[#a5ddcd] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>

              <div className="mt-7 border-t border-white/[0.07] pt-6 text-center">
                <p className="text-sm text-[#718986]">
                  Don't have an account?
                </p>

                <button
                  type="button"
                  onClick={onRegister}
                  className="mt-2 text-sm font-semibold text-[#9fd6c7] transition hover:text-[#c0e7dc]"
                >
                  Create an account
                </button>
              </div>

              <p className="mt-5 text-center text-xs leading-5 text-[#647b78]">
                Your session is securely maintained using authentication tokens.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Login