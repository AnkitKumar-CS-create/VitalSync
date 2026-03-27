import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, User, Search, Volume2, VolumeX } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import api from '../services/api';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [history, setHistory] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const navigate = useNavigate();
  const isMutedRef = useRef(isMuted);

  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);

  const playAlertSound = () => {
    if (isMutedRef.current) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      setTimeout(() => oscillator.stop(), 150);
    } catch (e) { console.log("Audio blocked"); }
  };

  const fetchData = async () => {
    try {
      const res = await api.get('/patients');
      setPatients(res.data);
      setHistory(prev => {
        const newHistory = { ...prev };
        res.data.forEach(p => {
          if (!newHistory[p.id]) newHistory[p.id] = [];
          newHistory[p.id] = [...newHistory[p.id], { hr: p.lastHeartRate }].slice(-15);
        });
        return newHistory;
      });
      if (res.data.some(p => p.lastHeartRate > 100 || p.lastOxygenLevel < 95)) playAlertSound();
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">Live Monitoring</h2>
        <div className="flex gap-4">
          <div className="relative w-64">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input type="text" placeholder="Search Patient..." className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none font-bold text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button onClick={() => setIsMuted(!isMuted)} className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredPatients.map(p => (
          <div 
            key={p.id} 
            onClick={() => navigate(`/patient/${p.id}`)}
            className={`bg-white p-8 rounded-[3rem] shadow-xl border-2 cursor-pointer hover:scale-[1.02] transition-all ${p.lastHeartRate > 100 || p.lastOxygenLevel < 95 ? 'border-red-500 bg-red-50/20' : 'border-transparent hover:border-blue-500'}`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${p.lastHeartRate > 100 ? 'bg-red-600' : 'bg-blue-600'} text-white shadow-lg`}>
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-xl uppercase tracking-tighter">{p.name}</h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">Click for detailed analysis</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-black ${p.lastHeartRate > 100 ? 'text-red-600 animate-pulse' : 'text-slate-800'}`}>{p.lastHeartRate.toFixed(1)} <span className="text-[10px]">BPM</span></div>
                <div className="text-xl font-black text-slate-800">{p.lastOxygenLevel.toFixed(1)}% <span className="text-[10px]">SpO2</span></div>
              </div>
            </div>
            <div className="h-24 w-full opacity-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history[p.id] || []}>
                  <Line type="monotone" dataKey="hr" stroke={p.lastHeartRate > 100 ? "#ef4444" : "#2563eb"} strokeWidth={4} dot={false} isAnimationActive={false} />
                  <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;