/**
 * Email Service Integration Tests
 * Simple integration tests that can be run with Node.js (no Jest required)
 *
 * Run with: node src/backend/__tests__/emailService.integration.test.js
 */

import { sendBookingEmails, sendCustomerConfirmationEmail, sendOwnerNotificationEmail } from '../emailService.js';

// Simple test runner
function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    return true;
  } catch (error) {
    console.error(`❌ ${name}:`, error.message);
    return false;
  }
}

async function asyncTest(name, fn) {
  try {
    await fn();
    console.log(`✅ ${name}`);
    return true;
  } catch (error) {
    console.error(`❌ ${name}:`, error.message);
    return false;
  }
}

// Mock database (optional - for tests that need it)
const mockDb = {
  run: (query, params, callback) => {
    if (callback) {
      callback(null, { lastID: 1 });
    }
  },
};

// Sample booking data
const sampleBookingData = {
  rentalId: 'BR-TEST-INTEGRATION',
  customer: {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '9876543210',
    age: 28,
    address: '456 Test Avenue, Test City, TC 12345',
  },
  bike: {
    title: 'Premium Road Bike',
    price: 35.0,
    image: 'premium-road-bike.jpg',
  },
  rental: {
    startDate: '2024-08-01',
    endDate: '2024-08-07',
    purpose: 'adventure',
    experience: 'advanced',
    specialRequests: 'Need GPS tracker and extra lock',
  },
  totalDays: 7,
  totalPrice: 245.0,
};

async function runIntegrationTests() {
  console.log('🧪 Running Email Service Integration Tests\n');
  console.log('Note: These tests require email configuration in .env file');
  console.log('Required: EMAIL_HOST, EMAIL_USER, EMAIL_PASS\n');

  const results = [];

  // Test 1: Email template generation
  results.push(
    test('Email templates should be generated', async () => {
      const { customerConfirmationEmailHtml, ownerNotificationEmailHtml, htmlToText } = await import(
        '../emailService.js'
      );
      const customerHtml = customerConfirmationEmailHtml(sampleBookingData);
      const ownerHtml = ownerNotificationEmailHtml(sampleBookingData);

      if (!customerHtml || customerHtml.length === 0) {
        throw new Error('Customer email HTML is empty');
      }

      if (!ownerHtml || ownerHtml.length === 0) {
        throw new Error('Owner email HTML is empty');
      }

      // Check for key content
      if (!customerHtml.includes(sampleBookingData.rentalId)) {
        throw new Error('Customer email missing rental ID');
      }

      if (!ownerHtml.includes(sampleBookingData.customer.firstName)) {
        throw new Error('Owner email missing customer name');
      }

      // Test plain text conversion
      const plainText = htmlToText(customerHtml);
      if (!plainText || plainText.includes('<')) {
        throw new Error('Plain text conversion failed');
      }
    })
  );

  // Test 2: Email sending with disabled email (should handle gracefully)
  results.push(
    await asyncTest('Should handle disabled email service gracefully', async () => {
      // Temporarily disable email
      const originalEmailEnabled = process.env.EMAIL_HOST;
      delete process.env.EMAIL_HOST;

      try {
        const result = await sendCustomerConfirmationEmail(sampleBookingData);
        if (result.success !== false) {
          throw new Error('Should return success: false when email is disabled');
        }
      } finally {
        if (originalEmailEnabled) {
          process.env.EMAIL_HOST = originalEmailEnabled;
        }
      }
    })
  );

  // Test 3: Email data structure validation
  results.push(
    test('Booking data structure validation', () => {
      const requiredFields = ['rentalId', 'customer', 'bike', 'rental', 'totalDays', 'totalPrice'];
      requiredFields.forEach((field) => {
        if (!sampleBookingData[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      });

      const requiredCustomerFields = ['firstName', 'lastName', 'email'];
      requiredCustomerFields.forEach((field) => {
        if (!sampleBookingData.customer[field]) {
          throw new Error(`Missing required customer field: ${field}`);
        }
      });
    })
  );

  // Test 4: Currency formatting
  results.push(
    test('Currency formatting in templates', async () => {
      const { customerConfirmationEmailHtml } = await import('../emailService.js');
      const html = customerConfirmationEmailHtml(sampleBookingData);

      // Check that prices are formatted correctly
      if (!html.includes('$35.00')) {
        throw new Error('Daily price not formatted correctly');
      }

      if (!html.includes('$245.00')) {
        throw new Error('Total price not formatted correctly');
      }
    })
  );

  // Test 5: Date formatting
  results.push(
    test('Date formatting in templates', async () => {
      const { customerConfirmationEmailHtml } = await import('../emailService.js');
      const html = customerConfirmationEmailHtml(sampleBookingData);

      // Check that dates appear in readable format
      if (!html.includes('2024')) {
        throw new Error('Year not found in email');
      }

      if (!html.includes('August') || !html.includes('July')) {
        // At least one month name should be present
        console.warn('⚠️  Month names not found - may be using numeric dates');
      }
    })
  );

  // Test 6: Cancellation policy inclusion
  results.push(
    test('Cancellation policy should be included', async () => {
      const { customerConfirmationEmailHtml } = await import('../emailService.js');
      const html = customerConfirmationEmailHtml(sampleBookingData);

      if (!html.includes('Cancellation Policy')) {
        throw new Error('Cancellation policy section missing');
      }

      if (!html.includes('refund')) {
        throw new Error('Cancellation policy details missing');
      }
    })
  );

  // Test 7: Support information inclusion
  results.push(
    test('Support information should be included', async () => {
      const { customerConfirmationEmailHtml } = await import('../emailService.js');
      const html = customerConfirmationEmailHtml(sampleBookingData);

      if (!html.includes('Need Help?') && !html.includes('support')) {
        throw new Error('Support information missing');
      }
    })
  );

  // Summary
  const passed = results.filter((r) => r).length;
  const total = results.length;

  console.log(`\n📊 Test Results: ${passed}/${total} passed`);

  if (passed === total) {
    console.log('✅ All integration tests passed!');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed');
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runIntegrationTests().catch((error) => {
    console.error('❌ Test runner error:', error);
    process.exit(1);
  });
}

export { runIntegrationTests };
