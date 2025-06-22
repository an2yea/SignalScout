import { GoogleGenerativeAI } from '@google/generative-ai';

export interface SubredditSignal {
  name: string;
  members: number;
  why_relevant: string;
}

export interface KeywordCluster {
  cluster: string;
  keywords: string;
  usp_link: string;
}

export interface RedditSignals {
  subreddits: SubredditSignal[];
  keyword_clusters: KeywordCluster[];
  boolean_search_query: string;
  reddit_search_url: string;
}

/**
 * Map ICP analysis to Reddit signals using Gemini AI
 */
export async function mapICPToRedditSignals(icpAnalysisJson: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('VITE_GEMINI_API_KEY environment variable is not set');
    throw new Error('VITE_GEMINI_API_KEY environment variable is not set');
  }

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `### SYSTEM
You are an LLM tasked with mapping ICP info to Reddit signals.  
Input: exact JSON from Prompt 1.

Output: **valid JSON** with two arrays —
1. "subreddits": 3-5 highest signal subreddits based on web search
2. "keyword_clusters": ≥8 objects {cluster, keywords, usp_link}
3. "boolean_search_query": single string that ORs all keyword phrases for Reddit API
4. "reddit_search_url": URL combining all subreddits for API usage

Rules
• Use only lowercase regex-ready keywords separated by "; " (semicolon + space).  
• Keep total output < 160 words.  
• No commentary outside JSON.

### INPUT_ICP_ANALYSIS
${icpAnalysisJson}
### END_INPUT_ICP_ANALYSIS

### SAMPLE_OUTPUT
{
  "subreddits": [
    { "name": "r/langchain", "members": 63000, "why_relevant": "tool-integration Q&A" },
    { "name": "r/crewai", "members": 14000, "why_relevant": "agent builders" },
    { "name": "r/ai_agents", "members": 18000, "why_relevant": "framework comparisons" },
    { "name": "r/saas", "members": 127000, "why_relevant": "founders debating build-vs-buy" }
  ],
  "keyword_clusters": [
    { "cluster": "oauth_auth", "keywords": "oauth2; jwt; token refresh; secret vault; sso", "usp_link": "agentauth" },
    { "cluster": "multi_tool", "keywords": "integrate slack; github api; webhook; zapier alternative; ipaas", "usp_link": "250_connectors" },
    { "cluster": "agent_framework", "keywords": "langchain; crewai; tool calling; function calling; llm agent", "usp_link": "sdk_wrappers" },
    { "cluster": "reliability", "keywords": "rate limit; 429; retry; timeout; tool fails", "usp_link": "30pct_lift" },
    { "cluster": "compliance", "keywords": "soc 2; vpc deploy; audit log", "usp_link": "security" },
    { "cluster": "rpa_vm", "keywords": "headless browser; remote vm; ubuntu instance; playwright", "usp_link": "mcp_sandbox" },
    { "cluster": "speed", "keywords": "hackathon; mvp demo; built in 24h", "usp_link": "time_to_market" },
    { "cluster": "cost", "keywords": "engineering hours; maintenance overhead; build vs buy", "usp_link": "roi" }
  ],
  "boolean_search_query": "(\"oauth2\" OR \"jwt\" OR \"token refresh\" OR \"secret vault\" OR \"sso\" OR \"integrate slack\" OR \"github api\" OR \"webhook\" OR \"zapier alternative\" OR \"ipaas\" OR \"langchain\" OR \"crewai\" OR \"tool calling\" OR \"function calling\" OR \"llm agent\" OR \"rate limit\" OR \"429\" OR \"retry\" OR \"timeout\" OR \"tool fails\" OR \"soc 2\" OR \"vpc deploy\" OR \"audit log\" OR \"headless browser\" OR \"remote vm\" OR \"ubuntu instance\" OR \"playwright\" OR \"hackathon\" OR \"mvp demo\" OR \"built in 24h\" OR \"engineering hours\" OR \"maintenance overhead\" OR \"build vs buy\")",
  "reddit_search_url": "https://oauth.reddit.com/r/langchain+crewai+ai_agents+saas/search"
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error mapping ICP to Reddit signals:', error);
    throw new Error('Failed to map ICP to Reddit signals');
  }
} 