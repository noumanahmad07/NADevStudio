import { useState, useRef } from 'react';
import { MoreVertical, ChevronDown, Download, RefreshCw } from 'lucide-react';
import { chartPeriods } from '../data/mockData';
import { useApp } from '../context/AppContext';
import useClickOutside from '../hooks/useClickOutside';

export default function ProjectChart() {
  const { showToast } = useApp();
  const [period, setPeriod] = useState('Last 6 months');
  const [periodOpen, setPeriodOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const periodRef = useRef(null);
  const menuRef = useRef(null);

  useClickOutside(periodRef, () => setPeriodOpen(false));
  useClickOutside(menuRef, () => setMenuOpen(false));

  const chartData = chartPeriods[period];
  const maxValue = Math.max(...chartData.map((d) => d.value), 10);
  const yMax = Math.ceil(maxValue / 10) * 10;
  const yLabels = [yMax, Math.round(yMax * 0.66), Math.round(yMax * 0.33), 0];

  function exportChart() {
    const csv = ['Month,Completions', ...chartData.map((d) => `${d.month},${d.value}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-completions.csv';
    a.click();
    URL.revokeObjectURL(url);
    setMenuOpen(false);
    showToast('Chart data exported');
  }

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h2 className="text-base font-semibold text-gray-900">
          Project completions — {period.toLowerCase()}
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative" ref={periodRef}>
            <button
              type="button"
              onClick={() => setPeriodOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-[#e5e7eb] rounded-lg hover:bg-gray-50 transition-colors"
            >
              {period}
              <ChevronDown size={14} className={`transition-transform ${periodOpen ? 'rotate-180' : ''}`} />
            </button>
            {periodOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#e5e7eb] rounded-lg shadow-lg z-10 py-1">
                {Object.keys(chartPeriods).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setPeriod(key);
                      setPeriodOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                      period === key ? 'text-[#6366f1] font-medium' : 'text-gray-700'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 transition-colors"
              aria-label="More options"
            >
              <MoreVertical size={18} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#e5e7eb] rounded-lg shadow-lg z-10 py-1">
                <button
                  type="button"
                  onClick={exportChart}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Download size={14} /> Export CSV
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    showToast('Chart refreshed');
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col justify-between text-xs text-gray-400 py-1 h-[220px] shrink-0 w-6">
          {yLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          <div className="relative h-[220px] border-l border-b border-[#e5e7eb]">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="border-t border-[#f3f4f6] w-full" />
              ))}
            </div>

            <div className="absolute inset-0 flex items-end justify-around gap-2 sm:gap-3 px-2 pb-0">
              {chartData.map(({ month, value }) => {
                const heightPct = (value / yMax) * 100;
                return (
                  <div
                    key={month}
                    className="flex flex-col items-center flex-1 max-w-[80px] h-full justify-end group"
                  >
                    <span className="text-xs font-semibold text-gray-700 mb-2">
                      {value}
                    </span>
                    <div
                      title={`${month}: ${value} completions`}
                      className="w-full max-w-[48px] rounded-t-md bg-[#6366f1] hover:bg-[#4f46e5] transition-all cursor-pointer"
                      style={{ height: `${heightPct}%`, minHeight: '8px' }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-around gap-2 sm:gap-3 mt-3 px-2">
            {chartData.map(({ month }) => (
              <span
                key={month}
                className="text-xs text-gray-500 text-center flex-1 max-w-[80px] truncate"
              >
                {month}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
