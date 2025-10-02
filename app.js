// Import Express.js
const express = require('express');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;
const apiToken = process.env.API_TOKEN;
const apiVersion = process.env.API_VERSION;
const businessPhone = process.env.BUSINESS_PHONE;


// Route for GET requests
app.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// Route for POST requests
app.post('/', async (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));

  try {
    // Process incoming messages
    if (req.body.object === 'whatsapp_business_account') {
      req.body.entry?.forEach(entry => {
        entry.changes?.forEach(change => {
          if (change.field === 'messages') {
            change.value.messages?.forEach(async (message) => {
              // Skip if message is from business phone (avoid echo loops)
              if (message.from === businessPhone) {
                return;
              }

              // Get the message text
              let messageText = '';
              if (message.type === 'text') {
                messageText = message.text.body;
              } else {
                messageText = `Recibí un mensaje de tipo: ${message.type}`;
              }

              // Send echo response
              await sendMessage(message.from, `Echo: ${messageText}`);
            });
          }
        });
      });
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
  }

  res.status(200).end();
});

// Function to send message via WhatsApp API
async function sendMessage(to, message) {
  const url = `https://graph.facebook.com/${apiVersion}/${businessPhone}/messages`;
  
  const payload = {
    messaging_product: "whatsapp",
    to: to,
    type: "text",
    text: {
      body: message
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log('Message sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});