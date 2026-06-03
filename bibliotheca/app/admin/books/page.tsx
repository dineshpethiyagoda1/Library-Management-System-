// app/admin/books/page.tsx
import { db } from '@/lib/db'
import AdminBooksClient from '@/components/admin/AdminBooksClient'

export default async function AdminBooksPage() {
  const books = await db.book.findMany({ orderBy: { title: 'asc' } })
  return <AdminBooksClient books={books} />
}
