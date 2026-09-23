import React, { useState, useEffect } from 'react';
import { FileText, Filter, CheckCircle, AlertTriangle, Upload, Search, Ship, RefreshCw } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

export default function ManifestMuatanPage() {
  const [manifests, setManifests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterShip, setFilterShip] = useState('All');

  const fetchManifests = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/api/manifest');
      if (res.data && res.data.success) {
        setManifests(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch manifests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManifests();
  }, []);

  // Dynamically extract unique ship names from manifest data
  const uniqueShips = Array.from(new Set(manifests.map((m) => m.shipName).filter(Boolean)));

  const filtered = manifests.filter((item) => {
    const matchesSearch =
      (item.passengerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.nik || '').includes(searchQuery) ||
      (item.shipName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
    const matchesShip = filterShip === 'All' || item.shipName === filterShip;
    return matchesSearch && matchesStatus && matchesShip;
  });

  const getShipBadgeColor = (shipName) => {
    if (shipName?.includes('Express Bahari')) return 'bg-sky-100 text-sky-800 border-sky-300';
    if (shipName?.includes('Cantika')) return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    if (shipName?.includes('Dharma')) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    return 'bg-purple-100 text-purple-800 border-purple-300';
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-2">
              <FileText size={14} className="text-sky-200" />
              <span>Manifest Cross-Matching & Auto Sync Engine</span>
            </div>
            <h1 className="text-2xl font-extrabold">Manifest & Muatan Kapal</h1>
            <p className="text-xs text-sky-100 mt-0.5">
              Daftar penumpang manifest resmi pelayaran terintegrasi otomatis dari hasil scan KTP kamera live.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchManifests}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all outline-none"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh Data</span>
            </button>

            <button
              type="button"
              className="px-4 py-2 bg-white text-[#0284C7] hover:bg-sky-50 font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all outline-none"
            >
              <Upload size={16} />
              <span>Unggah Manifest (Excel/CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari Nama Penumpang, NIK KTP, atau Nama Kapal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-[#0284C7]"
            />
          </div>

          {/* Ship Selection Dropdown */}
          <div className="flex items-center gap-2">
            <Ship size={16} className="text-[#0284C7] shrink-0" />
            <select
              value={filterShip}
              onChange={(e) => setFilterShip(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-[#0284C7] focus:bg-white transition-all"
            >
              <option value="All">🚢 Semua Kapal ({uniqueShips.length} Kapal)</option>
              {uniqueShips.map((ship) => (
                <option key={ship} value={ship}>
                  🚢 {ship}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <Filter size={14} className="text-slate-400 mr-1 shrink-0" />
            {['All', 'Valid', 'Mismatch', 'Pending'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 outline-none ${
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

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Nama Penumpang</th>
                <th className="py-3 px-4">NIK KTP</th>
                <th className="py-3 px-4">Kategori Kapal / Rute</th>
                <th className="py-3 px-4">No. Tiket / Kursi</th>
                <th className="py-3 px-4 text-center">Status Matching</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400 font-medium">
                    {loading ? 'Memuat data manifest...' : 'Belum ada data manifest untuk kapal yang dipilih.'}
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-sky-50/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800">{row.passengerName}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-[#0284C7]">{row.nik}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold border mb-0.5 ${getShipBadgeColor(row.shipName)}`}>
                        {row.shipName}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{row.origin || 'Dermaga Kalianget'} → {row.destination || 'Pelabuhan Kangean'}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-600">
                      {row.ticketNumber} ({row.seatNumber || 'N/A'})
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                          row.status === 'Valid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : row.status === 'Mismatch'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {row.status === 'Valid' ? <CheckCircle size={13} /> : <AlertTriangle size={13} />}
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
