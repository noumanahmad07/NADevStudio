import { useState } from 'react';
import { Plus, Trash2, Pencil, CheckSquare } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/format';
import useDocumentTitle from '../hooks/useDocumentTitle';

const priorityColors = {
  High: 'text-red-600 bg-red-50',
  Medium: 'text-orange-600 bg-orange-50',
  Low: 'text-gray-600 bg-gray-100',
};

export default function TasksPage() {
  useDocumentTitle('Tasks');
  const { scopedTasks, addTask, updateTask, toggleTask, deleteTask, askConfirm, can, user } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('due');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '',
    project: '',
    assignee: user.name,
    priority: 'Medium',
    due: '',
  });

  const filtered = scopedTasks
    .filter((t) => {
      if (filter === 'Active') return !t.done;
      if (filter === 'Completed') return t.done;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const order = { High: 0, Medium: 1, Low: 2 };
        return order[a.priority] - order[b.priority];
      }
      if (sortBy === 'due') return (a.due || '').localeCompare(b.due || '');
      return a.title.localeCompare(b.title);
    });

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editing) {
      updateTask(editing, form);
      setEditing(null);
    } else {
      addTask(form);
    }
    setForm({ title: '', project: '', assignee: 'Alex Turner', priority: 'Medium', due: '' });
    setShowForm(false);
  }

  function startEdit(task) {
    setEditing(task.id);
    setForm({
      title: task.title,
      project: task.project,
      assignee: task.assignee,
      priority: task.priority,
      due: task.due,
    });
    setShowForm(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {['All', 'Active', 'Completed'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                filter === f
                  ? 'bg-[#eef2ff] border-[#c7d2fe] text-[#6366f1] font-medium'
                  : 'border-[#e5e7eb] text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 text-sm border border-[#e5e7eb] rounded-lg bg-white text-gray-600"
          >
            <option value="due">Sort by due date</option>
            <option value="priority">Sort by priority</option>
            <option value="title">Sort by name</option>
          </select>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          disabled={!can('tasks.create')}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#6366f1] rounded-lg hover:bg-[#4f46e5] self-start disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm space-y-4"
        >
          <h3 className="text-sm font-semibold text-gray-900">
            {editing ? 'Edit Task' : 'New Task'}
          </h3>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Task title"
            className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              value={form.project}
              onChange={(e) => setForm({ ...form, project: e.target.value })}
              placeholder="Project"
              className="px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
            />
            <input
              type="date"
              value={form.due}
              onChange={(e) => setForm({ ...form, due: e.target.value })}
              className="px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
            />
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <input
              value={form.assignee}
              onChange={(e) => setForm({ ...form, assignee: e.target.value })}
              placeholder="Assignee"
              className="px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#6366f1] rounded-lg hover:bg-[#4f46e5]"
            >
              {editing ? 'Update Task' : 'Save Task'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="No tasks found"
            description="Create a task to start tracking work across your projects."
            action={
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-[#6366f1] rounded-lg hover:bg-[#4f46e5]"
              >
                Add Task
              </button>
            }
          />
        ) : (
          <div className="divide-y divide-[#e5e7eb]">
            {filtered.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors ${
                  task.done ? 'opacity-60' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  className="w-4 h-4 accent-[#6366f1] rounded shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-medium text-gray-900 ${
                      task.done ? 'line-through' : ''
                    }`}
                  >
                    {task.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {task.project} · {task.assignee}
                    {task.due && ` · Due ${formatDate(task.due)}`}
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${priorityColors[task.priority]}`}
                >
                  {task.priority}
                </span>
                <button
                  type="button"
                  onClick={() => startEdit(task)}
                  disabled={!can('tasks.edit')}
                  className="p-1.5 text-gray-400 hover:text-[#6366f1] hover:bg-[#eef2ff] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Edit task"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    askConfirm({
                      title: 'Delete Task',
                      message: `Delete "${task.title}"?`,
                      confirmLabel: 'Delete',
                      danger: true,
                      onConfirm: () => deleteTask(task.id),
                    })
                  }
                  disabled={!can('tasks.delete')}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Delete task"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
