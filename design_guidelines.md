# Design Guidelines - Discord Bot Management Dashboard

## Design Approach
**System-Based Approach** with Discord branding: Following dashboard best practices (inspired by Vercel, Linear, Discord Developer Portal) with the user's specified Discord theme. Focus on data density, clear hierarchy, and developer-friendly interfaces.

## Colors (User-Specified)
- Primary: #5865F2 (Discord blurple) - primary actions, links, active states
- Secondary: #57F287 (Discord green) - success states, positive metrics
- Background: #2C2F33 (dark grey) - main background
- Cards: #36393F (darker grey) - elevated surfaces, panels
- Text: #FFFFFF (white) - primary text
- Accent: #FEE75C (Discord yellow) - warnings, highlights
- Additional: #ED4245 (Discord red) for errors/destructive actions, #EB459E (Discord fuchsia) for special highlights

## Typography
**Fonts**: Whitney (headings), Roboto (body), Fira Code (code/logs)
- Page Title: 32px bold
- Section Headers: 24px semibold
- Card Titles: 18px semibold
- Body Text: 14px regular
- Metadata/Labels: 12px medium
- Code/Logs: 13px monospace

## Layout System
**Spacing Units**: Tailwind 2, 4, 6, 8, 12, 16 for consistent rhythm
- Dashboard grid: 12-column responsive layout
- Card padding: p-6
- Section spacing: space-y-8
- Component gaps: gap-4

## Core Components

### Navigation
- **Sidebar** (fixed left, 240px width): Logo at top, navigation links with icons, user profile at bottom
- **Top Bar**: Bot status indicator, quick actions, user avatar/settings dropdown

### Dashboard Cards
- Stat Cards: Metric value (large), label, trend indicator (↑↓), icon in corner
- Server List Cards: Server icon, name, member count, status badge
- Activity Log: Timestamp, event type icon, description, expandable details

### Data Visualization
- Line charts for metrics over time (messages, commands)
- Bar charts for top commands/servers
- Status indicators: colored dots (green=online, yellow=idle, red=offline)

### Forms & Inputs
- Dark inputs with #40444B background, white text
- Focus: blurple border glow
- Buttons: blurple primary, grey secondary, green success, red danger
- Toggle switches for bot settings

### Tables
- Striped rows with subtle #36393F alternating
- Sortable headers with hover states
- Action buttons (edit/delete) aligned right

## Page Structure

### Main Dashboard
- Top metrics row: 4 stat cards (servers, users, uptime, commands/day)
- 2-column layout: Server activity chart (left 60%), Recent logs (right 40%)
- Bottom: Quick actions panel

### Servers Page
- Grid of server cards (3 columns desktop, 2 tablet, 1 mobile)
- Each card: server icon, name, stats, manage button

### Commands Page
- Table view with command name, usage count, enabled/disabled toggle
- Add command button (top right)

### Settings Page
- Tabbed interface: General, Permissions, Modules
- Form sections with clear labels and descriptions

## Responsive Behavior
- Desktop (lg): Sidebar + full content
- Tablet (md): Collapsible sidebar, 2-column grids
- Mobile: Hidden sidebar (hamburger menu), single column stacks

## Visual Elements
- Border radius: rounded-lg (8px) for cards, rounded-md (6px) for inputs
- Shadows: Subtle elevation (shadow-lg) for cards
- Icons: Use Heroicons via CDN (outline style for nav, solid for stats)
- Dividers: 1px #40444B horizontal rules between sections

## Interactions
- Minimal animations: smooth transitions (150ms) for hovers/toggles only
- Button hovers: slight brightness increase
- Card hovers: subtle shadow lift
- No page transitions or scroll animations

## Accessibility
- High contrast text (white on dark backgrounds meets WCAG AA)
- Focus indicators on all interactive elements
- Aria labels for icon-only buttons
- Keyboard navigation support throughout

## Images
**No hero image** - This is a functional dashboard, not a marketing site. Use:
- Discord bot avatar/logo in top left sidebar
- Server icons in server list cards (64x64px, rounded-full)
- User avatars in activity logs/comments (32x32px, rounded-full)
- Placeholder images for servers without custom icons (use Discord's default pattern)