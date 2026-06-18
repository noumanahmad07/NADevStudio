import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, Menu, User, Settings, LogOut, CheckCheck, MessageCircle } from 'lucide-react';
import Dropdown, { DropdownItem } from './Dropdown';
import GlobalSearch from './GlobalSearch';
import Breadcrumbs from './Breadcrumbs';
import RoleBadge from './RoleBadge';
import { pageMeta } from '../data/mockData';
import { ROLE_LABELS } from '../config/roles';
import { useApp } from '../context/AppContext';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    unreadCount,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    logout,
    setSidebarOpen,
    openChat,
    unreadChatCount,
  } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const meta = pageMeta[location.pathname] || pageMeta['/'];
  const roleLabel = ROLE_LABELS[user.dashboardRole] || user.role;
  const subtitle = meta.subtitle(user.firstName).replace(
    'your projects',
    user.dashboardRole === 'developer' || user.dashboardRole === 'qa' || user.dashboardRole === 'graphic_designer'
      ? 'your assigned work'
      : 'your projects'
  );
  const isDashboard = location.pathname === '/';

  function handleNotificationClick(n) {
    markNotificationRead(n.id);
    if (n.path) {
      navigate(n.path);
      setNotifOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-[#f9fafb]/95 backdrop-blur-sm border-b border-[#e5e7eb] px-6 lg:px-8 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <button
            type="button"
            className="lg:hidden mt-1 p-2 rounded-lg hover:bg-white border border-transparent hover:border-[#e5e7eb] transition-colors shrink-0"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
          <div className="min-w-0 flex-1">
            {!isDashboard && (
              <Breadcrumbs
                items={[
                  { label: 'Home', href: '/' },
                  { label: meta.title },
                ]}
              />
            )}
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {meta.title}
            </h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <p className="text-sm text-gray-500">{subtitle}</p>
              <RoleBadge role={user.dashboardRole} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <GlobalSearch />

          <button
            type="button"
            onClick={() => openChat()}
            className="relative p-2 rounded-lg hover:bg-white border border-transparent hover:border-[#e5e7eb] transition-colors"
            aria-label="Team chat"
          >
            <MessageCircle size={20} className="text-gray-600" />
            {unreadChatCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadChatCount > 9 ? '9+' : unreadChatCount}
              </span>
            )}
          </button>

          <Dropdown
            open={notifOpen}
            onClose={() => setNotifOpen(false)}
            align="right"
            trigger={
              <button
                type="button"
                onClick={() => {
                  setNotifOpen((v) => !v);
                  setProfileOpen(false);
                }}
                className="relative p-2 rounded-lg hover:bg-white border border-transparent hover:border-[#e5e7eb] transition-colors"
                aria-label="Notifications"
              >
                <Bell size={20} className="text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            }
          >
            <div className="px-4 py-3 border-b border-[#e5e7eb] flex items-center justify-between min-w-[300px]">
              <span className="text-sm font-semibold text-gray-900">Notifications</span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="text-xs text-[#6366f1] hover:underline flex items-center gap-1"
                >
                  <CheckCheck size={12} />
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-sm text-gray-500 text-center">No notifications</p>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => handleNotificationClick(n)}
                    className={`w-full text-left px-4 py-3 border-b border-[#f3f4f6] hover:bg-gray-50 transition-colors ${
                      !n.read ? 'bg-[#eef2ff]/40' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#6366f1] mt-1.5 shrink-0" />
                      )}
                      <div className={!n.read ? '' : 'pl-4'}>
                        <div className="text-sm font-medium text-gray-900">{n.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{n.message}</div>
                        <div className="text-xs text-gray-400 mt-1">{n.time}</div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </Dropdown>

          <Dropdown
            open={profileOpen}
            onClose={() => setProfileOpen(false)}
            align="right"
            trigger={
              <button
                type="button"
                onClick={() => {
                  setProfileOpen((v) => !v);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-3 pl-2 border-l border-[#e5e7eb] hover:opacity-80 transition-opacity"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-semibold text-gray-900 leading-tight">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500">{user.role}</div>
                </div>
                <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
              </button>
            }
          >
            <div className="px-4 py-3 border-b border-[#e5e7eb] min-w-[200px]">
              <div className="text-sm font-semibold text-gray-900">{user.name}</div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
            <DropdownItem
              onClick={() => {
                setProfileOpen(false);
                navigate('/settings');
              }}
            >
              <span className="flex items-center gap-2">
                <User size={14} /> Profile
              </span>
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setProfileOpen(false);
                navigate('/settings');
              }}
            >
              <span className="flex items-center gap-2">
                <Settings size={14} /> Settings
              </span>
            </DropdownItem>
            <DropdownItem
              danger
              onClick={() => {
                setProfileOpen(false);
                logout();
              }}
            >
              <span className="flex items-center gap-2">
                <LogOut size={14} /> Log out
              </span>
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
