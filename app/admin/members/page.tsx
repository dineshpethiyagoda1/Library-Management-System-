// app/admin/members/page.tsx
'use client'

import { useEffect, useState } from 'react'

interface Member {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  membership: {
    membershipCardNumber: string
    status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED'
    type: 'REGULAR' | 'PREMIUM'
  } | null
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock seed members dataset layout
    const seedMembers: Member[] = [
      {
        id: 'user_1',
        firstName: 'Aisha',
        lastName: 'Rahman',
        email: 'aisha@example.com',
        phone: '0771234567',
        membership: { membershipCardNumber: 'LIB00001', status: 'ACTIVE', type: 'PREMIUM' }
      },
      {
        id: 'user_2',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael@example.com',
        phone: '0719876543',
        membership: { membershipCardNumber: 'LIB00002', status: 'ACTIVE', type: 'REGULAR' }
      },
      {
        id: 'user_3',
        firstName: 'Fathima',
        lastName: 'Zahra',
        email: 'zahra@example.com',
        phone: null,
        membership: { membershipCardNumber: 'LIB00003', status: 'SUSPENDED', type: 'REGULAR' }
      }
    ]
    setMembers(seedMembers)
    setLoading(false)
  }, [])

  const toggleStatus = (id: string) => {
    setMembers(members.map(m => {
      if (m.id === id && m.membership) {
        const nextStatus: 'ACTIVE' | 'SUSPENDED' = m.membership.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
        return {
          ...m,
          membership: { ...m.membership, status: nextStatus }
        }
      }
      return m
    }))
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading registry workspace...</div>

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50 font-serif font-bold text-lg text-gray-800">Library Registered Members</div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold text-xs uppercase tracking-wider">
              <th className="p-4">Card ID</th>
              <th className="p-4">Full Name</th>
              <th className="p-4">Email / Contact</th>
              <th className="p-4">Tier Type</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50/40">
                <td className="p-4 font-mono text-xs font-bold text-gray-600">
                  {member.membership?.membershipCardNumber || 'UNASSIGNED'}
                </td>
                <td className="p-4 font-medium text-gray-900">
                  {member.firstName} {member.lastName}
                </td>
                <td className="p-4">
                  <div className="text-gray-900">{member.email}</div>
                  <div className="text-xs text-gray-400">{member.phone || 'No phone'}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    member.membership?.type === 'PREMIUM' ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-600'
                  }`}>{member.membership?.type}</span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    member.membership?.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-rose-700'
                  }`}>{member.membership?.status}</span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => toggleStatus(member.id)} className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                    member.membership?.status === 'ACTIVE' ? 'border-rose-200 text-rose-600 hover:bg-rose-50' : 'border-green-200 text-green-600 hover:bg-green-50'
                  }`}>
                    {member.membership?.status === 'ACTIVE' ? 'Suspend Account' : 'Activate Account'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}