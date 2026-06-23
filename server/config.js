// Public base URL of this server, used to build absolute image URLs for uploads.
// Override with API_BASE_URL in the environment when running locally.
const API_BASE_URL =
    process.env.API_BASE_URL || 'https://e-commerce-production-259b.up.railway.app';

module.exports = { API_BASE_URL };
