/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { AppShell } from './components/AppShell';
import { AuthModal } from './components/AuthModal';
import { useCampusStore } from './hooks/useCampusStore';
import { AdminPage } from './pages/AdminPage';
import { BookingsPage } from './pages/BookingsPage';
import { BuildingsPage } from './pages/BuildingsPage';
import { CampusExplorerPage } from './pages/CampusExplorerPage';
import { DashboardPage } from './pages/DashboardPage';
import { EnergyPage } from './pages/EnergyPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { LandingPage } from './pages/LandingPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { ParkingPage } from './pages/ParkingPage';
import { ProfilePage } from './pages/ProfilePage';
import { ReportsPage } from './pages/ReportsPage';
import { ResourcesPage } from './pages/ResourcesPage';
import type { BuildingId, PageId } from './types/campus';

export default function App() {
  const {
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
  } = useCampusStore();

  const [activePage, setActivePage] = useState<PageId>('landing');
  const [focusedBuildingId, setFocusedBuildingId] = useState<BuildingId | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  const handleNavigate = (page: PageId, buildingId?: BuildingId) => {
    setFocusedBuildingId(buildingId || null);
    setActivePage(page);
  };

  const renderPage = () => {
    if (error) {
      return (
        <div className="flex h-full items-center justify-center p-8 text-center">
          <div className="max-w-md rounded-xl border border-rose-500/40 bg-[#09152d] p-6">
            <h2 className="font-display text-lg font-semibold text-white">
              Unable to Load Campus Telemetry
            </h2>
            <p className="mt-2 text-xs text-slate-300">{error}</p>
            <button
              type="button"
              onClick={resetAllData}
              className="mt-4 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-950"
            >
              Restore Default Campus State
            </button>
          </div>
        </div>
      );
    }

    switch (activePage) {
      case 'landing':
        return <LandingPage campusState={state} onNavigate={handleNavigate} />;
      case 'explorer':
        return (
          <CampusExplorerPage
            campusState={state}
            initialBuildingId={focusedBuildingId}
            onNavigate={handleNavigate}
            onToggleParkingSlot={toggleParkingSlot}
          />
        );
      case 'dashboard':
        return (
          <DashboardPage
            campusState={state}
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        );
      case 'buildings':
        return (
          <BuildingsPage
            campusState={state}
            initialBuildingId={focusedBuildingId}
            onNavigate={handleNavigate}
          />
        );
      case 'bookings':
        return (
          <BookingsPage
            campusState={state}
            currentUser={currentUser}
            onCreateBooking={createBooking}
            onCancelBooking={cancelBooking}
            onOpenAuth={() => setAuthOpen(true)}
          />
        );
      case 'resources':
        return (
          <ResourcesPage
            campusState={state}
            currentUser={currentUser}
            onAddResource={addResource}
            onUpdateResource={updateResource}
            onDeleteResource={deleteResource}
            onNavigate={handleNavigate}
          />
        );
      case 'facilities':
        return (
          <FacilitiesPage
            campusState={state}
            currentUser={currentUser}
            onAddMaintenance={addMaintenance}
            onUpdateMaintenance={updateMaintenance}
            onNavigate={handleNavigate}
          />
        );
      case 'energy':
        return <EnergyPage campusState={state} />;
      case 'parking':
        return (
          <ParkingPage
            campusState={state}
            onToggleSlot={toggleParkingSlot}
            onSimulateTraffic={simulateParkingTraffic}
            onNavigate={handleNavigate}
          />
        );
      case 'maintenance':
        return (
          <MaintenancePage
            campusState={state}
            currentUser={currentUser}
            initialBuildingId={focusedBuildingId}
            onAddMaintenance={addMaintenance}
            onUpdateMaintenance={updateMaintenance}
            onDeleteMaintenance={deleteMaintenance}
          />
        );
      case 'reports':
        return <ReportsPage campusState={state} />;
      case 'profile':
        return (
          <ProfilePage
            currentUser={currentUser}
            notifications={userNotifications}
            onOpenAuth={() => setAuthOpen(true)}
            onUpdateProfile={updateProfile}
            onMarkNotificationRead={markNotificationRead}
          />
        );
      case 'admin':
        if (currentUser?.role !== 'Admin') {
          return (
            <div className="mx-auto max-w-xl p-8 text-center">
              <div className="rounded-xl border border-amber-500/40 bg-[#09152d] p-7">
                <ShieldAlert className="mx-auto h-9 w-9 text-amber-400" />
                <h2 className="mt-3 font-display text-lg font-semibold text-white">
                  Administrator Role Required
                </h2>
                <p className="mt-2 text-xs text-slate-300">
                  Your current session ({currentUser ? `${currentUser.role} · ${currentUser.department}` : 'Signed Out'}) does not have access to Digital Twin Administration.
                </p>
                <div className="mt-5 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleNavigate('dashboard')}
                    className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-200 hover:border-cyan-500/40"
                  >
                    Return to Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthOpen(true)}
                    className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400"
                  >
                    Switch Role / Sign In
                  </button>
                </div>
              </div>
            </div>
          );
        }
        return (
          <AdminPage
            campusState={state}
            onUpdateBuilding={updateBuilding}
            onAddUser={addUser}
            onUpdateUser={updateUser}
            onDeleteUser={deleteUser}
            onResetAllData={resetAllData}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <>
      <AppShell
        activePage={activePage}
        campusState={state}
        currentUser={currentUser}
        notifications={userNotifications}
        onNavigate={handleNavigate}
        onOpenAuth={() => setAuthOpen(true)}
        onLogout={logout}
        onMarkNotificationRead={markNotificationRead}
        onMarkAllNotificationsRead={markAllNotificationsRead}
      >
        {loading && activePage !== 'landing' && activePage !== 'explorer' ? (
          <div className="mx-auto max-w-[1440px] space-y-4 p-6">
            <div className="h-8 w-64 rounded-lg bg-slate-800/70" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-24 rounded-xl border border-slate-800 bg-[#09152d]" />
              ))}
            </div>
          </div>
        ) : (
          renderPage()
        )}
      </AppShell>

      <AuthModal
        open={authOpen}
        users={state.users}
        onClose={() => setAuthOpen(false)}
        onLogin={login}
        onRegister={register}
        onQuickSwitch={switchDemoUser}
      />
    </>
  );
}
