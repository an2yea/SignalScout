import express from 'express';
import cors from 'cors';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { scrapeWebsite } from './scraper.js';
import { analyzeContentForICP } from './geminiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

const contentDir = path.join(__dirname, '..', 'content');
const analysesDir = path.join(__dirname, '..', 'analyses');

app.use(cors());
app.use(express.json());

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
app.post('/api/scrape', async (req, res) => {
  const { url } = req.body;
  console.log(`[${new Date().toISOString()}] /api/scrape called with URL: ${url}`);
  
  if (!url) {
    console.log(`[${new Date().toISOString()}] /api/scrape - Missing URL parameter`);
    return res.status(400).send({ error: 'URL is required' });
  }

  try {
    // 1. Scrape website content
    const content = await scrapeWebsite(url);
    if (!content) {
      return res.status(500).send({ error: 'Failed to scrape website' });
    }

    // 2. Save the scraped content
    const hostname = new URL(url).hostname;
    const contentFilename = `${hostname.replace(/\./g, '_')}.txt`;
    const contentFilepath = path.join(contentDir, contentFilename);
    await fs.mkdir(contentDir, { recursive: true });
    await fs.writeFile(contentFilepath, content);
    
    // 3. Analyze the content for ICP
    const icpAnalysis = await analyzeContentForICP(content);

    // 4. Save the analysis
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const analysisFilename = `icp_analysis_${hostname.replace(/\./g, '_')}_${timestamp}.json`;
    const analysisFilepath = path.join(analysesDir, analysisFilename);
    
    await fs.mkdir(analysesDir, { recursive: true });
    await fs.writeFile(analysisFilepath, JSON.stringify({
      url,
      analysis: icpAnalysis,
      timestamp: new Date().toISOString()
    }, null, 2));

    // 5. Send a success response
    console.log(`[${new Date().toISOString()}] /api/scrape - Successfully processed ${url}`);
    res.send({ 
      message: 'Scraping and analysis successful.', 
      contentFile: contentFilename,
      analysisFile: analysisFilename
    });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] /api/scrape - Error processing ${url}:`, error);
    res.status(500).send({ error: 'An error occurred during the process.' });
  }
});

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
app.post('/api/trigger-n8n', async (_req, res) => {
  console.log(`[${new Date().toISOString()}] /api/trigger-n8n called`);
  
  const n8nWebhookUrl = 'https://nishitrl.app.n8n.cloud/webhook-test/2b0c8e9f-d0bf-4ec9-b699-b5c66220dfd6';

  const subreddits = ['LangChain', 'crewai', 'AI_Agents'];
  const redditSearchUrl = `https://oauth.reddit.com/r/${subreddits.join('+')}/search`;
  
  const keywords = `("stuck" OR "blocked" OR "frustrated" OR "hate" OR "nightmare" OR "pulling my hair" OR "hours wasted" OR "flaky integration") AND ("langchain" OR "crewai" OR "llamaindex" OR "function calling" OR "oauth" OR "token refresh" OR "integration")`;

  const payload = {
    keywords: keywords,
    subcommunities: redditSearchUrl,
  };

  try {
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`n8n webhook failed with status ${response.status}: ${errorText}`);
    }

    console.log(`[${new Date().toISOString()}] /api/trigger-n8n - Successfully triggered n8n workflow`);
    res.send({ message: 'Successfully triggered n8n workflow.' });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] /api/trigger-n8n - Error triggering n8n webhook:`, error);
    res.status(500).send({ error: 'Failed to trigger n8n workflow.' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 