import crypto from 'crypto';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INITIAL_CAMPUS_STATE } from './src/data/campusData.ts';
import type {
  CampusNotification,
  CampusState,
  CampusUser,
  LabBooking,
  MaintenanceRequest,
} from './src/types/campus.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_DIR = path.resolve(__dirname, 'data');
const STORE_FILE = path.resolve(STORE_DIR, 'campus-store.json');

let campusState: CampusState = structuredClone(INITIAL_CAMPUS_STATE);

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(8).toString('hex');
  const derived = crypto.scryptSync(password, salt, 32).toString('hex');
  return `scrypt:${salt}:${derived}`;
}

function verifyPassword(password: string, stored?: string): boolean {
  if (!stored) return password === 'password123';
  if (!stored.startsWith('scrypt:')) {
    return password === stored;
  }
  const [, salt, hash] = stored.split(':');
  const derived = crypto.scryptSync(password, salt, 32).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'));
}

function sanitizeUser(user: CampusUser): Omit<CampusUser, 'password'> {
  const { password: _pw, ...safe } = user;
  return safe;
}

function getSanitizedState(): CampusState {
  return {
    ...campusState,
    users: campusState.users.map(sanitizeUser),
  };
}

function loadPersistedState(): void {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as CampusState;
      if (
        parsed &&
        Array.isArray(parsed.buildings) &&
        Array.isArray(parsed.bookings) &&
        Array.isArray(parsed.notifications) &&
        parsed.buildings[0]?.department
      ) {
        campusState = parsed;
      } else {
        campusState = structuredClone(INITIAL_CAMPUS_STATE);
        savePersistedState();
      }
    }
  } catch {
    campusState = structuredClone(INITIAL_CAMPUS_STATE);
  }
}

function savePersistedState(): void {
  campusState.lastSyncedAt = new Date().toISOString();
  try {
    if (!fs.existsSync(STORE_DIR)) {
      fs.mkdirSync(STORE_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(campusState, null, 2), 'utf-8');
  } catch {
    // Keep in-memory state active if filesystem is read-only
  }
}

function pushNotification(notif: Omit<CampusNotification, 'id' | 'createdAt' | 'read'>): void {
  const entry: CampusNotification = {
    ...notif,
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 999)}`,
    read: false,
    createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  campusState.notifications = [entry, ...campusState.notifications].slice(0, 40);
}

loadPersistedState();

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'saveetha-digital-twin-api', timestamp: new Date().toISOString() });
  });

  app.get('/api/campus-state', (_req, res) => {
    res.json(getSanitizedState());
  });

  app.post('/api/reset', (_req, res) => {
    campusState = structuredClone(INITIAL_CAMPUS_STATE);
    savePersistedState();
    res.json(getSanitizedState());
  });

  // Authentication & Profile Management
  app.post('/api/auth/register', (req, res) => {
    const { name, email, password, role, department, designationOrRoll, phone } = req.body || {};
    if (!name || !email || !password || !role || !department) {
      res.status(400).json({ error: 'Name, email, password, role, and department are required.' });
      return;
    }
    const exists = campusState.users.some(
      (u) => u.email.toLowerCase() === String(email).trim().toLowerCase()
    );
    if (exists) {
      res.status(409).json({ error: 'An account with this institutional email already exists.' });
      return;
    }
    const created: CampusUser = {
      id: `usr-${Date.now()}`,
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      role,
      department,
      designationOrRoll: String(designationOrRoll || `${role} · ${department}`).trim(),
      phone: String(phone || '+91 98400 00000').trim(),
      status: 'Active',
      lastActive: 'Online now',
      password: hashPassword(String(password)),
    };
    campusState.users = [created, ...campusState.users];
    pushNotification({
      title: 'New User Registered',
      message: `${created.name} joined as ${created.role} (${created.department}).`,
      type: 'system',
      targetRoles: ['Admin'],
      department: created.department,
    });
    savePersistedState();
    res.status(201).json({ user: sanitizeUser(created) });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }
    const user = campusState.users.find(
      (u) => u.email.toLowerCase() === String(email).trim().toLowerCase()
    );
    if (!user || !verifyPassword(String(password), user.password)) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }
    if (user.status !== 'Active') {
      res.status(403).json({ error: 'This account is currently inactive. Contact an Admin.' });
      return;
    }
    user.lastActive = 'Online now';
    savePersistedState();
    res.json({ user: sanitizeUser(user) });
  });

  app.put('/api/auth/profile/:id', (req, res) => {
    const { id } = req.params;
    const idx = campusState.users.findIndex((u) => u.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }
    const { name, phone, designationOrRoll, department, password } = req.body || {};
    const existing = campusState.users[idx];
    campusState.users[idx] = {
      ...existing,
      name: name ?? existing.name,
      phone: phone ?? existing.phone,
      designationOrRoll: designationOrRoll ?? existing.designationOrRoll,
      department: department ?? existing.department,
      password: password ? hashPassword(String(password)) : existing.password,
      lastActive: 'Online now',
    };
    savePersistedState();
    res.json({ user: sanitizeUser(campusState.users[idx]) });
  });

  // Buildings
  app.put('/api/buildings/:id', (req, res) => {
    const { id } = req.params;
    const idx = campusState.buildings.findIndex((b) => b.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Building not found' });
      return;
    }
    campusState.buildings[idx] = { ...campusState.buildings[idx], ...req.body, id };
    savePersistedState();
    res.json(campusState.buildings[idx]);
  });

  // Resources CRUD
  app.post('/api/resources', (req, res) => {
    const newItem = {
      ...req.body,
      id: req.body.id || `res-${Date.now()}`,
      lastUpdated: 'Just now',
    };
    campusState.resources = [newItem, ...campusState.resources];
    savePersistedState();
    res.status(201).json(newItem);
  });

  app.put('/api/resources/:id', (req, res) => {
    const { id } = req.params;
    const idx = campusState.resources.findIndex((r) => r.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }
    campusState.resources[idx] = { ...campusState.resources[idx], ...req.body, id, lastUpdated: 'Just now' };
    savePersistedState();
    res.json(campusState.resources[idx]);
  });

  app.delete('/api/resources/:id', (req, res) => {
    const { id } = req.params;
    campusState.resources = campusState.resources.filter((r) => r.id !== id);
    savePersistedState();
    res.json({ deleted: id });
  });

  // Lab / Test-Slot Bookings with Capacity Validation
  app.post('/api/bookings', (req, res) => {
    const { resourceId, userId, userName, userRole, date, timeSlot, seatsBooked, purpose } =
      req.body || {};
    const resource = campusState.resources.find((r) => r.id === resourceId);
    if (!resource) {
      res.status(404).json({ error: 'Selected lab or resource not found.' });
      return;
    }
    const requestedSeats = Math.max(1, Number(seatsBooked) || 1);
    const activeBookedSeats = campusState.bookings
      .filter(
        (b) =>
          b.resourceId === resourceId &&
          b.date === date &&
          b.timeSlot === timeSlot &&
          b.status === 'Confirmed'
      )
      .reduce((sum, b) => sum + b.seatsBooked, 0);

    const remaining = resource.capacity - activeBookedSeats;
    if (requestedSeats > remaining) {
      res.status(400).json({
        error:
          remaining <= 0
            ? `Capacity full for ${resource.name} on ${date} (${timeSlot}).`
            : `Only ${remaining} seat(s) remaining for ${resource.name} on ${date} (${timeSlot}).`,
      });
      return;
    }

    const booking: LabBooking = {
      id: `BK-${Math.floor(510 + Math.random() * 480)}`,
      resourceId: resource.id,
      resourceName: resource.name,
      buildingId: resource.buildingId,
      buildingName: resource.buildingName,
      department: resource.department,
      userId: userId || 'usr-student-01',
      userName: userName || 'Campus User',
      userRole: userRole || 'Student',
      date,
      timeSlot,
      seatsBooked: requestedSeats,
      purpose: purpose || 'Lab Practice / Assessment Slot',
      status: 'Confirmed',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };

    campusState.bookings = [booking, ...campusState.bookings];

    // Update resource availability indicator if now full
    if (activeBookedSeats + requestedSeats >= resource.capacity) {
      resource.status = 'Reserved';
      resource.lastUpdated = 'Just now';
    }

    pushNotification({
      title: 'Lab Slot Booked',
      message: `${booking.userName} booked ${requestedSeats} seat(s) in ${resource.name} (${date} · ${timeSlot}).`,
      type: 'booking',
      targetRoles: ['Student', 'Faculty', 'Admin'],
      department: resource.department,
      userId: booking.userId,
    });

    savePersistedState();
    res.status(201).json({ booking, state: getSanitizedState() });
  });

  app.put('/api/bookings/:id/cancel', (req, res) => {
    const { id } = req.params;
    const booking = campusState.bookings.find((b) => b.id === id);
    if (!booking) {
      res.status(404).json({ error: 'Booking not found.' });
      return;
    }
    booking.status = 'Cancelled';
    const resource = campusState.resources.find((r) => r.id === booking.resourceId);
    if (resource && resource.status === 'Reserved') {
      resource.status = 'Available';
      resource.lastUpdated = 'Just now';
    }
    pushNotification({
      title: 'Booking Cancelled',
      message: `Booking ${booking.id} for ${booking.resourceName} (${booking.date} · ${booking.timeSlot}) was cancelled.`,
      type: 'booking',
      targetRoles: ['Student', 'Faculty', 'Admin'],
      department: booking.department,
      userId: booking.userId,
    });
    savePersistedState();
    res.json({ booking, state: getSanitizedState() });
  });

  // Maintenance / Facility Work Orders CRUD
  app.post('/api/maintenance', (req, res) => {
    const newOrder: MaintenanceRequest = {
      ...req.body,
      id: req.body.id || `WO-${Math.floor(2100 + Math.random() * 800)}`,
      createdAt: req.body.createdAt || new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    campusState.maintenance = [newOrder, ...campusState.maintenance];
    pushNotification({
      title: `New ${newOrder.category} Issue Reported`,
      message: `${newOrder.id}: ${newOrder.title} in ${newOrder.buildingName}.`,
      type: 'maintenance',
      targetRoles: ['Maintenance Staff', 'Faculty', 'Admin'],
      department: newOrder.department,
      userId: newOrder.reportedByUserId,
    });
    savePersistedState();
    res.status(201).json(newOrder);
  });

  app.put('/api/maintenance/:id', (req, res) => {
    const { id } = req.params;
    const idx = campusState.maintenance.findIndex((m) => m.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Work order not found' });
      return;
    }
    const prev = campusState.maintenance[idx];
    const updated = { ...prev, ...req.body, id };
    campusState.maintenance[idx] = updated;
    if (req.body.status && req.body.status !== prev.status) {
      pushNotification({
        title: `Work Order ${updated.status}`,
        message: `${updated.id} (${updated.title}) moved from ${prev.status} to ${updated.status}.`,
        type: 'maintenance',
        targetRoles: ['Maintenance Staff', 'Faculty', 'Admin', 'Student'],
        department: updated.department,
        userId: updated.reportedByUserId,
      });
    }
    savePersistedState();
    res.json(updated);
  });

  app.delete('/api/maintenance/:id', (req, res) => {
    const { id } = req.params;
    campusState.maintenance = campusState.maintenance.filter((m) => m.id !== id);
    savePersistedState();
    res.json({ deleted: id });
  });

  // Notifications
  app.put('/api/notifications/:id/read', (req, res) => {
    const notif = campusState.notifications.find((n) => n.id === req.params.id);
    if (notif) {
      notif.read = true;
      savePersistedState();
    }
    res.json({ ok: true });
  });

  app.post('/api/notifications/read-all', (_req, res) => {
    campusState.notifications = campusState.notifications.map((n) => ({ ...n, read: true }));
    savePersistedState();
    res.json({ ok: true });
  });

  // Smart Parking
  app.put('/api/parking/:id', (req, res) => {
    const { id } = req.params;
    const idx = campusState.parking.findIndex((p) => p.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Parking slot not found' });
      return;
    }
    campusState.parking[idx] = { ...campusState.parking[idx], ...req.body, id };
    savePersistedState();
    res.json(campusState.parking[idx]);
  });

  app.post('/api/parking/simulate', (req, res) => {
    const action = req.body?.action as 'entry' | 'exit' | undefined;
    if (action === 'entry') {
      const free = campusState.parking.filter((p) => !p.occupied);
      if (free.length > 0) {
        const pick = free[Math.floor(Math.random() * free.length)];
        const types: Array<'Sedan' | 'SUV' | 'EV' | 'Compact'> = ['Sedan', 'SUV', 'EV', 'Compact'];
        pick.occupied = true;
        pick.vehicleType = pick.evCharger ? 'EV' : types[Math.floor(Math.random() * types.length)];
        pick.vehiclePlate = `TN-12-DT ${Math.floor(1000 + Math.random() * 8999)}`;
        pick.entryTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    } else if (action === 'exit') {
      const taken = campusState.parking.filter((p) => p.occupied);
      if (taken.length > 0) {
        const pick = taken[Math.floor(Math.random() * taken.length)];
        pick.occupied = false;
        pick.vehicleType = null;
        pick.vehiclePlate = null;
        pick.entryTime = null;
      }
    }
    savePersistedState();
    res.json(campusState.parking);
  });

  // Admin Users CRUD
  app.post('/api/users', (req, res) => {
    const newUser: CampusUser = {
      ...req.body,
      id: req.body.id || `usr-${Date.now()}`,
      lastActive: 'Just added',
      password: hashPassword(String(req.body.password || 'password123')),
    };
    campusState.users = [newUser, ...campusState.users];
    savePersistedState();
    res.status(201).json(sanitizeUser(newUser));
  });

  app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const idx = campusState.users.findIndex((u) => u.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    campusState.users[idx] = { ...campusState.users[idx], ...req.body, id };
    savePersistedState();
    res.json(sanitizeUser(campusState.users[idx]));
  });

  app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    campusState.users = campusState.users.filter((u) => u.id !== id);
    savePersistedState();
    res.json({ deleted: id });
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Saveetha Smart Campus Digital Twin server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
