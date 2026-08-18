import React, { useState } from 'react';
import { SmartNotification, AuditLog, ModuleType } from '../types';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Clock,
  ArrowRight,
  Trash2,
  Activity,
  Lock,
} from 'lucide-react';

interface SmartAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SmartNotification[];
  auditLogs: AuditLog[];
  onMarkAsRead: (id: string) => void;
  onNavigate: (module: ModuleType) => void;
}

export const SmartAlertsModal: React.FC<SmartAlertsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  auditLogs,
  onMarkAsRead,
  onNavigate,
}) => {
  const [activeView, setActiveView] = useState<'notifications' | 'audit'>('notifications');

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="p-5 border-b border-[#DDE5F0] flex items-center justify-between bg-[#F3F7FC]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#12234B] text-white flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#12234B]">Smart Services & Alerts Center</h3>
              <div className="text-xs text-[#5B6478]">
                {unreadCount} unread system notifications · Real-time event log
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#5B6478] hover:text-[#12234B] text-sm font-semibold p-1.5 rounded-lg hover:bg-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex border-b border-[#DDE5F0] bg-white px-5">
          <button
            onClick={() => setActiveView('notifications')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeView === 'notifications'
                ? 'border-[#12234B] text-[#12234B]'
                : 'border-transparent text-[#5B6478] hover:text-[#12234B]'
            }`}
          >
            Active Notifications ({notifications.length})
          </button>
          <button
            onClick={() => setActiveView('audit')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeView === 'audit'
                ? 'border-[#12234B] text-[#12234B]'
                : 'border-transparent text-[#5B6478] hover:text-[#12234B]'
            }`}
          >
            Security Audit Trail ({auditLogs.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {activeView === 'notifications' ? (
            notifications.length === 0 ? (
              <div className="text-center py-12 text-xs text-[#5B6478]">
                No pending alerts or notifications.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    notif.read
                      ? 'bg-white border-[#DDE5F0] opacity-80'
                      : 'bg-[#F3F7FC] border-[#12234B]/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-mono-code px-2 py-0.5 rounded font-bold uppercase ${
                        notif.priority === 'urgent'
                          ? 'bg-[#FBEAEA] text-[#C6404A]'
                          : notif.priority === 'high'
                          ? 'bg-[#FCEEDC] text-[#D97F1F]'
                          : 'bg-[#E2EAF4] text-[#12234B]'
                      }`}
                    >
                      {notif.category} · {notif.priority}
                    </span>
                    <span className="text-[10px] text-[#8CA0C6] font-mono-code">{notif.timestamp}</span>
                  </div>

                  <h4 className="font-semibold text-xs sm:text-sm text-[#12234B] mb-1">{notif.title}</h4>
                  <p className="text-xs text-[#5B6478] mb-3 leading-relaxed">{notif.message}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#DDE5F0]/60 text-xs">
                    {notif.actionLabel && notif.actionModule && (
                      <button
                        onClick={() => {
                          onMarkAsRead(notif.id);
                          onNavigate(notif.actionModule!);
                          onClose();
                        }}
                        className="text-[#12234B] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>{notif.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {!notif.read && (
                      <button
                        onClick={() => onMarkAsRead(notif.id)}
                        className="text-[11px] text-[#5B6478] hover:text-[#12234B] cursor-pointer"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )
          ) : (
            <div className="space-y-2">
              <div className="text-xs text-[#5B6478] mb-3 bg-[#F3F7FC] p-3 rounded-lg border border-[#DDE5F0]">
                All database queries, key decryptions, and external API calls are appended to this immutable audit ledger.
              </div>
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-white border border-[#DDE5F0] rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="font-semibold text-[#12234B]">{log.action}</div>
                    <div className="text-[11px] text-[#5B6478]">
                      Entity: <span className="font-medium text-[#1B2233]">{log.entity}</span> · {log.ipAddress}
                    </div>
                  </div>
                  <div className="text-right sm:shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-[#E6F5EF] text-[#1E7D5C]">
                      {log.status}
                    </span>
                    <div className="text-[10px] font-mono-code text-[#8CA0C6] mt-0.5">{log.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#DDE5F0] bg-[#F3F7FC] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#12234B] text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs"
          >
            Close Alert Center
          </button>
        </div>

      </div>
    </div>
  );
};
