import { useState } from 'react';
import Modal from './Modal';
import { useApp } from '../context/AppContext';

export default function InviteTeamModal() {
  const { inviteModalOpen, setInviteModalOpen, inviteTeamMember } = useApp();
  const [form, setForm] = useState({ name: '', email: '', role: 'Developer' });

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    inviteTeamMember(form);
    setForm({ name: '', email: '', role: 'Developer' });
  }

  return (
    <Modal
      open={inviteModalOpen}
      onClose={() => setInviteModalOpen(false)}
      title="Invite Team Member"
      footer={
        <>
          <button
            type="button"
            onClick={() => setInviteModalOpen(false)}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="invite-form"
            className="px-4 py-2 text-sm font-medium text-white bg-[#6366f1] rounded-lg hover:bg-[#4f46e5] transition-colors"
          >
            Send Invite
          </button>
        </>
      }
    >
      <form id="invite-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
            placeholder="Jane Cooper"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
            placeholder="jane@company.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] bg-white"
          >
            <option>Developer</option>
            <option>Designer</option>
            <option>Project Manager</option>
            <option>QA Engineer</option>
          </select>
        </div>
      </form>
    </Modal>
  );
}
