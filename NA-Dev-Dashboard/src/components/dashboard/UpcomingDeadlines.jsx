import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/format';
import { ProjectIcon } from '../ProjectIcon';

export default function UpcomingDeadlines() {
  const navigate = useNavigate();
  const { scopedProjects } = useApp();

  const upcoming = [...scopedProjects]
    .filter((p) => p.status !== 'Delivered')
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 4);

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
        <h2 className="text-sm font-semibold text-gray-900">Upcoming Deadlines</h2>
        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="text-xs font-medium text-[#6366f1] hover:underline flex items-center gap-0.5"
        >
          View all <ArrowRight size={12} />
        </button>
      </div>
      <div className="divide-y divide-[#e5e7eb]">
        {upcoming.map((project) => (
          <button
            key={project.id}
            type="button"
            onClick={() => navigate('/projects')}
            className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors text-left"
          >
            <ProjectIcon iconType={project.iconType} size={16} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{project.name}</div>
              <div className="text-xs text-gray-500">{project.client}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Calendar size={12} className="text-gray-400" />
                {formatDate(project.deadline)}
              </div>
              <div className="text-xs font-medium text-[#6366f1] mt-0.5">{project.progress}%</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
