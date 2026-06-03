// app/admin/books/page.tsx
'use client'

import { useEffect, useState } from 'react'

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  totalCopies: number
  available: number
  coverEmoji: string
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [isbn, setIsbn] = useState('')
  const [category, setCategory] = useState('')
  const [copies, setCopies] = useState(1)

  useEffect(() => {
    // Mock seed books data layout
    const seedBooks: Book[] = [
      { id: '1', title: 'Dune', author: 'Frank Herbert', isbn: '978-0441013593', category: 'Science Fiction', totalCopies: 5, available: 4, coverEmoji: '🏜️' },
      { id: '2', title: 'The Midnight Library', author: 'Matt Haig', isbn: '978-0525559474', category: 'Literary Fiction', totalCopies: 3, available: 1, coverEmoji: '📚' },
      { id: '3', title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '978-0062316097', category: 'Non-fiction', totalCopies: 4, available: 2, coverEmoji: '🌍' },
      { id: '4', title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', category: 'Technology', totalCopies: 5, available: 3, coverEmoji: '💡' },
    ]
    setBooks(seedBooks)
    setLoading(false)
  }, [])

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !author || !isbn) return

    const newBook: Book = {
      id: String(books.length + 1),
      title,
      author,
      isbn,
      category: category || 'General',
      totalCopies: Number(copies),
      available: Number(copies),
      coverEmoji: '📖'
    }

    setBooks([newBook, ...books])
    setTitle('')
    setAuthor('')
    setIsbn('')
    setCategory('')
    setCopies(1)
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading catalog management...</div>

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Add Book Form */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-6">
          <h2 className="text-xl font-bold font-serif mb-4 text-gray-800">Add New Book Title</h2>
          <form onSubmit={handleAddBook} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Book Title *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-gray-900" placeholder="e.g. Project Hail Mary" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Author *</label>
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-gray-900" placeholder="e.g. Andy Weir" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">ISBN *</label>
              <input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-gray-900" placeholder="978-0593135204" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Category</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-gray-900" placeholder="Sci-Fi" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Total Copies</label>
                <input type="number" min={1} value={copies} onChange={(e) => setCopies(Number(e.target.value))} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-gray-900" />
              </div>
            </div>
            <button type="submit" className="w-full bg-gray-900 text-white font-medium text-sm py-2.5 rounded-lg hover:bg-gray-800 transition-colors shadow-sm pt-2">
              Add Book to Catalog
            </button>
          </form>
        </div>
      </div>

      {/* Right: Books Inventory List */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-50 font-serif font-bold text-lg text-gray-800">Library Catalog Assets</div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                <th className="p-4">Book Details</th>
                <th className="p-4">ISBN</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-center">Available</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
              {books.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50/40">
                  <td className="p-4 flex items-center space-x-3">
                    <span className="text-2xl">{book.coverEmoji}</span>
                    <div>
                      <div className="font-semibold text-gray-900">{book.title}</div>
                      <div className="text-xs text-gray-400">{book.author}</div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-500 font-mono text-xs">{book.isbn}</td>
                  <td className="p-4"><span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">{book.category}</span></td>
                  <td className="p-4 text-center font-semibold text-gray-900">{book.available} / {book.totalCopies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}