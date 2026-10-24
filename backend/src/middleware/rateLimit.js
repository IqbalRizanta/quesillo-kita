const rateLimit = require('express-rate-limit');

// Rate limit untuk proteksi brute force login admin
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Terlalu banyak percobaan login, silakan coba lagi dalam 15 menit' }
});

// Rate limit untuk pengiriman ulasan/testimoni publik
const testimonialLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 menit
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Terlalu banyak ulasan dikirim, mohon tunggu beberapa saat' }
});

module.exports = { authLimiter, testimonialLimiter };
