'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const [userInput, setUserInput] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    // Call the API route to create the table
    fetch('/api/init-tables');
  }, []);

  const handleGenerateSQL = async () => {
    try {
      const response = await fetch('/api/ollama-sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userInput }),
      });

      const data = await response.json();
      if (data.error) {
        setErrorMessage(`Error: ${data.error}`);
        setQueryResult(null);
      } else {
        setErrorMessage('');
        setQueryResult(data);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error processing your request');
      setQueryResult(null);
    }
  };

  // Helper to render a table from rows array
  function renderTable(rows: any[]) {
    if (!rows || rows.length === 0) return <div>No data found.</div>;
    const headers = Object.keys(rows[0]);
    return (
      <table className="min-w-full border-collapse bg-white mt-4">
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header} className="border px-4 py-2 bg-gray-200">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {headers.map(header => (
                <td key={header} className="border px-4 py-2">{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <section className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">Welcome to BuySellHub</h1>
      <p className="text-lg text-gray-600 mb-6">
        A simple platform to connect buyers and sellers through custom requests and offers.
      </p>
      <Link
        href="/discovery"
        className="inline-block bg-blue-600 text-white px-6 py-3 mx-6 rounded hover:bg-blue-700"
      >
        Browse a Buyer's Requests
      </Link>
      <Link
        href="/request"
        className="inline-block bg-blue-600 text-white px-6 py-3 mx-6 rounded hover:bg-blue-700"
      >
        Post Request as a Buyer
      </Link>
      {user && (
        <div className="mt-24 mb-2 flex justify-center items-center">
          <div>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter your question"
            className="border px-4 py-2 rounded w-1/2 h-32 w-full resize-none"
          />
          <button
            onClick={handleGenerateSQL}
            className="ml-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Search with AI Assistant
          </button>
        </div>
      </div>
      )}
      {(errorMessage || queryResult) && user && (
        <div className="mt-4 mb-4 p-4 bg-gray-100 rounded text-left max-w-3xl mx-auto">
          {errorMessage && <div className="text-red-600 mb-3">{errorMessage}</div>}
          {queryResult && (
            <>
              {renderTable(queryResult.rows)}
            </>
          )}
        </div>
      )}
    </section>
  );
}