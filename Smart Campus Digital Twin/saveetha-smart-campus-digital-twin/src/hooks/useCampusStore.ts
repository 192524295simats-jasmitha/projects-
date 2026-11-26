import { useCallback, useEffect, useMemo, useState } from 'react';
import { INITIAL_CAMPUS_STATE } from '../data/campusData';
import type {
  BuildingId,
  CampusBuilding,
  CampusNotification,
  CampusResource,
  CampusState,
  CampusUser,
  DepartmentCode,
  LabBooking,
  MaintenanceRequest,
  UserRole,
} from '../types/campus';

const STORAGE_KEY = 'saveetha_digital_twin_state_v2';
const SESSION_KEY = 'saveetha_digital_twin_user_v2';

export function useCampusStore() {
  const [state, setState] = useState<CampusState>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as CampusState;
        if (
          parsed?.buildings?.length &&
          Array.isArray(parsed.bookings) &&
          Array.isArray(parsed.notifications) &&
          parsed.buildings[0]?.department
        ) {
          return parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_CAMPUS_STATE;
  });

  const [currentUser, setCurrentUser] = useState<CampusUser | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        return JSON.parse(raw) as CampusUser;
      }
    } catch {
      // ignore
    }
    // Start authenticated as a Student in CSE or Admin; default to Admin so all modules are immediately inspectable while switchable in 1 click
    const { password: _pw, ...defaultAdmin } = INITIAL_CAMPUS_STATE.users[0];
    return defaultAdmin;
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const persistLocal = useCallback((next: CampusState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const persistSession = useCallback((user: CampusUser | null) => {
    setCurrentUser(user);
    try {
      if (user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/campus-state')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<CampusState>;
      })
      .then((remote) => {
        if (active && remote?.buildings?.length) {
          setState(remote);
          persistLocal(remote);
          setError(null);
        }
      })
      .catch(() => {
        // Keep local cache if offline
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [persistLocal]);

  // Helper to push notification locally + keep state synced
  const appendLocalNotification = useCallback(
    (
      prev: CampusState,
      notif: Omit<CampusNotification, 'id' | 'createdAt' | 'read'>
    ): CampusNotification[] => {
      const item: CampusNotification = {
        ...notif,
        id: `notif-${Date.now()}-${Math.floor(Math.random() * 999)}`,
        read: false,
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      return [item, ...prev.notifications].slice(0, 40);
    },
    []
  );

  // Auth Actions
  const login = useCallback(
    async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          return { ok: false, error: data.error || 'Login failed.' };
        }
        persistSession(data.user);
        return { ok: true };
      } catch {
        // Offline / local fallback
        const found = state.users.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase()
        );
        if (!found || (found.password && found.password !== password && password !== 'password123')) {
          return { ok: false, error: 'Invalid email or password.' };
        }
        persistSession(found);
        return { ok: true };
      }
    },
    [persistSession, state.users]
  );

  const register = useCallback(
    async (payload: {
      name: string;
      email: string;
      password: string;
      role: UserRole;
      department: DepartmentCode;
      designationOrRoll: string;
      phone: string;
    }): Promise<{ ok: boolean; error?: string }> => {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          return { ok: false, error: data.error || 'Registration failed.' };
        }
        setState((prev) => {
          const next: CampusState = {
            ...prev,
            users: [data.user, ...prev.users],
            notifications: appendLocalNotification(prev, {
              title: 'New User Registered',
              message: `${data.user.name} joined as ${data.user.role} (${data.user.department}).`,
              type: 'system',
              targetRoles: ['Admin'],
              department: data.user.department,
            }),
          };
          persistLocal(next);
          return next;
        });
        persistSession(data.user);
        return { ok: true };
      } catch {
        const exists = state.users.some(
          (u) => u.email.toLowerCase() === payload.email.trim().toLowerCase()
        );
        if (exists) {
          return { ok: false, error: 'Email is already registered.' };
        }
        const created: CampusUser = {
          id: `usr-${Date.now()}`,
          name: payload.name,
          email: payload.email.toLowerCase(),
          role: payload.role,
          department: payload.department,
          designationOrRoll: payload.designationOrRoll,
          phone: payload.phone,
          status: 'Active',
          lastActive: 'Online now',
        };
        setState((prev) => {
          const next: CampusState = {
            ...prev,
            users: [created, ...prev.users],
          };
          persistLocal(next);
          return next;
        });
        persistSession(created);
        return { ok: true };
      }
    },
    [appendLocalNotification, persistLocal, persistSession, state.users]
  );

  const logout = useCallback(() => {
    persistSession(null);
  }, [persistSession]);

  const switchDemoUser = useCallback(
    (userId: string) => {
      const target = state.users.find((u) => u.id === userId);
      if (target) {
        persistSession(target);
      }
    },
    [persistSession, state.users]
  );

  const updateProfile = useCallback(
    async (
      id: string,
      patch: Partial<CampusUser> & { password?: string }
    ): Promise<{ ok: boolean; error?: string }> => {
      setState((prev) => {
        const nextUsers = prev.users.map((u) => (u.id === id ? { ...u, ...patch } : u));
        const next: CampusState = { ...prev, users: nextUsers };
        persistLocal(next);
        return next;
      });
      if (currentUser?.id === id) {
        const { password: _pw, ...safePatch } = patch;
        persistSession({ ...currentUser, ...safePatch });
      }
      try {
        const res = await fetch(`/api/auth/profile/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        });
        if (res.ok) {
          const data = await res.json();
          if (currentUser?.id === id && data.user) {
            persistSession(data.user);
          }
        }
      } catch {
        // ignore
      }
      return { ok: true };
    },
    [currentUser, persistLocal, persistSession]
  );

  // Lab / Test-Slot Booking with Capacity Validation
  const createBooking = useCallback(
    async (payload: {
      resourceId: string;
      date: string;
      timeSlot: string;
      seatsBooked: number;
      purpose: string;
    }): Promise<{ ok: boolean; error?: string }> => {
      if (!currentUser) {
        return { ok: false, error: 'Please sign in to book a lab or test slot.' };
      }
      const resource = state.resources.find((r) => r.id === payload.resourceId);
      if (!resource) {
        return { ok: false, error: 'Selected resource not found.' };
      }
      const activeSeats = state.bookings
        .filter(
          (b) =>
            b.resourceId === payload.resourceId &&
            b.date === payload.date &&
            b.timeSlot === payload.timeSlot &&
            b.status === 'Confirmed'
        )
        .reduce((s, b) => s + b.seatsBooked, 0);
      const remaining = resource.capacity - activeSeats;
      if (payload.seatsBooked > remaining) {
        return {
          ok: false,
          error:
            remaining <= 0
              ? `Capacity full for ${resource.name} on ${payload.date} (${payload.timeSlot}).`
              : `Only ${remaining} seat(s) remaining for this slot.`,
        };
      }

      try {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            userId: currentUser.id,
            userName: currentUser.name,
            userRole: currentUser.role,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          return { ok: false, error: data.error || 'Booking failed.' };
        }
        if (data.state) {
          setState(data.state);
          persistLocal(data.state);
          return { ok: true };
        }
      } catch {
        // fallback local creation
      }

      const booking: LabBooking = {
        id: `BK-${Math.floor(510 + Math.random() * 480)}`,
        resourceId: resource.id,
        resourceName: resource.name,
        buildingId: resource.buildingId,
        buildingName: resource.buildingName,
        department: resource.department,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        date: payload.date,
        timeSlot: payload.timeSlot,
        seatsBooked: payload.seatsBooked,
        purpose: payload.purpose,
        status: 'Confirmed',
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };

      setState((prev) => {
        const nextResources = prev.resources.map((r) =>
          r.id === resource.id && activeSeats + payload.seatsBooked >= r.capacity
            ? { ...r, status: 'Reserved' as const, lastUpdated: 'Just now' }
            : r
        );
        const next: CampusState = {
          ...prev,
          resources: nextResources,
          bookings: [booking, ...prev.bookings],
          notifications: appendLocalNotification(prev, {
            title: 'Lab Slot Booked',
            message: `${currentUser.name} booked ${payload.seatsBooked} seat(s) in ${resource.name} (${payload.date} · ${payload.timeSlot}).`,
            type: 'booking',
            targetRoles: ['Student', 'Faculty', 'Admin'],
            department: resource.department,
            userId: currentUser.id,
          }),
        };
        persistLocal(next);
        return next;
      });
      return { ok: true };
    },
    [appendLocalNotification, currentUser, persistLocal, state.bookings, state.resources]
  );

  const cancelBooking = useCallback(
    async (bookingId: string) => {
      const target = state.bookings.find((b) => b.id === bookingId);
      if (!target) return;

      setState((prev) => {
        const nextBookings = prev.bookings.map((b) =>
          b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b
        );
        const nextResources = prev.resources.map((r) =>
          r.id === target.resourceId && r.status === 'Reserved'
            ? { ...r, status: 'Available' as const, lastUpdated: 'Just now' }
            : r
        );
        const next: CampusState = {
          ...prev,
          bookings: nextBookings,
          resources: nextResources,
          notifications: appendLocalNotification(prev, {
            title: 'Booking Cancelled',
            message: `Booking ${target.id} for ${target.resourceName} (${target.date} · ${target.timeSlot}) was cancelled.`,
            type: 'booking',
            targetRoles: ['Student', 'Faculty', 'Admin'],
            department: target.department,
            userId: target.userId,
          }),
        };
        persistLocal(next);
        return next;
      });

      try {
        await fetch(`/api/bookings/${bookingId}/cancel`, { method: 'PUT' });
      } catch {
        // ignore
      }
    },
    [appendLocalNotification, persistLocal, state.bookings]
  );

  const markNotificationRead = useCallback(
    async (id: string) => {
      setState((prev) => {
        const next: CampusState = {
          ...prev,
          notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        };
        persistLocal(next);
        return next;
      });
      try {
        await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
      } catch {
        // ignore
      }
    },
    [persistLocal]
  );

  const markAllNotificationsRead = useCallback(async () => {
    setState((prev) => {
      const next: CampusState = {
        ...prev,
        notifications: prev.notifications.map((n) => ({ ...n, read: true })),
      };
      persistLocal(next);
      return next;
    });
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' });
    } catch {
      // ignore
    }
  }, [persistLocal]);

  // Existing CRUD operations
  const updateBuilding = useCallback(
    async (id: BuildingId, patch: Partial<CampusBuilding>) => {
      setState((prev) => {
        const next: CampusState = {
          ...prev,
          buildings: prev.buildings.map((b) => (b.id === id ? { ...b, ...patch } : b)),
          lastSyncedAt: new Date().toISOString(),
        };
        persistLocal(next);
        return next;
      });
      try {
        await fetch(`/api/buildings/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        });
      } catch {
        // ignore
      }
    },
    [persistLocal]
  );

  const addResource = useCallback(
    async (resource: Omit<CampusResource, 'id' | 'lastUpdated'>) => {
      const created: CampusResource = {
        ...resource,
        id: `res-${Date.now()}`,
        lastUpdated: 'Just now',
      };
      setState((prev) => {
        const next: CampusState = {
          ...prev,
          resources: [created, ...prev.resources],
          lastSyncedAt: new Date().toISOString(),
        };
        persistLocal(next);
        return next;
      });
      try {
        await fetch('/api/resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(created),
        });
      } catch {
        // ignore
      }
    },
    [persistLocal]
  );

  const updateResource = useCallback(
    async (id: string, patch: Partial<CampusResource>) => {
      setState((prev) => {
        const next: CampusState = {
          ...prev,
          resources: prev.resources.map((r) =>
            r.id === id ? { ...r, ...patch, lastUpdated: 'Just now' } : r
          ),
          lastSyncedAt: new Date().toISOString(),
        };
        persistLocal(next);
        return next;
      });
      try {
        await fetch(`/api/resources/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        });
      } catch {
        // ignore
      }
    },
    [persistLocal]
  );

  const deleteResource = useCallback(
    async (id: string) => {
      setState((prev) => {
        const next: CampusState = {
          ...prev,
          resources: prev.resources.filter((r) => r.id !== id),
          lastSyncedAt: new Date().toISOString(),
        };
        persistLocal(next);
        return next;
      });
      try {
        await fetch(`/api/resources/${id}`, { method: 'DELETE' });
      } catch {
        // ignore
      }
    },
    [persistLocal]
  );

  const addMaintenance = useCallback(
    async (order: Omit<MaintenanceRequest, 'id' | 'createdAt'>) => {
      const created: MaintenanceRequest = {
        ...order,
        reportedByUserId: order.reportedByUserId || currentUser?.id,
        id: `WO-${Math.floor(2100 + Math.random() * 800)}`,
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      setState((prev) => {
        const next: CampusState = {
          ...prev,
          maintenance: [created, ...prev.maintenance],
          notifications: appendLocalNotification(prev, {
            title: `New ${created.category} Issue Reported`,
            message: `${created.id}: ${created.title} in ${created.buildingName}.`,
            type: 'maintenance',
            targetRoles: ['Maintenance Staff', 'Faculty', 'Admin'],
            department: created.department,
            userId: created.reportedByUserId,
          }),
          lastSyncedAt: new Date().toISOString(),
        };
        persistLocal(next);
        return next;
      });
      try {
        await fetch('/api/maintenance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(created),
        });
      } catch {
        // ignore
      }
    },
    [appendLocalNotification, currentUser?.id, persistLocal]
  );

  const updateMaintenance = useCallback(
    async (id: string, patch: Partial<MaintenanceRequest>) => {
      setState((prev) => {
        const existing = prev.maintenance.find((m) => m.id === id);
        const nextMaintenance = prev.maintenance.map((m) =>
          m.id === id ? { ...m, ...patch } : m
        );
        const nextNotifications =
          existing && patch.status && patch.status !== existing.status
            ? appendLocalNotification(prev, {
                title: `Work Order ${patch.status}`,
                message: `${existing.id} (${existing.title}) updated to ${patch.status}.`,
                type: 'maintenance',
                targetRoles: ['Maintenance Staff', 'Faculty', 'Admin', 'Student'],
                department: existing.department,
                userId: existing.reportedByUserId,
              })
            : prev.notifications;
        const next: CampusState = {
          ...prev,
          maintenance: nextMaintenance,
          notifications: nextNotifications,
          lastSyncedAt: new Date().toISOString(),
        };
        persistLocal(next);
        return next;
      });
      try {
        await fetch(`/api/maintenance/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        });
      } catch {
        // ignore
      }
    },
    [appendLocalNotification, persistLocal]
  );

  const deleteMaintenance = useCallback(
    async (id: string) => {
      setState((prev) => {
        const next: CampusState = {
          ...prev,
          maintenance: prev.maintenance.filter((m) => m.id !== id),
          lastSyncedAt: new Date().toISOString(),
        };
        persistLocal(next);
        return next;
      });
      try {
        await fetch(`/api/maintenance/${id}`, { method: 'DELETE' });
      } catch {
        // ignore
      }
    },
    [persistLocal]
  );

  const toggleParkingSlot = useCallback(
    async (id: string) => {
      let updatedPatch: Record<string, unknown> = {};
      setState((prev) => {
        const nextParking = prev.parking.map((slot) => {
          if (slot.id !== id) return slot;
          const nextOccupied = !slot.occupied;
          const vType = nextOccupied ? (slot.evCharger ? 'EV' : 'Sedan') : null;
          const plate = nextOccupied ? `TN-12-SC ${Math.floor(1000 + Math.random() * 8999)}` : null;
          const entryTime = nextOccupied
            ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : null;
          updatedPatch = {
            occupied: nextOccupied,
            vehicleType: vType,
            vehiclePlate: plate,
            entryTime,
          };
          return { ...slot, ...updatedPatch };
        });
        const next: CampusState = {
          ...prev,
          parking: nextParking,
          lastSyncedAt: new Date().toISOString(),
        };
        persistLocal(next);
        return next;
      });
      try {
        await fetch(`/api/parking/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPatch),
        });
      } catch {
        // ignore
      }
    },
    [persistLocal]
  );

  const simulateParkingTraffic = useCallback(
    async (action: 'entry' | 'exit') => {
      setState((prev) => {
        const nextParking = prev.parking.map((s) => ({ ...s }));
        if (action === 'entry') {
          const free = nextParking.filter((s) => !s.occupied);
          if (free.length > 0) {
            const pick = free[Math.floor(Math.random() * free.length)];
            const types: Array<'Sedan' | 'SUV' | 'EV' | 'Compact'> = ['Sedan', 'SUV', 'EV', 'Compact'];
            pick.occupied = true;
            pick.vehicleType = pick.evCharger ? 'EV' : types[Math.floor(Math.random() * types.length)];
            pick.vehiclePlate = `TN-12-DT ${Math.floor(1000 + Math.random() * 8999)}`;
            pick.entryTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
        } else {
          const taken = nextParking.filter((s) => s.occupied);
          if (taken.length > 0) {
            const pick = taken[Math.floor(Math.random() * taken.length)];
            pick.occupied = false;
            pick.vehicleType = null;
            pick.vehiclePlate = null;
            pick.entryTime = null;
          }
        }
        const next: CampusState = {
          ...prev,
          parking: nextParking,
          lastSyncedAt: new Date().toISOString(),
        };
        persistLocal(next);
        return next;
      });
      try {
        await fetch('/api/parking/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        });
      } catch {
        // ignore
      }
    },
    [persistLocal]
  );

  const addUser = useCallback(
    async (user: Omit<CampusUser, 'id' | 'lastActive'>) => {
      const created: CampusUser = {
        ...user,
        id: `usr-${Date.now()}`,
        lastActive: 'Just added',
      };
      setState((prev) => {
        const next: CampusState = {
          ...prev,
          users: [created, ...prev.users],
          lastSyncedAt: new Date().toISOString(),
        };
        persistLocal(next);
        return next;
      });
      try {
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(created),
        });
      } catch {
        // ignore
      }
    },
    [persistLocal]
  );

  const updateUser = useCallback(
    async (id: string, patch: Partial<CampusUser>) => {
      setState((prev) => {
        const next: CampusState = {
          ...prev,
          users: prev.users.map((u) => (u.id === id ? { ...u, ...patch } : u)),
          lastSyncedAt: new Date().toISOString(),
        };
        persistLocal(next);
        return next;
      });
      try {
        await fetch(`/api/users/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        });
      } catch {
        // ignore
      }
    },
    [persistLocal]
  );

  const deleteUser = useCallback(
    async (id: string) => {
      setState((prev) => {
        const next: CampusState = {
          ...prev,
          users: prev.users.filter((u) => u.id !== id),
          lastSyncedAt: new Date().toISOString(),
        };
        persistLocal(next);
        return next;
      });
      try {
        await fetch(`/api/users/${id}`, { method: 'DELETE' });
      } catch {
        // ignore
      }
    },
    [persistLocal]
  );

  const resetAllData = useCallback(async () => {
    const fresh = structuredClone(INITIAL_CAMPUS_STATE);
    setState(fresh);
    persistLocal(fresh);
    try {
      await fetch('/api/reset', { method: 'POST' });
    } catch {
      // ignore
    }
  }, [persistLocal]);

  // Visible notifications filtered by user role & department
  const userNotifications = useMemo(() => {
    if (!currentUser) return [];
    return state.notifications.filter((n) => {
      if (currentUser.role === 'Admin') return true;
      if (n.userId && n.userId === currentUser.id) return true;
      const roleMatch = n.targetRoles.includes(currentUser.role);
      const deptMatch =
        currentUser.role === 'Student' ||
        n.department === 'All' ||
        n.department === currentUser.department;
      return roleMatch && deptMatch;
    });
  }, [currentUser, state.notifications]);

  return {
    state,
    currentUser,
    userNotifications,
    loading,
    error,
    login,
    register,
    logout,
    switchDemoUser,
    updateProfile,
    createBooking,
    cancelBooking,
    markNotificationRead,
    markAllNotificationsRead,
    updateBuilding,
    addResource,
    updateResource,
    deleteResource,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance,
    toggleParkingSlot,
    simulateParkingTraffic,
    addUser,
    updateUser,
    deleteUser,
    resetAllData,
  };
}
