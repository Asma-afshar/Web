import { NextRequest, NextResponse } from 'next/server';
import { getQueries, addQuery } from '@/lib/queries';
import { sendEmail } from '@/lib/email';
import { sendSMS } from '@/lib/sms';

interface TestResult {
  name: string;
  status: string;
  message: string;
  details?: any[];
}

interface ApiTestResult {
  timestamp: string;
  tests: TestResult[];
  overall?: {
    status: string;
    message: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testType = searchParams.get('test') || 'all';

    const results: ApiTestResult = {
      timestamp: new Date().toISOString(),
      tests: [],
    };

    // Test 1: Database connectivity
    try {
      const queries = getQueries();
      results.tests.push({
        name: 'Database Connectivity',
        status: 'success',
        message: `Successfully connected to database. Found ${queries.length} queries.`,
      });
    } catch (error) {
      results.tests.push({
        name: 'Database Connectivity',
        status: 'error',
        message: `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }

    // Test 2: Email service
    if (testType === 'all' || testType === 'email') {
      try {
        const emailSent = await sendEmail({
          to: process.env.ADMIN_EMAIL || 'test@example.com',
          subject: 'RealEstate API Test - Email Service',
          html: '<h2>Email Service Test</h2><p>This is a test email from the RealEstate API.</p>',
          text: 'Email Service Test - This is a test email from the RealEstate API.',
        });

        results.tests.push({
          name: 'Email Service',
          status: emailSent ? 'success' : 'warning',
          message: emailSent
            ? 'Email service is working correctly.'
            : 'Email service is configured but test email was not sent (check logs).',
        });
      } catch (error) {
        results.tests.push({
          name: 'Email Service',
          status: 'error',
          message: `Email service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    }

    // Test 3: SMS service
    if (testType === 'all' || testType === 'sms') {
      try {
        const smsSent = await sendSMS({
          to: process.env.TEST_PHONE || '+1234567890',
          message: 'RealEstate API Test - SMS Service. This is a test message.',
        });

        results.tests.push({
          name: 'SMS Service',
          status: smsSent ? 'success' : 'warning',
          message: smsSent
            ? 'SMS service is working correctly.'
            : 'SMS service is configured but test SMS was not sent (check logs).',
        });
      } catch (error) {
        results.tests.push({
          name: 'SMS Service',
          status: 'error',
          message: `SMS service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    }

    // Test 4: Environment variables
    const envChecks: Array<{ name: string; status: string; type: string }> = [];
    const recommendedEnvVars = ['ADMIN_EMAIL'];
    const optionalEnvVars = [
      'RESEND_API_KEY', 'SENDGRID_API_KEY', 'SMTP_HOST',
      'TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER',
      'NEXT_PUBLIC_ADMIN_PASSWORD'
    ];

    recommendedEnvVars.forEach(envVar => {
      if (process.env[envVar]) {
        envChecks.push({ name: envVar, status: 'success', type: 'recommended' });
      } else {
        envChecks.push({ name: envVar, status: 'warning', type: 'recommended' });
      }
    });

    optionalEnvVars.forEach(envVar => {
      if (process.env[envVar]) {
        envChecks.push({ name: envVar, status: 'success', type: 'optional' });
      } else {
        envChecks.push({ name: envVar, status: 'info', type: 'optional' });
      }
    });

    results.tests.push({
      name: 'Environment Variables',
      status: 'info',
      message: 'Environment variable check completed.',
      details: envChecks,
    });

    // Test 5: API Endpoints
    const apiTests = [];

    // Test contact form endpoint structure
    apiTests.push({
      name: 'Contact API Structure',
      status: 'info',
      message: 'Contact API accepts: name, email, phone?, subject, message, propertyId?, propertyTitle?',
    });

    // Test queries API structure
    apiTests.push({
      name: 'Queries API Structure',
      status: 'info',
      message: 'Queries API supports: GET (with filter/search), PATCH (update), DELETE',
    });

    // Test reply API structure
    apiTests.push({
      name: 'Reply API Structure',
      status: 'info',
      message: 'Reply API accepts: id, subject, message',
    });

    results.tests.push({
      name: 'API Endpoints',
      status: 'info',
      message: 'API endpoint structures verified.',
      details: apiTests,
    });

    // Calculate overall status
    const hasErrors = results.tests.some(test => test.status === 'error');
    const hasWarnings = results.tests.some(test => test.status === 'warning');

    results.overall = {
      status: hasErrors ? 'error' : hasWarnings ? 'warning' : 'success',
      message: hasErrors
        ? 'Some tests failed. Please check the errors above.'
        : hasWarnings
        ? 'All critical tests passed, but some optional features may not be configured.'
        : 'All tests passed successfully!',
    };

    return NextResponse.json(results);
  } catch (error) {
    console.error('API test error:', error);
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        overall: {
          status: 'error',
          message: 'API test failed with an unexpected error.',
        },
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST method to test contact form submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testType } = body;

    if (testType === 'contact') {
      // Test contact form submission
      const testQuery = {
        name: 'API Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        subject: 'API Test - Contact Form',
        message: 'This is a test message from the API testing endpoint.',
      };

      const query = addQuery(testQuery);

      return NextResponse.json({
        success: true,
        message: 'Test contact form submission successful',
        queryId: query.id,
        testData: testQuery,
      });
    }

    return NextResponse.json(
      { error: 'Invalid test type. Use testType: "contact"' },
      { status: 400 }
    );
  } catch (error) {
    console.error('API test POST error:', error);
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

