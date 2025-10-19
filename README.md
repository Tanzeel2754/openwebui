# Chatbot UI - PostgreSQL Edition

A full-stack AI chatbot application built with Next.js, TypeScript, and PostgreSQL. This is a PostgreSQL-based alternative to the original Supabase-backed chatbot-ui.

## Features

- User authentication with email and password
- Create and manage multiple chat sessions
- Real-time message storage and retrieval
- Clean, modern UI with Tailwind CSS
- Full TypeScript support
- PostgreSQL database with Prisma ORM

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Credentials provider
- **UI Components**: Lucide React icons

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+ (local or hosted)
- Git

## Setup Instructions

### 1. Clone and Install Dependencies

\`\`\`bash
git clone <your-repo-url>
cd chatbot-ui-postgres
npm install
\`\`\`

### 2. Set Up PostgreSQL Database

#### Option A: Local PostgreSQL

\`\`\`bash
# Create a new database
createdb chatbot_ui

# Or using psql
psql -U postgres
CREATE DATABASE chatbot_ui;
\`\`\`

#### Option B: Hosted PostgreSQL (Neon, Railway, etc.)

Get your connection string from your provider.

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/chatbot_ui"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# AI Model API Keys (optional, for future integration)
OPENAI_API_KEY="your-openai-key"
ANTHROPIC_API_KEY="your-anthropic-key"
GROQ_API_KEY="your-groq-key"
\`\`\`

Generate a secure NEXTAUTH_SECRET:
\`\`\`bash
openssl rand -base64 32
\`\`\`

### 4. Run Database Migrations

\`\`\`bash
# Push the Prisma schema to your database
npm run db:push

# Or create a migration
npm run db:migrate
\`\`\`

### 5. Start the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Users Table
- `id`: Unique identifier (CUID)
- `email`: User email (unique)
- `password`: Hashed password
- `name`: User's full name
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### Chats Table
- `id`: Unique identifier (CUID)
- `userId`: Reference to user
- `name`: Chat session name
- `createdAt`: Chat creation timestamp
- `updatedAt`: Last update timestamp

### Messages Table
- `id`: Unique identifier (CUID)
- `chatId`: Reference to chat
- `userId`: Reference to user
- `role`: Message role ("user" or "assistant")
- `content`: Message content
- `createdAt`: Message creation timestamp

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Chats
- `GET /api/chats` - Get all chats for the current user
- `POST /api/chats` - Create a new chat

### Messages
- `GET /api/chats/[chatId]/messages` - Get all messages in a chat
- `POST /api/chats/[chatId]/messages` - Add a message to a chat

## Development

### Prisma Studio

View and manage your database with Prisma Studio:

\`\`\`bash
npm run db:studio
\`\`\`

### Database Migrations

Create a new migration after schema changes:

\`\`\`bash
npm run db:migrate
\`\`\`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
4. Deploy

### Deploy to Other Platforms

The app is compatible with any Node.js hosting platform (Railway, Render, Heroku, etc.).

## Connecting AI Models

To integrate AI models (OpenAI, Anthropic, Groq, etc.):

1. Add your API key to `.env.local`
2. Update the `handleSendMessage` function in `components/chat-window.tsx`
3. Use the AI SDK or your preferred library to call the model API

Example with OpenAI:
\`\`\`typescript
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

const { text } = await generateText({
  model: openai("gpt-4"),
  prompt: userMessage,
});
\`\`\`

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check PostgreSQL is running
- Ensure firewall allows connections

### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again

### Migration Issues
\`\`\`bash
# Reset database (WARNING: deletes all data)
npm run db:push -- --force-reset

# Or manually drop and recreate
dropdb chatbot_ui
createdb chatbot_ui
npm run db:push
\`\`\`

## File Structure

\`\`\`
chatbot-ui-postgres/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/
│   │   │   └── register/
│   │   └── chats/
│   ├── login/
│   ├── register/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── chat-interface.tsx
│   ├── chat-sidebar.tsx
│   └── chat-window.tsx
├── lib/
│   ├── auth.ts
│   └── db.ts
├── prisma/
│   └── schema.prisma
├── scripts/
│   └── init-db.sql
├── .env.local
├── next.config.mjs
├── package.json
├── tsconfig.json
└── README.md
\`\`\`

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the original chatbot-ui repository
3. Open an issue on GitHub

## Future Enhancements

- [ ] AI model integration (OpenAI, Anthropic, Groq)
- [ ] Chat history search
- [ ] User settings and preferences
- [ ] Export chat history
- [ ] Dark mode toggle
- [ ] Real-time collaboration
- [ ] File upload support
- [ ] Custom system prompts
