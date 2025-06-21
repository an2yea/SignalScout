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

app.post('/api/scrape', async (req, res) => {
  const { url } = req.body;
  if (!url) {
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
    res.send({ 
      message: 'Scraping and analysis successful.', 
      contentFile: contentFilename,
      analysisFile: analysisFilename
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred during the process.' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 