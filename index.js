const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer-core');

const app = express();
const PORT = 8000;

app.use(cors());
const SBR_WS_ENDPOINT = 'wss://brd-customer-hl_19bcec57-zone-pricehawkky:kfqd8ct5k2fk@brd.superproxy.io:9222';
app.use(express.json());

app.post('/api/scrape', async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }
  const titleClass = ['#productTitle', '.VU-ZEz', '.a-size-large', '.product-title-word-break'];
  const imageClass = ['.imgTagWrapper img', '.a-dynamic-image', '.a-stretch-horizontal', '.DByuf4', '.IZexXJ', '.jLEJ7H'];
  const priceClass = ['.a-price-whole', '.Nx9bqj', '.CxhGGd', '.money', 'a-price', 'aok-align-center', ' reinventPricePriceToPayMargin', 'priceToPay'];
  // const about = ['a-section','a-spacing-medium ','a-spacing-top-small'];
  // const oldPrice = [];
  // const rating = [];

  try {
    console.log('Connecting to Scraping Browser...');
    const browser = await puppeteer.connect({
      browserWSEndpoint: SBR_WS_ENDPOINT,
    });

    try {
      const page = await browser.newPage();
      await page.goto(url, { timeout: 120000 });

      console.log('Navigated! Scraping page content...');

      const title = await page.evaluate((titleClass) => {
        const titleElement = document.querySelector(titleClass.join(', '));
        return titleElement ? titleElement.innerText.trim() : null;
      }, titleClass);

      const price = await page.evaluate((priceClass) => {
        const priceElement = document.querySelector(priceClass.join(', '));
        return priceElement ? priceElement.innerText.trim() : null;
      }, priceClass);

      const image = await page.evaluate((imageClass) => {
        const imageElement = document.querySelector(imageClass.join(', '));
        return imageElement ? imageElement.src : null;
      }, imageClass);

      await browser.close();
      res.status(200).json({ title, price, image });
    } catch (error) {
      console.error('Error scraping page content:', error);
      await browser.close();
      res.status(500).json({ message: 'Failed to scrape the data', error });
    }
  } catch (error) {
    console.error('Error connecting to Scraping Browser:', error);
    res.status(500).json({ message: 'Failed to connect to Scraping Browser', error });
  }
});

app.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}/api/scrape`);
});
