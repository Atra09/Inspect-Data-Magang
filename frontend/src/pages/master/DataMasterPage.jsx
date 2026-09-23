import React, { useState, useEffect } from 'react';
import { Database, UserCheck, Ship, Anchor, Plus } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

export default function DataMasterPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get('/api/users');
        if (res.data && res.data.success) {
          setUsers(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-2">
              <Database size={14} className="text-sky-200" />
              <span>KSOP Master Database</span>
            </div>
            <h1 className="text-2xl font-extrabold">Data Master Sistem KSOP</h1>
            <p className="text-xs text-sky-100 mt-0.5">
              Kelola data master Petugas Kesyahbandaran, Armada Kapal Terdaftar, dan Dermaga Pelabuhan.
            </p>
          </div>
        </div>
      </div>

      {/* Master Users Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
            <UserCheck size={18} className="text-[#0284C7]" />
            Daftar Petugas & Pengguna KSOP (Tabel Users MySQL)
          </h3>
          <span className="text-xs font-bold text-[#0284C7] bg-sky-50 px-3 py-1 rounded-full">
            {users.length} Terdaftar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Nama Lengkap</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">NIP</th>
                <th className="py-3 px-4">Role / Hak Akses</th>
                <th className="py-3 px-4">Status Akun</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-sky-50/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-800">{u.name}</td>
                  <td className="py-3 px-4 font-mono text-[#0284C7]">{u.username}</td>
                  <td className="py-3 px-4 text-slate-600">{u.nip || 'NIP -'}</td>
                  <td className="py-3 px-4 font-semibold text-slate-700">{u.role}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Aktif
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
