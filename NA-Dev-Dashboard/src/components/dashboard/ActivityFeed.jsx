import { useNavigate } from 'react-router-dom';
import {
  FolderCheck,
  CheckSquare,
  DollarSign,
  Users,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const typeConfig = {
  project: { icon: FolderCheck, color: 'bg-green-50 text-green-600' },
  task: { icon: CheckSquare, color: 'bg-blue-50 text-blue-600' },
  invoice: { icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
  team: { icon: Users, color: 'bg-violet-50 text-violet-600' },
  time: { icon: Clock, color: 'bg-orange-50 text-orange-600' },
};

export default function ActivityFeed() {
  const navigate = useNavigate();
  const { activities } = useApp();

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#e5e7eb]">
        <h2 className="text-sm font-semibold text-gray-900">Recent Activity</h2>
      </div>
      <div className="divide-y divide-[#e5e7eb] max-h-[320px] overflow-y-auto">
        {activities.map((item) => {
          const config = typeConfig[item.type] || typeConfig.project;
          const Icon = config.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => item.path && navigate(item.path)}
              className="w-full flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors text-left"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>
                <Icon size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm text-gray-900">
                  <span className="font-medium">{item.user}</span>{' '}
                  <span className="text-gray-600">{item.action}</span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5 truncate">{item.detail}</div>
              </div>
              <span className="text-xs text-gray-400 shrink-0">{item.time}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
