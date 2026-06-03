// app/admin/transactions/page.tsx
'use client'

import { useEffect, useState } from 'react'

interface Transaction {
  id: string
  user: { firstName: string; lastName: string; email: string }
  book: { title: string }
  issueDate: string
  dueDate: string
  returnDate: string | null
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE'
  fine: number
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock seed transactions dataset
    const seedTransactions: Transaction[] = [
      {
        id: 'tx_1',
        user: { firstName: 'Aisha', lastName: 'Rahman', email: 'aisha@example.com' },
        book: { title: 'The Midnight Library' },
        issueDate: '2026-05-15',
        dueDate: '2026-05-30',
        returnDate: null,
        status: 'ACTIVE',
        fine: 0,
      },
      {
        id: 'tx_2',
        user: { firstName: 'Michael', lastName: 'Chen', email: 'michael@example.com' },
        book: { title: 'Dune' },
        issueDate: '2026-05-01',
        dueDate: '2026-05-15',
        returnDate: '2026-05-12',
        status: 'RETURNED',
        fine: 0,
      },
      {
        id: 'tx_3',
        user: { firstName: 'Fathima', lastName: 'Zahra', email: 'zahra@example.com' },
        book: { title: 'Clean Code' },
        issueDate: '2026-04-10',
        dueDate: '2026-04-25',
        returnDate: null,
        status: 'OVERDUE',
        fine: 15.50,
      }
    ]
    setTransactions(seedTransactions)
    setLoading(false)
  }, [])

  const handleReturnBook = (id: string) => {
    const today = new Date().toISOString().split('T')[0]
    setTransactions(transactions.map(tx => {
      if (tx.id === id) {
        return {
          ...tx,
          returnDate: today,
          status: 'RETURNED',
        }
      }
      return tx
    }))
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading ledger engine...</div>

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50 font-serif font-bold text-lg text-gray-800">Circulation & Borrowing Records</div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold text-xs uppercase tracking-wider">
              <th className="p-4">Borrower</th>
              <th className="p-4">Book Title</th>
              <th className="p-4">Timeline (Issued → Due)</th>
              <th className="p-4">Returned On</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Fine</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50/40">
                <td className="p-4">
                  <div className="font-medium text-gray-900">{tx.user.firstName} {tx.user.lastName}</div>
                  <div className="text-xs text-gray-400">{tx.user.email}</div>
                </td>
                <td className="p-4 font-medium text-gray-800">{tx.book.title}</td>
                <td className="p-4 text-xs font-mono text-gray-500">
                  {tx.issueDate} <span className="text-gray-300">→</span> {tx.dueDate}
                </td>
                <td className="p-4 text-gray-500">{tx.returnDate || '-'}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    tx.status === 'ACTIVE' ? 'bg-amber-50 text-amber-700' :
                    tx.status === 'OVERDUE' ? 'bg-rose-50 text-rose-700' :
                    'bg-green-50 text-green-700'
                  }`}>{tx.status}</span>
                </td>
                <td className="p-4 text-right font-medium text-gray-900">${tx.fine.toFixed(2)}</td>
                <td className="p-4 text-right">
                  {tx.status !== 'RETURNED' ? (
                    <button onClick={() => handleReturnBook(tx.id)} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                      Mark Returned
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}