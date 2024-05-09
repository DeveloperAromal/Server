// const express = require('express');
// const cors = require('cors');
// const puppeteer = require('puppeteer-core');

// const app = express();
// const PORT = 8000;

// app.use(cors());
// const SBR_WS_ENDPOINT = 'wss://brd-customer-hl_19bcec57-zone-pricehawkky:kfqd8ct5k2fk@brd.superproxy.io:9222';
// app.use(express.json());

// app.post('/api/scrape', async (req, res) => {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   const { url } = req.body;

//   if (!url) {
//     return res.status(400).json({ message: 'URL is required' });
//   }
//   const titleClass = [
//     "#productTitle",
//     ".VU-ZEz",
//     ".a-size-large",
//     ".product-title-word-break",
//     "#product-details",
//     ".title_tag",
//     ".title-detail",
//   ];
//   const imageClass = [
//     ".imgTagWrapper img",
//     ".a-dynamic-image",
//     ".a-stretch-horizontal",
//     ".DByuf4",
//     ".IZexXJ",
//     ".jLEJ7H",
//     ".product_image",
//     ".image-detail",
//   ];
//   const priceClass = [
//     ".a-price-whole",
//     ".Nx9bqj",
//     ".CxhGGd",
//     ".money",
//     ".a-price",
//     ".aok-align-center",
//     ".reinventPricePriceToPayMargin",
//     ".priceToPay",
//     ".price_tag",
//     ".price-detail",
//     ".price-detail",
//   ];
//   try {
//     console.log('Connecting to Scraping Browser...');
//     const browser = await puppeteer.connect({
//       browserWSEndpoint: SBR_WS_ENDPOINT,
//     });

//     try {
//       const page = await browser.newPage();
//       await page.goto(url, { timeout: 120000 });

//       console.log('Navigated! Scraping page content...');

//       const title = await page.evaluate((titleClass) => {
//         const titleElement = document.querySelector(titleClass.join(', '));
//         return titleElement ? titleElement.innerText.trim() : null;
//       }, titleClass);

//       const price = await page.evaluate((priceClass) => {
//         const priceElement = document.querySelector(priceClass.join(', '));
//         return priceElement ? priceElement.innerText.trim() : null;
//       }, priceClass);

//       const image = await page.evaluate((imageClass) => {
//         const imageElement = document.querySelector(imageClass.join(', '));
//         return imageElement ? imageElement.src : null;
//       }, imageClass);

//       await browser.close();
//       res.status(200).json({ title, price, image });
//     } catch (error) {
//       console.error('Error scraping page content:', error);
//       await browser.close();
//       res.status(500).json({ message: 'Failed to scrape the data', error });
//     }
//   } catch (error) {
//     console.error('Error connecting to Scraping Browser:', error);
//     res.status(500).json({ message: 'Failed to connect to Scraping Browser', error });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Express server is running on http://localhost:${PORT}/api/scrape`);
// });

const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer-core');
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 8000;

app.use(cors());

const SBR_WS_ENDPOINT = 'wss://brd-customer-hl_19bcec57-zone-pricehawkky:kfqd8ct5k2fk@brd.superproxy.io:9222';

// Hardcoded Supabase URL and service key
const supabaseUrl = 'https://hsqexrueqqjqcpxnaoah.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzcWV4cnVlcXFqcWNweG5hb2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMzNjU0MzYsImV4cCI6MjAyODk0MTQzNn0.QeeWvi6Av5eW6m6ps9mBh08AUcieOTutniW0YrUnqHc';
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware to parse JSON bodies
app.use(express.json());

app.post('/api/scrape', async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }
  const titleClass = [
    "#productTitle",
    ".VU-ZEz",
    ".a-size-large",
    ".product-title-word-break",
    "#product-details",
    ".title_tag",
    ".title-detail",
  ];
  const imageClass = [
    ".imgTagWrapper img",
    ".a-dynamic-image",
    ".a-stretch-horizontal",
    ".DByuf4",
    ".IZexXJ",
    ".jLEJ7H",
    ".product_image",
    ".image-detail",
  ];
  const priceClass = [
    ".a-price-whole",
    ".Nx9bqj",
    ".CxhGGd",
    ".money",
    ".a-price",
    ".aok-align-center",
    ".reinventPricePriceToPayMargin",
    ".priceToPay",
    ".price_tag",
    ".price-detail",
    ".price-detail",
  ];
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

app.post('/api/email/sendmail', async (req, res) => {
  try {
    // Initialize nodemailer transport with hardcoded credentials
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'aromals161@gmail.com', // Hardcoded email
        pass: 'jwnbqyqkkebkemho', // Hardcoded password
      },
    });

    // Get UUID from the request body
    const { uuid } = req.body;

    if (!uuid) {
      return res.status(400).json({ error: 'UUID is required' });
    }

    // Fetch email associated with the UUID
    const { data: emailData, error } = await supabase
      .from('Send_Email')
      .select('email')
      .eq('uuid', uuid)
      .single();

    if (error) {
      throw error;
    }

    if (!emailData) {
      return res.status(404).json({ error: 'Email not found for the given UUID' });
    }

    const mailOptions = {
      from: 'aromals161@gmail.com', // Hardcoded sender email
      to: emailData.email, // Recipient email
      subject: `Message for UUID: ${uuid}`,
      html: `<h1>Hello, ${emailData.email}!</h1><p>This is a custom HTML email template for UUID: ${uuid}.</p><p>Feel free to customize it as needed.</p>`,
    };

    // Send email
    await transport.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});


app.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}`);
});
