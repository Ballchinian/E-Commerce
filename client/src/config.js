// Point this at a local server with REACT_APP_API_BASE_URL during development,
// otherwise it falls back to the deployed Railway backend.
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://e-commerce-production-259b.up.railway.app";
