import { useState, useRef } from 'react';
import { Info } from 'lucide-react';
import { statDescriptions } from '../data/mockData';
import useClickOutside from '../hooks/useClickOutside';

export default function StatCard({ label, value, trend, trendUp, icon: Icon }) {
  const [showInfo, setShowInfo] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setShowInfo(false));

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm relative">
      <div className="absolute top-4 right-4" ref={ref}>
        <button
          type="button"
          onClick={() => setShowInfo((v) => !v)}
          className="text-gray-300 hover:text-gray-400 transition-colors"
          aria-label={`More info about ${label}`}
          aria-expanded={showInfo}
        >
          <Info size={16} />
        </button>
        {showInfo && (
          <div className="absolute right-0 top-full mt-2 w-56 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10 leading-relaxed">
            {statDescriptions[label]}
          </div>
        )}
      </div>

      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#eef2ff] flex items-center justify-center shrink-0">
          <Icon size={20} className="text-[#6366f1]" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 pt-0.5">
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1 tracking-tight">
            {value}
          </p>
          <p
            className={`text-xs font-medium mt-2 ${
              trendUp ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {trend}
          </p>
        </div>
      </div>
    </div>
  );
}
