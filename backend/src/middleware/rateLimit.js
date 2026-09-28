const rateLimit = require('express-rate-limit');

// Limit paste creation: 20 pastes per 15 min per IP
const createPasteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many pastes created. Please try again later.' }
});

module.exports = { createPasteLimiter };