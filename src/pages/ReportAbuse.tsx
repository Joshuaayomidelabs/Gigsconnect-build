import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  FileText, 
  ImageIcon, 
  X, 
  ChevronDown, 
  Check, 
  User, 
  Link as LinkIcon, 
  Mail, 
  Info, 
  PhoneCall,
  FileWarning,
  ArrowUp,
  MessageSquare,
  Copy,
  Image as ImageIcon2
} from 'lucide-react';

// Database Object Type Definition (Prepared for future Supabase integration)
export interface ReportAbuseObject {
  report_id: string;
  report_type: string;
  reported_content_url?: string;
  description: string;
  attachments: string[]; // URLs from Supabase Storage
  reporter_email: string;
  reporter_name?: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  moderation_notes?: string;
  resolution?: string;
}

const REPORT_TYPES = [
  'Creator Profile',
  'Community Post',
  'Comment',
  'Gig Listing',
  'Portfolio Content',
  'Message',
  'Copyright Violation',
  'Fake Account',
  'Scam',
  'Spam',
  'Harassment',
  'Hate Speech',
  'Violence',
  'Explicit Content',
  'Impersonation',
  'Other'
];

const REPORTABLE_ITEMS = [
  { id: 'spam', title: 'Spam', description: 'Unsolicited promotional content or repetitive messages.', icon: MessageSquare },
  { id: 'scams', title: 'Scams', description: 'Fraudulent schemes or attempts to steal money or information.', icon: AlertTriangle },
  { id: 'harassment', title: 'Harassment', description: 'Targeted bullying, stalking, or abusive behavior.', icon: ShieldAlert },
  { id: 'fake-profiles', title: 'Fake Profiles', description: 'Accounts that impersonate others or use false identities.', icon: User },
  { id: 'copyright', title: 'Copyright Violations', description: 'Unauthorized use of copyrighted material or IP.', icon: Copy },
  { id: 'violence', title: 'Violence', description: 'Graphic violence, gore, or threats of physical harm.', icon: FileWarning },
  { id: 'explicit', title: 'Explicit Content', description: 'Pornography or sexually explicit material.', icon: ImageIcon },
  { id: 'fraud', title: 'Fraud', description: 'Financial fraud or deceptive business practices.', icon: FileText },
  { id: 'marketplace', title: 'Marketplace Abuse', description: 'Manipulating reviews, fake gigs, or bait-and-switch pricing.', icon: ShieldAlert },
];

const FAQS = [
  {
    q: 'Can I report anonymously?',
    a: 'We require an email address to process reports to prevent spam and allow our team to follow up if more information is needed. Your identity will be kept strictly confidential and will not be shared with the reported user.'
  },
  {
    q: 'Will the reported user know who submitted the report?',
    a: 'No, your identity is kept confidential during our review process. The reported user will not be informed of who submitted the report against them.'
  },
  {
    q: 'How long does review take?',
    a: 'We aim to review all reports within 24-48 hours. Complex cases involving fraud or copyright infringement may take longer to investigate thoroughly.'
  },
  {
    q: 'Can I appeal a moderation decision?',
    a: 'Yes, if you believe a moderation action was taken in error, you can submit an appeal through our support channel. Appeals are reviewed by a different moderator to ensure fairness.'
  },
  {
    q: 'Can I report copyright infringement?',
    a: 'Yes. If you are the copyright owner, you can use this form. Please be sure to include links to the original work and the infringing content.'
  },
  {
    q: 'Can I upload screenshots?',
    a: 'Yes, Step 4 of the reporting process allows you to upload images and PDFs as evidence to support your claim.'
  }
];

const ReportAbuse: React.FC = () => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // Form State
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    reportType: '',
    contentUrl: '',
    description: '',
    name: '',
    email: '',
    confirmTruthful: false
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${(totalScroll / windowHeight) * 100}`;
      setReadingProgress(Number(scroll));
      setShowBackToTop(totalScroll > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(file => file.size <= 5 * 1024 * 1024); // 5MB limit
      setFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      const validFiles = newFiles.filter(file => file.size <= 5 * 1024 * 1024 && (file.type.startsWith('image/') || file.type === 'application/pdf'));
      setFiles(prev => [...prev, ...validFiles].slice(0, 5));
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.reportType) return;
    if (step === 3 && formData.description.length < 50) return;
    setStep(s => Math.min(5, s + 1));
  };

  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.confirmTruthful) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
      
      // Reset form
      setStep(1);
      setFormData({
        reportType: '',
        contentUrl: '',
        description: '',
        name: '',
        email: '',
        confirmTruthful: false
      });
      setFiles([]);
    }, 1500);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-[#111827] mb-4">What would you like to report?</h3>
            <p className="text-gray-500 mb-6">Select the category that best describes the issue you are reporting.</p>
            <div className="relative">
              <select
                name="reportType"
                value={formData.reportType}
                onChange={handleInputChange}
                className="w-full h-14 pl-4 pr-10 rounded-xl border-2 border-gray-200 bg-white focus:border-[#6C2BFF] focus:ring-0 outline-none transition-colors appearance-none text-[#111827] font-medium"
              >
                <option value="" disabled>Select a reason...</option>
                {REPORT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-[#111827] mb-4">Where is this content located?</h3>
            <p className="text-gray-500 mb-6">Provide the URL or link to the specific profile, gig, or post you are reporting (Optional, but helpful).</p>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                name="contentUrl"
                value={formData.contentUrl}
                onChange={handleInputChange}
                placeholder="https://gigsconnect.africa/..."
                className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-gray-200 bg-white focus:border-[#6C2BFF] focus:ring-0 outline-none transition-colors text-[#111827]"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-[#111827] mb-4">Describe the issue</h3>
            <p className="text-gray-500 mb-6">Please provide specific details about why you are reporting this. What happened? When? (Minimum 50 characters)</p>
            <div className="relative">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Please describe the issue in detail..."
                className="w-full h-48 p-4 rounded-xl border-2 border-gray-200 bg-white focus:border-[#6C2BFF] focus:ring-0 outline-none transition-colors resize-none text-[#111827]"
              ></textarea>
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <span className={`text-sm font-medium ${formData.description.length < 50 ? 'text-red-500' : 'text-green-500'}`}>
                  {formData.description.length} / 50 min
                </span>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-[#111827] mb-4">Evidence Upload (Optional)</h3>
            <p className="text-gray-500 mb-6">Upload screenshots, PDFs, or images that support your report.</p>
            
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100/50 transition-colors cursor-pointer group"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-[#6C2BFF]" />
              </div>
              <p className="font-bold text-[#111827] mb-1">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500">SVG, PNG, JPG or PDF (max. 5MB)</p>
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                multiple 
                accept="image/*,application/pdf"
                onChange={handleFileChange}
              />
            </div>

            {files.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="font-semibold text-sm text-[#111827] uppercase tracking-wider">Attached Files ({files.length}/5)</h4>
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      {file.type.startsWith('image/') ? <ImageIcon2 className="w-5 h-5 text-[#6C2BFF]" /> : <FileText className="w-5 h-5 text-[#6C2BFF]" />}
                      <span className="text-sm font-medium text-[#111827] truncate max-w-[200px] sm:max-w-xs">{file.name}</span>
                      <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 5:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-[#111827] mb-4">Your Contact Information</h3>
            <p className="text-gray-500 mb-6">We need your email to follow up on this report. Your identity will remain confidential.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">Name (Optional)</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Jane Doe"
                    className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-gray-200 bg-white focus:border-[#6C2BFF] focus:ring-0 outline-none transition-colors text-[#111827]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="jane@example.com"
                    required
                    className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-gray-200 bg-white focus:border-[#6C2BFF] focus:ring-0 outline-none transition-colors text-[#111827]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-6">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-1">
                    <input
                      type="checkbox"
                      name="confirmTruthful"
                      checked={formData.confirmTruthful}
                      onChange={handleInputChange}
                      className="w-5 h-5 border-2 border-gray-300 rounded peer appearance-none checked:bg-[#6C2BFF] checked:border-[#6C2BFF] transition-colors cursor-pointer"
                    />
                    <Check className="w-3.5 h-3.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors leading-relaxed">
                    I confirm that the information provided in this report is truthful, accurate, and submitted in good faith. I understand that submitting false or malicious reports may result in action against my account.
                  </span>
                </label>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-[#FAFAFA] flex flex-col font-sans min-h-screen">
      
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-[72px] lg:top-20 left-0 h-1 bg-[#6C2BFF] z-50 transition-all duration-75"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Hero Section */}
      <div className="pt-28 pb-16 px-6 md:px-8 bg-white border-b border-gray-100 relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#6C2BFF]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="max-w-[900px] mx-auto relative z-10">
          
          <nav className="flex text-sm text-gray-500 font-medium mb-8">
            <ol className="flex items-center space-x-2">
              <li><Link to="/" className="hover:text-[#6C2BFF] transition-colors">Home</Link></li>
              <li><span>/</span></li>
              <li className="text-[#111827]">Report Abuse</li>
            </ol>
          </nav>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#6C2BFF]/10 text-[#6C2BFF] flex items-center justify-center shadow-sm">
              <div className="relative">
                <ShieldAlert className="w-7 h-7" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-3 h-3 text-red-500" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#111827] tracking-tight">Report Abuse</h1>
          </div>
          
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed mb-8">
            Help us keep GigsConnect a safe, respectful, and professional community by reporting content or behavior that violates our policies.
          </p>

          <div className="inline-flex items-start sm:items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl max-w-3xl">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-sm text-blue-900 font-medium leading-relaxed">
              Every report is reviewed carefully by our moderation team. False or malicious reports may result in action against the reporting account.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-[900px] mx-auto w-full px-6 md:px-8 py-12 flex flex-col gap-16">
        
        {/* Report Form Section */}
        <section>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            
            {/* Progress Stepper */}
            <div className="bg-gray-50 p-6 md:p-8 border-b border-gray-100 flex items-center justify-between relative">
               <div className="absolute top-1/2 left-8 right-8 h-1 bg-gray-200 -translate-y-1/2 rounded-full hidden sm:block"></div>
               <div 
                 className="absolute top-1/2 left-8 h-1 bg-[#6C2BFF] -translate-y-1/2 rounded-full hidden sm:block transition-all duration-500 ease-out" 
                 style={{ width: `calc(${(step - 1) * 25}% - 0px)` }}
               ></div>
               
               {[1, 2, 3, 4, 5].map((num) => (
                 <div key={num} className="relative z-10 flex flex-col items-center gap-2">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                     step > num ? 'bg-[#6C2BFF] text-white' : 
                     step === num ? 'bg-white border-2 border-[#6C2BFF] text-[#6C2BFF]' : 
                     'bg-white border-2 border-gray-200 text-gray-400'
                   }`}>
                     {step > num ? <Check className="w-5 h-5" /> : num}
                   </div>
                   <span className={`text-xs font-semibold hidden sm:block ${step >= num ? 'text-[#111827]' : 'text-gray-400'}`}>
                     {num === 1 && 'Category'}
                     {num === 2 && 'Location'}
                     {num === 3 && 'Details'}
                     {num === 4 && 'Evidence'}
                     {num === 5 && 'Contact'}
                   </span>
                 </div>
               ))}
            </div>

            {/* Form Area */}
            <div className="p-6 md:p-10">
              <form onSubmit={handleSubmit}>
                <div className="min-h-[280px]">
                  {renderStepContent()}
                </div>

                {/* Form Navigation */}
                <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={step === 1}
                    className={`inline-flex items-center gap-2 px-6 h-12 rounded-xl font-bold text-sm transition-colors ${
                      step === 1 ? 'opacity-0 pointer-events-none' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  
                  {step < 5 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={
                        (step === 1 && !formData.reportType) || 
                        (step === 3 && formData.description.length < 50)
                      }
                      className="inline-flex items-center gap-2 px-8 h-12 rounded-xl bg-[#6C2BFF] text-white font-bold text-sm hover:bg-[#5A24D4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next Step <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!formData.email || !formData.confirmTruthful || isSubmitting}
                      className="inline-flex items-center gap-2 px-8 h-12 rounded-xl bg-[#111827] text-white font-bold text-sm hover:bg-black transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>Submit Report <CheckCircle2 className="w-4 h-4" /></>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* What Happens Next Timeline */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#111827]">What Happens Next?</h2>
            <p className="text-gray-500 mt-2">Our process for handling reports</p>
          </div>
          
          <div className="relative border-l-2 border-gray-100 ml-4 md:ml-0 md:border-l-0 md:border-t-2 md:flex md:justify-between pt-8 md:pt-12">
            {[
              { title: 'Report Submitted', desc: 'Your report is securely logged in our system.', icon: ShieldAlert },
              { title: 'Moderation Review', desc: 'Our Trust & Safety team begins an initial review.', icon: User },
              { title: 'Investigation', desc: 'We investigate the content and gather context.', icon: FileText },
              { title: 'Decision & Action', desc: 'Appropriate enforcement action is taken.', icon: CheckCircle2 }
            ].map((item, idx) => (
              <div key={idx} className="relative pl-8 md:pl-0 mb-8 md:mb-0 md:w-1/4 md:text-center group">
                <div className="absolute left-[-9px] md:left-1/2 md:top-[-60px] md:-translate-x-1/2 w-4 h-4 bg-white border-4 border-[#6C2BFF] rounded-full group-hover:scale-125 transition-transform"></div>
                <div className="hidden md:flex absolute top-[-84px] left-1/2 -translate-x-1/2 w-12 h-12 bg-gray-50 rounded-full items-center justify-center shadow-sm">
                  <item.icon className="w-5 h-5 text-[#6C2BFF]" />
                </div>
                <h4 className="font-bold text-[#111827] mb-1">{item.title}</h4>
                <p className="text-sm text-gray-500 md:px-4">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-8 italic">Response times may vary depending on report complexity and volume.</p>
        </section>

        {/* Emergency Notice */}
        <section>
          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
              <PhoneCall className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-900 mb-2">Emergency Notice</h3>
              <p className="text-red-800 leading-relaxed text-sm">
                This Report Abuse page is intended for issues related to GigsConnect policies. <strong>If you believe someone is in immediate danger or there is an urgent physical emergency</strong>, please contact your local emergency services or relevant law enforcement authorities immediately rather than relying on this reporting process.
              </p>
            </div>
          </div>
        </section>

        {/* What Can Be Reported Grid */}
        <section>
          <h2 className="text-2xl font-bold text-[#111827] mb-8">What Can Be Reported?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REPORTABLE_ITEMS.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-[#6C2BFF]/30 hover:shadow-md transition-all group">
                <div className="w-10 h-10 bg-[#6C2BFF]/10 text-[#6C2BFF] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-[#111827] mb-2">{item.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* False Reports Warning */}
        <section>
          <div className="bg-[#111827] text-white rounded-3xl p-8 md:p-10 text-center relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6C2BFF]/20 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <AlertTriangle className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Honesty in Reporting</h3>
              <p className="text-gray-300 leading-relaxed">
                We rely on our community to help keep GigsConnect safe. However, intentionally false, misleading, or malicious reports abuse the system and waste moderation resources. Submitting deliberately false reports may result in moderation actions against your own account, including permanent suspension. Please report honestly and accurately.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-[#111827] mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:border-[#6C2BFF]/30 transition-colors">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-bold text-[#111827] pr-8">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ${activeFaq === idx ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-gray-600 leading-relaxed text-sm">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Trust & Safety */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-[#6C2BFF] to-[#4B0082] rounded-3xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="relative z-10 max-w-xl mx-auto">
              <ShieldAlert className="w-12 h-12 text-white/80 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Contact Trust & Safety</h2>
              <p className="text-white/80 mb-8 text-lg">
                Have a complex issue or need to follow up on a previous report? Our dedicated team is here to help keep the platform safe.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:support@gigsconnect.africa" className="inline-flex items-center justify-center gap-2 px-8 h-14 rounded-xl bg-white text-[#4B0082] font-bold text-sm hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  <Mail className="w-5 h-5" /> Contact Support
                </a>
                <a href="https://gigsconnect.africa" className="inline-flex items-center justify-center gap-2 px-8 h-14 rounded-xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-all border border-white/20">
                  <Globe className="w-5 h-5" /> gigsconnect.africa
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-[#111827] mb-2">Report Submitted</h3>
            <p className="text-gray-600 mb-8">
              Thank you for helping keep GigsConnect safe. Our Trust & Safety team has received your report and will review it shortly.
            </p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full h-12 bg-[#111827] text-white rounded-xl font-bold hover:bg-black transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Back to top button */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-[#6C2BFF] hover:border-[#6C2BFF] shadow-lg flex items-center justify-center transition-all duration-300 z-40 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

    </div>
  );
};

export default ReportAbuse;
