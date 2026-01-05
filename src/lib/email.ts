// Email service utility
// Supports multiple email providers: Resend, SendGrid, Nodemailer, or SMTP

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Option 1: Using Resend (recommended for production)
    if (process.env.RESEND_API_KEY) {
      return await sendEmailViaResend(options);
    }

    // Option 2: Using SendGrid
    if (process.env.SENDGRID_API_KEY) {
      return await sendEmailViaSendGrid(options);
    }

    // Option 3: Using Nodemailer/SMTP
    if (process.env.SMTP_HOST) {
      return await sendEmailViaSMTP(options);
    }

    // Fallback: Log email in development (no actual sending)
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email would be sent:', {
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      return true;
    }

    console.warn('No email service configured. Set RESEND_API_KEY, SENDGRID_API_KEY, or SMTP credentials.');
    return false;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

// Resend email service
async function sendEmailViaResend(options: EmailOptions): Promise<boolean> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>/g, ''),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send email via Resend');
    }

    return true;
  } catch (error) {
    console.error('Resend error:', error);
    return false;
  }
}

// SendGrid email service
async function sendEmailViaSendGrid(options: EmailOptions): Promise<boolean> {
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: options.to }],
            subject: options.subject,
          },
        ],
        from: { email: process.env.FROM_EMAIL || 'noreply@realestate.com' },
        content: [
          {
            type: 'text/html',
            value: options.html,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to send email via SendGrid');
    }

    return true;
  } catch (error) {
    console.error('SendGrid error:', error);
    return false;
  }
}

// SMTP email service (using Nodemailer would require installing the package)
async function sendEmailViaSMTP(options: EmailOptions): Promise<boolean> {
  // This is a placeholder. In production, you would use nodemailer:
  // const nodemailer = require('nodemailer');
  // const transporter = nodemailer.createTransport({...});
  // await transporter.sendMail({...});
  
  console.log('SMTP email service not fully implemented. Please install nodemailer for SMTP support.');
  return false;
}








