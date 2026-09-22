import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  totalEntries = 0,
  itemsPerPage = 10,
  className = '',
}) {
  if (totalPages <= 0) return null;

  // Calculate entry range for display
  const startEntry = totalEntries > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endEntry = totalEntries > 0 ? Math.min(currentPage * itemsPerPage, totalEntries) : 0;

  // Helper to generate visible page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 font-medium py-3 ${className}`}>
      {/* Entries Info */}
      <div className="text-slate-500 text-center sm:text-left">
        {totalEntries > 0 ? (
          <span>
            Menampilkan <strong className="text-slate-800 font-bold">{startEntry}</strong>–
            <strong className="text-slate-800 font-bold">{endEntry}</strong> dari{' '}
            <strong className="text-slate-800 font-bold">{totalEntries}</strong> data
          </span>
        ) : (
          <span>Halaman {currentPage} dari {totalPages}</span>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto">
        {/* First Page */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-slate-200 hover:border-[#0284C7] hover:text-[#0284C7] disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all outline-none bg-white cursor-pointer disabled:cursor-not-allowed"
          title="Halaman Pertama"
        >
          <ChevronsLeft size={16} />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-slate-200 hover:border-[#0284C7] hover:text-[#0284C7] disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all outline-none bg-white cursor-pointer disabled:cursor-not-allowed"
          title="Sebelumnya"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-lg font-extrabold transition-all outline-none cursor-pointer flex items-center justify-center ${
                currentPage === page
                  ? 'bg-[#0284C7] text-white shadow-sm shadow-[#0284C7]/30'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-[#0284C7] hover:text-[#0284C7]'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Page */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-slate-200 hover:border-[#0284C7] hover:text-[#0284C7] disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all outline-none bg-white cursor-pointer disabled:cursor-not-allowed"
          title="Berikutnya"
        >
          <ChevronRight size={16} />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-slate-200 hover:border-[#0284C7] hover:text-[#0284C7] disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all outline-none bg-white cursor-pointer disabled:cursor-not-allowed"
          title="Halaman Terakhir"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}
