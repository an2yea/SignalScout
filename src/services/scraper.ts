import FirecrawlApp from '@mendable/firecrawl-js';

/**
 * Scrape website content using Firecrawl
 */
export async function scrapeWebsite(url: string): Promise<string | null> {
  try {
    // Debug environment variables
    console.log('Environment check:', {
      hasFirecrawlKey: !!import.meta.env.VITE_FIRECRAWL_API_KEY,
      firecrawlKeyLength: import.meta.env.VITE_FIRECRAWL_API_KEY?.length,
      allEnvKeys: Object.keys(import.meta.env)
    });

    const apiKey = import.meta.env.VITE_FIRECRAWL_API_KEY;
    
    if (!apiKey) {
      console.error('VITE_FIRECRAWL_API_KEY environment variable is not set');
      console.error('Available env vars:', import.meta.env);
      throw new Error('Firecrawl API key is not configured');
    }

    // Initialize Firecrawl with API key from environment
    const app = new FirecrawlApp({ 
      apiKey: apiKey
    });

    console.log(`Scraping ${url} with Firecrawl...`);
    
    // Scrape the website using Firecrawl
    const scrapeResult = await app.scrapeUrl(url, {
      formats: ['markdown', 'html'],
      includeTags: ['title', 'meta', 'h1', 'h2', 'h3', 'p', 'div', 'span', 'article'],
      excludeTags: ['script', 'style', 'nav', 'footer', 'header'],
      waitFor: 3000
    });

    if (scrapeResult) {
      // Check if the response has markdown or html content
      const content = scrapeResult.markdown || scrapeResult.html;
      if (content) {
        console.log(`Successfully scraped ${url} - Content length: ${content.length} characters`);
        return content;
      }
    }
    
    console.error(`Firecrawl failed to scrape ${url}: No content returned`);
    return null;

  } catch (error) {
    console.error(`Error scraping ${url} with Firecrawl:`, error);
    throw error;
  }
} 