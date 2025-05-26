'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';

const requestSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  budget_min: z.coerce.number().positive('Must be a positive number'),
  budget_max: z.coerce.number().positive('Must be a positive number'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type RequestFormData = z.infer<typeof requestSchema>;

export default function BuyerRequestForm() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
  });
  const { token, user } = useAuth();

  const onSubmit = async (data: RequestFormData) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        location: 'USA', // Example static location, replace with actual logic if needed
        status: 'open', // Default status for new requests
        user_id: user?.id, // Assuming user object has an id
      };
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to submit request');
      alert('Request submitted successfully!');
    } catch (error) {
      console.error(error);
      alert('Error submitting request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Create a Buyer Request</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700">Title</label>
          <input
            {...register('title')}
            className="mt-1 w-full border rounded p-2"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium text-gray-700">Category</label>
          <input
            {...register('category')}
            className="mt-1 w-full border rounded p-2"
          />
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700">
              Min Budget
            </label>
            <input
              type="number"
              {...register('budget_min')}
              className="mt-1 w-full border rounded p-2"
            />
            {errors.budget_min && (
              <p className="text-red-500 text-sm mt-1">
                {errors.budget_min.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Max Budget
            </label>
            <input
              type="number"
              {...register('budget_max')}
              className="mt-1 w-full border rounded p-2"
            />
            {errors.budget_max && (
              <p className="text-red-500 text-sm mt-1">
                {errors.budget_max.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Description</label>
          <textarea
            {...register('description')}
            rows={4}
            className="mt-1 w-full border rounded p-2"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
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
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}
