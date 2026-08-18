import React, { useState } from 'react';
import { DigitalDocument } from '../types';
import {
  FileCheck2,
  Lock,
  Upload,
  Search,
  Share2,
  PenTool,
  CheckCircle2,
  AlertCircle,
  FileText,
  Shield,
  Eye,
  Trash2,
  Clock,
  ExternalLink,
  Copy,
  Hash,
} from 'lucide-react';

interface DocumentModuleProps {
  documents: DigitalDocument[];
  onAddDocument: (doc: DigitalDocument) => void;
  onSignDocument: (docId: string, signerName: string) => void;
  onRequestTrace: (description: string) => void;
}

export const DocumentModule: React.FC<DocumentModuleProps> = ({
  documents,
  onAddDocument,
  onSignDocument,
  onRequestTrace,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState<DigitalDocument | null>(null);
  const [showShareModal, setShowShareModal] = useState<DigitalDocument | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DigitalDocument | null>(null);
  const [signerName, setSignerName] = useState('Jasmitha R');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<DigitalDocument['category']>('Identity');
  const [uploadFormat, setUploadFormat] = useState<DigitalDocument['fileFormat']>('PDF');

  // Share form state
  const [shareRecipient, setShareRecipient] = useState('');
  const [shareDays, setShareDays] = useState('7');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const categories = ['All', 'Identity', 'Healthcare', 'Education', 'Legal & Property', 'Financial & Tax'];

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.verificationHash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    const randomHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    const newDoc: DigitalDocument = {
      id: `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
      title: uploadTitle.trim(),
      category: uploadCategory,
      fileFormat: uploadFormat,
      fileSize: `${(Math.random() * 4 + 1.2).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      eSigned: false,
      verificationHash: randomHash,
      securityLevel: 'Encrypted & Confidential',
      version: 'v1.0',
      sharedWith: [],
    };

    onAddDocument(newDoc);
    setShowUploadModal(false);
    setUploadTitle('');
    onRequestTrace(`Uploaded and encrypted document "${newDoc.title}" with AES-256-GCM`);
    showToast(`Document "${newDoc.title}" encrypted and stored into citizen vault.`);
  };

  const handleSignConfirm = () => {
    if (!showSignModal) return;
    onSignDocument(showSignModal.id, signerName);
    onRequestTrace(`Cryptographically signed "${showSignModal.title}" with e-KYC X.509 Certificate`);
    showToast(`Document "${showSignModal.title}" officially e-Signed & sealed.`);
    setShowSignModal(null);
  };

  const handleCreateShareLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showShareModal || !shareRecipient.trim()) return;

    onRequestTrace(`Generated time-expiring access grant for "${showShareModal.title}" to ${shareRecipient}`);
    showToast(`Generated secure 7-day token link for ${shareRecipient}.`);
    setShowShareModal(null);
    setShareRecipient('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#DDE5F0]">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-[#6D4AA8] font-semibold mb-1">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Module 04 · Digital Document Management</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#12234B]">Encrypted Digital Document Vault</h2>
          <p className="text-sm text-[#5B6478]">
            Sovereign cloud storage, cryptographic e-Signatures, SHA-256 verification, and expiring access tokens.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-[#6D4AA8] hover:bg-[#59398E] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Record</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="mb-6 p-3.5 bg-[#EFE8F8] border border-[#6D4AA8]/30 text-[#6D4AA8] rounded-lg text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#12234B] text-white'
                  : 'bg-white border border-[#DDE5F0] text-[#5B6478] hover:text-[#12234B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative sm:w-72">
          <Search className="w-3.5 h-3.5 text-[#8CA0C6] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents or hashes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#DDE5F0] rounded-lg text-xs focus:outline-none focus:border-[#12234B]"
          />
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white border border-[#DDE5F0] hover:border-[#6D4AA8]/40 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-[#EFE8F8] text-[#6D4AA8]">
                  {doc.category}
                </span>
                <div className="flex items-center gap-1.5">
                  {doc.isExpiringSoon && (
                    <span className="text-[10px] font-mono-code bg-[#FBEAEA] text-[#C6404A] px-2 py-0.5 rounded font-bold">
                      Expires Soon
                    </span>
                  )}
                  <span className="text-[10px] font-mono-code text-[#8CA0C6] bg-[#F3F7FC] px-1.5 py-0.5 rounded">
                    {doc.fileFormat} · {doc.fileSize}
                  </span>
                </div>
              </div>

              <h3 className="font-semibold text-sm text-[#12234B] mb-2 line-clamp-2">{doc.title}</h3>

              <div className="space-y-2 mb-4 text-xs">
                {doc.eSigned ? (
                  <div className="flex items-center gap-1.5 text-[#1E7D5C] font-medium bg-[#E6F5EF] p-2 rounded-lg text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">e-Signed: {doc.signedBy || 'Verified'}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-[#FCEEDC] p-2 rounded-lg text-[11px] text-[#D97F1F] font-medium">
                    <span>Signature Pending</span>
                    <button
                      onClick={() => setShowSignModal(doc)}
                      className="underline font-bold hover:opacity-80 cursor-pointer"
                    >
                      Sign Now
                    </button>
                  </div>
                )}

                <div className="bg-[#F3F7FC] p-2 rounded-lg border border-[#DDE5F0] flex items-center justify-between text-[10px] font-mono-code text-[#5B6478]">
                  <span className="truncate max-w-[190px]">SHA-256: {doc.verificationHash}</span>
                  <Lock className="w-3 h-3 text-[#1E7D5C] shrink-0" />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0F4FA] flex items-center justify-between text-xs">
              <button
                onClick={() => setPreviewDoc(doc)}
                className="text-[#12234B] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Record</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowShareModal(doc)}
                  aria-label="Share Document with Expiring Access"
                  className="p-1.5 text-[#5B6478] hover:text-[#12234B] hover:bg-[#F3F7FC] rounded-lg transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText?.(doc.verificationHash);
                    showToast('Document verification hash copied to clipboard.');
                  }}
                  aria-label="Copy Hash"
                  className="p-1.5 text-[#5B6478] hover:text-[#12234B] hover:bg-[#F3F7FC] rounded-lg transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleUploadSubmit}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4"
          >
            <div className="flex justify-between items-center pb-3 border-b border-[#DDE5F0]">
              <h3 className="font-bold text-[#12234B] text-sm flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#6D4AA8]" />
                <span>Upload & Encrypt Document</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-[#5B6478] hover:text-[#12234B] text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#5B6478] mb-1 font-medium">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. State Driving License Renewal 2026"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Category</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B]"
                  >
                    <option value="Identity">Identity</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Legal & Property">Legal & Property</option>
                    <option value="Financial & Tax">Financial & Tax</option>
                    <option value="Civic">Civic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#5B6478] mb-1 font-medium">Format</label>
                  <select
                    value={uploadFormat}
                    onChange={(e) => setUploadFormat(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B]"
                  >
                    <option value="PDF">PDF (Portable Document)</option>
                    <option value="JSON-LD">JSON-LD (Verifiable Credential)</option>
                    <option value="PNG">PNG Image Scan</option>
                    <option value="DOCX">DOCX Document</option>
                  </select>
                </div>
              </div>

              {/* Simulated drop zone */}
              <div className="border-2 border-dashed border-[#CBD6E6] rounded-xl p-6 text-center space-y-2 bg-[#F3F7FC]">
                <FileText className="w-8 h-8 text-[#6D4AA8] mx-auto" />
                <div className="text-xs font-semibold text-[#12234B]">Drag & Drop Document File Here</div>
                <div className="text-[11px] text-[#5B6478]">Automatic AES-256 client-side zero-knowledge encryption</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#DDE5F0]">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-3 py-2 text-xs text-[#5B6478] hover:bg-[#F3F7FC] rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#6D4AA8] hover:bg-[#59398E] text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs"
              >
                Encrypt & Store File
              </button>
            </div>
          </form>
        </div>
      )}

      {/* e-Sign Modal */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#DDE5F0]">
              <h3 className="font-bold text-[#12234B] text-sm flex items-center gap-2">
                <PenTool className="w-4 h-4 text-[#1E7D5C]" />
                <span>Legally Binding e-Sign Workflow</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowSignModal(null)}
                className="text-[#5B6478] hover:text-[#12234B] text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#F3F7FC] rounded-xl border border-[#DDE5F0]">
                <div className="text-[#5B6478] text-[11px]">Document to Sign:</div>
                <div className="font-semibold text-sm text-[#12234B]">{showSignModal.title}</div>
                <div className="text-[10px] font-mono-code text-[#8CA0C6] mt-1">ID: {showSignModal.id}</div>
              </div>

              <div>
                <label className="block text-[#5B6478] mb-1 font-medium">Authorized Signer Name</label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B]"
                />
              </div>

              <div className="border border-[#DDE5F0] rounded-xl p-4 bg-[#FAFDFB] text-center">
                <div className="text-[11px] text-[#5B6478] mb-2 font-mono-code">
                  DIGITAL SIGNATURE WATERMARK PREVIEW
                </div>
                <div className="font-serif italic text-xl text-[#12234B] border-b-2 border-dashed border-[#1E7D5C] pb-2 inline-block px-4">
                  {signerName}
                </div>
                <div className="text-[10px] font-mono-code text-[#1E7D5C] mt-2">
                  TIMESTAMP: {new Date().toISOString()} · X.509
                </div>
              </div>

              <div className="text-[11px] text-[#5B6478] leading-relaxed">
                By executing this action, you apply an immutable cryptographic signature linked to your National Digital ID under UNCITRAL Model Law on Electronic Signatures.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#DDE5F0]">
              <button
                type="button"
                onClick={() => setShowSignModal(null)}
                className="px-3 py-2 text-xs text-[#5B6478] hover:bg-[#F3F7FC] rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSignConfirm}
                className="px-4 py-2 bg-[#1E7D5C] hover:bg-[#155A42] text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs"
              >
                Apply Cryptographic e-Sign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expiring Share Link Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateShareLink}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4"
          >
            <div className="flex justify-between items-center pb-3 border-b border-[#DDE5F0]">
              <h3 className="font-bold text-[#12234B] text-sm flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#6D4AA8]" />
                <span>Create Time-Expiring Share Link</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowShareModal(null)}
                className="text-[#5B6478] hover:text-[#12234B] text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#F3F7FC] rounded-xl border border-[#DDE5F0]">
                <div className="text-[#5B6478] text-[11px]">Selected Record:</div>
                <div className="font-semibold text-[#12234B]">{showShareModal.title}</div>
              </div>

              <div>
                <label className="block text-[#5B6478] mb-1 font-medium">Authorized Recipient / Organization</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Department of Motor Vehicles or Dr. Martinez"
                  value={shareRecipient}
                  onChange={(e) => setShareRecipient(e.target.value)}
                  className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B]"
                />
              </div>

              <div>
                <label className="block text-[#5B6478] mb-1 font-medium">Link Expiration Window</label>
                <select
                  value={shareDays}
                  onChange={(e) => setShareDays(e.target.value)}
                  className="w-full px-3 py-2 border border-[#DDE5F0] rounded-lg focus:outline-none focus:border-[#12234B]"
                >
                  <option value="1">24 Hours (1 Day)</option>
                  <option value="3">72 Hours (3 Days)</option>
                  <option value="7">7 Days (Standard)</option>
                  <option value="30">30 Days (Extended)</option>
                </select>
              </div>

              <div className="p-3 rounded-lg bg-[#EFE8F8] text-[#6D4AA8] text-[11px]">
                The recipient receives a temporary bearer token. Once expired or revoked, access is immediately terminated across all CDN edges.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#DDE5F0]">
              <button
                type="button"
                onClick={() => setShowShareModal(null)}
                className="px-3 py-2 text-xs text-[#5B6478] hover:bg-[#F3F7FC] rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#6D4AA8] hover:bg-[#59398E] text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs"
              >
                Generate Token Link
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Document Detail Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#DDE5F0]">
              <h3 className="font-bold text-[#12234B] text-sm truncate pr-4">
                {previewDoc.title}
              </h3>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-[#5B6478] hover:text-[#12234B] text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-[#F3F7FC] p-3 rounded-xl border border-[#DDE5F0]">
                <div>
                  <span className="text-[#5B6478] block text-[11px]">Category:</span>
                  <span className="font-semibold text-[#12234B]">{previewDoc.category}</span>
                </div>
                <div>
                  <span className="text-[#5B6478] block text-[11px]">Version:</span>
                  <span className="font-mono-code font-bold text-[#12234B]">{previewDoc.version}</span>
                </div>
                <div>
                  <span className="text-[#5B6478] block text-[11px]">Format & Size:</span>
                  <span>{previewDoc.fileFormat} ({previewDoc.fileSize})</span>
                </div>
                <div>
                  <span className="text-[#5B6478] block text-[11px]">Upload Date:</span>
                  <span className="font-mono-code">{previewDoc.uploadDate}</span>
                </div>
              </div>

              <div>
                <span className="text-[#5B6478] block text-[11px] mb-1">Cryptographic Integrity Hash (SHA-256):</span>
                <div className="bg-[#12234B] text-[#6FE0B0] font-mono-code text-[10px] p-3 rounded-xl break-all">
                  {previewDoc.verificationHash}
                </div>
              </div>

              {previewDoc.eSigned && (
                <div className="p-3 bg-[#E6F5EF] rounded-xl border border-[#1E7D5C]/30 text-xs text-[#1E7D5C]">
                  <div className="font-semibold">Digitally Signed & Validated</div>
                  <div className="text-[11px] text-[#145C42]">Signer: {previewDoc.signedBy}</div>
                  {previewDoc.signTimestamp && (
                    <div className="text-[10px] font-mono-code mt-0.5">Timestamp: {previewDoc.signTimestamp}</div>
                  )}
                </div>
              )}

              {previewDoc.sharedWith.length > 0 && (
                <div>
                  <span className="text-[#5B6478] block text-[11px] mb-1">Active External Grants:</span>
                  <div className="space-y-1">
                    {previewDoc.sharedWith.map((share, i) => (
                      <div key={i} className="p-2 bg-[#F3F7FC] rounded-lg text-[11px] flex justify-between">
                        <span className="font-medium text-[#12234B]">{share.entity}</span>
                        <span className="text-[#5B6478] font-mono-code">Valid until {share.expiresAt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#DDE5F0]">
              <button
                onClick={() => {
                  onRequestTrace(`Downloaded decrypted payload for ${previewDoc.id}`);
                  showToast(`Decrypted payload saved to local client.`);
                  setPreviewDoc(null);
                }}
                className="px-4 py-2 bg-[#12234B] text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs"
              >
                Download Decrypted Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
