import { useState } from 'react';
import { Download } from 'lucide-react';
import ProjectChart from '../components/ProjectChart';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/format';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function ReportsPage() {
  useDocumentTitle('Reports');
  const { projects, invoices, tasks, scopedTimeEntries, showToast, roleConfig } = useApp();
  const [reportType, setReportType] = useState('overview');

  const delivered = projects.filter((p) => p.status === 'Delivered').length;
  const inProgress = projects.filter((p) => p.status === 'In Progress').length;
  const totalRevenue = invoices
    .filter((i) => i.status === 'Paid')
    .reduce((sum, i) => sum + i.amount, 0);
  const pendingRevenue = invoices
    .filter((i) => i.status !== 'Paid')
    .reduce((sum, i) => sum + i.amount, 0);
  const completedTasks = tasks.filter((t) => t.done).length;
  const totalHours = scopedTimeEntries.reduce((sum, e) => sum + e.hours, 0);

  function exportReport() {
    const data = {
      generated: new Date().toISOString(),
      projects: projects.length,
      delivered,
      inProgress,
      revenue: totalRevenue,
      pendingRevenue,
      tasksCompleted: completedTasks,
      hoursLogged: totalHours,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'na-dev-studio-report.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Report exported');
  }

  const reportTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'projects', label: 'Projects' },
    ...(roleConfig.viewRevenue ? [{ id: 'revenue', label: 'Revenue' }] : []),
    { id: 'team', label: 'Team Performance' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 flex-wrap">
          {reportTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setReportType(tab.id)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                reportType === tab.id
                  ? 'bg-[#eef2ff] border-[#c7d2fe] text-[#6366f1] font-medium'
                  : 'border-[#e5e7eb] text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={exportReport}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 border border-[#e5e7eb] rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download size={16} /> Export Report
        </button>
      </div>

      {reportType === 'overview' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Delivered', value: delivered, color: 'text-green-600' },
              { label: 'In Progress', value: inProgress, color: 'text-[#6366f1]' },
              { label: 'Tasks Done', value: `${completedTasks}/${tasks.length}`, color: 'text-gray-900' },
              { label: 'Hours Logged', value: `${totalHours}h`, color: 'text-gray-900' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm">
                <div className="text-sm text-gray-500">{item.label}</div>
                <div className={`text-2xl font-bold mt-1 ${item.color}`}>{item.value}</div>
              </div>
            ))}
          </div>
          <ProjectChart />
        </>
      )}

      {reportType === 'projects' && (
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-[#fafafa]">
                {['Project', 'Client', 'Category', 'Progress', 'Status', 'Deadline'].map((col) => (
                  <th key={col} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{p.name}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{p.client}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{p.category}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{p.progress}%</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{p.status}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{p.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {reportType === 'revenue' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
              <div className="text-sm text-gray-500">Total Revenue (Paid)</div>
              <div className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(totalRevenue)}</div>
            </div>
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
              <div className="text-sm text-gray-500">Pending Revenue</div>
              <div className="text-3xl font-bold text-orange-500 mt-2">{formatCurrency(pendingRevenue)}</div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#fafafa]">
                  {['Invoice', 'Client', 'Amount', 'Status'].map((col) => (
                    <th key={col} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb]">
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="px-5 py-4 text-sm font-medium text-[#6366f1]">{inv.id}</td>
                    <td className="px-5 py-4 text-sm text-gray-900">{inv.client}</td>
                    <td className="px-5 py-4 text-sm font-medium">{formatCurrency(inv.amount)}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{inv.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'team' && (
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Hours by Project</h3>
          <div className="space-y-3">
            {[...new Set(scopedTimeEntries.map((e) => e.project))].map((project) => {
              const hours = scopedTimeEntries
                .filter((e) => e.project === project)
                .reduce((s, e) => s + e.hours, 0);
              const pct = totalHours ? (hours / totalHours) * 100 : 0;
              return (
                <div key={project}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{project}</span>
                    <span className="font-medium text-gray-900">{hours}h</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#6366f1] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
