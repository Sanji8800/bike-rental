# 🚀 How to Start Both Servers

## ⚠️ IMPORTANT: You Need TWO Terminal Windows!

### Terminal 1 - Backend Server (REQUIRED)

```bash
npm run start:backend
```

**What to look for:**

```
🔧 Starting bike rental backend server...
📌 Port configuration: PORT=3002
✅ Connected to SQLite database
🚀 Bike Rental Backend Server Started Successfully!
📡 Server running on: http://localhost:3002
```

**✅ Keep this terminal open and running!**

### Terminal 2 - Frontend Server

```bash
npm run dev
```

**What to look for:**

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

**✅ Keep this terminal open and running!**

## ✅ Verification Steps

1. **Check Backend is Running:**

   - Open: http://localhost:3002/api/health
   - Should see: `{"status":"healthy",...}`

2. **Check Frontend is Running:**

   - Open: http://localhost:5173
   - Should see the bike rental website

3. **Test the Connection:**
   - Submit a booking form
   - Should work without CORS errors

## 🔧 Troubleshooting

### "CORS request did not succeed" Error

**Cause:** Backend server is NOT running

**Solution:**

1. Open a new terminal (Terminal 1)
2. Run: `npm run start:backend`
3. Wait for: `📡 Server running on: http://localhost:3002`
4. Then try submitting the form again

### "Port already in use" Error

**Solution:**

```bash
npm run kill-ports
# Then try starting again
npm run start:backend
```

### Server Won't Start

1. Check if port 3002 is free:

   ```bash
   netstat -ano | findstr :3002
   ```

2. Kill any process using the port:

   ```bash
   npm run kill-ports
   ```

3. Make sure database exists:

   ```bash
   npm run setup:backend
   ```

4. Try starting again:
   ```bash
   npm run start:backend
   ```

## 📝 Quick Reference

**Both servers must be running simultaneously:**

| Server   | Port | Command                 | Status Check                     |
| -------- | ---- | ----------------------- | -------------------------------- |
| Backend  | 3002 | `npm run start:backend` | http://localhost:3002/api/health |
| Frontend | 5173 | `npm run dev`           | http://localhost:5173            |

**To stop servers:** Press `Ctrl + C` in each terminal
