const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Serve static files from Angular build
app.use(express.static(path.join(__dirname, '../angular-client/dist/angular-client/browser')));

// API routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'FindMyHorse API is running!' });
});

// API routes
app.get('/api/horses', (req, res) => {
  // Mock data for demonstration
  const horses = [
    {
      id: 1,
      title: "Beautiful Competition Horse",
      breed: "Warmblood",
      color: "Bay",
      age: "8 Years",
      gender: "Mare",
      height: "16.2 HH",
      price: 15000,
      location: "Somerset",
      image: "/api/placeholder/horse1.jpg"
    },
    {
      id: 2,
      title: "Gentle Family Horse",
      breed: "Irish Sports Horse",
      color: "Chestnut",
      age: "12 Years",
      gender: "Gelding",
      height: "15.3 HH",
      price: 8000,
      location: "Devon",
      image: "/api/placeholder/horse2.jpg"
    }
  ];
  res.json(horses);
});

// Connect to MongoDB (optional for landing page)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

// Catch-all handler for client-side routing (Express v5 compatible)
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '../angular-client/dist/angular-client/browser/index.html');
  res.sendFile(indexPath);
});

// Handle all other routes for Angular client-side routing
app.use((req, res, next) => {
  // If it's not an API route, serve the Angular app
  if (!req.path.startsWith('/api/')) {
    const indexPath = path.join(__dirname, '../angular-client/dist/angular-client/browser/index.html');
    res.sendFile(indexPath);
  } else {
    next();
  }
});

// Basic 404 handler for API routes
app.use((req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Angular client served from: ${path.join(__dirname, '../angular-client/dist/angular-client/browser')}`);
}); 