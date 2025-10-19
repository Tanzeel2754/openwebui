import { hash, compare } from "bcryptjs"
import { sql } from "./db"

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

export async function getUserByEmail(email: string) {
  try {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`
    return result[0] || null
  } catch (error) {
    console.error("[v0] Error fetching user:", error)
    return null
  }
}

export async function createUser(email: string, password: string, name?: string) {
  try {
    const hashedPassword = await hashPassword(password)
    const result = await sql`
      INSERT INTO users (email, password, name, created_at, updated_at)
      VALUES (${email}, ${hashedPassword}, ${name || null}, NOW(), NOW())
      RETURNING id, email, name
    `
    return result[0]
  } catch (error) {
    console.error("[v0] Error creating user:", error)
    throw error
  }
}
