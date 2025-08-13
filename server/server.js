const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const verifyToken = require('./middleware/authMiddleware');

const app = express();

// Enable CORS for all routes first
app.use(cors({
  origin: 'https://e-commercelive.netlify.app/addProduct',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests globally BEFORE verifyToken
app.options('*', cors());

app.use(express.json());
app.use(express.static('public'));

// Public routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Protected routes
app.use(verifyToken);
app.use('/api', require('./routes/apiRoutes'));
app.use('/product', require('./routes/productRoutes'));
app.use('/cart', require('./routes/cartRoutes'));
app.use('/order', require('./routes/orderRoutes'));

module.exports = app;

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
