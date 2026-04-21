'use client';

import { ConnectWallet } from '@/components/connect-wallet';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold mb-6">Staxial Health</h1>
        <p className="text-xl text-gray-400 mb-8">
          Decentralized health management system on Stacks blockchain
        </p>
        <p className="text-gray-500 mb-12">
          A multi-hospital platform where hospitals can register, patients can manage their
          medical records, and appointments can be booked securely on-chain.
        </p>
        
        <div className="flex gap-4 justify-center mb-12">
          <ConnectWallet />
          <Link
            href="/admin"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
          >
            Admin Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">🏥 Hospital Registry</h3>
            <p className="text-sm text-gray-400">
              Hospitals can register, stake tokens, and get verified by admins
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">📋 Patient Records</h3>
            <p className="text-sm text-gray-400">
              Secure medical records with patient-controlled access
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">📅 Appointments</h3>
            <p className="text-sm text-gray-400">
              Book appointments and pay with platform tokens
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
