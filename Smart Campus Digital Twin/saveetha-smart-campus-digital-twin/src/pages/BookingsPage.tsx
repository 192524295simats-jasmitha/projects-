import React, { useMemo, useState } from 'react';
import { Calendar, CheckCircle2, Clock, FlaskConical, Users, XCircle } from 'lucide-react';
import { LAB_TIME_SLOTS } from '../data/campusData';
import type { CampusState, CampusUser } from '../types/campus';

interface BookingsPageProps {
  campusState: CampusState;
  currentUser: CampusUser | null;
  onCreateBooking: (payload: {
    resourceId: string;
    date: string;
    timeSlot: string;
    seatsBooked: number;
    purpose: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  onCancelBooking: (bookingId: string) => void;
  onOpenAuth: () => void;
}

export const BookingsPage: React.FC<BookingsPageProps> = ({
  campusState,
  currentUser,
  onCreateBooking,
  onCancelBooking,
  onOpenAuth,
}) => {
  const labResources = useMemo(
    () =>
      campusState.resources.filter(
        (r) => r.type === 'Laboratory' || r.type === 'Seminar Hall'
      ),
    [campusState.resources]
  );

  const [selectedResourceId, setSelectedResourceId] = useState<string>(
    labResources[0]?.id || ''
  );
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [timeSlot, setTimeSlot] = useState<string>(LAB_TIME_SLOTS[0]);
  const [seatsRequested, setSeatsRequested] = useState<number>(2);
  const [purpose, setPurpose] = useState<string>('Lab Practical / Assessment Test Slot');
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [viewScope, setViewScope] = useState<'mine' | 'all'>('mine');

  const selectedLab =
    labResources.find((r) => r.id === selectedResourceId) || labResources[0];

  const slotOccupancy = useMemo(() => {
    if (!selectedLab) return { booked: 0, remaining: 0, capacity: 0 };
    const booked = campusState.bookings
      .filter(
        (b) =>
          b.resourceId === selectedLab.id &&
          b.date === date &&
          b.timeSlot === timeSlot &&
          b.status === 'Confirmed'
      )
      .reduce((s, b) => s + b.seatsBooked, 0);
    return {
      booked,
      capacity: selectedLab.capacity,
      remaining: Math.max(0, selectedLab.capacity - booked),
    };
  }, [campusState.bookings, date, selectedLab, timeSlot]);

  const isSlotFull = slotOccupancy.remaining <= 0;
  const exceedsCapacity = seatsRequested > slotOccupancy.remaining;

  const handleBookSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!selectedLab) return;
    const res = await onCreateBooking({
      resourceId: selectedLab.id,
      date,
      timeSlot,
      seatsBooked: seatsRequested,
      purpose: purpose.trim() || 'Lab Test Slot',
    });
    if (!res.ok) {
      setFeedback({ type: 'err', text: res.error || 'Booking failed due to capacity limits.' });
      return;
    }
    setFeedback({
      type: 'ok',
      text: `Confirmed ${seatsRequested} seat(s) in ${selectedLab.name} for ${date} (${timeSlot}).`,
    });
  };

  const visibleBookings = useMemo(() => {
    if (viewScope === 'mine' && currentUser) {
      return campusState.bookings.filter((b) => b.userId === currentUser.id);
    }
    if (currentUser?.role === 'Faculty') {
      return campusState.bookings.filter((b) => b.department === currentUser.department);
    }
    return campusState.bookings;
  }, [campusState.bookings, currentUser, viewScope]);

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 p-5 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            Lab &amp; Test-Slot Booking Console
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Select an available laboratory, date, and time slot with real-time seat capacity validation.
          </p>
        </div>
        {currentUser && (
          <div className="rounded-lg border border-slate-800 bg-[#09152d] px-3.5 py-2 text-xs text-slate-300">
            Booking as <span className="font-semibold text-white">{currentUser.name}</span> ·{' '}
            <span className="text-cyan-300">{currentUser.role}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Booking Form + Live Capacity Check */}
        <form
          onSubmit={handleBookSlot}
          className="space-y-4 rounded-xl border border-slate-800/90 bg-[#09152d] p-6 text-xs lg:col-span-5"
        >
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <FlaskConical className="h-4 w-4 text-cyan-400" />
            <h3 className="font-display text-base font-semibold text-white">
              Reserve Laboratory / Test Slot
            </h3>
          </div>

          {feedback && (
            <div
              className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-xs ${
                feedback.type === 'ok'
                  ? 'border-emerald-500/40 bg-emerald-950/60 text-emerald-200'
                  : 'border-rose-500/40 bg-rose-950/60 text-rose-200'
              }`}
            >
              {feedback.type === 'ok' ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          <div>
            <label className="block font-medium text-slate-300">Laboratory / Space</label>
            <select
              value={selectedResourceId}
              onChange={(e) => {
                setSelectedResourceId(e.target.value);
                setFeedback(null);
              }}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            >
              {labResources.map((lab) => (
                <option key={lab.id} value={lab.id}>
                  [{lab.department}] {lab.name} (Cap: {lab.capacity})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1 font-medium text-slate-300">
                <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                <span>Date</span>
              </label>
              <input
                required
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setFeedback(null);
                }}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 font-medium text-slate-300">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                <span>Time Slot</span>
              </label>
              <select
                value={timeSlot}
                onChange={(e) => {
                  setTimeSlot(e.target.value);
                  setFeedback(null);
                }}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
              >
                {LAB_TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Real-Time Capacity Validation Indicator */}
          {selectedLab && (
            <div className="rounded-lg border border-slate-800 bg-[#0c1a36] p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Slot Capacity Status</span>
                <span
                  className={`font-mono font-semibold tabular-nums ${
                    isSlotFull
                      ? 'text-rose-400'
                      : slotOccupancy.remaining <= 5
                        ? 'text-amber-300'
                        : 'text-emerald-400'
                  }`}
                >
                  {slotOccupancy.remaining} / {slotOccupancy.capacity} Seats Free
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full transition-all ${
                    isSlotFull ? 'bg-rose-500' : 'bg-cyan-400'
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((slotOccupancy.booked / Math.max(1, slotOccupancy.capacity)) * 100)
                    )}%`,
                  }}
                />
              </div>
              <div className="mt-1.5 text-[11px] text-slate-400">
                {selectedLab.buildingName} · {selectedLab.floor} · {selectedLab.equipmentSummary}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="flex items-center gap-1 font-medium text-slate-300">
                <Users className="h-3.5 w-3.5 text-cyan-400" />
                <span>Seats</span>
              </label>
              <input
                required
                type="number"
                min={1}
                max={Math.max(1, selectedLab?.capacity || 30)}
                value={seatsRequested}
                onChange={(e) => setSeatsRequested(Math.max(1, Number(e.target.value) || 1))}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 font-mono text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-medium text-slate-300">Session Purpose</label>
              <input
                required
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {(isSlotFull || exceedsCapacity) && (
            <div className="rounded-lg border border-rose-500/40 bg-rose-950/50 px-3 py-2 text-[11px] text-rose-200">
              {isSlotFull
                ? 'This lab slot is currently at 100% capacity. Select a different date, time slot, or laboratory.'
                : `Requested seats (${seatsRequested}) exceed remaining availability (${slotOccupancy.remaining}).`}
            </div>
          )}

          <button
            type="submit"
            disabled={isSlotFull || exceedsCapacity}
            className="w-full rounded-lg bg-cyan-500 py-2.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
          >
            {isSlotFull ? 'Capacity Full — Choose Another Slot' : 'Confirm Lab Slot Booking'}
          </button>
        </form>

        {/* My Bookings & Schedule Table */}
        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-6 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-display text-base font-semibold text-white">
                {viewScope === 'mine' ? 'My Lab & Test-Slot Bookings' : 'Campus Bookings Schedule'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Cancelling a booking automatically frees seat capacity and issues a notification.
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-[#0c1a36] p-1">
              <button
                type="button"
                onClick={() => setViewScope('mine')}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  viewScope === 'mine'
                    ? 'bg-cyan-500 text-slate-950 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                My Bookings
              </button>
              <button
                type="button"
                onClick={() => setViewScope('all')}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  viewScope === 'all'
                    ? 'bg-cyan-500 text-slate-950 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {currentUser?.role === 'Faculty'
                  ? `${currentUser.department} Dept`
                  : 'All Bookings'}
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {visibleBookings.length === 0 ? (
              <div className="rounded-lg border border-slate-800 bg-[#0c1a36] p-8 text-center text-xs text-slate-400">
                No bookings found in this view. Use the reservation form to book an open lab slot.
              </div>
            ) : (
              visibleBookings.map((bk) => (
                <div
                  key={bk.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 bg-[#0c1a36] p-3.5 text-xs"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] text-cyan-400">{bk.id}</span>
                      <span className="font-semibold text-white">{bk.resourceName}</span>
                      <span className="text-[11px] text-slate-400">· {bk.department}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-300">
                      {bk.date} · {bk.timeSlot} ·{' '}
                      <span className="font-mono text-cyan-300">{bk.seatsBooked} seat(s)</span> ·{' '}
                      {bk.purpose}
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-400">
                      Booked by {bk.userName} ({bk.userRole})
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`rounded px-2 py-0.5 text-[11px] font-medium ${
                        bk.status === 'Confirmed'
                          ? 'bg-emerald-950/70 text-emerald-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {bk.status}
                    </span>
                    {bk.status === 'Confirmed' &&
                      (currentUser?.role === 'Admin' || currentUser?.id === bk.userId) && (
                        <button
                          type="button"
                          onClick={() => onCancelBooking(bk.id)}
                          className="rounded border border-rose-500/40 px-2.5 py-1 text-[11px] font-medium text-rose-300 hover:bg-rose-950/60"
                        >
                          Cancel
                        </button>
                      )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
