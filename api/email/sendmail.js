const express = require('express');
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.post('/api/email/sendmail', async (req, res) => {
  const supabaseUrl = 'https://hsqexrueqqjqcpxnaoah.supabase.co'; // Replace with your Supabase URL
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzcWV4cnVlcXFqcWNweG5hb2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMzNjU0MzYsImV4cCI6MjAyODk0MTQzNn0.QeeWvi6Av5eW6m6ps9mBh08AUcieOTutniW0YrUnqHc';
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Fetch UUIDs from the Send_email table
    const { data: uuids, error } = await supabase
      .from('Send_email')
      .select('*');

    if (error) {
      throw error;
    }

    // Initialize nodemailer transport
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'aromals161@gmail.com', // Hardcoded email
        pass: 'jwnbqyqkkebkemho', 
      },
    });

    // Iterate over each UUID in the database
    for (const uuidData of uuids || []) {
      const emailData = await supabase.from('Send_email').select('email').eq('uuid', uuidData.uuid).single();

      if (emailData.error) {
        throw emailData.error;
      }

      const mailOptions = {
        from: process.env.MY_EMAIL || '',
        to: emailData.data?.email || '', // Send email to recipient associated with the UUID
        subject: `Message for UUID: ${uuidData.uuid}`,
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Template</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #1e1e1e;
              color: #ffffff;
              padding: 20px;
            }
            .container {
              max-width: 700px;
              margin: 0 auto;
              background-color: #292929;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #ffffff;
              text-align: center;
            }
            p {
              color: #cccccc;
              line-height: 1.6;
            }
            .product-info {
              margin-top: 20px;
              text-align: center;
            }
            .product-title {
              font-size: 18px;
              font-weight: bold;
              color: #ffffff;
              margin-bottom: 10px;
            }
            .product-price {
              font-size: 16px;
              color: #007bff;
            }
            .product-image {
              display: block;
              margin-top: 20px;
              width: 100%;
              max-width: 400px;
              height: auto;
            }
            .image_cont {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Hey mate, this is from PriceHawk team</h1>
            <p style="text-align: center;">This is to inform you that the price of your product has been decreased.</p>
            <div class="image_cont">
              <img class="product-image" src="${image}" alt="Product Image">
            </div>
            <div class="product-info">
              <p class="product-title">${title}</p>
              <p class="product-price">New Price: $${price}</p>
            </div>
          </div>
        </body>
        </html>
        `,
      };

      // Send email
      await transport.sendMail(mailOptions);
    }

    res.json({ message: 'Emails sent' });
  } catch (err) {
    console.error('Error sending emails:', err);
    res.status(500).json({ error: 'Failed to send emails' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
