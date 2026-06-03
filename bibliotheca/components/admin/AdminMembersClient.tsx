'use client'
// components/admin/AdminMembersClient.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Member { id: string; firstName: string; lastName: string; email: string; phone: string | null; membershipId: string | null; membershipType: string; status: string; booksIssued: number; createdAt: string }

export default function AdminMembersClient({ members: initial }: { members: Member[] }) {
  const router  = useRouter()
  const [members, setMembers]   = useState(initial)
  const [search,  setSearch]    = useState('')
  const [typeF,   setTypeF]     = useState('All Types')
  const [statusF, setStatusF]   = useState('All Status')
  const [modal,   setModal]     = useState(false)
  const [form,    setForm]      = useState({ firstName:'',lastName:'',email:'',phone:'',membershipType:'STANDARD',status:'ACTIVE' })
  const [loading, setLoading]   = useState(false)
  const [toast,   setToast]     = useState('')

  const filtered = members.filter(m => {
    const name = `${m.firstName} ${m.lastName} ${m.email} ${m.membershipId ?? ''}`.toLowerCase()
    const matchSearch = !search || name.includes(search.toLowerCase())
    const matchType   = typeF === 'All Types'   || m.membershipType === typeF
    const matchStatus = statusF === 'All Status' || m.status === statusF
    return matchSearch && matchType && matchStatus
  })

  const stats = {
    active:  members.filter(m => m.status === 'ACTIVE').length,
    student: members.filter(m => m.membershipType === 'STUDENT').length,
    faculty: members.filter(m => m.membershipType === 'FACULTY').length,
    expired: members.filter(m => m.status === 'EXPIRED').length,
  }

  const handleAdd = async () => {
    setLoading(true)
    const res  = await fetch('/api/members', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    setLoading(false)
    if (data.success) { setToast('Member added!'); setModal(false); setTimeout(() => setToast(''), 2500); router.refresh() }
    else setToast(data.error || 'Failed.')
  }

  const handleStatusToggle = async (id: string, current: string) => {
    const newStatus = current === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    await fetch(`/api/members/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) })
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m))
  }

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="space-y-6 max-w-6xl">
      {toast && <div className="fixed top-4 right-4 z-50 bg-teal-700 text-white px-4 py-3 rounded-xl shadow-lg text-sm">{toast}</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members Management</h1>
          <p className="text-gray-500 text-sm">Total: {members.length} registered members</p>
        </div>
        <button onClick={() => setModal(true)} className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-xl flex items-center gap-2 transition">
          + Add New Member
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input className="input max-w-xs" placeholder="Search by name, email, or ID…" value={search} onChange={e => setSearch(e.target.value)} />
        <select className="input w-40" value={typeF} onChange={e => setTypeF(e.target.value)}>
          {['All Types','STANDARD','STUDENT','FACULTY','PREMIUM'].map(t => <option key={t}>{t}</option>)}
        </select>
        <select className="input w-40" value={statusF} onChange={e => setStatusF(e.target.value)}>
          {['All Status','ACTIVE','SUSPENDED','EXPIRED','PENDING'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1e3a5f] text-white">
                {['Member Details','Contact','Membership ID','Type','Books Issued','Status','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(m => (
                <tr key={m.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-semibold text-gray-900">{m.firstName} {m.lastName}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    <p>{m.email}</p>
                    {m.phone && <p>{m.phone}</p>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{m.membershipId ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{m.membershipType}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{m.booksIssued}</td>
                  <td className="px-4 py-3">
                    <span className={`badge text-[10px] ${m.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : m.status === 'EXPIRED' ? 'bg-red-100 text-red-700' : 'badge-pending'}`}>
                      {m.status === 'ACTIVE' ? '● Active' : m.status === 'EXPIRED' ? '● Expired' : m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="px-2.5 py-1 rounded-lg bg-teal-500 text-white text-xs font-medium hover:bg-teal-600 transition">View</button>
                      <button onClick={() => handleStatusToggle(m.id, m.status)} className="px-2.5 py-1 rounded-lg bg-amber-500 text-white text-xs font-medium hover:bg-amber-600 transition">
                        {m.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer stats */}
        <div className="flex gap-8 px-6 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
          {[['Active Members', stats.active],['Students', stats.student],['Faculty', stats.faculty],['Expired', stats.expired]].map(([l,v]) => (
            <div key={l as string} className="text-center">
              <p>{l}</p>
              <p className="text-blue-700 font-bold text-lg">{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">Add New Member</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">First Name</label><input className="input" value={form.firstName} onChange={e => set('firstName', e.target.value)} /></div>
                <div><label className="label">Last Name</label><input className="input" value={form.lastName} onChange={e => set('lastName', e.target.value)} /></div>
              </div>
              <div><label className="label">Email</label><input type="email" className="input" value={form.email} onChange={e => set('email', e.target.value)} /></div>
              <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
              <div>
                <label className="label">Membership Type</label>
                <select className="input" value={form.membershipType} onChange={e => set('membershipType', e.target.value)}>
                  {['STANDARD','STUDENT','FACULTY','PREMIUM'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleAdd} disabled={loading} className="btn-primary flex-1 justify-center">{loading ? 'Adding…' : 'Add Member'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
