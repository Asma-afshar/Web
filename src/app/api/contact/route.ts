import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { sendSMS } from '@/lib/sms';
import { addQuery } from '@/lib/queries';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, propertyId, propertyTitle } = body;
    
    // Extract property info from payload or from message/subject (be robust to CRLF)
    let extractedPropertyTitle: string | undefined = propertyTitle || undefined;
    let extractedPropertyId: string | undefined = propertyId || undefined;

    // Check if message contains property information (handles \r\n or \n)
    const propertyMatch = message.match(/Property:\s*(.+?)\r?\n/i);
    if (propertyMatch && propertyMatch[1]) {
      extractedPropertyTitle = propertyMatch[1].trim();
    }

    // Try to extract property title from subject like "Inquiry about {title}"
    const subjMatch = subject.match(/Inquiry about\s*(.+)/i);
    if (!extractedPropertyTitle && subjMatch && subjMatch[1]) {
      extractedPropertyTitle = subjMatch[1].trim();
    }

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Store query in database
    const query = addQuery({
      name,
      email,
      phone: phone || undefined,
      subject,
      message,
      propertyId: extractedPropertyId || undefined,
      propertyTitle: extractedPropertyTitle || undefined,
    });

    // Send confirmation email to customer
    const customerEmailSent = await sendEmail({
      to: email,
      subject: 'Thank you for contacting RealEstate',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank you for contacting us, ${name}!</h2>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Your Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p>Our team typically responds within 24 hours. If you have any urgent questions, please call us at (555) 123-4567.</p>
          <p>Best regards,<br>The RealEstate Team</p>
        </div>
      `,
      text: `Thank you for contacting us, ${name}! We have received your message and will get back to you as soon as possible. Subject: ${subject}. Your message: ${message}`,
    });

    // Send notification email to admin
    const adminEmailSent = await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@realestate.com',
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p><a href="mailto:${email}">Reply to ${email}</a></p>
        </div>
      `,
      text: `New contact form submission from ${name} (${email}). Subject: ${subject}. Message: ${message}`,
    });

    // Send SMS notification if phone number is provided
    let smsSent = false;
    if (phone) {
      smsSent = await sendSMS({
        to: phone,
        message: `Hi ${name}, thank you for contacting RealEstate! We've received your message about "${subject}" and will respond within 24 hours. For urgent matters, call (555) 123-4567.`,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully!',
      notifications: {
        email: customerEmailSent,
        adminEmail: adminEmailSent,
        sms: smsSent,
      },
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}

