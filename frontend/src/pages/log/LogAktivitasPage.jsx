import React, { useState, useEffect } from 'react';
import { History, ShieldCheck, User, Clock, Activity } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

export default function LogAktivitasPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axiosInstance.get('/api/logs');
        if (res.data && res.data.success) {
          setLogs(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch audit logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-2">
              <History size={14} className="text-sky-200" />
              <span>KSOP Audit Trail & Legal Evidence</span>
            </div>
            <h1 className="text-2xl font-extrabold">Log Aktivitas & Audit Trail</h1>
            <p className="text-xs text-sky-100 mt-0.5">
              Rekam jejak hukum pemeriksaan gangway, verifikasi NIK, dan keputusan rekomendasi SPB.
            </p>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-extrabold text-slate-800 text-sm mb-6 flex items-center gap-2">
          <Activity size={18} className="text-[#0284C7]" />
          Timeline Aktivitas Sistem Real-Time
        </h3>

        <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
          {logs.map((log) => (
            <div key={log.id} className="relative flex items-start gap-4 pl-8">
              <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-[#0284C7] text-white flex items-center justify-center ring-4 ring-white shadow-sm shrink-0">
                <ShieldCheck size={14} />
              </div>

              <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-slate-800 text-xs">{log.action}</span>
                  <span className="text-[10px] font-semibold text-slate-400">{log.time}</span>
                </div>

                <p className="text-xs text-slate-600 font-medium mb-2">{log.detail}</p>

                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#0284C7]">
                  <User size={12} />
                  <span>{log.user}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
