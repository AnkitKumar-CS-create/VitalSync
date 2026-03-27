import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, Home, Users, Activity, ChevronRight } from 'lucide-react';

import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import PatientList from './pages/PatientList';
import PatientDetail from './pages/PatientDetail'; // Naya Page Import

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50 font-sans">
        {/* SIDEBAR */}
        <nav className="w-72 bg-slate-900 text-slate-400 p-8 flex flex-col gap-10 shadow-2xl sticky top-0 h-screen">
          <div className="flex items-center gap-3 text-white">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg">
              <Activity size={24} strokeWidth={3} />
            </div>
            <span className="font-black tracking-tighter text-2xl uppercase italic">VitalSync</span>
          </div>
          <div className="flex flex-col gap-3 flex-1">
            <Link to="/" className="flex items-center justify-between group px-5 py-4 rounded-2xl hover:bg-slate-800 hover:text-white transition-all font-bold text-sm">
              <div className="flex items-center gap-4"><Home size={18} /> Home</div>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
            </Link>
            <Link to="/dashboard" className="flex items-center justify-between group px-5 py-4 rounded-2xl hover:bg-slate-800 hover:text-white transition-all font-bold text-sm">
              <div className="flex items-center gap-4"><LayoutDashboard size={18} /> Live Monitor</div>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
            </Link>
            <Link to="/patients" className="flex items-center justify-between group px-5 py-4 rounded-2xl hover:bg-slate-800 hover:text-white transition-all font-bold text-sm">
              <div className="flex items-center gap-4"><Users size={18} /> Patient Registry</div>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
            </Link>
          </div>
          <div className="mt-auto bg-slate-800/50 p-5 rounded-3xl border border-slate-800 text-xs font-bold text-emerald-400">
             <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative rounded-full h-2 w-2 bg-emerald-500"></span></span>
                SIMULATOR ONLINE
             </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patient/:id" element={<PatientDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;