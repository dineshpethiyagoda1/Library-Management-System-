// app/user/settings/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import SettingsClient from '@/components/user/SettingsClient'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  const userId  = (session?.user as any)?.id as string
  const user    = await db.user.findUnique({ where: { id: userId } })
  if (!user) return <p>User not found.</p>

  return <SettingsClient user={{
    id: user.id, firstName: user.firstName, lastName: user.lastName,
    email: user.email, phone: user.phone ?? '', address: user.address ?? '',
    membershipId: user.membershipId ?? '', membershipType: user.membershipType,
    status: user.status,
  }} />
}

