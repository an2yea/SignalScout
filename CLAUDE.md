# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev           # Start development server on http://localhost:5173
npm run build        # Build for production (outputs to dist/)
npm run lint         # Run ESLint on TypeScript files
npm run preview      # Preview production build locally
```

### Environment Setup
1. Copy `.env.example` to `.env`
2. Required API keys:
   - `VITE_FIRECRAWL_API_KEY` - Get from https://firecrawl.dev
   - `VITE_GEMINI_API_KEY` - Get from https://aistudio.google.com/
   - `VITE_N8N_WEBHOOK_URL` - Optional, for n8n workflow integration
   - `VITE_REDDIT_CLIENT_ID` - Optional, for Reddit OAuth (see REDDIT_SETUP.md)
   - `VITE_REDDIT_CLIENT_SECRET` - Optional, for Reddit OAuth

## Architecture

### Core Workflow
SignalScout follows a linear data pipeline:
1. **Web Scraping** → Firecrawl API scrapes company website (`src/services/scraper.ts`)
2. **ICP Analysis** → Google Gemini AI analyzes content for Ideal Customer Profile (`src/services/geminiService.ts`)
3. **Reddit Signal Mapping** → ICP converted to Reddit-specific signals (`src/services/redditSignalService.ts`)
4. **Orchestration** → Main workflow coordinated via `src/services/analysisService.ts`
5. **Reddit Search** → Optional n8n webhook triggers Reddit search (`src/services/n8nService.ts`)

### Service Layer Pattern
All external API integrations are isolated in `/src/services/`:
- Each service exports typed interfaces for its data structures
- Services handle their own error logging and throw meaningful errors
- The `analysisService.ts` orchestrates multiple services into complete workflows

### Component Structure
- **App.tsx**: Main router handling OAuth callbacks and animation orchestration
- **CTASection.tsx**: Primary user interface for URL input and results display
- **ICPDisplay.tsx**: Renders ICP analysis in structured format
- **RedditPostCards.tsx**: Displays Reddit search results with engagement options

### API Response Handling
- Gemini responses are expected as JSON strings that need parsing
- Reddit signals contain `subreddits`, `keyword_clusters`, and `boolean_search_query`
- N8n responses are Reddit post arrays that get rendered as cards

### Routing
- `/` - Main application with hero animation
- `/auth/reddit/callback` - Reddit OAuth callback handler
- `/test-reddit` - Test page for Reddit cards display

## Key Implementation Details

### Frontend-Only Architecture
This is a static SPA with no backend server. All API calls are made directly from the browser using environment variables prefixed with `VITE_`.

### TypeScript Configuration
- Strict mode enabled with all checks
- Module resolution set to "bundler" for Vite compatibility
- JSX using React's automatic runtime

### Deployment
- Configured for Vercel via `vercel.json`
- SPA routing handled with rewrites to index.html
- Build outputs to `dist/` directory

### Animation Flow
The hero section uses a phased animation sequence:
1. Central hub pulse activation
2. Reddit posts appear with staggered delays
3. Connection lines draw between posts and hub
4. Auto-scroll to CTA section

### Reddit Integration
- OAuth flow for authentication (see REDDIT_SETUP.md)
- Snoowrap library for Reddit API interactions
- Test data available at `/analyses/test_data_response.json`