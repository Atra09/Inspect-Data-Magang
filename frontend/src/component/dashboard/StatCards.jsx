import React, { useState, useEffect } from 'react';
import { Ship, CheckCircle2, AlertTriangle, Anchor, ArrowUpRight } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

export default function StatCards() {
  const [statsData, setStatsData] = useState({
    totalClearance: 0,
    inInspection: 0,
    pendingAudit: 0,
    mismatchManifests: 0,
    passRate: '0%',
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/api/stats');
        if (response.data && response.data.success) {
          setStatsData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats from MySQL:', error);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    {
      title: 'Total Clearance Disetujui',
      value: statsData.totalClearance || '0',
      unit: 'Kapal terverifikasi',
      change: 'Clearance Resmi',
      isPositive: true,
      icon: Ship,
      iconBg: 'bg-[#0284C7]/10 text-[#0284C7]',
      borderColor: 'border-[#0284C7]/20',
    },
    {
      title: 'Kapal Dalam Inspeksi',
      value: statsData.inInspection || '0',
      unit: 'Status Gangway',
      change: 'Proses Boarding',
      isPositive: true,
      icon: Anchor,
      iconBg: 'bg-sky-500/10 text-sky-600',
      borderColor: 'border-sky-200',
    },
    {
      title: 'Tingkat Kelolosan Audit',
      value: statsData.passRate || '100%',
      unit: 'Verifikasi KTP & NIK',
      change: `${statsData.totalClearance || 0} SPB Disetujui`,
      isPositive: true,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-500/10 text-emerald-600',
      borderColor: 'border-emerald-200',
    },
    {
      title: 'Flag Alert / Mismatch',
      value: statsData.pendingAudit + (statsData.mismatchManifests || 0),
      unit: 'Perlu Verifikasi Syahbandar',
      change: 'Audit Lapangan',
      isPositive: false,
      icon: AlertTriangle,
      iconBg: 'bg-amber-500/10 text-amber-600',
      borderColor: 'border-amber-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`bg-white rounded-2xl p-5 border ${stat.borderColor} shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 flex flex-col justify-between group`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500">{stat.title}</span>
              <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
                <Icon size={20} />
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[11px] font-medium text-slate-400">{stat.unit}</span>
              </div>

              <div className="mt-2 flex items-center gap-1">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5 ${
                    stat.isPositive
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  {stat.change}
                  {stat.isPositive && <ArrowUpRight size={12} />}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
