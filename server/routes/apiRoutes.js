const express = require('express');
const router = express.Router();
const { API_BASE_URL } = require('../../client/src/config');
const fileFilter = require("../middleware/imageSecurityMiddleware");
// Allows for file uploads from an API standpoint
const multer = require('multer');
// Creates file paths that are safe
const path = require('path');

const db = require('../db/pool'); 


// Sets storage destination and filename for uploaded images
const storage = multer.diskStorage({
  // Where to store images
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads')); // Saves to public/uploads
  },
  // What to call it
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Keeps .png or .jpg extension
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Initialises Multer with settings + file size limit (2MB)
const upload = multer({ 
  storage,
  fileFilter, // Ensures only safe image types are allowed
  limits: { fileSize: 2 * 1024 * 1024 } // Restricts file size to 2MB
});

// Route to add a new product without token requirement
// File upload is validated by multer and fileFilter
router.post('/add-product', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description } = req.body;

    // If no image is uploaded, reject the request
    if (!req.file) return res.status(400).json({ message: 'Image is required' });

    // Builds the image URL for database storage
    const imageUrl = `${API_BASE_URL}/${req.file.filename}`;
    
    // Inserts product details and image URL into the database
    await db.query(
      'INSERT INTO products (name, price, description, picture_url) VALUES ($1, $2, $3, $4)',
      [name, price, description, imageUrl]
    );

    // Success response
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error('Error adding product:', error);
    // Sends server error to client
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
