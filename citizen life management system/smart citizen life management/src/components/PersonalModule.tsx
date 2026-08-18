import React, { useState } from 'react';
import { CitizenProfile, FamilyMember } from '../types';
import {
  User,
  ShieldCheck,
  QrCode,
  Users,
  Lock,
  Phone,
  Mail,
  MapPin,
  Heart,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Eye,
  Sliders,
  Edit3,
  Camera,
  Sparkles,
  Check,
  ShieldAlert,
} from 'lucide-react';

interface PersonalModuleProps {
  profile: CitizenProfile;
  onUpdateProfile: (updated: CitizenProfile) => void;
  onRequestTrace: (description: string) => void;
}

export const PersonalModule: React.FC<PersonalModuleProps> = ({
  profile,
  onUpdateProfile,
  onRequestTrace,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'family' | 'privacy' | 'identityPass'>('profile');
  const [showQrModal, setShowQrModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [editingFamilyMember, setEditingFamilyMember] = useState<FamilyMember | null>(null);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  // Customize Profile Form State
  const [formFullName, setFormFullName] = useState(profile.fullName);
  const [formPreferredName, setFormPreferredName] = useState(profile.preferredName);
  const [formDob, setFormDob] = useState(profile.dateOfBirth);
  const [formGender, setFormGender] = useState(profile.gender);
  const [formBloodType, setFormBloodType] = useState(profile.bloodType);
  const [formEmail, setFormEmail] = useState(profile.email);
  const [formPhone, setFormPhone] = useState(profile.phone);
  const [formStreet, setFormStreet] = useState(profile.address.street);
  const [formCity, setFormCity] = useState(profile.address.city);
  const [formState, setFormState] = useState(profile.address.state);
  const [formZip, setFormZip] = useState(profile.address.zipCode);
  const [formCountry, setFormCountry] = useState(profile.address.country);
  const [formEmergName, setFormEmergName] = useState(profile.emergencyContact.name);
  const [formEmergRelation, setFormEmergRelation] = useState(profile.emergencyContact.relation);
  const [formEmergPhone, setFormEmergPhone] = useState(profile.emergencyContact.phone);
  const [formAvatarUrl, setFormAvatarUrl] = useState(profile.avatarUrl || '');

  // Preset avatar selections
  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  ];

  // Dynamic Age calculation
  const calculateAge = (dobString: string) => {
    try {
      const birthDate = new Date(dobString);
      const now = new Date('2026-08-17');
      let age = now.getFullYear() - birthDate.getFullYear();
      const m = now.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
        age--;
      }
      return isNaN(age) ? 19 : age;
    } catch {
      return 19;
    }
  };

  // Add family member form state
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [newFamilyRelation, setNewFamilyRelation] = useState<FamilyMember['relationship']>('Mother');
  const [newFamilyDob, setNewFamilyDob] = useState('1975-05-18');
  const [newFamilyBlood, setNewFamilyBlood] = useState('O+');
  const [newFamilyNationalId, setNewFamilyNationalId] = useState('');
  const [newFamilyAccess, setNewFamilyAccess] = useState(true);

  // Edit family member state inside modal
  const [editMemberName, setEditMemberName] = useState('');
  const [editMemberRelation, setEditMemberRelation] = useState<FamilyMember['relationship']>('Mother');
  const [editMemberDob, setEditMemberDob] = useState('');
  const [editMemberBlood, setEditMemberBlood] = useState('O+');
  const [editMemberNationalId, setEditMemberNationalId] = useState('');
  const [editMemberAccess, setEditMemberAccess] = useState(true);

  const triggerSaveNotification = (msg: string) => {
    setSavedNotification(msg);
    setTimeout(() => setSavedNotification(null), 3500);
  };

  const handleOpenCustomize = () => {
    setFormFullName(profile.fullName);
    setFormPreferredName(profile.preferredName);
    setFormDob(profile.dateOfBirth);
    setFormGender(profile.gender);
    setFormBloodType(profile.bloodType);
    setFormEmail(profile.email);
    setFormPhone(profile.phone);
    setFormStreet(profile.address.street);
    setFormCity(profile.address.city);
    setFormState(profile.address.state);
    setFormZip(profile.address.zipCode);
    setFormCountry(profile.address.country);
    setFormEmergName(profile.emergencyContact.name);
    setFormEmergRelation(profile.emergencyContact.relation);
    setFormEmergPhone(profile.emergencyContact.phone);
    setFormAvatarUrl(profile.avatarUrl || '');
    setShowCustomizeModal(true);
  };

  const handleSaveCustomize = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CitizenProfile = {
      ...profile,
      fullName: formFullName.trim() || 'Jasmitha R',
      preferredName: formPreferredName.trim() || 'Jasmitha',
      dateOfBirth: formDob || '2007-07-30',
      gender: formGender,
      bloodType: formBloodType,
      email: formEmail.trim(),
      phone: formPhone.trim(),
      address: {
        street: formStreet.trim(),
        city: formCity.trim(),
        state: formState.trim(),
        zipCode: formZip.trim(),
        country: formCountry.trim(),
      },
      emergencyContact: {
        name: formEmergName.trim(),
        relation: formEmergRelation.trim(),
        phone: formEmergPhone.trim(),
      },
      avatarUrl: formAvatarUrl.trim() || presetAvatars[0],
    };

    onUpdateProfile(updated);
    setShowCustomizeModal(false);
    onRequestTrace(`Customized citizen profile attributes (Name: ${updated.fullName}, DOB: ${updated.dateOfBirth})`);
    triggerSaveNotification('Profile customized & synced with Citizen Sovereign Registry!');
  };

  const handleToggleConsent = (key: keyof CitizenProfile['privacySettings']) => {
    const updated = {
      ...profile,
      privacySettings: {
        ...profile.privacySettings,
        [key]: !profile.privacySettings[key],
      },
    };
    onUpdateProfile(updated);
    onRequestTrace(`Updated citizen privacy consent toggle for ${String(key)}`);
    triggerSaveNotification('Privacy preferences synced with Cloud Consent Ledger.');
  };

  // Open Edit Family Member Modal
  const handleOpenEditFamily = (member: FamilyMember) => {
    setEditingFamilyMember(member);
    setEditMemberName(member.fullName);
    setEditMemberRelation(member.relationship);
    setEditMemberDob(member.dateOfBirth);
    setEditMemberBlood(member.bloodGroup);
    setEditMemberNationalId(member.nationalId);
    setEditMemberAccess(member.hasAccess);
  };

  // Save Customized Family Member
  const handleSaveFamilyMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFamilyMember || !editMemberName.trim()) return;

    const updatedMembers = profile.familyMembers.map((m) =>
      m.id === editingFamilyMember.id
        ? {
            ...m,
            fullName: editMemberName.trim(),
            relationship: editMemberRelation,
            dateOfBirth: editMemberDob,
            bloodGroup: editMemberBlood,
            nationalId: editMemberNationalId.trim() || m.nationalId,
            hasAccess: editMemberAccess,
          }
        : m
    );

    const updatedProfile = {
      ...profile,
      familyMembers: updatedMembers,
    };

    onUpdateProfile(updatedProfile);
    setEditingFamilyMember(null);
    onRequestTrace(`Customized family dependent record for ${editMemberName} (${editMemberRelation})`);
    triggerSaveNotification(`Family member "${editMemberName}" updated successfully!`);
  };

  // Quick toggle proxy access from card
  const handleToggleFamilyAccess = (memberId: string) => {
    const target = profile.familyMembers.find((m) => m.id === memberId);
    const updatedMembers = profile.familyMembers.map((m) =>
      m.id === memberId ? { ...m, hasAccess: !m.hasAccess } : m
    );
    const updatedProfile = {
      ...profile,
      familyMembers: updatedMembers,
    };
    onUpdateProfile(updatedProfile);
    onRequestTrace(`Toggled proxy access for ${target?.fullName || memberId} to ${!target?.hasAccess}`);
    triggerSaveNotification(`Proxy access status updated for ${target?.fullName}.`);
  };

  const handleAddFamilyMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFamilyName.trim()) return;

    const newMember: FamilyMember = {
      id: `FAM-${Date.now().toString().slice(-4)}`,
      fullName: newFamilyName.trim(),
      relationship: newFamilyRelation,
      dateOfBirth: newFamilyDob,
      nationalId: newFamilyNationalId.trim() || `NAT-DEP-${Math.floor(1000 + Math.random() * 9000)}-Z`,
      hasAccess: newFamilyAccess,
      bloodGroup: newFamilyBlood,
    };

    const updated = {
      ...profile,
      familyMembers: [...profile.familyMembers, newMember],
    };
    onUpdateProfile(updated);
    setNewFamilyName('');
    setNewFamilyNationalId('');
    setShowAddFamily(false);
    onRequestTrace(`Added dependent family record for ${newFamilyName} (${newFamilyRelation})`);
    triggerSaveNotification(`Family member "${newFamilyName}" linked to citizen profile.`);
  };

  const handleRemoveFamilyMember = (id: string, name: string) => {
    const updated = {
      ...profile,
      familyMembers: profile.familyMembers.filter((m) => m.id !== id),
    };
    onUpdateProfile(updated);
    onRequestTrace(`Unlinked dependent record ${id} (${name})`);
    triggerSaveNotification(`Removed dependent "${name}".`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#DDE5F0]">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-[#1E7D5C] font-semibold mb-1">
            <User className="w-3.5 h-3.5" />
            <span>Module 01 · Personal Management</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#12234B]">Citizen Sovereign Identity</h2>
          <p className="text-sm text-[#5B6478]">
            Master identity record, cryptographic biometric binding, family linkages, and granular privacy controls.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleOpenCustomize}
            className="px-4 py-2 bg-[#12234B] hover:bg-[#0A1730] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#6FE0B0]" />
            <span>Customize Citizen Profile</span>
          </button>
          <button
            onClick={() => setShowQrModal(true)}
            className="px-4 py-2 bg-white hover:bg-[#EBF1F9] text-[#12234B] border border-[#CBD6E6] text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <QrCode className="w-4 h-4 text-[#12234B]" />
            <span>Digital Citizen QR Pass</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {savedNotification && (
        <div className="mb-6 p-3.5 bg-[#E6F5EF] border border-[#1E7D5C]/30 text-[#1E7D5C] rounded-lg text-xs font-medium flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{savedNotification}</span>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#DDE5F0] mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'profile'
              ? 'border-[#12234B] text-[#12234B]'
              : 'border-transparent text-[#5B6478] hover:text-[#12234B]'
          }`}
        >
          Citizen Overview
        </button>
        <button
          onClick={() => setActiveTab('family')}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'family'
              ? 'border-[#12234B] text-[#12234B]'
              : 'border-transparent text-[#5B6478] hover:text-[#12234B]'
          }`}
        >
          Family & Dependents ({profile.familyMembers.length})
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'privacy'
              ? 'border-[#12234B] text-[#12234B]'
              : 'border-transparent text-[#5B6478] hover:text-[#12234B]'
          }`}
        >
          Privacy & Consent Toggles
        </button>
      </div>

      {/* TAB 1: Profile Overview */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Identity Card Badge */}
          <div className="bg-gradient-to-br from-[#12234B] to-[#1E356A] text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#6FE0B0]" />
                  <span className="text-xs font-mono-code uppercase tracking-widest text-[#B7C4DE]">Smart Citizen ID</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-[#1E7D5C] text-white">
                  VERIFIED e-KYC
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="relative group">
                  <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-white/80" />
                    )}
                  </div>
                  <button
                    onClick={handleOpenCustomize}
                    aria-label="Customize Profile Photo"
                    className="absolute -bottom-1 -right-1 p-1 bg-[#1E7D5C] rounded-full text-white shadow-xs hover:bg-[#145C42] transition-colors cursor-pointer"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold">{profile.fullName}</h3>
                  <div className="text-xs text-[#B7C4DE] font-mono-code">{profile.id}</div>
                  <div className="text-xs text-[#6FE0B0] mt-1 font-medium">Blood Group: {profile.bloodType}</div>
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-white/15 pt-4">
                <div className="flex justify-between">
                  <span className="text-[#9FB3D9]">National ID:</span>
                  <span className="font-mono-code font-semibold">{profile.nationalId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9FB3D9]">Date of Birth:</span>
                  <span className="font-mono-code font-semibold">
                    {profile.dateOfBirth} (Age {calculateAge(profile.dateOfBirth)})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9FB3D9]">Gender:</span>
                  <span>{profile.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9FB3D9]">Biometrics:</span>
                  <span className="text-[#6FE0B0] font-semibold">Active & Tokenized</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-[#9FB3D9]">
              <button
                onClick={handleOpenCustomize}
                className="text-[#6FE0B0] hover:underline font-medium flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>Customize Profile Details</span>
              </button>
              <span className="font-mono-code">2026-2036</span>
            </div>
          </div>

          {/* Contact & Location Details */}
          <div className="bg-white border border-[#DDE5F0] rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-[#12234B] flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#1E7D5C]" />
                  <span>Contact & Communication</span>
                </h3>
                <button
                  onClick={handleOpenCustomize}
                  className="text-xs text-[#12234B] hover:underline font-semibold cursor-pointer"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-2.5 text-xs text-[#5B6478]">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#8CA0C6]" />
                  <span className="font-medium text-[#1B2233]">{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#8CA0C6]" />
                  <span className="font-medium text-[#1B2233]">{profile.phone}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#F0F4FA] pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-[#12234B] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#1E7D5C]" />
                  <span>Registered Sovereign Address</span>
                </h3>
                <button
                  onClick={handleOpenCustomize}
                  className="text-xs text-[#12234B] hover:underline font-semibold cursor-pointer"
                >
                  Edit
                </button>
              </div>
              <div className="text-xs text-[#5B6478] space-y-1">
                <p className="font-medium text-[#1B2233]">{profile.address.street}</p>
                <p>{profile.address.city}, {profile.address.state} {profile.address.zipCode}</p>
                <p>{profile.address.country}</p>
              </div>
            </div>

            <div className="border-t border-[#F0F4FA] pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-[#12234B] flex items-center gap-2 text-[#C6404A]">
                  <Heart className="w-4 h-4 text-[#C6404A]" />
                  <span>Designated Emergency Contact</span>
                </h3>
                <button
                  onClick={handleOpenCustomize}
                  className="text-xs text-[#C6404A] hover:underline font-semibold cursor-pointer"
                >
                  Edit
                </button>
              </div>
              <div className="bg-[#FBEAEA] border border-[#C6404A]/20 rounded-xl p-3 text-xs text-[#1B2233]">
                <div className="font-semibold">{profile.emergencyContact.name}</div>
                <div className="text-[#5B6478] text-[11px]">Relationship: {profile.emergencyContact.relation}</div>
                <div className="font-mono-code text-[#C6404A] font-semibold mt-1">{profile.emergencyContact.phone}</div>
              </div>
            </div>
          </div>

          {/* Security & Authentication Protocol */}
          <div className="bg-white border border-[#DDE5F0] rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="font-semibold text-sm text-[#12234B] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#1E7D5C]" />
              <span>Authentication & Security Credentials</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F3F7FC] border border-[#DDE5F0]">
                <div>
                  <div className="font-semibold text-[#12234B]">Two-Factor Auth (2FA)</div>
                  <div className="text-[11px] text-[#5B6478]">Hardware FIDO2 / Authenticator App</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E6F5EF] text-[#1E7D5C]">
                  ENABLED
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F3F7FC] border border-[#DDE5F0]">
                <div>
                  <div className="font-semibold text-[#12234B]">Biometric Facial Hash</div>
                  <div className="text-[11px] text-[#5B6478]">Enrolled on 2026-01-10 (KMS Protected)</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E6F5EF] text-[#1E7D5C]">
                  ENROLLED
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F3F7FC] border border-[#DDE5F0]">
                <div>
                  <div className="font-semibold text-[#12234B]">Public Encryption Key (PGP)</div>
                  <div className="text-[10px] font-mono-code text-[#5B6478] truncate max-w-[140px]">
                    0x84f9...399a
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E2EAF4] text-[#12234B]">
                  VALID
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onRequestTrace('Initiated FIDO2 Security Keys re-attestation')}
                className="w-full py-2 px-3 bg-[#E2EAF4] hover:bg-[#D4E2F2] text-[#12234B] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Audit Security Keys & Devices
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: Family & Dependents */}
      {activeTab === 'family' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-base text-[#12234B] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#1E7D5C]" />
                <span>Family Members & Dependents</span>
              </h3>
              <p className="text-xs text-[#5B6478]">
                Customize your family network (Mother, Father, Siblings, Dependents) with proxy health access and sovereign record linkage.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddFamily(!showAddFamily)}
                className="px-3.5 py-2 bg-[#12234B] hover:bg-[#0A1730] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#6FE0B0]" />
                <span>Add Family Member</span>
              </button>
            </div>
          </div>

          {/* Add Family Inline form */}
          {showAddFamily && (
            <form
              onSubmit={handleAddFamilyMember}
              className="bg-white border-2 border-[#1E7D5C]/40 rounded-2xl p-6 shadow-md space-y-4 animate-fadeIn"
            >
              <div className="flex items-center justify-between border-b border-[#DDE5F0] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#E6F5EF] text-[#1E7D5C] flex items-center justify-center font-bold text-xs">
                    +
                  </div>
                  <h4 className="font-bold text-xs text-[#12234B] uppercase tracking-wide">
                    Link New Family Member to Citizen Vault
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddFamily(false)}
                  className="text-xs text-[#5B6478] hover:text-[#12234B]"
                >
                  ✕ Close
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-[#5B6478] mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sasikala, Ramesh, Linges"
                    value={newFamilyName}
                    onChange={(e) => setNewFamilyName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]"
                  />
                </div>

                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Relationship</label>
                  <select
                    value={newFamilyRelation}
                    onChange={(e) => setNewFamilyRelation(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]"
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={newFamilyDob}
                    onChange={(e) => setNewFamilyDob(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC] font-mono-code"
                  />
                </div>

                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Blood Group</label>
                  <select
                    value={newFamilyBlood}
                    onChange={(e) => setNewFamilyBlood(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]"
                  >
                    <option value="O+">O Positive (O+)</option>
                    <option value="O-">O Negative (O-)</option>
                    <option value="A+">A Positive (A+)</option>
                    <option value="A-">A Negative (A-)</option>
                    <option value="B+">B Positive (B+)</option>
                    <option value="B-">B Negative (B-)</option>
                    <option value="AB+">AB Positive (AB+)</option>
                    <option value="AB-">AB Negative (AB-)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">National / Sovereign ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. NAT-IND-9082-1920-M (Leave blank to auto-generate)"
                    value={newFamilyNationalId}
                    onChange={(e) => setNewFamilyNationalId(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC] font-mono-code"
                  />
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#12234B]">
                    <input
                      type="checkbox"
                      checked={newFamilyAccess}
                      onChange={(e) => setNewFamilyAccess(e.target.checked)}
                      className="w-4 h-4 rounded text-[#1E7D5C] focus:ring-[#1E7D5C]"
                    />
                    <span>Grant Health & Emergency Proxy Access</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#DDE5F0]">
                <button
                  type="button"
                  onClick={() => setShowAddFamily(false)}
                  className="px-4 py-2 text-xs text-[#5B6478] hover:bg-[#F3F7FC] rounded-lg cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1E7D5C] hover:bg-[#155A42] text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm & Link Family Member</span>
                </button>
              </div>
            </form>
          )}

          {/* Family Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {profile.familyMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white border border-[#DDE5F0] hover:border-[#12234B]/40 transition-all rounded-2xl p-5 shadow-xs flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono-code font-bold bg-[#E2EAF4] text-[#12234B] uppercase tracking-wide">
                      {member.relationship}
                    </span>
                    <button
                      onClick={() => handleToggleFamilyAccess(member.id)}
                      title="Click to toggle Proxy Access"
                      className={`text-[10px] font-mono-code px-2 py-0.5 rounded-full font-semibold cursor-pointer transition-colors ${
                        member.hasAccess
                          ? 'bg-[#E6F5EF] text-[#1E7D5C] hover:bg-[#c9ebd9]'
                          : 'bg-[#FBEAEA] text-[#C6404A] hover:bg-[#fad8d8]'
                      }`}
                    >
                      {member.hasAccess ? '✓ Proxy Active' : '✕ Proxy Paused'}
                    </button>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-base text-[#12234B] mb-0.5">{member.fullName}</h4>
                      <div className="text-xs text-[#5B6478] font-mono-code">{member.nationalId}</div>
                    </div>

                    <button
                      onClick={() => handleOpenEditFamily(member)}
                      className="px-2.5 py-1 bg-[#F3F7FC] hover:bg-[#E2EAF4] text-[#12234B] border border-[#CBD6E6] rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      <Edit3 className="w-3 h-3 text-[#1E7D5C]" />
                      <span>Customize</span>
                    </button>
                  </div>
                  
                  <div className="space-y-1.5 text-xs text-[#5B6478] border-t border-[#F0F4FA] pt-3.5 mt-3">
                    <div className="flex justify-between">
                      <span className="text-[#8CA0C6]">Date of Birth:</span>
                      <span className="font-medium text-[#1B2233]">{member.dateOfBirth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8CA0C6]">Blood Group:</span>
                      <span className="font-semibold text-[#12234B]">{member.bloodGroup}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8CA0C6]">Proxy Access:</span>
                      <span className={member.hasAccess ? 'text-[#1E7D5C] font-semibold' : 'text-[#5B6478]'}>
                        {member.hasAccess ? 'Authorized for Clinical View' : 'Restricted'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#F0F4FA] flex items-center justify-between">
                  <button
                    onClick={() => onRequestTrace(`Audited EHR proxy records for ${member.fullName} (${member.relationship})`)}
                    className="text-xs font-semibold text-[#12234B] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>View Health Records</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => handleRemoveFamilyMember(member.id, member.fullName)}
                    aria-label={`Unlink ${member.fullName}`}
                    title={`Unlink ${member.fullName}`}
                    className="p-1.5 text-[#5B6478] hover:text-[#C6404A] hover:bg-[#FBEAEA] rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Privacy & Consent */}
      {activeTab === 'privacy' && (
        <div className="bg-white border border-[#DDE5F0] rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-semibold text-base text-[#12234B] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#1E7D5C]" />
              <span>Sovereign Data Privacy & External Disclosure Controls</span>
            </h3>
            <p className="text-xs text-[#5B6478] mt-1">
              You maintain 100% data ownership. Every external query by hospitals, universities, or tax authorities requires your cryptographically enforced consent.
            </p>
          </div>

          <div className="space-y-4">
            
            {/* Consent Item 1 */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#F3F7FC] border border-[#DDE5F0]">
              <div className="max-w-2xl">
                <div className="font-semibold text-xs sm:text-sm text-[#12234B]">
                  Share Clinical Records with Certified Healthcare Providers
                </div>
                <div className="text-xs text-[#5B6478] mt-0.5">
                  Allows emergency rooms and attending physicians to pull blood group, allergies, and diagnostic history during consultations.
                </div>
              </div>
              <button
                onClick={() => handleToggleConsent('shareWithHospitals')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  profile.privacySettings.shareWithHospitals ? 'bg-[#1E7D5C]' : 'bg-[#CBD6E6]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    profile.privacySettings.shareWithHospitals ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Consent Item 2 */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#F3F7FC] border border-[#DDE5F0]">
              <div className="max-w-2xl">
                <div className="font-semibold text-xs sm:text-sm text-[#12234B]">
                  Share Verified Academic Records with Accredited Universities & Employers
                </div>
                <div className="text-xs text-[#5B6478] mt-0.5">
                  Enables instant cryptographic verification of degrees, GPA, and certificates through OpenBadges standard.
                </div>
              </div>
              <button
                onClick={() => handleToggleConsent('shareWithUniversities')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  profile.privacySettings.shareWithUniversities ? 'bg-[#1E7D5C]' : 'bg-[#CBD6E6]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    profile.privacySettings.shareWithUniversities ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Consent Item 3 */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#F3F7FC] border border-[#DDE5F0]">
              <div className="max-w-2xl">
                <div className="font-semibold text-xs sm:text-sm text-[#12234B]">
                  Automated Interoperability with Government Portals (e-Tax, DMV, Municipal)
                </div>
                <div className="text-xs text-[#5B6478] mt-0.5">
                  Allows automatic renewal alerts and pre-filling of civic service forms without manual paper submission.
                </div>
              </div>
              <button
                onClick={() => handleToggleConsent('shareWithGovPortals')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  profile.privacySettings.shareWithGovPortals ? 'bg-[#1E7D5C]' : 'bg-[#CBD6E6]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    profile.privacySettings.shareWithGovPortals ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Consent Item 4 */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#F3F7FC] border border-[#DDE5F0]">
              <div className="max-w-2xl">
                <div className="font-semibold text-xs sm:text-sm text-[#12234B]">
                  Contribute Anonymized Public Health Data for Epidemiological Analytics
                </div>
                <div className="text-xs text-[#5B6478] mt-0.5">
                  Stripped of all personally identifiable information (PII) to aid municipal epidemic tracking and research.
                </div>
              </div>
              <button
                onClick={() => handleToggleConsent('allowAnonymousAnalytics')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  profile.privacySettings.allowAnonymousAnalytics ? 'bg-[#1E7D5C]' : 'bg-[#CBD6E6]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    profile.privacySettings.allowAnonymousAnalytics ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 1: CUSTOMIZE CITIZEN PROFILE */}
      {showCustomizeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveCustomize}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn my-6"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-[#DDE5F0] bg-[#F3F7FC] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#12234B] text-white flex items-center justify-center">
                  <Edit3 className="w-4 h-4 text-[#6FE0B0]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#12234B]">Customize Citizen Profile</h3>
                  <div className="text-xs text-[#5B6478]">
                    Update personal identity, DOB, contact information, and sovereign records
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomizeModal(false)}
                className="text-[#5B6478] hover:text-[#12234B] text-sm font-semibold p-1 rounded-lg hover:bg-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              
              {/* Section 1: Basic Identity */}
              <div>
                <h4 className="font-semibold text-xs text-[#12234B] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-[#1E7D5C]" />
                  <span>Primary Identity & Demographics</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#5B6478] mb-1 font-medium">Full Name (Official)</label>
                    <input
                      type="text"
                      required
                      value={formFullName}
                      onChange={(e) => setFormFullName(e.target.value)}
                      placeholder="e.g. Jasmitha R"
                      className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[#5B6478] mb-1 font-medium">Preferred First Name</label>
                    <input
                      type="text"
                      required
                      value={formPreferredName}
                      onChange={(e) => setFormPreferredName(e.target.value)}
                      placeholder="e.g. Jasmitha"
                      className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[#5B6478] mb-1 font-medium">Date of Birth (DOB)</label>
                    <input
                      type="date"
                      required
                      value={formDob}
                      onChange={(e) => setFormDob(e.target.value)}
                      className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50 font-mono-code"
                    />
                    <div className="text-[10px] text-[#1E7D5C] mt-1 font-mono-code">
                      Calculated Age: {calculateAge(formDob)} years
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#5B6478] mb-1 font-medium">Gender</label>
                    <select
                      value={formGender}
                      onChange={(e) => setFormGender(e.target.value)}
                      className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#5B6478] mb-1 font-medium">Blood Group</label>
                    <select
                      value={formBloodType}
                      onChange={(e) => setFormBloodType(e.target.value)}
                      className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                    >
                      <option value="O Positive (O+)">O Positive (O+)</option>
                      <option value="O Negative (O-)">O Negative (O-)</option>
                      <option value="A Positive (A+)">A Positive (A+)</option>
                      <option value="A Negative (A-)">A Negative (A-)</option>
                      <option value="B Positive (B+)">B Positive (B+)</option>
                      <option value="B Negative (B-)">B Negative (B-)</option>
                      <option value="AB Positive (AB+)">AB Positive (AB+)</option>
                      <option value="AB Negative (AB-)">AB Negative (AB-)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#5B6478] mb-1 font-medium">Citizen ID (Immutable)</label>
                    <input
                      type="text"
                      disabled
                      value={profile.id}
                      className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg bg-[#EBF1F9] text-[#5B6478] font-mono-code cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Avatar Photo Picker */}
              <div className="border-t border-[#F0F4FA] pt-4">
                <h4 className="font-semibold text-xs text-[#12234B] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5 text-[#1E7D5C]" />
                  <span>Profile Photo & Avatar</span>
                </h4>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  {presetAvatars.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormAvatarUrl(url)}
                      className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        formAvatarUrl === url ? 'border-[#12234B] ring-2 ring-[#6FE0B0]' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Or Custom Image URL</label>
                  <input
                    type="url"
                    value={formAvatarUrl}
                    onChange={(e) => setFormAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50 text-xs"
                  />
                </div>
              </div>

              {/* Section 3: Contact & Address */}
              <div className="border-t border-[#F0F4FA] pt-4">
                <h4 className="font-semibold text-xs text-[#12234B] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#1E7D5C]" />
                  <span>Contact & Sovereign Address</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#5B6478] mb-1 font-medium">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5B6478] mb-1 font-medium">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[#5B6478] mb-1 font-medium">Street Address</label>
                    <input
                      type="text"
                      required
                      value={formStreet}
                      onChange={(e) => setFormStreet(e.target.value)}
                      className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5B6478] mb-1 font-medium">City</label>
                    <input
                      type="text"
                      required
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5B6478] mb-1 font-medium">State / Province</label>
                    <input
                      type="text"
                      required
                      value={formState}
                      onChange={(e) => setFormState(e.target.value)}
                      className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5B6478] mb-1 font-medium">Zip / Postal Code</label>
                    <input
                      type="text"
                      required
                      value={formZip}
                      onChange={(e) => setFormZip(e.target.value)}
                      className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5B6478] mb-1 font-medium">Country</label>
                    <input
                      type="text"
                      required
                      value={formCountry}
                      onChange={(e) => setFormCountry(e.target.value)}
                      className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Emergency Contact */}
              <div className="border-t border-[#F0F4FA] pt-4">
                <h4 className="font-semibold text-xs text-[#C6404A] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-[#C6404A]" />
                  <span>Designated Emergency Contact</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#5B6478] mb-1 font-medium">Contact Name</label>
                    <input
                      type="text"
                      required
                      value={formEmergName}
                      onChange={(e) => setFormEmergName(e.target.value)}
                      className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5B6478] mb-1 font-medium">Relationship</label>
                    <input
                      type="text"
                      required
                      value={formEmergRelation}
                      onChange={(e) => setFormEmergRelation(e.target.value)}
                      className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5B6478] mb-1 font-medium">Emergency Phone</label>
                    <input
                      type="tel"
                      required
                      value={formEmergPhone}
                      onChange={(e) => setFormEmergPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]/50"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#DDE5F0] bg-[#F3F7FC] flex items-center justify-between">
              <div className="text-[11px] text-[#5B6478] font-mono-code">
                Updated timestamp: {new Date().toISOString().substring(0, 10)}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomizeModal(false)}
                  className="px-4 py-2 text-xs text-[#5B6478] hover:bg-white rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#12234B] hover:bg-[#0A1730] text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6FE0B0]" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: CUSTOMIZE INDIVIDUAL FAMILY MEMBER */}
      {editingFamilyMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveFamilyMember}
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-fadeIn my-6"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#DDE5F0] bg-[#F3F7FC] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#12234B] text-white flex items-center justify-center">
                  <Users className="w-4 h-4 text-[#6FE0B0]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#12234B]">Customize Family Member</h3>
                  <div className="text-xs text-[#5B6478]">
                    Edit details, relationship, and proxy access for {editingFamilyMember.fullName}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingFamilyMember(null)}
                className="text-[#5B6478] hover:text-[#12234B] text-sm font-semibold p-1 rounded-lg hover:bg-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form Fields */}
            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[#5B6478] mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  required
                  value={editMemberName}
                  onChange={(e) => setEditMemberName(e.target.value)}
                  placeholder="e.g. Sasikala, Ramesh, Linges"
                  className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Relationship</label>
                  <select
                    value={editMemberRelation}
                    onChange={(e) => setEditMemberRelation(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]"
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={editMemberDob}
                    onChange={(e) => setEditMemberDob(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC] font-mono-code"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Blood Group</label>
                  <select
                    value={editMemberBlood}
                    onChange={(e) => setEditMemberBlood(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC]"
                  >
                    <option value="O+">O Positive (O+)</option>
                    <option value="O-">O Negative (O-)</option>
                    <option value="A+">A Positive (A+)</option>
                    <option value="A-">A Negative (A-)</option>
                    <option value="B+">B Positive (B+)</option>
                    <option value="B-">B Negative (B-)</option>
                    <option value="AB+">AB Positive (AB+)</option>
                    <option value="AB-">AB Negative (AB-)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">National / Sovereign ID</label>
                  <input
                    type="text"
                    value={editMemberNationalId}
                    onChange={(e) => setEditMemberNationalId(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B] bg-[#F3F7FC] font-mono-code"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-[#F3F7FC] border border-[#DDE5F0] rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#12234B]">Healthcare Proxy Access</div>
                  <div className="text-[11px] text-[#5B6478]">Allow managing clinical records & appointments</div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditMemberAccess(!editMemberAccess)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    editMemberAccess ? 'bg-[#1E7D5C]' : 'bg-[#CBD6E6]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      editMemberAccess ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#DDE5F0] bg-[#F3F7FC] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingFamilyMember(null)}
                className="px-4 py-2 text-xs text-[#5B6478] hover:bg-white rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#12234B] hover:bg-[#0A1730] text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#6FE0B0]" />
                <span>Save Family Member</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* QR Digital Pass Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl text-center space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#DDE5F0]">
              <h3 className="font-bold text-[#12234B] text-sm">Smart Citizen Digital Pass</h3>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-[#5B6478] hover:text-[#12234B] text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-[#F3F7FC] border border-[#DDE5F0] rounded-xl flex flex-col items-center">
              {/* Simulated QR Code Canvas */}
              <div className="w-48 h-48 bg-white border-2 border-[#12234B] rounded-lg p-2 flex flex-col justify-between items-center shadow-xs">
                <div className="w-full flex justify-between">
                  <div className="w-8 h-8 border-2 border-[#12234B] flex items-center justify-center">
                    <div className="w-4 h-4 bg-[#12234B]" />
                  </div>
                  <div className="w-8 h-8 border-2 border-[#12234B] flex items-center justify-center">
                    <div className="w-4 h-4 bg-[#12234B]" />
                  </div>
                </div>
                <div className="font-mono-code text-[9px] text-[#12234B] text-center px-1 font-bold">
                  CIT-PASS://{profile.id}/{profile.nationalId}/DOB:{profile.dateOfBirth}
                </div>
                <div className="w-full flex justify-between">
                  <div className="w-8 h-8 border-2 border-[#12234B] flex items-center justify-center">
                    <div className="w-4 h-4 bg-[#12234B]" />
                  </div>
                  <div className="w-4 h-4 bg-[#1E7D5C] rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-mono-code text-[#1E7D5C] font-semibold mt-3">
                Cryptographically Signed & Timestamped
              </span>
            </div>

            <div className="text-xs text-[#5B6478]">
              Present this dynamic QR code at hospitals, airports, or civic offices for offline verification.
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2 bg-[#12234B] text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
