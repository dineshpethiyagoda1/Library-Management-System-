'use client'
// components/admin/IssueReturnClient.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/utils'

interface Tx { id: string; status: string; issueDate: string; dueDate: string; fine: number | null; user: { firstName: string; lastName: string; membershipId: string | null }; book: { title: string; isbn: string } }

export default function IssueReturnClient({ transactions, stats }: { transactions: Tx[]; stats: { issued: number; overdue: number; returnedToday: number; totalFines: number } }) {
  const router = useRouter()
  const [memberId, setMemberId] = useState('')
  const [isbn,     setIsbn]     = useState('')
  const [loading,  setLoading]  = useState<string | null>(null)
  const [toast,    setToast]    = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleIssue = async () => {
    if (!memberId || !isbn) return showToast('Enter both Member ID and ISBN.')
    setLoading('issue')
    const res  = await fetch('/api/transactions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ membershipId: memberId, isbn }) })
    const data = await res.json()
    setLoading(null)
    if (data.success) { showToast('Book issued successfully!'); setMemberId(''); setIsbn(''); router.refresh() }
    else showToast(data.error || 'Failed to issue.')
  }

  const handleReturn = async (txId: string) => {
    setLoading(txId)
    const res  = await fetch(`/api/transactions/${txId}/return`, { method: 'PATCH' })
    const data = await res.json()
    setLoading(null)
    if (data.success) { showToast('Book returned successfully!'); router.refresh() }
    else showToast(data.error || 'Failed.')
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {toast && <div className="fixed top-4 right-4 z-50 bg-teal-700 text-white px-4 py-3 rounded-xl shadow-lg text-sm">{toast}</div>}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Issue / Return Management</h1>
        <p className="text-gray-500 text-sm">Issue books to members or process returns</p>
      </div>

      {/* Issue + Return panels */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">📖 Issue Book</h2>
          <div className="space-y-3">
            <input className="input" placeholder="Member ID (e.g., LIB2024001)" value={memberId} onChange={e => setMemberId(e.target.value)} />
            <input className="input" placeholder="Book ISBN (978-XXXXXXXXXX)" value={isbn} onChange={e => setIsbn(e.target.value)} />
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-xs space-y-0.5">
              <p>📅 Due Date: 21 days from issue date</p>
              <p>💰 Fine: $0.50 per day after due date</p>
            </div>
            <button onClick={handleIssue} disabled={loading === 'issue'} className="w-full py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition">
              {loading === 'issue' ? 'Issuing…' : 'Issue Book'}
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">🔄 Return Book</h2>
          <div className="space-y-3">
            <select className="input">
              <option value="">Select a transaction</option>
              {transactions.map(t => (
                <option key={t.id} value={t.id}>{t.user.firstName} — {t.book.title}</option>
              ))}
            </select>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 text-xs">
              Fine will be calculated automatically based on due date
            </div>
            <button className="w-full py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition">
              Process Return
            </button>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Currently Issued', value: stats.issued,                          color: 'text-blue-700' },
          { label: 'Overdue',          value: stats.overdue,                          color: 'text-red-600' },
          { label: 'Returned Today',   value: stats.returnedToday,                   color: 'text-green-700' },
          { label: 'Total Fines',      value: `$${stats.totalFines.toFixed(0)}`,     color: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Active transactions table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Active Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1e3a5f] text-white">
                {['ID','Member','Book','Issue Date','Due Date','Status','Fine','Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((t, i) => (
                <tr key={t.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-500 text-xs">#{i+1}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 text-xs">{t.user.firstName} {t.user.lastName}</p>
                    <p className="text-[10px] text-gray-400">{t.user.membershipId}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 text-xs">{t.book.title}</p>
                    <p className="text-[10px] text-gray-400">{t.book.isbn}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{formatDate(t.issueDate)}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{formatDate(t.dueDate)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge text-[10px] ${t.status === 'OVERDUE' ? 'badge-overdue' : 'badge-active'}`}>{t.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {t.fine ? <span className="text-red-600 font-semibold">${t.fine.toFixed(2)}</span> : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleReturn(t.id)} disabled={loading === t.id}
                      className="px-3 py-1 rounded-lg bg-teal-500 text-white text-xs font-medium hover:bg-teal-600 transition">
                      {loading === t.id ? '…' : 'Return'}
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">No active transactions.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
