import { Shield } from 'lucide-react';
import { ROLE_LABELS } from '../config/roles';

export default function RoleBadge({ role, size = 'sm' }) {
  const label = ROLE_LABELS[role] || role;
  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  const colors = {
    admin: 'bg-purple-50 text-purple-700 border-purple-200',
    manager: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    project_manager: 'bg-blue-50 text-blue-700 border-blue-200',
    developer: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    qa: 'bg-orange-50 text-orange-700 border-orange-200',
    graphic_designer: 'bg-pink-50 text-pink-700 border-pink-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border ${sizes[size]} ${colors[role] || 'bg-gray-50 text-gray-700 border-gray-200'}`}
    >
      <Shield size={size === 'sm' ? 10 : 12} />
      {label}
    </span>
  );
}
