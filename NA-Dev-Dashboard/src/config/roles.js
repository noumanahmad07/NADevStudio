export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  PROJECT_MANAGER: 'project_manager',
  DEVELOPER: 'developer',
  QA: 'qa',
  GRAPHIC_DESIGNER: 'graphic_designer',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.MANAGER]: 'Manager',
  [ROLES.PROJECT_MANAGER]: 'Project Manager',
  [ROLES.DEVELOPER]: 'Developer',
  [ROLES.QA]: 'QA Engineer',
  [ROLES.GRAPHIC_DESIGNER]: 'Graphic Designer',
};

export const ROLE_DESCRIPTIONS = {
  [ROLES.ADMIN]: 'Full access to all features, settings, billing, and team management.',
  [ROLES.MANAGER]: 'Manage projects, clients, team, invoices, and view all reports.',
  [ROLES.PROJECT_MANAGER]: 'Manage projects and tasks, track deadlines and team progress.',
  [ROLES.DEVELOPER]: 'View assigned projects, complete tasks, and log development time.',
  [ROLES.QA]: 'Review projects, manage QA tasks, and log testing time.',
  [ROLES.GRAPHIC_DESIGNER]: 'Work on design tasks, view design projects, and log creative time.',
};

/** Route path → permission key */
export const ROUTE_PERMISSIONS = {
  '/': 'dashboard',
  '/projects': 'projects',
  '/tasks': 'tasks',
  '/clients': 'clients',
  '/team': 'team',
  '/time-tracking': 'time',
  '/reports': 'reports',
  '/invoices': 'invoices',
  '/settings': 'settings',
};

const ALL_ROUTES = Object.keys(ROUTE_PERMISSIONS);

const ROLE_ACCESS = {
  [ROLES.ADMIN]: {
    routes: ALL_ROUTES,
    actions: ['*'],
    widgets: ['stats', 'chart', 'quickActions', 'deadlines', 'tasks', 'activity', 'projectsTable'],
    stats: ['activeProjects', 'avgDelivery', 'satisfaction'],
    quickActions: ['project', 'task', 'invite', 'time', 'invoice'],
    dataScope: 'all',
    inviteTeam: true,
    manageTeam: true,
    manageClients: true,
    manageInvoices: true,
    viewRevenue: true,
    manageCompanySettings: true,
  },
  [ROLES.MANAGER]: {
    routes: ALL_ROUTES.filter((r) => r !== '/settings' || true).concat(), // all except nothing - has settings
    actions: [
      'projects.create', 'projects.edit', 'projects.delete',
      'tasks.create', 'tasks.edit', 'tasks.delete',
      'clients.create', 'clients.edit', 'clients.delete',
      'team.invite', 'team.remove',
      'time.create', 'time.delete',
      'invoices.create', 'invoices.edit', 'invoices.delete',
      'reports.export',
    ],
    widgets: ['stats', 'chart', 'quickActions', 'deadlines', 'tasks', 'activity', 'projectsTable'],
    stats: ['activeProjects', 'avgDelivery', 'satisfaction'],
    quickActions: ['project', 'task', 'invite', 'time', 'invoice'],
    dataScope: 'all',
    inviteTeam: true,
    manageTeam: true,
    manageClients: true,
    manageInvoices: true,
    viewRevenue: true,
    manageCompanySettings: false,
  },
  [ROLES.PROJECT_MANAGER]: {
    routes: ['/', '/projects', '/tasks', '/team', '/time-tracking', '/reports', '/settings'],
    actions: [
      'projects.create', 'projects.edit',
      'tasks.create', 'tasks.edit', 'tasks.delete',
      'time.create', 'time.delete',
      'reports.export',
    ],
    widgets: ['stats', 'chart', 'quickActions', 'deadlines', 'tasks', 'activity', 'projectsTable'],
    stats: ['activeProjects', 'avgDelivery', 'myTasks'],
    quickActions: ['project', 'task', 'time'],
    dataScope: 'all',
    inviteTeam: false,
    manageTeam: false,
    manageClients: false,
    manageInvoices: false,
    viewRevenue: false,
    manageCompanySettings: false,
  },
  [ROLES.DEVELOPER]: {
    routes: ['/', '/projects', '/tasks', '/team', '/time-tracking', '/settings'],
    actions: ['tasks.toggle', 'time.create', 'time.delete'],
    widgets: ['stats', 'quickActions', 'deadlines', 'tasks', 'projectsTable'],
    stats: ['myTasks', 'hoursLogged'],
    quickActions: ['task', 'time'],
    dataScope: 'own',
    inviteTeam: false,
    manageTeam: false,
    manageClients: false,
    manageInvoices: false,
    viewRevenue: false,
    manageCompanySettings: false,
  },
  [ROLES.QA]: {
    routes: ['/', '/projects', '/tasks', '/team', '/time-tracking', '/reports', '/settings'],
    actions: [
      'tasks.create', 'tasks.edit', 'tasks.toggle', 'tasks.delete',
      'time.create', 'time.delete',
      'reports.export',
    ],
    widgets: ['stats', 'quickActions', 'deadlines', 'tasks', 'projectsTable'],
    stats: ['myTasks', 'activeProjects'],
    quickActions: ['task', 'time'],
    dataScope: 'own',
    inviteTeam: false,
    manageTeam: false,
    manageClients: false,
    manageInvoices: false,
    viewRevenue: false,
    manageCompanySettings: false,
  },
  [ROLES.GRAPHIC_DESIGNER]: {
    routes: ['/', '/projects', '/tasks', '/team', '/time-tracking', '/settings'],
    actions: ['tasks.toggle', 'time.create', 'time.delete'],
    widgets: ['stats', 'quickActions', 'deadlines', 'tasks', 'projectsTable'],
    stats: ['myTasks', 'hoursLogged'],
    quickActions: ['task', 'time'],
    dataScope: 'design',
    inviteTeam: false,
    manageTeam: false,
    manageClients: false,
    manageInvoices: false,
    viewRevenue: false,
    manageCompanySettings: false,
  },
};

// Manager routes = all routes
ROLE_ACCESS[ROLES.MANAGER].routes = [...ALL_ROUTES];

export function getRoleConfig(role) {
  return ROLE_ACCESS[role] || ROLE_ACCESS[ROLES.DEVELOPER];
}

export function canAccessRoute(role, path) {
  const config = getRoleConfig(role);
  return config.routes.includes(path);
}

export function canPerformAction(role, action) {
  const config = getRoleConfig(role);
  if (config.actions.includes('*')) return true;
  return config.actions.includes(action);
}

export function hasWidget(role, widget) {
  return getRoleConfig(role).widgets.includes(widget);
}

export function hasStat(role, stat) {
  return getRoleConfig(role).stats.includes(stat);
}

export function hasQuickAction(role, action) {
  return getRoleConfig(role).quickActions.includes(action);
}

export function getDefaultRouteForRole(role) {
  const config = getRoleConfig(role);
  return config.routes[0] || '/';
}

export function filterProjectsForRole(role, projects, userName) {
  const { dataScope } = getRoleConfig(role);
  if (dataScope === 'all') return projects;
  if (dataScope === 'design') {
    return projects.filter(
      (p) => p.category === 'Design' || p.category.toLowerCase().includes('design')
    );
  }
  // own scope — developers/QA see active in-progress projects
  return projects.filter((p) => p.status === 'In Progress');
}

export function filterTasksForRole(role, tasks, userName) {
  const { dataScope } = getRoleConfig(role);
  if (dataScope === 'all') return tasks;
  return tasks.filter((t) => t.assignee === userName);
}

export function filterTimeForRole(role, entries, userName) {
  const { dataScope } = getRoleConfig(role);
  if (dataScope === 'all') return entries;
  return entries.filter((e) => e.loggedBy === userName || !e.loggedBy);
}

export const DEMO_USERS = [
  { role: ROLES.ADMIN, name: 'Jordan Admin', email: 'admin@nadevstudio.com', jobTitle: 'Administrator' },
  { role: ROLES.MANAGER, name: 'Alex Turner', email: 'alex.turner@nadevstudio.com', jobTitle: 'Manager' },
  { role: ROLES.PROJECT_MANAGER, name: 'Sam Rivera', email: 'sam.rivera@nadevstudio.com', jobTitle: 'Project Manager' },
  { role: ROLES.DEVELOPER, name: 'Mike Chen', email: 'mike.chen@nadevstudio.com', jobTitle: 'Full Stack Developer' },
  { role: ROLES.QA, name: 'Lisa Park', email: 'lisa.park@nadevstudio.com', jobTitle: 'QA Engineer' },
  { role: ROLES.GRAPHIC_DESIGNER, name: 'Sarah Kim', email: 'sarah.kim@nadevstudio.com', jobTitle: 'Graphic Designer' },
];
