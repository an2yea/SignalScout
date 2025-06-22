import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ICPAnalysis {
  summary: string;
  icp: {
    firmographics: {
      industry: string;
      company_size: string;
      region?: string;
      annual_revenue?: string;
    };
    personas: string[];
    pains_triggers: string[];
    success_metrics: string[];
  };
}

/**
 * Analyze website content for ICP using Gemini AI with GTM strategist prompt
 */
export async function analyzeContentForICP(content: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('VITE_GEMINI_API_KEY environment variable is not set');
    throw new Error('VITE_GEMINI_API_KEY environment variable is not set');
  }

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `### SYSTEM
You are a world-class GTM strategist.  
Task: read the COMPANY_INFORMATION block, ignore noise, and return **only valid JSON** with the keys
\`summary\` (≤ 50 words) and \`icp\` (four sub-blocks).

Guidelines
• Ignore navigation, legal disclaimers, career pages, and press releases.  
• Build the \`"icp"\` object using ONLY the product copy provided:
  - **firmographics**: industry, company_size, optional region & annual_revenue  
  - **personas**: array of buyer / champion roles  
  - **pains_triggers**: array of burning pains or buying triggers  
  - **success_metrics**: array of outcomes the buyer tracks  
• Do **not** include technographic details.  
• Respond with JSON only—no code fences, no commentary.  
• Keep the entire answer under 160 words.

### COMPANY_INFORMATION
${content}
### END_COMPANY_INFORMATION


### SAMPLE_OUTPUT

{
  "summary": "Composio lets AI teams add 250+ SaaS integrations with one SDK and SOC-2-ready OAuth.",
  "icp": {
    "firmographics": {
      "industry": "B2B SaaS / AI tooling",
      "company_size": "Seed–Series C • 50-250 FTE"
    },
    "personas": ["CTO", "Lead ML Engineer", "DevOps Lead"],
    "pains_triggers": [
      "oauth maintenance burden",
      "need ≥3 integrations this quarter",
      "enterprise deal blocked by security review"
    ],
    "success_metrics": ["≥100 eng-hrs saved", "time-to-market 4× faster"]
  }
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing content with Gemini:', error);
    throw new Error('Failed to analyze content with Gemini');
  }
} 