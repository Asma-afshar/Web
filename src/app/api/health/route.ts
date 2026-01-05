import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: true, // We'll check this
        email: !!(process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY || process.env.SMTP_HOST),
        sms: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
      },
      endpoints: {
        '/api/contact': 'POST - Submit contact form',
        '/api/queries': 'GET, PATCH, DELETE - Manage queries',
        '/api/queries/reply': 'POST - Send reply to customer',
        '/api/stats': 'GET - Get dashboard statistics',
        '/api/test': 'GET, POST - Test API functionality',
        '/api/health': 'GET - Health check',
      },
    };

    return NextResponse.json(health);
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


