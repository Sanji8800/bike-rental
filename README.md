# Bike Rental Application

A full-stack bike rental booking system with comprehensive email notifications.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Initial Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up the database:**

   ```bash
   npm run setup:backend
   ```

   This creates the SQLite database and required tables.

3. **Configure environment variables (optional):**

   Create a `.env` file in the root directory for email functionality:

   ```env
   # Email Configuration (optional - app works without it)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=Bike Rental <noreply@bikerental.com>

   # Owner/Admin Configuration
   OWNER_EMAIL=owner@example.com
   ADMIN_EMAIL=admin@example.com

   # Support Information (optional)
   SUPPORT_EMAIL=support@example.com
   SUPPORT_PHONE=+1-800-BIKE-RENT
   COMPANY_NAME=Bike Rental Company
   COMPANY_WEBSITE=https://bikerental.com

   # Server Port (optional - defaults to 3002)
   PORT=3002
   ```

## 📱 Running the Application

### Option 1: Run Both Servers in Separate Terminals (Recommended)

**Terminal 1 - Backend Server:**

```bash
npm run dev:backend
```

Backend will run on: `http://localhost:3002`

**Terminal 2 - Frontend Server:**

```bash
npm run dev
```

Frontend will run on: `http://localhost:5173` (or next available port)

### Option 2: Run Backend Only (Production Mode)

**Backend:**

```bash
npm run start:backend
```

**Frontend (in a separate terminal):**

```bash
npm run dev
```

## 🎯 Available Scripts

| Script                  | Description                                     |
| ----------------------- | ----------------------------------------------- |
| `npm run dev`           | Start frontend development server (Vite)        |
| `npm run dev:backend`   | Start backend server with auto-reload (nodemon) |
| `npm run start:backend` | Start backend server (production mode)          |
| `npm run setup:backend` | Initialize database tables                      |
| `npm run build`         | Build frontend for production                   |
| `npm run preview`       | Preview production build                        |
| `npm run lint`          | Run ESLint                                      |

## 🔌 API Endpoints

Once the backend is running, these endpoints are available:

- `POST /api/rentals` - Submit a bike rental booking
- `GET /api/rentals` - Get all rental bookings
- `POST /api/rentals/:rentalId/send-agreement` - Send rental agreement email
- `GET /api/test-email` - Test email configuration
- `GET /api/health` - Health check endpoint
- `POST /api/contact` - Submit contact form

## 🧪 Testing

### Test Email Configuration

```bash
curl http://localhost:3002/api/test-email
```

### Integration Tests

```bash
node src/backend/__tests__/emailService.integration.test.js
```

## 📂 Project Structure

```
bike-rental/
├── src/
│   ├── backend/
│   │   ├── server.js              # Express backend server
│   │   ├── emailService.js        # Email notification service
│   │   ├── setup-database.js      # Database initialization
│   │   └── __tests__/            # Backend tests
│   ├── components/                # React components
│   ├── pages/                     # React pages
│   └── utils/                     # Utility functions
├── public/                        # Static assets
├── bike_rentals.db               # SQLite database (auto-created)
└── package.json
```

## 🔧 Troubleshooting

### Port Already in Use

If you see `EADDRINUSE: address already in use`, kill the process:

**Windows:**

```bash
# Find process using port 3002
netstat -ano | findstr :3002

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Mac/Linux:**

```bash
# Find and kill process using port 3002
lsof -ti:3002 | xargs kill -9
```

### CORS Errors

- Ensure backend is running on port 3002
- Ensure frontend is calling `http://localhost:3002/api/rentals`
- Check browser console for specific error messages

### Database Issues

If database errors occur:

```bash
# Reinitialize database
npm run setup:backend
```

### Email Not Working

- Email service is optional - the app works without it
- Check `.env` file has correct email credentials
- For Gmail, use an App Password (not your regular password)
- Test with: `curl http://localhost:3002/api/test-email`

## 📧 Email Configuration

For detailed email setup instructions, see:

- `src/backend/EMAIL_SERVICE_README.md`

## 🎨 Tech Stack

**Frontend:**

- React 19
- TypeScript
- Vite
- TailwindCSS
- React Router

**Backend:**

- Node.js
- Express.js
- SQLite3
- Nodemailer

## 📝 License

Private project
