'use client';

import { useAuth } from '@/providers/AuthProvider';

import Link from 'next/link';

export default function DashboardLayout({ children }) {
  const { admin, logout } = useAuth();

  return (
    <div className="min-h-screen bg

-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
             
              <h1 className="text-2xl font-bold text-gray-900 ml-4">Welcome to the Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4">Welcome, {admin?.name}</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}