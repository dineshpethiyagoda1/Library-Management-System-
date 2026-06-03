'use client'
// app/auth/register/page.tsx
// New member self-registration page

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', password: '', confirmPassword: '',
    membershipType: 'STANDARD', agreeTerms: false,
  })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k: string, v: string | boolean) =>
    setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (!form.agreeTerms) {
      setError('Please agree to the Terms of Service.')
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setLoading(false)

    if (!data.success) {
      setError(data.error ?? 'Registration failed.')
      return
    }

    router.push('/auth/login?registered=1')
  }

  return (
    <div className="min-h-screen flex">
      {/* Hero panel */}
      <div
        className="hidden lg:flex lg:w-72 xl:w-80 flex-col justify-between p-10"
        style={{ background: 'linear-gradient(160deg, #0f2027 0%, #0d3b38 50%, #134e4a 100%)' }}
      >
        <div>
          <p className="text-teal-400 text-xs font-semibold tracking-widest uppercase mb-1">Bibliotheca</p>
          <p className="text-gray-400 text-xs">Library Portal</p>
        </div>
        <div>
          <h1 className="font-serif text-4xl text-white leading-tight mb-4">
            Your library,<br />
            <em className="text-teal-400 not-italic">always open.</em>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Access books, manage memberships, and keep track of your reading journey.
          </p>
        </div>
        <p className="text-gray-600 text-xs">© {new Date().getFullYear()} Bibliotheca</p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Tabs */}
          <div className="flex rounded-xl border border-gray-200 bg-white p-1 mb-8 shadow-sm">
            <Link href="/auth/login"
              className="flex-1 py-2 text-center text-sm text-gray-500 hover:text-gray-700 transition">
              Sign In
            </Link>
            <button className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium">
              Register
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Create account</h2>
          <p className="text-gray-500 text-sm mb-6">Register for a new library membership</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">First Name *</label>
                <input className="input" placeholder="First name" required
                  value={form.firstName} onChange={e => set('firstName', e.target.value)} />
              </div>
              <div>
                <label className="label">Last Name *</label>
                <input className="input" placeholder="Last name" required
                  value={form.lastName} onChange={e => set('lastName', e.target.value)} />
              </div>
            </div>

            <div>
              <label className="label">Email Address *</label>
              <input type="email" className="input" placeholder="your@email.com" required
                value={form.email} onChange={e => set('email', e.target.value)} />
            </div>

            <div>
              <label className="label">Phone Number</label>
              <input type="tel" className="input" placeholder="+1 (555) 000-0000"
                value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>

            <div>
              <label className="label">Password *</label>
              <input type="password" className="input" placeholder="Create a password" required
                minLength={6}
                value={form.password} onChange={e => set('password', e.target.value)} />
            </div>

            <div>
              <label className="label">Confirm Password *</label>
              <input type="password" className="input" placeholder="Repeat password" required
                value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} />
            </div>

            <div>
              <label className="label">Membership Type</label>
              <select className="input" value={form.membershipType}
                onChange={e => set('membershipType', e.target.value)}>
                <option value="STANDARD">Standard (Free)</option>
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty / Educator</option>
                <option value="PREMIUM">Premium</option>
              </select>
            </div>

            <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked={form.agreeTerms}
                onChange={e => set('agreeTerms', e.target.checked)}
                className="mt-0.5 rounded border-gray-300 text-teal-600" />
              <span>
                I agree to the{' '}
                <a href="#" className="text-teal-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-teal-600 hover:underline">Privacy Policy</a>
              </span>
            </label>

            <button type="submit" disabled={loading}
              className={`w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm transition-all
                ${loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-teal-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

