const express = require('express');
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.post('/send-emails', async (req, res) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

  // Initialize Supabase client
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
        user: process.env.MY_EMAIL || '',
        pass: process.env.MY_PASSWORD || '',
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
        html: `<h1>Hello, ${emailData.data?.email}!</h1><p>This is a custom HTML email template for UUID: ${uuidData.uuid}.</p><p>Feel free to customize it as needed.</p>`,
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
