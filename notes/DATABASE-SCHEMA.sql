-- MK Nails Database Schema
-- PostgreSQL SQL Script
-- Paste entire file into pgAdmin Query Tool and execute

-- ====================================================================
-- 1. SERVICES TABLE (What MK Offers)
-- ====================================================================
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(8, 2) NOT NULL,
  duration_minutes INT NOT NULL,
  category VARCHAR(50),
  is_available BOOLEAN DEFAULT true,
  display_order INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data from MK's Square profile
INSERT INTO services (name, description, price, duration_minutes, category, display_order) VALUES
  ('Gel Manicure', 'Long-lasting gel polish manicure', 35.00, 45, 'manicure', 1),
  ('Acrylic Full Set', 'Full acrylic nails with polish', 50.00, 60, 'acrylic', 2),
  ('Gel Pedicure', 'Gel polish on toes', 40.00, 45, 'pedicure', 3),
  ('Acrylic Fill', 'Fill-in for existing acrylics', 30.00, 45, 'acrylic', 4),
  ('Gel Removal', 'Professional gel removal', 15.00, 20, 'service', 5),
  ('Nail Art Add-on', 'Custom nail design', 10.00, 15, 'add-on', 6),
  ('Ombre/Gradient Add-on', 'Color gradient effect', 8.00, 10, 'add-on', 7),
  ('Dip Nails', 'Powder dip manicure', 30.00, 45, 'dip', 8);

-- ====================================================================
-- 2. CUSTOMERS TABLE (Who Books)
-- ====================================================================
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  phone_number VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(100),
  total_bookings INT DEFAULT 0,
  total_spent DECIMAL(10, 2) DEFAULT 0,
  first_booking_date DATE,
  notes TEXT,
  is_vip BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 3. BOOKINGS TABLE (Appointments)
-- ====================================================================
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  service_id INT NOT NULL REFERENCES services(id),
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmed',
  special_requests TEXT,
  payment_method VARCHAR(20),
  payment_status VARCHAR(20) DEFAULT 'pending',
  reminder_sent_at TIMESTAMP,
  review_link_sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast queries (finding available slots)
CREATE INDEX idx_bookings_date_time ON bookings(booking_date, start_time, status);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);

-- ====================================================================
-- 4. REVIEWS TABLE (Customer Feedback)
-- ====================================================================
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  booking_id INT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id INT NOT NULL REFERENCES customers(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  before_photo_url VARCHAR(500),
  after_photo_url VARCHAR(500),
  response_method VARCHAR(20),
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 5. PHOTOS TABLE (Gallery Images)
-- ====================================================================
CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  service_id INT REFERENCES services(id),
  photo_url VARCHAR(500) NOT NULL,
  is_before_after BOOLEAN DEFAULT false,
  before_photo_id INT REFERENCES photos(id),
  caption TEXT,
  display_order INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 6. ADMIN_USERS TABLE (Who Can Manage)
-- ====================================================================
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'owner',
  permissions JSONB DEFAULT '{"view_all": true, "edit_all": false, "delete_reviews": false}',
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note: We'll create admin users via backend during setup
-- MK Nails (Owner): role = 'owner' (full access)
-- You (Developer): role = 'developer' (full access + system management)

-- ====================================================================
-- 7. BUSINESS_SETTINGS TABLE (Configuration)
-- ====================================================================
CREATE TABLE business_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO business_settings (setting_key, setting_value) VALUES
  ('business_name', 'MK Nails'),
  ('address', '19800 S Dixie Hwy suite 9, Cutler Bay, Florida 33015'),
  ('phone', '+1-305-XXX-XXXX'),
  ('email', 'mk_nails@business.com'),
  ('instagram_handle', 'mk_nails_23'),
  ('hours_saturday', '{"open": "09:00", "close": "18:00"}'),
  ('hours_sunday', '{"open": "09:00", "close": "18:00"}'),
  ('booking_advance_days', '90'),
  ('booking_same_day_enabled', 'true'),
  ('payment_methods', '["cash", "card", "website"]'),
  ('timezone', 'America/New_York');

-- ====================================================================
-- 8. REVIEW_AUTOMATION_LOG TABLE (Track SMS/QR sends)
-- ====================================================================
CREATE TABLE review_automation_log (
  id SERIAL PRIMARY KEY,
  booking_id INT NOT NULL REFERENCES bookings(id),
  method VARCHAR(20),
  status VARCHAR(20),
  phone_number VARCHAR(20),
  message_sid VARCHAR(100),
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- HELPFUL VIEWS (For quick data access)
-- ====================================================================

-- View: Available Slots for a Specific Date
CREATE VIEW available_slots_view AS
SELECT 
  b.booking_date,
  s.duration_minutes,
  b.start_time,
  b.end_time,
  (
    SELECT COUNT(*) FROM bookings 
    WHERE booking_date = b.booking_date 
    AND start_time = b.start_time 
    AND status IN ('confirmed', 'completed')
  ) as booking_count,
  CASE 
    WHEN (SELECT COUNT(*) FROM bookings 
          WHERE booking_date = b.booking_date 
          AND start_time = b.start_time 
          AND status IN ('confirmed', 'completed')) = 0 
    THEN true 
    ELSE false 
  END as is_available
FROM bookings b
JOIN services s ON b.service_id = s.id;

-- View: Customer Summary (for MK's dashboard)
CREATE VIEW customer_summary_view AS
SELECT 
  c.id,
  c.first_name,
  c.last_name,
  c.phone_number,
  c.email,
  COUNT(b.id) as total_bookings,
  SUM(s.price) as total_spent,
  MAX(b.booking_date) as last_booking_date,
  c.is_vip
FROM customers c
LEFT JOIN bookings b ON c.id = b.customer_id
LEFT JOIN services s ON b.service_id = s.id
GROUP BY c.id;

-- View: Revenue Summary
CREATE VIEW revenue_summary_view AS
SELECT 
  DATE_TRUNC('week', b.booking_date)::DATE as week_start,
  SUM(s.price) as weekly_revenue,
  COUNT(b.id) as appointments,
  AVG(s.price) as average_service_price
FROM bookings b
JOIN services s ON b.service_id = s.id
WHERE b.status IN ('confirmed', 'completed')
GROUP BY DATE_TRUNC('week', b.booking_date);

-- ====================================================================
-- SECURITY & BACKUP NOTES
-- ====================================================================
-- This database is now ready for production

-- Backup strategy:
-- - Railway automatically backs up daily (if hosting there)
-- - Add: pg_dump backup script for manual backups
-- - Never share .env file containing DATABASE_URL

-- Performance notes:
-- - Indexes are set on common queries (bookings by date/customer)
-- - JSONB used for settings (allows flexible configuration)
-- - Cascading deletes prevent orphaned records

-- Next steps:
-- 1. Add admin users via backend code
-- 2. Connect backend to this database
-- 3. Seed sample booking data for testing
-- 4. Run backups weekly