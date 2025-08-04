const bcrypt = require('bcrypt');

const saltRounds = 10;

async function hashPassword(originalPassword) {
  const hashedPassword = await bcrypt.hash(originalPassword, saltRounds);
  return hashedPassword;
}

async function login({ email, password }, db) {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  //password is user inputed, user.password is listed in database
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    const err = new Error('Incorrect password');
    err.status = 401;
    throw err;
  }

  return user;
}

async function register({ firstName, lastName, email, password }, db) {
  try {
    const hashedPassword = await hashPassword(password);
    const result = await db.query(
      "INSERT INTO users (firstName, lastName, email, password) VALUES ($1, $2, $3, $4)",
      [firstName, lastName, email, hashedPassword]
    );

    if (result.rowCount === 1) {
      return { success: true, message: "User registered successfully" };
    } else {
      return { success: false, message: "User registration failed" };
    }
  } catch (err) {
    return { success: false, message: err.message };
  }
}

async function resetPassword({ token, newPassword }, db) {
  try {    
    //Deletes reset_token after 1 hour
    const userResult = await db.query(
      'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > $2',
      [token, Date.now()]
    );
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    //Ensures bcypt on password reset attempt
    const email = userResult.rows[0].email;
    const hashedPassword = await hashPassword(newPassword);
    await db.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE email = $2',
      [hashedPassword, email]
    );

    return { success: true, message: 'Password reset successful.' };

  } catch (err) {
    return { success: false, message: err.message };
  }
}

module.exports = { login, register, resetPassword };
