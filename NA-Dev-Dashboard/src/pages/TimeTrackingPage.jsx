import { useState } from 'react';
import { Plus, Clock, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/format';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function TimeTrackingPage() {
  useDocumentTitle('Time Tracking');
  const { scopedTimeEntries, addTimeEntry, deleteTimeEntry, projects, askConfirm, can, user } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [filterProject, setFilterProject] = useState('All');
  const [form, setForm] = useState({
    project: projects[0]?.name || '',
    task: '',
    hours: '',
    date: new Date().toISOString().slice(0, 10),
  });

  const filtered =
    filterProject === 'All'
      ? scopedTimeEntries
      : scopedTimeEntries.filter((e) => e.project === filterProject);

  const totalHours = filtered.reduce((sum, e) => sum + e.hours, 0);
  const thisWeek = scopedTimeEntries.filter((e) => {
    const d = new Date(e.date);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return d >= weekAgo;
  }).reduce((sum, e) => sum + e.hours, 0);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.task.trim() || !form.hours) return;
    addTimeEntry({ ...form, hours: Number(form.hours) });
    setForm({
      project: projects[0]?.name || '',
      task: '',
      hours: '',
      date: new Date().toISOString().slice(0, 10),
    });
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm">
          <div className="text-sm text-gray-500">Total Hours</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">{totalHours}h</div>
        </div>
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm">
          <div className="text-sm text-gray-500">This Week</div>
          <div className="text-3xl font-bold text-[#6366f1] mt-1">{thisWeek}h</div>
        </div>
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Quick Log</div>
            <div className="text-sm font-medium text-gray-900 mt-1">Add time entry</div>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="p-2.5 rounded-lg bg-[#6366f1] text-white hover:bg-[#4f46e5] transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3"
        >
          <select
            value={form.project}
            onChange={(e) => setForm({ ...form, project: e.target.value })}
            className="px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
          <input
            required
            value={form.task}
            onChange={(e) => setForm({ ...form, task: e.target.value })}
            placeholder="Task description"
            className="px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
          />
          <input
            required
            type="number"
            step="0.5"
            min="0.5"
            value={form.hours}
            onChange={(e) => setForm({ ...form, hours: e.target.value })}
            placeholder="Hours"
            className="px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
          />
          <div className="sm:col-span-4 flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#6366f1] rounded-lg hover:bg-[#4f46e5]">
              Log Time
            </button>
          </div>
        </form>
      )}

      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setFilterProject('All')}
          className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
            filterProject === 'All'
              ? 'bg-[#eef2ff] border-[#c7d2fe] text-[#6366f1] font-medium'
              : 'border-[#e5e7eb] text-gray-600 hover:bg-gray-50'
          }`}
        >
          All Projects
        </button>
        {[...new Set(scopedTimeEntries.map((e) => e.project))].map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setFilterProject(name)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              filterProject === name
                ? 'bg-[#eef2ff] border-[#c7d2fe] text-[#6366f1] font-medium'
                : 'border-[#e5e7eb] text-gray-600 hover:bg-gray-50'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e5e7eb] bg-[#fafafa]">
              {['Date', 'Project', 'Task', 'Hours', ''].map((col) => (
                <th key={col || 'actions'} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb]">
            {filtered.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50/50">
                <td className="px-5 py-4 text-sm text-gray-600">{formatDate(entry.date)}</td>
                <td className="px-5 py-4 text-sm font-medium text-gray-900">{entry.project}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{entry.task}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-[#6366f1]">
                    <Clock size={14} />
                    {entry.hours}h
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() =>
                      askConfirm({
                        title: 'Delete Entry',
                        message: 'Remove this time entry?',
                        confirmLabel: 'Delete',
                        danger: true,
                        onConfirm: () => deleteTimeEntry(entry.id),
                      })
                    }
                    disabled={!can('time.delete')}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
