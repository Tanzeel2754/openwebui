export const LOCAL_MODEL_CONFIG = {
  // Default local model server (Ollama)
  baseUrl: process.env.LOCAL_MODEL_URL || 'http://localhost:11434',
  
  // Default model to use
  defaultModel: process.env.LOCAL_MODEL_NAME || 'llama2',
  
  // API endpoints
  endpoints: {
    generate: '/api/generate',
    chat: '/api/chat',
    models: '/api/tags'
  }
}

export const getLocalModelUrl = (endpoint: string) => {
  return `${LOCAL_MODEL_CONFIG.baseUrl}${endpoint}`
}
