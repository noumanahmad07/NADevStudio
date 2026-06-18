# NA Dev Studio — Company Dashboard

Professional internal dashboard for NA Dev Studio — project management, team collaboration, time tracking, billing, and reporting.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
npm run preview
```

## Features

### Dashboard
- Live KPI cards (Active Projects, Avg Delivery, Satisfaction)
- Quick Actions (New Project, Add Task, Invite Team, Log Time, Create Invoice)
- Project completions chart with period selector & CSV export
- Upcoming deadlines, recent tasks, activity feed
- Projects table with search, filter, create

### Navigation (9 pages)
| Page | Features |
|------|----------|
| **Dashboard** | Overview widgets, stats, chart, projects preview |
| **Projects** | Full CRUD, search, filter, edit modal, delete confirm |
| **Tasks** | Add/edit/complete/delete, sort, filter by status |
| **Clients** | Add/edit/delete, search, contact info, status badges |
| **Team** | Member cards, invite modal, online status, remove |
| **Time Tracking** | Log hours, filter by project, weekly totals, delete |
| **Reports** | Overview, projects, revenue, team performance tabs + export |
| **Invoices** | Create, mark paid, download, filter, revenue summary |
| **Settings** | Profile, notifications, company info, password (tabbed) |

### Global
- Sidebar with active states & badge counts (tasks, overdue invoices)
- Header with breadcrumbs, global search, notifications, profile menu
- Confirm dialogs for destructive actions
- Toast notifications
- Empty states on all lists
- 404 page
- LocalStorage persistence
- Mobile responsive sidebar
- Footer with links

## Tech stack

- React 19 + Vite 7
- React Router 7
- Tailwind CSS 4
- Lucide React icons
