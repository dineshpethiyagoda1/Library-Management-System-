'use client'
// components/user/ReturnBooksClient.tsx
import { useState } from 'react'
import { formatDate, calculateFine } from '@/lib/utils'

interface Tx { id: string; bookId: string; dueDate: string; issueDate: string; book: { title: string; author: string } }
interface Props { borrowed: Tx[] }

export default function ReturnBooksClient({ borrowed }: Props) {
  const [selectedBook, setSelectedBook] = useState(borrowed[0]?.id ?? '')
  const [returnDate,   setReturnDate]   = useState('')
  const [fineResult,   setFineResult]   = useState<number | null>(null)

  const tx = borrowed.find(t => t.id === selectedBook)

  const calcFine = () => {
    if (!tx) return
    const rd   = returnDate ? new Date(returnDate) : new Date()
    const fine = calculateFine(new Date(tx.dueDate), rd)
    setFineResult(fine)
  }

  const steps = [
    'Bring your book(s) to the library front desk.',
    'Staff will scan the book and update your account.',
    'The system checks for any overdue status.',
    'Fines are calculated automatically if applicable ($0.50/day).',
    'Payment can be made at the desk or via your account.',
  ]

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Return Books</h1>
        <p className="text-gray-500 text-sm mt-0.5">Books are returned physically at the library desk</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Currently borrowed */}
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-3">Currently Borrowed</h2>
            {borrowed.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">You have no active borrows.</p>
            ) : (
              <div className="space-y-2">
                {borrowed.map(t => {
                  const overdue = new Date(t.dueDate) < new Date()
                  return (
                    <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">📘</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{t.book.title}</p>
                        <p className="text-xs text-gray-500">{t.book.author} · Due {formatDate(t.dueDate)}</p>
                      </div>
                      <span className={`badge ${overdue ? 'badge-overdue' : 'badge-active'}`}>
                        {overdue ? 'Overdue' : 'Active'}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Return procedure */}
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-4">Return procedure</h2>
            <ol className="space-y-3">
              {steps.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-600">
                  <span className="w-6 h-6 rounded-full bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center shrink-0">{i+1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Fine calculator */}
        <div className="card self-start">
          <h3 className="font-semibold text-gray-900 mb-1">Fine Calculator</h3>
          <p className="text-xs text-gray-400 mb-4">Estimate your fine if returning late</p>

          <div className="space-y-3">
            <div>
              <label className="label">Select Book</label>
              <select className="input text-xs" value={selectedBook} onChange={e => { setSelectedBook(e.target.value); setFineResult(null) }}>
                {borrowed.map(t => (
                  <option key={t.id} value={t.id}>{t.book.title} — Due {new Date(t.dueDate).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</option>
                ))}
                {borrowed.length === 0 && <option>No active borrows</option>}
              </select>
            </div>

            <div>
              <label className="label">Return Date</label>
              <input type="date" className="input text-xs" value={returnDate}
                onChange={e => { setReturnDate(e.target.value); setFineResult(null) }}
                placeholder="e.g. Dec 25, 2024" />
            </div>

            <button onClick={calcFine} disabled={!tx}
              className="btn-secondary w-full text-sm py-2 justify-center">
              Calculate Fine
            </button>

            {fineResult !== null && (
              <div className={`p-3 rounded-xl border text-sm ${fineResult > 0 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                {fineResult > 0
                  ? `⚠ Estimated fine: $${fineResult.toFixed(2)}`
                  : '✓ No fine — returning on time!'}
              </div>
            )}

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs">
              ⚠ Fines accrue at $0.50 per day after the due date. Accounts with outstanding fines over $10 will be temporarily suspended.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

