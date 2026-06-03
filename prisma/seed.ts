// prisma/seed.ts
// Populates the database with realistic demo data
// Run with: npm run db:seed

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ── Clear existing data ──────────────────────────────────────────────────
  await prisma.transaction.deleteMany()
  await prisma.bookRequest.deleteMany()
  await prisma.book.deleteMany()
  await prisma.user.deleteMany()

  // ── Passwords ────────────────────────────────────────────────────────────
  const memberPass  = await bcrypt.hash('member123',  10)
  const staffPass   = await bcrypt.hash('staff123',   10)
  const adminPass   = await bcrypt.hash('admin123',   10)

  // ── Users ────────────────────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      firstName: 'Alex',
      lastName: 'Admin',
      email: 'admin@bibliotheca.com',
      password: adminPass,
      role: 'ADMIN',
    },
  })

  const staff = await prisma.user.create({
    data: {
      firstName: 'Sam',
      lastName: 'Staff',
      email: 'staff@bibliotheca.com',
      password: staffPass,
      role: 'STAFF',
    },
  })

  const aisha = await prisma.user.create({
    data: {
      firstName: 'Aisha',
      lastName: 'Rahman',
      email: 'aisha@example.com',
      password: memberPass,
      role: 'MEMBER',
      phone: '+1 234-567-8901',
    },
  })

  await prisma.user.createMany({
    data: [
      { firstName: 'Michael', lastName: 'Chen', email: 'michael@example.com', password: memberPass, role: 'MEMBER', phone: '+1 234-567-8902' },
      { firstName: 'Emily',   lastName: 'Davis', email: 'emily@example.com', password: memberPass, role: 'MEMBER', phone: '+1 234-567-8903' },
      { firstName: 'James',   lastName: 'Wilson', email: 'james@example.com', password: memberPass, role: 'MEMBER', phone: '+1 234-567-8904' },
      { firstName: 'Lisa',    lastName: 'Anderson', email: 'lisa@example.com', password: memberPass, role: 'MEMBER', phone: '+1 234-567-8905' },
      { firstName: 'Robert',  lastName: 'Brown', email: 'robert@example.com', password: memberPass, role: 'MEMBER', phone: '+1 234-567-8906' },
    ],
  })

  // ── Books ────────────────────────────────────────────────────────────────
  await prisma.book.createMany({
    data: [
      { title: 'Dune',                     author: 'Frank Herbert',     isbn: '978-0441013593', category: 'Science Fiction', publisher: 'Ace Books',        publishYear: 1965, totalCopies: 5, available: 4, coverEmoji: '🏜️',  coverColor: '#fef3c7' },
      { title: 'The Midnight Library',     author: 'Matt Haig',         isbn: '978-0525559474', category: 'Literary Fiction', publisher: 'Viking',          publishYear: 2020, totalCopies: 3, available: 1, coverEmoji: '📚',  coverColor: '#e0f2fe' },
      { title: 'Sapiens',                  author: 'Yuval Noah Harari', isbn: '978-0062316097', category: 'Non-fiction',     publisher: 'Harper',           publishYear: 2011, totalCopies: 4, available: 2, coverEmoji: '🌍',  coverColor: '#f0fdf4' },
      { title: 'Project Hail Mary',        author: 'Andy Weir',         isbn: '978-0593135204', category: 'Science Fiction', publisher: 'Ballantine Books', publishYear: 2021, totalCopies: 3, available: 3, coverEmoji: '🚀',  coverColor: '#fae8ff' },
      { title: 'Thinking, Fast and Slow',  author: 'Daniel Kahneman',   isbn: '978-0374533557', category: 'Psychology',      publisher: 'Farrar',           publishYear: 2011, totalCopies: 2, available: 2, coverEmoji: '🧠',  coverColor: '#fff1f2' },
      { title: '1984',                     author: 'George Orwell',     isbn: '978-0451524935', category: 'Literary Fiction', publisher: 'Signet Classic',   publishYear: 1949, totalCopies: 10, available: 7, coverEmoji: '👁️', coverColor: '#f3f4f6' },
      { title: 'A Brief History of Time',  author: 'Stephen Hawking',   isbn: '978-0553380163', category: 'Non-fiction',     publisher: 'Bantam',           publishYear: 1988, totalCopies: 5, available: 4, coverEmoji: '💻',  coverColor: '#e0e7ff' },
      { title: 'The Selfish Gene',         author: 'Richard Dawkins',   isbn: '978-0198788607', category: 'Non-fiction',     publisher: 'Oxford',           publishYear: 1976, totalCopies: 3, available: 3, coverEmoji: '🧬',  coverColor: '#f5f5f4' },
      { title: 'Meditations',              author: 'Marcus Aurelius',   isbn: '978-0140449334', category: 'Philosophy',      publisher: 'Penguin Classics', publishYear: 180,  totalCopies: 4, available: 4, coverEmoji: '🏛️',  coverColor: '#ffedd5' },
      { title: 'Clean Code',               author: 'Robert C. Martin',  isbn: '978-0132350884', category: 'Technology',     publisher: 'Prentice Hall',    publishYear: 2008, totalCopies: 5, available: 3, coverEmoji: '💡',  coverColor: '#fef08a' },
      { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', category: 'Technology',    publisher: 'MIT Press',        publishYear: 2009, totalCopies: 8, available: 2, coverEmoji: '⚙️',  coverColor: '#e2e8f0' },
    ],
  })

  // ── Fetch books for relations ─────────────────────────────────────────────
  const dune      = await prisma.book.findUnique({ where: { isbn: '978-0441013593' } })
  const midnight  = await prisma.book.findUnique({ where: { isbn: '978-0525559474' } })
  const sapiens   = await prisma.book.findUnique({ where: { isbn: '978-0062316097' } })
  const orwell    = await prisma.book.findUnique({ where: { isbn: '978-0451524935' } })

  // ── Transactions ─────────────────────────────────────────────────────────
  const now = new Date()
  const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000)
  const daysFromNow = (n: number) => new Date(now.getTime() + n * 86400000)

  if (midnight && sapiens) {
    // Aisha's active borrows
    await prisma.transaction.create({
      data: {
        userId: aisha.id, bookId: midnight.id,
        issueDate: daysAgo(6), dueDate: daysFromNow(15),
        status: 'ACTIVE',
      },
    })
    await prisma.transaction.create({
      data: {
        userId: aisha.id, bookId: sapiens.id,
        issueDate: daysAgo(8), dueDate: daysFromNow(13),
        status: 'ACTIVE',
      },
    })
  }

  if (dune) {
    // Returned on time
    await prisma.transaction.create({
      data: {
        userId: aisha.id, bookId: dune.id,
        issueDate: daysAgo(14), dueDate: daysAgo(4),
        returnDate: daysAgo(6),
        status: 'RETURNED',
      },
    })
  }

  if (orwell) {
    // Overdue — triggers a fine
    await prisma.transaction.create({
      data: {
        userId: aisha.id, bookId: orwell.id,
        issueDate: daysAgo(58), dueDate: daysAgo(38),
        returnDate: daysAgo(35),
        status: 'OVERDUE',
        fine: 1.50,
        finePaid: true,
      },
    })
  }

  // ── Book Requests ─────────────────────────────────────────────────────────
  const hailMary = await prisma.book.findFirst({ where: { title: 'Project Hail Mary' } })
  const kahneman = await prisma.book.findFirst({ where: { title: 'Thinking, Fast and Slow' } })

  if (hailMary) {
    await prisma.bookRequest.create({
      data: {
        userId: aisha.id, bookId: hailMary.id,
        title: 'Project Hail Mary', author: 'Andy Weir',
        category: 'Science Fiction', status: 'PENDING',
      },
    })
  }

  if (kahneman) {
    await prisma.bookRequest.create({
      data: {
        userId: aisha.id, bookId: kahneman.id,
        title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman',
        category: 'Psychology', status: 'PENDING',
      },
    })
  }

  console.log('✅ Seed complete!')
  console.log('')
  console.log('Demo accounts:')
  console.log('  Member  → aisha@example.com    / member123')
  console.log('  Staff   → staff@bibliotheca.com / staff123')
  console.log('  Admin   → admin@bibliotheca.com  / admin123')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })