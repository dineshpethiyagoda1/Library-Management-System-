# 📚 Bibliotheca — Library Management System

A full-stack Library Management System built with **Next.js 14**, **Tailwind CSS**, **Prisma**, and **SQLite**. Designed for real-world use with three distinct portals: Member, Staff, and Admin.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Setup & Installation](#4-setup--installation)
5. [Database Schema](#5-database-schema)
6. [Authentication & Roles](#6-authentication--roles)
7. [API Reference](#7-api-reference)
8. [Feature Walkthrough](#8-feature-walkthrough)
9. [Default Credentials](#9-default-credentials)
10. [Best Practices](#10-best-practices)
11. [Customisation Guide](#11-customisation-guide)
12. [Deployment](#12-deployment)

---

## 1. Project Overview

Bibliotheca is a three-role library portal:

| Role    | Portal        | Key Features |
|---------|--------------|--------------|
| Member  | `/dashboard` | Browse catalog, request books, view borrowing history, fine calculator |
| Staff   | `/staff`     | Issue & return books, manage inventory and members |
| Admin   | `/admin`     | All staff features + reports, analytics, full control |

---

## 2. Tech Stack

| Layer       | Technology |
|-------------|-----------|
| Framework   | Next.js 14 (App Router) |
| Styling     | Tailwind CSS 3 |
| ORM         | Prisma 5 |
| Database    | SQLite (dev) / PostgreSQL (prod-ready) |
| Auth        | NextAuth.js v4 (JWT strategy) |
| Charts      | Recharts |
| Icons       | Lucide React |
| Validation  | Zod |
| Date utils  | date-fns |
| Language    | TypeScript |

---

## 3. Folder Structure

```
bibliotheca/
├── prisma/
│   ├── schema.prisma          # Database models
│   └── seed.js                # Sample data seeder
│
├── src/
│   ├── app/
│   │   ├── (auth)/            # Login & Register pages
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   │
│   │   ├── (user)/            # Member portal (role: MEMBER)
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── browse/page.tsx
│   │   │   ├── search/page.tsx
│   │   │   ├── history/page.tsx
│   │   │   ├── request/page.tsx
│   │   │   ├── return/page.tsx
│   │   │   └── membership/page.tsx
│   │   │
│   │   ├── (admin)/           # Admin portal (role: ADMIN)
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── books/page.tsx
│   │   │   ├── members/page.tsx
│   │   │   ├── transactions/page.tsx
│   │   │   └── reports/page.tsx
│   │   │
│   │   ├── (staff)/           # Staff portal (role: STAFF)
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── books/page.tsx
│   │   │   ├── members/page.tsx
│   │   │   └── issue-return/page.tsx
│   │   │
│   │   └── api/               # REST API routes
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── books/route.ts
│   │       ├── books/[id]/route.ts
│   │       ├── members/route.ts
│   │       ├── transactions/route.ts
│   │       ├── transactions/[id]/return/route.ts
│   │       ├── requests/route.ts
│   │       └── reports/route.ts
│   │
│   ├── components/
│   │   ├── ui/index.tsx        # Shared UI primitives
│   │   ├── layout/
│   │   │   ├── UserSidebar.tsx
│   │   │   └── AdminSidebar.tsx
│   │   └── admin/
│   │       └── AdminCharts.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── auth.ts             # NextAuth configuration
│   │   └── utils.ts            # Shared utilities
│   │
│   ├── hooks/index.ts          # Custom React hooks
│   └── types/index.ts          # TypeScript types
│
├── .env                        # Environment variables (template)
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 4. Setup & Installation

### Prerequisites

- Node.js 18+
- npm 9+ or yarn

### Step 1 — Clone and install

```bash
git clone https://github.com/your-org/bibliotheca.git
cd bibliotheca
npm install
```

### Step 2 — Environment variables

```bash
cp .env .env.local
```

Edit `.env.local`:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

> Generate a secret: `openssl rand -base64 32`

### Step 3 — Database setup

```bash
# Push schema to SQLite
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed with sample data
npm run db:seed
```

### Step 4 — Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 5. Database Schema

### Core Models

```
User             — accounts for all roles
  └── Membership — one-to-one, library card details

Book             — the catalog
  └── Transaction — issue/return records (many-to-many via joins)
  └── BookRequest  — member requests for books

Transaction      — tracks every book loan
BookRequest      — member-submitted book requests
```

### Enums

| Enum               | Values |
|--------------------|--------|
| `Role`             | MEMBER, STAFF, ADMIN |
| `MembershipType`   | STANDARD, PREMIUM, STUDENT, FACULTY |
| `MembershipStatus` | PENDING, ACTIVE, SUSPENDED, EXPIRED |
| `TransactionStatus`| ACTIVE, RETURNED, OVERDUE, LOST |
| `RequestStatus`    | PENDING, APPROVED, REJECTED, FULFILLED |

---

## 6. Authentication & Roles

NextAuth.js uses the **JWT** strategy. On login, the role is verified server-side:

```
Member form → must match role: MEMBER in DB
Staff form  → must match role: STAFF in DB
Admin form  → must match role: ADMIN in DB
```

Route groups enforce access:
- `(user)/layout.tsx`  — redirects non-MEMBER roles
- `(admin)/layout.tsx` — redirects non-ADMIN roles
- `(staff)/layout.tsx` — redirects MEMBER and ADMIN

API routes use `getServerSession(authOptions)` and check `session.user.role` before any write operation.

---

## 7. API Reference

All responses follow:
```json
{ "success": true, "data": { ... } }
{ "success": false, "error": "message" }
```

| Method | Endpoint                              | Auth          | Description |
|--------|---------------------------------------|---------------|-------------|
| GET    | `/api/books`                          | Public        | List/search books |
| POST   | `/api/books`                          | Staff/Admin   | Create book |
| GET    | `/api/books/:id`                      | Public        | Get single book |
| PATCH  | `/api/books/:id`                      | Staff/Admin   | Update book |
| DELETE | `/api/books/:id`                      | Admin only    | Delete book |
| GET    | `/api/members`                        | Staff/Admin   | List members |
| POST   | `/api/members`                        | Public        | Register member |
| GET    | `/api/transactions`                   | Authenticated | List transactions |
| POST   | `/api/transactions`                   | Staff/Admin   | Issue book |
| POST   | `/api/transactions/:id/return`        | Staff/Admin   | Return book |
| GET    | `/api/requests`                       | Authenticated | List book requests |
| POST   | `/api/requests`                       | Member        | Submit request |
| GET    | `/api/reports`                        | Staff/Admin   | Analytics data |

---

## 8. Feature Walkthrough

### Member Portal

**Dashboard** — Greeting, 4 stat cards (books read, borrowed, pending requests, fines), recent activity feed, reading progress with category breakdown.

**Browse Books** — Grid of all books with cover emoji/colour, category filter pills, availability badge, and a request button. Live search by title/author/ISBN.

**Borrow History** — Full table of past and active loans with issue date, due date, return date, status badge, and fine amount. Summary stats at the top.

**Request a Book** — Form to request any book by title/author/ISBN. Shows pending requests in the right panel with a step-by-step guide.

**Return Books** — Lists currently borrowed books. Fine calculator on the right: select a book and enter a hypothetical return date to preview the fine.

**New Membership** — Application form for library membership. Shows approval steps and benefits in a side panel.

### Admin / Staff Portal

**Dashboard** — 4 stat cards, monthly trend chart, books-by-category chart, recent activity feed, overdue books list.

**Books Management** — Full CRUD: searchable/filterable table, add book modal, edit modal, delete with active-loan protection.

**Members Management** — Searchable member table with membership status, type, validity, and books-issued count. Add-member modal.

**Issue / Return** — Left panel issues a book by Member ID + ISBN. Right panel processes a return. Active transactions table with one-click Return button and auto fine calculation.

**Reports** — 6 charts: issue/return trends, books by category, member distribution, most issued books, revenue overview, overdue report. Export button.

---

## 9. Default Credentials

After running `npm run db:seed`:

| Role   | Email                        | Password   |
|--------|------------------------------|------------|
| Admin  | admin@bibliotheca.com        | admin123   |
| Staff  | staff@bibliotheca.com        | staff123   |
| Member | aisha@example.com            | member123  |
| Member | sarah.j@university.edu       | member123  |
| Member | michael.chen@university.edu  | member123  |

> ⚠️ Change all passwords before any production deployment.

---

## 10. Best Practices

### Server vs Client Components

- Prefer **Server Components** for data fetching (pages, layouts).
- Use `'use client'` only for interactivity (forms, charts, state).

### Prisma

- Use the singleton pattern (`src/lib/prisma.ts`) — never `new PrismaClient()` per request.
- Wrap multi-step DB operations in `prisma.$transaction([...])` for atomicity.
- Keep migrations in `prisma/migrations/`; never edit them manually.

### Authentication

- Validate role on every API route with `getServerSession`.
- Never trust client-sent role claims; always read from the JWT.

### Error Handling

- API routes return consistent `{ success, data|error }` shapes.
- Client forms handle loading/error states to prevent double-submission.

### Fine Calculation

```ts
fine = max(0, daysBetween(dueDate, today)) × 0.50
```

Calculated in real-time on the client (fine calculator) and at return time on the server.

---

## 11. Customisation Guide

### Change fine rate
Edit `FINE_PER_DAY` in `.env` and update the `calculateFine` call in `src/lib/utils.ts`.

### Change loan period
Edit `LOAN_PERIOD_DAYS` in `.env` and the `computeDueDate` call in `src/lib/utils.ts`.

### Switch to PostgreSQL
1. Install `@prisma/client` PostgreSQL connector.
2. Update `prisma/schema.prisma`: `provider = "postgresql"`.
3. Set `DATABASE_URL` to your PostgreSQL connection string.
4. Run `npm run db:migrate`.

### Add a new role (e.g. Librarian)
1. Add `LIBRARIAN` to the `Role` enum in `schema.prisma`.
2. Run `prisma db push`.
3. Create `src/app/(librarian)/layout.tsx` with role guard.
4. Add nav items in a new sidebar component.

### Email notifications
Integrate [Resend](https://resend.com) or [Nodemailer](https://nodemailer.com) in API routes:
- After book issue → send due-date reminder.
- When overdue → send fine notification.

---

## 12. Deployment

### Vercel (recommended)

```bash
npm run build
```

1. Push to GitHub.
2. Import to [vercel.com](https://vercel.com).
3. Set environment variables in the Vercel dashboard.
4. Deploy.

> For production, swap SQLite for **PostgreSQL** (e.g. Neon, Supabase, Railway).

### Self-hosted (Docker)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t bibliotheca .
docker run -p 3000:3000 --env-file .env.local bibliotheca
```

---

## Contributing

1. Fork the repo.
2. Create a feature branch: `git checkout -b feat/my-feature`.
3. Commit your changes with clear messages.
4. Open a pull request.

## License

MIT — free to use and modify for personal or commercial projects.
