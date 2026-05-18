import React, { useState } from 'react';
import CommunityFeed from './CommunityFeed';

export default function CommunityPageContent() {
  const [activeTab, setActiveTab] = useState<'community' | 'gigs'>('community');

  return (
    <div className="w-full max-w-[600px] mx-auto px-4 pt-4 pb-20 bg-white dark:bg-[#0d0d0d] min-h-screen">
      {/* Toggle Container */}
      <div className="flex bg-gray-100 dark:bg-[#1a1a1a] p-1 rounded-[30px] mb-6 relative">
        <div
          className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-[#27272A] shadow-md rounded-[30px] transition-all duration-300 ease-in-out"
          style={{ left: activeTab === 'community' ? '4px' : 'calc(50%)' }}
        />
        <button
          onClick={() => setActiveTab('community')}
          className={`flex-1 py-2.5 text-center text-sm font-semibold z-10 transition-colors duration-300 ${
            activeTab === 'community' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          Community
        </button>
        <button
          onClick={() => setActiveTab('gigs')}
          className={`flex-1 py-2.5 text-center text-sm font-semibold z-10 transition-colors duration-300 ${
            activeTab === 'gigs' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          Gigs
        </button>
      </div>

      {/* Content Area */}
      <div className="flex flex-col gap-6">
        {activeTab === 'community' ? (
          <CommunityFeed />
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2rem]">
            Gigs Feed placeholder (UI only, no logic, no API calls)
          </div>
        )}
      </div>
    </div>
  );
}
