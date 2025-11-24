# OrbitalBot

## Overview

OrbitalBot é uma aplicação web full-stack para monitorar e gerenciar Discord bots. Fornece estatísticas em tempo real, gerenciamento de servidores, configuração de comandos, logs de atividade e controle de configurações do bot através de um dashboard moderno com tema escuro.

O sistema consiste em frontend React com shadcn/ui, backend Express.js API, integração Discord.js para interação do bot, e PostgreSQL com Drizzle ORM para persistência de dados.

**Status**: ✅ Funcionando | 🚀 Pronto para Deploy no VertraCloud

## User Preferences

Preferred communication style: Simple, everyday language. Portuguese (PT-BR) primary language.

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
- `DISCORD_CLIENT_ID` - OAuth2 Client ID (OBRIGATÓRIO para login)
- `DISCORD_CLIENT_SECRET` - OAuth2 Client Secret (OBRIGATÓRIO para login)
- `DISCORD_BOT_TOKEN` - Bot token para funcionalidades avançadas (opcional)
- `SESSION_SECRET` - Senha para sessões (OBRIGATÓRIO em produção)
- `NODE_ENV` - Environment flag (development/production)
- `DATABASE_URL` - PostgreSQL connection string (opcional, em memória por padrão)

## Deployment

### ✅ Replit (Development)
- URL: `https://a6f3a9b6-af65-4fb4-97f0-f4832a9cdb04-00-22zb2l46bu27e.kirk.replit.dev`
- Status: ✅ Funcionando
- Login: ✅ Funcionando (gomezfy_)
- Bot: ✅ Conectado (18 servidores, 279 usuários)

### 🚀 VertraCloud (Production)
Para fazer deploy no VertraCloud:
1. Consulte `VERTRACLOUD_DEPLOY.md` (guia completo)
2. Consulte `VERTRACLOUD_QUICK_START.md` (5 minutos)
3. Configure as variáveis de ambiente
4. Adicione URL de callback no Discord: `https://seu-dominio.vertracloud.app/api/auth/callback`

### Build & Start
```bash
npm run build    # Compila frontend e backend
npm start        # Inicia servidor de produção
```
