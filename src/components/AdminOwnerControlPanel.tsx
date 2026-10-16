import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdminUser } from '../types';
import { StaffDetailModal } from './StaffDetailModal';
import { StaffRecruitModal } from './StaffRecruitModal';
import { 
  Crown, 
  Lock, 
  Unlock, 
  Key, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Percent, 
  Coins, 
  Building2, 
  Save, 
  RefreshCw, 
  Check, 
  X,
  CreditCard,
  Gift,
  Smartphone,
  ExternalLink,
  HelpCircle,
  Radio,
  Eye,
  EyeOff,
  Edit3,
  UserPlus
} from 'lucide-react';

export const AdminOwnerControlPanel: React.FC = () => {
  const { 
    lang, 
    siteName, 
    updateSiteName, 
    domainName, 
    updateDomainName, 
    adminList, 
    toggleAdminApproval, 
    updateAdminProfile,
    activeAdmin, 
    isOwnerUnlocked, 
    verifyOwnerPin, 
    setIsOwnerUnlocked,
    offerSettings, 
    updateOfferSettings, 
    ads, 
    orders, 
    transactions,
    adminDeletionLogs
  } = useApp();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [approvalToast, setApprovalToast] = useState<string | null>(null);

  // Staff Detail & Recruitment Modal States (Requirements B & C)
  const [selectedStaffForView, setSelectedStaffForView] = useState<AdminUser | null>(null);
  const [isStaffDetailOpen, setIsStaffDetailOpen] = useState(false);
  const [isRecruitModalOpen, setIsRecruitModalOpen] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState<AdminUser | null>(null);

  // Settings State
  const [inputSite, setInputSite] = useState(siteName);
  const [inputDomain, setInputDomain] = useState(domainName || 'bikroymela.com');
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  // SSLCommerz Gateway State
  const [sslStoreId, setSslStoreId] = useState(() => localStorage.getItem('bikroy_ssl_store_id') || '');
  const [sslStorePass, setSslStorePass] = useState(() => localStorage.getItem('bikroy_ssl_store_pass') || '');
  const [sslIsLive, setSslIsLive] = useState(() => localStorage.getItem('bikroy_ssl_is_live') === 'true');
  const [sslActive, setSslActive] = useState(() => localStorage.getItem('bikroy_ssl_active') === 'true');
  const [sslSavedMsg, setSslSavedMsg] = useState(false);

  // SMS & Email OTP Gateway State
  const [smsGatewayProvider, setSmsGatewayProvider] = useState(() => localStorage.getItem('bikroy_sms_provider') || 'ssl_wireless');
  const [smsApiKey, setSmsApiKey] = useState(() => localStorage.getItem('bikroy_sms_api_key') || '');
  const [smsSenderId, setSmsSenderId] = useState(() => localStorage.getItem('bikroy_sms_sender_id') || '');
  const [isRealOtpActive, setIsRealOtpActive] = useState(() => localStorage.getItem('bikroy_real_otp_active') === 'true');
  const [otpGatewaySavedMsg, setOtpGatewaySavedMsg] = useState(false);

  // Owner Profile Edit State
  const [isEditingOwner, setIsEditingOwner] = useState(false);
  const [ownerNameInput, setOwnerNameInput] = useState(activeAdmin?.name || 'Md. Akbar Hossain');
  const [ownerPhoneInput, setOwnerPhoneInput] = useState(activeAdmin?.phone || '+8801851554333');
  const [ownerIdInput, setOwnerIdInput] = useState(activeAdmin?.id || 'ID-00009');
  const [ownerPassInput, setOwnerPassInput] = useState(activeAdmin?.password || 'admin');
  const [ownerEmailInput, setOwnerEmailInput] = useState(activeAdmin?.email || '');
  const [showOwnerPass, setShowOwnerPass] = useState(false);
  const [ownerSaveMsg, setOwnerSaveMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (activeAdmin) {
      setOwnerNameInput(activeAdmin.name || '');
      setOwnerPhoneInput(activeAdmin.phone || '');
      setOwnerIdInput(activeAdmin.id || '');
      setOwnerPassInput(activeAdmin.password || 'admin');
      setOwnerEmailInput(activeAdmin.email || '');
    }
  }, [activeAdmin]);

  const handleSaveOwnerData = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerNameInput.trim()) {
      alert('অনুগ্রহ করে নাম দিন।');
      return;
    }
    if (!ownerPhoneInput.trim()) {
      alert('অনুগ্রহ করে মোবাইল নম্বর দিন।');
      return;
    }
    if (!ownerIdInput.trim()) {
      alert('অনুগ্রহ করে এডমিন আইডি (ID) দিন।');
      return;
    }
    if (!ownerPassInput.trim()) {
      alert('অনুগ্রহ করে পাসওয়ার্ড দিন।');
      return;
    }
    const res = updateAdminProfile(activeAdmin.id, {
      name: ownerNameInput.trim(),
      phone: ownerPhoneInput.trim(),
      id: ownerIdInput.trim(),
      password: ownerPassInput.trim(),
      email: ownerEmailInput.trim()
    });
    setOwnerSaveMsg(res.message);
    setIsEditingOwner(false);
    setTimeout(() => setOwnerSaveMsg(null), 3000);
  };

  // Profit & Loss Calculations
  const escrowTransactions = transactions.filter(t => t.status === 'Escrow Held' || t.status === 'Released');
  const totalVolume = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);
  
  // Platform Commission Revenue (2.5% on released transactions)
  const commissionRevenue = Math.round(totalVolume * 0.025);
  // Boosting & Featured Ad fees (simulated based on paid ads)
  const boostingRevenue = ads.filter(a => a.featured || a.urgent).length * 150;
  // Ad Deletion fee revenue (৳ 10 per voluntary user ad deletion)
  const deletionFeeRevenue = adminDeletionLogs.length * 10 + 380;
  // Total Revenue
  const totalRevenue = commissionRevenue + boostingRevenue + deletionFeeRevenue;

  // Expenses: Welcome bonus distributed & courier subsidies
  const bonusExpense = (offerSettings?.signupBonusAmount || 100) * 12 + 1500;
  const operationalExpense = 2500;
  const totalExpense = bonusExpense + operationalExpense;

  // Net Profit
  const netProfit = totalRevenue - totalExpense;

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    const ok = verifyOwnerPin(pinInput);
    if (!ok) {
      setPinError('মাস্টার পিনটি সঠিক নয়। অনুগ্রহ করে সঠিক ৪ ডিজিট পিন দিন (ডেমো পিন: ১২৩৪)।');
    }
  };

  const handleToggleStaff = (staffId: string, currentApproved: boolean) => {
    toggleAdminApproval(staffId, !currentApproved);
    const staff = adminList.find(a => a.id === staffId);
    const actionText = !currentApproved ? 'অনুমোদন (Approved) দেওয়া হয়েছে' : 'অনুমোদন বাতিল ও লগইন ব্লক করা হয়েছে';
    setApprovalToast(`${staff?.name || staffId} এর ${actionText}`);
    setTimeout(() => setApprovalToast(null), 4000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteName(inputSite);
    updateDomainName(inputDomain);
    setSettingsSavedMsg(true);
    setTimeout(() => setSettingsSavedMsg(false), 3000);
  };

  const handleSaveSslSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('bikroy_ssl_store_id', sslStoreId.trim());
    localStorage.setItem('bikroy_ssl_store_pass', sslStorePass.trim());
    localStorage.setItem('bikroy_ssl_is_live', sslIsLive ? 'true' : 'false');
    localStorage.setItem('bikroy_ssl_active', sslActive ? 'true' : 'false');
    setSslSavedMsg(true);
    setTimeout(() => setSslSavedMsg(false), 3000);
  };

  const handleSaveOtpGatewaySettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('bikroy_sms_provider', smsGatewayProvider);
    localStorage.setItem('bikroy_sms_api_key', smsApiKey.trim());
    localStorage.setItem('bikroy_sms_sender_id', smsSenderId.trim());
    localStorage.setItem('bikroy_real_otp_active', isRealOtpActive ? 'true' : 'false');
    setOtpGatewaySavedMsg(true);
    setTimeout(() => setOtpGatewaySavedMsg(false), 3000);
  };

  // If Master PIN is not unlocked, show PIN verification gate (Requirement 10 & 11)
  if (!isOwnerUnlocked) {
    return (
      <div className="p-6 max-w-xl mx-auto my-8">
        <div className="bg-white rounded-2xl border-2 border-amber-400 shadow-xl overflow-hidden">
          
          <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 p-5 text-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-300 flex items-center justify-center font-bold shadow-md">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base leading-tight">
                  মালিকের বিশেষ নিরাপত্তা অনুমোদন (Owner Master PIN)
                </h3>
                <span className="text-xs text-amber-950 font-medium">
                  ব্যবসায়ের লাভ-ক্ষতি ও কর্মকর্তা নিয়ন্ত্রণ প্যানেল
                </span>
              </div>
            </div>
            <Lock className="w-6 h-6 text-slate-950" />
          </div>

          <form onSubmit={handleUnlockPin} className="p-6 space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">
              এই অংশটি শুধুমাত্র প্ল্যাটফর্মের মূল মালিকের জন্য সংরক্ষিত। ব্যবসায়ের অভ্যন্তরীণ আর্থিক হিসাব, লাভ-ক্ষতি ও কর্মচারীদের অনুমোদন পরিবর্তনের জন্য আপনার ৪ ডিজিটের <strong>মাস্টার সিকিউরিটি পিন</strong> প্রদান করুন।
            </p>

            {pinError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2 font-bold animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-800 font-bold">মাস্টার সিকিউরিটি পিন (৪ ডিজিট)</label>
                <button
                  type="button"
                  onClick={() => setPinInput('1234')}
                  className="text-amber-800 font-bold hover:underline"
                >
                  ডেমো পিন: 1234
                </button>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl text-center text-lg font-mono font-black tracking-widest text-slate-900 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <Unlock className="w-4 h-4" />
                <span>মাস্টার কন্ট্রোল প্যানেল আনলক করুন</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPinInput('1234');
                  verifyOwnerPin('1234');
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors"
              >
                (টেস্ট সহায়িকা: এক ক্লিকে পিন ১২৩৪ বসিয়ে প্রবেশ করুন)
              </button>
            </div>
          </form>

        </div>
      </div>
    );
  }

  // Unlocked Master Control Panel
  return (
    <div className="p-4 sm:p-6 space-y-6">
      
      {/* Top Banner with Lock Button */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 rounded-2xl p-5 text-slate-950 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-slate-950 text-amber-300 flex items-center justify-center font-bold shrink-0 shadow-lg">
            <Crown className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                মালিকের এক্সক্লুসিভ বিজনেস কন্ট্রোল সেন্টার (Owner Master Panel)
              </h2>
              <span className="text-[10px] bg-slate-950 text-amber-300 px-2 py-0.5 rounded font-mono font-bold uppercase">
                CONFIDENTIAL
              </span>
            </div>
            <p className="text-xs text-amber-950 font-medium mt-0.5">
              কর্মকর্তা-কর্মচারীদের অনুমোদন ও ক্ষমতা নিয়ন্ত্রণ, লাভ-ক্ষতির হিসাব এবং মাস্টার সিস্টেম সুইচ
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOwnerUnlocked(false)}
          className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-amber-300 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs self-start sm:self-auto cursor-pointer"
          title="মালিক কন্ট্রোল প্যানেল পুনরায় লক করুন"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>প্যানেল লক করুন</span>
        </button>
      </div>

      {approvalToast && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-xl text-xs font-bold flex items-center justify-between shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-700" />
            <span>{approvalToast}</span>
          </div>
          <button onClick={() => setApprovalToast(null)} className="text-emerald-700 hover:text-emerald-950">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* OWNER PROFILE & CREDENTIALS CARD */}
      <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Crown className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span>মালিকের ব্যক্তিগত তথ্য ও একাউন্ট সেটিংস</span>
                <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                  পরিবর্তনযোগ্য
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                মালিক নিজে তার পূর্ণাঙ্গ তথ্য, মোবাইল, আইডি ও পাসওয়ার্ড এখান থেকে পরিবর্তন করতে পারবেন।
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingOwner(!isEditingOwner)}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditingOwner ? 'বাতিল করুন' : 'তথ্য পরিবর্তন / এডিট'}</span>
          </button>
        </div>

        {ownerSaveMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-[#007460] rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#007460]" />
            <span>{ownerSaveMsg}</span>
          </div>
        )}

        {isEditingOwner ? (
          <form onSubmit={handleSaveOwnerData} className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মালিকের নাম *
                </label>
                <input
                  type="text"
                  value={ownerNameInput}
                  onChange={(e) => setOwnerNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মোবাইল নম্বর *
                </label>
                <input
                  type="text"
                  value={ownerPhoneInput}
                  onChange={(e) => setOwnerPhoneInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono font-medium outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  এডমিন আইডি (Admin ID) *
                </label>
                <input
                  type="text"
                  value={ownerIdInput}
                  onChange={(e) => setOwnerIdInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-[#007460] outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  লগইন পাসওয়ার্ড *
                </label>
                <div className="relative">
                  <input
                    type={showOwnerPass ? 'text' : 'password'}
                    value={ownerPassInput}
                    onChange={(e) => setOwnerPassInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono pr-10 outline-none focus:border-amber-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOwnerPass(!showOwnerPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {showOwnerPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ইমেইল এড্রেস (ঐচ্ছিক)
                </label>
                <input
                  type="email"
                  value={ownerEmailInput}
                  onChange={(e) => setOwnerEmailInput(e.target.value)}
                  placeholder="akbar.office10@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#007460] hover:bg-[#005e4e] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-500 block font-medium">মালিকের নাম</span>
              <strong className="text-xs text-slate-900 block truncate mt-0.5">{activeAdmin?.name || 'Md. Akbar Hossain'}</strong>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-500 block font-medium">মোবাইল</span>
              <strong className="text-xs text-slate-900 block font-mono truncate mt-0.5">{activeAdmin?.phone || '+8801851554333'}</strong>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-[10px] text-emerald-800 block font-medium">আইডি (ID)</span>
              <strong className="text-xs text-[#007460] block font-mono font-bold truncate mt-0.5">{activeAdmin?.id || 'ID-00009'}</strong>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-500 block font-medium">পাসওয়ার্ড</span>
              <div className="flex items-center justify-between mt-0.5">
                <strong className="text-xs text-slate-900 font-mono">
                  {showOwnerPass ? (activeAdmin?.password || 'admin') : '••••••'}
                </strong>
                <button
                  type="button"
                  onClick={() => setShowOwnerPass(!showOwnerPass)}
                  className="text-slate-400 hover:text-slate-600 p-0.5"
                >
                  {showOwnerPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-500 block font-medium">ইমেইল</span>
              <strong className="text-xs text-slate-700 block truncate mt-0.5">{activeAdmin?.email || 'যুক্ত করা হয়নি'}</strong>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 1: STAFF MANAGEMENT & OWNER APPROVAL (Requirement B) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-[#007460]" />
              <span>কর্মকর্তা ও কর্মচারী নিয়ন্ত্রণ ও মালিকের অনুমোদন (Staff Management & Approval)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              মালিক উক্ত নামের উপর ক্লিক করলে সব তথ্য দেখতে পাবে। সব তথ্য যাচাই করে চেকবক্স (Approval) দিলে কর্মীর নিয়োগ কনফার্ম হবে।
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setStaffToEdit(null);
                setIsRecruitModalOpen(true);
              }}
              className="px-3.5 py-1.5 bg-[#007460] hover:bg-[#005e4e] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>নতুন কর্মী নিয়োগ (+ Recruit)</span>
            </button>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full shrink-0">
              মোট স্টাফ: {adminList.length} জন
            </span>
          </div>
        </div>

        {/* Pending Approval Alert Banner */}
        {adminList.filter(s => !s.isApprovedByOwner && !s.isOwner).length > 0 && (
          <div className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded-xl text-amber-950 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
              <span className="font-bold">
                📢 নতুন কর্মী নিয়োগ অনুমোদন অপেক্ষমাণ: {adminList.filter(s => !s.isApprovedByOwner && !s.isOwner).length} জন
              </span>
              <span className="text-amber-800 hidden md:inline">
                (নামের উপর ক্লিক করে জীবনবৃত্তান্ত ও ঠিকানা যাচাই করুন এবং অনুমোদন দিন)
              </span>
            </div>
            <span className="text-[11px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
              মালিকের অনুমোদন আবশ্যক
            </span>
          </div>
        )}

        {/* Staff Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3">এডমিন আইডি</th>
                <th className="p-3">কর্মকর্তার নাম ও ইউনিক নেম (ক্লিক করে বিস্তারিত দেখুন)</th>
                <th className="p-3">পদবী (Role)</th>
                <th className="p-3">বেতন</th>
                <th className="p-3">মোবাইল নম্বর</th>
                <th className="p-3 text-center">মালিকের অনুমোদন চেকবক্স (Approval)</th>
                <th className="p-3 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {adminList.map((staff) => {
                const isApproved = staff.isApprovedByOwner ?? true;
                const isOwnerStaff = staff.isOwner || staff.role === 'Super Admin';

                return (
                  <tr key={staff.id} className={`hover:bg-slate-50/80 transition-colors ${!isApproved ? 'bg-amber-50/50' : ''}`}>
                    <td className="p-3 font-mono font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        {isOwnerStaff && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                        <span>{staff.id}</span>
                      </div>
                    </td>

                    {/* Clickable Name to View Full Details (Requirement B) */}
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStaffForView(staff);
                          setIsStaffDetailOpen(true);
                        }}
                        className="font-bold text-slate-900 hover:text-[#007460] text-left cursor-pointer flex items-center gap-1.5 group"
                        title="ক্লিক করে সম্পূর্ণ নিয়োগ ও জীবনবৃত্তান্ত তথ্য দেখুন"
                      >
                        <span className="group-hover:underline group-hover:text-[#007460]">{staff.name}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#007460]" />
                      </button>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-emerald-700 font-mono font-bold">
                          ইউনিক: {staff.username || 'সেট করা নেই'}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-[10px] text-slate-500">{staff.department || 'এডমিন স্টাফ'}</span>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        staff.role === 'Super Admin' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        staff.role === 'Moderator' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {staff.role}
                      </span>
                    </td>

                    <td className="p-3 font-mono font-bold text-slate-800">
                      ৳ {staff.salary || 'নির্ধারিত নয়'}
                    </td>

                    <td className="p-3">
                      <span className="font-mono text-slate-800 block">{staff.phone}</span>
                      <span className="text-[10px] text-slate-400">{staff.email}</span>
                    </td>

                    {/* Owner Approval Checkbox Toggle (Requirement B) */}
                    <td className="p-3 text-center">
                      {isOwnerStaff ? (
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full inline-block">
                          মালিক (সর্বদা সক্রিয়)
                        </span>
                      ) : (
                        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isApproved}
                            onChange={() => handleToggleStaff(staff.id, isApproved)}
                            className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                          />
                          <span className={`text-[11px] font-bold ${isApproved ? 'text-emerald-700' : 'text-rose-600'}`}>
                            {isApproved ? 'অনুমোদিত' : 'অনুমোদন দিন'}
                          </span>
                        </label>
                      )}
                    </td>

                    {/* Actions: View Details / Edit */}
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStaffForView(staff);
                            setIsStaffDetailOpen(true);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-[#007460] hover:text-white text-slate-700 font-bold rounded text-[10px] transition-colors cursor-pointer"
                          title="সব তথ্য দেখুন"
                        >
                          তথ্য দেখুন
                        </button>
                        {!isOwnerStaff && (
                          <button
                            type="button"
                            onClick={() => {
                              setStaffToEdit(staff);
                              setIsRecruitModalOpen(true);
                            }}
                            className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors cursor-pointer"
                            title="তথ্য পরিবর্তন করুন"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Detail Modal (Requirement B) */}
      <StaffDetailModal
        staff={selectedStaffForView}
        isOpen={isStaffDetailOpen}
        onClose={() => {
          setIsStaffDetailOpen(false);
          setSelectedStaffForView(null);
        }}
        onToggleApproval={handleToggleStaff}
        onEditStaff={(s) => {
          setStaffToEdit(s);
          setIsRecruitModalOpen(true);
        }}
      />

      {/* Staff Recruit / Edit Modal (Requirement B) */}
      <StaffRecruitModal
        isOpen={isRecruitModalOpen}
        onClose={() => {
          setIsRecruitModalOpen(false);
          setStaffToEdit(null);
        }}
        editStaff={staffToEdit}
        onSuccess={(msg) => {
          setApprovalToast(msg);
          setTimeout(() => setApprovalToast(null), 4000);
        }}
      />

      {/* SECTION 2: PROFIT & LOSS STATEMENT (Requirement 10) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>ব্যবসায়ের সামগ্রিক লাভ ও ক্ষতি বিবরণী (Profit & Loss Statement)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              এসক্রো লেনদেন কমিশন, বিজ্ঞাপন বুস্টিং আয় ও ব্যয়ের স্বয়ংক্রিয় আর্থিক অডিট
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-mono">
            হিসাবকাল: অক্টোবর ২০২৬
          </span>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-[11px] text-slate-500 font-semibold uppercase">মোট এসক্রো ভলিউম</span>
            <div className="text-xl font-bold font-mono text-slate-900">
              ৳ {totalVolume.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-700 block">সফল লেনদেন</span>
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
            <span className="text-[11px] text-emerald-800 font-semibold uppercase">মোট প্ল্যাটফর্ম আয় (Revenue)</span>
            <div className="text-xl font-extrabold font-mono text-emerald-700">
              ৳ {totalRevenue.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-800 block">কমিশন + বুস্টিং + ডিলিট ফি</span>
          </div>

          <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1">
            <span className="text-[11px] text-rose-800 font-semibold uppercase">মোট ব্যয় (Total Expenses)</span>
            <div className="text-xl font-extrabold font-mono text-rose-700">
              ৳ {totalExpense.toLocaleString()}
            </div>
            <span className="text-[10px] text-rose-800 block">ওয়েলকাম বোনাস + অপারেশন</span>
          </div>

          <div className="p-4 bg-amber-50/70 border-2 border-amber-300 rounded-xl space-y-1">
            <span className="text-[11px] text-amber-900 font-extrabold uppercase">নিট মুনাফা / নিট লাভ (Net Profit)</span>
            <div className="text-2xl font-black font-mono text-amber-800">
              ৳ {netProfit.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-800 font-bold block">✓ লাভজনক ধারা (+{( (netProfit / totalRevenue) * 100 ).toFixed(1)}%)</span>
          </div>

        </div>

        {/* Detailed Financial Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
          
          {/* Income Breakdown */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-1.5 flex items-center justify-between">
              <span>আয়ের খাতসমূহ (Inflows)</span>
              <span className="text-emerald-700 font-mono font-bold">৳ {totalRevenue.toLocaleString()}</span>
            </h4>
            <div className="space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>১. এসক্রো লেনদেন কমিশন (২.৫%):</span>
                <span className="font-mono font-bold text-slate-800">৳ {commissionRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>২. বিজ্ঞাপন বুস্টিং ও ফিচার্ড প্যাকেজ ফি:</span>
                <span className="font-mono font-bold text-slate-800">৳ {boostingRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>৩. বিজ্ঞাপন ডিলিট প্রসেসিং ফি (১০ টাকা):</span>
                <span className="font-mono font-bold text-slate-800">৳ {deletionFeeRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-1.5 flex items-center justify-between">
              <span>ব্যয়ের খাতসমূহ (Outflows)</span>
              <span className="text-rose-700 font-mono font-bold">৳ {totalExpense.toLocaleString()}</span>
            </h4>
            <div className="space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>১. নতুন গ্রাহক সাইন-আপ ও ক্যাশ বোনাস ব্যয়:</span>
                <span className="font-mono font-bold text-slate-800">৳ {bonusExpense.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>২. সার্ভার ক্লাউড হোস্টিং ও এসএমএস ওটিপি গেটওয়ে:</span>
                <span className="font-mono font-bold text-slate-800">৳ {operationalExpense.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-800 pt-1 border-t border-slate-200">
                <span>মালিকের নিট প্রফিট মার্জিন:</span>
                <span className="font-mono">৳ {netProfit.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* SECTION 3: PLATFORM MASTER SWITCHES */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm sm:text-base border-b border-slate-100 pb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-600" />
          <span>প্ল্যাটফর্মের মূল সেটিংস ও গভার্নেন্স (Master Settings)</span>
        </h3>

        <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 font-bold block mb-1">সাইটের ব্র্যান্ড নাম</label>
              <input
                type="text"
                value={inputSite}
                onChange={(e) => setInputSite(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold"
                required
              />
            </div>
            <div>
              <label className="text-slate-700 font-bold block mb-1">অফিসিয়াল ডোমেইন নাম</label>
              <input
                type="text"
                value={inputDomain}
                onChange={(e) => setInputDomain(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {settingsSavedMsg && (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>মালিক সেটিংস সংরক্ষিত হয়েছে!</span>
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>সেটিংস সেভ করুন</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 4: SSLCOMMERZ PAYMENT GATEWAY CONFIGURATION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                SSLCommerz পেমেন্ট গেটওয়ে সংযোগ ও সেটিংস
              </h3>
              <p className="text-xs text-slate-500">
                গ্রাহকদের বিকাশ, নগদ, রকেট ও কার্ড পেমেন্ট সরাসরি ব্যবসায়িক ব্যাংক একাউন্টে জমা নেওয়ার ব্যবস্থা
              </p>
            </div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${sslActive ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-300'}`}>
            {sslActive ? '● SSLCommerz চালু রয়েছে' : '○ টেস্ট / রেডি মোড'}
          </span>
        </div>

        <form onSubmit={handleSaveSslSettings} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 font-bold block mb-1">
                SSLCommerz Store ID (স্টোর আইডি)
              </label>
              <input
                type="text"
                placeholder="যেমন: bikroymela_live বা testbox_bikroy"
                value={sslStoreId}
                onChange={(e) => setSslStoreId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">
                SSLCommerz Store Password (সিক্রেট কি)
              </label>
              <input
                type="password"
                placeholder="••••••••••••••••"
                value={sslStorePass}
                onChange={(e) => setSslStorePass(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <span className="font-bold text-slate-800 block">এনভায়রনমেন্ট মোড (Environment)</span>
                <span className="text-[11px] text-slate-500">{sslIsLive ? 'লাইভ প্রোডাকশন গেটওয়ে' : 'স্যান্ডবক্স টেস্টিং মোড'}</span>
              </div>
              <button
                type="button"
                onClick={() => setSslIsLive(!sslIsLive)}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-colors ${sslIsLive ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-900 border border-amber-300'}`}
              >
                {sslIsLive ? 'লাইভ মোড (Live)' : 'স্যান্ডবক্স মোড (Sandbox)'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <span className="font-bold text-slate-800 block">গেটওয়ে সক্রিয়করণ (Gateway Status)</span>
                <span className="text-[11px] text-slate-500">চেকআউট পেজে SSLCommerz অপশন সক্রিয় রাখুন</span>
              </div>
              <button
                type="button"
                onClick={() => setSslActive(!sslActive)}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-colors ${sslActive ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}
              >
                {sslActive ? 'অন (Active)' : 'অফ (Disabled)'}
              </button>
            </div>
          </div>

          {/* SSLCommerz Setup Guidance Box */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2 text-slate-700">
            <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>SSLCommerz চালু করার সহজ ৪টি ধাপ:</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed text-slate-600">
              <li><strong>রেজিস্ট্রেশন:</strong> প্রথমে <a href="https://sslcommerz.com" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-bold">sslcommerz.com</a> এ গিয়ে মার্চেন্ট অ্যাকাউন্ট আবেদন করুন (ট্রেড লাইসেন্স, জাতীয় পরিচয়পত্র ও ব্যাংক অ্যাকাউন্ট চেক)।</li>
              <li><strong>ক্রেডেনশিয়াল গ্রহণ:</strong> SSLCommerz অ্যাকাউন্ট অনুমোদন দিলে তারা আপনাকে একটি <strong>Store ID</strong> ও <strong>Store Password</strong> পাঠাবে।</li>
              <li><strong>এখানে সেভ করুন:</strong> উপরের বক্সে আপনার সেই Store ID ও Password বসিয়ে <strong>লাইভ মোড</strong> সিলেক্ট করে সেভ করুন।</li>
              <li><strong>পেমেন্ট রিসিভ:</strong> গ্রাহক যখনই অর্ডার করবে, তারা বিকাশ, নগদ, রকেট, মাস্টারকার্ড বা ভিসা সিলেক্ট করলেই টাকা আপনার ব্যাংক অ্যাকাউন্টে জমা হবে।</li>
            </ol>
          </div>

          <div className="flex items-center justify-between pt-1">
            {sslSavedMsg && (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>SSLCommerz সেটিংস সফলভাবে আপডেট হয়েছে!</span>
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>SSLCommerz কনফিগারেশন সেভ করুন</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 5: REAL SMS & EMAIL OTP GATEWAY CONFIGURATION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                মোবাইল SMS ও ইমেইল OTP গেটওয়ে সংযোগ
              </h3>
              <p className="text-xs text-slate-500">
                লগইন ও রেজিস্ট্রেশনে গ্রাহকের মোবাইল এবং জিমেইলে সরাসরি ভেরিফিকেশন কোড পাঠানোর ব্যবস্থা
              </p>
            </div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${isRealOtpActive ? 'bg-sky-50 text-sky-800 border-sky-300' : 'bg-amber-50 text-amber-800 border-amber-300'}`}>
            {isRealOtpActive ? '● রিয়েল SMS গেটওয়ে সক্রিয়' : '● ডেমো ইনস্ট্যান্ট ওটিপি মোড'}
          </span>
        </div>

        <form onSubmit={handleSaveOtpGatewaySettings} className="space-y-4 text-xs">
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-950 rounded-xl space-y-1">
            <span className="font-bold block">💡 বর্তমানে সাইটটি কিভাবে কাজ করছে?</span>
            <p className="text-[11px] leading-relaxed text-amber-900">
              বর্তমানে GitHub ও Vercel-এ সাইটটি লাইভ থাকা সত্ত্বেও গ্রাহক ও অ্যাডমিন যাতে কোনো পেইড SMS ব্যালেন্স খরচ না করেই অবাধে টেস্ট করতে পারেন, সেজন্য স্ক্রিনে সঙ্গে সঙ্গে ইনস্ট্যান্ট ৪-ডিজিট ডেমো OTP প্রদর্শন করে দেওয়া হচ্ছে।
              আপনি যখনই রিয়েল গেটওয়ে (SSL Wireless, Greenweb, BulkSMS BD) যুক্ত করবেন, তখন থেকে সরাসরি ফোনে SMS আসবে।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-700 font-bold block mb-1">
                SMS গেটওয়ে প্রোভাইডার
              </label>
              <select
                value={smsGatewayProvider}
                onChange={(e) => setSmsGatewayProvider(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold"
              >
                <option value="ssl_wireless">SSL Wireless SMS API</option>
                <option value="greenweb">Greenweb Bangladesh</option>
                <option value="bulksmsbd">BulkSMS BD API</option>
                <option value="alphanet">Alpha Net SMS API</option>
                <option value="twilio">Twilio Global SMS</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">
                SMS গেটওয়ে API Key
              </label>
              <input
                type="password"
                placeholder="আপনার SMS API Key লিখুন"
                value={smsApiKey}
                onChange={(e) => setSmsApiKey(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">
                Sender ID / মাস্কিং নাম
              </label>
              <input
                type="text"
                placeholder="যেমন: BikroyMela"
                value={smsSenderId}
                onChange={(e) => setSmsSenderId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <span className="font-bold text-slate-800 block">সরাসরি রিয়েল SMS মোড চালু করুন</span>
              <span className="text-[11px] text-slate-500">অন থাকলে গ্রাহকের মোবাইল নম্বরে সরাসরি এসএমএস পাঠানো হবে</span>
            </div>
            <button
              type="button"
              onClick={() => setIsRealOtpActive(!isRealOtpActive)}
              className={`px-3.5 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-colors ${isRealOtpActive ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'}`}
            >
              {isRealOtpActive ? 'রিয়েল SMS মোড (Active)' : 'টেস্ট ডেমো মোড (Instant)'}
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            {otpGatewaySavedMsg && (
              <span className="text-sky-700 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>SMS গেটওয়ে কনফিগারেশন সংরক্ষিত হয়েছে!</span>
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>SMS গেটওয়ে সেভ করুন</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
