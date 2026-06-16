'use client'
// components/user/SettingsClient.tsx
import { useState } from 'react'

interface UserData { id: string; firstName: string; lastName: string; email: string; phone: string; address: string; membershipId: string; membershipType: string; status: string }
export default function SettingsClient({ user }: { user: UserData }) {
  const [form, setForm] = useState({ firstName: user.firstName, lastName: user.lastName, phone: user.phone, address: user.address })
  const [saved,   setSaved]   = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/members/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setLoading(false)
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500) }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage your account details</p>
      </div>

      {/* Membership info */}
      <div className="card bg-teal-50 border border-teal-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-700 text-white text-xl font-bold flex items-center justify-center">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div>
            <p className="font-bold text-gray-900">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <div className="flex gap-2 mt-1">
              <span className="badge badge-available text-[10px]">{user.status}</span>
              <span className="badge bg-teal-100 text-teal-700 text-[10px]">{user.membershipType}</span>
              {user.membershipId && <span className="text-xs text-gray-400">{user.membershipId}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-4">Personal Details</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">First Name</label>
              <input className="input" value={form.firstName} onChange={e => set('firstName', e.target.value)} />
            </div>
            <div>
              <label className="label">Last Name</label>
              <input className="input" value={form.lastName} onChange={e => set('lastName', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input bg-gray-50" value={user.email} disabled title="Contact admin to change email" />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} />
          </div>
          <div>
            <label className="label">Address</label>
            <textarea className="input h-20 resize-none" value={form.address} onChange={e => set('address', e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary px-6 py-2.5">
            {saved ? '✓ Saved' : loading ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Password section */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-4">Change Password</h2>
        <div className="space-y-3">
          <div><label className="label">Current Password</label><input type="password" className="input" placeholder="••••••••" /></div>
          <div><label className="label">New Password</label><input type="password" className="input" placeholder="••••••••" /></div>
          <div><label className="label">Confirm New Password</label><input type="password" className="input" placeholder="••••••••" /></div>
          <button className="btn-secondary px-6 py-2.5">Update Password</button>
        </div>
      </div>
    </div>
  )
}

