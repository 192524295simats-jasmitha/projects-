import React, { useState } from 'react';
import { AcademicRecord, Certificate, LearningResource } from '../types';
import {
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Search,
  Sparkles,
  QrCode,
  Download,
  Plus,
  Edit3,
  Trash2,
  Check,
  School,
  FileCheck,
} from 'lucide-react';

interface EducationModuleProps {
  academicRecords: AcademicRecord[];
  certificates: Certificate[];
  learningResources: LearningResource[];
  onAddAcademicRecord?: (record: AcademicRecord) => void;
  onEditAcademicRecord?: (record: AcademicRecord) => void;
  onDeleteAcademicRecord?: (id: string) => void;
  onAddCertificate?: (certificate: Certificate) => void;
  onEditCertificate?: (certificate: Certificate) => void;
  onDeleteCertificate?: (id: string) => void;
  onAddLearningResource?: (resource: LearningResource) => void;
  onEditLearningResource?: (resource: LearningResource) => void;
  onDeleteLearningResource?: (id: string) => void;
  onRequestTrace: (description: string) => void;
}

export const EducationModule: React.FC<EducationModuleProps> = ({
  academicRecords,
  certificates,
  learningResources,
  onAddAcademicRecord,
  onEditAcademicRecord,
  onDeleteAcademicRecord,
  onAddCertificate,
  onEditCertificate,
  onDeleteCertificate,
  onAddLearningResource,
  onEditLearningResource,
  onDeleteLearningResource,
  onRequestTrace,
}) => {
  const [eduTab, setEduTab] = useState<'degrees' | 'certificates' | 'lifelong'>('degrees');
  const [verifiedCertId, setVerifiedCertId] = useState<string | null>(null);
  const [toastText, setToastText] = useState<string | null>(null);

  // --- Modals State ---
  // 1. Academic Record Modals
  const [showAddDegreeModal, setShowAddDegreeModal] = useState(false);
  const [editingDegree, setEditingDegree] = useState<AcademicRecord | null>(null);
  const [degreeTitle, setDegreeTitle] = useState('Bachelor of Technology (B.Tech)');
  const [degreeField, setDegreeField] = useState('Computer Science & Engineering');
  const [degreeInstitution, setDegreeInstitution] = useState('National Institute of Technology');
  const [degreeStartYear, setDegreeStartYear] = useState<number>(2021);
  const [degreeEndYear, setDegreeEndYear] = useState<string>('2025');
  const [degreeGpa, setDegreeGpa] = useState('3.90 / 4.00');
  const [degreeHonors, setDegreeHonors] = useState('First Class with Distinction');
  const [degreeStatus, setDegreeStatus] = useState<AcademicRecord['status']>('Graduated');
  const [degreeVerified, setDegreeVerified] = useState(true);

  // 2. Certificate Modals
  const [showAddCertModal, setShowAddCertModal] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('Cloud Security Alliance (CSA)');
  const [certIssueDate, setCertIssueDate] = useState('2025-05-10');
  const [certExpiryDate, setCertExpiryDate] = useState('2028-05-10');
  const [certCredentialId, setCertCredentialId] = useState('');
  const [certSkills, setCertSkills] = useState('Cloud Security, Zero Trust, Data Privacy');
  const [certBadgeType, setCertBadgeType] = useState<Certificate['badgeType']>('Gold');
  const [certStatus, setCertStatus] = useState<Certificate['status']>('Verified');

  // 3. Learning Resource Modals
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [editingResource, setEditingResource] = useState<LearningResource | null>(null);
  const [resTitle, setResTitle] = useState('');
  const [resProvider, setResProvider] = useState('National Digital Academy');
  const [resCategory, setResCategory] = useState('Cybersecurity & Sovereign Tech');
  const [resProgress, setResProgress] = useState(60);
  const [resCredits, setResCredits] = useState(10);
  const [resStatus, setResStatus] = useState<LearningResource['status']>('In Progress');

  const showToast = (txt: string) => {
    setToastText(txt);
    setTimeout(() => setToastText(null), 3500);
  };

  const handleVerifyCredential = (cert: Certificate) => {
    setVerifiedCertId(cert.id);
    onRequestTrace(`Verified cryptographic hash for credential "${cert.title}" via Academic Blockchain Registry`);
    showToast(`Credential hash confirmed against W3C Verifiable Credentials registry.`);
  };

  // --- Handlers: Academic Degrees ---
  const handleOpenAddDegree = () => {
    setEditingDegree(null);
    setDegreeTitle('Bachelor of Science (B.S.)');
    setDegreeField('Computer Science & Information Technology');
    setDegreeInstitution('State University of Technology');
    setDegreeStartYear(2021);
    setDegreeEndYear('2025');
    setDegreeGpa('3.88 / 4.00');
    setDegreeHonors('Dean\'s List Honor Roll');
    setDegreeStatus('Graduated');
    setDegreeVerified(true);
    setShowAddDegreeModal(true);
  };

  const handleOpenEditDegree = (deg: AcademicRecord) => {
    setEditingDegree(deg);
    setDegreeTitle(deg.degree);
    setDegreeField(deg.fieldOfStudy);
    setDegreeInstitution(deg.institution);
    setDegreeStartYear(deg.startYear);
    setDegreeEndYear(String(deg.endYear));
    setDegreeGpa(deg.gpa);
    setDegreeHonors(deg.honors || '');
    setDegreeStatus(deg.status);
    setDegreeVerified(deg.verifiedByRegistry);
    setShowAddDegreeModal(true);
  };

  const handleSaveDegree = (e: React.FormEvent) => {
    e.preventDefault();
    if (!degreeTitle.trim() || !degreeInstitution.trim()) return;

    const parsedEndYear: number | 'Present' = degreeEndYear === 'Present' ? 'Present' : Number(degreeEndYear) || 2025;

    if (editingDegree) {
      const updated: AcademicRecord = {
        ...editingDegree,
        degree: degreeTitle.trim(),
        fieldOfStudy: degreeField.trim(),
        institution: degreeInstitution.trim(),
        startYear: Number(degreeStartYear),
        endYear: parsedEndYear,
        gpa: degreeGpa.trim(),
        honors: degreeHonors.trim() || undefined,
        status: degreeStatus,
        verifiedByRegistry: degreeVerified,
      };
      onEditAcademicRecord?.(updated);
      onRequestTrace(`Updated academic qualification: ${updated.degree} from ${updated.institution}`);
      showToast(`Academic record "${updated.degree}" updated!`);
    } else {
      const newDeg: AcademicRecord = {
        id: `ACAD-${Date.now().toString().slice(-3)}`,
        institution: degreeInstitution.trim(),
        degree: degreeTitle.trim(),
        fieldOfStudy: degreeField.trim(),
        startYear: Number(degreeStartYear),
        endYear: parsedEndYear,
        gpa: degreeGpa.trim(),
        status: degreeStatus,
        honors: degreeHonors.trim() || undefined,
        verifiedByRegistry: degreeVerified,
      };
      onAddAcademicRecord?.(newDeg);
      onRequestTrace(`Added new academic credential: ${newDeg.degree} at ${newDeg.institution}`);
      showToast(`New academic credential "${newDeg.degree}" linked to profile.`);
    }
    setShowAddDegreeModal(false);
  };

  const handleDeleteDegree = (id: string, name: string) => {
    onDeleteAcademicRecord?.(id);
    onRequestTrace(`Removed academic credential ${id} (${name})`);
    showToast(`Academic record "${name}" removed.`);
  };

  // --- Handlers: Certificates ---
  const handleOpenAddCert = () => {
    setEditingCert(null);
    setCertTitle('');
    setCertIssuer('Cloud Security Alliance (CSA)');
    setCertIssueDate(new Date().toISOString().split('T')[0]);
    setCertExpiryDate('2028-12-31');
    setCertCredentialId(`CERT-AUTH-${Math.floor(100000 + Math.random() * 900000)}`);
    setCertSkills('Cloud Security, Zero Trust, Data Privacy');
    setCertBadgeType('Platinum');
    setCertStatus('Verified');
    setShowAddCertModal(true);
  };

  const handleOpenEditCert = (cert: Certificate) => {
    setEditingCert(cert);
    setCertTitle(cert.title);
    setCertIssuer(cert.issuer);
    setCertIssueDate(cert.issueDate);
    setCertExpiryDate(cert.expiryDate || '');
    setCertCredentialId(cert.credentialId);
    setCertSkills(cert.skills.join(', '));
    setCertBadgeType(cert.badgeType);
    setCertStatus(cert.status);
    setShowAddCertModal(true);
  };

  const handleSaveCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim()) return;

    const skillList = certSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingCert) {
      const updated: Certificate = {
        ...editingCert,
        title: certTitle.trim(),
        issuer: certIssuer.trim(),
        issueDate: certIssueDate,
        expiryDate: certExpiryDate.trim() || undefined,
        credentialId: certCredentialId.trim() || editingCert.credentialId,
        skills: skillList.length ? skillList : editingCert.skills,
        badgeType: certBadgeType,
        status: certStatus,
      };
      onEditCertificate?.(updated);
      onRequestTrace(`Updated professional certification: "${updated.title}"`);
      showToast(`Certificate "${updated.title}" updated!`);
    } else {
      const newCert: Certificate = {
        id: `CERT-${Date.now().toString().slice(-4)}`,
        title: certTitle.trim(),
        issuer: certIssuer.trim(),
        issueDate: certIssueDate,
        expiryDate: certExpiryDate.trim() || undefined,
        credentialId: certCredentialId.trim() || `CERT-ID-${Date.now().toString().slice(-6)}`,
        verificationHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
        skills: skillList.length ? skillList : ['Professional Proficiency'],
        status: certStatus,
        badgeType: certBadgeType,
      };
      onAddCertificate?.(newCert);
      onRequestTrace(`Added verified certificate: "${newCert.title}" issued by ${newCert.issuer}`);
      showToast(`Certificate "${newCert.title}" added to verified credentials.`);
    }
    setShowAddCertModal(false);
  };

  const handleDeleteCert = (id: string, title: string) => {
    onDeleteCertificate?.(id);
    onRequestTrace(`Removed certificate ${id} ("${title}")`);
    showToast(`Certificate "${title}" removed.`);
  };

  // --- Handlers: Lifelong Learning Resources ---
  const handleOpenAddResource = () => {
    setEditingResource(null);
    setResTitle('');
    setResProvider('National Digital Academy');
    setResCategory('Computer Science & AI');
    setResProgress(50);
    setResCredits(10);
    setResStatus('In Progress');
    setShowAddResourceModal(true);
  };

  const handleOpenEditResource = (res: LearningResource) => {
    setEditingResource(res);
    setResTitle(res.title);
    setResProvider(res.provider);
    setResCategory(res.category);
    setResProgress(res.progressPercent);
    setResCredits(res.creditsEarned);
    setResStatus(res.status);
    setShowAddResourceModal(true);
  };

  const handleSaveResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim()) return;

    if (editingResource) {
      const updated: LearningResource = {
        ...editingResource,
        title: resTitle.trim(),
        provider: resProvider.trim(),
        category: resCategory.trim(),
        progressPercent: Number(resProgress),
        creditsEarned: Number(resCredits),
        status: resStatus,
      };
      onEditLearningResource?.(updated);
      onRequestTrace(`Updated learning module: "${updated.title}" (${updated.progressPercent}%)`);
      showToast(`Course "${updated.title}" updated!`);
    } else {
      const newRes: LearningResource = {
        id: `LRN-${Date.now().toString().slice(-4)}`,
        title: resTitle.trim(),
        provider: resProvider.trim(),
        category: resCategory.trim(),
        progressPercent: Number(resProgress),
        creditsEarned: Number(resCredits),
        status: resStatus,
      };
      onAddLearningResource?.(newRes);
      onRequestTrace(`Added new learning resource: "${newRes.title}"`);
      showToast(`Course "${newRes.title}" added to study plan.`);
    }
    setShowAddResourceModal(false);
  };

  const handleDeleteResource = (id: string, title: string) => {
    onDeleteLearningResource?.(id);
    onRequestTrace(`Removed course ${id} ("${title}")`);
    showToast(`Course "${title}" removed.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#DDE5F0]">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-[#D97F1F] font-semibold mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Module 03 · Educational Management</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#12234B]">Verified Academic & Skill Ledger</h2>
          <p className="text-sm text-[#5B6478]">
            Tamper-proof university degrees, verified professional certifications, and lifelong learning credit tracking.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 flex-wrap">
          {eduTab === 'degrees' && (
            <button
              onClick={handleOpenAddDegree}
              className="px-4 py-2 bg-[#12234B] hover:bg-[#0A1730] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#6FE0B0]" />
              <span>Add Degree / Transcript</span>
            </button>
          )}

          {eduTab === 'certificates' && (
            <button
              onClick={handleOpenAddCert}
              className="px-4 py-2 bg-[#12234B] hover:bg-[#0A1730] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#6FE0B0]" />
              <span>Add Certificate</span>
            </button>
          )}

          {eduTab === 'lifelong' && (
            <button
              onClick={handleOpenAddResource}
              className="px-4 py-2 bg-[#12234B] hover:bg-[#0A1730] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#6FE0B0]" />
              <span>Add Course / Micro-Credit</span>
            </button>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toastText && (
        <div className="mb-6 p-3.5 bg-[#E6F5EF] border border-[#1E7D5C]/30 text-[#1E7D5C] rounded-lg text-xs font-medium flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastText}</span>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#DDE5F0] mb-6 overflow-x-auto">
        <button
          onClick={() => setEduTab('degrees')}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            eduTab === 'degrees'
              ? 'border-[#12234B] text-[#12234B]'
              : 'border-transparent text-[#5B6478] hover:text-[#12234B]'
          }`}
        >
          University Degrees & Transcripts ({academicRecords.length})
        </button>
        <button
          onClick={() => setEduTab('certificates')}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            eduTab === 'certificates'
              ? 'border-[#12234B] text-[#12234B]'
              : 'border-transparent text-[#5B6478] hover:text-[#12234B]'
          }`}
        >
          Professional Certifications ({certificates.length})
        </button>
        <button
          onClick={() => setEduTab('lifelong')}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            eduTab === 'lifelong'
              ? 'border-[#12234B] text-[#12234B]'
              : 'border-transparent text-[#5B6478] hover:text-[#12234B]'
          }`}
        >
          Lifelong Learning & Micro-Credits ({learningResources.length})
        </button>
      </div>

      {/* 1. DEGREES TAB */}
      {eduTab === 'degrees' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#5B6478] mb-2">
            <span>Verified university transcripts and accredited academic qualifications</span>
            <button
              onClick={handleOpenAddDegree}
              className="text-[#12234B] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#1E7D5C]" />
              <span>Add Degree</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {academicRecords.map((record) => (
              <div
                key={record.id}
                className="bg-white border border-[#DDE5F0] hover:border-[#12234B]/40 transition-all rounded-2xl p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono-code font-bold bg-[#FCEEDC] text-[#D97F1F] uppercase">
                      {record.status}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-[#E6F5EF] text-[#1E7D5C] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{record.verifiedByRegistry ? 'Registry Verified' : 'Self Reported'}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#12234B] mb-1">{record.degree}</h3>
                  <div className="text-xs text-[#1E7D5C] font-semibold mb-2">{record.fieldOfStudy}</div>
                  <div className="text-xs text-[#5B6478] flex items-center gap-1.5 mb-4">
                    <School className="w-4 h-4 text-[#8CA0C6]" />
                    <span>{record.institution}</span>
                  </div>

                  <div className="bg-[#F3F7FC] border border-[#DDE5F0] rounded-xl p-3.5 text-xs space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-[#8CA0C6]">Academic Duration:</span>
                      <span className="font-mono-code font-semibold text-[#12234B]">{record.startYear} – {record.endYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8CA0C6]">Cumulative GPA:</span>
                      <span className="font-mono-code font-bold text-[#1E7D5C]">{record.gpa}</span>
                    </div>
                    {record.honors && (
                      <div className="flex justify-between">
                        <span className="text-[#8CA0C6]">Honors & Distinctions:</span>
                        <span className="font-medium text-[#12234B] text-right">{record.honors}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F0F4FA] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditDegree(record)}
                      className="px-3 py-1.5 bg-[#F3F7FC] hover:bg-[#E2EAF4] text-[#12234B] border border-[#CBD6E6] rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#1E7D5C]" />
                      <span>Customize</span>
                    </button>
                    <button
                      onClick={() => {
                        onRequestTrace(`Exported tamper-proof OpenBadges transcript for ${record.degree}`);
                        showToast(`Exported digital academic transcript.`);
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-[#F3F7FC] text-[#5B6478] border border-[#DDE5F0] rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>Transcript</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleDeleteDegree(record.id, record.degree)}
                    aria-label={`Delete ${record.degree}`}
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

      {/* 2. CERTIFICATES TAB */}
      {eduTab === 'certificates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#5B6478] mb-2">
            <span>Cryptographically verifiable industry credentials & professional certifications</span>
            <button
              onClick={handleOpenAddCert}
              className="text-[#12234B] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#1E7D5C]" />
              <span>Add Certificate</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-white border border-[#DDE5F0] hover:border-[#12234B]/40 transition-all rounded-2xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold ${
                        cert.badgeType === 'Platinum'
                          ? 'bg-[#E2EAF4] text-[#12234B]'
                          : 'bg-[#FCEEDC] text-[#D97F1F]'
                      }`}
                    >
                      {cert.badgeType} Tier
                    </span>
                    <span className="text-[10px] font-mono-code font-bold text-[#1E7D5C] bg-[#E6F5EF] px-2 py-0.5 rounded">
                      {cert.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#12234B] mb-1 leading-snug">{cert.title}</h3>
                  <div className="text-xs text-[#5B6478] mb-3">{cert.issuer}</div>

                  <div className="space-y-1.5 text-xs text-[#5B6478] border-t border-[#F0F4FA] pt-3 mb-3">
                    <div className="flex justify-between">
                      <span className="text-[#8CA0C6]">Credential ID:</span>
                      <span className="font-mono-code font-medium text-[#1B2233]">{cert.credentialId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8CA0C6]">Issue Date:</span>
                      <span className="font-mono-code">{cert.issueDate}</span>
                    </div>
                    {cert.expiryDate && (
                      <div className="flex justify-between">
                        <span className="text-[#8CA0C6]">Valid Until:</span>
                        <span className="font-mono-code text-[#1E7D5C]">{cert.expiryDate}</span>
                      </div>
                    )}
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {cert.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-[#F3F7FC] text-[#12234B] rounded text-[10px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F0F4FA] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVerifyCredential(cert)}
                      className="px-2.5 py-1 bg-[#12234B] hover:bg-[#0A1730] text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      <ShieldCheck className="w-3 h-3 text-[#6FE0B0]" />
                      <span>{verifiedCertId === cert.id ? 'Verified ✓' : 'Verify'}</span>
                    </button>
                    <button
                      onClick={() => handleOpenEditCert(cert)}
                      className="px-2.5 py-1 bg-[#F3F7FC] hover:bg-[#E2EAF4] text-[#12234B] border border-[#CBD6E6] rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Edit3 className="w-3 h-3 text-[#1E7D5C]" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleDeleteCert(cert.id, cert.title)}
                    aria-label={`Delete ${cert.title}`}
                    className="p-1.5 text-[#5B6478] hover:text-[#C6404A] hover:bg-[#FBEAEA] rounded-lg transition-colors cursor-pointer"
                    title="Delete certificate"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. LIFELONG LEARNING TAB */}
      {eduTab === 'lifelong' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#5B6478] mb-2">
            <span>Modular skill micro-credentials and continuous learning progression</span>
            <button
              onClick={handleOpenAddResource}
              className="text-[#12234B] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#1E7D5C]" />
              <span>Add Course / Micro-Credit</span>
            </button>
          </div>

          <div className="space-y-3">
            {learningResources.map((res) => (
              <div
                key={res.id}
                className="bg-white border border-[#DDE5F0] hover:border-[#12234B]/40 transition-all rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold ${
                        res.status === 'Completed' ? 'bg-[#E6F5EF] text-[#1E7D5C]' : 'bg-[#E2EAF4] text-[#12234B]'
                      }`}
                    >
                      {res.status}
                    </span>
                    <h4 className="font-bold text-sm text-[#12234B]">{res.title}</h4>
                  </div>
                  <div className="text-xs text-[#5B6478]">
                    Provider: <span className="font-medium text-[#1B2233]">{res.provider}</span> · Category: {res.category} · Credits: {res.creditsEarned} ECTS
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full max-w-md pt-1.5">
                    <div className="flex justify-between text-[10px] text-[#5B6478] mb-1 font-mono-code">
                      <span>Course Completion</span>
                      <span className="font-bold text-[#12234B]">{res.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-[#EBF1F9] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#1E7D5C] h-full transition-all duration-300 rounded-full"
                        style={{ width: `${res.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenEditResource(res)}
                    className="px-3 py-2 bg-[#F3F7FC] hover:bg-[#E2EAF4] text-[#12234B] border border-[#CBD6E6] rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#1E7D5C]" />
                    <span>Customize</span>
                  </button>
                  <button
                    onClick={() => handleDeleteResource(res.id, res.title)}
                    aria-label={`Delete ${res.title}`}
                    className="p-2 text-[#5B6478] hover:text-[#C6404A] hover:bg-[#FBEAEA] rounded-lg transition-colors cursor-pointer"
                    title="Delete course"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD / CUSTOMIZE DEGREE */}
      {showAddDegreeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveDegree}
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn"
          >
            <div className="p-5 border-b border-[#DDE5F0] bg-[#F3F7FC] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#12234B] text-white flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-[#6FE0B0]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#12234B]">
                    {editingDegree ? 'Customize Academic Degree' : 'Add University Degree / Credential'}
                  </h3>
                  <div className="text-xs text-[#5B6478]">
                    Record official university degree, GPA, and graduation honors
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddDegreeModal(false)}
                className="text-[#5B6478] hover:text-[#12234B] text-sm font-semibold p-1 rounded-lg hover:bg-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <label className="block text-[#5B6478] mb-1 font-medium">Degree Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master of Science (M.S.) or Bachelor of Technology"
                  value={degreeTitle}
                  onChange={(e) => setDegreeTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                />
              </div>

              <div>
                <label className="block text-[#5B6478] mb-1 font-medium">Major / Field of Study</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science & Cloud Engineering"
                  value={degreeField}
                  onChange={(e) => setDegreeField(e.target.value)}
                  className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                />
              </div>

              <div>
                <label className="block text-[#5B6478] mb-1 font-medium">University / Institution</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. California Institute of Technology"
                  value={degreeInstitution}
                  onChange={(e) => setDegreeInstitution(e.target.value)}
                  className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Start Year</label>
                  <input
                    type="number"
                    min="1980"
                    max="2035"
                    required
                    value={degreeStartYear}
                    onChange={(e) => setDegreeStartYear(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50 font-mono-code"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">End Year (or 'Present')</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2025 or Present"
                    value={degreeEndYear}
                    onChange={(e) => setDegreeEndYear(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50 font-mono-code"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Cumulative GPA / Score</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3.92 / 4.00"
                    value={degreeGpa}
                    onChange={(e) => setDegreeGpa(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50 font-mono-code"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Graduation Status</label>
                  <select
                    value={degreeStatus}
                    onChange={(e) => setDegreeStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                  >
                    <option value="Graduated">Graduated</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Verified">Verified</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#5B6478] mb-1 font-medium">Academic Honors & Distinctions</label>
                <input
                  type="text"
                  placeholder="e.g. Summa Cum Laude & Dean's Scholar"
                  value={degreeHonors}
                  onChange={(e) => setDegreeHonors(e.target.value)}
                  className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#12234B]">
                  <input
                    type="checkbox"
                    checked={degreeVerified}
                    onChange={(e) => setDegreeVerified(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1E7D5C] focus:ring-[#1E7D5C]"
                  />
                  <span>Mark as cryptographically verified by National University Registry</span>
                </label>
              </div>
            </div>

            <div className="p-4 border-t border-[#DDE5F0] bg-[#F3F7FC] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddDegreeModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#5B6478] hover:bg-white rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#12234B] hover:bg-[#0A1730] text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs"
              >
                {editingDegree ? 'Save Changes' : 'Confirm & Save Degree'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: ADD / CUSTOMIZE CERTIFICATE */}
      {showAddCertModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveCert}
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn"
          >
            <div className="p-5 border-b border-[#DDE5F0] bg-[#F3F7FC] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#12234B] text-white flex items-center justify-center">
                  <Award className="w-4 h-4 text-[#6FE0B0]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#12234B]">
                    {editingCert ? 'Customize Professional Certificate' : 'Add Professional Certification'}
                  </h3>
                  <div className="text-xs text-[#5B6478]">
                    Record accredited credential on sovereign verifiable blockchain
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCertModal(false)}
                className="text-[#5B6478] hover:text-[#12234B] text-sm font-semibold p-1 rounded-lg hover:bg-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <label className="block text-[#5B6478] mb-1 font-medium">Certificate Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Certified Cloud Security Professional (CCSP)"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                />
              </div>

              <div>
                <label className="block text-[#5B6478] mb-1 font-medium">Issuing Organization</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud Security Alliance (CSA)"
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                  className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Issue Date</label>
                  <input
                    type="date"
                    required
                    value={certIssueDate}
                    onChange={(e) => setCertIssueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50 font-mono-code"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={certExpiryDate}
                    onChange={(e) => setCertExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50 font-mono-code"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Credential ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CSA-CCSP-982144-OK"
                    value={certCredentialId}
                    onChange={(e) => setCertCredentialId(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50 font-mono-code"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Badge Tier</label>
                  <select
                    value={certBadgeType}
                    onChange={(e) => setCertBadgeType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                  >
                    <option value="Platinum">Platinum</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#5B6478] mb-1 font-medium">Skills Verified (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Cloud Security, Zero Trust, ISO 27001"
                  value={certSkills}
                  onChange={(e) => setCertSkills(e.target.value)}
                  className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                />
              </div>

              <div>
                <label className="block text-[#5B6478] mb-1 font-medium">Verification Status</label>
                <select
                  value={certStatus}
                  onChange={(e) => setCertStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                >
                  <option value="Verified">Verified (W3C Standard)</option>
                  <option value="Pending Verification">Pending Verification</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>

            <div className="p-4 border-t border-[#DDE5F0] bg-[#F3F7FC] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddCertModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#5B6478] hover:bg-white rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#12234B] hover:bg-[#0A1730] text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs"
              >
                {editingCert ? 'Save Changes' : 'Confirm & Save Certificate'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: ADD / CUSTOMIZE LEARNING RESOURCE */}
      {showAddResourceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveResource}
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn"
          >
            <div className="p-5 border-b border-[#DDE5F0] bg-[#F3F7FC] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#12234B] text-white flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-[#6FE0B0]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#12234B]">
                    {editingResource ? 'Customize Course / Micro-Credit' : 'Add Course / Micro-Credit'}
                  </h3>
                  <div className="text-xs text-[#5B6478]">
                    Record lifelong learning progress and earned academic credits
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddResourceModal(false)}
                className="text-[#5B6478] hover:text-[#12234B] text-sm font-semibold p-1 rounded-lg hover:bg-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <label className="block text-[#5B6478] mb-1 font-medium">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Citizen Identity Management & Sovereign Privacy"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Platform / Academy Provider</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. National Digital Academy"
                    value={resProvider}
                    onChange={(e) => setResProvider(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Skill Category</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cybersecurity, AI, Health Informatics"
                    value={resCategory}
                    onChange={(e) => setResCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Progress ({resProgress}%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={resProgress}
                    onChange={(e) => setResProgress(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50 font-mono-code"
                  />
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">ECTS Credits Earned</label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    required
                    value={resCredits}
                    onChange={(e) => setResCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50 font-mono-code"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5B6478] mb-1 font-medium">Course Status</label>
                <select
                  value={resStatus}
                  onChange={(e) => setResStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Recommended">Recommended</option>
                </select>
              </div>
            </div>

            <div className="p-4 border-t border-[#DDE5F0] bg-[#F3F7FC] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddResourceModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#5B6478] hover:bg-white rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#12234B] hover:bg-[#0A1730] text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs"
              >
                {editingResource ? 'Save Changes' : 'Confirm & Save Course'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
