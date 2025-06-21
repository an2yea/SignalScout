import express from 'express';
import cors from 'cors';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { scrapeWebsite } from './scraper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

const contentDir = path.join(__dirname, '..', 'content');

app.use(cors());
app.use(express.json());

app.post('/api/scrape', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).send({ error: 'URL is required' });
  }

  try {
    const content = await scrapeWebsite(url);
    if (content) {
      const hostname = new URL(url).hostname;
      const filename = `${hostname.replace(/\./g, '_')}.txt`;
      const filepath = path.join(contentDir, filename);

      await fs.mkdir(contentDir, { recursive: true });
      await fs.writeFile(filepath, content);
      
      res.send({ message: 'Scraping successful and content saved.', filename });
    } else {
      res.status(500).send({ error: 'Failed to scrape website' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred during scraping.' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 