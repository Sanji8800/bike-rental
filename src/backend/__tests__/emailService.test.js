/**
 * Email Service Test Suite
 * Tests for email functionality including templates, retry logic, and error handling
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import nodemailer from 'nodemailer';

// Mock nodemailer
jest.mock('nodemailer');

// Mock environment variables
process.env.EMAIL_HOST = 'smtp.test.com';
process.env.EMAIL_USER = 'test@example.com';
process.env.EMAIL_PASS = 'testpass';
process.env.EMAIL_PORT = '587';
process.env.ADMIN_EMAIL = 'admin@example.com';
process.env.SUPPORT_EMAIL = 'support@example.com';
process.env.SUPPORT_PHONE = '+1-800-TEST';
process.env.COMPANY_NAME = 'Test Bike Rental';
process.env.COMPANY_WEBSITE = 'https://test.com';

describe('Email Service', () => {
  let mockTransporter;
  let emailService;

  beforeEach(async () => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup mock transporter
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' }),
      verify: jest.fn().mockResolvedValue(true),
    };

    nodemailer.createTransport.mockReturnValue(mockTransporter);

    // Import service after mocks are set up
    const module = await import('../emailService.js');
    emailService = module;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Email Template Generation', () => {
    const sampleBookingData = {
      rentalId: 'BR-TEST123',
      customer: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        age: 30,
        address: '123 Test St',
      },
      bike: {
        title: 'Mountain Bike Pro',
        price: 25.0,
        image: 'bike.jpg',
      },
      rental: {
        startDate: '2024-07-20',
        endDate: '2024-07-25',
        purpose: 'leisure',
        experience: 'intermediate',
        specialRequests: 'Need helmet',
      },
      totalDays: 5,
      totalPrice: 125.0,
    };

    it('should generate customer confirmation email HTML', () => {
      const html = emailService.customerConfirmationEmailHtml(sampleBookingData);

      expect(html).toContain(sampleBookingData.rentalId);
      expect(html).toContain(sampleBookingData.customer.firstName);
      expect(html).toContain(sampleBookingData.bike.title);
      expect(html).toContain('$125.00');
      expect(html).toContain('Cancellation Policy');
      expect(html).toContain('Need Help?');
      expect(html).toContain('support@example.com');
      expect(html).toContain('+1-800-TEST');
    });

    it('should generate owner notification email HTML', () => {
      const html = emailService.ownerNotificationEmailHtml(sampleBookingData);

      expect(html).toContain(sampleBookingData.rentalId);
      expect(html).toContain(sampleBookingData.customer.firstName);
      expect(html).toContain(sampleBookingData.customer.lastName);
      expect(html).toContain(sampleBookingData.bike.title);
      expect(html).toContain('Action Required');
      expect(html).toContain('Booking Timeline');
      expect(html).toContain('Customer Information');
    });

    it('should include plain text conversion', () => {
      const html = emailService.customerConfirmationEmailHtml(sampleBookingData);
      const text = emailService.htmlToText(html);

      expect(text).not.toContain('<');
      expect(text).not.toContain('>');
      expect(text).toContain(sampleBookingData.rentalId);
      expect(text).toContain(sampleBookingData.customer.firstName);
    });
  });

  describe('Email Sending', () => {
    const sampleBookingData = {
      rentalId: 'BR-TEST123',
      customer: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
      },
      bike: {
        title: 'Mountain Bike Pro',
        price: 25.0,
      },
      rental: {
        startDate: '2024-07-20',
        endDate: '2024-07-25',
      },
      totalDays: 5,
      totalPrice: 125.0,
    };

    it('should send customer confirmation email successfully', async () => {
      const result = await emailService.sendCustomerConfirmationEmail(sampleBookingData);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('test-message-id');
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(1);
      expect(mockTransporter.sendMail.mock.calls[0][0].to).toBe(sampleBookingData.customer.email);
      expect(mockTransporter.sendMail.mock.calls[0][0].subject).toContain(sampleBookingData.rentalId);
    });

    it('should send owner notification email successfully', async () => {
      const result = await emailService.sendOwnerNotificationEmail(sampleBookingData, 'owner@example.com');

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('test-message-id');
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(1);
      expect(mockTransporter.sendMail.mock.calls[0][0].to).toBe('owner@example.com');
    });

    it('should send both emails simultaneously', async () => {
      const results = await emailService.sendBookingEmails(sampleBookingData, 'owner@example.com');

      expect(results.customer.success).toBe(true);
      expect(results.owner.success).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(2);
    });

    it('should handle email failures gracefully', async () => {
      mockTransporter.sendMail.mockRejectedValueOnce(new Error('SMTP error'));

      const results = await emailService.sendBookingEmails(sampleBookingData, 'owner@example.com');

      // Should have attempted to send both, but customer email failed
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(2);
      expect(results.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Retry Logic', () => {
    it('should retry on transient failures', async () => {
      let attempts = 0;
      mockTransporter.sendMail.mockImplementation(() => {
        attempts++;
        if (attempts < 2) {
          throw new Error('Temporary failure');
        }
        return Promise.resolve({ messageId: 'success' });
      });

      const mailOptions = {
        to: 'test@example.com',
        subject: 'Test',
        text: 'Test',
      };

      const result = await emailService.sendEmail(mailOptions);

      expect(result.success).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(2);
    });

    it('should fail after max retries', async () => {
      mockTransporter.sendMail.mockRejectedValue(new Error('Persistent failure'));

      const mailOptions = {
        to: 'test@example.com',
        subject: 'Test',
        text: 'Test',
      };

      await expect(emailService.sendEmail(mailOptions)).rejects.toThrow();
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });
  });

  describe('Error Handling', () => {
    it('should handle missing customer email gracefully', async () => {
      const bookingData = {
        rentalId: 'BR-TEST123',
        customer: { email: '' },
        bike: { title: 'Test', price: 25 },
        rental: { startDate: '2024-07-20', endDate: '2024-07-25' },
        totalDays: 5,
        totalPrice: 125,
      };

      const result = await emailService.sendCustomerConfirmationEmail(bookingData);
      expect(result.success).toBe(false);
      expect(result.reason).toBe('email_disabled');
    });

    it('should handle missing owner email gracefully', async () => {
      const bookingData = {
        rentalId: 'BR-TEST123',
        customer: { email: 'test@example.com' },
        bike: { title: 'Test', price: 25 },
        rental: { startDate: '2024-07-20', endDate: '2024-07-25' },
        totalDays: 5,
        totalPrice: 125,
      };

      const result = await emailService.sendOwnerNotificationEmail(bookingData, null);
      expect(result.success).toBe(false);
      expect(result.reason).toBe('owner_email_missing');
    });
  });

  describe('Performance', () => {
    it('should send multiple emails efficiently', async () => {
      const startTime = Date.now();
      const promises = [];

      for (let i = 0; i < 10; i++) {
        promises.push(
          emailService.sendEmail({
            to: `test${i}@example.com`,
            subject: 'Test',
            text: 'Test',
          })
        );
      }

      await Promise.all(promises);
      const duration = Date.now() - startTime;

      // Should complete in reasonable time (adjust threshold as needed)
      expect(duration).toBeLessThan(5000);
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(10);
    });
  });

  describe('Spam Filter Compatibility', () => {
    it('should include proper email headers', async () => {
      const mailOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test body',
        html: '<p>Test body</p>',
      };

      await emailService.sendEmail(mailOptions);

      const sentMail = mockTransporter.sendMail.mock.calls[0][0];

      // Check for proper email structure
      expect(sentMail.text).toBeDefined();
      expect(sentMail.html).toBeDefined();
      expect(sentMail.subject).toBeDefined();
      expect(sentMail.to).toBeDefined();
    });

    it('should not include spam trigger words in subject', () => {
      const bookingData = {
        rentalId: 'BR-TEST123',
        customer: { email: 'test@example.com', firstName: 'John', lastName: 'Doe' },
        bike: { title: 'Mountain Bike', price: 25 },
        rental: { startDate: '2024-07-20', endDate: '2024-07-25' },
        totalDays: 5,
        totalPrice: 125,
      };

      const html = emailService.customerConfirmationEmailHtml(bookingData);
      const text = emailService.htmlToText(html);

      // Should not contain common spam trigger words inappropriately
      const spamWords = ['FREE MONEY', 'CLICK HERE NOW', 'URGENT ACTION'];
      spamWords.forEach((word) => {
        expect(text.toUpperCase()).not.toContain(word);
      });
    });
  });

  describe('Localization', () => {
    it('should format dates correctly for different locales', () => {
      const bookingData = {
        rentalId: 'BR-TEST123',
        customer: { email: 'test@example.com', firstName: 'John', lastName: 'Doe' },
        bike: { title: 'Mountain Bike', price: 25 },
        rental: {
          startDate: '2024-07-20',
          endDate: '2024-07-25',
        },
        totalDays: 5,
        totalPrice: 125,
      };

      const html = emailService.customerConfirmationEmailHtml(bookingData);

      // Check that dates are formatted
      expect(html).toContain('2024');
      expect(html).toContain('July');
    });

    it('should format currency correctly', () => {
      const bookingData = {
        rentalId: 'BR-TEST123',
        customer: { email: 'test@example.com', firstName: 'John', lastName: 'Doe' },
        bike: { title: 'Mountain Bike', price: 25.5 },
        rental: {
          startDate: '2024-07-20',
          endDate: '2024-07-25',
        },
        totalDays: 5,
        totalPrice: 127.5,
      };

      const html = emailService.customerConfirmationEmailHtml(bookingData);

      // Check currency formatting
      expect(html).toContain('$25.50');
      expect(html).toContain('$127.50');
    });
  });
});
