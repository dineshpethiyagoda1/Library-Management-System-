// lib/utils.ts
import { NextResponse } from 'next/server'

// Generate standardized library card numbers (e.g., LIB00001, LIB00002)
export function generateMembershipId(counter: number): string {
  return `LIB${String(counter).padStart(5, '0')}`
}

// Standard API helper for JSON responses
export function apiSuccess(data: any, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function apiError(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status })
}

// Calculate fine: e.g., $0.50 per day past the due date
export function calculateFine(dueDate: Date): number {
  const now = new Date()
  const due = new Date(dueDate)
  
  if (now <= due) return 0
  
  const diffTime = Math.abs(now.getTime() - due.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays * 0.50 // $0.50 fine per day
}