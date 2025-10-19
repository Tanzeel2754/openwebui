import { getServerSession } from "next-auth"
import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const chats = await sql`
      SELECT c.*, 
        (SELECT json_agg(json_build_object('id', m.id, 'content', m.content, 'role', m.role, 'createdAt', m.created_at))
         FROM messages m WHERE m.chat_id = c.id ORDER BY m.created_at ASC LIMIT 1) as messages
      FROM chats c
      WHERE c.user_id = ${session.user.id}
      ORDER BY c.created_at DESC
    `

    return NextResponse.json(chats)
  } catch (error) {
    console.error("Error fetching chats:", error)
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name } = await request.json()

    const result = await sql`
      INSERT INTO chats (user_id, name, created_at, updated_at)
      VALUES (${session.user.id}, ${name || "New Chat"}, NOW(), NOW())
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating chat:", error)
    return NextResponse.json({ error: "Failed to create chat" }, { status: 500 })
  }
}
