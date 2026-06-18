import { useState } from 'react';
import Modal from './Modal';
import { useApp } from '../context/AppContext';

export default function NewProjectModal() {
  const { projectModalOpen, setProjectModalOpen, addProject, clients } = useApp();
  const [form, setForm] = useState({
    name: '',
    category: 'Web Development',
    client: clients[0]?.name || '',
    deadline: '',
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.deadline) return;
    addProject(form);
    setProjectModalOpen(false);
    setForm({
      name: '',
      category: 'Web Development',
      client: clients[0]?.name || '',
      deadline: '',
    });
  }

  return (
    <Modal
      open={projectModalOpen}
      onClose={() => setProjectModalOpen(false)}
      title="New Project"
      footer={
        <>
          <button
            type="button"
            onClick={() => setProjectModalOpen(false)}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="project-form"
            className="px-4 py-2 text-sm font-medium text-white bg-[#6366f1] rounded-lg hover:bg-[#4f46e5] transition-colors"
          >
            Create Project
          </button>
        </>
      }
    >
      <form id="project-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
            placeholder="E-Commerce Platform"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] bg-white"
          >
            <option>Web Development</option>
            <option>Mobile Development</option>
            <option>Design</option>
            <option>Consulting</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
          <select
            value={form.client}
            onChange={(e) => setForm({ ...form, client: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] bg-white"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
          <input
            required
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
          />
        </div>
      </form>
    </Modal>
  );
}
