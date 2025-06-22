# SignalScout

Find users you didn't even know were looking for you. Drop your company URL and we'll scan Reddit to surface high-intent customers talking about your category.

## 🚀 Features

- **Website Analysis**: Scrape and analyze company websites using Firecrawl
- **ICP Generation**: AI-powered Ideal Customer Profile analysis using Google Gemini
- **Signal Sources**: Identify high-intent keywords, hashtags, and online communities
- **Beautiful UI**: Modern React interface with Framer Motion animations
- **Static Deployment**: No server required - deploy anywhere

## 🛠️ Setup

1. **Clone and install:**
   ```bash
   git clone <repo-url>
   cd SignalScout
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your API keys:
   ```
   VITE_FIRECRAWL_API_KEY=your_firecrawl_api_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Get API Keys:**
   - **Firecrawl**: Sign up at [firecrawl.dev](https://firecrawl.dev)
   - **Gemini**: Get key from [Google AI Studio](https://aistudio.google.com/)

4. **Run locally:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## 🌐 Deployment

This is a static React app that can be deployed to:
- **Vercel** (recommended) - Just connect your repo
- **Netlify** - Drag and drop the `dist` folder
- **GitHub Pages** - Static hosting
- **Any CDN** - Upload the `dist` folder

## 🏗️ Architecture

- **Frontend-only**: No server required
- **React + TypeScript**: Modern development stack
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Vite**: Fast build tool

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── CTASection.tsx   # Main input/results section
│   ├── ICPDisplay.tsx   # ICP analysis display
│   └── ...
├── services/            # API integrations
│   ├── scraper.ts       # Firecrawl website scraping
│   ├── geminiService.ts # Google Gemini AI analysis
│   ├── n8nService.ts    # n8n webhook integration
│   └── analysisService.ts # Main workflow orchestration
└── ...
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_FIRECRAWL_API_KEY` | Firecrawl API key for website scraping | Yes |
| `VITE_GEMINI_API_KEY` | Google Gemini API key for AI analysis | Yes |

## 📝 License

MIT License - see LICENSE file for details. 