// Session store using file storage (similar to queries)
// In production, use Redis or a database

import fs from 'fs';
import path from 'path';

interface SessionData {
  userId: string;
  expiresAt: number;
}

const SESSIONS_FILE = path.join(process.cwd(), 'data', 'sessions.json');

class SessionStore {
  private sessions: Map<string, SessionData> = new Map();

  constructor() {
    this.loadSessions();
  }

  private ensureDataDirectory() {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  private loadSessions() {
    try {
      this.ensureDataDirectory();
      if (fs.existsSync(SESSIONS_FILE)) {
        const data = fs.readFileSync(SESSIONS_FILE, 'utf-8');
        const sessionsObj = JSON.parse(data);
        this.sessions = new Map(Object.entries(sessionsObj));
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
      this.sessions = new Map();
    }
  }

  private saveSessions() {
    try {
      this.ensureDataDirectory();
      const sessionsObj = Object.fromEntries(this.sessions);
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessionsObj, null, 2));
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  }

  set(sessionId: string, data: SessionData) {
    this.sessions.set(sessionId, data);
    this.saveSessions();
  }

  get(sessionId: string): SessionData | undefined {
    console.log('SessionStore.get called with:', sessionId);
    console.log('Available sessions:', Array.from(this.sessions.keys()));
    const session = this.sessions.get(sessionId);
    console.log('Found session:', session);
    return session;
  }

  delete(sessionId: string) {
    this.sessions.delete(sessionId);
    this.saveSessions();
  }

  cleanup() {
    const now = Date.now();
    let hasChanges = false;
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        this.sessions.delete(sessionId);
        hasChanges = true;
      }
    }
    if (hasChanges) {
      this.saveSessions();
    }
  }
}

// Global instance
export const sessionStore = new SessionStore();

// Cleanup expired sessions every 5 minutes
if (typeof globalThis !== 'undefined') {
  setInterval(() => sessionStore.cleanup(), 5 * 60 * 1000);
}
