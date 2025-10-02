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
const phoneNumberId = process.env.PHONE_NUMBER_ID;


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
              // Skip if message is from our own number (avoid echo loops)
              // Note: We'll identify our own messages by checking if it's a message we sent
              // This is handled by checking message context or other methods

              // Get the message text
              let messageText = '';
              if (message.type === 'text') {
                messageText = message.text.body;
              } else {
                messageText = `Recibí un mensaje de tipo: ${message.type}`;
              }

              // Send echo response
              const result = await sendMessage(message.from, `Echo: ${messageText}`);
              if (result?.error) {
                console.error('Failed to send echo message:', result.error);
              }
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
  // Debug: mostrar las variables de entorno
  console.log('Environment variables:');
  console.log('- phoneNumberId:', phoneNumberId);
  console.log('- apiVersion:', apiVersion);
  
  const url = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;
  
  const payload = {
    messaging_product: "whatsapp",
    to: to,
    type: "text",
    text: {
      body: message
    }
  };

  console.log('Sending message to URL:', url);
  console.log('Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    let result;
    try {
      result = await response.json();
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError);
      const textResponse = await response.text();
      console.error('Raw response:', textResponse);
      throw new Error(`Invalid JSON response: ${textResponse}`);
    }
    
    if (!response.ok) {
      console.error('API Error Response:', result);
      const errorMessage = result?.error?.message || result?.message || 'Unknown API error';
      throw new Error(`API Error (${response.status}): ${errorMessage}`);
    }
    
    console.log('Message sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending message:', error);
    // No re-throw para evitar crashear la aplicación
    return { error: error.message };
  }
}

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});