import { verifyDatabaseConnection } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const isConnected = await verifyDatabaseConnection()

    if (!isConnected) {
      return NextResponse.json(
        {
          status: "error",
          message: "Database connection failed",
          details: "PostgreSQL is not responding. Check your NEON_NEON_DATABASE_URL environment variable.",
        },
        { status: 503 },
      )
    }

    return NextResponse.json({
      status: "ok",
      message: "Database connection successful",
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      {
        status: "error",
        message: "Health check failed",
        details: errorMessage,
      },
      { status: 503 },
    )
  }
}
