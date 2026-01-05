# Admin Dashboard - Customer Queries

## Overview

The admin dashboard allows property owners to view, manage, and respond to all customer queries in one centralized location.

## Access

Navigate to `/admin/queries` or click the "Admin" link in the header navigation.

## Features

### 1. Query List View
- **Sidebar Navigation**: View all queries in a scrollable list
- **Unread Indicator**: Blue dot shows unread queries
- **Quick Preview**: See customer name, subject, date, and related property
- **Click to View**: Click any query to see full details

### 2. Filtering Options
- **All Queries**: View all customer inquiries
- **Unread**: See only new/unread queries
- **Read**: View queries you've already seen
- **Replied**: Filter queries you've responded to

### 3. Search Functionality
- Search by customer name, email, subject, message, or property title
- Real-time filtering as you type

### 4. Query Management
- **Mark as Read**: Mark queries as read when viewed
- **Mark as Replied**: Track which queries you've responded to
- **Reply via Email**: One-click email reply (opens email client)
- **Call Customer**: Direct phone call link (if phone provided)
- **Delete**: Remove queries you no longer need

### 5. Query Details
- Full customer information (name, email, phone)
- Complete message content
- Related property information (if applicable)
- Timestamp of when query was received
- Status indicators (Read/Unread, Replied)

## Data Storage

Queries are stored in `data/queries.json` file. In production, you should:
- Replace with a database (PostgreSQL, MongoDB, etc.)
- Add authentication/authorization
- Implement pagination for large datasets
- Add export functionality

## Security Note

Currently, the admin dashboard is accessible to anyone. In production:
1. Add authentication (login required)
2. Implement role-based access control
3. Add rate limiting
4. Secure API endpoints

## Future Enhancements

- Email notifications for new queries
- Bulk actions (mark multiple as read/replied)
- Export queries to CSV/Excel
- Query statistics and analytics
- Email templates for quick responses
- Integration with CRM systems








