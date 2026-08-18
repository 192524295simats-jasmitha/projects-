export type ModuleType = 'overview' | 'personal' | 'healthcare' | 'education' | 'documents' | 'architecture' | 'sdg';

export type UserRole = 'citizen' | 'doctor' | 'educator' | 'admin';

export interface CitizenProfile {
  id: string;
  nationalId: string;
  fullName: string;
  preferredName: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  kycStatus: 'Verified' | 'Pending' | 'Action Required';
  biometricsEnrolled: boolean;
  twoFactorEnabled: boolean;
  avatarUrl?: string;
  familyMembers: FamilyMember[];
  privacySettings: {
    shareWithHospitals: boolean;
    shareWithUniversities: boolean;
    shareWithGovPortals: boolean;
    allowAnonymousAnalytics: boolean;
  };
}

export interface FamilyMember {
  id: string;
  fullName: string;
  relationship: 'Mother' | 'Father' | 'Parent' | 'Child' | 'Spouse' | 'Sibling' | 'Brother' | 'Sister' | 'Guardian';
  dateOfBirth: string;
  nationalId: string;
  hasAccess: boolean;
  bloodGroup: string;
}

export interface HealthRecord {
  id: string;
  date: string;
  type: 'Diagnosis' | 'Lab Result' | 'Clinical Note' | 'Surgery' | 'Vaccination';
  title: string;
  provider: string;
  department: string;
  summary: string;
  status: 'Normal' | 'Requires Attention' | 'Completed' | 'Critical';
  vitals?: {
    bloodPressure?: string;
    heartRate?: number;
    glucose?: number;
    weightKg?: number;
    spO2?: number;
  };
  attachments?: string[];
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  type: 'In-Person' | 'Teleconsultation' | 'Specialist Consultation';
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  roomOrLink: string;
}

export interface VaccinationItem {
  id: string;
  vaccineName: string;
  doseNumber: string;
  dateAdministered: string;
  nextDueDate?: string;
  clinic: string;
  batchNumber: string;
  status: 'Valid' | 'Booster Due' | 'Expired';
  qrVerificationCode: string;
}

export interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  prescribingDoctor: string;
  startDate: string;
  endDate: string;
  refillsRemaining: number;
  instructions: string;
  status: 'Active' | 'Refill Needed' | 'Completed';
}

export interface AcademicRecord {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number | 'Present';
  gpa: string;
  status: 'Graduated' | 'In Progress' | 'Verified';
  honors?: string;
  verifiedByRegistry: boolean;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  verificationHash: string;
  skills: string[];
  status: 'Verified' | 'Pending Verification' | 'Expired';
  badgeType: 'Gold' | 'Silver' | 'Platinum';
}

export interface LearningResource {
  id: string;
  title: string;
  provider: string;
  category: string;
  progressPercent: number;
  creditsEarned: number;
  status: 'In Progress' | 'Completed' | 'Recommended';
}

export interface DigitalDocument {
  id: string;
  title: string;
  category: 'Identity' | 'Healthcare' | 'Education' | 'Legal & Property' | 'Financial & Tax' | 'Civic';
  fileFormat: 'PDF' | 'PNG' | 'JSON-LD' | 'DOCX';
  fileSize: string;
  uploadDate: string;
  lastModified: string;
  expiryDate?: string;
  isExpiringSoon?: boolean;
  eSigned: boolean;
  signedBy?: string;
  signTimestamp?: string;
  verificationHash: string;
  securityLevel: 'Public' | 'Restricted' | 'Encrypted & Confidential';
  version: string;
  sharedWith: {
    entity: string;
    role: string;
    expiresAt: string;
    permission: 'View' | 'Download' | 'Verify';
  }[];
}

export interface SmartNotification {
  id: string;
  category: 'health' | 'document' | 'education' | 'security' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'urgent' | 'high' | 'normal' | 'info';
  actionLabel?: string;
  actionModule?: ModuleType;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  entity: string;
  ipAddress: string;
  status: 'Success' | 'Denied' | 'Flagged';
}

export interface TraceStep {
  layer: 'User Access' | 'API Gateway' | 'Microservices' | 'Common Services' | 'Platform Services' | 'Data Layer' | 'External APIs';
  service: string;
  description: string;
  latencyMs: number;
  status: '200 OK' | 'Encrypted' | 'Synced' | 'Cache Hit' | 'Verified';
}

export interface ArchitectureSimulation {
  id: string;
  name: string;
  userType: string;
  description: string;
  steps: TraceStep[];
  totalLatency: number;
  resultSummary: string;
}
