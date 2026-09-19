import { useState, useEffect } from 'react';
import { Mail, Calendar, DollarSign, Tag, Trash2, CheckCircle2, Clock, Archive } from 'lucide-react';
import { ContactMessage } from '../../types';
import { db } from '../../services/db';

export function MessagesManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const loadMessages = async () => {
    const data = await db.getContactMessages();
    setMessages(data);
    if (!selectedMessage && data.length > 0) {
      setSelectedMessage(data[0]);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleStatusChange = async (id: string, status: ContactMessage['status']) => {
    await db.updateContactMessageStatus(id, status);
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage({ ...selectedMessage, status });
    }
    loadMessages();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this message entry?')) {
      await db.deleteContactMessage(id);
      setSelectedMessage(null);
      loadMessages();
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  const getStatusBadge = (status: ContactMessage['status']) => {
    switch (status) {
      case 'new':
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full text-[10px] font-mono">New</span>;
      case 'contacted':
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full text-[10px] font-mono">Contacted</span>;
      case 'completed':
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-mono">Completed</span>;
      case 'archived':
        return <span className="bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full text-[10px] font-mono">Archived</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Client Inquiries & Messages</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Incoming briefs submitted via the public contact form with automated status tracking.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl glass-surface self-start sm:self-auto">
          {['all', 'new', 'contacted', 'completed', 'archived'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs capitalize transition-colors ${
                filter === f
                  ? 'bg-white text-black font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Split Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Messages List Column */}
        <div className="lg:col-span-5 space-y-2 max-h-[700px] overflow-y-auto pr-1">
          {filteredMessages.length === 0 ? (
            <div className="p-8 text-center glass-surface rounded-2xl text-xs text-neutral-400">
              No inquiries found under this status.
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-white/[0.07] border-white/25 shadow-lg'
                      : 'glass-surface border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-semibold text-white text-sm truncate">
                      {msg.name}
                    </span>
                    {getStatusBadge(msg.status)}
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                    <span className="truncate max-w-[180px]">{msg.email}</span>
                    <span className="font-mono text-[11px]">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Message Detail Column */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="rounded-3xl glass-surface border border-white/10 p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {selectedMessage.name}
                  </h3>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-xs text-neutral-300 hover:underline flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{selectedMessage.email}</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 rounded-xl glass-pill text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scope & Budget Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                    Project Type
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {selectedMessage.project_type}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                    Budget Range
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">
                    {selectedMessage.budget}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                    Received Date
                  </span>
                  <span className="text-xs font-mono text-neutral-300">
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Message Body */}
              <div>
                <span className="text-xs font-mono uppercase text-neutral-400 block mb-2">
                  Inquiry Details & Scope
                </span>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-mono text-neutral-400">Update Status:</span>
                <div className="flex items-center gap-1.5">
                  {(['new', 'contacted', 'completed', 'archived'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedMessage.id, st)}
                      className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors ${
                        selectedMessage.status === st
                          ? 'bg-white text-black font-semibold'
                          : 'glass-pill text-neutral-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center glass-surface rounded-3xl border border-white/10 text-xs text-neutral-400">
              Select an inquiry on the left to view the full details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
