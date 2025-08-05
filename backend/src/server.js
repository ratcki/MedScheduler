const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const shiftRoutes = require('./routes/shifts');
const doctorRoutes = require('./routes/doctors');
const database = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database
database.init();

// Routes
app.use('/api/shifts', shiftRoutes);
app.use('/api/doctors', doctorRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Medical Shift Scheduler API is running' });
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));
  
  // The "catchall" handler: for any request that doesn't
  // match one above, send back React's index.html file.
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Medical Shift Scheduler API is running on port ${PORT}`);
});

module.exports = app;
