// app/buyer/requests/[requestId]/proposals/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext'; // Assuming AuthContext provides user info

interface Proposal {
  proposal_id: number;
  request_id: number;
  price: number;
  estimated_time: string;
  message: string;
  portfolio_url?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  seller_id: number;
  sellerName?: string;
}

export default function BuyerProposalManagementPage() {
  const { requestId } = useParams();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await fetch(`/api/proposals?request_id=${requestId}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const proposalsWithNames = await Promise.all(
            data.map(async (proposal: Proposal) => {
              try {
                // Fetch user details based on seller_id
                const userRes = await fetch(`/api/users?seller_id=${proposal.seller_id}`);
                const userData = await userRes.json();
                proposal.sellerName = userData?.[0]?.username || 'Unknown Seller';
              } catch (_) {
                proposal.sellerName = 'Unknown Seller';
              }
              return proposal;
            })
          );
          setProposals(proposalsWithNames);
        } else {
          setProposals([]);
        }
      } catch (error) {
        console.error('Failed to fetch proposals', error);
      } finally {
        setLoading(false);
      }
    };

    const verifyOwnership = async () => {
      try {
        const res = await fetch(`/api/requests/${requestId}`);
        const requestData = await res.json();

        if (requestData.user.user_id !== user?.id) {
          router.push('/unauthorized'); // Redirect to an unauthorized page
        }
      } catch (error) {
        console.error('Failed to verify ownership', error);
        router.push('/error'); // Redirect to a generic error page
      }
    };

    if (user) {
      verifyOwnership();
    }

    fetchProposals();
  }, [requestId, user, router]);

  const updateStatus = async (proposalId: number, status: 'accepted' | 'rejected') => {
    try {
      await fetch(`/api/proposal/${proposalId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      setProposals((prev) =>
        prev.map((p) =>
          p.proposal_id === proposalId ? { ...p, status } : p
        )
      );
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  if (loading) return <p className="text-center py-10">Loading proposals...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Manage Proposals</h1>

      {proposals.length === 0 ? (
        <p className="text-gray-500">No proposals yet for this request.</p>
      ) : (
        <div className="space-y-6">
          {proposals.map((proposal) => (
            <div
              key={proposal.proposal_id}
              className="bg-white shadow rounded-lg p-6 border"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    Seller: {proposal.sellerName || 'Unknown Seller'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Estimated Time: {proposal.estimated_time}
                  </p>
                  <p className="text-sm text-gray-500">
                    Submitted on: {new Date(proposal.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    proposal.status === 'accepted'
                      ? 'bg-green-100 text-green-700'
                      : proposal.status === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {proposal.status}
                </span>
              </div>

              <p className="text-gray-700 mb-4">{proposal.message}</p>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg">${proposal.price}</p>
                  {proposal.portfolio_url && (
                    <a
                      href={proposal.portfolio_url}
                      target="_blank"
                      className="text-blue-600 text-sm hover:underline"
                    >
                      View Portfolio
                    </a>
                  )}
                </div>

                {proposal.status === 'pending' && (
                  <div className="space-x-3">
                    <button
                      onClick={() => updateStatus(proposal.proposal_id, 'rejected')}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => updateStatus(proposal.proposal_id, 'accepted')}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Accept
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
