require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== DATABASE CONNECTION ====================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('✅ Database connected at:', new Date().toISOString());
});

pool.on('error', (err) => {
  console.error('❌ Database error:', err);
});

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ==================== SERVICES ROUTE ====================
app.get('/api/services', async (req, res) => {
  console.log('\n🔍 GET /api/services called');
  try {
    console.log('📊 Querying database...');
    const result = await pool.query(
      'SELECT id, name, description, price, duration_minutes, category FROM services ORDER BY display_order'
    );
    console.log('✅ Query successful! Found', result.rows.length, 'services');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Database Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch services', details: err.message });
  }
});

// ==================== BOOKINGS ROUTE ====================
app.get('/api/bookings', async (req, res) => {
  console.log('\n🔍 GET /api/bookings called');
  try {
    console.log('📊 Querying database...');
    const result = await pool.query(
      `SELECT b.id, b.booking_date, b.start_time, b.status,
              s.name as service_name, s.price
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       ORDER BY b.booking_date DESC
       LIMIT 10`
    );
    console.log('✅ Query successful! Found', result.rows.length, 'bookings');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Database Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch bookings', details: err.message });
  }
});

// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════╗');
  console.log('║   MK NAILS BACKEND - DAY 2         ║');
  console.log('╚════════════════════════════════════╝');
  console.log(`✅ Running on port ${PORT}`);
  console.log(`🔗 Health: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Services: http://localhost:${PORT}/api/services`);
  console.log(`🔗 Bookings: http://localhost:${PORT}/api/bookings`);
  console.log('');
});

module.exports = app;
