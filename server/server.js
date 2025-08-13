const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
app.use(cors({
  origin: 'https://e-commercelive.netlify.app', // allow Netlify site to make cors reqests for addProduct
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

//Security, making sure token is valid and needed for all routes
const verifyToken = require('./middleware/authMiddleware');

const app = express();

app.use(express.json());

app.use(express.static('public'));

app.use('/auth', require('./routes/authRoutes'));

//Secured all these routes
app.use(verifyToken);
app.use('/api', require('./routes/apiRoutes'));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/product', require('./routes/productRoutes'));
app.use('/cart', require('./routes/cartRoutes'));
app.use('/order', require('./routes/orderRoutes'));



module.exports = app;

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}


