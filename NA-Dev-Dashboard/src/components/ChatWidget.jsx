import { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Search,
  Users,
  ChevronLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CHAT_GENERAL_ID } from '../data/chatData';

function formatChatTime(ts) {
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function truncatePreview(text, max = 42) {
  if (!text) return 'No messages yet';
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

const statusColors = {
  Online: 'bg-green-500',
  Away: 'bg-yellow-500',
  Offline: 'bg-gray-300',
  Invited: 'bg-blue-400',
};

export default function ChatWidget() {
  const {
    team,
    chatOpen,
    setChatOpen,
    activeChatId,
    setActiveChatId,
    chatConversations,
    sendChatMessage,
    markChatRead,
    unreadChatCount,
    getCurrentMemberId,
  } = useApp();

  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [showContacts, setShowContacts] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const currentMemberId = getCurrentMemberId();
  const contacts = team.filter((m) => m.id !== currentMemberId);

  const filteredContacts = contacts.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase())
  );

  const activeConv = activeChatId ? chatConversations[activeChatId] : null;
  const activeContact =
    activeChatId === CHAT_GENERAL_ID
      ? null
      : team.find((m) => String(m.id) === String(activeChatId));

  const isTeamChat = activeChatId === CHAT_GENERAL_ID;

  const inChatView = Boolean(activeChatId) && !showContacts;

  useEffect(() => {
    if (chatOpen && activeChatId) {
      setShowContacts(false);
    }
  }, [chatOpen, activeChatId]);

  useEffect(() => {
    if (chatOpen && activeChatId) {
      markChatRead(activeChatId);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [chatOpen, activeChatId, activeConv?.messages?.length]);

  function openConversation(id) {
    setActiveChatId(id);
    markChatRead(id);
    setShowContacts(false);
  }

  function handleSend(e) {
    e.preventDefault();
    if (!draft.trim() || !activeChatId) return;
    sendChatMessage(activeChatId, draft.trim());
    setDraft('');
  }

  function getPreview(id) {
    const conv = chatConversations[id];
    const last = conv?.messages?.[conv.messages.length - 1];
    return truncatePreview(last?.text);
  }

  function getUnread(id) {
    return chatConversations[id]?.unread || 0;
  }

  if (!chatOpen) {
    return (
      <button
        type="button"
        onClick={() => {
          setChatOpen(true);
          setShowContacts(true);
          setActiveChatId(null);
        }}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-[#6366f1] text-white shadow-lg hover:bg-[#4f46e5] hover:scale-105 transition-all flex items-center justify-center"
        aria-label="Open team chat"
      >
        <MessageCircle size={24} />
        {unreadChatCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {unreadChatCount > 9 ? '9+' : unreadChatCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <>
      {/* Backdrop — blocks footer bleed-through */}
      <button
        type="button"
        className="fixed inset-0 z-[99] bg-black/20 backdrop-blur-[1px]"
        aria-label="Close chat overlay"
        onClick={() => setChatOpen(false)}
      />

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] w-[calc(100vw-2rem)] sm:w-[440px] h-[min(560px,calc(100vh-5rem))] bg-white rounded-2xl shadow-2xl border border-[#e5e7eb] flex flex-col overflow-hidden isolate">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 bg-[#6366f1] text-white shrink-0">
          {inChatView && (
            <button
              type="button"
              onClick={() => setShowContacts(true)}
              className="p-1.5 -ml-1 rounded-lg hover:bg-white/15 transition-colors shrink-0"
              aria-label="Back to contacts"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          <div className="flex items-center gap-3 min-w-0 flex-1">
            {inChatView && isTeamChat ? (
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Users size={18} />
              </div>
            ) : inChatView && activeContact ? (
              <div className="relative shrink-0">
                <img
                  src={activeContact.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30"
                />
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#6366f1] ${statusColors[activeContact.status]}`}
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <MessageCircle size={18} />
              </div>
            )}
            <div className="min-w-0">
              <div className="font-semibold text-[15px] leading-tight truncate">
                {inChatView
                  ? isTeamChat
                    ? 'Team Channel'
                    : activeContact?.name
                  : 'Messages'}
              </div>
              <div className="text-xs text-white/75 truncate mt-0.5">
                {inChatView
                  ? isTeamChat
                    ? `${team.length} members`
                    : activeContact?.role
                  : 'Chat with your team'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setChatOpen(false)}
            className="p-2 rounded-lg hover:bg-white/15 transition-colors shrink-0"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 min-h-0 bg-white">
          {/* Contact list — full width when browsing */}
          {showContacts && (
          <div className="flex w-full flex-col bg-[#fafafa] min-h-0">
            <div className="p-3 border-b border-[#e5e7eb] bg-white">
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search people..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#e5e7eb] rounded-lg bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] focus:bg-white"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-1">
              <ContactRow
                active={activeChatId === CHAT_GENERAL_ID}
                onClick={() => openConversation(CHAT_GENERAL_ID)}
                icon={
                  <div className="w-9 h-9 rounded-full bg-[#eef2ff] flex items-center justify-center">
                    <Users size={16} className="text-[#6366f1]" />
                  </div>
                }
                name="Team Channel"
                preview={getPreview(CHAT_GENERAL_ID)}
                unread={getUnread(CHAT_GENERAL_ID)}
              />

              <div className="px-3 py-2">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Direct Messages
                </span>
              </div>

              {filteredContacts.map((member) => (
                <ContactRow
                  key={member.id}
                  active={activeChatId === String(member.id)}
                  onClick={() => openConversation(String(member.id))}
                  icon={
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt=""
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#fafafa] ${statusColors[member.status]}`}
                      />
                    </div>
                  }
                  name={member.name}
                  preview={getPreview(String(member.id))}
                  unread={getUnread(String(member.id))}
                />
              ))}
            </div>
          </div>
          )}

          {/* Messages — full width when in a conversation */}
          {inChatView && (
          <div className="flex flex-1 flex-col min-w-0 bg-[#f9fafb]">
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                  {activeConv?.messages?.length === 0 && (
                    <p className="text-center text-sm text-gray-400 py-12">
                      No messages yet — say hello!
                    </p>
                  )}
                  {activeConv?.messages?.map((msg) => {
                    const isMe = msg.senderId === currentMemberId;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[min(85%,280px)] rounded-2xl px-3 py-2 ${
                            isMe
                              ? 'bg-[#6366f1] text-white rounded-br-sm'
                              : 'bg-white border border-[#e5e7eb] text-gray-900 rounded-bl-sm shadow-sm'
                          }`}
                        >
                          {!isMe && isTeamChat && (
                            <div className="text-[11px] font-semibold text-[#6366f1] mb-1">
                              {msg.senderName}
                            </div>
                          )}
                          <p className="text-[13px] leading-snug break-words">{msg.text}</p>
                          <div
                            className={`text-[10px] mt-1.5 text-right ${
                              isMe ? 'text-white/60' : 'text-gray-400'
                            }`}
                          >
                            {formatChatTime(msg.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <form
                  onSubmit={handleSend}
                  className="p-3 bg-white border-t border-[#e5e7eb] flex items-center gap-2 shrink-0"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 min-w-0 px-4 py-2.5 text-sm bg-[#f9fafb] border border-[#e5e7eb] rounded-full focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] focus:bg-white"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    className="w-10 h-10 rounded-full bg-[#6366f1] text-white hover:bg-[#4f46e5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0 flex items-center justify-center"
                    aria-label="Send message"
                  >
                    <Send size={17} />
                  </button>
                </form>
          </div>
          )}
        </div>
      </div>
    </>
  );
}

function ContactRow({ active, onClick, icon, name, preview, unread }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-start gap-2.5 px-3 py-2.5 mx-1 rounded-lg text-left transition-colors ${
        active
          ? 'bg-white shadow-sm ring-1 ring-[#e5e7eb] border-l-[3px] border-l-[#6366f1] pl-[9px]'
          : 'hover:bg-white/80 border-l-[3px] border-l-transparent'
      }`}
      style={{ width: 'calc(100% - 0.5rem)' }}
    >
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center justify-between gap-1">
          <span className="text-xs font-semibold text-gray-900 truncate">{name}</span>
          {unread > 0 && (
            <span className="shrink-0 min-w-[18px] h-[18px] px-1 bg-[#6366f1] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unread}
            </span>
          )}
        </div>
        <p className="text-[11px] text-gray-500 mt-0.5 leading-snug line-clamp-2">{preview}</p>
      </div>
    </button>
  );
}
