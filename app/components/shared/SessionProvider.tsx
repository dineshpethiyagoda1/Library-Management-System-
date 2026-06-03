// components/shared/SessionProvider.tsx
'use client'

// Wraps the app with NextAuth SessionProvider for client-side session access
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}