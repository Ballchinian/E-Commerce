const express = require('express');
const router = express.Router();
const db = require('../db/pool'); 

router.get('/products', async (req, res) => {
  try {
    const products = await db.query('SELECT * FROM products');
    res.json(products.rows);

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});



module.exports = router;


