import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import Toast from './Toast';
import InviteTeamModal from './InviteTeamModal';
import NewProjectModal from './NewProjectModal';
import NewInvoiceModal from './NewInvoiceModal';
import ConfirmDialog from './ConfirmDialog';
import RoleGuard from './RoleGuard';
import ChatWidget from './ChatWidget';
import { useApp } from '../context/AppContext';

export default function Layout() {
  const { sidebarOpen, setSidebarOpen, confirm, closeConfirm } = useApp();

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <RoleGuard>
            <Outlet />
          </RoleGuard>
        </main>
        <Footer />
      </div>
      <Toast />
      <InviteTeamModal />
      <NewProjectModal />
      <NewInvoiceModal />
      <ConfirmDialog
        open={confirm.open}
        title={confirm.title}
        message={confirm.message}
        confirmLabel={confirm.confirmLabel}
        danger={confirm.danger}
        onConfirm={confirm.onConfirm}
        onClose={closeConfirm}
      />
      <ChatWidget />
    </div>
  );
}
