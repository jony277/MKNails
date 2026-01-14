// ====================================================================
// MK NAILS BACKEND - server.js
// Main Express server file
// ====================================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pg = require('pg');

// Import route files (we'll create these next)
// const authRoutes = require('./routes/auth');
// const bookingRoutes = require('./routes/bookings');
// const serviceRoutes = require('./routes/services');
// const reviewRoutes = require('./routes/reviews');
// const adminRoutes = require('./routes/admin');

const app = express();

// ====================================================================
// MIDDLEWARE (What happens before every request)
// ====================================================================

// Allow frontend to talk to backend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Parse JSON from requests
app.use(express.json());

// Log all requests (helpful for debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ====================================================================
// DATABASE CONNECTION
// ====================================================================

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Database connected at:', res.rows[0].now);
  }
});

// Make pool available to other files
app.locals.db = pool;

// ====================================================================
// ROUTES (We'll add these once structure is ready)
// ====================================================================

// auth routes (login, register)
// app.use('/api/auth', authRoutes);

// booking routes (create, view, update bookings)
// app.use('/api/bookings', bookingRoutes);

// service routes (get services, prices)
// app.use('/api/services', serviceRoutes);

// review routes (submit, get, moderate reviews)
// app.use('/api/reviews', reviewRoutes);

// admin routes (dashboard data)
// app.use('/api/admin', adminRoutes);

// ====================================================================
// HEALTH CHECK ENDPOINT
// ====================================================================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ====================================================================
// ERROR HANDLING
// ====================================================================

// 404 - Not found
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error' 
  });
});

// ====================================================================
// START SERVER
// ====================================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  MK NAILS BACKEND                      ║
║  Running on port ${PORT}                  ║
║  Environment: ${process.env.NODE_ENV || 'development'}           ║
║  Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'} ║
╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Closing database connection...');
  pool.end();
  process.exit(0);
});

module.exports = { app, pool };
