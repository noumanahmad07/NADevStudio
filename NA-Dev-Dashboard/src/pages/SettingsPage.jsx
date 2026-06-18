import { useState } from 'react';
import { User, Bell, Building2, Shield, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import RoleSwitcher from '../components/RoleSwitcher';
import useDocumentTitle from '../hooks/useDocumentTitle';

const ALL_TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'company', label: 'Company', icon: Building2, adminOnly: true },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'roles', label: 'Roles', icon: Users, demo: true },
];

export default function SettingsPage() {
  useDocumentTitle('Settings');
  const { user, settings, updateSettings, updateProfile, showToast, roleConfig } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
  });
  const [prefs, setPrefs] = useState({ ...settings });
  const [company, setCompany] = useState({
    companyName: settings.companyName || 'NA Dev Studio',
    companyEmail: settings.companyEmail || 'hello@nadevstudio.com',
  });
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  const tabs = ALL_TABS.filter(
    (t) => (!t.adminOnly || roleConfig.manageCompanySettings) && t
  );

  function saveProfile(e) {
    e.preventDefault();
    updateProfile({
      ...profile,
      firstName: profile.name.split(' ')[0],
    });
  }

  function savePrefs(e) {
    e.preventDefault();
    updateSettings(prefs);
  }

  function saveCompany(e) {
    e.preventDefault();
    updateSettings(company);
  }

  function changePassword(e) {
    e.preventDefault();
    if (!passwords.current || !passwords.newPass) {
      showToast('Please fill all password fields', 'error');
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (passwords.newPass.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }
    setPasswords({ current: '', newPass: '', confirm: '' });
    showToast('Password updated successfully');
  }

  return (
    <div className="max-w-3xl">
      <div className="flex gap-1 border-b border-[#e5e7eb] mb-6 overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === id
                ? 'border-[#6366f1] text-[#6366f1]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <form onSubmit={saveProfile} className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-4 pb-5 border-b border-[#f3f4f6]">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-[#eef2ff]"
            />
            <div>
              <div className="font-semibold text-gray-900">{user.name}</div>
              <div className="text-sm text-gray-500">{user.role}</div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job title</label>
            <input
              value={profile.role}
              disabled
              className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg bg-gray-50 text-gray-500"
            />
            <p className="text-xs text-gray-400 mt-1">Role is assigned by your administrator</p>
          </div>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#6366f1] rounded-lg hover:bg-[#4f46e5] transition-colors">
            Save Profile
          </button>
        </form>
      )}

      {activeTab === 'notifications' && (
        <form onSubmit={savePrefs} className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email notifications', desc: 'Receive email alerts for important updates' },
            { key: 'projectUpdates', label: 'Project update alerts', desc: 'Get notified when project status changes' },
            { key: 'weeklyDigest', label: 'Weekly digest email', desc: 'Summary of activity every Monday' },
          ].map(({ key, label, desc }) => (
            <label key={key} className="flex items-center justify-between py-3 border-b border-[#f3f4f6] last:border-0 cursor-pointer">
              <div>
                <div className="text-sm font-medium text-gray-900">{label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
              </div>
              <input
                type="checkbox"
                checked={prefs[key]}
                onChange={(e) => setPrefs({ ...prefs, [key]: e.target.checked })}
                className="w-4 h-4 accent-[#6366f1] rounded"
              />
            </label>
          ))}
          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select
              value={prefs.timezone}
              onChange={(e) => setPrefs({ ...prefs, timezone: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#6366f1] rounded-lg hover:bg-[#4f46e5] transition-colors">
            Save Preferences
          </button>
        </form>
      )}

      {activeTab === 'company' && roleConfig.manageCompanySettings && (
        <form onSubmit={saveCompany} className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company name</label>
            <input
              value={company.companyName}
              onChange={(e) => setCompany({ ...company, companyName: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company email</label>
            <input
              type="email"
              value={company.companyEmail}
              onChange={(e) => setCompany({ ...company, companyEmail: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
            />
          </div>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#6366f1] rounded-lg hover:bg-[#4f46e5] transition-colors">
            Save Company Info
          </button>
        </form>
      )}

      {activeTab === 'security' && (
        <form onSubmit={changePassword} className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
            <input
              type="password"
              value={passwords.newPass}
              onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
            />
          </div>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#6366f1] rounded-lg hover:bg-[#4f46e5] transition-colors">
            Update Password
          </button>
        </form>
      )}

      {activeTab === 'roles' && (
        <div className="space-y-4">
          <RoleSwitcher />
          <p className="text-xs text-gray-400 text-center">
            Role switching is for demo purposes. In production, roles are assigned at login.
          </p>
        </div>
      )}
    </div>
  );
}
