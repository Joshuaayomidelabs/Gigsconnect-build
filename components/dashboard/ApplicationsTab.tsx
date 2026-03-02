import React from 'react';
import { Eye } from 'lucide-react';

const ApplicationsTab = () => {
  const applications = [
    { id: 1, title: 'Lead Guitarist for Afrobeats Tour', status: 'Pending', date: 'Oct 10, 2026' },
    { id: 2, title: 'Session Drummer - Studio Recording', status: 'Accepted', date: 'Oct 05, 2026' },
    { id: 3, title: 'Jazz Pianist for Corporate Gala', status: 'Rejected', date: 'Sept 28, 2026' },
    { id: 4, title: 'Wedding Band (4-piece)', status: 'Pending', date: 'Sept 20, 2026' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Accepted': return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Accepted</span>;
      case 'Rejected': return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">Rejected</span>;
      default: return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">Pending</span>;
    }
  };

  return (
    <div className="space-y-8 relative z-10">
      <section>
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-500 mt-1 text-lg">Track the status of your gig applications</p>
      </section>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600 text-sm">Gig Title</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Apply Date</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{app.title}</td>
                  <td className="p-4 text-gray-500 text-sm">{app.date}</td>
                  <td className="p-4">{getStatusBadge(app.status)}</td>
                  <td className="p-4 text-right">
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-white hover:text-brand-600 hover:border-brand-200 transition-colors text-sm font-medium">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsTab;
