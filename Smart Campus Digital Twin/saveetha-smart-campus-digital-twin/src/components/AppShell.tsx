import React, { useMemo, useState } from 'react';
import {
  Activity,
  BarChart3,
  Bell,
  Box,
  Building2,
  CalendarCheck,
  Car,
  ClipboardList,
  Compass,
  FileBarChart2,
  Globe,
  LogIn,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import type {
  BuildingId,
  CampusNotification,
  CampusState,
  CampusUser,
  PageId,
  UserRole,
} from '../types/campus';

interface AppShellProps {
  activePage: PageId;
  campusState: CampusState;
  currentUser: CampusUser | null;
  notifications: CampusNotification[];
  onNavigate: (page: PageId, focusBuildingId?: BuildingId) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  children: React.ReactNode;
}

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group: 'Core' | 'Operations' | 'Governance';
  allowedRoles?: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { id: 'landing', label: 'Landing Overview', icon: Globe, group: 'Core' },
  { id: 'explorer', label: '3D Campus Explorer', icon: Box, group: 'Core' },
  { id: 'dashboard', label: 'Personalized Dashboard', icon: Activity, group: 'Core' },
  { id: 'buildings', label: 'Building Information', icon: Building2, group: 'Core' },
  {
    id: 'bookings',
    label: 'Lab & Slot Bookings',
    icon: CalendarCheck,
    group: 'Operations',
    allowedRoles: ['Student', 'Faculty', 'Admin'],
  },
  { id: 'resources', label: 'Resource Management', icon: ClipboardList, group: 'Operations' },
  { id: 'facilities', label: 'Facility Management', icon: Compass, group: 'Operations' },
  { id: 'energy', label: 'Energy Monitoring', icon: Zap, group: 'Operations' },
  { id: 'parking', label: 'Smart Parking', icon: Car, group: 'Operations' },
  { id: 'maintenance', label: 'Maintenance Tracking', icon: Wrench, group: 'Operations' },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    icon: FileBarChart2,
    group: 'Governance',
    allowedRoles: ['Faculty', 'Admin', 'Maintenance Staff'],
  },
  {
    id: 'admin',
    label: 'Admin Settings',
    icon: Settings,
    group: 'Governance',
    allowedRoles: ['Admin'],
  },
  { id: 'profile', label: 'My Profile & Access', icon: User, group: 'Governance' },
];

export const AppShell: React.FC<AppShellProps> = ({
  activePage,
  campusState,
  currentUser,
  notifications,
  onNavigate,
  onOpenAuth,
  onLogout,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const visibleNavItems = useMemo(() => {
    return NAV_ITEMS.filter((item) => {
      if (!item.allowedRoles) return true;
      if (!currentUser) return item.id !== 'admin';
      return item.allowedRoles.includes(currentUser.role);
    });
  }, [currentUser]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { buildings: [], resources: [] };
    return {
      buildings: campusState.buildings
        .filter(
          (b) =>
            b.name.toLowerCase().includes(q) ||
            b.department.toLowerCase().includes(q) ||
            b.category.toLowerCase().includes(q) ||
            b.shortName.toLowerCase().includes(q)
        )
        .slice(0, 4),
      resources: campusState.resources
        .filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.type.toLowerCase().includes(q) ||
            r.department.toLowerCase().includes(q) ||
            r.buildingName.toLowerCase().includes(q)
        )
        .slice(0, 4),
    };
  }, [campusState.buildings, campusState.resources, searchQuery]);

  const activeNav = NAV_ITEMS.find((n) => n.id === activePage) || NAV_ITEMS[0];
  const groups: Array<'Core' | 'Operations' | 'Governance'> = ['Core', 'Operations', 'Governance'];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#060d1f] text-slate-100">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Enterprise Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[256px] shrink-0 flex-col border-r border-slate-800/80 bg-[#081227] transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-5">
          <button
            type="button"
            onClick={() => {
              onNavigate('landing');
              setSidebarOpen(false);
            }}
            className="flex items-center gap-2.5 text-left"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-300">
              <BarChart3 className="h-4 w-4" />
            </div>
            <span className="font-display text-sm font-bold tracking-tight text-white whitespace-nowrap">
              Saveetha Twin
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-1 text-slate-400 hover:text-white lg:hidden"
            aria-label="Close navigation menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Groups */}
        <nav aria-label="Primary Campus Navigation" className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {groups.map((group) => {
            const items = visibleNavItems.filter((item) => item.group === group);
            if (items.length === 0) return null;
            return (
              <div key={group}>
                <div className="px-3 pb-1.5 text-[11px] font-semibold tracking-wide text-slate-500">
                  {group}
                </div>
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onNavigate(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors whitespace-nowrap ${
                          isActive
                            ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                            : 'text-slate-300 hover:bg-[#0e1d3d] hover:text-white border border-transparent'
                        }`}
                      >
                        <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Active Role & Account Card */}
        <div className="border-t border-slate-800/80 p-3">
          {currentUser ? (
            <div className="rounded-lg border border-slate-800 bg-[#0b1935] p-3">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('profile');
                    setSidebarOpen(false);
                  }}
                  className="min-w-0 text-left"
                >
                  <div className="truncate text-xs font-semibold text-white hover:text-cyan-300">
                    {currentUser.name}
                  </div>
                  <div className="truncate text-[11px] text-cyan-400">
                    {currentUser.role} · {currentUser.department}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  title="Sign Out"
                  aria-label="Sign Out"
                  className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-300"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
              <button
                type="button"
                onClick={onOpenAuth}
                className="mt-2.5 w-full rounded-md border border-slate-700 bg-[#081227] py-1.5 text-[11px] font-medium text-slate-300 hover:border-cyan-500/40 hover:text-white"
              >
                Switch Role / Account
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-800/80 bg-[#071124] px-4 lg:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-slate-800 p-2 text-slate-300 hover:text-white lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 text-sm min-w-0">
              <span className="hidden sm:inline text-slate-400 whitespace-nowrap">Saveetha Campus</span>
              <span className="hidden sm:inline text-slate-600">/</span>
              <h1 className="font-display font-semibold text-white truncate">
                {activeNav.label}
              </h1>
            </div>
          </div>

          {/* Search Buildings & Resources */}
          <div className="relative hidden md:block w-full max-w-xs lg:max-w-sm">
            <div className="flex items-center rounded-lg border border-slate-800 bg-[#0c1a36] px-3 py-1.5 focus-within:border-cyan-500/60">
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                placeholder="Search CSE, ECE, EEE, SAIL, labs..."
                className="ml-2 w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {searchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1.5 rounded-lg border border-slate-700 bg-[#09152c] p-2 shadow-2xl">
                {searchResults.buildings.length === 0 && searchResults.resources.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-slate-400">
                    No matching blocks or resources found.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {searchResults.buildings.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-[10px] font-semibold text-cyan-400">
                          Campus Blocks
                        </div>
                        {searchResults.buildings.map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onMouseDown={() => {
                              onNavigate('explorer', b.id);
                              setSearchQuery('');
                            }}
                            className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs text-slate-200 hover:bg-slate-800"
                          >
                            <span className="truncate font-medium">{b.name}</span>
                            <span className="ml-2 shrink-0 text-[11px] text-slate-400">Inspect 3D</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {searchResults.resources.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-[10px] font-semibold text-cyan-400">
                          Resources &amp; Labs
                        </div>
                        {searchResults.resources.map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            onMouseDown={() => {
                              onNavigate(r.type === 'Laboratory' ? 'bookings' : 'resources');
                              setSearchQuery('');
                            }}
                            className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs text-slate-200 hover:bg-slate-800"
                          >
                            <span className="truncate">{r.name}</span>
                            <span className="ml-2 shrink-0 text-[11px] text-slate-400">{r.status}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Header Actions: Notifications + Account + 3D Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Working Notifications Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((v) => !v)}
                aria-label="Open notifications"
                className="relative flex items-center justify-center rounded-lg border border-slate-800 bg-[#0c1a36] p-2 text-slate-300 hover:border-cyan-500/40 hover:text-white transition-colors"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="ml-1 font-mono text-[11px] font-semibold text-cyan-300 tabular-nums">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-slate-700 bg-[#081329] p-3 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-semibold text-white">
                      Notifications ({unreadCount} unread)
                    </span>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={onMarkAllNotificationsRead}
                        className="text-[11px] text-cyan-400 hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="mt-2 max-h-72 space-y-2 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="py-4 text-center text-xs text-slate-400">
                        No notifications right now.
                      </p>
                    ) : (
                      notifications.slice(0, 8).map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => onMarkNotificationRead(n.id)}
                          className={`w-full rounded-lg border p-2.5 text-left text-xs transition-colors ${
                            n.read
                              ? 'border-slate-800/70 bg-[#0c1a36]/50 text-slate-400'
                              : 'border-cyan-500/40 bg-[#0c1f40] text-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 font-semibold">
                            <span className="truncate">{n.title}</span>
                            <span className="shrink-0 font-mono text-[10px] text-slate-400">
                              {n.department}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] leading-snug">{n.message}</p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {!currentUser && (
              <button
                type="button"
                onClick={onOpenAuth}
                className="rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-xs font-medium text-slate-200 hover:border-cyan-500/40 whitespace-nowrap"
              >
                Sign In
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate(activePage === 'explorer' ? 'dashboard' : 'explorer')}
              className="rounded-lg bg-cyan-500 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors whitespace-nowrap shrink-0"
            >
              {activePage === 'explorer' ? 'My Dashboard' : 'Launch 3D Explorer'}
            </button>
          </div>
        </header>

        <main className="relative flex-1 overflow-y-auto overflow-x-hidden bg-[#060d1f]">
          {children}
        </main>
      </div>
    </div>
  );
};
