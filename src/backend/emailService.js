import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Email Service Module
 * Handles all email sending operations with retry logic, logging, and comprehensive templates
 */

// Email configuration
const emailEnabled = !!(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS);
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000; // 1 second base delay
const SUPPORT_EMAIL =
  process.env.SUPPORT_EMAIL || process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'support@bikerental.com';
const SUPPORT_PHONE = process.env.SUPPORT_PHONE || '+1-800-BIKE-RENT';
const COMPANY_NAME = process.env.COMPANY_NAME || 'Bike Rental';
const COMPANY_WEBSITE = process.env.COMPANY_WEBSITE || 'https://bikerental.com';

let transporter = null;

if (emailEnabled) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: false, // We'll handle logging ourselves
    debug: false,
  });
}

/**
 * Retry helper with exponential backoff
 */
async function retryWithBackoff(fn, maxRetries = MAX_RETRIES, retryCount = 0) {
  try {
    return await fn();
  } catch (error) {
    if (retryCount >= maxRetries) {
      throw error;
    }
    const delay = RETRY_DELAY_BASE * Math.pow(2, retryCount);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryWithBackoff(fn, maxRetries, retryCount + 1);
  }
}

/**
 * Email logging interface (to be implemented with database)
 */
const emailLogger = {
  log: async (emailData, status, error = null) => {
    // This will be implemented to log to database
    const logEntry = {
      timestamp: new Date().toISOString(),
      to: emailData.to,
      subject: emailData.subject,
      status,
      error: error?.message || null,
      retryCount: emailData.retryCount || 0,
    };
    console.log(`📧 Email ${status}:`, logEntry);
    return logEntry;
  },
};

/**
 * Send email with retry logic and logging
 * @export
 */
export async function sendEmail(mailOptions, retryCount = 0) {
  if (!transporter) {
    throw new Error(
      'Email transporter not configured. Please set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS environment variables.'
    );
  }

  const enhancedMailOptions = {
    ...mailOptions,
    retryCount,
    from: mailOptions.from || process.env.EMAIL_FROM || process.env.EMAIL_USER,
  };

  try {
    await emailLogger.log(enhancedMailOptions, 'attempting', null);

    const result = await retryWithBackoff(
      async () => {
        const info = await transporter.sendMail(enhancedMailOptions);
        return info;
      },
      MAX_RETRIES,
      retryCount
    );

    await emailLogger.log(enhancedMailOptions, 'sent', null);
    return { success: true, messageId: result.messageId, info: result };
  } catch (error) {
    await emailLogger.log(enhancedMailOptions, 'failed', error);
    throw error;
  }
}

/**
 * Generate plain text version from HTML (basic conversion)
 * @export
 */
export function htmlToText(html) {
  return html
    .replace(/<style[^>]*>.*?<\/style>/gis, '')
    .replace(/<script[^>]*>.*?<\/script>/gis, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
}

/**
 * Customer confirmation email template (HTML)
 * @export
 */
export function customerConfirmationEmailHtml(bookingData) {
  const { rentalId, customer, bike, rental, totalPrice, totalDays } = bookingData;
  const customerName = `${customer.firstName} ${customer.lastName}`;
  const formattedStartDate = new Date(rental.startDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedEndDate = new Date(rental.endDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation - ${rentalId}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2d5a3d 0%, #4a9d6a 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">${COMPANY_NAME}</h1>
              <p style="margin: 10px 0 0; color: #e6efe6; font-size: 16px;">Your Booking Confirmation</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Greeting -->
              <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">Hi ${
                customer.firstName
              },</h2>
              <p style="margin: 0 0 20px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Thank you for your booking! Your reservation has been confirmed and we're excited to help you explore on two wheels.
              </p>

              <!-- Booking Reference -->
              <div style="background-color: #f8f9fa; border-left: 4px solid #4a9d6a; padding: 20px; margin: 25px 0; border-radius: 4px;">
                <p style="margin: 0 0 10px; color: #1a1a1a; font-size: 14px; font-weight: 600;">BOOKING REFERENCE NUMBER</p>
                <p style="margin: 0; color: #2d5a3d; font-size: 24px; font-weight: 700; font-family: monospace; letter-spacing: 1px;">${rentalId}</p>
                <p style="margin: 10px 0 0; color: #6b7280; font-size: 12px;">Please keep this reference number for your records</p>
              </div>

              <!-- Booking Details -->
              <div style="margin: 30px 0;">
                <h3 style="margin: 0 0 15px; color: #1a1a1a; font-size: 20px; font-weight: 600;">Booking Details</h3>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                      <strong style="color: #4b5563;">Bike Model:</strong>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #1a1a1a;">
                      ${bike.title}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                      <strong style="color: #4b5563;">Pickup Date:</strong>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #1a1a1a;">
                      ${formattedStartDate}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                      <strong style="color: #4b5563;">Return Date:</strong>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #1a1a1a;">
                      ${formattedEndDate}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                      <strong style="color: #4b5563;">Duration:</strong>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #1a1a1a;">
                      ${totalDays} ${totalDays === 1 ? 'day' : 'days'}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                      <strong style="color: #4b5563;">Daily Rate:</strong>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #1a1a1a;">
                      $${parseFloat(bike.price).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0;">
                      <strong style="color: #1a1a1a; font-size: 18px;">Total Amount:</strong>
                    </td>
                    <td style="padding: 12px 0; text-align: right;">
                      <strong style="color: #2d5a3d; font-size: 18px;">$${totalPrice.toFixed(2)}</strong>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Next Steps -->
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <h3 style="margin: 0 0 10px; color: #1e40af; font-size: 18px; font-weight: 600;">What's Next?</h3>
                <ul style="margin: 0; padding-left: 20px; color: #1e3a8a; font-size: 14px; line-height: 1.8;">
                  <li>You'll receive a confirmation call from our team within 24 hours</li>
                  <li>Please have your valid driving license and ID documents ready for verification</li>
                  <li>We'll send you the rental agreement via email for your review</li>
                  <li>Final payment and deposit will be collected during pickup</li>
                </ul>
              </div>

              <!-- Cancellation Policy -->
              <div style="margin: 30px 0;">
                <h3 style="margin: 0 0 15px; color: #1a1a1a; font-size: 20px; font-weight: 600;">Cancellation Policy</h3>
                <div style="background-color: #fff7ed; border: 1px solid #fed7aa; padding: 20px; border-radius: 4px;">
                  <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 14px; line-height: 1.8;">
                    <li><strong>More than 48 hours before pickup:</strong> Full refund (100%)</li>
                    <li><strong>24-48 hours before pickup:</strong> 50% refund</li>
                    <li><strong>Less than 24 hours before pickup:</strong> No refund</li>
                    <li><strong>No-show:</strong> No refund</li>
                  </ul>
                  <p style="margin: 15px 0 0; color: #92400e; font-size: 13px; line-height: 1.6;">
                    All cancellations must be made via email or phone call to our support team. Refunds will be processed within 5-7 business days to your original payment method.
                  </p>
                </div>
              </div>

              <!-- Support Information -->
              <div style="background-color: #f9fafb; padding: 20px; margin: 30px 0; border-radius: 4px; border: 1px solid #e5e7eb;">
                <h3 style="margin: 0 0 15px; color: #1a1a1a; font-size: 18px; font-weight: 600;">Need Help?</h3>
                <p style="margin: 0 0 10px; color: #4b5563; font-size: 14px;">
                  <strong>Email:</strong> <a href="mailto:${SUPPORT_EMAIL}" style="color: #4a9d6a; text-decoration: none;">${SUPPORT_EMAIL}</a>
                </p>
                <p style="margin: 0 0 10px; color: #4b5563; font-size: 14px;">
                  <strong>Phone:</strong> <a href="tel:${SUPPORT_PHONE.replace(
                    /\s/g,
                    ''
                  )}" style="color: #4a9d6a; text-decoration: none;">${SUPPORT_PHONE}</a>
                </p>
                <p style="margin: 10px 0 0; color: #4b5563; font-size: 14px;">
                  <strong>Website:</strong> <a href="${COMPANY_WEBSITE}" style="color: #4a9d6a; text-decoration: none;">${COMPANY_WEBSITE}</a>
                </p>
                <p style="margin: 15px 0 0; color: #6b7280; font-size: 13px; line-height: 1.6;">
                  Our support team is available Monday through Friday, 9 AM to 6 PM. For urgent matters outside business hours, please leave a voicemail and we'll get back to you as soon as possible.
                </p>
              </div>

              <!-- Footer -->
              <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Thank you for choosing ${COMPANY_NAME}! We're looking forward to serving you.
              </p>
              <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Best regards,<br>
                <strong>The ${COMPANY_NAME} Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer Bar -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 20px 30px; text-align: center;">
              <p style="margin: 0 0 10px; color: #9ca3af; font-size: 12px;">
                This is an automated confirmation email. Please do not reply directly to this message.
              </p>
              <p style="margin: 0; color: #6b7280; font-size: 11px;">
                © ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Owner notification email template (HTML)
 * @export
 */
export function ownerNotificationEmailHtml(bookingData) {
  const { rentalId, customer, bike, rental, totalPrice, totalDays } = bookingData;
  const customerName = `${customer.firstName} ${customer.lastName}`;
  const formattedStartDate = new Date(rental.startDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedEndDate = new Date(rental.endDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking Request - ${rentalId}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">New Booking Request</h1>
              <p style="margin: 10px 0 0; color: #dbeafe; font-size: 16px;">Action Required - Review & Confirm</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <p style="margin: 0 0 20px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                A new bike rental booking has been submitted and requires your review.
              </p>

              <!-- Booking Reference -->
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 4px;">
                <p style="margin: 0 0 10px; color: #1e40af; font-size: 14px; font-weight: 600;">BOOKING REFERENCE NUMBER</p>
                <p style="margin: 0; color: #1e40af; font-size: 24px; font-weight: 700; font-family: monospace; letter-spacing: 1px;">${rentalId}</p>
                <p style="margin: 10px 0 0; color: #3b82f6; font-size: 12px;">Status: <strong>Pending Confirmation</strong></p>
              </div>

              <!-- Booking Timeline -->
              <div style="margin: 30px 0;">
                <h3 style="margin: 0 0 15px; color: #1a1a1a; font-size: 20px; font-weight: 600;">Booking Timeline</h3>
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 4px; border: 1px solid #e5e7eb;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
                    <tr>
                      <td style="padding: 10px 0; color: #4b5563;">
                        <strong>Start Date:</strong>
                      </td>
                      <td style="padding: 10px 0; text-align: right; color: #1a1a1a;">
                        ${formattedStartDate}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; color: #4b5563;">
                        <strong>End Date:</strong>
                      </td>
                      <td style="padding: 10px 0; text-align: right; color: #1a1a1a;">
                        ${formattedEndDate}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; color: #4b5563;">
                        <strong>Duration:</strong>
                      </td>
                      <td style="padding: 10px 0; text-align: right; color: #1a1a1a;">
                        ${totalDays} ${totalDays === 1 ? 'day' : 'days'}
                      </td>
                    </tr>
                  </table>
                </div>
              </div>

              <!-- Customer Information -->
              <div style="margin: 30px 0;">
                <h3 style="margin: 0 0 15px; color: #1a1a1a; font-size: 20px; font-weight: 600;">Customer Information</h3>
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 4px; border: 1px solid #e5e7eb;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
                    <tr>
                      <td style="padding: 10px 0; color: #4b5563;">
                        <strong>Name:</strong>
                      </td>
                      <td style="padding: 10px 0; text-align: right; color: #1a1a1a;">
                        ${customerName}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; color: #4b5563;">
                        <strong>Email:</strong>
                      </td>
                      <td style="padding: 10px 0; text-align: right;">
                        <a href="mailto:${customer.email}" style="color: #3b82f6; text-decoration: none;">${
    customer.email
  }</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; color: #4b5563;">
                        <strong>Phone:</strong>
                      </td>
                      <td style="padding: 10px 0; text-align: right;">
                        <a href="tel:${customer.phone.replace(
                          /\D/g,
                          ''
                        )}" style="color: #3b82f6; text-decoration: none;">${customer.phone}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; color: #4b5563;">
                        <strong>Age:</strong>
                      </td>
                      <td style="padding: 10px 0; text-align: right; color: #1a1a1a;">
                        ${customer.age || 'Not provided'}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; color: #4b5563;">
                        <strong>Address:</strong>
                      </td>
                      <td style="padding: 10px 0; text-align: right; color: #1a1a1a;">
                        ${customer.address || 'Not provided'}
                      </td>
                    </tr>
                  </table>
                </div>
              </div>

              <!-- Bike Details -->
              <div style="margin: 30px 0;">
                <h3 style="margin: 0 0 15px; color: #1a1a1a; font-size: 20px; font-weight: 600;">Bike Details</h3>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                      <strong style="color: #4b5563;">Model:</strong>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #1a1a1a;">
                      ${bike.title}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                      <strong style="color: #4b5563;">Daily Rate:</strong>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #1a1a1a;">
                      $${parseFloat(bike.price).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0;">
                      <strong style="color: #1a1a1a; font-size: 18px;">Total Amount:</strong>
                    </td>
                    <td style="padding: 12px 0; text-align: right;">
                      <strong style="color: #1e40af; font-size: 18px;">$${totalPrice.toFixed(2)}</strong>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Additional Information -->
              ${
                rental.purpose || rental.experience || rental.specialRequests
                  ? `
              <div style="margin: 30px 0;">
                <h3 style="margin: 0 0 15px; color: #1a1a1a; font-size: 20px; font-weight: 600;">Additional Information</h3>
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 4px; border: 1px solid #e5e7eb;">
                  ${
                    rental.purpose
                      ? `<p style="margin: 0 0 10px; color: #4b5563; font-size: 14px;"><strong>Rental Purpose:</strong> ${rental.purpose}</p>`
                      : ''
                  }
                  ${
                    rental.experience
                      ? `<p style="margin: 0 0 10px; color: #4b5563; font-size: 14px;"><strong>Cycling Experience:</strong> ${rental.experience}</p>`
                      : ''
                  }
                  ${
                    rental.specialRequests
                      ? `<p style="margin: 10px 0 0; color: #4b5563; font-size: 14px;"><strong>Special Requests:</strong> ${rental.specialRequests}</p>`
                      : ''
                  }
                </div>
              </div>
              `
                  : ''
              }

              <!-- Action Required -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <h3 style="margin: 0 0 15px; color: #92400e; font-size: 18px; font-weight: 600;">Action Required</h3>
                <p style="margin: 0 0 15px; color: #92400e; font-size: 14px; line-height: 1.6;">
                  Please review this booking request and take the following actions:
                </p>
                <ol style="margin: 0; padding-left: 20px; color: #92400e; font-size: 14px; line-height: 1.8;">
                  <li><strong>Verify bike availability</strong> for the requested dates</li>
                  <li><strong>Review customer documents</strong> (license, ID) when they arrive</li>
                  <li><strong>Confirm or deny the booking</strong> within 24 hours</li>
                  <li><strong>Send rental agreement</strong> if confirming</li>
                  <li><strong>Coordinate pickup time and location</strong> with the customer</li>
                  <li><strong>Collect security deposit</strong> (typically 20% of total rental cost)</li>
                  <li><strong>Verify bike condition</strong> before rental begins</li>
                </ol>
              </div>

              <!-- Quick Actions -->
              <div style="margin: 30px 0; text-align: center;">
                <p style="margin: 0 0 15px; color: #4b5563; font-size: 14px;">
                  <strong>To manage this booking, please log into your admin dashboard or contact support:</strong>
                </p>
                <p style="margin: 0; color: #4b5563; font-size: 14px;">
                  <strong>Support:</strong> <a href="mailto:${SUPPORT_EMAIL}" style="color: #3b82f6; text-decoration: none;">${SUPPORT_EMAIL}</a> | 
                  <a href="tel:${SUPPORT_PHONE.replace(
                    /\s/g,
                    ''
                  )}" style="color: #3b82f6; text-decoration: none;">${SUPPORT_PHONE}</a>
                </p>
              </div>

              <!-- Footer -->
              <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                This notification was automatically generated when the booking form was submitted.
              </p>
              <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Best regards,<br>
                <strong>The ${COMPANY_NAME} System</strong>
              </p>
            </td>
          </tr>

          <!-- Footer Bar -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 20px 30px; text-align: center;">
              <p style="margin: 0 0 10px; color: #9ca3af; font-size: 12px;">
                This is an automated notification email. Please review the booking in your dashboard.
              </p>
              <p style="margin: 0; color: #6b7280; font-size: 11px;">
                © ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Send customer confirmation email
 */
export async function sendCustomerConfirmationEmail(bookingData, db = null) {
  if (!emailEnabled) {
    console.warn('⚠️  Email service disabled. Customer confirmation email not sent.');
    return { success: false, reason: 'email_disabled' };
  }

  const html = customerConfirmationEmailHtml(bookingData);
  const text = htmlToText(html);

  const mailOptions = {
    to: bookingData.customer.email,
    subject: `Booking Confirmation - ${bookingData.rentalId} | ${COMPANY_NAME}`,
    html,
    text,
    replyTo: SUPPORT_EMAIL,
  };

  try {
    const result = await sendEmail(mailOptions);

    // Log to database if db is provided
    if (db) {
      await logEmailToDatabase(db, {
        rental_id: bookingData.rentalId,
        recipient_email: bookingData.customer.email,
        recipient_type: 'customer',
        subject: mailOptions.subject,
        status: 'sent',
        message_id: result.messageId,
      });
    }

    return result;
  } catch (error) {
    console.error('❌ Failed to send customer confirmation email:', error);

    // Log failure to database if db is provided
    if (db) {
      await logEmailToDatabase(db, {
        rental_id: bookingData.rentalId,
        recipient_email: bookingData.customer.email,
        recipient_type: 'customer',
        subject: mailOptions.subject,
        status: 'failed',
        error_message: error.message,
      });
    }

    throw error;
  }
}

/**
 * Send owner notification email
 */
export async function sendOwnerNotificationEmail(bookingData, ownerEmail, db = null) {
  if (!emailEnabled) {
    console.warn('⚠️  Email service disabled. Owner notification email not sent.');
    return { success: false, reason: 'email_disabled' };
  }

  if (!ownerEmail) {
    console.warn('⚠️  Owner email not provided. Owner notification email not sent.');
    return { success: false, reason: 'owner_email_missing' };
  }

  const html = ownerNotificationEmailHtml(bookingData);
  const text = htmlToText(html);

  const mailOptions = {
    to: ownerEmail,
    subject: `New Booking Request - ${bookingData.rentalId} | Action Required`,
    html,
    text,
    replyTo: bookingData.customer.email,
  };

  try {
    const result = await sendEmail(mailOptions);

    // Log to database if db is provided
    if (db) {
      await logEmailToDatabase(db, {
        rental_id: bookingData.rentalId,
        recipient_email: ownerEmail,
        recipient_type: 'owner',
        subject: mailOptions.subject,
        status: 'sent',
        message_id: result.messageId,
      });
    }

    return result;
  } catch (error) {
    console.error('❌ Failed to send owner notification email:', error);

    // Log failure to database if db is provided
    if (db) {
      await logEmailToDatabase(db, {
        rental_id: bookingData.rentalId,
        recipient_email: ownerEmail,
        recipient_type: 'owner',
        subject: mailOptions.subject,
        status: 'failed',
        error_message: error.message,
      });
    }

    throw error;
  }
}

/**
 * Send both emails simultaneously
 */
export async function sendBookingEmails(bookingData, ownerEmail = null, db = null) {
  const results = {
    customer: null,
    owner: null,
    errors: [],
  };

  // Determine owner email
  const finalOwnerEmail = ownerEmail || process.env.ADMIN_EMAIL || process.env.OWNER_EMAIL;

  // Send both emails in parallel
  const promises = [
    sendCustomerConfirmationEmail(bookingData, db).catch((error) => {
      results.errors.push({ type: 'customer', error: error.message });
      return { success: false, error: error.message };
    }),
  ];

  if (finalOwnerEmail) {
    promises.push(
      sendOwnerNotificationEmail(bookingData, finalOwnerEmail, db).catch((error) => {
        results.errors.push({ type: 'owner', error: error.message });
        return { success: false, error: error.message };
      })
    );
  }

  const emailResults = await Promise.allSettled(promises);

  results.customer = emailResults[0].value || emailResults[0].reason;
  if (emailResults[1]) {
    results.owner = emailResults[1].value || emailResults[1].reason;
  }

  return results;
}

/**
 * Log email to database
 */
async function logEmailToDatabase(db, emailLog) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO email_logs (
        rental_id, recipient_email, recipient_type, subject, 
        status, message_id, error_message, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    db.run(
      query,
      [
        emailLog.rental_id,
        emailLog.recipient_email,
        emailLog.recipient_type,
        emailLog.subject,
        emailLog.status,
        emailLog.message_id || null,
        emailLog.error_message || null,
      ],
      function (err) {
        if (err) {
          console.error('❌ Failed to log email to database:', err);
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
}

/**
 * Initialize email transporter
 */
export async function initializeEmailService() {
  if (!emailEnabled) {
    console.warn('⚠️  Email service disabled: missing EMAIL_* environment variables');
    return false;
  }

  try {
    await transporter.verify();
    console.log('✅ Email service initialized and verified');
    return true;
  } catch (error) {
    console.error('❌ Email service verification failed:', error.message);
    return false;
  }
}

// Initialize on module load
if (emailEnabled) {
  initializeEmailService().catch((err) => {
    console.error('Failed to initialize email service:', err);
  });
}
