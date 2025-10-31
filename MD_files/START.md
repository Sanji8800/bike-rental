# Quick Start Guide

## 🚀 Running the Application

### Step 1: Install Dependencies (if not done)

```bash
npm install
```

### Step 2: Setup Database

```bash
npm run setup:backend
```

### Step 3: Start Backend (Terminal 1)

```bash
npm run dev:backend
```

✅ Backend running on: `http://localhost:3002`

### Step 4: Start Frontend (Terminal 2)

```bash
npm run dev
```

✅ Frontend running on: `http://localhost:5173`

## 🎯 That's It!

Open your browser and navigate to: **http://localhost:5173**

The frontend will automatically connect to the backend on port 3002.

## 📋 What You'll See

- **Backend Terminal**: Shows server logs, API requests, and email notifications
- **Frontend Browser**: The bike rental booking interface

## 🛑 Stopping the Servers

Press `Ctrl + C` in each terminal to stop the servers.

## ⚠️ Troubleshooting

**Port already in use?**

- Kill the process using that port (see README.md)

**CORS errors?**

- Make sure backend is running on port 3002
- Make sure frontend is running on port 5173

**Database errors?**

- Run `npm run setup:backend` again

## 📧 Email Setup (Optional)

To enable email notifications, create a `.env` file:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
OWNER_EMAIL=owner@example.com
```

The app works fine without email - bookings will still be saved to the database.
