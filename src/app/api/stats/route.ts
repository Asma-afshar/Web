import { NextRequest, NextResponse } from 'next/server';
import { getQueries } from '@/lib/queries';

export async function GET(request: NextRequest) {
  try {
    const queries = getQueries();

    // Calculate statistics
    const stats = {
      total: queries.length,
      unread: queries.filter(q => !q.read).length,
      read: queries.filter(q => q.read && !q.replied).length,
      replied: queries.filter(q => q.replied).length,
      today: queries.filter(q => {
        const today = new Date();
        const queryDate = new Date(q.createdAt);
        return queryDate.toDateString() === today.toDateString();
      }).length,
      thisWeek: queries.filter(q => {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const queryDate = new Date(q.createdAt);
        return queryDate >= weekAgo;
      }).length,
      thisMonth: queries.filter(q => {
        const now = new Date();
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const queryDate = new Date(q.createdAt);
        return queryDate >= monthAgo;
      }).length,
      bySubject: {} as Record<string, number>,
      byProperty: {} as Record<string, number>,
      recent: queries.slice(0, 5).map(q => ({
        id: q.id,
        name: q.name,
        subject: q.subject,
        createdAt: q.createdAt,
        read: q.read,
        replied: q.replied,
      })),
    };

    // Group by subject
    queries.forEach(q => {
      const subject = q.subject.toLowerCase();
      stats.bySubject[subject] = (stats.bySubject[subject] || 0) + 1;
    });

    // Group by property
    queries.forEach(q => {
      if (q.propertyTitle) {
        const property = q.propertyTitle.toLowerCase();
        stats.byProperty[property] = (stats.byProperty[property] || 0) + 1;
      }
    });

    // Get top subjects and properties
    stats.bySubject = Object.fromEntries(
      Object.entries(stats.bySubject)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
    );

    stats.byProperty = Object.fromEntries(
      Object.entries(stats.byProperty)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
    );

    return NextResponse.json({
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}


