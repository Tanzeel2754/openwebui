import { NextRequest, NextResponse } from 'next/server'
import { localModelService } from '@/lib/local-model'

export async function POST(request: NextRequest) {
  try {
    const { messages, model } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 })
    }

    const response = await localModelService.generateResponse(messages, model)
    
    return NextResponse.json({ 
      response,
      model: model || 'default'
    })
  } catch (error) {
    console.error('Error in local model API:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate response'
    }, { status: 500 })
  }
}
