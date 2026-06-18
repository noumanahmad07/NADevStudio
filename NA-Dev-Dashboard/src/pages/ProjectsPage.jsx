import { useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import ProjectsTable from '../components/ProjectsTable';
import Modal from '../components/Modal';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/format';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function ProjectsPage() {
  useDocumentTitle('Projects');
  const { scopedProjects, updateProject, deleteProject, askConfirm, can } = useApp();
  const [selected, setSelected] = useState(null);
  const [editForm, setEditForm] = useState(null);

  function openEdit(project) {
    setSelected(project);
    setEditForm({
      name: project.name,
      progress: project.progress,
      status: project.status,
      deadline: project.deadline,
      category: project.category,
      client: project.client,
    });
  }

  function handleSave(e) {
    e.preventDefault();
    const statusType = editForm.status === 'Delivered' ? 'success' : 'warning';
    updateProject(selected.id, { ...editForm, statusType });
    setSelected(null);
    setEditForm(null);
  }

  function handleDelete() {
    askConfirm({
      title: 'Delete Project',
      message: `Are you sure you want to delete "${selected.name}"? This action cannot be undone.`,
      confirmLabel: 'Delete',
      danger: true,
      onConfirm: () => {
        deleteProject(selected.id);
        setSelected(null);
      },
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-4 text-sm">
          <span className="text-gray-500">
            Total: <strong className="text-gray-900">{scopedProjects.length}</strong>
          </span>
          <span className="text-gray-500">
            Active: <strong className="text-[#6366f1]">{scopedProjects.filter((p) => p.status !== 'Delivered').length}</strong>
          </span>
          <span className="text-gray-500">
            Delivered: <strong className="text-green-600">{scopedProjects.filter((p) => p.status === 'Delivered').length}</strong>
          </span>
        </div>
      </div>

      <ProjectsTable
        showViewAll={false}
        onProjectClick={can('projects.edit') ? openEdit : undefined}
      />

      <Modal
        open={!!selected}
        onClose={() => {
          setSelected(null);
          setEditForm(null);
        }}
        title="Edit Project"
        footer={
          <>
            <button
              type="button"
              onClick={handleDelete}
              disabled={!can('projects.delete')}
              className="mr-auto flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={14} /> Delete
            </button>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-project-form"
              className="px-4 py-2 text-sm font-medium text-white bg-[#6366f1] rounded-lg hover:bg-[#4f46e5] transition-colors flex items-center gap-1.5"
            >
              <Pencil size={14} /> Save Changes
            </button>
          </>
        }
      >
        {editForm && (
          <form id="edit-project-form" onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                required
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
                >
                  <option>Web Development</option>
                  <option>Mobile Development</option>
                  <option>Design</option>
                  <option>Consulting</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <input
                  value={editForm.client}
                  onChange={(e) => setEditForm({ ...editForm, client: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Progress ({editForm.progress}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={editForm.progress}
                onChange={(e) =>
                  setEditForm({ ...editForm, progress: Number(e.target.value) })
                }
                className="w-full accent-[#6366f1]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
                >
                  <option>In Progress</option>
                  <option>Delivered</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                <input
                  type="date"
                  required
                  value={editForm.deadline}
                  onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
                />
                <p className="text-xs text-gray-400 mt-1">{formatDate(editForm.deadline)}</p>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
