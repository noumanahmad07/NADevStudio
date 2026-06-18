import { useNavigate } from 'react-router-dom';
import { CheckSquare, Square, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/format';

const priorityColors = {
  High: 'text-red-600',
  Medium: 'text-orange-500',
  Low: 'text-gray-400',
};

export default function RecentTasks() {
  const navigate = useNavigate();
  const { scopedTasks, toggleTask } = useApp();

  const active = scopedTasks.filter((t) => !t.done).slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
        <h2 className="text-sm font-semibold text-gray-900">Recent Tasks</h2>
        <button
          type="button"
          onClick={() => navigate('/tasks')}
          className="text-xs font-medium text-[#6366f1] hover:underline flex items-center gap-0.5"
        >
          View all <ArrowRight size={12} />
        </button>
      </div>
      <div className="divide-y divide-[#e5e7eb]">
        {active.length === 0 ? (
          <p className="px-5 py-8 text-sm text-gray-500 text-center">All tasks completed!</p>
        ) : (
          active.map((task) => (
            <div key={task.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50">
              <button
                type="button"
                onClick={() => toggleTask(task.id)}
                className="shrink-0 text-[#6366f1] hover:opacity-80"
                aria-label="Toggle task"
              >
                {task.done ? <CheckSquare size={18} /> : <Square size={18} />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{task.title}</div>
                <div className="text-xs text-gray-500 truncate">
                  {task.project}
                  {task.due && ` · ${formatDate(task.due)}`}
                </div>
              </div>
              <span className={`text-xs font-medium shrink-0 ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
