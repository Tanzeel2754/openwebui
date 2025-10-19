import { createUser, getUserByEmail } from "@/lib/auth"
import { verifyDatabaseConnection } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const isConnected = await verifyDatabaseConnection()
    if (!isConnected) {
      return NextResponse.json(
        {
          error:
            "Database connection failed. Please ensure PostgreSQL is running and NEON_NEON_DATABASE_URL is configured correctly.",
        },
        { status: 503 },
      )
    }

    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const user = await createUser(email, password, name)

    return NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] Error registering user:", errorMessage)

    if (errorMessage.includes("connect") || errorMessage.includes("ECONNREFUSED")) {
      return NextResponse.json(
        {
          error:
            "Database connection failed. Please ensure PostgreSQL is running and DATABASE_URL is configured correctly.",
        },
        { status: 503 },
      )
    }

    if (errorMessage.includes("relation") || errorMessage.includes("does not exist")) {
      return NextResponse.json(
        { error: "Database tables not initialized. Please run 'npm run db:push' to create the database schema." },
        { status: 500 },
      )
    }

    return NextResponse.json({ error: "Failed to register user: " + errorMessage }, { status: 500 })
  }
}
