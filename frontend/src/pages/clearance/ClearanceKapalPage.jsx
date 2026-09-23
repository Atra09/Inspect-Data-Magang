import React, { useState, useEffect } from 'react';
import { Ship, CheckCircle, XCircle, Clock, ShieldCheck, FileCheck, ArrowRight } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

export default function ClearanceKapalPage() {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClearanceList = async () => {
    try {
      const res = await axiosInstance.get('/api/inspection');
      if (res.data && res.data.success) {
        setInspections(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch clearance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClearanceList();
  }, []);

  const handleUpdateStatus = async (id, newStatus, newType) => {
    try {
      await axiosInstance.put(`/api/inspection/${id}`, {
        status: newStatus,
        statusType: newType,
      });
      fetchClearanceList();
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#0369A1] p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
            <Ship size={28} className="text-sky-200" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">Persetujuan Berlayar (SPB) Clearance</h1>
            <p className="text-xs text-sky-100 mt-0.5">
              Portal Keputusan Wewenang Syahbandar untuk Penerbitan SPB Kapal Penumpang & Muatan.
            </p>
          </div>
        </div>
      </div>

      {/* Clearance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inspections.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <span className="font-black text-[#0284C7] text-sm">{item.spbNumber}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    item.status === 'Disetujui'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : item.status === 'Dalam Inspeksi'
                      ? 'bg-sky-50 text-sky-700 border border-sky-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-800 text-base mb-1">{item.vessel}</h3>
              <p className="text-xs text-slate-500 mb-3">IMO: {item.imo || 'IMO 9821431'} | Agen: {item.agent}</p>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl mb-4">
                <div>
                  <span className="text-slate-400 block text-[10px]">Waktu Jadwal</span>
                  <span className="font-bold text-slate-700">{item.inspectionTime || '10:00 WIB'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Kategori Muatan</span>
                  <span className="font-bold text-slate-700">{item.cargo || 'General Cargo'}</span>
                </div>
              </div>
            </div>

            {/* Decision Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleUpdateStatus(item.id, 'Disetujui', 'success')}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle size={15} />
                <span>Terbitkan SPB</span>
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(item.id, 'Pending Audit', 'warning')}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Clock size={15} />
                <span>Hold / Audit</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
