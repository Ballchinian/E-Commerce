const path = require('path');
//Check file type and size before saving
const fileFilter = (req, file, cb) => {
  // Accept only jpg and png
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Only .jpg and .png images are allowed')); // Reject file
  }
};

module.exports = fileFilter;