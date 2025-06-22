import { scrapeWebsite } from './scraper';
import { analyzeContentForICP } from './geminiService';
import { mapICPToRedditSignals } from './redditSignalService';

export interface AnalysisResult {
  url: string;
  analysis: string;
  redditSignals?: string;
  timestamp: string;
}

/**
 * Complete analysis workflow: scrape website, analyze for ICP, and map to Reddit signals
 */
export async function analyzeWebsite(url: string): Promise<AnalysisResult> {
  try {
    // 1. Scrape website content
    const content = await scrapeWebsite(url);
    if (!content) {
      throw new Error('Failed to scrape website content');
    }

    // 2. Analyze the content for ICP
    const icpAnalysis = await analyzeContentForICP(content);

    // 3. Map ICP to Reddit signals
    let redditSignals: string | undefined;
    try {
      redditSignals = await mapICPToRedditSignals(icpAnalysis);
    } catch (error) {
      console.error('Failed to generate Reddit signals:', error);
      // Continue without Reddit signals if this fails
    }

    // 4. Return the analysis result
    const result: AnalysisResult = {
      url,
      analysis: icpAnalysis,
      redditSignals,
      timestamp: new Date().toISOString()
    };

    return result;

  } catch (error) {
    console.error(`Error analyzing website ${url}:`, error);
    throw error;
  }
}

/**
 * Download analysis result as JSON file
 */
export function downloadAnalysis(result: AnalysisResult): void {
  const hostname = new URL(result.url).hostname;
  const timestamp = result.timestamp.replace(/[:.]/g, '-');
  const filename = `icp_analysis_${hostname.replace(/\./g, '_')}_${timestamp}.json`;
  
  const dataStr = JSON.stringify(result, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = filename;
  link.click();
  
  // Clean up
  URL.revokeObjectURL(link.href);
} 