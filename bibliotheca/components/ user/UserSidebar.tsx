'use client'
// components/user/UserSidebar.tsx
// Left navigation sidebar for the member portal

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/user/dashboard',    label: 'Dashboard',    emoji: '⊞' },
]
const CATALOG = [
  { href: '/user/browse',       label: 'Browse Books', emoji: '' },
  { href: '/user/browse?q=',    label: 'Search',       emoji: '🔍' },
]
const MY_LIBRARY = [
  { href: '/user/borrow-history', label: 'Borrow History', emoji: '' },
  { href: '/user/request-book',   label: 'Request a Book', emoji: '⏱',  badge: true },
  { href: '/user/return-books',   label: 'Return Books',   emoji: '↩' },
]
const ACCOUNT = [
  { href: '/user/new-membership', label: 'New Membership', emoji: '👤' },
  { href: '/user/settings',       label: 'Settings',       emoji: '⚙' },
]

export default function UserSidebar() {
  const path = usePathname()

  const NavItem = ({ href, label, emoji, badge }: { href: string; label: string; emoji: string; badge?: boolean }) => {
    const active = path === href || (href !== '/user/dashboard' && path.startsWith(href.split('?')[0]))
    return (
      <Link href={href}
        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all
          ${active
            ? 'bg-teal-50 text-teal-700 font-semibold'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
      >
        <span className="text-base">{emoji}</span>
        <span className="flex-1">{label}</span>
        {badge && (
          <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
            2
          </span>
        )}
      </Link>
    )
  }

  return (
    <aside className="w-56 bg-white border-r border-gray-100 flex flex-col py-6 px-3 gap-1 shrink-0">
      {/* Brand */}
      <div className="px-3 mb-6">
        <p className="font-serif text-lg font-bold text-gray-900">Bibliotheca</p>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Library Portal</p>
      </div>

      <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Overview</p>
      {NAV.map(n => <NavItem key={n.href} {...n} />)}

      <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-1">Catalog</p>
      {CATALOG.map(n => <NavItem key={n.href} {...n} />)}

      <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-1">My Library</p>
      {MY_LIBRARY.map(n => <NavItem key={n.href} {...n} badge={n.badge} />)}

      <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-1">Account</p>
      {ACCOUNT.map(n => <NavItem key={n.href} {...n} />)}
    </aside>
  )
}

