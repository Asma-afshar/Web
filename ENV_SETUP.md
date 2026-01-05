# Environment Variables Setup

To enable email and SMS functionality, you need to configure the following environment variables.

## Email Service Setup

Choose ONE of the following email services:

### Option 1: Resend (Recommended)

1. Sign up at [https://resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
   FROM_EMAIL=noreply@yourdomain.com
   ```

### Option 2: SendGrid

1. Sign up at [https://sendgrid.com](https://sendgrid.com)
2. Create an API key in Settings > API Keys
3. Add to `.env.local`:
   ```
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
   FROM_EMAIL=noreply@yourdomain.com
   ```

### Option 3: SMTP (Gmail, Outlook, etc.)

1. Get your SMTP credentials
2. Add to `.env.local`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FROM_EMAIL=your-email@gmail.com
   ```

**Note:** For Gmail, you'll need to use an App Password, not your regular password.

## SMS Service Setup (Optional)

### Twilio

1. Sign up at [https://www.twilio.com](https://www.twilio.com)
2. Get your Account SID, Auth Token, and Phone Number
3. Add to `.env.local`:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

## Admin Email

Set the email address where contact form notifications should be sent:

```
ADMIN_EMAIL=admin@realestate.com
```

## Admin Password

Set a password for accessing the admin dashboard:

```
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
```

## Complete .env.local Example

Create a `.env.local` file in the root directory:

```env
# Email Service (choose one)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com

# OR use SendGrid
# SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
# FROM_EMAIL=noreply@yourdomain.com

# OR use SMTP
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
# FROM_EMAIL=your-email@gmail.com

# SMS Service (optional)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Admin Email
ADMIN_EMAIL=admin@realestate.com

# Admin Authentication
ADMIN_USER=admin
ADMIN_PASSWORD=admin123

# Environment
NODE_ENV=development
```

## Development Mode

If no email/SMS service is configured, the app will:
- Log email/SMS details to the console (development only)
- Still return success responses for testing
- Not actually send emails/SMS

## Testing

1. Fill out the contact form
2. Check your email for the confirmation message
3. Check the admin email for the notification
4. If phone number is provided, check for SMS confirmation







