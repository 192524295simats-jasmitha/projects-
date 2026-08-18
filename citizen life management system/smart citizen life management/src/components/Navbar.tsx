import React from 'react';
import { ModuleType, UserRole } from '../types';
import { ShieldCheck, Bell, Sparkles, Layers } from 'lucide-react';

interface NavbarProps {
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
  unreadCount: number;
  openNotifications: () => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeModule,
  setActiveModule,
  unreadCount,
  openNotifications,
  userRole,
  setUserRole,
}) => {
  const navItems: { id: ModuleType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'personal', label: 'Personal' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'education', label: 'Education' },
    { id: 'documents', label: 'Vault' },
    { id: 'architecture', label: 'Architecture' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F3F7FC]/90 backdrop-blur-md border-b border-[#DDE5F0]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand title */}
        <button
          onClick={() => setActiveModule('overview')}
          className="flex items-center gap-2.5 text-[#12234B] hover:opacity-90 transition-opacity text-left shrink-0 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#12234B] to-[#2A4A8C] flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-base sm:text-lg tracking-tight whitespace-nowrap">
            Smart Citizen Cloud
          </span>
        </button>

        {/* Zone 2: Nav links (single line, max 6 items) */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#12234B] text-white shadow-xs'
                    : 'text-[#5B6478] hover:text-[#12234B] hover:bg-[#E2EAF4]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Zone 3: Primary actions (Notification Bell + Role Switcher) */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Notifications Button */}
          <button
            onClick={openNotifications}
            aria-label="View Smart Alerts and Notifications"
            className="relative p-2 rounded-lg text-[#5B6478] hover:text-[#12234B] hover:bg-[#E2EAF4] transition-colors cursor-pointer border border-[#DDE5F0]"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C6404A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Role selector pill */}
          <div className="flex items-center bg-[#E2EAF4] rounded-lg p-0.5 border border-[#DDE5F0]">
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              aria-label="Switch User Role Persona"
              className="bg-transparent text-xs font-semibold text-[#12234B] px-2 py-1.5 rounded-md focus:outline-none cursor-pointer"
            >
              <option value="citizen">Citizen</option>
              <option value="doctor">Doctor</option>
              <option value="educator">Registrar</option>
              <option value="admin">Cloud Architect</option>
            </select>
          </div>

          {/* Quick interactive Action */}
          <button
            onClick={() => setActiveModule('architecture')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#12234B] hover:bg-[#0A1730] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-[#6FE0B0]" />
            <span>Trace Flow</span>
          </button>

        </div>
      </nav>

      {/* Mobile navigation tab bar */}
      <div className="md:hidden flex items-center gap-1 px-4 py-2 border-t border-[#DDE5F0] overflow-x-auto scrollbar-none bg-[#F3F7FC]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveModule(item.id)}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
              activeModule === item.id
                ? 'bg-[#12234B] text-white'
                : 'text-[#5B6478] bg-[#E2EAF4]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
