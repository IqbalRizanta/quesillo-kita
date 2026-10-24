require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS Configuration
const ALLOWED_ORIGINS = (process.env.FRONTEND_URL || 'http://localhost')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: ALLOWED_ORIGINS.length > 0 ? ALLOWED_ORIGINS : '*',
  credentials: true
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(morgan('dev'));

// Static files for uploaded images
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Health check endpoint
app.get('/health', (_, res) => {
  res.json({
    ok: true,
    service: 'quesillo-backend-company-profile',
    timestamp: new Date().toISOString()
  });
});

// Application Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/', publicRoutes);

// 404 Handler
app.use((_, res) => {
  res.status(404).json({ error: 'Endpoint tidak ditemukan' });
});

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[Quesillo.kita Backend] Berjalan di port http://localhost:${PORT}`);
});
