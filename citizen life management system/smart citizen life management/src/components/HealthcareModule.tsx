import React, { useState } from 'react';
import { HealthRecord, Appointment, VaccinationItem, Prescription } from '../types';
import {
  HeartPulse,
  Activity,
  Calendar,
  Syringe,
  Pill,
  Plus,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  QrCode,
  Download,
  Stethoscope,
  TrendingUp,
  Edit3,
  Trash2,
  Sliders,
  Check,
  Building,
  User,
  ShieldCheck,
  Video,
  MapPin,
  RefreshCw,
} from 'lucide-react';

interface HealthcareModuleProps {
  healthRecords: HealthRecord[];
  appointments: Appointment[];
  vaccinations: VaccinationItem[];
  prescriptions: Prescription[];
  onAddHealthRecord?: (record: HealthRecord) => void;
  onEditHealthRecord?: (record: HealthRecord) => void;
  onDeleteHealthRecord?: (id: string) => void;
  onBookAppointment: (appointment: Appointment) => void;
  onEditAppointment?: (appointment: Appointment) => void;
  onDeleteAppointment?: (id: string) => void;
  onAddVaccine?: (vaccine: VaccinationItem) => void;
  onEditVaccine?: (vaccine: VaccinationItem) => void;
  onDeleteVaccine?: (id: string) => void;
  onAddPrescription?: (prescription: Prescription) => void;
  onEditPrescription?: (prescription: Prescription) => void;
  onDeletePrescription?: (id: string) => void;
  onRequestRefill: (prescriptionId: string) => void;
  onRequestTrace: (description: string) => void;
}

export const HealthcareModule: React.FC<HealthcareModuleProps> = ({
  healthRecords,
  appointments,
  vaccinations,
  prescriptions,
  onAddHealthRecord,
  onEditHealthRecord,
  onDeleteHealthRecord,
  onBookAppointment,
  onEditAppointment,
  onDeleteAppointment,
  onAddVaccine,
  onEditVaccine,
  onDeleteVaccine,
  onAddPrescription,
  onEditPrescription,
  onDeletePrescription,
  onRequestRefill,
  onRequestTrace,
}) => {
  const [subTab, setSubTab] = useState<'records' | 'appointments' | 'vaccines' | 'prescriptions' | 'vitals'>('records');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Modals State ---
  // 1. Clinical Records Modals
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null);
  const [recordTitle, setRecordTitle] = useState('');
  const [recordType, setRecordType] = useState('Clinical Note');
  const [recordProvider, setRecordProvider] = useState('St. Jude Metropolitan Medical Center');
  const [recordDept, setRecordDept] = useState('Internal Medicine');
  const [recordDate, setRecordDate] = useState('2026-08-10');
  const [recordStatus, setRecordStatus] = useState<HealthRecord['status']>('Normal');
  const [recordSummary, setRecordSummary] = useState('');
  const [recordAttachment, setRecordAttachment] = useState('');

  // 2. Appointments Modals
  const [showBookModal, setShowBookModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [doctorName, setDoctorName] = useState('Dr. Evelyn Martinez, MD');
  const [aptSpecialty, setAptSpecialty] = useState('Cardiology & Wellness');
  const [aptHospital, setAptHospital] = useState('Apex Health Institute');
  const [aptDate, setAptDate] = useState('2026-09-18');
  const [aptTime, setAptTime] = useState('11:00 AM');
  const [aptType, setAptType] = useState<Appointment['type']>('In-Person');
  const [aptStatus, setAptStatus] = useState<Appointment['status']>('Upcoming');
  const [aptRoom, setAptRoom] = useState('Suite 302, Clinical Wing');

  // 3. Vaccines Modals
  const [showAddVaccineModal, setShowAddVaccineModal] = useState(false);
  const [editingVaccine, setEditingVaccine] = useState<VaccinationItem | null>(null);
  const [vaccineName, setVaccineName] = useState('');
  const [vaccineDose, setVaccineDose] = useState('Booster Dose (Dose 4)');
  const [vaccineDate, setVaccineDate] = useState('2026-01-15');
  const [vaccineClinic, setVaccineClinic] = useState('City Wellness Center');
  const [vaccineBatch, setVaccineBatch] = useState(`BN-${Math.floor(100000 + Math.random() * 900000)}`);
  const [vaccineStatus, setVaccineStatus] = useState<VaccinationItem['status']>('Valid');
  const [vaccineNextDue, setVaccineNextDue] = useState('2027-01-15');

  // 4. Prescriptions Modals
  const [showAddRxModal, setShowAddRxModal] = useState(false);
  const [editingRx, setEditingRx] = useState<Prescription | null>(null);
  const [rxMedication, setRxMedication] = useState('');
  const [rxDosage, setRxDosage] = useState('10 mg');
  const [rxFrequency, setRxFrequency] = useState('Once daily at bedtime');
  const [rxDoctor, setRxDoctor] = useState('Dr. Evelyn Martinez');
  const [rxStartDate, setRxStartDate] = useState('2026-08-01');
  const [rxEndDate, setRxEndDate] = useState('2026-10-01');
  const [rxRefills, setRxRefills] = useState(2);
  const [rxInstructions, setRxInstructions] = useState('Take with water after food.');
  const [rxStatus, setRxStatus] = useState<Prescription['status']>('Active');

  // 5. Vitals State & Customizer
  const [systolic, setSystolic] = useState(118);
  const [diastolic, setDiastolic] = useState(76);
  const [heartRate, setHeartRate] = useState(68);
  const [glucose, setGlucose] = useState(92);
  const [spO2, setSpO2] = useState(99);
  const [weightKg, setWeightKg] = useState(61.5);
  const [heightCm, setHeightCm] = useState(168);

  const calculateBMI = () => {
    const heightInMeters = heightCm / 100;
    if (!heightInMeters || heightInMeters <= 0) return '21.8';
    const bmiVal = weightKg / (heightInMeters * heightInMeters);
    return bmiVal.toFixed(1);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- Handlers: Clinical Records ---
  const handleOpenAddRecord = () => {
    setEditingRecord(null);
    setRecordTitle('');
    setRecordType('Clinical Note');
    setRecordProvider('Apex Health Institute');
    setRecordDept('Internal Medicine');
    setRecordDate(new Date().toISOString().split('T')[0]);
    setRecordStatus('Normal');
    setRecordSummary('');
    setRecordAttachment('Clinical_Report.pdf');
    setShowAddRecordModal(true);
  };

  const handleOpenEditRecord = (rec: HealthRecord) => {
    setEditingRecord(rec);
    setRecordTitle(rec.title);
    setRecordType(rec.type);
    setRecordProvider(rec.provider);
    setRecordDept(rec.department);
    setRecordDate(rec.date);
    setRecordStatus(rec.status);
    setRecordSummary(rec.summary);
    setRecordAttachment(rec.attachments?.[0] || '');
    setShowAddRecordModal(true);
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordTitle.trim()) return;

    if (editingRecord) {
      const updated: HealthRecord = {
        ...editingRecord,
        title: recordTitle.trim(),
        type: recordType.trim(),
        provider: recordProvider.trim(),
        department: recordDept.trim(),
        date: recordDate,
        status: recordStatus,
        summary: recordSummary.trim(),
        attachments: recordAttachment.trim() ? [recordAttachment.trim()] : editingRecord.attachments,
      };
      onEditHealthRecord?.(updated);
      onRequestTrace(`Updated EHR clinical record: "${updated.title}" (ID: ${updated.id})`);
      showToast(`Clinical record "${updated.title}" updated successfully!`);
    } else {
      const newRec: HealthRecord = {
        id: `HLT-REC-${Date.now().toString().slice(-3)}`,
        date: recordDate,
        type: recordType.trim(),
        title: recordTitle.trim(),
        provider: recordProvider.trim() || 'Apex Health Institute',
        department: recordDept.trim() || 'General Medicine',
        summary: recordSummary.trim() || 'Clinical consultation observations and vitals recorded.',
        status: recordStatus,
        vitals: {
          bloodPressure: `${systolic}/${diastolic}`,
          heartRate: heartRate,
          glucose: glucose,
          weightKg: weightKg,
          spO2: spO2,
        },
        attachments: recordAttachment.trim() ? [recordAttachment.trim()] : ['Diagnostics_Report.pdf'],
      };
      onAddHealthRecord?.(newRec);
      onRequestTrace(`Created new EHR clinical record: "${newRec.title}"`);
      showToast(`New EHR record "${newRec.title}" added to sovereign health vault.`);
    }
    setShowAddRecordModal(false);
  };

  const handleDeleteRecord = (id: string, title: string) => {
    onDeleteHealthRecord?.(id);
    onRequestTrace(`Deleted EHR clinical record ${id} ("${title}")`);
    showToast(`Record "${title}" deleted.`);
  };

  // --- Handlers: Appointments ---
  const handleOpenAddAppointment = () => {
    setEditingAppointment(null);
    setDoctorName('Dr. Evelyn Martinez, MD');
    setAptSpecialty('Preventive Cardiology');
    setAptHospital('Apex Health Institute');
    setAptDate('2026-09-18');
    setAptTime('11:00 AM');
    setAptType('In-Person');
    setAptStatus('Upcoming');
    setAptRoom('Suite 302, Clinical Wing');
    setShowBookModal(true);
  };

  const handleOpenEditAppointment = (apt: Appointment) => {
    setEditingAppointment(apt);
    setDoctorName(apt.doctorName);
    setAptSpecialty(apt.specialty);
    setAptHospital(apt.hospital);
    setAptDate(apt.date);
    setAptTime(apt.time);
    setAptType(apt.type);
    setAptStatus(apt.status);
    setAptRoom(apt.roomOrLink || 'Room 101');
    setShowBookModal(true);
  };

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName.trim()) return;

    if (editingAppointment) {
      const updated: Appointment = {
        ...editingAppointment,
        doctorName: doctorName.trim(),
        specialty: aptSpecialty.trim(),
        hospital: aptHospital.trim(),
        date: aptDate,
        time: aptTime,
        type: aptType,
        status: aptStatus,
        roomOrLink: aptType === 'Teleconsultation' ? 'https://telemed.healthcloud.gov/room/490-call' : aptRoom,
      };
      onEditAppointment?.(updated);
      onRequestTrace(`Updated appointment with ${updated.doctorName} on ${updated.date}`);
      showToast(`Appointment with ${updated.doctorName} updated!`);
    } else {
      const newApt: Appointment = {
        id: `APT-${Date.now().toString().slice(-4)}`,
        doctorName: doctorName.trim(),
        specialty: aptSpecialty.trim(),
        hospital: aptHospital.trim(),
        date: aptDate,
        time: aptTime,
        type: aptType,
        status: 'Upcoming',
        roomOrLink: aptType === 'Teleconsultation' ? 'https://telemed.healthcloud.gov/room/490-call' : aptRoom,
      };
      onBookAppointment(newApt);
      onRequestTrace(`Scheduled appointment with ${newApt.doctorName} on ${newApt.date} at ${newApt.time}`);
      showToast(`Appointment confirmed with ${newApt.doctorName}!`);
    }
    setShowBookModal(false);
  };

  const handleDeleteAppointment = (id: string, doc: string) => {
    onDeleteAppointment?.(id);
    onRequestTrace(`Cancelled appointment ${id} with ${doc}`);
    showToast(`Appointment with ${doc} cancelled.`);
  };

  // --- Handlers: Vaccines ---
  const handleOpenAddVaccine = () => {
    setEditingVaccine(null);
    setVaccineName('');
    setVaccineDose('Dose 1 (Primary Series)');
    setVaccineDate(new Date().toISOString().split('T')[0]);
    setVaccineClinic('City Wellness Center');
    setVaccineBatch(`BN-${Math.floor(100000 + Math.random() * 900000)}`);
    setVaccineStatus('Valid');
    setVaccineNextDue('2027-10-15');
    setShowAddVaccineModal(true);
  };

  const handleOpenEditVaccine = (vac: VaccinationItem) => {
    setEditingVaccine(vac);
    setVaccineName(vac.vaccineName);
    setVaccineDose(vac.doseNumber);
    setVaccineDate(vac.dateAdministered);
    setVaccineClinic(vac.clinic);
    setVaccineBatch(vac.batchNumber);
    setVaccineStatus(vac.status);
    setVaccineNextDue(vac.nextDueDate || '2027-10-15');
    setShowAddVaccineModal(true);
  };

  const handleSaveVaccine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vaccineName.trim()) return;

    if (editingVaccine) {
      const updated: VaccinationItem = {
        ...editingVaccine,
        vaccineName: vaccineName.trim(),
        doseNumber: vaccineDose.trim(),
        dateAdministered: vaccineDate,
        clinic: vaccineClinic.trim(),
        batchNumber: vaccineBatch.trim(),
        status: vaccineStatus,
        nextDueDate: vaccineNextDue,
      };
      onEditVaccine?.(updated);
      onRequestTrace(`Updated immunization record: ${updated.vaccineName} (${updated.doseNumber})`);
      showToast(`Vaccination "${updated.vaccineName}" updated!`);
    } else {
      const newVac: VaccinationItem = {
        id: `VAC-${Date.now().toString().slice(-2)}`,
        vaccineName: vaccineName.trim(),
        doseNumber: vaccineDose.trim(),
        dateAdministered: vaccineDate,
        clinic: vaccineClinic.trim(),
        batchNumber: vaccineBatch.trim(),
        status: vaccineStatus,
        nextDueDate: vaccineNextDue,
        qrVerificationCode: `VACC-AUTH://NAT-IND-9082-4112-X/${encodeURIComponent(vaccineName)}-VALID`,
      };
      onAddVaccine?.(newVac);
      onRequestTrace(`Added immunization certificate: ${newVac.vaccineName} (${newVac.batchNumber})`);
      showToast(`Vaccination "${newVac.vaccineName}" added to digital passport.`);
    }
    setShowAddVaccineModal(false);
  };

  const handleDeleteVaccine = (id: string, name: string) => {
    onDeleteVaccine?.(id);
    onRequestTrace(`Removed vaccination record ${id} (${name})`);
    showToast(`Vaccine record "${name}" removed.`);
  };

  // --- Handlers: Prescriptions ---
  const handleOpenAddRx = () => {
    setEditingRx(null);
    setRxMedication('');
    setRxDosage('10 mg');
    setRxFrequency('Once daily in the morning');
    setRxDoctor('Dr. Evelyn Martinez');
    setRxStartDate(new Date().toISOString().split('T')[0]);
    setRxEndDate('2026-12-31');
    setRxRefills(2);
    setRxInstructions('Take with water after meals.');
    setRxStatus('Active');
    setShowAddRxModal(true);
  };

  const handleOpenEditRx = (rx: Prescription) => {
    setEditingRx(rx);
    setRxMedication(rx.medicationName);
    setRxDosage(rx.dosage);
    setRxFrequency(rx.frequency);
    setRxDoctor(rx.prescribingDoctor);
    setRxStartDate(rx.startDate);
    setRxEndDate(rx.endDate);
    setRxRefills(rx.refillsRemaining);
    setRxInstructions(rx.instructions);
    setRxStatus(rx.status);
    setShowAddRxModal(true);
  };

  const handleSaveRx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxMedication.trim()) return;

    if (editingRx) {
      const updated: Prescription = {
        ...editingRx,
        medicationName: rxMedication.trim(),
        dosage: rxDosage.trim(),
        frequency: rxFrequency.trim(),
        prescribingDoctor: rxDoctor.trim(),
        startDate: rxStartDate,
        endDate: rxEndDate,
        refillsRemaining: Number(rxRefills),
        instructions: rxInstructions.trim(),
        status: rxStatus,
      };
      onEditPrescription?.(updated);
      onRequestTrace(`Updated prescription: ${updated.medicationName} (${updated.dosage})`);
      showToast(`Prescription for "${updated.medicationName}" updated!`);
    } else {
      const newRx: Prescription = {
        id: `RX-${Date.now().toString().slice(-5)}`,
        medicationName: rxMedication.trim(),
        dosage: rxDosage.trim(),
        frequency: rxFrequency.trim(),
        prescribingDoctor: rxDoctor.trim(),
        startDate: rxStartDate,
        endDate: rxEndDate,
        refillsRemaining: Number(rxRefills),
        instructions: rxInstructions.trim(),
        status: rxStatus,
      };
      onAddPrescription?.(newRx);
      onRequestTrace(`Added new e-Prescription for ${newRx.medicationName} (Refills: ${newRx.refillsRemaining})`);
      showToast(`Prescription for "${newRx.medicationName}" added.`);
    }
    setShowAddRxModal(false);
  };

  const handleDeleteRx = (id: string, name: string) => {
    onDeletePrescription?.(id);
    onRequestTrace(`Removed prescription ${id} (${name})`);
    showToast(`Prescription "${name}" removed.`);
  };

  // --- Handlers: Vitals Save ---
  const handleSaveVitals = () => {
    onRequestTrace(`Updated biometric vitals: BP ${systolic}/${diastolic} mmHg, HR ${heartRate} bpm, Glucose ${glucose} mg/dL, BMI ${calculateBMI()}`);
    showToast(`Biometric vitals synchronized with sovereign health record!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#DDE5F0]">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-[#C6404A] font-semibold mb-1">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Module 02 · Healthcare Management</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#12234B]">Electronic Health Records & Telehealth</h2>
          <p className="text-sm text-[#5B6478]">
            Unified FHIR/HL7 compliant health records, appointment booking, digital vaccine passport, e-Prescriptions, and vitals telemetry.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {subTab === 'records' && (
            <button
              onClick={handleOpenAddRecord}
              className="px-4 py-2 bg-[#12234B] hover:bg-[#0A1730] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#6FE0B0]" />
              <span>Add Health Record</span>
            </button>
          )}

          {subTab === 'appointments' && (
            <button
              onClick={handleOpenAddAppointment}
              className="px-4 py-2 bg-[#12234B] hover:bg-[#0A1730] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5 text-[#6FE0B0]" />
              <span>Book Appointment</span>
            </button>
          )}

          {subTab === 'vaccines' && (
            <button
              onClick={handleOpenAddVaccine}
              className="px-4 py-2 bg-[#12234B] hover:bg-[#0A1730] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#6FE0B0]" />
              <span>Add Vaccine Record</span>
            </button>
          )}

          {subTab === 'prescriptions' && (
            <button
              onClick={handleOpenAddRx}
              className="px-4 py-2 bg-[#12234B] hover:bg-[#0A1730] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#6FE0B0]" />
              <span>Add e-Prescription</span>
            </button>
          )}

          {subTab === 'vitals' && (
            <button
              onClick={handleSaveVitals}
              className="px-4 py-2 bg-[#1E7D5C] hover:bg-[#155A42] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              <span>Save & Sync Vitals</span>
            </button>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="mb-6 p-3.5 bg-[#E6F5EF] border border-[#1E7D5C]/30 text-[#1E7D5C] rounded-lg text-xs font-medium flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#DDE5F0] mb-6 overflow-x-auto">
        <button
          onClick={() => setSubTab('records')}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            subTab === 'records'
              ? 'border-[#12234B] text-[#12234B]'
              : 'border-transparent text-[#5B6478] hover:text-[#12234B]'
          }`}
        >
          Clinical Records ({healthRecords.length})
        </button>
        <button
          onClick={() => setSubTab('appointments')}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            subTab === 'appointments'
              ? 'border-[#12234B] text-[#12234B]'
              : 'border-transparent text-[#5B6478] hover:text-[#12234B]'
          }`}
        >
          Appointments ({appointments.length})
        </button>
        <button
          onClick={() => setSubTab('vaccines')}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            subTab === 'vaccines'
              ? 'border-[#12234B] text-[#12234B]'
              : 'border-transparent text-[#5B6478] hover:text-[#12234B]'
          }`}
        >
          Vaccine Passport ({vaccinations.length})
        </button>
        <button
          onClick={() => setSubTab('prescriptions')}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            subTab === 'prescriptions'
              ? 'border-[#12234B] text-[#12234B]'
              : 'border-transparent text-[#5B6478] hover:text-[#12234B]'
          }`}
        >
          Active e-Prescriptions ({prescriptions.length})
        </button>
        <button
          onClick={() => setSubTab('vitals')}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            subTab === 'vitals'
              ? 'border-[#12234B] text-[#12234B]'
              : 'border-transparent text-[#5B6478] hover:text-[#12234B]'
          }`}
        >
          Biometric Vitals & Analytics
        </button>
      </div>

      {/* 1. CLINICAL RECORDS TAB */}
      {subTab === 'records' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#5B6478] mb-2">
            <span>Showing {healthRecords.length} verified clinical records with cryptographically hashed diagnostics</span>
            <button
              onClick={handleOpenAddRecord}
              className="text-[#12234B] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#1E7D5C]" />
              <span>Add New Record</span>
            </button>
          </div>

          <div className="space-y-4">
            {healthRecords.map((record) => (
              <div
                key={record.id}
                className="bg-white border border-[#DDE5F0] hover:border-[#12234B]/40 transition-all rounded-2xl p-5 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-[#F0F4FA]">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono-code font-bold bg-[#E2EAF4] text-[#12234B] uppercase">
                      {record.type}
                    </span>
                    <span className="font-semibold text-sm text-[#12234B]">{record.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-mono-code text-[#5B6478]">{record.date}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold ${
                        record.status === 'Normal' || record.status === 'Completed'
                          ? 'bg-[#E6F5EF] text-[#1E7D5C]'
                          : 'bg-[#FBEAEA] text-[#C6404A]'
                      }`}
                    >
                      {record.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#5B6478] mb-4">
                  <div>
                    <div className="text-[11px] text-[#8CA0C6] uppercase font-mono-code mb-0.5">Facility & Department</div>
                    <div className="font-semibold text-[#1B2233]">{record.provider}</div>
                    <div>{record.department}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#8CA0C6] uppercase font-mono-code mb-0.5">Clinical Summary</div>
                    <p className="text-[#1B2233] line-clamp-2 leading-relaxed">{record.summary}</p>
                  </div>
                </div>

                {record.vitals && (
                  <div className="bg-[#F3F7FC] p-3 rounded-xl border border-[#DDE5F0] mb-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {record.vitals.bloodPressure && (
                      <div>
                        <span className="text-[#8CA0C6] block text-[10px]">BP:</span>
                        <span className="font-mono-code font-semibold text-[#12234B]">{record.vitals.bloodPressure} mmHg</span>
                      </div>
                    )}
                    {record.vitals.heartRate && (
                      <div>
                        <span className="text-[#8CA0C6] block text-[10px]">Heart Rate:</span>
                        <span className="font-mono-code font-semibold text-[#12234B]">{record.vitals.heartRate} bpm</span>
                      </div>
                    )}
                    {record.vitals.glucose && (
                      <div>
                        <span className="text-[#8CA0C6] block text-[10px]">Glucose:</span>
                        <span className="font-mono-code font-semibold text-[#12234B]">{record.vitals.glucose} mg/dL</span>
                      </div>
                    )}
                    {record.vitals.spO2 && (
                      <div>
                        <span className="text-[#8CA0C6] block text-[10px]">SpO2:</span>
                        <span className="font-mono-code font-semibold text-[#12234B]">{record.vitals.spO2}%</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-3 border-t border-[#F0F4FA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-[11px] text-[#8CA0C6] font-mono-code">
                    <span>RECORD ID:</span>
                    <span className="text-[#12234B] font-semibold">{record.id}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditRecord(record)}
                      className="px-3 py-1.5 bg-[#F3F7FC] hover:bg-[#E2EAF4] text-[#12234B] border border-[#CBD6E6] rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#1E7D5C]" />
                      <span>Customize / Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteRecord(record.id, record.title)}
                      aria-label={`Delete record ${record.title}`}
                      className="p-1.5 text-[#5B6478] hover:text-[#C6404A] hover:bg-[#FBEAEA] rounded-lg transition-colors cursor-pointer"
                      title="Delete clinical record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. APPOINTMENTS TAB */}
      {subTab === 'appointments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#5B6478] mb-2">
            <span>Manage clinical consultations and telehealth video sessions</span>
            <button
              onClick={handleOpenAddAppointment}
              className="text-[#12234B] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#1E7D5C]" />
              <span>Schedule New Appointment</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white border border-[#DDE5F0] hover:border-[#12234B]/40 transition-all rounded-2xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono-code font-bold uppercase ${
                        apt.type === 'Teleconsultation'
                          ? 'bg-[#E2EAF4] text-[#12234B]'
                          : 'bg-[#FCEEDC] text-[#D97F1F]'
                      }`}
                    >
                      {apt.type}
                    </span>
                    <span
                      className={`text-[10px] font-mono-code px-2 py-0.5 rounded-full font-semibold ${
                        apt.status === 'Upcoming'
                          ? 'bg-[#E6F5EF] text-[#1E7D5C]'
                          : apt.status === 'Completed'
                          ? 'bg-[#E2EAF4] text-[#12234B]'
                          : 'bg-[#FBEAEA] text-[#C6404A]'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-[#12234B] mb-0.5">{apt.doctorName}</h4>
                  <div className="text-xs text-[#1E7D5C] font-semibold mb-1">{apt.specialty}</div>
                  <div className="text-xs text-[#5B6478] mb-3">{apt.hospital}</div>

                  <div className="bg-[#F3F7FC] border border-[#DDE5F0] rounded-xl p-3 text-xs space-y-1.5 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8CA0C6]">Date & Time:</span>
                      <span className="font-semibold text-[#12234B] font-mono-code">{apt.date} · {apt.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#8CA0C6]">Location / Link:</span>
                      <span className="text-[#1B2233] truncate max-w-[180px] font-medium">{apt.roomOrLink}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F0F4FA] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {apt.type === 'Teleconsultation' && apt.status === 'Upcoming' && (
                      <button
                        onClick={() => {
                          onRequestTrace(`Initiated encrypted WebRTC video call with ${apt.doctorName}`);
                          showToast(`Connecting to secure telehealth room...`);
                        }}
                        className="px-3 py-1.5 bg-[#12234B] hover:bg-[#0A1730] text-white rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Video className="w-3.5 h-3.5 text-[#6FE0B0]" />
                        <span>Join Call</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenEditAppointment(apt)}
                      className="px-3 py-1.5 bg-[#F3F7FC] hover:bg-[#E2EAF4] text-[#12234B] border border-[#CBD6E6] rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      <Edit3 className="w-3 h-3 text-[#1E7D5C]" />
                      <span>Customize</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleDeleteAppointment(apt.id, apt.doctorName)}
                    aria-label={`Cancel appointment with ${apt.doctorName}`}
                    className="p-1.5 text-[#5B6478] hover:text-[#C6404A] hover:bg-[#FBEAEA] rounded-lg transition-colors cursor-pointer"
                    title="Cancel appointment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. VACCINES TAB */}
      {subTab === 'vaccines' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#5B6478] mb-2">
            <span>W3C & WHO compliant Digital Vaccine Passport records</span>
            <button
              onClick={handleOpenAddVaccine}
              className="text-[#12234B] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#1E7D5C]" />
              <span>Add Vaccine Record</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vaccinations.map((vac) => (
              <div
                key={vac.id}
                className="bg-white border border-[#DDE5F0] hover:border-[#12234B]/40 transition-all rounded-2xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono-code font-bold ${
                        vac.status === 'Valid' ? 'bg-[#E6F5EF] text-[#1E7D5C]' : 'bg-[#FCEEDC] text-[#D97F1F]'
                      }`}
                    >
                      {vac.status}
                    </span>
                    <span className="text-[10px] font-mono-code text-[#5B6478]">{vac.doseNumber}</span>
                  </div>

                  <h4 className="font-bold text-base text-[#12234B] mb-1">{vac.vaccineName}</h4>
                  <div className="text-xs text-[#5B6478] mb-3">{vac.clinic}</div>

                  <div className="space-y-1.5 text-xs text-[#5B6478] border-t border-[#F0F4FA] pt-3">
                    <div className="flex justify-between">
                      <span className="text-[#8CA0C6]">Batch Number:</span>
                      <span className="font-mono-code font-semibold text-[#1B2233]">{vac.batchNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8CA0C6]">Date Administered:</span>
                      <span className="font-mono-code">{vac.dateAdministered}</span>
                    </div>
                    {vac.nextDueDate && (
                      <div className="flex justify-between">
                        <span className="text-[#8CA0C6]">Next Due Date:</span>
                        <span className="font-mono-code text-[#D97F1F] font-semibold">{vac.nextDueDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#F0F4FA] flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleOpenEditVaccine(vac)}
                    className="px-3 py-1 bg-[#F3F7FC] hover:bg-[#E2EAF4] text-[#12234B] border border-[#CBD6E6] rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Edit3 className="w-3 h-3 text-[#1E7D5C]" />
                    <span>Customize</span>
                  </button>

                  <button
                    onClick={() => handleDeleteVaccine(vac.id, vac.vaccineName)}
                    aria-label={`Delete vaccine ${vac.vaccineName}`}
                    className="p-1.5 text-[#5B6478] hover:text-[#C6404A] hover:bg-[#FBEAEA] rounded-lg transition-colors cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PRESCRIPTIONS TAB */}
      {subTab === 'prescriptions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#5B6478] mb-2">
            <span>Active electronic prescriptions with automated pharmacy refills</span>
            <button
              onClick={handleOpenAddRx}
              className="text-[#12234B] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#1E7D5C]" />
              <span>Add e-Prescription</span>
            </button>
          </div>

          <div className="space-y-3">
            {prescriptions.map((rx) => (
              <div
                key={rx.id}
                className="bg-white border border-[#DDE5F0] hover:border-[#12234B]/40 transition-all rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold ${
                        rx.status === 'Active' ? 'bg-[#E6F5EF] text-[#1E7D5C]' : 'bg-[#FBEAEA] text-[#C6404A]'
                      }`}
                    >
                      {rx.status}
                    </span>
                    <h4 className="font-bold text-base text-[#12234B]">{rx.medicationName}</h4>
                    <span className="text-xs font-semibold text-[#5B6478] bg-[#F3F7FC] px-2 py-0.5 rounded">
                      {rx.dosage}
                    </span>
                  </div>
                  <div className="text-xs text-[#5B6478]">
                    Instructions: <span className="font-medium text-[#1B2233]">{rx.frequency}</span> · Prescribed by: {rx.prescribingDoctor}
                  </div>
                  <div className="text-[11px] text-[#8CA0C6] font-mono-code">
                    Valid: {rx.startDate} to {rx.endDate} · Refills Remaining: {rx.refillsRemaining} · {rx.instructions}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onRequestRefill(rx.id);
                      onRequestTrace(`Dispatched e-Refill order for ${rx.medicationName}`);
                      showToast(`Refill request sent to designated pharmacy!`);
                    }}
                    className="px-3.5 py-2 bg-[#12234B] hover:bg-[#0A1730] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#6FE0B0]" />
                    <span>Order Refill</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditRx(rx)}
                    className="px-3 py-2 bg-[#F3F7FC] hover:bg-[#E2EAF4] text-[#12234B] border border-[#CBD6E6] rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#1E7D5C]" />
                    <span>Customize</span>
                  </button>

                  <button
                    onClick={() => handleDeleteRx(rx.id, rx.medicationName)}
                    aria-label={`Delete prescription ${rx.medicationName}`}
                    className="p-2 text-[#5B6478] hover:text-[#C6404A] hover:bg-[#FBEAEA] rounded-lg transition-colors cursor-pointer"
                    title="Delete prescription"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. VITALS & ANALYTICS TAB */}
      {subTab === 'vitals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* BP Card */}
            <div className="bg-white border border-[#DDE5F0] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-[#5B6478] mb-2 font-mono-code uppercase font-semibold">
                <span>Blood Pressure</span>
                <HeartPulse className="w-4 h-4 text-[#C6404A]" />
              </div>
              <div className="text-2xl font-bold text-[#12234B] font-mono-code mb-1">
                {systolic}/{diastolic} <span className="text-xs font-sans text-[#5B6478]">mmHg</span>
              </div>
              <div className="text-xs text-[#1E7D5C] font-semibold">Optimal & Stable</div>
            </div>

            {/* Heart Rate Card */}
            <div className="bg-white border border-[#DDE5F0] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-[#5B6478] mb-2 font-mono-code uppercase font-semibold">
                <span>Resting Heart Rate</span>
                <Activity className="w-4 h-4 text-[#1E7D5C]" />
              </div>
              <div className="text-2xl font-bold text-[#12234B] font-mono-code mb-1">
                {heartRate} <span className="text-xs font-sans text-[#5B6478]">bpm</span>
              </div>
              <div className="text-xs text-[#1E7D5C] font-semibold">Normal Sinus Rhythm</div>
            </div>

            {/* Blood Glucose Card */}
            <div className="bg-white border border-[#DDE5F0] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-[#5B6478] mb-2 font-mono-code uppercase font-semibold">
                <span>Fasting Blood Glucose</span>
                <TrendingUp className="w-4 h-4 text-[#D97F1F]" />
              </div>
              <div className="text-2xl font-bold text-[#12234B] font-mono-code mb-1">
                {glucose} <span className="text-xs font-sans text-[#5B6478]">mg/dL</span>
              </div>
              <div className="text-xs text-[#1E7D5C] font-semibold">Normoglycemic</div>
            </div>

            {/* SpO2 Card */}
            <div className="bg-white border border-[#DDE5F0] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-[#5B6478] mb-2 font-mono-code uppercase font-semibold">
                <span>Oxygen Saturation</span>
                <CheckCircle2 className="w-4 h-4 text-[#12234B]" />
              </div>
              <div className="text-2xl font-bold text-[#12234B] font-mono-code mb-1">
                {spO2}% <span className="text-xs font-sans text-[#5B6478]">SpO2</span>
              </div>
              <div className="text-xs text-[#1E7D5C] font-semibold">Optimal Oxygenation</div>
            </div>

          </div>

          {/* Interactive Vitals Sliders & Customizer */}
          <div className="bg-white border border-[#DDE5F0] rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#DDE5F0] pb-4">
              <div>
                <h3 className="font-bold text-base text-[#12234B] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#1E7D5C]" />
                  <span>Customize & Simulate Real-Time Telemetry Vitals</span>
                </h3>
                <p className="text-xs text-[#5B6478] mt-0.5">
                  Adjust values below to simulate connected wearable IoT health sensors and calculate BMI.
                </p>
              </div>
              <button
                onClick={handleSaveVitals}
                className="px-4 py-2 bg-[#1E7D5C] hover:bg-[#155A42] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Save Telemetry Updates
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              {/* Systolic BP */}
              <div className="space-y-2 bg-[#F3F7FC] p-4 rounded-xl border border-[#DDE5F0]">
                <div className="flex justify-between font-semibold text-[#12234B]">
                  <span>Systolic Pressure</span>
                  <span className="font-mono-code text-sm text-[#C6404A]">{systolic} mmHg</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="180"
                  value={systolic}
                  onChange={(e) => setSystolic(Number(e.target.value))}
                  className="w-full accent-[#C6404A] cursor-pointer"
                />
              </div>

              {/* Diastolic BP */}
              <div className="space-y-2 bg-[#F3F7FC] p-4 rounded-xl border border-[#DDE5F0]">
                <div className="flex justify-between font-semibold text-[#12234B]">
                  <span>Diastolic Pressure</span>
                  <span className="font-mono-code text-sm text-[#C6404A]">{diastolic} mmHg</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="120"
                  value={diastolic}
                  onChange={(e) => setDiastolic(Number(e.target.value))}
                  className="w-full accent-[#C6404A] cursor-pointer"
                />
              </div>

              {/* Heart Rate */}
              <div className="space-y-2 bg-[#F3F7FC] p-4 rounded-xl border border-[#DDE5F0]">
                <div className="flex justify-between font-semibold text-[#12234B]">
                  <span>Heart Rate</span>
                  <span className="font-mono-code text-sm text-[#1E7D5C]">{heartRate} bpm</span>
                </div>
                <input
                  type="range"
                  min="45"
                  max="160"
                  value={heartRate}
                  onChange={(e) => setHeartRate(Number(e.target.value))}
                  className="w-full accent-[#1E7D5C] cursor-pointer"
                />
              </div>

              {/* Blood Glucose */}
              <div className="space-y-2 bg-[#F3F7FC] p-4 rounded-xl border border-[#DDE5F0]">
                <div className="flex justify-between font-semibold text-[#12234B]">
                  <span>Fasting Blood Glucose</span>
                  <span className="font-mono-code text-sm text-[#D97F1F]">{glucose} mg/dL</span>
                </div>
                <input
                  type="range"
                  min="65"
                  max="220"
                  value={glucose}
                  onChange={(e) => setGlucose(Number(e.target.value))}
                  className="w-full accent-[#D97F1F] cursor-pointer"
                />
              </div>

              {/* Weight & Height for BMI */}
              <div className="space-y-2 bg-[#F3F7FC] p-4 rounded-xl border border-[#DDE5F0]">
                <div className="flex justify-between font-semibold text-[#12234B]">
                  <span>Weight & Height</span>
                  <span className="font-mono-code text-sm text-[#12234B]">BMI {calculateBMI()}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-[#5B6478]">Weight (kg)</label>
                    <input
                      type="number"
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-[#DDE5F0] rounded font-mono-code"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#5B6478]">Height (cm)</label>
                    <input
                      type="number"
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-[#DDE5F0] rounded font-mono-code"
                    />
                  </div>
                </div>
              </div>

              {/* Oxygen Saturation */}
              <div className="space-y-2 bg-[#F3F7FC] p-4 rounded-xl border border-[#DDE5F0]">
                <div className="flex justify-between font-semibold text-[#12234B]">
                  <span>Oxygen (SpO2)</span>
                  <span className="font-mono-code text-sm text-[#12234B]">{spO2}%</span>
                </div>
                <input
                  type="range"
                  min="85"
                  max="100"
                  value={spO2}
                  onChange={(e) => setSpO2(Number(e.target.value))}
                  className="w-full accent-[#12234B] cursor-pointer"
                />
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD / CUSTOMIZE CLINICAL RECORD */}
      {showAddRecordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveRecord}
            className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn"
          >
            <div className="p-5 border-b border-[#DDE5F0] bg-[#F3F7FC] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#12234B] text-white flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[#6FE0B0]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#12234B]">
                    {editingRecord ? 'Customize Clinical Record' : 'Add New Clinical EHR Record'}
                  </h3>
                  <div className="text-xs text-[#5B6478]">
                    Record diagnosis, physician, and hospital details in sovereign vault
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddRecordModal(false)}
                className="text-[#5B6478] hover:text-[#12234B] text-sm font-semibold p-1 rounded-lg hover:bg-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <label className="block text-[#5B6478] mb-1 font-medium">Record Title / Diagnosis</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Comprehensive Health Checkup"
                  value={recordTitle}
                  onChange={(e) => setRecordTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Healthcare Facility / Provider</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. St. Jude Metropolitan Medical Center"
                    value={recordProvider}
                    onChange={(e) => setRecordProvider(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Department / Specialty</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Internal Medicine, Cardiology"
                    value={recordDept}
                    onChange={(e) => setRecordDept(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Record Date</label>
                  <input
                    type="date"
                    required
                    value={recordDate}
                    onChange={(e) => setRecordDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50 font-mono-code"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Record Type</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Clinical Note, Lab Result, Diagnosis"
                    value={recordType}
                    onChange={(e) => setRecordType(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Status</label>
                  <select
                    value={recordStatus}
                    onChange={(e) => setRecordStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Completed">Completed</option>
                    <option value="Follow-up Required">Follow-up Required</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Attachment File (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. LabReport-Lipid-2026.pdf"
                    value={recordAttachment}
                    onChange={(e) => setRecordAttachment(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50 font-mono-code"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5B6478] mb-1 font-medium">Clinical Summary & Doctor's Notes</label>
                <textarea
                  rows={3}
                  placeholder="Summary of examination, diagnostic findings, and health recommendations..."
                  value={recordSummary}
                  onChange={(e) => setRecordSummary(e.target.value)}
                  className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                />
              </div>
            </div>

            <div className="p-4 border-t border-[#DDE5F0] bg-[#F3F7FC] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddRecordModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#5B6478] hover:bg-white rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#12234B] hover:bg-[#0A1730] text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs"
              >
                {editingRecord ? 'Save Changes' : 'Confirm & Save Record'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: BOOK / CUSTOMIZE APPOINTMENT */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveAppointment}
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn"
          >
            <div className="p-5 border-b border-[#DDE5F0] bg-[#F3F7FC] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#12234B] text-white flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-[#6FE0B0]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#12234B]">
                    {editingAppointment ? 'Customize / Reschedule Appointment' : 'Book Clinical Consultation'}
                  </h3>
                  <div className="text-xs text-[#5B6478]">
                    Schedule hospital appointments or encrypted telehealth video sessions
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBookModal(false)}
                className="text-[#5B6478] hover:text-[#12234B] text-sm font-semibold p-1 rounded-lg hover:bg-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <label className="block text-[#5B6478] mb-1 font-medium">Physician Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Evelyn Martinez, MD"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Specialty</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cardiology, Dentistry, Dermatology"
                    value={aptSpecialty}
                    onChange={(e) => setAptSpecialty(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Hospital / Facility</label>
                  <input
                    type="text"
                    required
                    value={aptHospital}
                    onChange={(e) => setAptHospital(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Date</label>
                  <input
                    type="date"
                    required
                    value={aptDate}
                    onChange={(e) => setAptDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50 font-mono-code"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 11:00 AM"
                    value={aptTime}
                    onChange={(e) => setAptTime(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50 font-mono-code"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Consultation Type</label>
                  <select
                    value={aptType}
                    onChange={(e) => setAptType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                  >
                    <option value="In-Person">In-Person Consultation</option>
                    <option value="Teleconsultation">Telehealth (Encrypted Video)</option>
                    <option value="Specialist Consultation">Specialist Consultation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Status</label>
                  <select
                    value={aptStatus}
                    onChange={(e) => setAptStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#5B6478] mb-1 font-medium">Room / Location / Video Link</label>
                <input
                  type="text"
                  value={aptRoom}
                  onChange={(e) => setAptRoom(e.target.value)}
                  placeholder="e.g. Suite 302, Clinical Wing or https://telemed..."
                  className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                />
              </div>
            </div>

            <div className="p-4 border-t border-[#DDE5F0] bg-[#F3F7FC] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowBookModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#5B6478] hover:bg-white rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#12234B] hover:bg-[#0A1730] text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs"
              >
                {editingAppointment ? 'Save Changes' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: ADD / CUSTOMIZE VACCINE */}
      {showAddVaccineModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveVaccine}
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn"
          >
            <div className="p-5 border-b border-[#DDE5F0] bg-[#F3F7FC] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#12234B] text-white flex items-center justify-center">
                  <Syringe className="w-4 h-4 text-[#6FE0B0]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#12234B]">
                    {editingVaccine ? 'Customize Vaccine Record' : 'Add Immunization Certificate'}
                  </h3>
                  <div className="text-xs text-[#5B6478]">
                    Sync with WHO Digital Vaccine Passport & Sovereign Registry
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddVaccineModal(false)}
                className="text-[#5B6478] hover:text-[#12234B] text-sm font-semibold p-1 rounded-lg hover:bg-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <label className="block text-[#5B6478] mb-1 font-medium">Vaccine Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. COVID-19 Updated Bivalent Spike mRNA"
                  value={vaccineName}
                  onChange={(e) => setVaccineName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Dose Identifier</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Booster Dose (Dose 4), Series Complete"
                    value={vaccineDose}
                    onChange={(e) => setVaccineDose(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Date Administered</label>
                  <input
                    type="date"
                    required
                    value={vaccineDate}
                    onChange={(e) => setVaccineDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50 font-mono-code"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Batch / Lot Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PFIZ-MRNA-9942B"
                    value={vaccineBatch}
                    onChange={(e) => setVaccineBatch(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50 font-mono-code"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Status</label>
                  <select
                    value={vaccineStatus}
                    onChange={(e) => setVaccineStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                  >
                    <option value="Valid">Valid</option>
                    <option value="Booster Due">Booster Due</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Administering Clinic / Facility</label>
                  <input
                    type="text"
                    required
                    value={vaccineClinic}
                    onChange={(e) => setVaccineClinic(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Next Due Date (Optional)</label>
                  <input
                    type="date"
                    value={vaccineNextDue}
                    onChange={(e) => setVaccineNextDue(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50 font-mono-code"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#DDE5F0] bg-[#F3F7FC] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddVaccineModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#5B6478] hover:bg-white rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#12234B] hover:bg-[#0A1730] text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs"
              >
                {editingVaccine ? 'Save Changes' : 'Confirm & Add Vaccine'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4: ADD / CUSTOMIZE PRESCRIPTION */}
      {showAddRxModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveRx}
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn"
          >
            <div className="p-5 border-b border-[#DDE5F0] bg-[#F3F7FC] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#12234B] text-white flex items-center justify-center">
                  <Pill className="w-4 h-4 text-[#6FE0B0]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#12234B]">
                    {editingRx ? 'Customize e-Prescription' : 'Add New e-Prescription'}
                  </h3>
                  <div className="text-xs text-[#5B6478]">
                    Electronic pharmacy prescription with verified refills
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddRxModal(false)}
                className="text-[#5B6478] hover:text-[#12234B] text-sm font-semibold p-1 rounded-lg hover:bg-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <label className="block text-[#5B6478] mb-1 font-medium">Medication Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cetirizine Hydrochloride, Rosuvastatin, Ergocalciferol"
                  value={rxMedication}
                  onChange={(e) => setRxMedication(e.target.value)}
                  className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Dosage</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10 mg, 500 mg, 2,000 IU"
                    value={rxDosage}
                    onChange={(e) => setRxDosage(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Frequency</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Once daily as needed"
                    value={rxFrequency}
                    onChange={(e) => setRxFrequency(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Prescribing Physician</label>
                  <input
                    type="text"
                    required
                    value={rxDoctor}
                    onChange={(e) => setRxDoctor(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Refills Remaining</label>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    required
                    value={rxRefills}
                    onChange={(e) => setRxRefills(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50 font-mono-code"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Start Date</label>
                  <input
                    type="date"
                    required
                    value={rxStartDate}
                    onChange={(e) => setRxStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50 font-mono-code"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">End / Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={rxEndDate}
                    onChange={(e) => setRxEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50 font-mono-code"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5B6478] mb-1 font-medium">Instructions & Details</label>
                <input
                  type="text"
                  value={rxInstructions}
                  onChange={(e) => setRxInstructions(e.target.value)}
                  placeholder="e.g. Take in the evening with water."
                  className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                />
              </div>

              <div>
                <label className="block text-[#5B6478] mb-1 font-medium">Status</label>
                <select
                  value={rxStatus}
                  onChange={(e) => setRxStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                >
                  <option value="Active">Active</option>
                  <option value="Refill Needed">Refill Needed</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="p-4 border-t border-[#DDE5F0] bg-[#F3F7FC] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddRxModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#5B6478] hover:bg-white rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#12234B] hover:bg-[#0A1730] text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs"
              >
                {editingRx ? 'Save Changes' : 'Confirm & Save e-Prescription'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
