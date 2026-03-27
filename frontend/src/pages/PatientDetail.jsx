import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Heart, Droplets, Clipboard, TrendingUp, FileText, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip, CartesianGrid } from 'recharts';
import api from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchData = async () => {
    try {
      const res = await api.get(`/patients`);
      const currentPatient = res.data.find(p => p.id.toString() === id);
      if (currentPatient) {
        setPatient(currentPatient);
        setHistory(prev => [...prev, { 
          hr: currentPatient.lastHeartRate, 
          o2: currentPatient.lastOxygenLevel, 
          time: new Date().toLocaleTimeString() 
        }].slice(-30));
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [id]);

  // --- PROFESSIONAL PDF GENERATOR (ULITMATE VERSION) ---
  const downloadIndividualReport = () => {
    const doc = new jsPDF();
    const isCritical = patient.lastHeartRate > 100 || patient.lastOxygenLevel < 95;
    const statusText = isCritical ? "CRITICAL ALERT" : "STABLE / NORMAL";
    const statusColor = isCritical ? [220, 38, 38] : [16, 185, 129];
    
    // 1. Heavy Branding Header
    doc.setFillColor(15, 23, 42); 
    doc.rect(0, 0, 210, 50, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text("VITALSYNC", 15, 25);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("SMART SIEVE CLINICAL ANALYTICS ENGINE", 15, 32);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("PATIENT CASE SUMMARY", 130, 25);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`DOC ID: VS-SPEC-${Date.now().toString().slice(-6)}`, 130, 32);
    doc.text(`TIMESTAMP: ${new Date().toLocaleString()}`, 130, 37);

    // 2. Patient Profile Box
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("PATIENT BIOMETRIC PROFILE", 15, 65);
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 68, 195, 68);

    doc.setFontSize(10);
    doc.text("FULL NAME:", 15, 80);
    doc.setFont("helvetica", "normal");
    doc.text(patient.name.toUpperCase(), 50, 80);

    doc.setFont("helvetica", "bold");
    doc.text("AGE / CATEGORY:", 15, 90);
    doc.setFont("helvetica", "normal");
    doc.text(`${patient.age} YEARS / ADULT PATIENT`, 50, 90);

    doc.setFont("helvetica", "bold");
    doc.text("BLOOD TYPE:", 110, 80);
    doc.setFont("helvetica", "normal");
    doc.text(patient.bloodGroup, 150, 80);

    doc.setFont("helvetica", "bold");
    doc.text("TRIAGE STATUS:", 110, 90);
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(statusText, 150, 90);

    // 3. Clinical Observation Table
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("DETAILED VITALS ANALYSIS", 15, 110);

    autoTable(doc, {
      startY: 115,
      head: [['PARAMETER', 'VALUE', 'CLINICAL RANGE', 'INTERPRETATION']],
      body: [
        ['Heart Rate (BPM)', `${patient.lastHeartRate.toFixed(1)}`, '60.0 - 100.0', patient.lastHeartRate > 100 ? 'ABNORMAL (HIGH)' : 'STABLE'],
        ['Oxygen Sat. (SpO2)', `${patient.lastOxygenLevel.toFixed(1)}%`, '95.0 - 100.0%', patient.lastOxygenLevel < 95 ? 'LOW (HYPOXIA)' : 'OPTIMAL'],
        ['Blood Group Data', patient.bloodGroup, 'COMPATIBLE', 'VERIFIED'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], fontSize: 10, halign: 'center' },
      bodyStyles: { fontSize: 10, halign: 'center', cellPadding: 6 },
      didParseCell: function (data) {
        if (data.column.index === 3 && (data.cell.text[0].includes('ABNORMAL') || data.cell.text[0].includes('LOW'))) {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });

    // 4. Observations & Remarks
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("SYSTEM GENERATED REMARKS", 15, finalY);
    
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(248, 250, 252);
    doc.rect(15, finalY + 4, 180, 30, 'FD');
    
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const observation = isCritical 
      ? `SYSTEM ALERT: Biometric sensors have flagged values outside established safety protocols. High risk of cardiovascular instability. Immediate manual check of the patient is mandatory.`
      : `SYSTEM STATUS: All parameters are within clinical safety margins. The patient is currently responding well to treatment/monitoring. No immediate intervention required.`;
    doc.text(observation, 20, finalY + 13, { maxWidth: 170 });

    // 5. Signature Footer
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.text("Authorized Signature:", 145, finalY + 65);
    doc.line(145, finalY + 70, 195, finalY + 70);
    doc.setFontSize(8);
    doc.text("Bioinformatics Dept. Head", 145, finalY + 75);

    doc.save(`Clinical_Report_${patient.name.replace(/\s+/g, '_')}.pdf`);
  };

  if (!patient) return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <Activity className="animate-spin text-blue-600" size={48} />
      <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Synchronizing Real-time Data...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-left-4 duration-700 pb-10">
      {/* Header Navigation */}
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-all uppercase text-[10px] tracking-widest">
          <ArrowLeft size={16} /> Dashboard
        </button>
        <button onClick={downloadIndividualReport} className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:scale-105 transition-all">
          <FileText size={18} /> Export Full Case Report
        </button>
      </div>

      {/* Hero Profile Card */}
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="flex items-center gap-8 z-10">
          <div className={`p-8 rounded-[2.5rem] shadow-2xl ${patient.lastHeartRate > 100 ? 'bg-red-600 shadow-red-200' : 'bg-blue-600 shadow-blue-200'} text-white`}>
            <Activity size={48} />
          </div>
          <div>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-2">{patient.name}</h1>
            <div className="flex items-center gap-4 text-slate-400 font-bold tracking-widest text-[10px] uppercase">
               <span>ID: VS-{patient.id}</span>
               <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
               <span>Blood Group: {patient.bloodGroup}</span>
            </div>
          </div>
        </div>
        
        <div className={`flex items-center gap-3 px-10 py-5 rounded-3xl text-white font-black uppercase tracking-widest text-xs shadow-2xl z-10 ${patient.lastHeartRate > 100 ? 'bg-red-600 animate-pulse' : 'bg-emerald-500'}`}>
          {patient.lastHeartRate > 100 ? <ShieldAlert size={20} /> : <CheckCircle2 size={20} />}
          {patient.lastHeartRate > 100 ? 'Critical Alert' : 'Normal'}
        </div>
      </div>

      {/* Grid: Stats & Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vital Cards */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50 group hover:border-red-100 transition-all">
            <div className="flex items-center justify-between mb-6">
               <div className="p-3 bg-red-50 text-red-500 rounded-2xl"><Heart size={24} fill="currentColor" /></div>
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Heart Rate</span>
            </div>
            <div className={`text-6xl font-black italic ${patient.lastHeartRate > 100 ? 'text-red-600' : 'text-slate-800'}`}>
               {patient.lastHeartRate.toFixed(1)} <span className="text-xl font-bold text-slate-300 not-italic uppercase">bpm</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50 group hover:border-blue-100 transition-all">
            <div className="flex items-center justify-between mb-6">
               <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl"><Droplets size={24} fill="currentColor" /></div>
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Oxygen SpO2</span>
            </div>
            <div className={`text-6xl font-black italic ${patient.lastOxygenLevel < 95 ? 'text-red-600' : 'text-slate-800'}`}>
               {patient.lastOxygenLevel.toFixed(1)}<span className="text-xl font-bold text-slate-300 not-italic uppercase">%</span>
            </div>
          </div>
        </div>

        {/* Real-time Visualization */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-50">
          <div className="flex justify-between items-center mb-10">
             <h3 className="font-black uppercase text-[10px] tracking-widest text-slate-400 flex items-center gap-3">
               <TrendingUp size={16} className="text-blue-500" /> Biometric Analysis Window
             </h3>
             <div className="flex gap-4">
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                   <div className="w-2 h-2 bg-blue-600 rounded-full"></div> HR
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> SpO2
                </div>
             </div>
          </div>
          
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" hide />
                <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: '900', textTransform: 'uppercase', fontSize: '10px' }} 
                  cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                />
                <Line type="monotone" dataKey="hr" stroke="#2563eb" strokeWidth={8} dot={false} animationDuration={300} isAnimationActive={false} />
                <Line type="monotone" dataKey="o2" stroke="#10b981" strokeWidth={8} dot={false} animationDuration={300} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;