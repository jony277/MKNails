# MK Nails Website - Complete Setup Guide

**Status**: Production Ready Starter Template
**Last Updated**: January 13, 2026
**Build Time Target**: 10 Days
**Your Role**: Jonathan (Developer + Admin)
**Step Mom's Role**: MK (Business Owner + Admin)

---

## 🎯 Project Overview

This is a **full-stack nail salon booking website** with:
- ✅ Customer-facing booking system (Saturday-Sunday, 9am-6pm)
- ✅ Admin dashboard for MK to manage everything
- ✅ Developer dashboard for you to manage data
- ✅ Automated SMS review requests + QR code backup
- ✅ Instagram feed integration
- ✅ Gallery with before/after photos
- ✅ Stripe-ready payment integration (backend prepped, frontend optional phase 2)
- ✅ Automatic backups & deployment

---

## 📋 Tech Stack Explained

| Layer | Technology | Why | Your Benefit |
|-------|-----------|-----|--------------|
| **Frontend** | React + Tailwind + Vite | Modern, fast, industry standard | Skills = $150/hr freelance rate |
| **Backend** | Node.js + Express | JavaScript everywhere, scalable | One language for everything |
| **Database** | PostgreSQL | Free, powerful, your data is yours | Can migrate anywhere anytime |
| **Hosting** | Vercel (frontend) + Railway (backend) | Auto-deploys on git push, free tier | Push code = website updates instantly |
| **Authentication** | JWT tokens | Secure, stateless, scalable | Works for any future app |
| **SMS** | Twilio API | 40%+ review response rate | Automation does the work |
| **File Storage** | Cloudinary (free tier) | Unlimited photo uploads | Don't worry about server space |

---

## 🚀 10-Day Build Timeline

```
Day 1 (Today):
  ✅ Environment setup (Node, PostgreSQL, Code editor)
  ✅ Project folder structure created
  ✅ GitHub repo initialized
  → Estimated: 2-3 hours

Days 2-3:
  ✅ Database schema created & tested locally
  ✅ Backend API built (all endpoints)
  ✅ Authentication system (login/register)
  → Estimated: 8-10 hours

Days 4-5:
  ✅ Frontend homepage & services listing
  ✅ Booking calendar component (interactive, real-time availability)
  ✅ Gallery with Instagram feed
  → Estimated: 8-10 hours

Days 6-7:
  ✅ Admin dashboard (MK's control panel)
  ✅ Your developer dashboard
  ✅ Review management system
  → Estimated: 8-10 hours

Days 8-9:
  ✅ SMS automation setup (Twilio)
  ✅ QR code generation
  ✅ Payment integration prep (Stripe backend ready)
  ✅ Testing & bug fixes
  → Estimated: 6-8 hours

Day 10:
  ✅ Deploy to production (Vercel + Railway)
  ✅ Domain setup
  ✅ Documentation & handoff
  ✅ Train MK on admin panel
  → Estimated: 3-4 hours

Total: ~45-55 hours over 10 days
```

---

## 💾 Database Schema (The Brain of the System)

### Why This Matters
Your database IS the business. Services, bookings, customer data, reviews—it all lives here. Understanding this means you can:
- Update pricing easily
- See trends (what services are popular)
- Manage customer relationships
- Build reports
- Export data anytime

### The 7 Core Tables

#### 1️⃣ **SERVICES** (What MK Offers)
```sql
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,                    -- "Gel Manicure"
  description TEXT,                             -- "Long-lasting gel polish"
  price DECIMAL(8, 2) NOT NULL,                 -- 35.00
  duration_minutes INT NOT NULL,                -- 45
  category VARCHAR(50),                         -- "manicure", "pedicure", "special"
  is_available BOOLEAN DEFAULT true,            -- Can new bookings be made?
  display_order INT,                            -- Order on website (1st, 2nd, etc.)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example data:
INSERT INTO services VALUES 
  (1, 'Gel Manicure', 'Durable gel polish', 35.00, 45, 'manicure', true, 1),
  (2, 'Acrylic Full Set', 'Long-lasting acrylics', 50.00, 60, 'acrylic', true, 2),
  (3, 'Gel Pedicure', 'Gel polish on toes', 40.00, 45, 'pedicure', true, 3),
  (4, 'Nail Art Add-on', 'Custom design', 10.00, 15, 'add-on', true, 4);
```

**What it means for the business:**
- MK can add/edit services from admin panel
- You can add/remove services instantly
- Each service has its own duration (affects booking calendar)
- Can pause services without deleting (is_available = false)

---

#### 2️⃣ **BOOKINGS** (Customer Appointments)
```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES customers(id),
  service_id INT NOT NULL REFERENCES services(id),
  booking_date DATE NOT NULL,                   -- 2026-01-15
  start_time TIME NOT NULL,                     -- 14:00 (2pm)
  end_time TIME NOT NULL,                       -- 14:45 (calculated from duration)
  status VARCHAR(20) DEFAULT 'confirmed',       -- confirmed, cancelled, no_show, completed
  special_requests TEXT,                        -- "allergic to powder X", notes
  payment_method VARCHAR(20),                   -- 'cash', 'card', 'website'
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, completed, refunded
  reminder_sent_at TIMESTAMP,                   -- When SMS reminder was sent
  review_link_sent_at TIMESTAMP,                -- When review request sent
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**What it means:**
- Every appointment is a row in this table
- System checks: is this time slot available? (no overlap)
- After appointment: automatically send review request
- MK can see full calendar, mark no-shows, see payment status
- You can see customer patterns (popular times, repeat customers)

---

#### 3️⃣ **CUSTOMERS** (Who Books)
```sql
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  phone_number VARCHAR(20) NOT NULL UNIQUE,    -- Must be unique (no duplicates)
  email VARCHAR(100),
  total_bookings INT DEFAULT 0,                 -- Auto-count (1, 2, 5...)
  total_spent DECIMAL(10, 2) DEFAULT 0,         -- Auto-sum revenue from this customer
  first_booking_date DATE,
  notes TEXT,                                   -- "Allergic to acrylic", preferences
  is_vip BOOLEAN DEFAULT false,                 -- Priority booking? Loyalty program?
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**What it means:**
- Every customer has a profile (even if they only book once)
- System tracks: repeat customers, revenue per customer, preferences
- MK can add notes (allergies, favorite colors, preferred times)
- You can see: who's most loyal? who spends most? who's new?

---

#### 4️⃣ **REVIEWS** (Customer Feedback)
```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  booking_id INT NOT NULL REFERENCES bookings(id),
  customer_id INT NOT NULL REFERENCES customers(id),
  rating INT NOT NULL,                          -- 1-5 stars
  review_text TEXT,
  before_photo_url VARCHAR(500),                -- Link to before photo
  after_photo_url VARCHAR(500),                 -- Link to after photo
  response_method VARCHAR(20),                  -- 'sms', 'qr_code', 'website'
  is_approved BOOLEAN DEFAULT false,            -- You approve before showing
  is_featured BOOLEAN DEFAULT false,            -- Pin to homepage?
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**What it means:**
- Reviews are tied to specific bookings (authentic)
- You have full control: approve/hide/delete reviews
- Negative reviews visible but moderated by you
- Can feature best reviews on homepage
- Tracks how review was collected (SMS, QR, etc.)

---

#### 5️⃣ **PHOTOS** (Gallery Images)
```sql
CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  service_id INT REFERENCES services(id),       -- Linked to service type (optional)
  photo_url VARCHAR(500) NOT NULL,              -- CloudinaryURL
  is_before_after BOOLEAN,                      -- true = paired before/after
  before_photo_id INT REFERENCES photos(id),    -- Link to before photo
  caption TEXT,                                 -- "Fresh gel set", "Custom ombre"
  display_order INT,                            -- Order in gallery
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**What it means:**
- Gallery images are organized
- Can be grouped (before/after pairs)
- MK can upload 50 photos initially, add more anytime
- Photos are linked to services (showing what's possible for each)

---

#### 6️⃣ **ADMIN_USERS** (Who Can Manage)
```sql
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,          -- Never store raw password!
  full_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'owner',             -- 'owner' = MK, 'developer' = you
  permissions JSON,                             -- What they can do: {'delete_reviews': true, ...}
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**What it means:**
- MK has owner-level access (full control)
- You have developer-level access (everything + ability to modify system)
- Future: can add assistants with limited permissions
- Passwords are encrypted (never stored as plain text)

---

#### 7️⃣ **BUSINESS_SETTINGS** (Configuration)
```sql
CREATE TABLE business_settings (
  id SERIAL PRIMARY KEY,
  business_name VARCHAR(100) DEFAULT 'MK Nails',
  address VARCHAR(200) DEFAULT '19800 S Dixie Hwy suite 9, Cutler Bay, Florida 33015',
  phone VARCHAR(20),
  email VARCHAR(100),
  instagram_handle VARCHAR(100) DEFAULT 'mk_nails_23',
  hours_json JSON,  -- {"saturday": {"open": "09:00", "close": "18:00"}, "sunday": {...}}
  payment_methods JSON,  -- {"cash": true, "card": true, "website": true}
  booking_advance_days INT DEFAULT 90,          -- How far ahead can people book?
  booking_same_day_enabled BOOLEAN DEFAULT true, -- Can they book today?
  stripe_api_key VARCHAR(255),                  -- Optional: for payment processing
  twilio_account_sid VARCHAR(255),              -- For SMS reviews
  twilio_auth_token VARCHAR(255),               -- For SMS reviews
  cloudinary_api_key VARCHAR(255),              -- For photo uploads
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**What it means:**
- Centralized configuration (hours, contact, API keys)
- MK updates hours from admin panel (no code changes needed)
- Payment/SMS settings configured once, used everywhere
- You can add settings anytime without database migration

---

## 🔐 How Everything Connects (The Logic Flow)

### Scenario: Customer Books Online

```
1. Customer goes to website
   → Sees available services (from SERVICES table)

2. Customer clicks "Book Gel Manicure"
   → Calendar loads available times
   → System checks BOOKINGS table: what slots are taken?
   → Shows: "2pm available, 2:45pm taken, 3:30pm available"

3. Customer selects 2pm Saturday
   → System checks: Is 2pm-2:45pm free? Yes.
   → Creates BOOKING record (id=101)
   → Creates/updates CUSTOMER record (if first time: new customer row)
   → Booking confirmed! MK gets SMS notification

4. Saturday 2:45pm: Appointment ends
   → Admin marks as "completed"
   → System auto-triggers SMS: "How was your experience? Rate us: [link]"

5. Customer clicks SMS link
   → Sees 1-5 star rating
   → Can upload before/after photos
   → Review saved to REVIEWS table
   → You see it in admin dashboard

6. You approve the review
   → It shows on website
   → Can feature it on homepage
   → Customer sees: "Great review by Sarah - 5 stars ⭐"

7. MK logs in to admin
   → Sees all bookings for the week
   → Can edit services, prices, hours
   → Views revenue, popular services, repeat customers
   → Knows exactly what's happening in the business
```

---

## 🛠️ Installation & Setup (Tonight)

### Step 1: Install Required Software (30 min)

**Windows 11 Setup:**

1. **Install Node.js** (this gives you npm, the code package manager)
   - Go to https://nodejs.org
   - Download LTS version (18 or newer)
   - Run installer, click "Next" through everything
   - Verify: Open Command Prompt, type `node --version` → should show v18+

2. **Install PostgreSQL** (the database)
   - Go to https://www.postgresql.org/download
   - Click Windows
   - Run installer
   - Set password for "postgres" user (remember this!)
   - Port should be 5432 (default)
   - Verify: Open pgAdmin (comes with PostgreSQL), connect

3. **Install Visual Studio Code** (code editor)
   - Go to https://code.visualstudio.com
   - Download, install
   - Install extensions: "ES7+ React/Redux/React-Native snippets" + "Prettier"

4. **Install Git** (version control)
   - Go to https://git-scm.com
   - Download, install
   - Verify: Command Prompt, type `git --version`

### Step 2: Create Project Structure (10 min)

```bash
# Open Command Prompt, navigate where you want the project
cd Desktop

# Create project folder
mkdir mk-nails-website
cd mk-nails-website

# Create folders
mkdir backend frontend

# Initialize backend
cd backend
npm init -y
npm install express cors dotenv pg bcryptjs jsonwebtoken twilio cloudinary

# Initialize frontend
cd ../frontend
npm create vite@latest . -- --template react
npm install tailwindcss axios react-router-dom lucide-react

cd ..
git init
git add .
git commit -m "Initial project structure"
```

### Step 3: Setup Database (20 min)

1. Open pgAdmin (search "pgAdmin" on your computer)
2. Right-click "Databases" → Create → Database
3. Name: `mk_nails_db`
4. Right-click `mk_nails_db` → Query Tool
5. Paste this (see SCHEMA.sql below)
6. Execute (press F5)

---

## 📚 Folder Structure Explained

```
mk-nails-website/
│
├── backend/                          # All server code
│   ├── server.js                     # Main app file (starts server)
│   ├── config/
│   │   └── database.js               # PostgreSQL connection
│   ├── routes/
│   │   ├── auth.js                   # Login/register
│   │   ├── bookings.js               # Appointment endpoints
│   │   ├── services.js               # Service management
│   │   ├── reviews.js                # Review endpoints
│   │   └── admin.js                  # Admin dashboard data
│   ├── middleware/
│   │   ├── auth.js                   # Checks if user is logged in
│   │   └── errorHandler.js           # Catches & handles errors
│   ├── controllers/
│   │   ├── bookingController.js      # Booking logic
│   │   ├── reviewController.js       # Review logic
│   │   └── smsController.js          # SMS sending logic
│   ├── utils/
│   │   ├── smsService.js             # Twilio integration
│   │   └── cloudinaryService.js      # Photo uploads
│   ├── .env                          # Secrets (API keys, passwords)
│   └── package.json                  # Dependencies list
│
├── frontend/                         # All customer-facing code
│   ├── src/
│   │   ├── App.jsx                   # Main app component
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Homepage
│   │   │   ├── Booking.jsx           # Booking page
│   │   │   ├── Gallery.jsx           # Photo gallery
│   │   │   ├── Reviews.jsx           # Reviews page
│   │   │   ├── AdminLogin.jsx        # Login page
│   │   │   ├── AdminDashboard.jsx    # MK's control panel
│   │   │   └── DevDashboard.jsx      # Your dashboard
│   │   ├── components/
│   │   │   ├── BookingCalendar.jsx   # Calendar widget
│   │   │   ├── ServiceCard.jsx       # Service display
│   │   │   ├── ReviewCard.jsx        # Review display
│   │   │   └── AdminSidebar.jsx      # Admin menu
│   │   ├── hooks/
│   │   │   ├── useAuth.js            # Login/logout logic
│   │   │   └── useBooking.js         # Booking logic
│   │   ├── utils/
│   │   │   └── api.js                # Connects to backend
│   │   ├── styles/
│   │   │   └── tailwind.css          # Custom styles
│   │   └── index.css
│   ├── .env                          # Frontend config
│   └── vite.config.js                # Build settings
│
├── .gitignore                        # Don't upload .env, node_modules
└── README.md                         # Project documentation
```

**What each folder does:**
- `backend/routes/` - URLs that frontend talks to (like `/api/bookings`)
- `backend/controllers/` - Logic that happens when someone accesses a route
- `backend/utils/` - Helper functions (sending SMS, uploading photos)
- `frontend/pages/` - Full-page components (Homepage, Booking, etc.)
- `frontend/components/` - Reusable UI pieces (buttons, cards)
- `frontend/hooks/` - Shareable logic (login, data fetching)

---

## 🔑 Environment Variables (.env Files)

These are secrets you NEVER share publicly:

**backend/.env**
```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/mk_nails_db
JWT_SECRET=your_super_secret_key_here_make_it_long_and_random
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_token
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=sk_test_xxx (leave empty for now)
NODE_ENV=development
PORT=5000
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000
VITE_INSTAGRAM_HANDLE=mk_nails_23
VITE_BUSINESS_ADDRESS=19800 S Dixie Hwy suite 9, Cutler Bay, Florida 33015
```

**Why .env files matter:**
- Never commit these to Git (add to .gitignore)
- Each environment (local, production) has different values
- Protects API keys from hackers

---

## 📱 SMS & Review Automation

### How It Works

**After booking is marked "completed":**
1. Backend checks booking status
2. Gets customer phone number
3. Sends SMS via Twilio: "Hi! How was MK Nails? Rate us: [link]"
4. Customer clicks link (goes to your website)
5. They rate 1-5 stars + add photos
6. Review saved, you approve it
7. Shows on website

**QR Code Backup:**
- Print QR code in salon
- Customers scan with phone
- Same review form opens
- No phone number needed (great for first-timers)

**Response Rates:**
- SMS: 40-50% (people respond to personal messages)
- QR: 15-25% (some people don't want to scan)
- Combined: Higher coverage than either alone

---

## 💳 Payment Integration (Phase 2 - Architected Now)

**Now (Phase 1):** Customers book, pay cash/card at salon
**Later (Phase 2):** Add online payment via Stripe

The backend is built so you can add Stripe without changing database structure. We just need to:
1. Add Stripe endpoint
2. Update booking form to show payment option
3. No database changes needed

---

## 🚀 Deployment (Happens Day 10)

### Frontend: Vercel (Free, auto-updates)
```bash
# Push code to GitHub
git push origin main

# Connect GitHub to Vercel (one-time)
# Go to vercel.com → import GitHub repo → done

# Every time you push to main:
# ✅ Vercel auto-deploys
# ✅ Your website updates instantly
# ✅ No servers to manage
```

### Backend: Railway (Free tier, $5/month later)
```bash
# Similar process:
# Railway.app → connect GitHub → auto-deploys

# Cost breakdown:
# - Railway: free → $5/month (more than enough)
# - Vercel: free (unlimited)
# - PostgreSQL: included in Railway free tier
# - Total: $5/month (incredibly cheap)
```

### Domain: Namecheap ($12/year)
```bash
# Buy domain: mknailsmiami.com (or similar)
# Point to Vercel (they give you DNS settings)
# Takes 15 minutes to propagate
```

---

## 📊 Admin Dashboard Overview

### MK's Dashboard (Owner Access)
- **Bookings Calendar** - See all appointments
- **Manage Services** - Edit prices, add/remove services
- **View Customers** - See repeat customers, notes
- **Approve Reviews** - Moderate feedback before it shows
- **Manage Photos** - Upload/organize gallery
- **Business Settings** - Hours, contact info, payment methods
- **Analytics** - Revenue, popular services, peak times

### Your Dashboard (Developer Access)
- Everything MK has +
- **Database Export** - Download all data as CSV
- **Backup Management** - Automatic daily backups
- **System Health** - Check if server is running
- **User Management** - Add/remove admin users
- **Code Deployment** - Trigger updates manually if needed
- **API Testing** - Test endpoints before releasing

---

## 🎓 What You'll Learn (Career Skills)

By building this, you get:

✅ **Full-stack development** - Frontend + Backend + Database
✅ **Real authentication** - Secure login systems
✅ **API design** - RESTful endpoints (used in ALL modern apps)
✅ **Database modeling** - How to structure data for businesses
✅ **Third-party integrations** - SMS, payments, cloud storage
✅ **DevOps basics** - Deployment, environments, CI/CD
✅ **Code organization** - Professional folder structure
✅ **Security practices** - Password hashing, environment variables
✅ **Error handling** - Building robust systems
✅ **Documentation** - So future developers (or you) understand your code

**Market value:** $150-300/hour freelance rates with this skillset.

---

## 📞 Support & Next Steps

**Day 1 tasks:**
1. Install Node.js, PostgreSQL, VSCode, Git
2. Create project structure (copy-paste the mkdir commands)
3. Read through this document again (it's the blueprint)
4. Confirm you have everything installed

**Day 2:**
- Start building the database
- Create backend structure
- Get first API endpoint working

---

## 🎯 Success Metrics (By Day 10)

- ✅ Website is live (owns domain)
- ✅ Customers can book online
- ✅ Calendar shows real availability
- ✅ MK can manage everything from admin panel
- ✅ Reviews are collected automatically
- ✅ Gallery displays before/after photos
- ✅ Instagram feed shows on website
- ✅ Payment ready (cash/card accepted, Stripe prep done)
- ✅ You can update code and deploy in 2 minutes
- ✅ Database is backed up automatically

---

**Ready? Let's build something you're proud to show.**

Next: I'll send you the database schema SQL file. You'll paste it into pgAdmin and your database is ready.

Questions? We clarify before coding. Let's go. 🚀
