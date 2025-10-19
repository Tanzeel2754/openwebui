import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_NEON_DATABASE_URL || process.env.DATABASE_URL || "")

export async function verifyDatabaseConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`
    return true
  } catch (error) {
    console.error("[v0] Database connection failed:", error)
    return false
  }
}

export { sql }
