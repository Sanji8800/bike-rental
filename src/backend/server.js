// server-sqlite.js
import express from 'express';
import pkg from 'sqlite3';
const sqlite3 = pkg.verbose();
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { sendBookingEmails, initializeEmailService } from './emailService.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

console.log('🔧 Starting bike rental backend server...');
console.log(`📌 Port configuration: PORT=${PORT} (env: ${process.env.PORT || 'not set'}, default: 3002)`);

// Middleware - CORS configuration
// In development, allow all localhost origins
const isDevelopment = process.env.NODE_ENV !== 'production';

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) {
      console.log('📡 CORS: Allowing request with no origin');
      return callback(null, true);
    }

    // In development, allow all localhost and 127.0.0.1 origins
    if (isDevelopment) {
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        console.log(`✅ CORS: Allowing origin in development: ${origin}`);
        return callback(null, true);
      }
    }

    // List of allowed origins for production
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'http://localhost:8080',
      'http://127.0.0.1:8080',
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log(`✅ CORS: Allowing origin: ${origin}`);
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS: Origin not in whitelist: ${origin}`);
      // In development, still allow but warn
      if (isDevelopment) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  credentials: true,
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
  next();
});

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// SQLite database setup
const db = new sqlite3.Database('./bike_rentals.db', (err) => {
  if (err) {
    console.error('❌ SQLite connection failed:', err.message);
  } else {
    console.log('✅ Connected to SQLite database: bike_rentals.db');
    initializeDatabase();
  }
});

function initializeDatabase() {
  const createRentalsTable = `
    CREATE TABLE IF NOT EXISTS rentals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rental_id TEXT UNIQUE NOT NULL,
      bike_title TEXT NOT NULL,
      bike_price REAL,
      bike_image TEXT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      age INTEGER,
      address TEXT,
      aadhar_number TEXT,
      pan_number TEXT,
      license_number TEXT,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      rental_purpose TEXT,
      cycling_experience TEXT,
      emergency_contact_name TEXT,
      emergency_contact_phone TEXT,
      special_requests TEXT,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'pending'
    )
  `;

  const createEmailLogsTable = `
    CREATE TABLE IF NOT EXISTS email_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rental_id TEXT,
      recipient_email TEXT NOT NULL,
      recipient_type TEXT NOT NULL,
      subject TEXT NOT NULL,
      status TEXT NOT NULL,
      message_id TEXT,
      error_message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (rental_id) REFERENCES rentals(rental_id)
    )
  `;

  db.run(createRentalsTable, (err) => {
    if (err) {
      console.error('❌ Rentals table creation failed:', err.message);
    } else {
      console.log('✅ Rentals table initialized successfully');
    }
  });

  db.run(createEmailLogsTable, (err) => {
    if (err) {
      console.error('❌ Email logs table creation failed:', err.message);
    } else {
      console.log('✅ Email logs table initialized successfully');
    }
  });
}

function generateRentalId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `BR-${timestamp}-${random}`.toUpperCase();
}

// Initialize email service
(async () => {
  await initializeEmailService();
})();

// Promise helper for sqlite get
const dbGet = (sql, params = []) =>
  new Promise((resolve, reject) => db.get(sql, params, (e, row) => (e ? reject(e) : resolve(row))));

// API endpoint to handle rental submissions
app.post('/api/rentals', (req, res) => {
  console.log('\n📝 New rental application received:');
  console.log('Bike:', req.body.bike?.title);
  console.log('Customer:', req.body.customer?.firstName, req.body.customer?.lastName);

  const { bike, customer, rental, additional } = req.body;
  const rentalId = generateRentalId();

  const insertQuery = `
    INSERT INTO rentals (
      rental_id, bike_title, bike_price, bike_image,
      first_name, last_name, email, phone, age, address,
      aadhar_number, pan_number, license_number,
      start_date, end_date, rental_purpose, cycling_experience,
      emergency_contact_name, emergency_contact_phone, special_requests
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    rentalId,
    bike?.title || '',
    parseFloat(bike?.price) || 0,
    bike?.image || '',
    customer?.firstName || '',
    customer?.lastName || '',
    customer?.email || '',
    customer?.phone || '',
    parseInt(customer?.age) || null,
    customer?.address || '',
    customer?.aadhar || '',
    customer?.pan || '',
    customer?.license || '',
    rental?.startDate || null,
    rental?.endDate || null,
    rental?.purpose || '',
    rental?.experience || '',
    additional?.emergencyContact || '',
    additional?.emergencyPhone || '',
    additional?.specialRequests || '',
  ];

  db.run(insertQuery, values, function (err) {
    if (err) {
      console.error('❌ Database error:', err.message);
      return res.status(500).json({ success: false, message: 'Internal server error occurred' });
    }

    const startDate = new Date(rental?.startDate);
    const endDate = new Date(rental?.endDate);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;
    const totalPrice = days * (parseFloat(bike?.price) || 0);
    const databaseId = this.lastID;

    console.log('✅ Rental saved successfully with ID:', rentalId);

    // Respond immediately
    res.status(201).json({
      success: true,
      message: 'Rental application submitted successfully',
      data: {
        rentalId,
        databaseId,
        totalDays: days,
        totalPrice: totalPrice,
        status: 'pending',
      },
    });

    // Send emails asynchronously (fire-and-forget)
    setImmediate(async () => {
      try {
        const bookingData = {
          rentalId,
          customer: {
            firstName: customer?.firstName || '',
            lastName: customer?.lastName || '',
            email: (customer?.email || '').trim(),
            phone: customer?.phone || '',
            age: parseInt(customer?.age) || null,
            address: customer?.address || '',
          },
          bike: {
            title: bike?.title || '',
            price: parseFloat(bike?.price) || 0,
            image: bike?.image || '',
          },
          rental: {
            startDate: rental?.startDate || '',
            endDate: rental?.endDate || '',
            purpose: rental?.purpose || '',
            experience: rental?.experience || '',
            specialRequests: additional?.specialRequests || '',
          },
          totalDays: days,
          totalPrice: totalPrice,
        };

        const emailResults = await sendBookingEmails(
          bookingData,
          process.env.OWNER_EMAIL || process.env.ADMIN_EMAIL,
          db
        );

        if (emailResults.customer?.success) {
          console.log('✅ Customer confirmation email sent:', emailResults.customer.messageId);
        } else if (emailResults.customer) {
          console.warn('⚠️  Customer email failed:', emailResults.customer.error || emailResults.customer.reason);
        }

        if (emailResults.owner?.success) {
          console.log('✅ Owner notification email sent:', emailResults.owner.messageId);
        } else if (emailResults.owner) {
          console.warn('⚠️  Owner email failed:', emailResults.owner.error || emailResults.owner.reason);
        }

        if (emailResults.errors.length > 0) {
          console.error('❌ Email errors:', emailResults.errors);
        }
      } catch (error) {
        console.error('❌ Failed to send booking emails:', error.message);
        // Don't throw - we've already responded to the client
      }
    });
  });
});

// API endpoint to get all rentals
app.get('/api/rentals', (req, res) => {
  console.log('📋 Fetching all rentals...');
  db.all('SELECT * FROM rentals ORDER BY submitted_at DESC', [], (err, rows) => {
    if (err) {
      console.error('❌ Fetch error:', err.message);
      return res.status(500).json({ success: false, message: 'Failed to fetch rentals' });
    }
    console.log(`✅ Retrieved ${rows.length} rental records`);
    res.json({ success: true, data: rows });
  });
});

// Send agreement email (admin trigger) - keeping simple template for now
app.post('/api/rentals/:rentalId/send-agreement', async (req, res) => {
  try {
    const { sendEmail } = await import('./emailService.js');
    const row = await dbGet('SELECT * FROM rentals WHERE rental_id = ?', [req.params.rentalId]);
    if (!row) return res.status(404).json({ success: false, message: 'Rental not found' });

    const agreementHtml = `
      <div style="font-family:Arial,sans-serif;max-width:680px">
        <h2 style="margin:0 0 12px">Bike Rental Agreement</h2>
        <p>Dear ${row.first_name} ${row.last_name},</p>
        <p>Please review the agreement details for rental <b>${row.rental_id}</b>:</p>
        <ul>
          <li>Bike: ${row.bike_title} ($${row.bike_price}/day)</li>
          <li>Rental Period: ${row.start_date} → ${row.end_date}</li>
          <li>License: ${row.license_number || '-'}</li>
          <li>Primary ID: Aadhar ${row.aadhar_number || '-'}, PAN ${row.pan_number || '-'}</li>
        </ul>
        <p>Reply "I Agree" to accept the terms, deposit, and liability conditions.</p>
        <p>We'll contact you to finalize pickup time and deposit.</p>
        <p>Regards,<br/>Bike Rentals Team</p>
      </div>
    `;

    await sendEmail({
      to: row.email,
      cc: process.env.ADMIN_EMAIL || undefined,
      subject: `Rental Agreement - ${row.rental_id}`,
      html: agreementHtml,
      text: agreementHtml.replace(/<[^>]+>/g, ''),
    });

    res.json({ success: true, message: 'Agreement email sent' });
  } catch (e) {
    console.error('Agreement email error:', e);
    res.status(500).json({ success: false, message: 'Failed to send agreement email' });
  }
});

// Test email endpoint
app.get('/api/test-email', async (req, res) => {
  try {
    const { sendEmail } = await import('./emailService.js');
    const result = await sendEmail({
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: 'SMTP Test - Bike Rentals',
      text: 'This is a test email from your backend.',
      html: '<p>This is a test email from your backend.</p>',
    });
    console.log('✅ Test email sent:', result.messageId);
    res.json({ success: true, message: 'Test email sent', messageId: result.messageId });
  } catch (e) {
    console.error('❌ Test email error:', e);
    res.status(500).json({ success: false, message: e.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('💚 Health check requested');
  res.json({
    status: 'healthy',
    database: 'SQLite',
    timestamp: new Date().toISOString(),
    port: PORT,
    message: 'Bike rental backend is running successfully!',
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 Bike Rental Backend Server Started Successfully!');
  console.log('═══════════════════════════════════════════════');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log('📍 Available API endpoints:');
  console.log(`   POST http://localhost:${PORT}/api/rentals`);
  console.log(`   GET  http://localhost:${PORT}/api/rentals`);
  console.log(`   POST http://localhost:${PORT}/api/rentals/:rentalId/send-agreement`);
  console.log(`   GET  http://localhost:${PORT}/api/test-email`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
  console.log('═══════════════════════════════════════════════');
  console.log('💡 Frontend should connect to these endpoints');
  console.log('🛑 Press Ctrl+C to stop the server');
  console.log('\n⏳ Waiting for requests...\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('✅ Database closed successfully');
    }
    console.log('👋 Server stopped. Goodbye!');
    process.exit(0);
  });
});

app.post('/api/contact', async (req, res) => {
  try {
    if (!transporter) return res.status(500).json({ success: false, message: 'Email not configured' });

    const { name, email, phone, subject, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    const adminTo = (process.env.ADMIN_EMAIL || process.env.EMAIL_USER || '').trim();
    if (!adminTo) return res.status(500).json({ success: false, message: 'Admin email not configured' });

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:640px">
        <h3 style="margin:0 0 8px">New Contact Message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || '-'}</p>
        <p><b>Subject:</b> ${subject || 'Contact Form'}</p>
        <div style="background:#f3f4f6;padding:12px;border-radius:8px;margin-top:8px;white-space:pre-wrap">${message}</div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: adminTo,
      replyTo: email, // admin can reply directly to the user
      subject: subject ? `Contact: ${subject}` : 'New Contact Message',
      html,
    });

    console.log('📥 Contact email sent:', info.messageId);
    res.json({ success: true, message: 'Message sent to admin' });
  } catch (e) {
    console.error('❌ Contact email error:', e);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});
