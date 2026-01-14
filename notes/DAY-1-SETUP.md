# 🚀 Day 1: Quick Start Guide

**Goal**: Get your development environment set up and running by tonight.
**Time**: 2-3 hours
**Difficulty**: Beginner-friendly

---

## ✅ Step-by-Step Checklist

### Phase 1: Software Installation (45 minutes)

#### 1. Install Node.js
- **Go to**: https://nodejs.org
- **Download**: LTS version (18 or newer, not the latest)
- **Run installer**: Click "Next" through everything, use defaults
- **Verify installation**:
  ```bash
  # Open Command Prompt (press Win + R, type "cmd")
  node --version
  # Should show: v18.x.x or higher
  
  npm --version
  # Should show: 9.x.x or higher
  ```

#### 2. Install PostgreSQL
- **Go to**: https://www.postgresql.org/download/windows
- **Download**: Windows installer (newest stable version)
- **During installation**:
  - When asked for password: **Create something you'll remember** (write it down!)
  - Example: `MKNails2026!` (save this in a notes file)
  - Port should be **5432** (default - don't change)
  - Locale: English, United States (default)
  - Click through rest normally
- **Verify installation**:
  - After install, PostgreSQL will start automatically
  - Search "pgAdmin" on your computer and open it
  - Should show a login screen

#### 3. Install Visual Studio Code
- **Go to**: https://code.visualstudio.com
- **Download**: Windows version
- **Install**: Click "Next" through, select "Add to PATH" if prompted
- **Open it**: Search "Visual Studio Code" in Windows Start menu
- **Install extensions**:
  - Click Extensions icon (left sidebar, squares icon)
  - Search: "ES7+ React/Redux/React-Native snippets" → Install
  - Search: "Prettier - Code formatter" → Install
  - Search: "PostgreSQL" → Install

#### 4. Install Git
- **Go to**: https://git-scm.com/download/win
- **Download**: Windows installer
- **Install**: Accept defaults throughout
- **Verify**:
  ```bash
  git --version
  # Should show: git version 2.x.x
  ```

---

### Phase 2: Create Project Folder (10 minutes)

Open **Command Prompt** and run these commands (one at a time):

```bash
# Navigate to Desktop (or where you want the project)
cd Desktop

# Create project folder
mkdir mk-nails-website

# Enter project folder
cd mk-nails-website

# Initialize git (version control)
git init

# Create backend folder
mkdir backend

# Create frontend folder
mkdir frontend

# Create a root .gitignore file (don't upload secrets to GitHub)
# Windows CMD:
echo node_modules > .gitignore
echo .env >> .gitignore
echo dist >> .gitignore

# Verify structure
dir

# Should show:
# ├── backend/
# ├── frontend/
# └── .gitignore
```

---

### Phase 3: Setup Backend (45 minutes)

```bash
# Enter backend folder
cd backend

# Initialize Node project (creates package.json)
npm init -y

# Install dependencies (copy-paste this entire line)
npm install express cors dotenv pg bcryptjs jsonwebtoken twilio cloudinary

# Verify packages installed
dir
# Should show: node_modules folder

# Create .env file (with secrets)
# Windows CMD:
echo DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/mk_nails_db > .env
echo JWT_SECRET=your_super_secret_key_here_make_it_long_and_random >> .env
echo NODE_ENV=development >> .env
echo PORT=5000 >> .env

# IMPORTANT: Replace YOUR_PASSWORD with the password you created for PostgreSQL!
```

**Edit .env properly:**
- Open the .env file in VSCode
- Replace `YOUR_PASSWORD` with your actual PostgreSQL password
- Example: `postgresql://postgres:MKNails2026!@localhost:5432/mk_nails_db`
- Save (Ctrl+S)

**Create server.js:**
- In VSCode, in the backend folder, create file named `server.js`
- Copy content from BACKEND-server.js file provided
- Save it

**Create package.json scripts:**
- Open backend/package.json
- Find the "scripts" section
- Replace with:
```json
"scripts": {
  "start": "node server.js",
  "dev": "node server.js"
},
```

**Test backend starts:**
```bash
# From backend folder, run:
npm start

# Should see:
# ✅ Database connected at: 2026-01-13...
# MK NAILS BACKEND
# Running on port 5000
# Environment: development
```

If you see this, **backend is working!** ✅

Press `Ctrl+C` to stop it for now.

---

### Phase 4: Setup Frontend (30 minutes)

```bash
# Go back to main project folder
cd ..

# Enter frontend folder
cd frontend

# Create React project with Vite
npm create vite@latest . -- --template react

# When prompted about overwriting files: type "y" and press Enter

# Install dependencies
npm install

# Install additional packages
npm install tailwindcss axios react-router-dom lucide-react

# Create .env file
echo VITE_API_URL=http://localhost:5000 > .env
echo VITE_INSTAGRAM_HANDLE=mk_nails_23 >> .env
echo VITE_BUSINESS_ADDRESS=19800 S Dixie Hwy suite 9, Cutler Bay, Florida 33015 >> .env

# Test frontend starts
npm run dev

# Should show:
# VITE v4.x.x ready in xxx ms
# ➜ Local: http://localhost:5173/
# ➜ press q to quit
```

If you see this, **frontend is working!** ✅

Press `Q` to stop it.

---

### Phase 5: Setup Database (30 minutes)

**Step 1: Open pgAdmin**
- Search "pgAdmin" on your Windows machine
- Open it
- Login with username: `postgres` and password: the one you created during PostgreSQL install

**Step 2: Create Database**
- Right-click "Databases" → "Create" → "Database"
- Name: `mk_nails_db`
- Click "Create"

**Step 3: Create Tables**
- Right-click `mk_nails_db` → "Query Tool"
- A SQL editor opens
- Open DATABASE-SCHEMA.sql file from files provided
- Copy entire content
- Paste into pgAdmin Query Tool
- Press F5 or click "Execute"
- Should see: "Query executed successfully" ✅

**Step 4: Verify Tables**
- Left sidebar: Expand `mk_nails_db` → "Schemas" → "public" → "Tables"
- Should see: services, customers, bookings, reviews, photos, admin_users, business_settings, etc.

---

### Phase 6: Test Everything Together (15 minutes)

**Terminal 1: Backend**
```bash
cd backend
npm start
# Should see database connection message
```

**Terminal 2: Frontend** (open new Command Prompt)
```bash
cd frontend
npm run dev
# Should show Local: http://localhost:5173/
```

**In Browser:**
- Go to `http://localhost:5173`
- Should see React default welcome screen
- Go to `http://localhost:5000/api/health`
- Should see: `{"status":"ok","timestamp":"...","environment":"development"}`

**If both work, you're ready for Day 2!** 🎉

---

## 📝 What You Just Did

✅ **Environment**: Installed Node.js, PostgreSQL, VSCode, Git
✅ **Project Structure**: Created organized folder layout
✅ **Backend**: Created Express server connected to database
✅ **Frontend**: Created React app with Vite
✅ **Database**: Created PostgreSQL database with 8 tables
✅ **Connection**: Verified frontend ↔ backend ↔ database all connected

---

## 🔧 Troubleshooting

### "npm: command not found"
- Node.js might not be installed correctly
- Restart Command Prompt completely
- Restart your computer
- Reinstall Node.js

### "Cannot connect to database"
- Check .env file has correct password
- Make sure PostgreSQL is running (search "postgresql" in services)
- Verify pgAdmin shows the mk_nails_db database

### "Port 5000 already in use"
- Something else is using port 5000
- Kill the process:
  ```bash
  # Windows:
  netstat -ano | findstr :5000
  # Note the PID (number)
  taskkill /PID [number] /F
  ```

### "React not loading on localhost:5173"
- Make sure you ran `npm run dev` from frontend folder
- Check console for errors
- Try: `npm install` again

---

## 📚 Next: Days 2-3 (Database & Backend)

Tomorrow we'll:
1. Create sample data in the database
2. Build the first API endpoints (get services, create bookings)
3. Set up authentication (login system)
4. Test with Postman (API testing tool)

**For now**: Celebrate! You've set up a professional development environment. Most developers spend 2-3 days on this. You did it in one evening. 💪

---

## 🎯 Checklist Before Tomorrow

- [ ] Node.js installed and verified
- [ ] PostgreSQL installed with password saved
- [ ] VSCode installed with extensions
- [ ] Git installed
- [ ] mk-nails-website folder created with structure
- [ ] Backend starts without errors
- [ ] Frontend starts on localhost:5173
- [ ] Database created with tables
- [ ] Health check endpoint works

Once all ✅, message me: "Day 1 complete!" and we'll start Day 2.

**Let's build something great.** 🚀
