import { chromium } from 'playwright';

/**
 * @param {string} url
 * @returns {Promise<string | null>}
 */
async function scrapeWebsite(url) {
  let browser = null;
  try {
    browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });

    const content = await page.evaluate(() => {
      return document.body.innerText;
    });

    return content;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    // Return null or an empty string to indicate failure
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export { scrapeWebsite }; 