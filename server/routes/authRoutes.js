const express = require('express');
const router = express.Router();
const { login, register, resetPassword } = require('../services/AuthService');
const pool = require('../db/pool'); 
const jwt = require("jsonwebtoken");

//For mail sending on password reset
const nodemailer = require('nodemailer');
const crypto = require('crypto');

//For database password storage security

require('dotenv').config();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await login({ email, password }, pool);
    //Generates a unique token using the JWT secret with a time limit for security
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ 
      success: true, 
      token, 
      email
    });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const result = await register({ firstName, lastName, email, password }, pool);

    if (result.success) {
      return res.status(201).json({ success: true, message: result.message });
    } else {
      return res.status(400).json({ success: false, message: result.message });
    }
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
});


//Sends email for password reset
router.post('/password-reset', async (req, res) => {
  //Takes it from log_in_display.js
  const { email } = req.body;

  try {

    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'No account with that email.' });
    }

    //Creates token with expiry for security, unique
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 3600000; // 1 hour

    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3',
      [token, expires, email]
    );

    //Creates identity and account (use gmail with App Password, less secure but its for a smaller app)
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    //Where the link will take the user
    const resetUrl = `http://localhost:3000/resetPassword/${token}`;

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 1 hour.</p>`
    });

    res.status(200).json({ message: 'Password reset email sent.' });

  } catch (error) {
    console.error('Error sending password reset:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

//When user takes email link, here we actually reset the password
router.post('/reset-password', async (req, res) => {

  
  try {

    //Needs token for authentication (reset_token, not the normal token)
    const { token, newPassword } = req.body;
    const result = await resetPassword({ token, newPassword }, pool);

    if (result.success) {
        return res.status(201).json({ success: true, message: result.message });
    } else {
        return res.status(400).json({ success: false, message: result.message });
    }
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ success: false, message: err.message });
  }

});


router.post('/facebook', async (req, res) => {
  const { accessToken } = req.body;
  try {
    // Call Facebook Graph API to verify token
    const fbRes = await fetch(`https://graph.facebook.com/me?fields=id,email,first_name&access_token=${accessToken}`);
    const fbUser = await fbRes.json();

    if (!fbUser.email) throw new Error('Missing email from Facebook');

    // Find or create user in your DB
    let user = await pool.query('SELECT * FROM users WHERE email = $1', [fbUser.email]);
    if (user.rows.length === 0) {
      user = await pool.query(
        'INSERT INTO users (firstName, email, isOAuth) VALUES ($1, $2, $3) RETURNING *',
        [fbUser.first_name, fbUser.email, true]
      );
    } else {
      user = { rows: user.rows };
    }

    const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { firstName: user.rows[0].firstname, email: user.rows[0].email } });

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Facebook auth failed' });
  }
});


module.exports = router;
