import { useState } from 'react';
import { Plus, Download, CheckCircle, Trash2 } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/format';
import useDocumentTitle from '../hooks/useDocumentTitle';

const statusStyles = {
  Paid: 'bg-green-50 text-green-700 border-green-200',
  Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Overdue: 'bg-red-50 text-red-700 border-red-200',
};

export default function InvoicesPage() {
  useDocumentTitle('Invoices');
  const {
    invoices,
    setInvoiceModalOpen,
    updateInvoiceStatus,
    deleteInvoice,
    askConfirm,
    showToast,
    roleConfig,
    can,
  } = useApp();
  const [filter, setFilter] = useState('All');

  const filtered =
    filter === 'All' ? invoices : invoices.filter((i) => i.status === filter);

  const totals = {
    Paid: invoices.filter((i) => i.status === 'Paid').reduce((s, i) => s + i.amount, 0),
    Pending: invoices.filter((i) => i.status === 'Pending').reduce((s, i) => s + i.amount, 0),
    Overdue: invoices.filter((i) => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0),
  };

  function downloadInvoice(invoice) {
    const content = `INVOICE ${invoice.id}\nClient: ${invoice.client}\nAmount: ${formatCurrency(invoice.amount)}\nStatus: ${invoice.status}\nDue: ${formatDate(invoice.due)}\nIssued: ${formatDate(invoice.issued)}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${invoice.id}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
          {Object.entries(totals).map(([status, amount]) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`text-left bg-white rounded-xl border p-5 shadow-sm transition-all ${
                filter === status ? 'border-[#6366f1] ring-2 ring-[#6366f1]/20' : 'border-[#e5e7eb] hover:shadow-md'
              }`}
            >
              <div className="text-sm text-gray-500">{status}</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(amount)}</div>
            </button>
          ))}
        </div>
        {roleConfig.manageInvoices && (
          <button
            type="button"
            onClick={() => setInvoiceModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#6366f1] rounded-lg hover:bg-[#4f46e5] self-start"
          >
            <Plus size={16} /> Create Invoice
          </button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {['All', 'Paid', 'Pending', 'Overdue'].map((f) => (
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
            {f === 'All' ? 'All Invoices' : f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Download}
            title="No invoices found"
            description="Create your first invoice to start tracking billing."
            action={
              <button
                type="button"
                onClick={() => setInvoiceModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-[#6366f1] rounded-lg hover:bg-[#4f46e5]"
              >
                Create Invoice
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#fafafa]">
                  {['Invoice', 'Client', 'Amount', 'Status', 'Issued', 'Due Date', 'Actions'].map((col) => (
                    <th key={col} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb]">
                {filtered.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-4 text-sm font-medium text-[#6366f1]">{invoice.id}</td>
                    <td className="px-5 py-4 text-sm text-gray-900">{invoice.client}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyles[invoice.status]}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{formatDate(invoice.issued)}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{formatDate(invoice.due)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => downloadInvoice(invoice)}
                          className="p-1.5 text-gray-400 hover:text-[#6366f1] hover:bg-[#eef2ff] rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download size={14} />
                        </button>
                        {invoice.status !== 'Paid' && can('invoices.edit') && (
                          <button
                            type="button"
                            onClick={() => updateInvoiceStatus(invoice.id, 'Paid')}
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Mark as paid"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}
                        {can('invoices.delete') && (
                          <button
                            type="button"
                            onClick={() =>
                              askConfirm({
                                title: 'Delete Invoice',
                                message: `Delete ${invoice.id}?`,
                                confirmLabel: 'Delete',
                                danger: true,
                                onConfirm: () => deleteInvoice(invoice.id),
                              })
                            }
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
