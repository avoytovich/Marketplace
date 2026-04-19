// app/seller/proposal/[requestId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../../../contexts/AuthContext';

const proposalSchema = z.object({
  price: z.coerce.number().positive('Price must be positive'),
  estimated_time: z.string().min(1, 'Estimated time is required'), // Renamed delivery_time to estimated_time
  message: z.string().min(10, 'Message must be at least 10 characters'),
  portfolio_url: z.string().url('Enter a valid URL').optional(),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

export default function SellerProposalPage() {
  const { requestId } = useParams();
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProposalFormData>({ resolver: zodResolver(proposalSchema) });

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await fetch(`/api/requests/${requestId}`);
        const data = await res.json();
        setRequest(data);
      } catch (error) {
        console.error('Failed to load request:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [requestId]);

  const onSubmit = async (data: ProposalFormData) => {
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, request_id: requestId, seller_id: user?.id }),
      });
      if (!res.ok) throw new Error('Failed to submit proposal');
      alert('Proposal submitted successfully!');
    } catch (error) {
      console.error(error);
      alert('Error submitting proposal');
    }
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!request) return <p className="text-center py-10">Request not found.</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Submit Proposal for: {request.title}</h1>

      <div className="bg-gray-50 border p-4 rounded mb-6">
        <p className="text-sm text-gray-600"><strong>Category:</strong> {request.category}</p>
        <p className="text-sm text-gray-600">
          <strong>Budget:</strong> ${request.budget_min} - ${request.budget_max}
        </p>
        <p className="text-sm text-gray-700 mt-2">{request.description}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700">Proposed Price ($)</label>
          <input type="number" {...register('price')} className="mt-1 w-full border rounded p-2" />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block font-medium text-gray-700">Estimated Delivery Time</label>
          <select {...register('estimated_time')} className="mt-1 w-full border rounded p-2">
            <option value="">Select...</option>
            <option value="1 day">1 day</option>
            <option value="3 days">3 days</option>
            <option value="1 week">1 week</option>
            <option value="2 weeks">2 weeks</option>
          </select>
          {errors.estimated_time && <p className="text-red-500 text-sm mt-1">{errors.estimated_time.message}</p>}
        </div>

        <div>
          <label className="block font-medium text-gray-700">Message</label>
          <textarea {...register('message')} rows={4} className="mt-1 w-full border rounded p-2" />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
        </div>

        <div>
          <label className="block font-medium text-gray-700">Portfolio URL</label>
          <input {...register('portfolio_url')} className="mt-1 w-full border rounded p-2" />
          {errors.portfolio_url && <p className="text-red-500 text-sm mt-1">{errors.portfolio_url.message}</p>}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Submit Proposal
          </button>
        </div>
      </form>
    </div>
  );
}
