import { useState } from 'react';
import Modal from './Modal';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/format';

export default function NewInvoiceModal() {
  const { invoiceModalOpen, setInvoiceModalOpen, addInvoice, clients } = useApp();
  const [form, setForm] = useState({
    client: clients[0]?.name || '',
    amount: '',
    due: '',
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.amount || !form.due) return;
    addInvoice({
      client: form.client,
      amount: Number(form.amount),
      due: form.due,
    });
    setInvoiceModalOpen(false);
    setForm({ client: clients[0]?.name || '', amount: '', due: '' });
  }

  return (
    <Modal
      open={invoiceModalOpen}
      onClose={() => setInvoiceModalOpen(false)}
      title="Create Invoice"
      footer={
        <>
          <button
            type="button"
            onClick={() => setInvoiceModalOpen(false)}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="invoice-form"
            className="px-4 py-2 text-sm font-medium text-white bg-[#6366f1] rounded-lg hover:bg-[#4f46e5] transition-colors"
          >
            Create Invoice
          </button>
        </>
      }
    >
      <form id="invoice-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
          <select
            value={form.client}
            onChange={(e) => setForm({ ...form, client: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
          <input
            required
            type="number"
            min="1"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="5000"
            className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
          />
          {form.amount && (
            <p className="text-xs text-gray-400 mt-1">{formatCurrency(Number(form.amount))}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input
            required
            type="date"
            value={form.due}
            onChange={(e) => setForm({ ...form, due: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
          />
        </div>
      </form>
    </Modal>
  );
}
