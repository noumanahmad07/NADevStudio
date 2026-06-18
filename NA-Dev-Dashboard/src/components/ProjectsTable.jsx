import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProjectIcon } from './ProjectIcon';
import { formatDate } from '../utils/format';

function StatusBadge({ status, type }) {
  const styles = {
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-orange-50 text-orange-600 border-orange-200',
  };
  const Icon = type === 'success' ? CheckCircle2 : Clock;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[type]}`}
    >
      <Icon size={12} />
      {status}
    </span>
  );
}

export default function ProjectsTable({
  limit,
  showViewAll = true,
  onProjectClick,
}) {
  const navigate = useNavigate();
  const { scopedProjects, setProjectModalOpen, can } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = scopedProjects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const displayed = limit ? filtered.slice(0, limit) : filtered;

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-[#e5e7eb]">
        <h2 className="text-base font-semibold text-gray-900">Projects</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="pl-9 pr-4 py-2 text-sm border border-[#e5e7eb] rounded-lg w-full sm:w-52 focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] bg-white"
            />
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setFilterOpen((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm border rounded-lg transition-colors ${
                statusFilter !== 'All'
                  ? 'border-[#6366f1] text-[#6366f1] bg-[#eef2ff]'
                  : 'text-gray-600 border-[#e5e7eb] hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal size={15} />
              Filter
              {statusFilter !== 'All' && (
                <span className="text-xs">({statusFilter})</span>
              )}
            </button>
            {filterOpen && (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-10"
                  aria-label="Close filter"
                  onClick={() => setFilterOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#e5e7eb] rounded-lg shadow-lg z-20 py-1">
                  {['All', 'In Progress', 'Delivered'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setStatusFilter(status);
                        setFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                        statusFilter === status
                          ? 'text-[#6366f1] font-medium'
                          : 'text-gray-700'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          {can('projects.create') && (
            <button
              type="button"
              onClick={() => setProjectModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#6366f1] rounded-lg hover:bg-[#4f46e5] transition-colors shadow-sm"
            >
              <Plus size={16} />
              New Project
            </button>
          )}
        </div>
      </div>

      {(search || statusFilter !== 'All') && (
        <div className="px-5 py-2 bg-[#fafafa] border-b border-[#e5e7eb] flex items-center gap-2 flex-wrap text-xs text-gray-500">
          <span>
            Showing {displayed.length} of {scopedProjects.length} projects
          </span>
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-[#e5e7eb] rounded-full hover:bg-gray-50"
            >
              &quot;{search}&quot; <X size={10} />
            </button>
          )}
          {statusFilter !== 'All' && (
            <button
              type="button"
              onClick={() => setStatusFilter('All')}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-[#e5e7eb] rounded-full hover:bg-gray-50"
            >
              {statusFilter} <X size={10} />
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-[#e5e7eb] bg-[#fafafa]">
              {['Project', 'Client', 'Progress', 'Status', 'Deadline', 'Team'].map(
                (col) => (
                  <th
                    key={col}
                    className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3"
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb]">
            {displayed.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-500">
                  No projects match your search.
                </td>
              </tr>
            ) : (
              displayed.map((project) => (
                <tr
                  key={project.id}
                  onClick={() => onProjectClick?.(project) ?? (can('projects.edit') ? navigate('/projects') : null)}
                  className={`hover:bg-gray-50/50 transition-colors ${onProjectClick || can('projects.edit') ? 'cursor-pointer' : ''}`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <ProjectIcon iconType={project.iconType} />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {project.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {project.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700">
                    {project.client}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 min-w-[120px]">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#6366f1] rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600 w-8 shrink-0">
                        {project.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge
                      status={project.status}
                      type={project.statusType}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Calendar size={14} className="text-gray-400 shrink-0" />
                      {formatDate(project.deadline)}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center">
                      {project.team.map((avatar, i) => (
                        <img
                          key={`${project.id}-${avatar}`}
                          src={avatar}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-white -ml-2 first:ml-0"
                          style={{ zIndex: project.team.length - i }}
                        />
                      ))}
                      {project.extraTeam > 0 && (
                        <span className="ml-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center -ml-2 ring-2 ring-white">
                          +{project.extraTeam}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showViewAll && (
        <div className="py-4 text-center border-t border-[#e5e7eb]">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#6366f1] hover:text-[#4f46e5] transition-colors"
          >
            View all projects
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
