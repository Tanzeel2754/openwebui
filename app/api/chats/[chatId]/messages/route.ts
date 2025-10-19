import { getServerSession } from "next-auth"
import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { chatId: string } }) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const messages = await sql`
      SELECT m.* FROM messages m
      JOIN chats c ON m.chat_id = c.id
      WHERE m.chat_id = ${params.chatId} AND c.user_id = ${session.user.id}
      ORDER BY m.created_at ASC
    `

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { chatId: string } }) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { role, content } = await request.json()

    const result = await sql`
      INSERT INTO messages (chat_id, user_id, role, content, created_at)
      VALUES (${params.chatId}, ${session.user.id}, ${role}, ${content}, NOW())
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
  }
}
