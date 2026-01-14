# MK Nails Website - Quick Reference Card

**Print this or save to your phone for quick access**

---

## 🔧 Installation Checklist

```
Software to Install (in order):
☐ Node.js (LTS version)        https://nodejs.org
☐ PostgreSQL                   https://postgresql.org/download
☐ Visual Studio Code           https://code.visualstudio.com
☐ Git                          https://git-scm.com

Verify each installed:
☐ node --version               (should show v18+)
☐ npm --version                (should show 9+)
☐ git --version                (should show 2+)
☐ pgAdmin opens                (postgres password written down?)
```

---

## 📁 Folder Structure

```
Create this structure:
Desktop/
└── mk-nails-website/
    ├── backend/               (npm init -y, npm install...)
    ├── frontend/              (npm create vite@latest . -- --template react)
    ├── .gitignore            (node_modules, .env, dist)
    └── README.md

Folder locations:
Backend:   Desktop/mk-nails-website/backend
Frontend:  Desktop/mk-nails-website/frontend
Database:  PostgreSQL (local)
```

---

## 🔌 Connection URLs

```
Frontend:     http://localhost:5173
Backend:      http://localhost:5000
Database:     localhost:5432
Health Check: http://localhost:5000/api/health
```

---

## 🗄️ Database Info

```
Database Name:  mk_nails_db
Username:       postgres
Password:       [the one you created during PostgreSQL install]
Port:           5432
Host:           localhost

pgAdmin URL:    http://localhost:80
pgAdmin User:   postgres
```

---

## 📦 NPM Packages to Install

```
Backend:
npm install express cors dotenv pg bcryptjs jsonwebtoken twilio cloudinary

Frontend:
npm install tailwindcss axios react-router-dom lucide-react
```

---

## 🎯 Daily Goals

```
Day 1: Environment setup ✅
Day 2: Database + APIs
Day 3: Authentication
Day 4: Homepage + Services
Day 5: Booking Calendar
Day 6: Admin Dashboard (Part 1)
Day 7: Admin Dashboard (Part 2)
Day 8: Reviews + SMS
Day 9: Testing & Polish
Day 10: Deploy to Production
```

---

## 🚀 Common Commands

```
# Navigate to folder
cd path/to/folder

# Start backend (from backend folder)
npm start

# Start frontend (from frontend folder)
npm run dev

# Create new React component
npm create vite@latest . -- --template react

# Stop server
CTRL + C

# View running processes
tasklist | find "node"        (Windows)
ps aux | grep node            (Mac/Linux)

# Kill a process by port
netstat -ano | findstr :5000  (Windows - find PID)
taskkill /PID [number] /F     (Windows - kill it)
```

---

## 🛑 Troubleshooting Quick Fixes

```
❌ "npm not found"
✅ Restart Command Prompt completely
✅ Restart computer
✅ Reinstall Node.js

❌ "Cannot connect to database"
✅ Make sure PostgreSQL service is running
✅ Check password in .env file
✅ Verify pgAdmin shows mk_nails_db

❌ "Port 5000 already in use"
✅ Kill the process on that port (see commands above)
✅ Or use different port (change in .env)

❌ "Module not found"
✅ npm install (run from correct folder)
✅ Delete node_modules, npm install again

❌ "React not loading"
✅ Make sure npm run dev is running
✅ Check console for errors (F12)
✅ Verify VITE_API_URL in .env
```

---

## 📱 API Endpoints (Day 2+)

```
Services:
GET    /api/services           Get all services
GET    /api/services/:id       Get one service
POST   /api/services           Create service (admin)
PUT    /api/services/:id       Update service (admin)
DELETE /api/services/:id       Delete service (admin)

Bookings:
GET    /api/bookings           List bookings (admin)
GET    /api/bookings/:id       Get one booking
POST   /api/bookings           Create booking (customer)
PUT    /api/bookings/:id       Update booking (admin)
GET    /api/bookings/availability   Check available slots

Authentication:
POST   /api/auth/register      Create admin user
POST   /api/auth/login         Log in (get token)
POST   /api/auth/logout        Log out
GET    /api/auth/me            Current user info

Reviews:
GET    /api/reviews            List reviews
POST   /api/reviews            Submit review
PUT    /api/reviews/:id        Approve/reject (admin)
DELETE /api/reviews/:id        Delete review (admin)
```

---

## 🔐 Environment Variables

```
backend/.env
─────────────────────────────────────────
DATABASE_URL=postgresql://postgres:PASSWORD@localhost:5432/mk_nails_db
JWT_SECRET=your_super_secret_key_here_make_it_long_and_random
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxx     (get from twilio.com)
TWILIO_AUTH_TOKEN=your_auth_token        (get from twilio.com)
CLOUDINARY_NAME=your_name                (get from cloudinary.com)
CLOUDINARY_API_KEY=your_key              (get from cloudinary.com)
CLOUDINARY_API_SECRET=your_secret        (get from cloudinary.com)
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

frontend/.env
─────────────────────────────────────────
VITE_API_URL=http://localhost:5000
VITE_INSTAGRAM_HANDLE=mk_nails_23
VITE_BUSINESS_ADDRESS=19800 S Dixie Hwy suite 9, Cutler Bay, Florida 33015
```

---

## 📊 Database Tables

```
8 Core Tables:
1. services          - What MK offers
2. customers         - Who books
3. bookings          - Appointments
4. reviews           - Feedback
5. photos            - Gallery images
6. admin_users       - Login accounts
7. business_settings - Configuration
8. review_automation_log - SMS tracking
```

---

## 🎨 Tailwind CSS Quick Classes

```
Colors:          text-blue-500, bg-red-200, border-green-400
Spacing:         m-4 (margin), p-8 (padding), gap-2 (flex gap)
Layout:          flex, grid, block, inline-block
Responsive:      md:text-lg, lg:flex, sm:hidden
Text:            font-bold, text-center, text-lg
Borders:         border, border-2, rounded-lg, shadow-lg
Hover:           hover:bg-blue-600, hover:scale-110
```

---

## 📞 Support Resources

```
React:              react.dev
Express:            expressjs.com
PostgreSQL:         postgresql.org/docs
Tailwind:           tailwindcss.com
MDN (JavaScript):   developer.mozilla.org
Node.js:            nodejs.org/docs
```

---

## ✅ Success Checklist

```
Day 1:
☐ All software installed
☐ Project folder created
☐ Backend running on :5000
☐ Frontend running on :5173
☐ Database shows tables

Day 2-10:
☐ Follow 10-DAY-ROADMAP.md
☐ Build features in order
☐ Test after each feature
☐ Commit code to git
☐ Document progress

Day 10:
☐ Website live at custom domain
☐ Customers can book
☐ MK can manage from dashboard
☐ Reviews collecting automatically
☐ Instagram feed displays
☐ You understand entire system
```

---

## 💰 Cost Breakdown

```
Development (you):    Free (your time)
Domain (1 year):      $12
Hosting (monthly):    $0 (Vercel free)
                      $5 (Railway minimum, can be free tier)
Database:             $0 (included with Railway)
SMS (optional):       $0.0075 per message (Twilio)
Payments (optional):  2.2% + $0.30 per transaction (Stripe)

Total First Year:     $12 (domain)
Total Per Month:      $0-5 (hosting)
```

---

## 🎓 Skills You'll Earn

```
✅ React (frontend framework)
✅ Node.js + Express (backend)
✅ PostgreSQL (database)
✅ REST APIs (how software talks)
✅ Authentication (secure login)
✅ Deployment (launching code)
✅ Git (version control)
✅ Tailwind CSS (modern design)
✅ Full-stack development (everything)

Market Value: $150-300/hour freelance rate
```

---

## 📝 Notes Section

```
Things I learned:
___________________________________
___________________________________
___________________________________

Questions to research:
___________________________________
___________________________________
___________________________________

Features to add later:
___________________________________
___________________________________
___________________________________

Helpful links:
___________________________________
___________________________________
___________________________________
```

---

**Keep this reference handy. Update your notes section as you learn.**

**Ready? Start with START-HERE.md and DAY-1-SETUP.md**

**You've got this. 💪**
