"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import ChatSidebar from "./chat-sidebar"
import ChatWindow from "./chat-window"
import ModelStatus from "./model-status"

interface Chat {
  id: string
  name: string
  createdAt: string
}

export default function ChatInterface() {
  const { data: session } = useSession()
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChats()
  }, [])

  const fetchChats = async () => {
    try {
      const response = await fetch("/api/chats")
      if (response.ok) {
        const data = await response.json()
        setChats(data)
        if (data.length > 0) {
          setSelectedChatId(data[0].id)
        }
      }
    } catch (error) {
      console.error("Error fetching chats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewChat = async () => {
    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "New Chat" }),
      })
      if (response.ok) {
        const newChat = await response.json()
        setChats([newChat, ...chats])
        setSelectedChatId(newChat.id)
      }
    } catch (error) {
      console.error("Error creating chat:", error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-white">
      <ChatSidebar
        chats={chats}
        selectedChatId={selectedChatId}
        onSelectChat={setSelectedChatId}
        onNewChat={handleNewChat}
        userName={session?.user?.name || session?.user?.email}
      />
      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          <ModelStatus />
        </div>
        {selectedChatId && <ChatWindow chatId={selectedChatId} />}
      </div>
    </div>
  )
}
