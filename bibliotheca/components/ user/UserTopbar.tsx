'use client'
// components/user/UserTopbar.tsx
// Top header bar for the member portal

import { signOut } from 'next-auth/react'
import { useState } from 'react'

interface Props {
  user: { name?: string | null; email?: string | null }
}

export default function UserTopbar({ user }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
      {/* Search */}
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-72">
        <span className="text-gray-400 text-sm">🔍</span>
        <input
          className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none flex-1"
          placeholder="Search books, authors…"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 relative">
        <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition">
          🔔
        </button>
        <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition">
          🌙
        </button>

        {/* Avatar dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 hover:bg-gray-50 rounded-xl px-2 py-1 transition"
          >
            <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">
              {user.name?.[0] ?? '?'}
            </div>
            <span className="text-sm text-gray-700 font-medium hidden sm:block">{user.name}</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-40 z-50">
              <p className="px-4 py-2 text-xs text-gray-400 border-b border-gray-50">{user.email}</p>
              <button
                onClick={() => signOut({ callbackUrl: '/auth/login' })}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

