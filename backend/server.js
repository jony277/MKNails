require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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

// ==================== AUTH MIDDLEWARE ====================
const authMiddleware = function(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});
// ==================== AUTH LOGIN ROUTE ====================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find admin user
    const result = await pool.query(
      'SELECT id, email, password_hash, full_name, role, is_active FROM admin_users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({ message: 'Account is inactive' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Admin login successful:', email);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
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

// ==================== BOOKINGS GET ROUTE ====================
app.get('/api/bookings', async (req, res) => {
  console.log('\n🔍 GET /api/bookings called');
  try {
    console.log('📊 Querying database...');
    const result = await pool.query(
      `SELECT b.id, b.booking_date, b.start_time, b.end_time, b.status,
              s.name as service_name, s.price,
              c.first_name, c.phone_number
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       JOIN customers c ON b.customer_id = c.id
       ORDER BY b.booking_date DESC
       LIMIT 20`
    );
    console.log('✅ Query successful! Found', result.rows.length, 'bookings');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Database Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch bookings', details: err.message });
  }
});

// ==================== BOOKINGS POST ROUTE ====================
app.post('/api/bookings', async (req, res) => {
  console.log('\n📝 POST /api/bookings - Creating new booking');
  try {
    const { customer_name, customer_phone, customer_email, service_id, booking_date, start_time, special_requests } = req.body;

    console.log('Request data:', { customer_name, customer_phone, service_id, booking_date, start_time });

    // Validate required fields
    if (!customer_phone || !service_id || !booking_date || !start_time) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('✅ All required fields present');

    // Get service info
    const serviceResult = await pool.query(
      'SELECT duration_minutes, price FROM services WHERE id = $1',
      [service_id]
    );

    if (serviceResult.rows.length === 0) {
      console.log('❌ Service not found');
      return res.status(404).json({ error: 'Service not found' });
    }

    const duration = serviceResult.rows[0].duration_minutes;
    const price = serviceResult.rows[0].price;
    console.log(`Service found: ${duration} min duration, $${price}`);

    // Calculate end time
    const [h, m] = start_time.split(':').map(Number);
    const endTotalMinutes = h * 60 + m + duration;
    const endH = Math.floor(endTotalMinutes / 60);
    const endM = endTotalMinutes % 60;
    const end_time = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    console.log(`Calculated time: ${start_time} to ${end_time}`);

    // Check for conflicts
    console.log('🔍 Checking for conflicts...');
    const conflictCheck = await pool.query(
      `SELECT id FROM bookings 
       WHERE booking_date = $1 
       AND service_id = $2
       AND start_time < $3 
       AND end_time > $4
       AND status IN ('confirmed', 'completed')`,
      [booking_date, service_id, end_time, start_time]
    );

    if (conflictCheck.rows.length > 0) {
      console.log('⚠️ Time slot already booked');
      return res.status(409).json({ error: 'This time slot is already booked' });
    }

    console.log('✅ No conflicts found');

    // Create or get customer
    console.log('👤 Creating/getting customer...');
    const customerResult = await pool.query(
      `INSERT INTO customers (first_name, last_name, phone_number, email) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (phone_number) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
       RETURNING id`,
      ['Customer', customer_name || 'Guest', customer_phone, customer_email || null]
    );

    const customer_id = customerResult.rows[0].id;
    console.log(`Customer ID: ${customer_id}`);

    // Create booking
    console.log('📅 Creating booking in database...');
    const bookingResult = await pool.query(
      `INSERT INTO bookings (customer_id, service_id, booking_date, start_time, end_time, special_requests, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'confirmed')
       RETURNING id, booking_date, start_time, end_time, status`,
      [customer_id, service_id, booking_date, start_time, end_time, special_requests || null]
    );

    console.log('✅ Booking created! ID:', bookingResult.rows[0].id);

    res.status(201).json({
      message: 'Booking created successfully',
      booking: bookingResult.rows[0],
      customer_id: customer_id,
      service_price: price
    });

  } catch (err) {
    console.error('❌ POST Error:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ error: 'Failed to create booking', details: err.message });
  }
});

// ==================== ADMIN BOOKINGS GET ROUTE (PROTECTED) ====================
app.get('/api/admin/bookings', authMiddleware, async (req, res) => {
  console.log('\n🔐 GET /api/admin/bookings (PROTECTED) called by:', req.user.email);
  try {
    console.log('📊 Querying bookings...');
    const result = await pool.query(
      `SELECT b.id, b.booking_date, b.start_time, b.end_time, b.status,
              s.name as service_name, s.price,
              c.first_name, c.phone_number
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       JOIN customers c ON b.customer_id = c.id
       ORDER BY b.booking_date DESC, b.start_time DESC
       LIMIT 50`
    );
    console.log('✅ Query successful! Found', result.rows.length, 'bookings');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Database Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch admin bookings', details: err.message });
  }
});

// ==================== AVAILABILITY ROUTE ====================
app.get('/api/availability', async (req, res) => {
  console.log('\n🔍 GET /api/availability');
  try {
    const { date, service_id } = req.query;

    if (!date || !service_id) {
      return res.status(400).json({ error: 'Missing date or service_id' });
    }

    console.log(`📅 Checking availability for ${date}, service ${service_id}`);

    // Get service duration
    const serviceResult = await pool.query(
      'SELECT duration_minutes FROM services WHERE id = $1',
      [service_id]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const duration = serviceResult.rows[0].duration_minutes;
    console.log(`⏱️ Service duration: ${duration} minutes`);

    // Business hours: Saturday-Sunday, 9am-6pm
    const dayOfWeek = new Date(date + 'T00:00:00Z').getDay();
    console.log(`📆 Day of week: ${dayOfWeek} (0=Sun, 6=Sat)`);

    if (dayOfWeek !== 6 && dayOfWeek !== 0) {
      console.log('❌ Closed on weekdays');
      return res.json({ available_slots: [] });
    }

    // Get booked times
    console.log('🔎 Getting booked times...');
    const bookedResult = await pool.query(
      `SELECT start_time, end_time FROM bookings 
       WHERE booking_date = $1 
       AND service_id = $2
       AND status IN ('confirmed', 'completed')
       ORDER BY start_time`,
      [date, service_id]
    );

    console.log(`📊 Found ${bookedResult.rows.length} existing bookings`);

    // Generate available slots (30-min increments, 9am-6pm)
    const slots = [];
    const businessStart = 9 * 60; // 9am in minutes
    const businessEnd = 18 * 60; // 6pm in minutes

    for (let time = businessStart; time <= businessEnd - duration; time += 30) {
      const hours = Math.floor(time / 60);
      const mins = time % 60;
      const slotTime = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
      const slotEndMinutes = time + duration;
      const slotEndHours = Math.floor(slotEndMinutes / 60);
      const slotEndMins = slotEndMinutes % 60;
      const slotEndTime = `${String(slotEndHours).padStart(2, '0')}:${String(slotEndMins).padStart(2, '0')}`;

      // Check if this slot conflicts with any booking
      let hasConflict = false;
      for (const booking of bookedResult.rows) {
        const [bStartH, bStartM] = booking.start_time.split(':').map(Number);
        const [bEndH, bEndM] = booking.end_time.split(':').map(Number);
        const bStartMins = bStartH * 60 + bStartM;
        const bEndMins = bEndH * 60 + bEndM;

        if (time < bEndMins && slotEndMinutes > bStartMins) {
          hasConflict = true;
          break;
        }
      }

      if (!hasConflict) {
        slots.push({
          time: slotTime,
          end_time: slotEndTime,
          available: true
        });
      }
    }

    console.log(`✅ Found ${slots.length} available slots`);
    res.json({ available_slots: slots });

  } catch (err) {
    console.error('❌ Error checking availability:', err.message);
    res.status(500).json({ error: 'Failed to check availability', details: err.message });
  }
});

// ==================== ADMIN SERVICES CRUD (PROTECTED) ====================
app.get('/api/admin/services', authMiddleware, async (req, res) => {
  console.log('\n🔐 GET /api/admin/services (PROTECTED) called by:', req.user.email);
  try {
    console.log('📊 Querying services...');
    const result = await pool.query(
      'SELECT id, name, description, price, duration_minutes FROM services ORDER BY id'
    );
    console.log('✅ Query successful! Found', result.rows.length, 'services');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Database Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch services', details: err.message });
  }
});

app.post('/api/admin/services', authMiddleware, async (req, res) => {
  console.log('\n📝 POST /api/admin/services (PROTECTED) called by:', req.user.email);
  try {
    const { name, description, price, duration } = req.body;

    if (!name || !price || !duration) {
      return res.status(400).json({ error: 'Missing required fields: name, price, duration' });
    }

    console.log('Creating service:', { name, price, duration });
    const result = await pool.query(
      'INSERT INTO services (name, description, price, duration_minutes) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description || '', parseFloat(price), parseInt(duration)]
    );
    console.log('✅ Service created! ID:', result.rows[0].id);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Database Error:', err.message);
    res.status(500).json({ error: 'Failed to create service', details: err.message });
  }
});

app.put('/api/admin/services/:id', authMiddleware, async (req, res) => {
  console.log('\n✏️ PUT /api/admin/services/:id (PROTECTED) called by:', req.user.email);
  try {
    const { id } = req.params;
    const { name, description, price, duration } = req.body;

    if (!name || !price || !duration) {
      return res.status(400).json({ error: 'Missing required fields: name, price, duration' });
    }

    console.log('Updating service ID:', id);
    const result = await pool.query(
      'UPDATE services SET name=$1, description=$2, price=$3, duration_minutes=$4 WHERE id=$5 RETURNING *',
      [name, description || '', parseFloat(price), parseInt(duration), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    console.log('✅ Service updated! ID:', id);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Database Error:', err.message);
    res.status(500).json({ error: 'Failed to update service', details: err.message });
  }
});

app.delete('/api/admin/services/:id', authMiddleware, async (req, res) => {
  console.log('\n🗑️ DELETE /api/admin/services/:id (PROTECTED) called by:', req.user.email);
  try {
    const { id } = req.params;

    console.log('Deleting service ID:', id);
    const result = await pool.query('DELETE FROM services WHERE id=$1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    console.log('✅ Service deleted! ID:', id);
    res.json({ message: 'Service deleted', id });
  } catch (err) {
    console.error('❌ Database Error:', err.message);
    res.status(500).json({ error: 'Failed to delete service', details: err.message });
  }
});


// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════╗');
  console.log('║   MK NAILS BACKEND - DAY 2/3       ║');
  console.log('╚════════════════════════════════════╝');
  console.log(`✅ Running on port ${PORT}`);
  console.log(`🔗 Health: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Services: http://localhost:${PORT}/api/services`);
  console.log(`🔗 Bookings: http://localhost:${PORT}/api/bookings`);
  console.log(`🔗 Availability: http://localhost:${PORT}/api/availability?date=2026-01-18&service_id=1`);
  console.log('');
});

module.exports = app;
