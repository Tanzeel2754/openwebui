import { NextResponse } from 'next/server'
import { localModelService } from '@/lib/local-model'

export async function GET() {
  try {
    const models = await localModelService.getAvailableModels()
    const isConnected = await localModelService.testConnection()
    
    return NextResponse.json({ 
      models,
      isConnected,
      defaultModel: process.env.LOCAL_MODEL_NAME || 'llama2'
    })
  } catch (error) {
    console.error('Error fetching models:', error)
    return NextResponse.json({ 
      models: [],
      isConnected: false,
      error: error instanceof Error ? error.message : 'Failed to fetch models'
    }, { status: 500 })
  }
}
