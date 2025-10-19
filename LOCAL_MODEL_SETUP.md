# Local Model Setup Guide

This chatbot is now configured to work with local models running on your machine. Here's how to set it up:

## Supported Local Model Servers

### 1. Ollama (Recommended)
Ollama is the easiest way to run local models.

#### Installation:
```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows
# Download from https://ollama.ai/download
```

#### Usage:
```bash
# Start Ollama (it runs on http://localhost:11434 by default)
ollama serve

# Pull a model (in another terminal)
ollama pull llama2
# or
ollama pull mistral
# or
ollama pull codellama
```

### 2. LM Studio
- Download from https://lmstudio.ai/
- Start the local server (usually runs on http://localhost:1234)

### 3. Text Generation WebUI
- Install from https://github.com/oobabooga/text-generation-webui
- Start with API enabled (usually runs on http://localhost:5000)

## Environment Configuration

Create a `.env.local` file in your project root:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/chatbot_db"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Local Model Configuration
LOCAL_MODEL_URL="http://localhost:11434"  # Ollama default
LOCAL_MODEL_NAME="llama2"                 # Model name to use
```

## Default Configuration

The chatbot is configured with these defaults:
- **Local Model URL**: `http://localhost:11434` (Ollama default)
- **Default Model**: `llama2`
- **API Endpoints**: 
  - Chat: `/api/chat`
  - Models: `/api/tags`

## Testing the Setup

1. Start your local model server (e.g., Ollama)
2. Start the chatbot: `npm run dev`
3. Check the model status indicator in the chat interface
4. If connected (green checkmark), you can start chatting!

## Troubleshooting

### Model Not Connected
- Ensure your local model server is running
- Check the URL in `.env.local` matches your server
- Try refreshing the model status in the UI

### No Response from Model
- Verify the model name exists in your local server
- Check server logs for errors
- Ensure the model is fully loaded

### Performance Issues
- Try smaller models first (e.g., `llama2:7b` instead of `llama2:13b`)
- Close other resource-intensive applications
- Consider using GPU acceleration if available

## Available Models (Ollama Examples)

Popular models you can try:
```bash
# General purpose
ollama pull llama2
ollama pull mistral
ollama pull codellama

# Smaller/faster models
ollama pull llama2:7b
ollama pull mistral:7b

# Code-focused
ollama pull codellama
ollama pull wizardcoder
```

## Custom Configuration

You can modify the configuration in `lib/config.ts`:
- Change default model
- Adjust API endpoints
- Add custom headers or authentication
