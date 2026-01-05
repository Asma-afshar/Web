import { NextRequest, NextResponse } from 'next/server';
import { getQueryById, updateQuery } from '@/lib/queries';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, subject, message } = body;

    if (!id || !message) {
      return NextResponse.json({ error: 'Missing id or message' }, { status: 400 });
    }

    const query = getQueryById(id);
    if (!query) {
      return NextResponse.json({ error: 'Query not found' }, { status: 404 });
    }

    const to = query.email;

    // Create a proper HTML email template
    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #1e40af; margin-bottom: 20px;">Response from RealEstate</h2>
          <div style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            ${message}
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            This is a response to your inquiry about: <strong>"${query.subject}"</strong>
          </p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">
            Best regards,<br>
            The RealEstate Team
          </p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
          <p>© 2024 RealEstate. All rights reserved.</p>
        </div>
      </div>
    `;

    const sent = await sendEmail({
      to,
      subject: subject || `Re: ${query.subject}`,
      html: htmlMessage,
      text: message.replace(/<[^>]*>/g, '').replace(/<br\s*\/?>/gi, '\n'),
    });

    if (!sent) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    updateQuery(id, { replied: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending reply email:', error);
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
  }
}
