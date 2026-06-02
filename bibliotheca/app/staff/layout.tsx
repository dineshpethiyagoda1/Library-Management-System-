// app/staff/layout.tsx
// Staff uses the same layout as admin but restricted to STAFF role
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  const role    = (session?.user as any)?.role
  if (!session || role !== 'STAFF') redirect('/auth/login')

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar role={role} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  )
}
