# Email Notification Service

This document describes the comprehensive email notification system for the bike booking application.

## Overview

The email service automatically sends confirmation and notification emails when a bike booking is successfully submitted. It includes:

- **Customer Confirmation Email**: Sent to the person making the booking
- **Owner Notification Email**: Sent to the bike owner/hoster for review
- **Retry Logic**: Automatic retries with exponential backoff for transient failures
- **Email Logging**: All email attempts are logged to the database
- **Comprehensive Templates**: Professional HTML and plain text email templates

## Features

### ✅ Customer Confirmation Email Includes:

- Booking reference number (prominently displayed)
- Complete booking details (dates, bike model, pricing)
- Booking timeline and duration
- Cancellation policy information
- Support contact details (email, phone, website)
- Professional branding and formatting

### ✅ Owner Notification Email Includes:

- Booking request details
- Complete customer contact information
- Booking timeline
- Instructions for confirming/denying bookings
- Action items checklist
- Quick contact links

### ✅ Technical Features:

- Simultaneous email sending (customer and owner emails sent in parallel)
- Retry logic with exponential backoff (up to 3 retries)
- Graceful error handling (failures don't block booking submission)
- Database logging for all email attempts
- HTML and plain text formats for maximum compatibility
- Spam filter friendly formatting
- Responsive email design

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# Required for email functionality
EMAIL_HOST=smtp.gmail.com          # Your SMTP server
EMAIL_PORT=587                     # SMTP port (587 for TLS, 465 for SSL)
EMAIL_USER=your-email@gmail.com    # SMTP username
EMAIL_PASS=your-app-password        # SMTP password
EMAIL_FROM=Bike Rental <noreply@bikerental.com>  # Optional: Custom "From" address

# Owner/Admin Configuration
OWNER_EMAIL=owner@example.com      # Bike owner notification email
ADMIN_EMAIL=admin@example.com       # Admin email (fallback for owner)

# Support Information (optional, has defaults)
SUPPORT_EMAIL=support@example.com
SUPPORT_PHONE=+1-800-BIKE-RENT
COMPANY_NAME=Bike Rental Company
COMPANY_WEBSITE=https://bikerental.com
```

### Gmail Setup

If using Gmail:

1. Enable 2-factor authentication
2. Generate an "App Password" (not your regular password)
3. Use the app password as `EMAIL_PASS`

### Other Providers

Common SMTP settings:

- **Gmail**: smtp.gmail.com:587
- **Outlook**: smtp-mail.outlook.com:587
- **Yahoo**: smtp.mail.yahoo.com:587
- **SendGrid**: smtp.sendgrid.net:587 (requires API key)
- **Mailgun**: smtp.mailgun.org:587

## Usage

### Automatic Triggering

Emails are **automatically sent** when:

- A booking form is successfully submitted via `POST /api/rentals`
- The booking is saved to the database

### Manual Testing

Test email configuration:

```bash
curl http://localhost:3002/api/test-email
```

### Code Usage

The service is automatically used by the booking endpoint. For manual usage:

```javascript
import { sendBookingEmails, sendCustomerConfirmationEmail } from './emailService.js';

const bookingData = {
  rentalId: 'BR-12345',
  customer: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
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

// Send both emails simultaneously
const results = await sendBookingEmails(bookingData, 'owner@example.com', db);

// Or send individually
await sendCustomerConfirmationEmail(bookingData, db);
await sendOwnerNotificationEmail(bookingData, 'owner@example.com', db);
```

## Email Logging

All email attempts are logged to the `email_logs` table:

```sql
SELECT * FROM email_logs
WHERE rental_id = 'BR-12345'
ORDER BY created_at DESC;
```

Log entries include:

- Recipient email and type (customer/owner)
- Email subject
- Status (sent/failed)
- Message ID (if successful)
- Error message (if failed)
- Timestamp

## Retry Logic

The service implements exponential backoff retry:

- **Max Retries**: 3 attempts
- **Base Delay**: 1 second
- **Backoff**: 2x per retry (1s, 2s, 4s)

Retries occur automatically for:

- Network timeouts
- SMTP server errors
- Transient failures

## Error Handling

Failures are handled gracefully:

- Email failures don't block booking submission
- Errors are logged to database
- Console warnings for debugging
- Customer receives booking confirmation even if email fails

## Testing

### Unit Tests

```bash
npm test -- emailService.test.js
```

### Integration Tests

```bash
node src/backend/__tests__/emailService.integration.test.js
```

### Test Email Endpoint

```bash
curl http://localhost:3002/api/test-email
```

## Template Customization

Templates are in `src/backend/emailService.js`:

- `customerConfirmationEmailHtml()` - Customer email template
- `ownerNotificationEmailHtml()` - Owner email template

Customize:

- Colors and branding
- Company information
- Cancellation policy terms
- Support contact details

## Troubleshooting

### Emails Not Sending

1. **Check environment variables**: Ensure all required EMAIL\_\* vars are set
2. **Verify SMTP settings**: Test with `/api/test-email` endpoint
3. **Check email logs**: Query `email_logs` table for error messages
4. **Check spam folder**: Emails might be filtered

### Common Errors

**"Email transporter not configured"**

- Missing EMAIL_HOST, EMAIL_USER, or EMAIL_PASS

**"SMTP connection timeout"**

- Check EMAIL_HOST and EMAIL_PORT
- Verify firewall/network settings

**"Authentication failed"**

- Check EMAIL_USER and EMAIL_PASS
- For Gmail, use App Password not regular password

**"Recipient rejected"**

- Invalid email address
- Email server blocking sender

## Performance

- **Simultaneous Sending**: Customer and owner emails sent in parallel
- **Non-blocking**: Email sending doesn't delay API response
- **Efficient**: Supports high-volume booking scenarios
- **Scalable**: Database logging doesn't impact performance

## Security

- Passwords stored in environment variables (never in code)
- SMTP authentication required
- No sensitive data in email logs (error messages only)
- Proper email validation

## Support

For issues or questions:

1. Check email logs: `SELECT * FROM email_logs ORDER BY created_at DESC LIMIT 10;`
2. Test email config: `GET /api/test-email`
3. Check server logs for detailed error messages
4. Verify environment variables are set correctly

## Future Enhancements

Potential improvements:

- Email queue for high-volume scenarios
- Template customization via admin panel
- Multi-language support
- Email analytics and open tracking
- Scheduled reminder emails
- SMS notifications integration
