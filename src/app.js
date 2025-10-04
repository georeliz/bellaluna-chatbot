import express from 'express';
import config from './config/env';
import webhoobRoutes from './routes/webhookRoutes';


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
  console.log(`\nListening on port ${port}\n`);
});