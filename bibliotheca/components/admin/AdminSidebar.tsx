'use client'
// components/admin/AdminSidebar.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const NAV = [
  { href: '/admin/dashboard',    label: 'Dashboard',    emoji: '📊' },
  { href: '/admin/books',        label: 'Books',        emoji: '📚' },
  { href: '/admin/members',      label: 'Members',      emoji: '👥' },
  { href: '/admin/issue-return', label: 'Issue / Return', emoji: '🔄' },
  { href: '/admin/reports',      label: 'Reports',      emoji: '📈' },
]

export default function AdminSidebar({ role }: { role: string }) {
  const path = usePathname()
  return (
    <aside className="w-52 bg-[#1e3a5f] text-white flex flex-col py-6 px-3 gap-1 shrink-0">
      <div className="px-3 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">📗</span>
          <span className="font-bold text-sm">LMS</span>
        </div>
        <p className="text-blue-300 text-[10px]">Central University Library</p>
      </div>

      {NAV.map(n => {
        const active = path === n.href
        return (
          <Link key={n.href} href={n.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
              ${active ? 'bg-white/15 text-white font-semibold' : 'text-blue-200 hover:bg-white/10 hover:text-white'}`}
          >
            <span>{n.emoji}</span>
            <span>{n.label}</span>
          </Link>
        )
      })}

      <div className="mt-auto">
        <button onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-blue-200 hover:bg-white/10 hover:text-white transition-all w-full">
          🚪 Logout
        </button>
      </div>
    </aside>
  )
}
