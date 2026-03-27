import React, { useState, useEffect } from 'react';
import { User, Plus, Trash2, FileText, X } from 'lucide-react';
import api from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Direct Import

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', age: '', bloodGroup: 'O+' });

  const fetchData = async () => {
    try {
      const res = await api.get('/patients');
      setPatients(res.data);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  useEffect(() => { fetchData(); }, []);

  // --- ERROR-FREE PDF GENERATOR ---
  const downloadReport = () => {
    try {
      const doc = new jsPDF();
      
      // Professional Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42); // Slate-900
      doc.text("VITALSYNC CLINICAL REGISTRY", 14, 20);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(`System Report Generated: ${new Date().toLocaleString()}`, 14, 28);
      doc.text(`Authority: Ankit Kumar (Bioinformatics Specialist)`, 14, 34);

      // Horizontal Line
      doc.setDrawColor(226, 232, 240);
      doc.line(14, 38, 196, 38);

      // Data Formatting
      const tableColumn = ["ID", "Patient Name", "Age", "Blood", "Heart Rate (BPM)", "Oxygen (SpO2)"];
      const tableRows = patients.map(p => [
        p.id, 
        p.name, 
        p.age, 
        p.bloodGroup, 
        p.lastHeartRate ? `${p.lastHeartRate.toFixed(1)}` : '0.0', 
        p.lastOxygenLevel ? `${p.lastOxygenLevel.toFixed(1)}%` : '0.0'
      ]);

      // Calling autoTable safely
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 4 },
        columnStyles: {
          4: { fontStyle: 'bold' },
          5: { fontStyle: 'bold', textColor: [37, 99, 235] }
        }
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount} - Confidential Medical Data`, 14, doc.internal.pageSize.height - 10);
      }

      doc.save(`VitalSync_Registry_Report.pdf`);
      console.log("PDF Downloaded Successfully");
    } catch (error) {
      console.error("PDF Error Detail:", error);
      alert("PDF generation failed. Check Console (F12) for technical details.");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/patients', { ...formData, lastHeartRate: 72, lastOxygenLevel: 98 });
      setIsModalOpen(false);
      setFormData({ name: '', age: '', bloodGroup: 'O+' });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanent deletion?")) {
      await api.delete(`/patients/${id}`);
      fetchData();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">Patient Registry</h2>
          <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase mt-1">Data Storage: PostgreSQL</p>
        </div>
        <div className="flex gap-4">
          <button onClick={downloadReport} className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">
            <FileText size={18} /> Export PDF
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
            <Plus size={18} /> New Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map(p => (
          <div key={p.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center group hover:shadow-xl transition-all">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all"><User size={24} /></div>
              <div>
                <div className="font-black text-slate-800 text-lg uppercase tracking-tighter leading-none mb-1">{p.name}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.bloodGroup} • {p.age} YEARS</div>
              </div>
            </div>
            <button onClick={() => handleDelete(p.id)} className="p-3 text-slate-200 hover:text-red-600 transition-all"><Trash2 size={20} /></button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
           <div className="bg-white p-10 rounded-[3rem] w-full max-w-sm shadow-2xl animate-in zoom-in duration-300">
              <h2 className="font-black text-2xl mb-8 uppercase tracking-tighter text-slate-900 border-b pb-4">New Admission</h2>
              <form onSubmit={handleAdd} className="space-y-6">
                <input required className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-sm" placeholder="PATIENT NAME" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})} />
                <div className="grid grid-cols-2 gap-4">
                  <input required type="number" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-sm" placeholder="AGE" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                  <select className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-sm" value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})}>
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-blue-600 transition-all">Commit Record</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full text-slate-400 text-[10px] font-black uppercase mt-4">Close</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;