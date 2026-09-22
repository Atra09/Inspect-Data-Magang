import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  QrCode, 
  Ship, 
  FileText, 
  Database, 
  History, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';

export default function AppSidebar() {
  const { isExpanded, setIsExpanded, isMobileOpen, setIsMobileOpen } = useSidebar();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Scan KTP', path: '/inspeksi', icon: QrCode, badge: 'Live' },
    { name: 'Clearance Kapal', path: '/clearance', icon: Ship },
    { name: 'Manifest & Muatan', path: '/manifest', icon: FileText },
    { name: 'Data Master', path: '/master', icon: Database },
    { name: 'Log Aktivitas', path: '/log-aktivitas', icon: History },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-screen bg-white border-r border-slate-200/80 shadow-[2px_0_12px_rgba(0,0,0,0.03)] transition-all duration-300 ease-in-out flex flex-col ${
        isExpanded ? 'w-[260px]' : 'w-[80px]'
      } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
    >
      {/* 1. Header & Brand Logo */}
      <div className={`h-16 border-b border-slate-100 flex items-center ${isExpanded ? 'px-4 justify-between' : 'px-0 justify-center'}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0284C7] to-[#0EA5E9] p-0.5 shadow-md shadow-[#0284C7]/20 shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1">
              <img
                src="/kementrianperhubungan.png"
                alt="Logo Kemenhub"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          {isExpanded && (
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-slate-800 text-sm tracking-tight truncate">
                KSOP INSPEKSI
              </span>
              <span className="text-[11px] font-semibold text-[#0284C7] tracking-wider uppercase truncate">
                Kemenhub RI
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Floating Collapse Button for Desktop (Vertically Centered on Right Edge) */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="hidden lg:flex absolute top-1/2 -right-3.5 -translate-y-1/2 z-50 w-7 h-7 rounded-full bg-white border border-slate-200 hover:border-[#0284C7] text-slate-500 hover:text-[#0284C7] shadow-md items-center justify-center transition-transform hover:scale-110 cursor-pointer outline-none"
        title={isExpanded ? 'Kecilkan Sidebar' : 'Buka Sidebar'}
      >
        {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* 2. Navigation Items */}
      <div className={`flex-1 py-4 overflow-y-auto space-y-1.5 ${isExpanded ? 'px-3' : 'px-2 flex flex-col items-center'}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              title={!isExpanded ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center font-medium text-sm transition-all group relative ${
                  isExpanded ? 'w-full gap-3 px-3 py-2.5 rounded-xl justify-start' : 'w-11 h-11 p-0 rounded-xl justify-center shrink-0'
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] text-white shadow-md shadow-[#0284C7]/25 font-semibold'
                    : 'text-slate-600 hover:bg-[#E0F2FE]/70 hover:text-[#0284C7]'
                }`
              }
            >
              <Icon size={20} className="shrink-0 transition-transform group-hover:scale-110" />
              {isExpanded && (
                <span className="truncate flex-1">{item.name}</span>
              )}
              {isExpanded && item.badge && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#E91E63] text-white shadow-sm">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
   </aside>
  );
}
