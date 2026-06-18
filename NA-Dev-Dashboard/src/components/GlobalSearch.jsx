import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FolderKanban, CheckSquare, Users, UserCircle } from 'lucide-react';
import useClickOutside from '../hooks/useClickOutside';
import { useApp } from '../context/AppContext';

const typeIcons = {
  project: FolderKanban,
  task: CheckSquare,
  client: Users,
  team: UserCircle,
};

export default function GlobalSearch() {
  const navigate = useNavigate();
  const { projects, tasks, clients, team, canViewRoute } = useApp();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  const q = query.trim().toLowerCase();
  const results = q
    ? [
        ...(canViewRoute('/projects')
          ? projects
              .filter((p) => p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q))
              .map((p) => ({ type: 'project', label: p.name, sub: p.client, path: '/projects' }))
          : []),
        ...(canViewRoute('/tasks')
          ? tasks
              .filter((t) => t.title.toLowerCase().includes(q))
              .map((t) => ({ type: 'task', label: t.title, sub: t.project, path: '/tasks' }))
          : []),
        ...(canViewRoute('/clients')
          ? clients
              .filter((c) => c.name.toLowerCase().includes(q))
              .map((c) => ({ type: 'client', label: c.name, sub: c.contact, path: '/clients' }))
          : []),
        ...(canViewRoute('/team')
          ? team
              .filter((m) => m.name.toLowerCase().includes(q))
              .map((m) => ({ type: 'team', label: m.name, sub: m.role, path: '/team' }))
          : []),
      ].slice(0, 8)
    : [];

  function select(path) {
    navigate(path);
    setQuery('');
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative hidden md:block w-56 lg:w-64">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search anything..."
        className="w-full pl-9 pr-4 py-2 text-sm border border-[#e5e7eb] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
        aria-label="Global search"
        aria-expanded={open && results.length > 0}
      />
      {open && q && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e5e7eb] rounded-xl shadow-lg z-50 overflow-hidden">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">No results for &quot;{query}&quot;</p>
          ) : (
            results.map((r, i) => {
              const Icon = typeIcons[r.type];
              return (
                <button
                  key={`${r.type}-${r.label}-${i}`}
                  type="button"
                  onClick={() => select(r.path)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#eef2ff] flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-[#6366f1]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{r.label}</div>
                    <div className="text-xs text-gray-500 truncate">{r.sub}</div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
