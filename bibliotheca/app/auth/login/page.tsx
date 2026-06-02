'use client'
// app/auth/login/page.tsx
// Login page — supports Member, Staff, and Admin roles

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Role = 'MEMBER' | 'STAFF' | 'ADMIN'

const ROLES: { id: Role; label: string; sub: string; emoji: string; color: string }[] = [
  { id: 'MEMBER', label: 'Member',  sub: 'Default',    emoji: '📚', color: 'border-teal-600 bg-teal-50' },
  { id: 'STAFF',  label: 'Staff',   sub: 'Library',    emoji: '📦', color: 'border-amber-500 bg-amber-50' },
  { id: 'ADMIN',  label: 'Admin',   sub: 'Restricted', emoji: '🔑', color: 'border-gray-800 bg-gray-50' },
]

// Role-based redirect targets after successful login
const REDIRECT: Record<Role, string> = {
  MEMBER: '/user/dashboard',
  STAFF:  '/staff/dashboard',
  ADMIN:  '/admin/dashboard',
}

export default function LoginPage() {
  const router = useRouter()
  const [role,     setRole]     = useState<Role>('MEMBER')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email, password, role,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError(result.error === 'CredentialsSignin'
        ? 'Invalid email or password.'
        : result.error)
      return
    }

    router.push(REDIRECT[role])
    router.refresh()
  }

  const selected = ROLES.find(r => r.id === role)!

  return (
    <div className="min-h-screen flex">
      {/* ── Left: hero panel ──────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-72 xl:w-80 flex-col justify-between p-10"
        style={{ background: 'linear-gradient(160deg, #0f2027 0%, #0d3b38 50%, #134e4a 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #2dd4bf 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />
        <div className="absolute bottom-40 left-10 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #0d9488 0%, transparent 70%)' }} />

        <div className="relative">
          <p className="text-teal-400 text-xs font-semibold tracking-widest uppercase mb-1">Bibliotheca</p>
          <p className="text-gray-400 text-xs">Library Portal</p>
        </div>

        <div className="relative">
          <h1 className="font-serif text-4xl text-white leading-tight mb-4">
            Your library,<br />
            <em className="text-teal-400 not-italic">always open.</em>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Access books, manage memberships, and keep track of your reading journey — all in one place.
          </p>
        </div>

        <p className="relative text-gray-600 text-xs">© {new Date().getFullYear()} Bibliotheca</p>
      </div>

      {/* ── Right: form panel ────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Sign In / Register tabs */}
          <div className="flex rounded-xl border border-gray-200 bg-white p-1 mb-8 shadow-sm">
            <button className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium">
              Sign In
            </button>
            <Link href="/auth/register"
              className="flex-1 py-2 text-center text-sm text-gray-500 hover:text-gray-700 transition">
              Register
            </Link>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {ROLES.map(r => (
              <button key={r.id}
                onClick={() => setRole(r.id)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-center
                  ${role === r.id ? r.color + ' shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
              >
                <span className="text-xl">{r.emoji}</span>
                <span className="text-xs font-semibold text-gray-800">{r.label}</span>
                <span className={`text-[10px] font-medium ${
                  r.id === 'ADMIN' && role === r.id ? 'text-red-500' : 'text-gray-400'
                }`}>{r.sub}</span>
              </button>
            ))}
          </div>

          {/* Admin warning banners */}
          {role === 'ADMIN' && (
            <div className="space-y-2 mb-4">
              <div className="flex gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs">
                ⚠️ Admin access is highly restricted. Unauthorised attempts are logged.
              </div>
              <div className="flex gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs">
                🔒 Two-factor authentication is required for admin accounts.
              </div>
            </div>
          )}
          {role === 'STAFF' && (
            <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs">
              ⚠️ Staff access is restricted to authorised library personnel only.
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {role === 'ADMIN' ? 'Admin Sign In'
              : role === 'STAFF' ? 'Staff Sign In'
              : 'Welcome back'}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {role === 'ADMIN' ? 'Restricted — authorised administrators only'
              : role === 'STAFF' ? 'Access the library management portal'
              : 'Sign in to your member account'}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email" required
                className="input"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="label">Password</label>
                <button type="button" className="text-xs text-teal-600 hover:underline">
                  Forgot password?
                </button>
              </div>
              <input
                type="password" required
                className="input"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                className="rounded border-gray-300 text-teal-600" />
              Remember me for 30 days
            </label>

            <button type="submit" disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold text-sm transition-all
                ${role === 'ADMIN' ? 'bg-gray-900 hover:bg-gray-800'
                  : role === 'STAFF' ? 'bg-amber-500 hover:bg-amber-600'
                  : 'bg-teal-700 hover:bg-teal-800'}
                ${loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
            >
              {loading ? 'Signing in…' : `Sign In${role !== 'MEMBER' ? ` as ${selected.label}` : ''}`}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {role === 'MEMBER' ? (
              <>Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="text-teal-600 font-medium hover:underline">
                  Register here
                </Link>
              </>
            ) : (
              <>Need help? Contact{' '}
                <a href="mailto:it@bibliotheca.com" className="text-teal-600 hover:underline">
                  it@bibliotheca.com
                </a>
              </>
            )}
          </p>

          {/* Demo credentials hint */}
          <div className="mt-6 p-3 rounded-lg bg-gray-100 text-xs text-gray-500">
            <p className="font-semibold mb-1">Demo credentials:</p>
            <p>Member → aisha@example.com / member123</p>
            <p>Staff &nbsp;→ staff@bibliotheca.com / staff123</p>
            <p>Admin &nbsp;→ admin@bibliotheca.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
