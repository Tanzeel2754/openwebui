'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

interface ModelStatus {
  isConnected: boolean
  models: string[]
  defaultModel: string
  error?: string
}

export default function ModelStatus() {
  const [status, setStatus] = useState<ModelStatus>({
    isConnected: false,
    models: [],
    defaultModel: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkModelStatus()
  }, [])

  const checkModelStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/local-model/models')
      if (response.ok) {
        const data = await response.json()
        setStatus(data)
      } else {
        setStatus({
          isConnected: false,
          models: [],
          defaultModel: '',
          error: 'Failed to fetch model status'
        })
      }
    } catch (error) {
      setStatus({
        isConnected: false,
        models: [],
        defaultModel: '',
        error: 'Unable to connect to local model server'
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Loader size={16} className="animate-spin" />
        <span>Checking local model...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {status.isConnected ? (
        <>
          <CheckCircle size={16} className="text-green-500" />
          <span className="text-green-600">
            Local model connected ({status.defaultModel})
          </span>
          {status.models.length > 1 && (
            <span className="text-gray-500">
              ({status.models.length} models available)
            </span>
          )}
        </>
      ) : (
        <>
          <XCircle size={16} className="text-red-500" />
          <span className="text-red-600">
            Local model offline
          </span>
          {status.error && (
            <span className="text-gray-500">({status.error})</span>
          )}
        </>
      )}
      <button
        onClick={checkModelStatus}
        className="ml-2 text-blue-600 hover:text-blue-800 underline"
      >
        Refresh
      </button>
    </div>
  )
}
