"use client"

import { signOut } from "next-auth/react"
import { Plus, LogOut } from "lucide-react"

interface Chat {
  id: string
  name: string
  createdAt: string
}

interface ChatSidebarProps {
  chats: Chat[]
  selectedChatId: string | null
  onSelectChat: (chatId: string) => void
  onNewChat: () => void
  userName?: string
}

export default function ChatSidebar({ chats, selectedChatId, onSelectChat, onNewChat, userName }: ChatSidebarProps) {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
        >
          <Plus size={20} />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full text-left px-4 py-2 rounded-lg transition truncate ${
              selectedChatId === chat.id ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            {chat.name}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-gray-700 space-y-2">
        <div className="text-sm text-gray-400">{userName}</div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-sm"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  )
}
