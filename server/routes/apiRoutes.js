const express = require('express');
const router = express.Router();
import { API_BASE_URL } from '../../config.js';
//Allows for file uploads from an api standpoint
const multer = require('multer');

//Creates file paths that are safe
const path = require('path');

const db = require('../db/pool'); 
const verifyToken = require('../middleware/authMiddleware');


const storage = multer.diskStorage({
  //Where to store images
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads/'));
  },
  //What to call it
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    //Keeps .png or jpg
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

 //Initialises Multer with settings
const upload = multer({ storage });

router.post('/add-product', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description } = req.body;

    //Restricts file to user with id 1 i.e the admin account
    if (req.user.userId !== 1) {
        return res.status(403).json({ message: 'Only admin can add products' });
    }

    //(from upload.single('image'), it puts it into req.file)
    const image = req.file;

    if (!image) return res.status(400).json({ message: 'Image is required' });

    const imageUrl = `${API_BASE_URL}/${image.filename}`;
    
    await db.query(
      'INSERT INTO products (name, price, description, picture_url) VALUES ($1, $2, $3, $4)',
      [name, price, description, imageUrl]
    );

    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
