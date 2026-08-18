import React, { useState } from 'react';
import {
  ModuleType,
  UserRole,
  CitizenProfile,
  HealthRecord,
  Appointment,
  VaccinationItem,
  Prescription,
  AcademicRecord,
  Certificate,
  LearningResource,
  DigitalDocument,
  SmartNotification,
  AuditLog,
} from './types';
import {
  initialCitizenProfile,
  initialHealthRecords,
  initialAppointments,
  initialVaccinations,
  initialPrescriptions,
  initialAcademicRecords,
  initialCertificates,
  initialLearningResources,
  initialDocuments,
  initialNotifications,
  initialAuditLogs,
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WorkflowSection } from './components/WorkflowSection';
import { PersonalModule } from './components/PersonalModule';
import { HealthcareModule } from './components/HealthcareModule';
import { EducationModule } from './components/EducationModule';
import { DocumentModule } from './components/DocumentModule';
import { ArchitectureExplorer } from './components/ArchitectureExplorer';
import { SDGSection } from './components/SDGSection';
import { SmartAlertsModal } from './components/SmartAlertsModal';
import { Footer } from './components/Footer';
import { ShieldCheck, User, Stethoscope, GraduationCap, Server } from 'lucide-react';

export default function App() {
  // Navigation & Role state
  const [activeModule, setActiveModule] = useState<ModuleType>('overview');
  const [userRole, setUserRole] = useState<UserRole>('citizen');
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [lastTraceQuery, setLastTraceQuery] = useState<string | null>(null);

  // Core Datasets
  const [profile, setProfile] = useState<CitizenProfile>(initialCitizenProfile);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(initialHealthRecords);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [vaccinations, setVaccinations] = useState<VaccinationItem[]>(initialVaccinations);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>(initialAcademicRecords);
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates);
  const [learningResources, setLearningResources] = useState<LearningResource[]>(initialLearningResources);
  const [documents, setDocuments] = useState<DigitalDocument[]>(initialDocuments);
  const [notifications, setNotifications] = useState<SmartNotification[]>(initialNotifications);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // Helper for logging trace & audit entries
  const handleRequestTrace = (description: string) => {
    setLastTraceQuery(description);
    const newLog: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: description,
      entity: `${userRole.toUpperCase()} Persona via API Gateway`,
      ipAddress: '198.51.100.44 (TLS 1.3)',
      status: 'Success',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // --- Profile CRUD ---
  const handleUpdateProfile = (updated: CitizenProfile) => {
    setProfile(updated);
  };

  // --- Healthcare CRUD ---
  const handleAddHealthRecord = (rec: HealthRecord) => {
    setHealthRecords((prev) => [rec, ...prev]);
  };
  const handleEditHealthRecord = (updated: HealthRecord) => {
    setHealthRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };
  const handleDeleteHealthRecord = (id: string) => {
    setHealthRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleBookAppointment = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev]);
  };
  const handleEditAppointment = (updated: Appointment) => {
    setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };
  const handleDeleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddVaccine = (vac: VaccinationItem) => {
    setVaccinations((prev) => [vac, ...prev]);
  };
  const handleEditVaccine = (updated: VaccinationItem) => {
    setVaccinations((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
  };
  const handleDeleteVaccine = (id: string) => {
    setVaccinations((prev) => prev.filter((v) => v.id !== id));
  };

  const handleAddPrescription = (rx: Prescription) => {
    setPrescriptions((prev) => [rx, ...prev]);
  };
  const handleEditPrescription = (updated: Prescription) => {
    setPrescriptions((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };
  const handleDeletePrescription = (id: string) => {
    setPrescriptions((prev) => prev.filter((p) => p.id !== id));
  };
  const handleRequestRefill = (prescriptionId: string) => {
    setPrescriptions((prev) =>
      prev.map((rx) => (rx.id === prescriptionId ? { ...rx, status: 'Active', refillsRemaining: rx.refillsRemaining + 1 } : rx))
    );
  };

  // --- Education CRUD ---
  const handleAddAcademicRecord = (deg: AcademicRecord) => {
    setAcademicRecords((prev) => [deg, ...prev]);
  };
  const handleEditAcademicRecord = (updated: AcademicRecord) => {
    setAcademicRecords((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };
  const handleDeleteAcademicRecord = (id: string) => {
    setAcademicRecords((prev) => prev.filter((d) => d.id !== id));
  };

  const handleAddCertificate = (cert: Certificate) => {
    setCertificates((prev) => [cert, ...prev]);
  };
  const handleEditCertificate = (updated: Certificate) => {
    setCertificates((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };
  const handleDeleteCertificate = (id: string) => {
    setCertificates((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddLearningResource = (res: LearningResource) => {
    setLearningResources((prev) => [res, ...prev]);
  };
  const handleEditLearningResource = (updated: LearningResource) => {
    setLearningResources((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };
  const handleDeleteLearningResource = (id: string) => {
    setLearningResources((prev) => prev.filter((l) => l.id !== id));
  };

  // --- Document Vault CRUD ---
  const handleAddDocument = (newDoc: DigitalDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const handleSignDocument = (docId: string, signerName: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              eSigned: true,
              signedBy: signerName,
              signTimestamp: new Date().toISOString(),
            }
          : doc
      )
    );
  };

  // Notifications
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const upcomingAppointmentCount = appointments.filter((a) => a.status === 'Upcoming').length;
  const verifiedCertCount = certificates.filter((c) => c.status === 'Verified').length;

  return (
    <div className="min-h-screen bg-[#F3F7FC] text-[#1B2233] flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <Navbar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        unreadCount={unreadCount}
        openNotifications={() => setIsAlertsOpen(true)}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      {/* Role Persona Context Banner (if non-citizen) */}
      {userRole !== 'citizen' && (
        <div className="mt-16 bg-[#12234B] text-white px-4 py-2 text-xs font-medium border-b border-[#2A4A8C] flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              {userRole === 'doctor' && <Stethoscope className="w-3.5 h-3.5 text-[#F0949B]" />}
              {userRole === 'educator' && <GraduationCap className="w-3.5 h-3.5 text-[#F5B96A]" />}
              {userRole === 'admin' && <Server className="w-3.5 h-3.5 text-[#6FE0B0]" />}
              <span>
                Active Role Persona: <b>{userRole.toUpperCase()}</b> — Viewing authorized datasets with RBAC policy rules.
              </span>
            </div>
            <button
              onClick={() => setUserRole('citizen')}
              className="text-[#6FE0B0] hover:underline cursor-pointer font-mono-code text-[11px]"
            >
              Switch back to Citizen View
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* OVERVIEW VIEW */}
        {activeModule === 'overview' && (
          <div>
            <Hero
              onNavigate={(mod) => setActiveModule(mod)}
              documentCount={documents.length}
              upcomingAppointmentCount={upcomingAppointmentCount}
              verifiedCertCount={verifiedCertCount}
            />
            <WorkflowSection onNavigate={(mod) => setActiveModule(mod)} />
            <ArchitectureExplorer initialTraceQuery={lastTraceQuery} />
            <SDGSection />
          </div>
        )}

        {/* PERSONAL MANAGEMENT */}
        {activeModule === 'personal' && (
          <div className="pt-16">
            <PersonalModule
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onRequestTrace={handleRequestTrace}
            />
          </div>
        )}

        {/* HEALTHCARE MANAGEMENT */}
        {activeModule === 'healthcare' && (
          <div className="pt-16">
            <HealthcareModule
              healthRecords={healthRecords}
              appointments={appointments}
              vaccinations={vaccinations}
              prescriptions={prescriptions}
              onAddHealthRecord={handleAddHealthRecord}
              onEditHealthRecord={handleEditHealthRecord}
              onDeleteHealthRecord={handleDeleteHealthRecord}
              onBookAppointment={handleBookAppointment}
              onEditAppointment={handleEditAppointment}
              onDeleteAppointment={handleDeleteAppointment}
              onAddVaccine={handleAddVaccine}
              onEditVaccine={handleEditVaccine}
              onDeleteVaccine={handleDeleteVaccine}
              onAddPrescription={handleAddPrescription}
              onEditPrescription={handleEditPrescription}
              onDeletePrescription={handleDeletePrescription}
              onRequestRefill={handleRequestRefill}
              onRequestTrace={handleRequestTrace}
            />
          </div>
        )}

        {/* EDUCATIONAL MANAGEMENT */}
        {activeModule === 'education' && (
          <div className="pt-16">
            <EducationModule
              academicRecords={academicRecords}
              certificates={certificates}
              learningResources={learningResources}
              onAddAcademicRecord={handleAddAcademicRecord}
              onEditAcademicRecord={handleEditAcademicRecord}
              onDeleteAcademicRecord={handleDeleteAcademicRecord}
              onAddCertificate={handleAddCertificate}
              onEditCertificate={handleEditCertificate}
              onDeleteCertificate={handleDeleteCertificate}
              onAddLearningResource={handleAddLearningResource}
              onEditLearningResource={handleEditLearningResource}
              onDeleteLearningResource={handleDeleteLearningResource}
              onRequestTrace={handleRequestTrace}
            />
          </div>
        )}

        {/* DIGITAL DOCUMENT VAULT */}
        {activeModule === 'documents' && (
          <div className="pt-16">
            <DocumentModule
              documents={documents}
              onAddDocument={handleAddDocument}
              onSignDocument={handleSignDocument}
              onRequestTrace={handleRequestTrace}
            />
          </div>
        )}

        {/* ARCHITECTURE EXPLORER */}
        {activeModule === 'architecture' && (
          <div className="pt-16">
            <ArchitectureExplorer initialTraceQuery={lastTraceQuery} />
          </div>
        )}

        {/* SDG ALIGNMENT */}
        {activeModule === 'sdg' && (
          <div className="pt-16">
            <SDGSection />
          </div>
        )}

      </main>

      {/* Notifications & Audit Drawer Modal */}
      <SmartAlertsModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        notifications={notifications}
        auditLogs={auditLogs}
        onMarkAsRead={handleMarkAsRead}
      />

      {/* Sovereign System Footer */}
      <Footer onNavigate={(mod) => setActiveModule(mod)} />
    </div>
  );
}
