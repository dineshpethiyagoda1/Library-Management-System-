// app/page.tsx
// Root route — automatically redirect users to login page
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/auth/login')
}