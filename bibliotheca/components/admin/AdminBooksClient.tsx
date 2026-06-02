'use client'
// components/admin/AdminBooksClient.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Book { id: string; title: string; author: string; isbn: string; category: string; publisher: string | null; publishYear: number | null; totalCopies: number; availableCopies: number; status: string }

const EMPTY = { title: '', author: '', isbn: '', category: 'Technology', publisher: '', publishYear: '', totalCopies: '1', description: '' }

export default function AdminBooksClient({ books: initial }: { books: Book[] }) {
  const router   = useRouter()
  const [books,   setBooks]   = useState(initial)
  const [search,  setSearch]  = useState('')
  const [catFilter, setCat]   = useState('All Categories')
  const [modal,   setModal]   = useState(false)
  const [editing, setEditing] = useState<Book | null>(null)
  const [form,    setForm]    = useState<typeof EMPTY>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [toast,   setToast]   = useState('')

  const categories = ['All Categories', ...Array.from(new Set(books.map(b => b.category)))]

  const filtered = books.filter(b => {
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()) || b.isbn.includes(search)
    const matchCat    = catFilter === 'All Categories' || b.category === catFilter
    return matchSearch && matchCat
  })

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = (b: Book) => { setEditing(b); setForm({ title: b.title, author: b.author, isbn: b.isbn, category: b.category, publisher: b.publisher ?? '', publishYear: String(b.publishYear ?? ''), totalCopies: String(b.totalCopies), description: '' }); setModal(true) }

  const handleSave = async () => {
    setLoading(true)
    const method = editing ? 'PATCH' : 'POST'
    const url    = editing ? `/api/books/${editing.id}` : '/api/books'
    const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, publishYear: form.publishYear ? Number(form.publishYear) : null, totalCopies: Number(form.totalCopies) }) })
    const data   = await res.json()
    setLoading(false)
    if (data.success) {
      setToast(editing ? 'Book updated!' : 'Book added!')
      setTimeout(() => setToast(''), 2500)
      setModal(false)
      router.refresh()
      if (editing) setBooks(prev => prev.map(b => b.id === editing.id ? { ...b, ...form, publishYear: form.publishYear ? Number(form.publishYear) : null, totalCopies: Number(form.totalCopies) } : b))
      else router.refresh()
    } else setToast(data.error || 'Failed.')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this book?')) return
    await fetch(`/api/books/${id}`, { method: 'DELETE' })
    setBooks(prev => prev.filter(b => b.id !== id))
    setToast('Book deleted.')
    setTimeout(() => setToast(''), 2500)
  }

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="space-y-6 max-w-6xl">
      {toast && <div className="fixed top-4 right-4 z-50 bg-teal-700 text-white px-4 py-3 rounded-xl shadow-lg text-sm">{toast}</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Books Management</h1>
          <p className="text-gray-500 text-sm">Total: {books.length} books in library</p>
        </div>
        <button onClick={openAdd} className="btn-primary">+ Add New Book</button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input className="input max-w-xs" placeholder="Search by title, author, or ISBN…" value={search} onChange={e => setSearch(e.target.value)} />
        <select className="input w-44" value={catFilter} onChange={e => setCat(e.target.value)}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1e3a5f] text-white">
                {['Book Details','ISBN','Category','Publisher','Availability','Status','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{b.title}</p>
                    <p className="text-xs text-gray-500">{b.author}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{b.isbn}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{b.category}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    <p>{b.publisher}</p>
                    <p className="text-gray-400">{b.publishYear}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{b.availableCopies} / {b.totalCopies}</td>
                  <td className="px-4 py-3">
                    <span className={`badge text-[10px] ${b.availableCopies > 0 ? 'badge-available' : 'badge-borrowed'}`}>
                      {b.availableCopies > 0 ? 'Available' : 'Borrowed'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(b)} className="px-2.5 py-1 rounded-lg bg-amber-500 text-white text-xs font-medium hover:bg-amber-600 transition">Edit</button>
                      <button onClick={() => handleDelete(b.id)} className="px-2.5 py-1 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">{editing ? 'Edit Book' : 'Add New Book'}</h3>
            <div className="space-y-3">
              <div><label className="label">Title *</label><input className="input" required value={form.title} onChange={e => set('title', e.target.value)} /></div>
              <div><label className="label">Author *</label><input className="input" required value={form.author} onChange={e => set('author', e.target.value)} /></div>
              <div><label className="label">ISBN *</label><input className="input" required value={form.isbn} onChange={e => set('isbn', e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Category</label>
                  <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
                    {['Technology','Fiction','Science','History','Arts','Science Fiction','Non-fiction','Literary Fiction','Psychology','Philosophy'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label className="label">Total Copies</label><input type="number" min="1" className="input" value={form.totalCopies} onChange={e => set('totalCopies', e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Publisher</label><input className="input" value={form.publisher} onChange={e => set('publisher', e.target.value)} /></div>
                <div><label className="label">Year</label><input type="number" className="input" value={form.publishYear} onChange={e => set('publishYear', e.target.value)} /></div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSave} disabled={loading} className="btn-primary flex-1 justify-center">{loading ? 'Saving…' : 'Save Book'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
