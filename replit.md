# OrbitalBot

## Overview

OrbitalBot is a full-stack web application for monitoring and managing Discord bots. The application provides real-time statistics, server management, command configuration, activity logging, and bot settings control through a modern, dark-themed dashboard interface.

The system consists of a React frontend with shadcn/ui components, an Express.js backend API, Discord.js integration for bot interaction, and uses PostgreSQL via Drizzle ORM for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for lightweight client-side routing (instead of React Router)
- Single Page Application (SPA) architecture with client-side rendering

**UI Component System**
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom Discord-themed color palette
- Dark mode only implementation with Discord's color scheme (#5865F2 blurple, #57F287 green, #2C2F33 backgrounds)
- Custom design system following dashboard best practices (Vercel/Linear/Discord Developer Portal style)
- Typography: Whitney for headings, Roboto for body text, Fira Code for code/logs

**State Management**
- TanStack Query (React Query) for server state management and caching
- React Hook Form with Zod validation for form handling
- No global state library (Redux/Zustand) - relies on React Query for data synchronization

**Key Pages & Routes**
- `/` - Dashboard with bot statistics, charts, and recent activity
- `/servers` - Server list and management
- `/commands` - Command configuration and toggling
- `/logs` - Activity log history
- `/settings` - Bot settings configuration

### Backend Architecture

**Server Framework**
- Express.js REST API
- Separate development (`index-dev.ts`) and production (`index-prod.ts`) entry points
- Development mode uses Vite middleware for HMR
- Production mode serves pre-built static files

**API Design Pattern**
- RESTful endpoints under `/api` prefix
- Memory-based storage implementation (`MemStorage`) - designed to be replaced with database persistence
- Storage abstraction layer (`IStorage` interface) for future database integration
- JSON request/response format
- CORS and session handling ready (connect-pg-simple for PostgreSQL sessions)

**Discord Integration**
- Discord.js v14 for bot client interaction
- Replit Connectors for Discord OAuth authentication
- Dynamic token refresh mechanism
- Bot client fetches guild data, member counts, and status information
- The bot code itself appears to be in TypeScript files in `attached_assets/` with commands like mute, warn, welcome, etc.

### Data Storage Solutions

**Current Implementation**
- In-memory storage (`MemStorage` class) with mock data
- Designed for easy migration to persistent storage

**Database Ready**
- Drizzle ORM configured with PostgreSQL dialect
- Schema defined in `shared/schema.ts`
- Neon Database serverless driver as the PostgreSQL client
- Migration system configured (`drizzle.config.ts` pointing to `./migrations`)
- Database connection expects `DATABASE_URL` environment variable

**Data Models (Zod Schemas)**
- BotStats: server count, user count, uptime, commands today, messages processed, active channels
- Server: guild information with status tracking
- Command: bot commands with usage statistics and enable/disable state
- ActivityLog: event tracking with type classification (command, join, leave, error, config)
- BotSettings: bot configuration including prefix, status, activity, feature toggles

### Authentication and Authorization

**Discord OAuth**
- Uses Replit Connectors system for Discord authentication
- Token management with automatic refresh
- Environment variables: `REPL_IDENTITY` or `WEB_REPL_RENEWAL` for Replit authentication
- `REPLIT_CONNECTORS_HOSTNAME` for connector API access

**Session Management**
- connect-pg-simple configured for PostgreSQL session storage
- Sessions ready but currently using in-memory implementation

**Security Considerations**
- Bot owner verification (`OWNER_ID` environment variable)
- Permission checks on Discord commands using Discord.js permission flags
- HTTPS-only URL validation for user inputs
- Helmet.js security headers (CSP, X-Frame-Options, X-Content-Type-Options, etc)
- Rate limiting: 100 requests per 15 minutes per IP (general), 5 auth attempts per 15 minutes per IP
- Production secret validation - SESSION_SECRET required and cannot be default value
- Zod schema validation on all inputs
- Drizzle ORM prevents SQL injection
- Discord token validation before use
- httpOnly cookies for session protection
- SameSite cookie policy for CSRF protection

## External Dependencies

**Discord Services**
- Discord API via Discord.js library (v14.25.1)
- Discord Gateway for real-time bot events (Guilds, GuildMessages, GuildMembers intents)
- Replit Connectors for OAuth flow and token management

**Database & ORM**
- Neon Database (serverless PostgreSQL via `@neondatabase/serverless`)
- Drizzle ORM for type-safe database queries
- Migrations managed through drizzle-kit

**UI Libraries**
- Radix UI component primitives (20+ component packages)
- Recharts for data visualization (line charts, bar charts)
- Lucide React for icons
- date-fns for date formatting with Portuguese locale support

**Development Tools**
- Vite plugins: runtime error modal, cartographer (Replit), dev banner (Replit)
- ESBuild for production builds
- TypeScript for type checking
- PostCSS with Tailwind CSS and Autoprefixer
- Helmet.js for HTTP security headers
- express-rate-limit for DDoS and brute force protection

**Internationalization**
- Multi-language support infrastructure in Discord bot commands (PT-BR, EN-US, ES-ES)
- date-fns with Portuguese locale for frontend date formatting

**Key Environment Variables Required**
- `DATABASE_URL` - PostgreSQL connection string
- `OWNER_ID` - Discord user ID for bot owner
- `REPL_IDENTITY` or `WEB_REPL_RENEWAL` - Replit authentication
- `REPLIT_CONNECTORS_HOSTNAME` - Replit connectors API endpoint
- `NODE_ENV` - Environment flag (development/production)
