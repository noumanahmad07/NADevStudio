import { useNavigate } from 'react-router-dom';
import { ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS, DEMO_USERS } from '../config/roles';
import { useApp } from '../context/AppContext';
import RoleBadge from './RoleBadge';

export default function RoleSwitcher() {
  const navigate = useNavigate();
  const { user, switchRole, showToast } = useApp();

  function handleSwitch(demoUser) {
    switchRole(demoUser);
    showToast(`Switched to ${ROLE_LABELS[demoUser.role]} view`);
    navigate('/');
  }

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Switch Role (Demo)</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Preview the dashboard as different team members
          </p>
        </div>
        <RoleBadge role={user.dashboardRole} size="md" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {DEMO_USERS.map((demo) => {
          const active = user.dashboardRole === demo.role;
          return (
            <button
              key={demo.role}
              type="button"
              onClick={() => handleSwitch(demo)}
              className={`text-left p-3 rounded-lg border transition-all ${
                active
                  ? 'border-[#6366f1] bg-[#eef2ff] ring-1 ring-[#6366f1]/30'
                  : 'border-[#e5e7eb] hover:border-[#c7d2fe] hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-gray-900">{demo.name}</span>
                {active && (
                  <span className="text-[10px] font-bold text-[#6366f1] uppercase">Active</span>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{ROLE_LABELS[demo.role]}</div>
              <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed line-clamp-2">
                {ROLE_DESCRIPTIONS[demo.role]}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
