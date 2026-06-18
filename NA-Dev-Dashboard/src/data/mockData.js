export const chartPeriods = {
  'Last 3 months': [
    { month: 'Mar 2025', value: 22 },
    { month: 'Apr 2025', value: 20 },
    { month: 'May 2025', value: 25 },
  ],
  'Last 6 months': [
    { month: 'Dec 2024', value: 12 },
    { month: 'Jan 2025', value: 18 },
    { month: 'Feb 2025', value: 15 },
    { month: 'Mar 2025', value: 22 },
    { month: 'Apr 2025', value: 20 },
    { month: 'May 2025', value: 25 },
  ],
  'Last 12 months': [
    { month: 'Jun 2024', value: 8 },
    { month: 'Jul 2024', value: 10 },
    { month: 'Aug 2024', value: 14 },
    { month: 'Sep 2024', value: 11 },
    { month: 'Oct 2024', value: 16 },
    { month: 'Nov 2024', value: 13 },
    { month: 'Dec 2024', value: 12 },
    { month: 'Jan 2025', value: 18 },
    { month: 'Feb 2025', value: 15 },
    { month: 'Mar 2025', value: 22 },
    { month: 'Apr 2025', value: 20 },
    { month: 'May 2025', value: 25 },
  ],
};

export const statDescriptions = {
  'Active Projects': 'Total number of projects currently in progress across all clients.',
  'Avg Delivery': 'Average number of days from project kickoff to delivery.',
  Satisfaction: 'Client satisfaction score based on post-project surveys.',
};

export const initialUser = {
  name: 'Alex Turner',
  firstName: 'Alex',
  role: 'Manager',
  dashboardRole: 'manager',
  email: 'alex.turner@nadevstudio.com',
  avatar:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
};

export const initialNotifications = [
  {
    id: 1,
    title: 'Project delivered',
    message: 'E-Commerce Platform was marked as delivered.',
    time: '2 hours ago',
    read: false,
    path: '/projects',
  },
  {
    id: 2,
    title: 'New task assigned',
    message: 'You were assigned "API integration review".',
    time: '5 hours ago',
    read: false,
    path: '/tasks',
  },
  {
    id: 3,
    title: 'Invoice paid',
    message: 'ShopMart Inc. paid invoice #INV-1042.',
    time: '1 day ago',
    read: false,
    path: '/invoices',
  },
  {
    id: 4,
    title: 'Team update',
    message: 'Sarah joined the Mobile App MVP project.',
    time: '2 days ago',
    read: true,
    path: '/team',
  },
];

export const initialActivities = [
  { id: 1, type: 'project', user: 'Mike Chen', action: 'completed', detail: 'E-Commerce Platform deployment', time: '2h ago', path: '/projects' },
  { id: 2, type: 'task', user: 'Alex Turner', action: 'assigned task', detail: 'API integration review', time: '5h ago', path: '/tasks' },
  { id: 3, type: 'invoice', user: 'System', action: 'recorded payment', detail: 'INV-1042 from ShopMart Inc.', time: '1d ago', path: '/invoices' },
  { id: 4, type: 'team', user: 'Sarah Kim', action: 'joined project', detail: 'Mobile App MVP', time: '2d ago', path: '/team' },
  { id: 5, type: 'time', user: 'Alex Turner', action: 'logged', detail: '3.5h on Mobile App MVP', time: '3h ago', path: '/time-tracking' },
  { id: 6, type: 'project', user: 'Emily Davis', action: 'updated progress', detail: 'Mobile App MVP → 65%', time: '4h ago', path: '/projects' },
];

export const initialProjects = [
  {
    id: 1,
    name: 'E-Commerce Platform',
    category: 'Web Development',
    iconType: 'cart',
    client: 'ShopMart Inc.',
    progress: 100,
    status: 'Delivered',
    statusType: 'success',
    deadline: '2025-05-20',
    team: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
    ],
    extraTeam: 2,
  },
  {
    id: 2,
    name: 'Mobile App MVP',
    category: 'Mobile Development',
    iconType: 'mobile',
    client: 'FitLife Co.',
    progress: 65,
    status: 'In Progress',
    statusType: 'warning',
    deadline: '2025-06-30',
    team: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=64&h=64&fit=crop&crop=face',
    ],
    extraTeam: 1,
  },
  {
    id: 3,
    name: 'CRM Dashboard',
    category: 'Web Development',
    iconType: 'cart',
    client: 'NovaTech Ltd.',
    progress: 40,
    status: 'In Progress',
    statusType: 'warning',
    deadline: '2025-08-15',
    team: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face',
    ],
    extraTeam: 0,
  },
  {
    id: 4,
    name: 'Brand Website Redesign',
    category: 'Design',
    iconType: 'mobile',
    client: 'GreenLeaf Co.',
    progress: 90,
    status: 'In Progress',
    statusType: 'warning',
    deadline: '2025-07-01',
    team: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=64&h=64&fit=crop&crop=face',
    ],
    extraTeam: 1,
  },
];

export const initialTasks = [
  { id: 1, title: 'API integration review', project: 'Mobile App MVP', assignee: 'Mike Chen', priority: 'High', due: '2025-06-20', done: false },
  { id: 2, title: 'Homepage wireframes', project: 'Brand Website Redesign', assignee: 'Sarah Kim', priority: 'Medium', due: '2025-06-22', done: false },
  { id: 3, title: 'Deploy staging build', project: 'E-Commerce Platform', assignee: 'Mike Chen', priority: 'Low', due: '2025-06-18', done: true },
  { id: 4, title: 'Client feedback sync', project: 'CRM Dashboard', assignee: 'Sam Rivera', priority: 'High', due: '2025-06-25', done: false },
  { id: 5, title: 'Regression testing sprint', project: 'Mobile App MVP', assignee: 'Lisa Park', priority: 'High', due: '2025-06-21', done: false },
  { id: 6, title: 'UI mockups for dashboard', project: 'CRM Dashboard', assignee: 'Sarah Kim', priority: 'Medium', due: '2025-06-24', done: false },
  { id: 7, title: 'Payment gateway QA', project: 'E-Commerce Platform', assignee: 'Lisa Park', priority: 'High', due: '2025-06-19', done: false },
];

export const initialClients = [
  { id: 1, name: 'ShopMart Inc.', contact: 'Jane Cooper', email: 'jane@shopmart.com', phone: '+1 (555) 123-4567', projects: 2, status: 'Active' },
  { id: 2, name: 'FitLife Co.', contact: 'Robert Fox', email: 'robert@fitlife.com', phone: '+1 (555) 234-5678', projects: 1, status: 'Active' },
  { id: 3, name: 'NovaTech Ltd.', contact: 'Esther Howard', email: 'esther@novatech.com', phone: '+1 (555) 345-6789', projects: 1, status: 'Active' },
  { id: 4, name: 'GreenLeaf Co.', contact: 'Cameron Williamson', email: 'cam@greenleaf.com', phone: '+1 (555) 456-7890', projects: 1, status: 'Prospect' },
];

export const initialTeam = [
  { id: 1, name: 'Alex Turner', role: 'Manager', email: 'alex.turner@nadevstudio.com', avatar: initialUser.avatar, status: 'Online' },
  { id: 2, name: 'Sarah Kim', role: 'Graphic Designer', email: 'sarah.kim@nadevstudio.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face', status: 'Online' },
  { id: 3, name: 'Mike Chen', role: 'Full Stack Developer', email: 'mike.chen@nadevstudio.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face', status: 'Away' },
  { id: 4, name: 'Emily Davis', role: 'Mobile Developer', email: 'emily.davis@nadevstudio.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face', status: 'Offline' },
  { id: 5, name: 'Sam Rivera', role: 'Project Manager', email: 'sam.rivera@nadevstudio.com', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=face', status: 'Online' },
  { id: 6, name: 'Lisa Park', role: 'QA Engineer', email: 'lisa.park@nadevstudio.com', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=64&h=64&fit=crop&crop=face', status: 'Online' },
  { id: 7, name: 'Jordan Admin', role: 'Administrator', email: 'admin@nadevstudio.com', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=64&h=64&fit=crop&crop=face', status: 'Online' },
];

export const initialTimeEntries = [
  { id: 1, project: 'Mobile App MVP', task: 'API integration review', hours: 3.5, date: '2025-06-18', loggedBy: 'Mike Chen' },
  { id: 2, project: 'CRM Dashboard', task: 'Database schema', hours: 5, date: '2025-06-17', loggedBy: 'Mike Chen' },
  { id: 3, project: 'Brand Website Redesign', task: 'Design review', hours: 2, date: '2025-06-17', loggedBy: 'Sarah Kim' },
  { id: 4, project: 'E-Commerce Platform', task: 'Final QA testing', hours: 4, date: '2025-06-16', loggedBy: 'Lisa Park' },
  { id: 5, project: 'Mobile App MVP', task: 'Push notifications', hours: 6, date: '2025-06-16', loggedBy: 'Mike Chen' },
  { id: 6, project: 'Brand Website Redesign', task: 'Hero section design', hours: 3, date: '2025-06-18', loggedBy: 'Sarah Kim' },
];

export const initialInvoices = [
  { id: 'INV-1042', client: 'ShopMart Inc.', amount: 12500, status: 'Paid', due: '2025-06-01', issued: '2025-05-01' },
  { id: 'INV-1043', client: 'FitLife Co.', amount: 8200, status: 'Pending', due: '2025-06-30', issued: '2025-06-01' },
  { id: 'INV-1044', client: 'NovaTech Ltd.', amount: 5600, status: 'Overdue', due: '2025-06-10', issued: '2025-05-10' },
  { id: 'INV-1045', client: 'GreenLeaf Co.', amount: 3400, status: 'Pending', due: '2025-07-15', issued: '2025-06-15' },
];

export const pageMeta = {
  '/': { title: 'Dashboard', subtitle: (name) => `Welcome back, ${name}! Here's what's happening with your projects.` },
  '/projects': { title: 'Projects', subtitle: () => 'Manage and track all your active and completed projects.' },
  '/tasks': { title: 'Tasks', subtitle: () => 'View and manage tasks across all projects.' },
  '/clients': { title: 'Clients', subtitle: () => 'Your client directory and relationship overview.' },
  '/team': { title: 'Team', subtitle: () => 'Meet your team members and manage collaboration.' },
  '/time-tracking': { title: 'Time Tracking', subtitle: () => 'Log and review time spent on projects.' },
  '/reports': { title: 'Reports', subtitle: () => 'Analytics and performance insights.' },
  '/invoices': { title: 'Invoices', subtitle: () => 'Billing, payments, and invoice management.' },
  '/settings': { title: 'Settings', subtitle: () => 'Manage your account and application preferences.' },
};

export const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'Tasks', path: '/tasks' },
  { label: 'Clients', path: '/clients' },
  { label: 'Team', path: '/team' },
  { label: 'Time Tracking', path: '/time-tracking' },
  { label: 'Reports', path: '/reports' },
  { label: 'Invoices', path: '/invoices' },
  { label: 'Settings', path: '/settings' },
];
