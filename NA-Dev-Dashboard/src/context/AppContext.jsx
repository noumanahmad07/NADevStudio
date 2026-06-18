import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  getRoleConfig,
  canPerformAction,
  hasWidget,
  hasStat,
  hasQuickAction,
  filterProjectsForRole,
  filterTasksForRole,
  filterTimeForRole,
  canAccessRoute,
} from '../config/roles';
import {
  initialUser,
  initialNotifications,
  initialProjects,
  initialTasks,
  initialClients,
  initialTeam,
  initialTimeEntries,
  initialInvoices,
  initialActivities,
} from '../data/mockData';
import { buildInitialChat, CHAT_GENERAL_ID } from '../data/chatData';

const STORAGE_KEY = 'na-dev-dashboard-state';
const AppContext = createContext(null);

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AppProvider({ children }) {
  const saved = loadState();

  const [user, setUser] = useState(saved?.user || initialUser);
  const [notifications, setNotifications] = useState(
    saved?.notifications || initialNotifications
  );
  const [projects, setProjects] = useState(saved?.projects || initialProjects);
  const [tasks, setTasks] = useState(saved?.tasks || initialTasks);
  const [clients, setClients] = useState(saved?.clients || initialClients);
  const [team, setTeam] = useState(saved?.team || initialTeam);
  const [timeEntries, setTimeEntries] = useState(
    saved?.timeEntries || initialTimeEntries
  );
  const [invoices, setInvoices] = useState(saved?.invoices || initialInvoices);
  const [activities, setActivities] = useState(
    saved?.activities || initialActivities
  );
  const [settings, setSettings] = useState(
    saved?.settings || {
      emailNotifications: true,
      projectUpdates: true,
      weeklyDigest: false,
      darkMode: false,
      timezone: 'America/New_York',
      companyName: 'NA Dev Studio',
      companyEmail: 'hello@nadevstudio.com',
    }
  );
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatConversations, setChatConversations] = useState(
    saved?.chatConversations || buildInitialChat(initialTeam)
  );
  const [confirm, setConfirm] = useState({
    open: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    danger: false,
    onConfirm: null,
  });

  useEffect(() => {
    const payload = {
      user,
      notifications,
      projects,
      tasks,
      clients,
      team,
      timeEntries,
      invoices,
      activities,
      settings,
      chatConversations,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [
    user,
    notifications,
    projects,
    tasks,
    clients,
    team,
    timeEntries,
    invoices,
    activities,
    settings,
    chatConversations,
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pendingTasks = tasks.filter((t) => !t.done).length;
  const overdueInvoices = invoices.filter((i) => i.status === 'Overdue').length;

  const activeProjects = projects.filter((p) => p.status !== 'Delivered').length;
  const avgDelivery = useMemo(() => {
    const delivered = projects.filter((p) => p.status === 'Delivered');
    if (!delivered.length) return '18d';
    const avg = Math.round(
      delivered.reduce((sum, p) => sum + (100 - p.progress) / 5 + 14, 0) /
        delivered.length
    );
    return `${avg}d`;
  }, [projects]);

  const satisfaction = '98%';

  const role = user.dashboardRole || 'manager';
  const roleConfig = getRoleConfig(role);

  const scopedProjects = useMemo(
    () => filterProjectsForRole(role, projects, user.name),
    [role, projects, user.name]
  );
  const scopedTasks = useMemo(
    () => filterTasksForRole(role, tasks, user.name),
    [role, tasks, user.name]
  );
  const scopedTimeEntries = useMemo(
    () => filterTimeForRole(role, timeEntries, user.name),
    [role, timeEntries, user.name]
  );

  const myTasksCount = scopedTasks.filter((t) => !t.done).length;
  const myHoursLogged = scopedTimeEntries.reduce((s, e) => s + e.hours, 0);

  const scopedPendingTasks = scopedTasks.filter((t) => !t.done).length;
  const scopedActiveProjects = scopedProjects.filter(
    (p) => p.status !== 'Delivered'
  ).length;

  function can(action) {
    return canPerformAction(role, action);
  }

  function canViewRoute(path) {
    return canAccessRoute(role, path);
  }

  function showWidget(widget) {
    return hasWidget(role, widget);
  }

  function showStat(stat) {
    return hasStat(role, stat);
  }

  function showQuickAction(action) {
    return hasQuickAction(role, action);
  }

  function switchRole(demoUser) {
    const member = team.find((m) => m.email === demoUser.email);
    setUser((prev) => ({
      ...prev,
      name: demoUser.name,
      firstName: demoUser.name.split(' ')[0],
      email: demoUser.email,
      role: demoUser.jobTitle,
      dashboardRole: demoUser.role,
      avatar:
        member?.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(demoUser.name)}&background=6366f1&color=fff`,
    }));
    setSidebarOpen(false);
  }

  function getCurrentMemberId() {
    const member = team.find((m) => m.email === user.email);
    return member?.id ?? 1;
  }

  const unreadChatCount = useMemo(() => {
    return Object.values(chatConversations).reduce(
      (sum, conv) => sum + (conv.unread || 0),
      0
    );
  }, [chatConversations]);

  function sendChatMessage(conversationId, text) {
    const memberId = getCurrentMemberId();
    const message = {
      id: Date.now(),
      senderId: memberId,
      senderName: user.name,
      text,
      createdAt: Date.now(),
      read: true,
    };

    setChatConversations((prev) => {
      const existing = prev[conversationId] || { messages: [], unread: 0 };
      return {
        ...prev,
        [conversationId]: {
          messages: [...existing.messages, message],
          unread: 0,
        },
      };
    });
  }

  function markChatRead(conversationId) {
    setChatConversations((prev) => {
      if (!prev[conversationId]) return prev;
      return {
        ...prev,
        [conversationId]: { ...prev[conversationId], unread: 0 },
      };
    });
  }

  function openChat(conversationId) {
    const id = conversationId || CHAT_GENERAL_ID;
    setChatOpen(true);
    setActiveChatId(id);
    markChatRead(id);
  }

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function addActivity(entry) {
    const item = {
      id: Date.now(),
      time: 'Just now',
      ...entry,
    };
    setActivities((prev) => [item, ...prev].slice(0, 20));
  }

  function askConfirm(options) {
    setConfirm({
      open: true,
      title: options.title || 'Are you sure?',
      message: options.message,
      confirmLabel: options.confirmLabel || 'Confirm',
      danger: options.danger || false,
      onConfirm: options.onConfirm,
    });
  }

  function closeConfirm() {
    setConfirm((prev) => ({ ...prev, open: false }));
  }

  function markNotificationRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function markAllNotificationsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  }

  function addProject(project) {
    const newProject = {
      id: Date.now(),
      progress: 0,
      status: 'In Progress',
      statusType: 'warning',
      iconType: 'cart',
      team: [user.avatar],
      extraTeam: 0,
      ...project,
    };
    setProjects((prev) => [newProject, ...prev]);
    addActivity({
      type: 'project',
      user: user.name,
      action: 'created project',
      detail: newProject.name,
      path: '/projects',
    });
    showToast(`Project "${newProject.name}" created`);
    return newProject;
  }

  function updateProject(id, updates) {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Project updated');
  }

  function deleteProject(id) {
    const project = projects.find((p) => p.id === id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    showToast(`"${project?.name}" deleted`, 'info');
  }

  function addTask(task) {
    const newTask = { id: Date.now(), done: false, ...task };
    setTasks((prev) => [newTask, ...prev]);
    addActivity({
      type: 'task',
      user: user.name,
      action: 'created task',
      detail: newTask.title,
      path: '/tasks',
    });
    showToast('Task added');
  }

  function updateTask(id, updates) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    showToast('Task updated');
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task removed', 'info');
  }

  function addClient(client) {
    const newClient = {
      id: Date.now(),
      projects: 0,
      status: 'Prospect',
      phone: '',
      ...client,
    };
    setClients((prev) => [newClient, ...prev]);
    showToast(`Client "${newClient.name}" added`);
  }

  function updateClient(id, updates) {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Client updated');
  }

  function deleteClient(id) {
    const client = clients.find((c) => c.id === id);
    setClients((prev) => prev.filter((c) => c.id !== id));
    showToast(`"${client?.name}" removed`, 'info');
  }

  function inviteTeamMember(member) {
    const newMember = {
      id: Date.now(),
      status: 'Invited',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=6366f1&color=fff`,
      ...member,
    };
    setTeam((prev) => [newMember, ...prev]);
    setInviteModalOpen(false);
    addActivity({
      type: 'team',
      user: user.name,
      action: 'invited',
      detail: member.name,
      path: '/team',
    });
    showToast(`Invitation sent to ${member.email}`);
  }

  function removeTeamMember(id) {
    const member = team.find((m) => m.id === id);
    setTeam((prev) => prev.filter((m) => m.id !== id));
    showToast(`"${member?.name}" removed from team`, 'info');
  }

  function addTimeEntry(entry) {
    const newEntry = { id: Date.now(), loggedBy: user.name, ...entry };
    setTimeEntries((prev) => [newEntry, ...prev]);
    addActivity({
      type: 'time',
      user: user.name,
      action: 'logged',
      detail: `${entry.hours}h on ${entry.project}`,
      path: '/time-tracking',
    });
    showToast('Time entry logged');
  }

  function deleteTimeEntry(id) {
    setTimeEntries((prev) => prev.filter((e) => e.id !== id));
    showToast('Time entry deleted', 'info');
  }

  function addInvoice(invoice) {
    const nextNum = 1046 + invoices.length;
    const newInvoice = {
      id: `INV-${nextNum}`,
      status: 'Pending',
      issued: new Date().toISOString().slice(0, 10),
      ...invoice,
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    setInvoiceModalOpen(false);
    addActivity({
      type: 'invoice',
      user: user.name,
      action: 'created invoice',
      detail: `${newInvoice.id} for ${newInvoice.client}`,
      path: '/invoices',
    });
    showToast(`Invoice ${newInvoice.id} created`);
  }

  function updateInvoiceStatus(id, status) {
    setInvoices((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i))
    );
    showToast(`Invoice marked as ${status}`);
  }

  function deleteInvoice(id) {
    setInvoices((prev) => prev.filter((i) => i.id !== id));
    showToast('Invoice deleted', 'info');
  }

  function updateSettings(updates) {
    setSettings((prev) => ({ ...prev, ...updates }));
    showToast('Settings saved');
  }

  function updateProfile(updates) {
    setUser((prev) => ({ ...prev, ...updates }));
    showToast('Profile updated');
  }

  function logout() {
    showToast('You have been logged out', 'info');
  }

  const value = {
    user,
    role,
    roleConfig,
    notifications,
    projects,
    tasks,
    clients,
    team,
    timeEntries,
    invoices,
    activities,
    settings,
    scopedProjects,
    scopedTasks,
    scopedTimeEntries,
    myTasksCount,
    myHoursLogged,
    toast,
    sidebarOpen,
    inviteModalOpen,
    projectModalOpen,
    invoiceModalOpen,
    confirm,
    chatOpen,
    activeChatId,
    chatConversations,
    unreadChatCount,
    setChatOpen,
    setActiveChatId,
    sendChatMessage,
    markChatRead,
    openChat,
    getCurrentMemberId,
    unreadCount,
    pendingTasks: roleConfig.dataScope === 'all' ? pendingTasks : scopedPendingTasks,
    overdueInvoices: roleConfig.manageInvoices ? overdueInvoices : 0,
    activeProjects: roleConfig.dataScope === 'all' ? activeProjects : scopedActiveProjects,
    avgDelivery,
    satisfaction,
    can,
    canViewRoute,
    showWidget,
    showStat,
    showQuickAction,
    switchRole,
    setSidebarOpen,
    setInviteModalOpen,
    setProjectModalOpen,
    setInvoiceModalOpen,
    showToast,
    askConfirm,
    closeConfirm,
    markNotificationRead,
    markAllNotificationsRead,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    addClient,
    updateClient,
    deleteClient,
    inviteTeamMember,
    removeTeamMember,
    addTimeEntry,
    deleteTimeEntry,
    addInvoice,
    updateInvoiceStatus,
    deleteInvoice,
    updateSettings,
    updateProfile,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
