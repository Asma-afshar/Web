'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import type { Query } from '@/lib/queries';

export default function AdminQueriesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [search, setSearch] = useState('');
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchQueries();
    }
  }, [filter, search, isAuthenticated]);

  const checkAuthentication = async () => {
    try {
      const response = await fetch('/api/auth/check');
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        console.log('Authentication check failed, redirecting to login');
        router.push('/admin/login?redirect=/admin/queries');
      }
    } catch (error) {
      console.log('Authentication check error:', error);
      router.push('/admin/login?redirect=/admin/queries');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('filter', filter);
      if (search) params.append('search', search);

      const response = await fetch(`/api/queries?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setQueries(data.queries || []);
    } catch (error) {
      console.error('Error fetching queries:', error);
      // Show error to user
      alert('Failed to load queries. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch('/api/queries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, read: true }),
      });
      if (response.ok) {
        fetchQueries();
        if (selectedQuery?.id === id) {
          setSelectedQuery({ ...selectedQuery, read: true });
        }
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAsReplied = async (id: string) => {
    try {
      const response = await fetch('/api/queries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, replied: true }),
      });
      if (response.ok) {
        fetchQueries();
        if (selectedQuery?.id === id) {
          setSelectedQuery({ ...selectedQuery, replied: true });
        }
      }
    } catch (error) {
      console.error('Error marking as replied:', error);
    }
  };

  const openReplyForm = () => {
    if (selectedQuery) {
      setReplySubject(`Re: ${selectedQuery.subject}`);
      setReplyMessage(`Dear ${selectedQuery.name},\n\nThank you for your inquiry about ${selectedQuery.propertyTitle || 'our properties'}.\n\n[Your response here]\n\nBest regards,\nRealEstate Team`);
      setShowReplyForm(true);
    }
  };

  const sendReply = async () => {
    if (!selectedQuery || !replyMessage.trim()) return;

    try {
      setLoading(true);
      const response = await fetch('/api/queries/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedQuery.id,
          subject: replySubject,
          message: replyMessage.replace(/\n/g, '<br>')
        }),
      });

      if (response.ok) {
        fetchQueries();
        setSelectedQuery({ ...selectedQuery, replied: true });
        setShowReplyForm(false);
        setReplyMessage('');
        alert('Reply sent successfully!');
      } else {
        const err = await response.json().catch(() => ({}));
        alert('Failed to send reply: ' + (err.error || response.statusText));
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Error sending reply');
    } finally {
      setLoading(false);
    }
  };

  const deleteQuery = async (id: string) => {
    if (!confirm('Are you sure you want to delete this query?')) return;
    
    try {
      const response = await fetch(`/api/queries?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchQueries();
        if (selectedQuery?.id === id) {
          setSelectedQuery(null);
        }
      }
    } catch (error) {
      console.error('Error deleting query:', error);
    }
  };

  const unreadCount = queries.filter(q => !q.read).length;

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <a
                href="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-700"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Logged in as: <span className="font-medium">{user?.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Queries</h1>
          <p className="text-gray-600">Manage and respond to customer inquiries</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Query List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Search */}
              <div className="mb-4">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search queries..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="mb-4 space-y-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    filter === 'all' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  All Queries ({queries.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    filter === 'unread' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter('read')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    filter === 'read' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  Read
                </button>
                <button
                  onClick={() => setFilter('replied')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    filter === 'replied' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  Replied
                </button>
              </div>

              {/* Query List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : queries.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No queries found</div>
                ) : (
                  queries.map((query) => (
                    <div
                      key={query.id}
                      onClick={() => {
                        setSelectedQuery(query);
                        if (!query.read) markAsRead(query.id);
                      }}
                      className={`p-4 rounded-lg cursor-pointer transition-colors border ${
                        selectedQuery?.id === query.id
                          ? 'bg-blue-50 border-blue-300'
                          : query.read
                          ? 'bg-white border-gray-200 hover:bg-gray-50'
                          : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">{query.name}</h3>
                        {!query.read && (
                          <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{query.subject}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(query.createdAt).toLocaleDateString()}
                      </p>
                      {query.propertyTitle && (
                        <p className="text-xs text-blue-600 mt-1">Property: {query.propertyTitle}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Query Details */}
          <div className="lg:col-span-2">
            {selectedQuery ? (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedQuery.subject}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{selectedQuery.name}</span>
                      <span>•</span>
                      <span>{selectedQuery.email}</span>
                      {selectedQuery.phone && (
                        <>
                          <span>•</span>
                          <span>{selectedQuery.phone}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedQuery.read ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Read
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        Unread
                      </span>
                    )}
                    {selectedQuery.replied && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        Replied
                      </span>
                    )}
                  </div>
                </div>

                {selectedQuery.propertyTitle && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-1">Related Property</p>
                    <p className="text-blue-700">{selectedQuery.propertyTitle}</p>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Message</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedQuery.message}</p>
                  </div>
                </div>

                <div className="mb-6 text-sm text-gray-500">
                  Received: {new Date(selectedQuery.createdAt).toLocaleString()}
                </div>

                {showReplyForm && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Compose Reply</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={replySubject}
                          onChange={(e) => setReplySubject(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Email subject"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message
                        </label>
                        <textarea
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.ctrlKey && e.key === 'Enter' && replyMessage.trim() && !loading) {
                              sendReply();
                            }
                          }}
                          rows={8}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Type your reply message... (Ctrl+Enter to send)"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={sendReply}
                          disabled={loading || !replyMessage.trim()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Sending...' : 'Send Reply'}
                        </button>
                        <button
                          onClick={() => setShowReplyForm(false)}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                        <div className="ml-auto flex gap-2">
                          <select
                            onChange={(e) => {
                              const template = e.target.value;
                              if (template && selectedQuery) {
                                let message = '';
                                switch (template) {
                                  case 'interest':
                                    message = `Dear ${selectedQuery.name},\n\nThank you for your interest in our properties. We'd be happy to provide more information and arrange a viewing.\n\nPlease let us know your preferred dates and times, and we'll coordinate with the property owner.\n\nBest regards,\nRealEstate Team`;
                                    break;
                                  case 'availability':
                                    message = `Dear ${selectedQuery.name},\n\nThank you for your inquiry about property availability. Let me check the current status and get back to you with the most up-to-date information.\n\nI'll respond within the next 24 hours with availability details.\n\nBest regards,\nRealEstate Team`;
                                    break;
                                  case 'pricing':
                                    message = `Dear ${selectedQuery.name},\n\nThank you for your question about pricing. All listed prices are the asking price and may be subject to negotiation.\n\nFor the most accurate pricing information and to discuss terms, I'd recommend scheduling a viewing or speaking directly with our agent.\n\nBest regards,\nRealEstate Team`;
                                    break;
                                  case 'documents':
                                    message = `Dear ${selectedQuery.name},\n\nThank you for your inquiry. We're happy to provide additional documentation including floor plans, property reports, and neighborhood information.\n\nPlease let us know what specific documents you'd like, and we'll send them to you promptly.\n\nBest regards,\nRealEstate Team`;
                                    break;
                                  case 'custom':
                                    message = `Dear ${selectedQuery.name},\n\n[Your custom response here]\n\nBest regards,\nRealEstate Team`;
                                    break;
                                }
                                setReplyMessage(message);
                                e.target.value = '';
                              }
                            }}
                            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Templates</option>
                            <option value="interest">Property Interest</option>
                            <option value="availability">Availability Check</option>
                            <option value="pricing">Pricing Question</option>
                            <option value="documents">Document Request</option>
                            <option value="custom">Custom Template</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={openReplyForm}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Compose Reply
                  </button>
                  {selectedQuery.phone && (
                    <a
                      href={`tel:${selectedQuery.phone}`}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Call Customer
                    </a>
                  )}
                  {!selectedQuery.read && (
                    <button
                      onClick={() => markAsRead(selectedQuery.id)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Mark as Read
                    </button>
                  )}
                  {!selectedQuery.replied && (
                    <button
                      onClick={() => markAsReplied(selectedQuery.id)}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors"
                    >
                      Mark as Replied
                    </button>
                  )}
                  <button
                    onClick={() => deleteQuery(selectedQuery.id)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-gray-600">Select a query to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}







