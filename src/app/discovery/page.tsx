// app/discovery/page.tsx
'use client';

import { useEffect, useState } from 'react';

interface BuyerRequest {
  request_id: number;
  user_id: number;
  title: string;
  category: string;
  budget_min: number;
  budget_max: number;
  description: string;
  location: string;
  status: 'open' | 'in_progress' | 'done' | 'cancelled';
  created_at: string;
}

export default function BuyerDiscoveryPage() {
  const [requests, setRequests] = useState<BuyerRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch('/api/requests'); // Replace with your API route
        const data = await res.json();
        setRequests(data);
      } catch (error) {
        console.error('Failed to fetch buyer requests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Buyer's Requests</h1>

      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No buyer requests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div
              key={req.request_id}
              className="bg-white rounded-xl shadow-md p-4 border hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-blue-700 mb-2">
                {req.title}
              </h2>
              <p className="text-sm text-gray-500 mb-1">
                Category: {req.category}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                Budget: ${req.budget_min} - ${req.budget_max}
              </p>
              <p className="text-sm text-gray-700 mb-2 line-clamp-3">
                {req.description}
              </p>
              <p className="text-xs text-gray-400">
                Posted on {new Date(req.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
