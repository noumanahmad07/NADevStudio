import { Briefcase, Clock, Smile, CheckSquare, Timer } from 'lucide-react';
import StatCard from '../components/StatCard';
import ProjectChart from '../components/ProjectChart';
import ProjectsTable from '../components/ProjectsTable';
import QuickActions from '../components/dashboard/QuickActions';
import UpcomingDeadlines from '../components/dashboard/UpcomingDeadlines';
import RecentTasks from '../components/dashboard/RecentTasks';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import { useApp } from '../context/AppContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

const STAT_CONFIG = {
  activeProjects: {
    label: 'Active Projects',
    getValue: (ctx) => String(ctx.activeProjects),
    trend: '↑ 20% vs last month',
    trendUp: true,
    icon: Briefcase,
  },
  avgDelivery: {
    label: 'Avg Delivery',
    getValue: (ctx) => ctx.avgDelivery,
    trend: '↓ 2d vs last month',
    trendUp: true,
    icon: Clock,
  },
  satisfaction: {
    label: 'Satisfaction',
    getValue: (ctx) => ctx.satisfaction,
    trend: '↑ 5% vs last month',
    trendUp: true,
    icon: Smile,
  },
  myTasks: {
    label: 'My Tasks',
    getValue: (ctx) => String(ctx.myTasksCount),
    trend: 'Assigned to you',
    trendUp: true,
    icon: CheckSquare,
  },
  hoursLogged: {
    label: 'Hours Logged',
    getValue: (ctx) => `${ctx.myHoursLogged}h`,
    trend: 'This period',
    trendUp: true,
    icon: Timer,
  },
};

export default function DashboardPage() {
  useDocumentTitle('Dashboard');
  const ctx = useApp();
  const { showWidget, showStat, role } = ctx;

  const stats = Object.entries(STAT_CONFIG)
    .filter(([key]) => showStat(key))
    .map(([, config]) => ({
      label: config.label,
      value: config.getValue(ctx),
      trend: config.trend,
      trendUp: config.trendUp,
      icon: config.icon,
    }));

  const gridCols =
    stats.length === 2 ? 'md:grid-cols-2' : stats.length === 1 ? 'md:grid-cols-1' : 'md:grid-cols-3';

  return (
    <div className="space-y-6">
      {stats.length > 0 && (
        <div className={`grid grid-cols-1 ${gridCols} gap-5`}>
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      )}

      {showWidget('quickActions') && <QuickActions />}

      {(showWidget('chart') || showWidget('deadlines')) && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {showWidget('chart') && (
            <div className={showWidget('deadlines') ? 'xl:col-span-2' : 'xl:col-span-3'}>
              <ProjectChart />
            </div>
          )}
          {showWidget('deadlines') && <UpcomingDeadlines />}
        </div>
      )}

      {(showWidget('tasks') || showWidget('activity')) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {showWidget('tasks') && <RecentTasks />}
          {showWidget('activity') && <ActivityFeed />}
        </div>
      )}

      {showWidget('projectsTable') && <ProjectsTable limit={role === 'developer' || role === 'qa' || role === 'graphic_designer' ? 3 : 2} />}
    </div>
  );
}
