// app/user/request-book/page.tsx
'use client'

import { useState } from 'react'

export default function RequestBookPage() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [isbn, setIsbn] = useState('')
  const [category, setCategory] = useState('')
  const [reason, setReason] = useState('')
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) {
      setStatusMsg({ type: 'error', text: 'Book Title is required.' })
      return
    }

    // Demo success message trigger before handling database persistence via fetch
    setStatusMsg({ type: 'success', text: `Successfully requested "${title}". Our staff will review it soon!` })
    setTitle('')
    setAuthor('')
    setIsbn('')
    setCategory('')
    setReason('')
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-3xl font-bold font-serif mb-2 text-gray-800">Request a New Book</h1>
        <p className="text-gray-500 text-sm mb-6">Can't find what you're looking for? Suggest a book addition to our catalog.</p>

        {statusMsg.text && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-medium border ${
            statusMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-rose-50 text-rose-700 border-rose-100'
          }`}>
            {statusMsg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Book Title *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="e.g. The Hobbit" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="e.g. J.R.R. Tolkien" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ISBN (Optional)</label>
              <input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="978-x-xxx" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="Fiction, Tech, Science" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Suggestion</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none" placeholder="Why do you think we should add this book?"></placeholder>
          </div>

          <button type="submit" className="w-full bg-gray-900 text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors shadow-sm mt-2">
            Submit Book Request
          </button>
        </form>
      </div>
    </div>
  )
}