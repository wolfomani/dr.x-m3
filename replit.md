# Overview

This is a dr.x AI Chatbot application built with a modern full-stack architecture. The application provides an intelligent chat interface that supports both Arabic and English languages, featuring real-time conversations with the DeepSeek AI API. The system uses a React frontend with shadcn/ui components, an Express.js backend, and PostgreSQL database with Drizzle ORM for data persistence. The interface has been redesigned to match the elegant dr.x dark theme with purple branding.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared code:

- **Frontend**: React with TypeScript, Vite bundler, and shadcn/ui component library
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Styling**: Tailwind CSS with custom Arabic/RTL support
- **State Management**: TanStack Query for server state management
- **Development**: Vite dev server with HMR and Replit integration

## Key Components

### Frontend Architecture
- **React Router**: Using wouter for lightweight client-side routing
- **UI Components**: Complete shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for API calls and caching
- **Language Support**: RTL support for Arabic with direction-aware layouts

### Backend Architecture
- **Express.js**: RESTful API server with middleware for logging and error handling
- **Database Layer**: Drizzle ORM with PostgreSQL using Neon Database serverless
- **Storage Abstraction**: Interface-based storage layer with in-memory fallback
- **API Integration**: DeepSeek AI API for chat responses
- **Development**: Vite middleware integration for seamless development experience

### Database Schema
- **Users Table**: Basic user authentication structure (id, username, password)
- **Messages Table**: Chat message storage (id, content, isUser, timestamp, sessionId)
- **Type Safety**: Drizzle-zod integration for runtime validation

## Data Flow

1. **Chat Interface**: User sends message through React chat component
2. **API Call**: Frontend makes POST request to `/api/messages` endpoint
3. **Message Storage**: User message saved to PostgreSQL database
4. **AI Processing**: Server calls DeepSeek API with conversation history
5. **Response Storage**: AI response saved to database
6. **Real-time Updates**: Frontend receives both user and AI messages
7. **State Management**: TanStack Query handles caching and optimistic updates

## External Dependencies

### Core Technologies
- **Database**: Neon Database (PostgreSQL serverless)
- **AI Service**: DeepSeek API for intelligent responses
- **UI Framework**: Radix UI primitives for accessible components
- **Build Tools**: Vite for fast development and building
- **Development**: Replit environment with custom plugins

### Key Libraries
- **Frontend**: React, TanStack Query, wouter, date-fns, Tailwind CSS
- **Backend**: Express, Drizzle ORM, connect-pg-simple for sessions
- **Validation**: Zod for runtime type checking
- **Styling**: Radix UI, class-variance-authority, clsx for utility classes

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot module replacement with proxy to Express backend
- **Database**: Environment variable configuration for DATABASE_URL
- **API Keys**: DeepSeek API key required via DEEPSEEK_API_KEY environment variable

### Production Build
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations stored in `/migrations` directory
- **Environment**: NODE_ENV-based configuration switching

### Key Configuration Files
- **drizzle.config.ts**: Database connection and migration settings
- **vite.config.ts**: Frontend build configuration with aliases
- **package.json**: Scripts for development, building, and database operations
- **components.json**: shadcn/ui configuration for component generation

The application is designed for easy deployment on platforms like Replit, with built-in support for development banners and runtime error overlays. The modular architecture allows for easy scaling and maintenance while providing a smooth user experience for multilingual chat interactions.

## Recent Changes (January 2025)

- ✅ Updated to dr.x branding with elegant dark theme design
- ✅ Redesigned chat interface with purple accent colors (#6a5acd)
- ✅ Created custom dr.x logo SVG component
- ✅ Updated chat bubbles with minimal design and user avatars
- ✅ Implemented dark background with proper contrast ratios
- ✅ Added action buttons (Search, Deep Think R1) in input area
- ✅ Modernized header with clean navigation
- ✅ Improved typing indicator with spinner animation
- ✅ Maintained full DeepSeek API integration functionality
- ✅ Preserved Arabic RTL support and bilingual capabilities

### DeepSeek-R1 Integration (January 11, 2025)
- ✅ Implemented full DeepSeek-R1 API support with proper model selection
- ✅ Added deep thinking mode toggle for manual and automatic activation
- ✅ Configured temperature 0.6 and max tokens 32768 for optimal R1 performance
- ✅ Removed system prompts as per DeepSeek-R1 official guidelines
- ✅ Added mathematical problem detection with step-by-step reasoning prompts
- ✅ Enhanced typing indicator to show DeepSeek-R1 thinking mode
- ✅ Implemented thinking pattern enforcement for better reasoning quality
- ✅ Added specialized UI elements for deep thinking status visualization
- ✅ Created comprehensive DeepSeek-R1 integration following official documentation
