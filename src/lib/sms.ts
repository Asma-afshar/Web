// SMS service utility
// Supports Twilio or other SMS providers

interface SMSOptions {
  to: string;
  message: string;
}

export async function sendSMS(options: SMSOptions): Promise<boolean> {
  try {
    // Option 1: Using Twilio (recommended)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      return await sendSMSViaTwilio(options);
    }

    // Fallback: Log SMS in development (no actual sending)
    if (process.env.NODE_ENV === 'development') {
      console.log('📱 SMS would be sent:', {
        to: options.to,
        message: options.message,
      });
      return true;
    }

    console.warn('No SMS service configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.');
    return false;
  } catch (error) {
    console.error('SMS sending error:', error);
    return false;
  }
}

// Twilio SMS service
async function sendSMSViaTwilio(options: SMSOptions): Promise<boolean> {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Twilio credentials not fully configured');
    }

    // Format phone number (remove any non-digit characters except +)
    const toNumber = options.to.replace(/[^\d+]/g, '');
    
    // Ensure phone number starts with country code
    const formattedTo = toNumber.startsWith('+') ? toNumber : `+1${toNumber}`;

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        },
        body: new URLSearchParams({
          From: fromNumber,
          To: formattedTo,
          Body: options.message,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send SMS via Twilio');
    }

    return true;
  } catch (error) {
    console.error('Twilio error:', error);
    return false;
  }
}








