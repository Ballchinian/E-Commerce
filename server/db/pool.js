const { Pool } = require('pg');
require('dotenv').config();

//Private details are redirected to be able to access SQL database
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASS,
  port: process.env.PG_PORT,
});

module.exports = pool;