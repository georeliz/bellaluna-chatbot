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
  res.send('<pre>Nothing to see here.\nCheckout README.md to start the project.</pre>');

});



// Start the server
app.listen(config.port, () => {
  console.log(`\nListening on port ${config.port}\n`);
});
