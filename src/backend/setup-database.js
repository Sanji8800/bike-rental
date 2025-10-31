import pkg from 'sqlite3';
const sqlite3 = pkg.verbose();
import dotenv from 'dotenv';
dotenv.config();

async function setupDatabase() {
  try {
    const db = new sqlite3.Database('./bike_rentals.db', (err) => {
      if (err) {
        console.error('❌ SQLite connection failed:', err.message);
        process.exit(1);
      } else {
        console.log('✅ Connected to SQLite database: bike_rentals.db');
      }
    });

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
        process.exit(1);
      } else {
        console.log('✅ Rentals table initialized successfully');
      }
    });

    db.run(createEmailLogsTable, (err) => {
      if (err) {
        console.error('❌ Email logs table creation failed:', err.message);
        process.exit(1);
      } else {
        console.log('✅ Email logs table initialized successfully');
      }
    });

    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('✅ Database closed successfully');
      }
    });
    console.log('✅ Database setup completed');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
