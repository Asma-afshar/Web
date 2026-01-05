// Simple authentication utilities for admin access
// In production, replace with proper JWT authentication

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin';
}

const ADMIN_USERS: AdminUser[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@realestate.com',
    role: 'admin',
  }
];

export function authenticateAdmin(username: string, password: string): { success: boolean; user?: AdminUser; token?: string } {
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (username === adminUser && password === adminPassword) {
    const user = ADMIN_USERS[0];
    // Create a simple token (in production, use proper JWT)
    const token = `admin_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { success: true, user, token };
  }

  return { success: false };
}

export function validateToken(token: string): { valid: boolean; user?: AdminUser } {
  // Simple token validation (in production, decode and verify JWT)
  if (token && token.startsWith('admin_token_')) {
    return { valid: true, user: ADMIN_USERS[0] };
  }
  return { valid: false };
}

