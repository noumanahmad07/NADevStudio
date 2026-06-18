import { useState } from 'react';
import { Plus, Mail, Building2, Phone, Pencil, Trash2 } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

const statusStyles = {
  Active: 'bg-green-50 text-green-700 border-green-200',
  Prospect: 'bg-blue-50 text-blue-700 border-blue-200',
};

const emptyForm = { name: '', contact: '', email: '', phone: '', status: 'Prospect' };

export default function ClientsPage() {
  useDocumentTitle('Clients');
  const { clients, addClient, updateClient, deleteClient, askConfirm, roleConfig } = useApp();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.contact.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editing) {
      updateClient(editing, form);
      setEditing(null);
    } else {
      addClient(form);
    }
    setForm(emptyForm);
    setShowForm(false);
  }

  function startEdit(client) {
    setEditing(client.id);
    setForm({
      name: client.name,
      contact: client.contact,
      email: client.email,
      phone: client.phone || '',
      status: client.status,
    });
    setShowForm(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients..."
          className="px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
        />
        {roleConfig.manageClients && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm(emptyForm);
              setShowForm(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#6366f1] rounded-lg hover:bg-[#4f46e5] self-start"
          >
            <Plus size={16} /> Add Client
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm space-y-4"
        >
          <h3 className="text-sm font-semibold text-gray-900">
            {editing ? 'Edit Client' : 'New Client'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Company name"
              className="px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
            />
            <input
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              placeholder="Contact person"
              className="px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className="px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
            />
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone"
              className="px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg bg-white sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
            >
              <option>Prospect</option>
              <option>Active</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#6366f1] rounded-lg hover:bg-[#4f46e5]">
              {editing ? 'Update Client' : 'Save Client'}
            </button>
          </div>
        </form>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No clients found"
          description="Add your first client to start managing relationships."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#eef2ff] flex items-center justify-center">
                    <Building2 size={18} className="text-[#6366f1]" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{client.name}</div>
                    <div className="text-sm text-gray-500">{client.contact}</div>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyles[client.status]}`}>
                  {client.status}
                </span>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <a href={`mailto:${client.email}`} className="flex items-center gap-2 text-gray-500 hover:text-[#6366f1] transition-colors">
                  <Mail size={14} /> {client.email}
                </a>
                {client.phone && (
                  <a href={`tel:${client.phone}`} className="flex items-center gap-2 text-gray-500 hover:text-[#6366f1] transition-colors">
                    <Phone size={14} /> {client.phone}
                  </a>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-[#f3f4f6] flex items-center justify-between">
                <span className="text-xs text-gray-400">{client.projects} projects</span>
                <div className="flex gap-1">
                  {roleConfig.manageClients && (
                    <>
                      <button
                        type="button"
                        onClick={() => startEdit(client)}
                        className="p-1.5 text-gray-400 hover:text-[#6366f1] hover:bg-[#eef2ff] rounded-lg transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          askConfirm({
                            title: 'Remove Client',
                            message: `Remove "${client.name}" from your client list?`,
                            confirmLabel: 'Remove',
                            danger: true,
                            onConfirm: () => deleteClient(client.id),
                          })
                        }
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
