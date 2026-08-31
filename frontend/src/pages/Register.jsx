import { useState } from 'react'
import { registerUser } from '../services/authService'

function Register({ onLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
    setSuccess('')

    if (!formData.name.trim()) {
      setError('Please enter your name.')
      return
    }

    if (!formData.email.trim()) {
      setError('Please enter your email address.')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      setLoading(true)

      await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      })

      setSuccess('Account created successfully. You can now sign in.')

      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
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
              Start stronger
            </p>

            <h1 className="max-w-xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#f1f6f3]">
              Know what your resume says about you.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-[#91a6a3]">
              Create your workspace and get a clearer view of your resume,
              skills, strengths, and opportunities for improvement.
            </p>

            <div className="mt-10 grid max-w-lg grid-cols-3 border border-white/[0.08] bg-white/[0.025]">
              <div className="border-r border-white/[0.08] p-4">
                <p className="text-xl font-semibold text-[#c9ddd8]">01</p>
                <p className="mt-1 text-xs text-[#718986]">Create</p>
              </div>

              <div className="border-r border-white/[0.08] p-4">
                <p className="text-xl font-semibold text-[#c9ddd8]">02</p>
                <p className="mt-1 text-xs text-[#718986]">Analyze</p>
              </div>

              <div className="p-4">
                <p className="text-xl font-semibold text-[#c9ddd8]">03</p>
                <p className="mt-1 text-xs text-[#718986]">Improve</p>
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
                  Get started
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#f0f5f2]">
                  Create your account
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#829894]">
                  Set up your personal resume analysis workspace.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-[#c5d3d0]"
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
                    className="w-full border border-white/[0.09] bg-[#0d2024]/70 px-4 py-3.5 text-sm text-[#edf5f2] outline-none transition placeholder:text-[#526b68] focus:border-[#8fcdbc]/50 focus:bg-[#10262a] focus:ring-2 focus:ring-[#8fcdbc]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="register-email"
                    className="mb-2 block text-sm font-medium text-[#c5d3d0]"
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
                    className="w-full border border-white/[0.09] bg-[#0d2024]/70 px-4 py-3.5 text-sm text-[#edf5f2] outline-none transition placeholder:text-[#526b68] focus:border-[#8fcdbc]/50 focus:bg-[#10262a] focus:ring-2 focus:ring-[#8fcdbc]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="register-password"
                    className="mb-2 block text-sm font-medium text-[#c5d3d0]"
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
                    className="w-full border border-white/[0.09] bg-[#0d2024]/70 px-4 py-3.5 text-sm text-[#edf5f2] outline-none transition placeholder:text-[#526b68] focus:border-[#8fcdbc]/50 focus:bg-[#10262a] focus:ring-2 focus:ring-[#8fcdbc]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="mb-2 block text-sm font-medium text-[#c5d3d0]"
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
                    className="w-full border border-white/[0.09] bg-[#0d2024]/70 px-4 py-3.5 text-sm text-[#edf5f2] outline-none transition placeholder:text-[#526b68] focus:border-[#8fcdbc]/50 focus:bg-[#10262a] focus:ring-2 focus:ring-[#8fcdbc]/10"
                  />
                </div>

                {error && (
                  <div className="border border-[#d89572]/20 bg-[#d89572]/[0.08] px-4 py-3 text-sm leading-6 text-[#e7b49c]">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="border border-[#8fcdbc]/20 bg-[#8fcdbc]/[0.08] px-4 py-3 text-sm leading-6 text-[#a9d9cc]">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#8fcdbc] px-5 py-3.5 text-sm font-semibold text-[#10282c] shadow-[0_10px_30px_rgba(143,205,188,0.12)] transition duration-200 hover:bg-[#a5ddcd] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </form>

              <div className="mt-7 border-t border-white/[0.07] pt-6 text-center">
                <p className="text-sm text-[#718986]">
                  Already have an account?
                </p>

                <button
                  type="button"
                  onClick={onLogin}
                  className="mt-2 text-sm font-semibold text-[#9fd6c7] transition hover:text-[#c0e7dc]"
                >
                  Sign in instead
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Register