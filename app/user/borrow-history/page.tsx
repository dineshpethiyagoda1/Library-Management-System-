// app/user/borrow-history/page.tsx
'use client'

import { useEffect, useState } from 'react'

interface Transaction {
  id: string
  book: { title: string; author: string }
  issueDate: string
  dueDate: string
  returnDate: string | null
  status: string
  fine: number
}

export default function BorrowHistoryPage() {
  const [history, setHistory] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Demo data for preview before connecting with full auth session context
    const demoHistory: Transaction[] = [
      {
        id: 'tx_1',
        book: { title: 'The Midnight Library', author: 'Matt Haig' },
        issueDate: '2026-05-15',
        dueDate: '2026-05-30',
        returnDate: null,
        status: 'ACTIVE',
        fine: 0,
      },
      {
        id: 'tx_2',
        book: { title: 'Dune', author: 'Frank Herbert' },
        issueDate: '2026-05-01',
        dueDate: '2026-05-15',
        returnDate: '2026-05-12',
        status: 'RETURNED',
        fine: 0,
      },
    ]
    setHistory(demoHistory)
    setLoading(false)
   Middleton }, [])

  if (loading) return <div className="p-8 text-center text-gray-500">Loading history...</div>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold font-serif mb-6 text-gray-800">Your Borrow History</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold text-sm">
              <th className="p-4">Book Details</th>
              <th className="p-4">Issued On</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Returned On</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Fine</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
            {history.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-gray-900">{tx.book.title}</div>
                  <div className="text-xs text-gray-400">{tx.book.author}</div>
                </td>
                <td className="p-4 text-gray-500">{tx.issueDate}</td>
                <td className="p-4 text-gray-500">{tx.dueDate}</td>
                <td className="p-4 text-gray-500">{tx.returnDate || '-'}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    tx.status === 'ACTIVE' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                    tx.status === 'OVERDUE' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                    'bg-green-50 text-green-700 border border-green-100'
                  }`}>
                    {tx.status}
                  </span>
                </td>
                <td className="p-4 text-right font-medium text-gray-900">
                  {tx.fine > 0 ? `$${tx.fine.toFixed(2)}` : '$0.00'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}