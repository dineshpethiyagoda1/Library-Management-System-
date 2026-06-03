'use client'
// components/user/BrowseBooksClient.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Book {
  id: string; title: string; author: string; isbn: string
  category: string; availableCopies: number; totalCopies: number
  coverEmoji: string | null; status: string; publishYear: number | null
}

interface Props {
  books: Book[]
  borrowedBookIds: string[]
  categories: string[]
  userId: string
}

export default function BrowseBooksClient({ books, borrowedBookIds, categories, userId }: Props) {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('All Books')
  const [search, setSearch] = useState('')
  const [requesting, setRequesting] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  const borrowedSet = new Set(borrowedBookIds)

  const filtered = books.filter(b => {
    const matchCat = activeCategory === 'All Books' || b.category === activeCategory
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.includes(search)
    return matchCat && matchSearch
  })

  const handleRequest = async (bookId: string) => {
    setRequesting(bookId)
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId }),
    })
    const data = await res.json()
    setRequesting(null)
    if (data.success) {
      setToast('Request submitted! Staff will review it shortly.')
      setTimeout(() => setToast(''), 3000)
      router.refresh()
    } else {
      setToast(data.error || 'Request failed.')
      setTimeout(() => setToast(''), 3000)
    }
  }

  const statusBadge = (book: Book) => {
    if (borrowedSet.has(book.id)) return <span className="badge badge-active">Borrowed</span>
    if (book.availableCopies === 0) return <span className="badge badge-overdue">Unavailable</span>
    return <span className="badge badge-available">Available</span>
  }

  const BG_COLORS = ['bg-blue-50','bg-green-50','bg-teal-50','bg-purple-50','bg-pink-50','bg-amber-50','bg-indigo-50','bg-rose-50']
  const bgFor = (i: number) => BG_COLORS[i % BG_COLORS.length]

  return (
    <div className="max-w-6xl space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-teal-700 text-white px-4 py-3 rounded-xl shadow-lg text-sm">
          {toast}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Book Catalog</h1>
        <p className="text-gray-500 text-sm mt-0.5">Browse and search the entire library collection</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex gap-3 flex-wrap">
          <input className="input max-w-xs" placeholder="e.g. Dune, 978-…"
            value={search} onChange={e => setSearch(e.target.value)} />
          <select className="input max-w-xs" onChange={e => setActiveCategory(e.target.value)} value={activeCategory}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(c => (
          <button key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all
              ${activeCategory === c
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-medium">No books found</p>
          <p className="text-sm">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((book, i) => {
            const isBorrowed = borrowedSet.has(book.id)
            const unavail    = book.availableCopies === 0

            return (
              <div key={book.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
                {/* Cover */}
                <div className={`relative h-36 flex items-center justify-center text-5xl ${bgFor(i)}`}>
                  {isBorrowed && (
                    <span className="absolute top-2 right-2 badge badge-active text-[10px]">Borrowed</span>
                  )}
                  {!isBorrowed && unavail && (
                    <span className="absolute top-2 right-2 badge badge-overdue text-[10px]">Unavailable</span>
                  )}
                  {!isBorrowed && !unavail && (
                    <span className="absolute top-2 right-2 badge badge-available text-[10px]">Available</span>
                  )}
                  <span>{book.coverEmoji ?? '📕'}</span>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="font-semibold text-gray-900 text-sm leading-tight truncate">{book.title}</p>
                  <p className="text-xs text-gray-500 truncate">{book.author}{book.publishYear ? ` · ${book.publishYear}` : ''}</p>
                  <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                    {book.category}
                  </span>

                  <div className="flex items-center gap-2 mt-3">
                    {!isBorrowed && !unavail ? (
                      <button
                        onClick={() => handleRequest(book.id)}
                        disabled={requesting === book.id}
                        className="flex-1 text-xs py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100 transition font-medium"
                      >
                        {requesting === book.id ? '…' : '⊕ Request'}
                      </button>
                    ) : (
                      <span className="flex-1 text-center text-xs text-gray-400 py-1.5">
                        {isBorrowed ? 'You have this' : 'Unavailable'}
                      </span>
                    )}
                    <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition text-sm">
                      👁
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

