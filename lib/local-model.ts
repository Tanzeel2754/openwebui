import { LOCAL_MODEL_CONFIG, getLocalModelUrl } from './config'

export interface LocalModelMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface LocalModelResponse {
  model: string
  created_at: string
  response: string
  done: boolean
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export class LocalModelService {
  private baseUrl: string
  private defaultModel: string

  constructor() {
    this.baseUrl = LOCAL_MODEL_CONFIG.baseUrl
    this.defaultModel = LOCAL_MODEL_CONFIG.defaultModel
  }

  async generateResponse(messages: ChatMessage[], model?: string): Promise<string> {
    try {
      const response = await fetch(getLocalModelUrl('/api/chat'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model || this.defaultModel,
          messages: messages,
          stream: false
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.message?.content || data.response || 'No response generated'
    } catch (error) {
      console.error('Error calling local model:', error)
      throw new Error(`Failed to get response from local model: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch(getLocalModelUrl('/api/tags'))
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.models?.map((model: any) => model.name) || []
    } catch (error) {
      console.error('Error fetching available models:', error)
      return []
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(getLocalModelUrl('/api/tags'))
      return response.ok
    } catch (error) {
      console.error('Local model connection test failed:', error)
      return false
    }
  }
}

export const localModelService = new LocalModelService()
