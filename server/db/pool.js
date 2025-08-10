const { Pool } = require('pg');
require('dotenv').config();

//Private details are redirected to be able to access SQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // needed for Railway's SSL
});

module.exports = pool;