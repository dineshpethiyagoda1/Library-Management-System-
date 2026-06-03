// app/admin/layout.tsx
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  const role    = (session?.user as any)?.role
  if (!session || !['ADMIN','STAFF'].includes(role)) redirect('/auth/login')

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar role={role} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  )
}
