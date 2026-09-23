import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SidebarProvider, useSidebar } from '../../context/SidebarContext';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import Backdrop from './Backdrop';
import { X } from 'lucide-react';

const FloatingScanButton = () => {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-50">
      <div className="relative group">
        {/* Main Floating Camera Scan Button */}
        <button
          type="button"
          onClick={() => navigate('/inspeksi')}
          className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] text-white shadow-[0_10px_25px_rgba(2,132,199,0.45)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-2 border-white/90 cursor-pointer outline-none relative overflow-hidden"
          title="Buka Scan Kamera Inspeksi"
        >
          {/* Subtle background glow element */}
          <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors" />

          {/* Custom scan.svg icon */}
          <img
            src="/scan.svg"
            alt="Scan Icon"
            className="w-7 h-7 filter brightness-0 invert group-hover:scale-110 transition-transform relative z-10"
          />
        </button>

        {/* Dismiss Button X */}
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 hover:bg-rose-500 text-white flex items-center justify-center transition-colors shadow-md outline-none cursor-pointer z-20"
          title="Tutup Tombol Scan"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

const LayoutContent = () => {
  const { isExpanded } = useSidebar();

  return (
    <div className="min-h-screen bg-[#F0F9FF] font-sans antialiased text-slate-800 relative">
      <AppSidebar />
      <Backdrop />

      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isExpanded ? 'lg:ml-[260px]' : 'lg:ml-[80px]'
        }`}
      >
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-screen-2xl w-full mx-auto pb-28">
          <Outlet />
        </main>
      </div>

      {/* Floating Scan Camera Button on Bottom Right */}
      <FloatingScanButton />
    </div>
  );
};

export default function AppLayout() {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
}
