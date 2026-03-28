import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Heart, Droplets, TrendingUp, FileText, Upload, ShieldCheck, CheckCircle2, ShieldAlert, Eye } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [records, setRecords] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/patients');
      const currentPatient = res.data.find(p => p.id.toString() === id);
      if (currentPatient) {
        setPatient(currentPatient);
        setHistory(prev => [...prev, { 
          hr: currentPatient.lastHeartRate, 
          o2: currentPatient.lastOxygenLevel, 
          time: new Date().toLocaleTimeString() 
        }].slice(-30));
      }
    } catch (err) { console.error("Sync Error:", err); }
  };

  const fetchAnalysis = async (recordId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/patients/record/${recordId}/analysis`);
      setSelectedAnalysis(res.data);
      setShowModal(true);
    } catch (err) {
      console.error("Analysis Fetch Error:", err);
      alert("Analysis failed to load!");
    }
  };

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/patients/${id}/records?t=${Date.now()}`);
      console.log("--- DEBUG START ---");
      console.log("Patient ID from URL:", id);
      console.log("Data from Server:", res.data);
      console.log("--- DEBUG END ---");
      setRecords(res.data);
    } catch (err) { 
      console.error("Vault Fetch Error:", err); 
    }
  };

  useEffect(() => {
    fetchData();
    fetchRecords();
    const interval = setInterval(fetchData, 2500);
    return () => clearInterval(interval);
  }, [id]);

  const downloadProfessionalReport = () => {
    if (!patient) return;
    const doc = new jsPDF();
    const isCritical = patient.lastHeartRate > 100 || patient.lastOxygenLevel < 95;
    const statusText = isCritical ? "CRITICAL ALERT" : "STABLE / NORMAL";
    const statusColor = isCritical ? [220, 38, 38] : [16, 185, 129];
    
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

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("PATIENT BIOMETRIC PROFILE", 15, 65);
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 68, 195, 68);

    doc.setFontSize(10);
    doc.text(`FULL NAME: ${patient.name.toUpperCase()}`, 15, 80);
    doc.text(`AGE / SEX: ${patient.age} YRS / ADULT`, 15, 88);
    doc.text(`BLOOD GROUP: ${patient.bloodGroup}`, 110, 80);
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(`TRIAGE STATUS: ${statusText}`, 110, 88);

    autoTable(doc, {
      startY: 100,
      head: [['VITAL PARAMETER', 'OBSERVED', 'CLINICAL RANGE', 'ASSESSMENT']],
      body: [
        ['Heart Rate (BPM)', `${patient.lastHeartRate.toFixed(1)}`, '60.0 - 100.0', patient.lastHeartRate > 100 ? 'ABNORMAL' : 'STABLE'],
        ['Oxygen Sat. (SpO2)', `${patient.lastOxygenLevel.toFixed(1)}%`, '95.0 - 100.0%', patient.lastOxygenLevel < 95 ? 'HYPOXIA RISK' : 'OPTIMAL'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], fontSize: 10, halign: 'center' },
      bodyStyles: { fontSize: 10, halign: 'center' },
      didParseCell: (data) => {
        if (data.column.index === 3 && (data.cell.text[0] === 'ABNORMAL' || data.cell.text[0] === 'HYPOXIA RISK')) {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });

    const finalY = doc.lastAutoTable.finalY + 40;
    doc.setTextColor(15, 23, 42);
    doc.text("Digitally Verified By VitalSync Engine", 145, finalY, { align: 'center' });
    doc.line(145, finalY + 2, 195, finalY + 2);

    doc.save(`Clinical_Report_${patient.name}.pdf`);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      await axios.post(`http://localhost:8080/api/patients/${id}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchRecords(); 
      alert("Sync Success: " + file.name);
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Upload Failed.");
    } finally {
      setUploading(false);
    }
  };

  if (!patient) return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4">
      <Activity className="animate-spin text-blue-600" size={50} />
      <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Synchronizing Clinical Data...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20 p-6">
      {/* Header Navigation */}
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold uppercase text-[10px] tracking-widest transition-all">
          <ArrowLeft size={16} /> Dashboard
        </button>
        <button onClick={downloadProfessionalReport} className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-emerald-700 transition-all shadow-emerald-200">
          <FileText size={18} /> Export Clinical PDF
        </button>
      </div>

      {/* Profile Hero Section */}
      <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="flex items-center gap-8 z-10">
          <div className={`p-8 rounded-[2.5rem] shadow-2xl ${patient.lastHeartRate > 100 ? 'bg-red-600' : 'bg-blue-600'} text-white shadow-blue-200`}>
            <Activity size={48} />
          </div>
          <div>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">{patient.name}</h1>
            <p className="text-slate-400 font-bold tracking-widest text-[10px] uppercase mt-2">ID: VS-{patient.id} • BLOOD: {patient.bloodGroup}</p>
          </div>
        </div>
        <div className={`px-10 py-5 rounded-3xl text-white font-black uppercase tracking-widest text-xs shadow-2xl z-10 ${patient.lastHeartRate > 100 ? 'bg-red-600 animate-pulse' : 'bg-emerald-500'}`}>
          {patient.lastHeartRate > 100 ? <ShieldAlert size={20} className="inline mr-2"/> : <CheckCircle2 size={20} className="inline mr-2"/>}
          {patient.lastHeartRate > 100 ? 'Critical' : 'Stable'}
        </div>
      </div>

      {/* Vitals & Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50">
            <div className="flex items-center justify-between mb-4">
              <Heart className="text-red-500" size={24} fill="currentColor"/>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Pulse Rate</span>
            </div>
            <div className={`text-6xl font-black italic ${patient.lastHeartRate > 100 ? 'text-red-600' : 'text-slate-800'}`}>
              {patient.lastHeartRate.toFixed(1)} <span className="text-xl italic font-bold text-slate-300">BPM</span>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50">
            <div className="flex items-center justify-between mb-4">
              <Droplets className="text-blue-500" size={24} fill="currentColor"/>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">SpO2 Level</span>
            </div>
            <div className={`text-6xl font-black italic ${patient.lastOxygenLevel < 95 ? 'text-red-600' : 'text-slate-800'}`}>
              {patient.lastOxygenLevel.toFixed(1)}<span className="text-xl italic font-bold text-slate-300">%</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-50">
          <div className="flex justify-between items-center mb-10 text-slate-400">
             <h3 className="font-black uppercase text-[10px] tracking-widest flex items-center gap-2"><TrendingUp size={16} className="text-blue-500" /> Integrated Telemetry</h3>
             <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest">
                <span className="flex items-center gap-1 text-blue-600"><div className="w-2 h-2 bg-blue-600 rounded-full"></div> HR</span>
                <span className="flex items-center gap-1 text-emerald-500"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> SpO2</span>
             </div>
          </div>
          <div className="h-[320px] w-full min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" hide />
                <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: '900', textTransform: 'uppercase', fontSize: '10px' }} 
                />
                <Line type="monotone" dataKey="hr" stroke="#2563eb" strokeWidth={6} dot={false} animationDuration={1000} />
                <Line type="monotone" dataKey="o2" stroke="#10b981" strokeWidth={6} dot={false} animationDuration={1000} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Clinical Vault Section */}
      <div className="bg-slate-900 p-12 rounded-[4rem] shadow-2xl text-white">
        <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-8">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">Clinical Vault</h2>
            <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mt-1">Diagnostic Artifact Storage</p>
          </div>
          <label className="cursor-pointer flex items-center gap-3 px-8 py-4 bg-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">
            <Upload size={18} /> {uploading ? 'Encrypting...' : 'Add Record'}
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records && records.length > 0 ? (
            records.map((rec) => (
              <div 
                key={rec.id} 
                onClick={() => fetchAnalysis(rec.id)}
                className="p-6 bg-slate-800 rounded-[2.5rem] border border-slate-700 flex items-center gap-4 group hover:border-blue-500 transition-all cursor-pointer"
              >
                <div className="p-4 bg-slate-700 rounded-2xl text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <FileText size={24} />
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-xs uppercase truncate text-white">{rec.fileName}</div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase italic">Secure View</div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-slate-700 font-bold text-[10px] uppercase tracking-widest border-2 border-dashed border-slate-800 rounded-3xl">
              Vault empty - Upload a document to start
            </div>
          )}
        </div>
      </div>

      {/* Analysis Modal Section */}
      {showModal && selectedAnalysis && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-blue-500/30 p-8 rounded-[3rem] max-w-lg w-full shadow-2xl animate-in zoom-in duration-300 text-white">
            <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center gap-2">
              📊 SMART ANALYSIS
            </h2>
            <div className="space-y-4">
              <p className="text-slate-300 text-sm italic">"{selectedAnalysis.summary}"</p>
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Key Findings:</h3>
                <ul className="list-disc list-inside text-sm text-slate-200 space-y-2">
                  {selectedAnalysis.findings.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
              <p className="text-emerald-400 text-xs font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                <ShieldCheck size={16} /> Recommendation: {selectedAnalysis.recommendation}
              </p>
            </div>

        {/* View Original PDF Button */}
<button 
  onClick={() => {
    const recordId = selectedAnalysis.id; // Backend se aayi hui fresh ID
    if (recordId) {
      window.open(`http://localhost:8080/api/patients/record/${recordId}`, '_blank');
    } else {
      alert("Error: Record ID missing in analysis data.");
    }
  }}
  className="mt-8 w-full py-4 bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest"
>
  <Eye size={16} /> View Original Document
</button>

            <button 
              onClick={() => setShowModal(false)}
              className="mt-3 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all uppercase text-[10px] tracking-widest"
            >
              Close Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetail;