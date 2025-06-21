import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeContentForICP(content) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  Analyze the following website content to define the Ideal Customer Profile (ICP) and propose high-intent signal sources to find potential buyers.

  **Part 1: Ideal Customer Profile (ICP)**
  Please provide a detailed analysis including:
  1.  **Target Industry/Sector**: What industry or sector does this business operate in?
  2.  **Company Size**: What size companies are they targeting (e.g., startup, SMB, enterprise)?
  3.  **Job Titles/Roles**: What job titles or roles would be the primary decision-makers?
  4.  **Pain Points**: What specific problems or challenges does this business solve for them?
  5.  **Geographic Focus**: Are there specific geographic markets they are targeting?

  **Part 2: High-Intent Signal Sources**
  Based on the ICP, suggest where to listen for buying signals. Provide a list of:
  6.  **Keywords**: Search terms and phrases the ICP would use when looking for a solution.
  7.  **Hashtags**: Relevant hashtags for social media (e.g., Twitter, LinkedIn).
  8.  **Online Communities**: Specific subreddits, Slack groups, Facebook groups, or other online forums where the ICP discusses their pain points or seeks advice.
  
  **Website Content:**
  ${content}
  
  Please format your response as a single, structured JSON object with keys for each of the 8 numbered points above. For points 6, 7, and 8, please return a list of strings.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing content with Gemini:', error);
    throw new Error('Failed to analyze content with Gemini');
  }
} 