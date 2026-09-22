import React, { useState } from 'react';
import { Ship, Eye, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function RecentInspectionsTable() {
  const [filterStatus, setFilterStatus] = useState('All');

  const inspectionsData = [
    {
      id: 'SPB-2026-0091',
      vessel: 'KM Mulia Rahayu',
      imo: 'IMO 982143',
      cargo: 'General Cargo',
      agent: 'PT Bahari Nusantara',
      time: '10:45 WIB',
      status: 'Disetujui',
      statusType: 'success',
    },
    {
      id: 'SPB-2026-0090',
      vessel: 'KM Sumber Laut 02',
      imo: 'IMO 974120',
      cargo: 'BBM / Tangker',
      agent: 'PT Pelayaran Mandiri',
      time: '09:15 WIB',
      status: 'Dalam Inspeksi',
      statusType: 'process',
    },
    {
      id: 'SPB-2026-0089',
      vessel: 'KM Nusantara Jaya',
      imo: 'IMO 965411',
      cargo: 'Sembako & Hasil Tani',
      agent: 'CV Samudra Indah',
      time: '08:30 WIB',
      status: 'Pending Audit',
      statusType: 'warning',
    },
    {
      id: 'SPB-2026-0088',
      vessel: 'KM Bintang Bahari',
      imo: 'IMO 951230',
      cargo: 'Kayu Olahan',
      agent: 'PT Lautan Berlian',
      time: 'Kemarin, 16:20',
      status: 'Disetujui',
      statusType: 'success',
    },
  ];

  const filteredData = filterStatus === 'All'
    ? inspectionsData
    : inspectionsData.filter((item) => item.status === filterStatus);

  const getStatusBadge = (type, label) => {
    switch (type) {
      case 'success':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <CheckCircle size={14} className="text-emerald-500" />
            {label}
          </span>
        );
      case 'process':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200/80">
            <Clock size={14} className="text-sky-500 animate-spin" />
            {label}
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
            <AlertCircle size={14} className="text-amber-500" />
            {label}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Ship size={20} className="text-[#0284C7]" />
            Aktivitas Inspeksi & Clearance Terbaru
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar permohonan Surat Persetujuan Berlayar (SPB) KSOP
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter size={14} className="text-slate-400 mr-1 shrink-0" />
          {['All', 'Disetujui', 'Dalam Inspeksi', 'Pending Audit'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 outline-none ${
                filterStatus === status
                  ? 'bg-[#0284C7] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-5">No. Registrasi SPB</th>
              <th className="py-3.5 px-5">Nama Kapal / IMO</th>
              <th className="py-3.5 px-5">Agen / Nahkoda</th>
              <th className="py-3.5 px-5">Kategori Muatan</th>
              <th className="py-3.5 px-5">Waktu Inspeksi</th>
              <th className="py-3.5 px-5 text-center">Status</th>
              <th className="py-3.5 px-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.map((row) => (
              <tr key={row.id} className="hover:bg-[#E0F2FE]/40 transition-colors group">
                <td className="py-3.5 px-5 font-extrabold text-[#0284C7]">
                  {row.id}
                </td>
                <td className="py-3.5 px-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 group-hover:text-[#0284C7] transition-colors">
                      {row.vessel}
                    </span>
                    <span className="text-[10px] text-slate-400">{row.imo}</span>
                  </div>
                </td>
                <td className="py-3.5 px-5 font-medium text-slate-600">
                  {row.agent}
                </td>
                <td className="py-3.5 px-5 font-semibold text-slate-700">
                  {row.cargo}
                </td>
                <td className="py-3.5 px-5 text-slate-500 font-medium">
                  {row.time}
                </td>
                <td className="py-3.5 px-5 text-center">
                  {getStatusBadge(row.statusType, row.status)}
                </td>
                <td className="py-3.5 px-5 text-right">
                  <button
                    type="button"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#0284C7] hover:bg-white border border-transparent hover:border-slate-200 transition-all outline-none"
                    title="Lihat Detail Inspeksi"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
