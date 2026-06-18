import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  UserCircle,
  Clock,
  BarChart3,
  FileText,
  Settings,
  Sparkles,
  X,
} from 'lucide-react';
import { navItems } from '../data/mockData';
import { useApp } from '../context/AppContext';

const iconMap = {
  Dashboard: LayoutDashboard,
  Projects: FolderKanban,
  Tasks: CheckSquare,
  Clients: Users,
  Team: UserCircle,
  'Time Tracking': Clock,
  Reports: BarChart3,
  Invoices: FileText,
  Settings: Settings,
};

const badgeMap = {
  Tasks: 'pendingTasks',
  Invoices: 'overdueInvoices',
};

export default function Sidebar() {
  const {
    sidebarOpen,
    setSidebarOpen,
    setInviteModalOpen,
    pendingTasks,
    overdueInvoices,
    canViewRoute,
    roleConfig,
  } = useApp();

  const badges = { pendingTasks, overdueInvoices };
  const visibleNav = navItems.filter((item) => canViewRoute(item.path));

  return (
    <aside
      className={`fixed lg:sticky top-0 z-50 lg:z-auto w-[260px] shrink-0 flex flex-col border-r border-[#e5e7eb] bg-white h-screen transition-transform duration-200 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center p-1.5 shadow-sm">
            <img
              src="/images/logo.png"
              alt="NA Dev Studio"
              className="w-full h-full object-contain brightness-0 invert"
            />
          </div>
          <div>
            <div className="font-semibold text-[15px] text-gray-900 leading-tight">
              NA Dev Studio
            </div>
            <div className="text-xs text-gray-500">Software Solutions</div>
          </div>
        </NavLink>
        <button
          type="button"
          className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {visibleNav.map(({ label, path }) => {
          const Icon = iconMap[label];
          const badgeKey = badgeMap[label];
          const badgeCount = badgeKey ? badges[badgeKey] : 0;

          return (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#eef2ff] text-[#6366f1]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.25 : 1.75}
                    className={isActive ? 'text-[#6366f1]' : 'text-gray-400'}
                  />
                  <span className="flex-1">{label}</span>
                  {badgeCount > 0 && (
                    <span className="min-w-[20px] h-5 px-1.5 bg-[#6366f1] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {badgeCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {roleConfig.inviteTeam && (
        <div className="p-4 m-3 mb-5 rounded-xl border border-[#e5e7eb] bg-[#fafafa]">
          <div className="flex items-start gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#eef2ff] flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-[#6366f1]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 leading-snug">
                Streamline your workflow
              </div>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Invite your team and start collaborating effectively
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setInviteModalOpen(true);
              setSidebarOpen(false);
            }}
            className="w-full mt-3 py-2 px-4 text-sm font-medium text-[#6366f1] bg-white border border-[#c7d2fe] rounded-lg hover:bg-[#eef2ff] transition-colors"
          >
            Invite Team
          </button>
        </div>
      )}
    </aside>
  );
}
