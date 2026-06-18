import { useNavigate } from 'react-router-dom';
import { CheckSquare, Plus, UserPlus, Clock, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ALL_ACTIONS = [
  { id: 'project', label: 'New Project', icon: Plus, action: 'project', color: 'bg-[#6366f1]' },
  { id: 'task', label: 'Add Task', icon: CheckSquare, path: '/tasks', color: 'bg-violet-500' },
  { id: 'invite', label: 'Invite Team', icon: UserPlus, action: 'invite', color: 'bg-blue-500' },
  { id: 'time', label: 'Log Time', icon: Clock, path: '/time-tracking', color: 'bg-cyan-500' },
  { id: 'invoice', label: 'Create Invoice', icon: FileText, action: 'invoice', color: 'bg-emerald-500' },
];

export default function QuickActions() {
  const navigate = useNavigate();
  const { setProjectModalOpen, setInviteModalOpen, setInvoiceModalOpen, showQuickAction } = useApp();

  const actions = ALL_ACTIONS.filter((a) => showQuickAction(a.id));
  if (!actions.length) return null;

  function handle(action, path) {
    if (path) {
      navigate(path);
      return;
    }
    if (action === 'project') setProjectModalOpen(true);
    if (action === 'invite') setInviteModalOpen(true);
    if (action === 'invoice') setInvoiceModalOpen(true);
  }

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {actions.map(({ label, icon: Icon, path, action, color }) => (
          <button
            key={label}
            type="button"
            onClick={() => handle(action, path)}
            className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[#e5e7eb] hover:border-[#c7d2fe] hover:bg-[#fafafa] transition-all group"
          >
            <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}>
              <Icon size={16} />
            </div>
            <span className="text-xs font-medium text-gray-700 text-center leading-tight">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
