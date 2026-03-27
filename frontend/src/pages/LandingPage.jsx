import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, Zap, BarChart3, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="max-w-5xl mx-auto py-20 px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase mb-8 shadow-sm border border-blue-100">
          <Zap size={14} fill="currentColor" /> Next-Gen Bioinformatics Monitor
        </div>
        <h1 className="text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-none">
          VitalSync <span className="text-blue-600 italic">Smart Sieve.</span>
        </h1>
        <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed font-medium mb-12">
          An advanced real-time monitoring suite designed to sieve critical clinical data through automated triage logic.
        </p>
        <div className="flex justify-center gap-6">
          <Link to="/dashboard" className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-slate-800 transition-all shadow-2xl hover:scale-105 active:scale-95">
            Launch Live Monitor <ArrowRight size={18} />
          </Link>
          <Link to="/patients" className="bg-white border-2 border-slate-200 text-slate-700 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all shadow-sm">
            Patient Registry
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: <Shield />, title: "Auto-Triage", desc: "Sieves patients based on Heart Rate and SpO2 thresholds.", color: "blue" },
          { icon: <Activity />, title: "Live Simulation", desc: "Continuous background vitals generated via Spring Boot.", color: "emerald" },
          { icon: <BarChart3 />, title: "Data Trends", desc: "Real-time visualization using Recharts for trend analysis.", color: "purple" }
        ].map((f, i) => (
          <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className={`bg-${f.color}-100 text-${f.color}-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
              {f.icon}
            </div>
            <h3 className="font-black text-slate-800 text-xl uppercase tracking-tighter mb-3">{f.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;