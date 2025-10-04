import dotenv from "dotenv";
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

import express from 'express';
import config from './src/config/env.js';
import webhoobRoutes from './src/routes/webhookRoutes.js';


// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());


app.use('/', webhoobRoutes);


// Route for GET requests
app.get('/', (req, res) => {
  res.send('<pre>Bellaluna WhatsApp Bot is running!\nWebhook URL: /webhook\nTest endpoint: /test</pre>');
});

// Test endpoint
app.get('/test', (req, res) => {
  console.log('Test endpoint hit!');
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    config: {
      port: config.port,
      hasApiToken: !!config.apiToken,
      hasPhoneNumberId: !!config.phoneNumberId,
      hasVerifyToken: !!config.verifyToken,
      verifyTokenLength: config.verifyToken ? config.verifyToken.length : 0
    }
  });
});

// Debug endpoint for webhook verification
app.get('/debug-webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verifyToken'];
  const challenge = req.query['hub.challenge'];
  
  res.json({
    received: {
      mode,
      token,
      challenge
    },
    expected: {
      verifyToken: config.verifyToken,
      verifyTokenLength: config.verifyToken ? config.verifyToken.length : 0
    },
    match: mode === 'subscribe' && token === config.verifyToken
  });
});

// Test POST endpoint to simulate webhook
app.post('/test-webhook', (req, res) => {
  console.log('Test webhook POST received:', JSON.stringify(req.body, null, 2));
  res.json({ status: 'Test webhook received', body: req.body });
});

// Start the server
app.listen(config.port, () => {
  console.log(`\nListening on port ${config.port}\n`);
});
