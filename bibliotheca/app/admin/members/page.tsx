// app/admin/members/page.tsx
import { db } from '@/lib/db'
import AdminMembersClient from '@/components/admin/AdminMembersClient'

export default async function AdminMembersPage() {
  const members = await db.user.findMany({
    where: { role: 'MEMBER' },
    include: { _count: { select: { transactions: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return <AdminMembersClient members={members.map(m => ({
    id: m.id, firstName: m.firstName, lastName: m.lastName,
    email: m.email, phone: m.phone, membershipId: m.membershipId,
    membershipType: m.membershipType, status: m.status,
    booksIssued: m._count.transactions, createdAt: m.createdAt.toISOString(),
  }))} />
}
