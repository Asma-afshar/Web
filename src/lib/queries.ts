// Simple file-based storage for queries
// In production, replace this with a database (PostgreSQL, MongoDB, etc.)

import fs from 'fs';
import path from 'path';

export interface Query {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  propertyId?: string;
  propertyTitle?: string;
  createdAt: string;
  read: boolean;
  replied: boolean;
}

// Get queries file path - works in both development and production
function getQueriesFilePath(): string {
  // In development, use project root
  // In production, you might want to use a different location
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, 'queries.json');
}

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read queries from file
export function getQueries(): Query[] {
  try {
    const queriesFile = getQueriesFilePath();
    if (!fs.existsSync(queriesFile)) {
      return [];
    }
    const data = fs.readFileSync(queriesFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading queries:', error);
    return [];
  }
}

// Save queries to file
export function saveQueries(queries: Query[]): void {
  try {
    ensureDataDirectory();
    const queriesFile = getQueriesFilePath();
    fs.writeFileSync(queriesFile, JSON.stringify(queries, null, 2));
  } catch (error) {
    console.error('Error saving queries:', error);
    throw error;
  }
}

// Add a new query
export function addQuery(query: Omit<Query, 'id' | 'createdAt' | 'read' | 'replied'>): Query {
  const queries = getQueries();
  const newQuery: Query = {
    ...query,
    id: `query-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    read: false,
    replied: false,
  };
  queries.unshift(newQuery); // Add to beginning
  saveQueries(queries);
  return newQuery;
}

// Get a single query by ID
export function getQueryById(id: string): Query | undefined {
  const queries = getQueries();
  return queries.find(q => q.id === id);
}

// Update query (mark as read, replied, etc.)
export function updateQuery(id: string, updates: Partial<Query>): Query | null {
  const queries = getQueries();
  const index = queries.findIndex(q => q.id === id);
  if (index === -1) {
    return null;
  }
  queries[index] = { ...queries[index], ...updates };
  saveQueries(queries);
  return queries[index];
}

// Delete a query
export function deleteQuery(id: string): boolean {
  const queries = getQueries();
  const filtered = queries.filter(q => q.id !== id);
  if (filtered.length === queries.length) {
    return false; // Query not found
  }
  saveQueries(filtered);
  return true;
}

