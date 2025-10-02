'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const { user, signout } = useAuth();
  console.log('Navigation render, user:', user);

  return (
    <header className="p-4 bg-gray-800 text-white shadow">
      <nav className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-xl font-semibold">BuySellHub</div>
        <ul className="flex gap-4 items-center">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link href="/request" className="hover:underline">
                  Post Request
                </Link>
              </li>
              <li>
                <button
                  onClick={signout}
                  className="hover:underline text-red-300"
                >
                  Sign Out
                </button>
              </li>
              <li>
                <span className="text-sm bg-blue-700 px-2 py-1 rounded">
                  {user.username}
                </span>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/signin" className="hover:underline">
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
