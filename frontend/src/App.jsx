import React from 'react';
import { Activity, ShieldCheck, Database, Layout } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Main Card */}
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full text-center">
        
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-4 rounded-full text-white shadow-lg">
            <Activity size={48} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          VitalSync <span className="text-blue-600">Smart Sieve</span>
        </h1>
        <p className="text-gray-500 mb-8 text-lg">
          Frontend is successfully connected with Tailwind & Lucide Icons!
        </p>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center">
            <Layout className="text-blue-500 mb-2" />
            <span className="font-semibold text-gray-700">React JS</span>
          </div>
          <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center">
            <ShieldCheck className="text-green-500 mb-2" />
            <span className="font-semibold text-gray-700">Spring Boot</span>
          </div>
          <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center">
            <Database className="text-purple-500 mb-2" />
            <span className="font-semibold text-gray-700">PostgreSQL</span>
          </div>
        </div>

        {/* Backend Connectivity Test Button */}
        <button 
          onClick={() => alert('Axios setup coming next!')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-md"
        >
          Check Backend Connectivity
        </button>
      </div>

      {/* Footer Info */}
      <p className="mt-8 text-gray-400 text-sm italic">
        Building the future of Health-Data filtering.
      </p>
    </div>
  );
}

export default App;