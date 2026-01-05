import { NextRequest, NextResponse } from 'next/server';
import { getQueries, updateQuery, deleteQuery } from '@/lib/queries';

// GET - Fetch all queries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter'); // 'all', 'unread', 'read', 'replied'
    const search = searchParams.get('search');

    let queries = getQueries();

    // Apply filters
    if (filter === 'unread') {
      queries = queries.filter(q => !q.read);
    } else if (filter === 'read') {
      queries = queries.filter(q => q.read);
    } else if (filter === 'replied') {
      queries = queries.filter(q => q.replied);
    }

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      queries = queries.filter(q =>
        q.name.toLowerCase().includes(searchLower) ||
        q.email.toLowerCase().includes(searchLower) ||
        q.subject.toLowerCase().includes(searchLower) ||
        q.message.toLowerCase().includes(searchLower) ||
        (q.propertyTitle && q.propertyTitle.toLowerCase().includes(searchLower))
      );
    }

    // Sort by newest first
    queries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ queries });
  } catch (error) {
    console.error('Error fetching queries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch queries' },
      { status: 500 }
    );
  }
}

// PATCH - Update a query (mark as read, replied, etc.)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Query ID is required' },
        { status: 400 }
      );
    }

    const updated = updateQuery(id, updates);
    if (!updated) {
      return NextResponse.json(
        { error: 'Query not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ query: updated });
  } catch (error) {
    console.error('Error updating query:', error);
    return NextResponse.json(
      { error: 'Failed to update query' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a query
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Query ID is required' },
        { status: 400 }
      );
    }

    const deleted = deleteQuery(id);
    if (!deleted) {
      return NextResponse.json(
        { error: 'Query not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting query:', error);
    return NextResponse.json(
      { error: 'Failed to delete query' },
      { status: 500 }
    );
  }
}








