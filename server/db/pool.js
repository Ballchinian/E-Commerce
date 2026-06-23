const { Pool } = require('pg');
require('dotenv').config();
console.log("DATABASE_URL:", process.env.DATABASE_URL);
//Private details are redirected to be able to access SQL database
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // needed for Railway's SSL
    // Fail fast if the DB is unreachable instead of letting requests hang
    // for the OS default (~2 min), which freezes the login/register UI.
    connectionTimeoutMillis: 10000,
    keepAlive: true
});

// Surface pool-level connection problems in the logs instead of crashing silently
pool.on('error', (err) => {
    console.error('Unexpected Postgres pool error:', err);
});

module.exports = pool;