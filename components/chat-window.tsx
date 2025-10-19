"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Send } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: string
}

interface ChatWindowProps {
  chatId: string
}

export default function ChatWindow({ chatId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()
  }, [chatId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chats/${chatId}/messages`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input
    setInput("")
    setLoading(true)

    try {
      // Save user message
      const userResponse = await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "user", content: userMessage }),
      })

      if (userResponse.ok) {
        const savedMessage = await userResponse.json()
        setMessages((prev) => [...prev, savedMessage])

        // Prepare messages for local model (include conversation history)
        const conversationMessages = [
          ...messages,
          { role: "user", content: userMessage }
        ].map(msg => ({
          role: msg.role,
          content: msg.content
        }))

        // Call local model API
        const localModelResponse = await fetch('/api/local-model/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: conversationMessages
          })
        })

        if (localModelResponse.ok) {
          const modelData = await localModelResponse.json()
          const assistantContent = modelData.response || 'No response from local model'

          // Save assistant message
          const assistantResponse = await fetch(`/api/chats/${chatId}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              role: "assistant",
              content: assistantContent,
            }),
          })

          if (assistantResponse.ok) {
            const assistantMessage = await assistantResponse.json()
            setMessages((prev) => [...prev, assistantMessage])
          }
        } else {
          // Fallback if local model is not available
          const errorData = await localModelResponse.json()
          const assistantResponse = await fetch(`/api/chats/${chatId}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              role: "assistant",
              content: `Local model error: ${errorData.error || 'Unable to connect to local model'}. Please ensure your local model server (e.g., Ollama) is running.`,
            }),
          })

          if (assistantResponse.ok) {
            const assistantMessage = await assistantResponse.json()
            setMessages((prev) => [...prev, assistantMessage])
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error)
      // Save error message
      const errorResponse = await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "assistant",
          content: "Error: Unable to process your message. Please try again.",
        }),
      })

      if (errorResponse.ok) {
        const errorMessage = await errorResponse.json()
        setMessages((prev) => [...prev, errorMessage])
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Start a conversation</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}
