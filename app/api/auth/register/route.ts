// app/api/auth/register/route.ts
// Handles new member registration and automatic membership ID generation
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { generateMembershipId } from '@/lib/utils'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      address, 
      dateOfBirth,
      idType,
      idNumber,
      membershipType 
    } = body

    // 1. Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (email, password, name)' },
        { status: 400 }
      )
    }

    // 2. Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      )
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. Generate sequential membership ID (e.g., LIB2024001)
    // Count active memberships to get next sequence
    const memberCount = await db.membership.count()
    const membershipId = generateMembershipId(memberCount + 1)

    // 5. Create user and membership in a transaction
    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone,
          address,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          role: 'MEMBER',
        }
      })

      const membership = await tx.membership.create({
        data: {
          userId: user.id,
          membershipId,
          type: membershipType || 'STANDARD',
          status: 'PENDING', // Staff/Admin needs to approve
          idType: idType || 'National ID',
          idNumber,
          validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year default
        }
      })

      return { user, membership }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = result.user

    return NextResponse.json({
      success: true,
      message: 'Registration successful. Membership pending approval.',
      data: {
        user: userWithoutPassword,
        membership: result.membership
      }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}