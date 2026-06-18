import { Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

const statusColors = {
  Online: 'bg-green-500',
  Away: 'bg-yellow-500',
  Offline: 'bg-gray-300',
  Invited: 'bg-blue-400',
};

export default function TeamPage() {
  useDocumentTitle('Team');
  const { team, setInviteModalOpen, removeTeamMember, askConfirm, roleConfig, openChat } = useApp();

  const online = team.filter((m) => m.status === 'Online').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-4 text-sm text-gray-500">
          <span>{team.length} members</span>
          <span className="text-green-600">{online} online</span>
        </div>
        {roleConfig.inviteTeam && (
          <button
            type="button"
            onClick={() => setInviteModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-[#6366f1] rounded-lg hover:bg-[#4f46e5] transition-colors"
          >
            Invite Team Member
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-sm"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${statusColors[member.status]}`}
                  title={member.status}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-gray-900 truncate">{member.name}</div>
                <div className="text-sm text-gray-500">{member.role}</div>
                <div className="text-xs text-gray-400 mt-0.5 truncate">{member.email}</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#f3f4f6] flex items-center justify-between">
              <span className="text-xs text-gray-500">{member.status}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openChat(String(member.id))}
                  className="text-xs font-medium text-[#6366f1] hover:underline"
                >
                  Message
                </button>
                {member.id !== 1 && roleConfig.manageTeam && (
                  <button
                    type="button"
                    onClick={() =>
                      askConfirm({
                        title: 'Remove Team Member',
                        message: `Remove ${member.name} from the team?`,
                        confirmLabel: 'Remove',
                        danger: true,
                        onConfirm: () => removeTeamMember(member.id),
                      })
                    }
                    className="text-xs text-red-500 hover:underline flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
