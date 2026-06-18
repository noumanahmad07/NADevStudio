import { useRef } from 'react';
import useClickOutside from '../hooks/useClickOutside';

export default function Dropdown({ open, onClose, trigger, children, align = 'right', className = '' }) {
  const ref = useRef(null);
  useClickOutside(ref, () => {
    if (open) onClose();
  });

  return (
    <div className={`relative ${className}`} ref={ref}>
      {trigger}
      {open && (
        <div
          className={`absolute top-full mt-2 min-w-[220px] bg-white border border-[#e5e7eb] rounded-xl shadow-lg z-50 py-1 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ children, onClick, danger = false, disabled = false }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full text-left px-4 py-2.5 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        danger
          ? 'text-red-600 hover:bg-red-50'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  );
}
