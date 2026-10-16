import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SystemBackup, ValidationStatus, AdminUser } from '../types';
import { AdminDeleteAdModal } from './AdminDeleteAdModal';
import { BusinessPolicyModal } from './BusinessPolicyModal';
import { OffersShowcaseModal } from './OffersShowcaseModal';
import { AdminAuthGate } from './AdminAuthGate';
import { AdminOwnerControlPanel } from './AdminOwnerControlPanel';
import { AdminAuditLogsTab } from './AdminAuditLogsTab';
import { AdminManageAccountView } from './AdminManageAccountView';
import { StaffRecruitModal } from './StaffRecruitModal';
import { StaffDetailModal } from './StaffDetailModal';
import { 
  ShieldCheck, 
  Crown,
  Lock,
  Unlock,
  LogOut,
  UserPlus,
  FileCheck,
  Layers, 
  CreditCard, 
  Users, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Star, 
  RefreshCw, 
  ArrowLeft,
  DollarSign,
  AlertTriangle,
  Truck,
  TrendingUp,
  Search,
  Filter,
  Copy,
  ExternalLink,
  Link as LinkIcon,
  Check,
  Wallet,
  CircleDollarSign,
  Percent,
  Banknote,
  HelpCircle,
  CheckCheck,
  Globe,
  Save,
  Sparkles,
  Laptop,
  Database,
  Download,
  Upload,
  HardDrive,
  FileSpreadsheet,
  FileJson,
  RotateCcw,
  Clock,
  DownloadCloud,
  ChevronDown,
  FileText,
  BookOpen,
  CheckSquare,
  ListFilter,
  X,
  Gift,
  BadgePercent,
  ArrowDownToLine,
  Send,
  Coins,
  Megaphone,
  UserCog,
  Edit3,
  Eye,
  EyeOff
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    lang, 
    t, 
    ads, 
    orders, 
    transactions, 
    currentUser, 
    updateAdStatus, 
    updateAdValidationStatus,
    updateTransactionStatus,
    setIsAdminMode,
    setSelectedAd,
    setActiveModal,
    siteName,
    updateSiteName,
    domainName,
    updateDomainName,
    exportBackupData,
    importBackupData,
    resetToFactoryData,
    offerSettings,
    updateOfferSettings,
    withdrawalRequests,
    updateWithdrawalStatus,
    grantCustomBonus,
    setAdminAdToDelete,
    adminAdToDelete,
    adminDeletionLogs,
    pruneExpiredAds,
    setIsOffersModalOpen,
    setIsPolicyModalOpen,
    isAdminAuthenticated,
    adminLogout,
    activeAdmin,
    adminList,
    toggleAdminApproval,
    updateAdminProfile,
    isOwnerUnlocked,
    setIsOwnerUnlocked
  } = useApp();

  // Manage Account View toggle (Requirement C)
  const [isManageAccountOpen, setIsManageAccountOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);

  // Staff Recruitment & View Detail Modals (Requirement B)
  const [isRecruitModalOpen, setIsRecruitModalOpen] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState<AdminUser | null>(null);
  const [selectedStaffForView, setSelectedStaffForView] = useState<AdminUser | null>(null);
  const [isStaffDetailOpen, setIsStaffDetailOpen] = useState(false);
  const [staffToast, setStaffToast] = useState<string | null>(null);

  if (!isAdminAuthenticated) {
    return <AdminAuthGate onBackToCustomer={() => setIsAdminMode(false)} />;
  }

  // If user clicked "Manage Accounts", render the dedicated Manage Account page (Requirement C)
  if (isManageAccountOpen) {
    return <AdminManageAccountView onBackToDashboard={() => setIsManageAccountOpen(false)} />;
  }

  // Owner Profile Edit Modal State
  const [isOwnerProfileModalOpen, setIsOwnerProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState(activeAdmin?.name || 'Md. Akbar Hossain');
  const [profilePhone, setProfilePhone] = useState(activeAdmin?.phone || '+8801851554333');
  const [profileId, setProfileId] = useState(activeAdmin?.id || 'ID-00009');
  const [profilePassword, setProfilePassword] = useState(activeAdmin?.password || 'admin');
  const [profileEmail, setProfileEmail] = useState(activeAdmin?.email || '');
  const [showProfilePass, setShowProfilePass] = useState(false);
  const [profileSavedMsg, setProfileSavedMsg] = useState<string | null>(null);

  // Sync profile fields when activeAdmin changes or modal opens
  React.useEffect(() => {
    if (activeAdmin) {
      setProfileName(activeAdmin.name || '');
      setProfilePhone(activeAdmin.phone || '');
      setProfileId(activeAdmin.id || '');
      setProfilePassword(activeAdmin.password || 'admin');
      setProfileEmail(activeAdmin.email || '');
    }
  }, [activeAdmin, isOwnerProfileModalOpen]);

  const handleSaveOwnerProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      alert('অনুগ্রহ করে নাম দিন।');
      return;
    }
    if (!profilePhone.trim()) {
      alert('অনুগ্রহ করে মোবাইল নম্বর দিন।');
      return;
    }
    if (!profileId.trim()) {
      alert('অনুগ্রহ করে এডমিন আইডি (ID) দিন।');
      return;
    }
    if (!profilePassword.trim()) {
      alert('অনুগ্রহ করে পাসওয়ার্ড দিন।');
      return;
    }
    const res = updateAdminProfile(activeAdmin.id, {
      name: profileName.trim(),
      phone: profilePhone.trim(),
      id: profileId.trim(),
      password: profilePassword.trim(),
      email: profileEmail.trim()
    });
    setProfileSavedMsg(res.message);
    setTimeout(() => {
      setProfileSavedMsg(null);
      setIsOwnerProfileModalOpen(false);
    }, 1500);
  };

  const [activeTab, setActiveTab] = useState<'ads' | 'transactions' | 'users' | 'orders' | 'revenue' | 'settings' | 'backup' | 'offers' | 'owner' | 'audit'>('ads');
  const [filterAdStatus, setFilterAdStatus] = useState<string>('all');
  const [adminSearch, setAdminSearch] = useState<string>('');
  const [copiedCustomerLink, setCopiedCustomerLink] = useState(false);
  const [copiedAdminLink, setCopiedAdminLink] = useState(false);
  const [commissionRate, setCommissionRate] = useState<number>(2.5);
  const [withdrawMethod, setWithdrawMethod] = useState<'bKash' | 'Nagad' | 'Bank'>('bKash');
  const [withdrawNumber, setWithdrawNumber] = useState('01855-667788');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Offers & Welcome Bonus State
  const [bonusAmountInput, setBonusAmountInput] = useState<number>(offerSettings?.signupBonusAmount || 100);
  const [bonusEnabledInput, setBonusEnabledInput] = useState<boolean>(offerSettings?.isBonusEnabled ?? true);
  const [minWithdrawInput, setMinWithdrawInput] = useState<number>(offerSettings?.minWithdrawLimit || 100);
  const [bannerActiveInput, setBannerActiveInput] = useState<boolean>(offerSettings?.isBannerActive ?? true);
  const [campaignTitleInput, setCampaignTitleInput] = useState<string>(offerSettings?.campaignTitleBn || '');
  const [campaignDescInput, setCampaignDescInput] = useState<string>(offerSettings?.campaignDescriptionBn || '');
  const [offerSavedMsg, setOfferSavedMsg] = useState(false);

  // Withdrawal Filter & Action State
  const [withdrawFilterStatus, setWithdrawFilterStatus] = useState<string>('all');
  const [payingRequestId, setPayingRequestId] = useState<string | null>(null);
  const [inputTrxId, setInputTrxId] = useState('');
  const [trxActionMsg, setTrxActionMsg] = useState<string | null>(null);

  // Custom Bonus Grant State
  const [grantPhone, setGrantPhone] = useState(currentUser?.phone || '01332520826');
  const [grantAmount, setGrantAmount] = useState<number>(100);
  const [grantNote, setGrantNote] = useState('নতুন বিক্রেতা ওয়েলকাম বোনাস');
  const [grantSuccessMsg, setGrantSuccessMsg] = useState('');

  // Dynamic Site & Domain Settings State
  const [inputSiteName, setInputSiteName] = useState(siteName);
  const [inputDomainName, setInputDomainName] = useState(domainName || 'bikroymela.com');
  const [siteSettingsSaved, setSiteSettingsSaved] = useState(false);
  const [pruneResultMsg, setPruneResultMsg] = useState<string | null>(null);
  const [showAuditLogsModal, setShowAuditLogsModal] = useState<boolean>(false);

  // Backup & Restore State (ডাটা ব্যাকআপ ও রিস্টোর)
  const [backupDownloadSuccess, setBackupDownloadSuccess] = useState<string | null>(null);
  const [restoreFile, setRestoreFile] = useState<SystemBackup | null>(null);
  const [restoreFileName, setRestoreFileName] = useState<string>('');
  const [restoreStatus, setRestoreStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState<string>(() => {
    return localStorage.getItem('bikroy_last_backup_time') || new Date().toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' });
  });

  // Excel Data Validation State (বিজ্ঞাপন অনুমোদন ও নিয়ন্ত্রণ)
  const [openValidationMenuAdId, setOpenValidationMenuAdId] = useState<string | null>(null);
  const [showValidationGuideModal, setShowValidationGuideModal] = useState(false);
  const [validationToast, setValidationToast] = useState<string | null>(null);

  const triggerDownload = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    const timeStr = new Date().toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' });
    setLastBackupTime(timeStr);
    localStorage.setItem('bikroy_last_backup_time', timeStr);
  };

  const handleDownloadFullBackup = () => {
    const fullBackup = exportBackupData();
    const jsonStr = JSON.stringify(fullBackup, null, 2);
    const dateStr = new Date().toISOString().slice(0, 10);
    const cleanSiteName = (siteName || 'BikroyMela').replace(/[^a-zA-Z0-9]/g, '_');
    triggerDownload(jsonStr, `${cleanSiteName}_Full_Backup_${dateStr}.json`, 'application/json');
    setBackupDownloadSuccess('সম্পূর্ণ সিস্টেম ডাটাবেজ ব্যাকআপ সফলভাবে ডাউনলোড হয়েছে (.json)');
    setTimeout(() => setBackupDownloadSuccess(null), 4000);
  };

  const handleDownloadAdsCSV = () => {
    const headers = ['আইডি', 'বিজ্ঞাপন শিরোনাম (বাংলা)', 'ক্যাটাগরি', 'কন্ডিশন', 'মূল্য (টাকা)', 'বিক্রেতার নাম', 'মোবাইল', 'এলাকা', 'বিভাগ', 'স্ট্যাটাস', 'ভিউ সংখ্যা'];
    const rows = ads.map(a => [
      `"${a.id}"`,
      `"${(a.titleBn || a.titleEn || '').replace(/"/g, '""')}"`,
      `"${a.category}"`,
      `"${a.condition}"`,
      `"${a.price}"`,
      `"${(a.sellerName || '').replace(/"/g, '""')}"`,
      `"${a.sellerPhone || ''}"`,
      `"${(a.location?.areaBn || '').replace(/"/g, '""')}"`,
      `"${a.location?.division || ''}"`,
      `"${a.status}"`,
      `"${a.views || 0}"`
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const dateStr = new Date().toISOString().slice(0, 10);
    const cleanSiteName = (siteName || 'BikroyMela').replace(/[^a-zA-Z0-9]/g, '_');
    triggerDownload(csvContent, `${cleanSiteName}_Ads_List_${dateStr}.csv`, 'text/csv;charset=utf-8;');
    setBackupDownloadSuccess('বিজ্ঞাপন ও প্রোডাক্টস তালিকা সফলভাবে CSV ফাইলে ডাউনলোড হয়েছে');
    setTimeout(() => setBackupDownloadSuccess(null), 4000);
  };

  const handleDownloadOrdersCSV = () => {
    const headers = ['অর্ডার আইডি', 'বিজ্ঞাপন শিরোনাম', 'ক্রেতার নাম', 'ক্রেতার মোবাইল', 'বিক্রেতার নাম', 'পণ্যমূল্য', 'ডেলিভারি ফি', 'মোট টাকা', 'পেমেন্ট মাধ্যম', 'এসক্রো স্ট্যাটাস', 'কুরিয়ার', 'ট্র্যাকিং নম্বর', 'অর্ডার স্ট্যাটাস', 'তারিখ'];
    const rows = orders.map(o => [
      `"${o.id}"`,
      `"${(o.adTitle || '').replace(/"/g, '""')}"`,
      `"${(o.buyerName || '').replace(/"/g, '""')}"`,
      `"${o.buyerPhone || ''}"`,
      `"${(o.sellerName || '').replace(/"/g, '""')}"`,
      `"${o.price}"`,
      `"${o.deliveryFee}"`,
      `"${o.totalAmount}"`,
      `"${o.paymentMethod}"`,
      `"${o.paymentStatus}"`,
      `"${o.courierName}"`,
      `"${o.trackingNumber}"`,
      `"${o.status}"`,
      `"${o.createdAt}"`
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const dateStr = new Date().toISOString().slice(0, 10);
    const cleanSiteName = (siteName || 'BikroyMela').replace(/[^a-zA-Z0-9]/g, '_');
    triggerDownload(csvContent, `${cleanSiteName}_Orders_Escrow_${dateStr}.csv`, 'text/csv;charset=utf-8;');
    setBackupDownloadSuccess('এসক্রো অর্ডার ও আর্থিক হিসেব সফলভাবে CSV ফাইলে ডাউনলোড হয়েছে');
    setTimeout(() => setBackupDownloadSuccess(null), 4000);
  };

  const handleDownloadUsersCSV = () => {
    const headers = ['ইউজার নাম', 'মোবাইল', 'ইমেইল', 'এনআইডি স্ট্যাটাস', 'ফোন ভেরিফায়েড', 'ঠিকানা', 'রেজিস্ট্রেশন তারিখ'];
    const sampleUsers = [
      ['আকবর হোসেন (এডমিন)', '01855-667788', 'akbarhossain2034@gmail.com', 'ভেরিফাইড (19952671829000123)', 'হ্যাঁ', 'মিরপুর-২, ঢাকা', '2023'],
      ['তানভীর আহমেদ (সেলার)', '01712-345678', 'tanvir.dhaka@gmail.com', 'ভেরিফাইড', 'হ্যাঁ', 'মিরপুর-১০, ঢাকা', '2023'],
      ['ফারহান চৌধুরী', '01911-556677', 'farhan99@yahoo.com', 'পেন্ডিং', 'না', 'উত্তরা, ঢাকা', '2024']
    ];
    const csvContent = '\uFEFF' + [headers.join(','), ...sampleUsers.map(r => r.map(c => `"${c}"`).join(','))].join('\r\n');
    const dateStr = new Date().toISOString().slice(0, 10);
    const cleanSiteName = (siteName || 'BikroyMela').replace(/[^a-zA-Z0-9]/g, '_');
    triggerDownload(csvContent, `${cleanSiteName}_Users_List_${dateStr}.csv`, 'text/csv;charset=utf-8;');
    setBackupDownloadSuccess('ইউজার ও মার্চেন্টদের তালিকা সফলভাবে CSV ফাইলে ডাউনলোড হয়েছে');
    setTimeout(() => setBackupDownloadSuccess(null), 4000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRestoreFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed || (!parsed.ads && !parsed.metadata && !parsed.orders)) {
          setRestoreStatus({ type: 'error', message: 'অবৈধ ফাইল ফরম্যাট! এটি সঠিক ব্যাকআপ ফাইল নয়।' });
          setRestoreFile(null);
          return;
        }
        setRestoreFile(parsed);
        setRestoreStatus({ type: null, message: '' });
      } catch {
        setRestoreStatus({ type: 'error', message: 'JSON ফাইল পড়তে ব্যর্থ হয়েছে। সঠিক ফাইল নির্বাচন করুন।' });
        setRestoreFile(null);
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteRestore = () => {
    if (!restoreFile) return;
    const res = importBackupData(restoreFile);
    if (res.success) {
      setRestoreStatus({ type: 'success', message: `${res.message} (বিজ্ঞাপন: ${res.counts?.ads}, অর্ডার: ${res.counts?.orders})` });
      setRestoreFile(null);
      setRestoreFileName('');
      setTimeout(() => setRestoreStatus({ type: null, message: '' }), 5000);
    } else {
      setRestoreStatus({ type: 'error', message: res.message });
    }
  };

  const handleResetDataConfirm = () => {
    resetToFactoryData();
    setShowResetConfirm(false);
    setRestoreStatus({ type: 'success', message: 'ডাটাবেজ সফলভাবে ফ্যাক্টরি ডিফল্ট অবস্থায় রিসেট করা হয়েছে।' });
    setTimeout(() => setRestoreStatus({ type: null, message: '' }), 5000);
  };

  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteName(inputSiteName);
    updateDomainName(inputDomainName);
    setSiteSettingsSaved(true);
    setTimeout(() => setSiteSettingsSaved(false), 3500);
  };

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const customerUrl = origin ? `${origin}/` : '';
  const adminUrl = origin ? `${origin}/?admin=true` : '';

  const copyToClipboard = (text: string, type: 'customer' | 'admin') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === 'customer') {
        setCopiedCustomerLink(true);
        setTimeout(() => setCopiedCustomerLink(false), 2000);
      } else {
        setCopiedAdminLink(true);
        setTimeout(() => setCopiedAdminLink(false), 2000);
      }
    }
  };

  // Calculations & Validation Counts
  const totalVolume = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const pendingAdsCount = ads.filter(a => a.status === 'pending').length;
  const activeAdsCount = ads.filter(a => a.status === 'active').length;
  const receivedAdsCount = ads.filter(a => a.validationStatus === 'Received' || (!a.validationStatus && a.status === 'pending')).length;
  const verifiedAdsCount = ads.filter(a => a.validationStatus === 'Verified').length;
  const processedAdsCount = ads.filter(a => a.validationStatus === 'Processed').length;
  const approvedAdsCount = ads.filter(a => a.validationStatus === 'Approved' || a.status === 'active').length;
  const rejectedAdsCount = ads.filter(a => a.validationStatus === 'Rejected' || a.status === 'rejected').length;

  const filteredAds = ads.filter(ad => {
    const currentValidation = ad.validationStatus || (ad.status === 'active' ? 'Approved' : (ad.status === 'rejected' ? 'Rejected' : 'Received'));
    const matchesStatus = filterAdStatus === 'all' || 
                          ad.status === filterAdStatus || 
                          currentValidation === filterAdStatus;
    const matchesSearch = ad.titleBn.toLowerCase().includes(adminSearch.toLowerCase()) ||
                          ad.titleEn.toLowerCase().includes(adminSearch.toLowerCase()) ||
                          ad.sellerName.toLowerCase().includes(adminSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-16">
      
      {/* Admin Top Navigation Bar */}
      <div className="bg-[#007460] text-white border-b border-[#005e4e] px-4 sm:px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  {siteName} {lang === 'bn' ? 'কেন্দ্রীয় এডমিন কন্ট্রোল প্যানেল' : 'Central Admin Control Panel'}
                </h1>
                <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded uppercase flex items-center gap-1 shadow-xs">
                  {activeAdmin?.isOwner && <Crown className="w-3 h-3 text-slate-950" />}
                  <span>{activeAdmin?.role ? activeAdmin.role.toUpperCase() : 'SUPER ADMIN'}</span>
                </span>

                {activeAdmin && (
                  <button
                    onClick={() => setIsOwnerProfileModalOpen(true)}
                    className="text-[11px] font-semibold bg-black/25 hover:bg-black/40 text-emerald-100 hover:text-white border border-white/20 hover:border-amber-400/80 px-2.5 py-0.5 rounded flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    title="মালিকের নাম, মোবাইল, আইডি ও পাসওয়ার্ড পরিবর্তন করুন"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                    <span>{activeAdmin.name} ({activeAdmin.id})</span>
                    <span className="text-[9px] text-amber-300 font-bold bg-amber-400/20 px-1 py-0.2 rounded border border-amber-300/40 flex items-center gap-0.5">
                      <Edit3 className="w-2.5 h-2.5" />
                      <span>তথ্য পরিবর্তন</span>
                    </span>
                  </button>
                )}

                <button 
                  onClick={() => setActiveTab('settings')}
                  className="text-[11px] font-semibold bg-black/20 hover:bg-black/30 text-white border border-white/20 px-2.5 py-0.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="ক্লিক করে সাইট ও ডোমেইন নাম পরিবর্তন করুন"
                >
                  <Globe className="w-3 h-3 text-emerald-300" />
                  <span>সাইট: <strong className="text-amber-300">{siteName}</strong></span>
                  <span className="text-[9px] underline text-emerald-200">পরিবর্তন</span>
                </button>

                <button 
                  onClick={() => setActiveTab('backup')}
                  className="text-[11px] font-semibold bg-black/20 hover:bg-black/30 text-white border border-white/20 px-2.5 py-0.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="ডাটা ব্যাকআপ ও ডাউনলোড করুন"
                >
                  <Database className="w-3 h-3 text-cyan-300" />
                  <span>💾 ব্যাকআপ: <strong className="text-white">ডাউনলোড</strong></span>
                </button>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                {lang === 'bn' ? 'বিজ্ঞাপন অনুমোদন, লেনদেন মনিটরিং ও এসক্রো সিকিউরিটি ব্যবস্থাপনা' : 'Ad Moderation, Escrow Monitoring & Platform Governance'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start lg:self-center">
            {/* Manage Accounts Button (Requirement C) */}
            <button
              onClick={() => setIsManageAccountOpen(true)}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all shadow-sm cursor-pointer hover:scale-[1.02]"
              title="Manage Accounts (আইডির সকল তথ্য দেখুন ও পরিবর্তন করুন)"
            >
              <UserCog className="w-4 h-4 text-slate-950" />
              <span>Manage Accounts</span>
            </button>

            {/* User Profile Badge & Dropdown (Right Corner - Requirement C) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 text-xs font-semibold text-white bg-black/25 hover:bg-black/35 rounded-full transition-all group cursor-pointer border border-white/20 hover:border-amber-400 shadow-xs"
                title="লগইনকৃত অ্যাডমিন অ্যাকাউন্ট তথ্য"
              >
                {/* Circular Avatar */}
                <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center shadow-md ring-2 ring-emerald-300/80 group-hover:scale-105 transition-transform shrink-0">
                  {activeAdmin.name ? activeAdmin.name.charAt(0) : 'A'}
                  {activeAdmin.isOwner && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-500 rounded-full flex items-center justify-center ring-1 ring-white" title="মালিক">
                      <Crown className="w-2.5 h-2.5 text-slate-950" />
                    </span>
                  )}
                </div>

                <div className="hidden sm:flex flex-col text-left leading-tight pr-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono font-bold text-amber-300">{activeAdmin.id}</span>
                    <span className="text-[9px] bg-emerald-950/70 text-emerald-200 px-1 py-0.2 rounded font-sans">
                      {activeAdmin.isOwner ? 'মালিক' : (activeAdmin.role || 'স্টাফ')}
                    </span>
                  </div>
                  <span className="text-[10px] text-white font-medium truncate max-w-[120px]">
                    {activeAdmin.name}
                  </span>
                </div>

                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {/* Dropdown Menu */}
              {adminDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 text-slate-700 py-2 z-50 animate-in fade-in zoom-in-95 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100 bg-slate-50">
                    <span className="text-[10px] text-slate-400 block font-medium">লগইনকৃত আইডি:</span>
                    <strong className="text-slate-900 font-mono text-sm block">{activeAdmin.id}</strong>
                    <span className="text-[11px] text-slate-700 font-bold block truncate mt-0.5">{activeAdmin.name}</span>
                    <span className="text-[10px] text-emerald-700 font-mono font-bold">ইউনিক: {activeAdmin.username || 'N/A'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsManageAccountOpen(true);
                      setAdminDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 text-slate-900 font-bold flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <UserCog className="w-4 h-4 text-[#007460]" />
                    <span>Manage Accounts</span>
                    <span className="ml-auto text-[9px] bg-emerald-100 text-[#007460] px-1.5 py-0.5 rounded font-bold">ওপেন</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStaffToEdit(null);
                      setIsRecruitModalOpen(true);
                      setAdminDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 font-medium text-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-emerald-600" />
                    <span>নতুন কর্মী নিয়োগ (+ Recruit)</span>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    type="button"
                    onClick={() => {
                      adminLogout();
                      setAdminDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>লগআউট (Log Out)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick button to jump to (C) Owner Master Control */}
            <button
              onClick={() => setActiveTab('owner')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                activeTab === 'owner'
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'bg-black/25 hover:bg-black/35 text-amber-300 border border-amber-300/40'
              }`}
              title="মালিকের ৪ ডিজিট পিন দ্বারা বিশেষ নিয়ন্ত্রণ ও লাভ-ক্ষতি প্যানেল"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>মালিকের নিয়ন্ত্রণ (PIN)</span>
              {!isOwnerUnlocked && <Lock className="w-3 h-3 text-amber-300" />}
            </button>

            {/* Switch to public customer view */}
            <button
              onClick={() => setIsAdminMode(false)}
              className="px-3 py-1.5 bg-black/20 hover:bg-black/30 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/20 cursor-pointer"
              title="কাষ্টমার মার্কেটপ্লেসে ফিরে যান"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.switchToUser}</span>
            </button>

            {/* Secure Admin Logout Button */}
            <button
              onClick={adminLogout}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              title="এডমিন সেশন সমাপ্ত করে সম্পূর্ণ লগআউট করুন (পরবর্তীতে প্রবেশ করতে ওটিপি লাগবে)"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Direct Links Box for Customer & Admin */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <LinkIcon className="w-4 h-4 text-[#007460]" />
            <h2 className="text-sm font-bold text-slate-900">
              {lang === 'bn' ? 'সরাসরি প্ল্যাটফর্ম লিংকসমূহ (Direct Access Links)' : 'Platform Direct Access Links'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Link Card */}
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-lg flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>{lang === 'bn' ? '০১. কাষ্টমার মার্কেটপ্লেস লিংক' : '01. Customer Marketplace Link'}</span>
                  </span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 font-semibold px-1.5 py-0.5 rounded">
                    পণ্য কেনাবেচা
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 mt-1">
                  {lang === 'bn' ? 'এই লিংকটি সাধারণ ক্রেতা ও বিক্রেতাদের সাথে শেয়ার করুন।' : 'Share this public link with general buyers and sellers.'}
                </p>
                <div className="mt-2 p-2 bg-white rounded border border-emerald-200 font-mono text-xs text-slate-800 break-all select-all">
                  {customerUrl || '/'}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => copyToClipboard(customerUrl || window.location.origin, 'customer')}
                  className="flex-1 py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  {copiedCustomerLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCustomerLink ? (lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (lang === 'bn' ? 'কাষ্টমার লিংক কপি করুন' : 'Copy Customer Link')}</span>
                </button>
                <button
                  onClick={() => setIsAdminMode(false)}
                  className="py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Open Customer View"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                  <span>ভিজিট</span>
                </button>
              </div>
            </div>

            {/* Admin Direct Link Card */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-lg flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>{lang === 'bn' ? '০২. এডমিন প্যানেল সরাসরি লিংক' : '02. Admin Panel Direct Link'}</span>
                  </span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 font-semibold px-1.5 py-0.5 rounded">
                    কন্ট্রোল ও এসক্রো
                  </span>
                </div>
                <p className="text-[11px] text-amber-900 mt-1 font-medium">
                  {lang === 'bn' 
                    ? '🔒 এই লিংকে প্রবেশ করলে সুরক্ষিত সিকিউরিটি গেট প্রদর্শিত হবে। আইডি, পাসওয়ার্ড ও ওটিপি ভেরিফিকেশন ছাড়া কেউ কোনো তথ্য দেখতে পারবে না।' 
                    : '🔒 Protected Gateway: Requires Admin ID, Password & OTP verification to view any data.'}
                </p>
                <div className="mt-2 p-2 bg-white rounded border border-amber-200 font-mono text-xs text-slate-800 break-all select-all">
                  {adminUrl || '/?admin=true'}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => copyToClipboard(adminUrl || `${window.location.origin}/?admin=true`, 'admin')}
                  className="w-full py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  {copiedAdminLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAdminLink ? (lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (lang === 'bn' ? 'এডমিন লিংক কপি করুন' : 'Copy Admin Link')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase">{t.totalAds}</span>
              <Layers className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {ads.length}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">
              সক্রিয়: {activeAdsCount} · অপেক্ষমাণ: {pendingAdsCount}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase">{t.totalTransactions}</span>
              <CreditCard className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              ৳ {totalVolume.toLocaleString()}
            </div>
            <div className="text-[11px] text-sky-700 font-medium mt-1">
              মোট এসক্রো ও গেটওয়ে ভলিউম
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase">অর্ডার ও ট্র্যাকিং</span>
              <Truck className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {orders.length}
            </div>
            <div className="text-[11px] text-amber-700 font-medium mt-1">
              স্টেডফাস্ট ও পাঠাও কুরিয়ার সংযুক্ত
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase">{t.totalUsers}</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              ১২,৮৪০+
            </div>
            <div className="text-[11px] text-indigo-700 font-medium mt-1">
              ভেরিফাইড এনআইডি অনুপাত: ৮৬%
            </div>
          </div>

        </div>

        {/* Admin Navigation Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          
          <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab('ads')}
              className={`py-3.5 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'ads' ? 'border-[#007460] text-[#007460]' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{t.manageAds} ({ads.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-3.5 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'transactions' ? 'border-[#007460] text-[#007460]' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{t.transactions} ({transactions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3.5 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'orders' ? 'border-[#007460] text-[#007460]' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>কুরিয়ার ও ডেলিভারি ট্র্যাকিং ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`py-3.5 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'users' ? 'border-[#007460] text-[#007460] font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>কর্মকর্তা-কর্মী নিয়োগ ও ইউজার ({adminList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('owner')}
              className={`py-3.5 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'owner' ? 'border-amber-500 text-amber-950 font-black bg-amber-50/90 shadow-2xs' : 'border-transparent text-amber-800 hover:text-amber-950 bg-amber-50/30'
              }`}
              title="মালিকের ৪ ডিজিট পিন সুরক্ষা ও অভ্যন্তরীণ আর্থিক লাভ-ক্ষতি প্যানেল"
            >
              <Crown className="w-4 h-4 text-amber-600" />
              <span>👑 (C) মালিকের নিয়ন্ত্রণ প্যানেল</span>
              {adminList.filter(s => !s.isApprovedByOwner && !s.isOwner).length > 0 && (
                <span className="bg-amber-400 text-slate-950 font-mono font-bold text-[10px] px-1.5 py-0.2 rounded-full animate-pulse">
                  {adminList.filter(s => !s.isApprovedByOwner && !s.isOwner).length} অপেক্ষমাণ
                </span>
              )}
              {!isOwnerUnlocked && <Lock className="w-3 h-3 text-slate-400" />}
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`py-3.5 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'audit' ? 'border-[#007460] text-[#007460] font-bold bg-white shadow-2xs' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
              title="কর্মকর্তারা কোন বিজ্ঞাপনে কি অনুমোদন দিয়েছেন তার স্থায়ী অডিট রেকর্ড"
            >
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>📋 এডমিন অডিট ও অ্যাকশন হিস্ট্রি লগ</span>
            </button>

            <button
              onClick={() => setActiveTab('revenue')}
              className={`py-3.5 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'revenue' ? 'border-[#007460] text-[#007460] font-bold' : 'border-transparent text-amber-700 hover:text-amber-900'
              }`}
            >
              <CircleDollarSign className="w-4 h-4 text-amber-600" />
              <span>আয় ও কমিশন ব্যবস্থাপনা (Revenue)</span>
            </button>

            <button
              onClick={() => setActiveTab('offers')}
              className={`py-3.5 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'offers' ? 'border-[#007460] text-[#007460] font-bold bg-white shadow-2xs' : 'border-transparent text-amber-700 hover:text-amber-900'
              }`}
            >
              <Gift className="w-4 h-4 text-amber-600" />
              <span>🎁 অফার ও ওয়েলকাম বোনাস (Offers & Bonus)</span>
              {withdrawalRequests.filter(w => w.status === 'Pending').length > 0 && (
                <span className="bg-amber-500 text-slate-950 font-mono font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                  {withdrawalRequests.filter(w => w.status === 'Pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`py-3.5 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'settings' ? 'border-[#007460] text-[#007460] font-bold bg-white' : 'border-transparent text-indigo-700 hover:text-indigo-900'
              }`}
            >
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>🌐 সাইট ও ডোমেইন নাম সেটিংস (Site Name)</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`py-3.5 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'backup' ? 'border-[#007460] text-[#007460] font-bold bg-white shadow-2xs' : 'border-transparent text-emerald-800 hover:text-emerald-950'
              }`}
            >
              <Database className="w-4 h-4 text-emerald-600" />
              <span>💾 ডাটা ব্যাকআপ ও ডাউনলোড (Backup)</span>
            </button>
          </div>

          {/* TAB 1: ADS MODERATION */}
          {activeTab === 'ads' && (
            <div className="p-4 sm:p-6 space-y-4">
              
              {/* Header Info & Excel Validation Guide Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-700" />
                    <span>বিজ্ঞাপন অনুমোদন ও নিয়ন্ত্রণ (Excel ডাটা ভেলিডেশন সিস্টেম)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Excel Data Validation ড্রপডাউন থেকে যেকোনো স্ট্যাটাস (Received, Verified, Processed, Approved, Rejected) এক ক্লিকে সিলেক্ট করুন।
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowValidationGuideModal(true)}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>📋 ডাটা ভেলিডেশন নিয়মাবলী ও গাইডলাইন</span>
                </button>
              </div>

              {/* Requirement 02: ৩ মাসের অটো-ডিলিট ও বিজ্ঞাপন পরিচ্ছন্নতা পলিসি বার */}
              <div className="p-3.5 bg-gradient-to-r from-amber-50 via-slate-50 to-rose-50 border border-amber-200 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-2xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                      পলিসি ০২
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-[13px] flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-700" />
                      <span>৩ মাস (৯০ দিন) অবিক্রিত বিজ্ঞাপন অটো-ডিলিট ও পরিচ্ছন্নতা পলিসি</span>
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    পণ্য বিক্রয় না হয়ে ৩ মাস অতিক্রম করলে প্ল্যাটফর্ম থেকে বিজ্ঞাপন স্বয়ংক্রিয়ভাবে মুছে ফেলা হয়। এছাড়াও এডমিন যেকোনো সময় কারণ উল্লেখ করে বিজ্ঞাপন বাতিল করতে পারেন।
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const res = pruneExpiredAds();
                      setPruneResultMsg(res.message);
                      setTimeout(() => setPruneResultMsg(null), 5000);
                    }}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                    title="৯০ দিনের বেশি পুরানো অবিক্রিত বিজ্ঞাপন ক্লিন করুন"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>🧹 ৯০ দিনের পুরানো এড ক্লিন করুন</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAuditLogsModal(true)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                    <span>📋 ডিলিট অডিট লগ ({adminDeletionLogs.length})</span>
                  </button>
                </div>
              </div>

              {/* Prune Result Notification */}
              {pruneResultMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{pruneResultMsg}</span>
                  </div>
                  <button onClick={() => setPruneResultMsg(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Filter & Search Bar */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pb-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    placeholder="বিজ্ঞাপন বা সেলার খুঁজুন..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                {/* Excel Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-medium">
                  <button
                    onClick={() => setFilterAdStatus('all')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors shrink-0 ${
                      filterAdStatus === 'all' ? 'bg-[#007460] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    সকল ({ads.length})
                  </button>
                  <button
                    onClick={() => setFilterAdStatus('Received')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors shrink-0 flex items-center gap-1 ${
                      filterAdStatus === 'Received' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                    }`}
                  >
                    <span>📥 Received</span>
                    <span className="font-mono">({receivedAdsCount})</span>
                  </button>
                  <button
                    onClick={() => setFilterAdStatus('Verified')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors shrink-0 flex items-center gap-1 ${
                      filterAdStatus === 'Verified' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                    }`}
                  >
                    <span>🔍 Verified</span>
                    <span className="font-mono">({verifiedAdsCount})</span>
                  </button>
                  <button
                    onClick={() => setFilterAdStatus('Processed')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors shrink-0 flex items-center gap-1 ${
                      filterAdStatus === 'Processed' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                    }`}
                  >
                    <span>⚙️ Processed</span>
                    <span className="font-mono">({processedAdsCount})</span>
                  </button>
                  <button
                    onClick={() => setFilterAdStatus('Approved')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors shrink-0 flex items-center gap-1 ${
                      filterAdStatus === 'Approved' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    <span>✅ Approved</span>
                    <span className="font-mono">({approvedAdsCount})</span>
                  </button>
                  <button
                    onClick={() => setFilterAdStatus('Rejected')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors shrink-0 flex items-center gap-1 ${
                      filterAdStatus === 'Rejected' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                    }`}
                  >
                    <span>❌ Rejected</span>
                    <span className="font-mono">({rejectedAdsCount})</span>
                  </button>
                </div>
              </div>

              {/* Ads Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 text-slate-700 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">পণ্য / প্রোপার্টি বিবরণ</th>
                      <th className="p-3">ক্যাটাগরি ও এরিয়া</th>
                      <th className="p-3">মূল্য (টাকা)</th>
                      <th className="p-3">সেলার ও মোবাইল</th>
                      <th className="p-3 min-w-[210px]">
                        <div className="flex items-center gap-1.5 text-slate-800">
                          <CheckSquare className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Excel ডাটা ভেলিডেশন ড্রপডাউন</span>
                        </div>
                      </th>
                      <th className="p-3 text-right">কুইক অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredAds.map((ad) => {
                      const currentVal: ValidationStatus = ad.validationStatus || 
                        (ad.status === 'active' ? 'Approved' : (ad.status === 'rejected' ? 'Rejected' : 'Received'));

                      return (
                        <tr key={ad.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={ad.images[0]}
                                alt=""
                                className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0 shadow-2xs"
                              />
                              <div className="max-w-xs">
                                <span 
                                  onClick={() => {
                                    setSelectedAd(ad);
                                    setActiveModal('adDetail');
                                  }}
                                  className="font-bold text-slate-900 line-clamp-1 hover:text-[#007460] cursor-pointer"
                                >
                                  {ad.titleBn}
                                </span>
                                <div className="text-[10px] text-slate-500 font-mono mt-0.5 flex items-center gap-2">
                                  <span>আইডি: {ad.id}</span>
                                  <span>•</span>
                                  <span>{ad.createdAt}</span>
                                  {ad.images.length > 3 && (
                                    <span className="bg-amber-100 text-amber-800 font-semibold px-1 rounded text-[9px]">
                                      {ad.images.length}টি ছবি (পেইড)
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="p-3">
                            <div className="font-semibold text-slate-800 flex items-center gap-1">
                              <span>{ad.category === 'property' ? '🏢 প্রোপার্টি' : ad.category}</span>
                              {ad.dealType && (
                                <span className="text-[9px] bg-slate-100 text-slate-600 px-1 rounded font-medium">
                                  {ad.dealType === 'sale' ? 'বিক্রয়' : 'ভাড়া'}
                                </span>
                              )}
                            </div>
                            <div className="text-slate-500 text-[11px]">{ad.location.areaBn}</div>
                          </td>

                          <td className="p-3 font-mono font-bold text-slate-900 tabular-nums">
                            ৳ {ad.price.toLocaleString()}
                          </td>

                          <td className="p-3">
                            <div className="font-semibold text-slate-800 flex items-center gap-1">
                              <span>{ad.sellerName}</span>
                              {ad.sellerVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                            </div>
                            <div className="text-slate-500 text-[11px] font-mono">{ad.sellerPhone}</div>
                          </td>

                          {/* Excel Data Validation Cell */}
                          <td className="p-3 relative">
                            <div className="relative inline-block w-full">
                              
                              {/* Excel Dropdown Trigger Cell */}
                              <div
                                onClick={() => setOpenValidationMenuAdId(openValidationMenuAdId === ad.id ? null : ad.id)}
                                className={`w-full px-2.5 py-1.5 rounded-md border flex items-center justify-between cursor-pointer transition-all shadow-2xs select-none ${
                                  currentVal === 'Approved' ? 'bg-emerald-50/90 border-emerald-400 text-emerald-900' :
                                  currentVal === 'Verified' ? 'bg-indigo-50/90 border-indigo-400 text-indigo-900' :
                                  currentVal === 'Processed' ? 'bg-amber-50/90 border-amber-400 text-amber-900' :
                                  currentVal === 'Rejected' ? 'bg-rose-50/90 border-rose-400 text-rose-900' :
                                  'bg-blue-50/90 border-blue-400 text-blue-900'
                                }`}
                                title="Excel Data Validation: ক্লিক করে স্ট্যাটাস পরিবর্তন করুন"
                              >
                                <div className="flex items-center gap-1.5 font-bold text-xs">
                                  <span>
                                    {currentVal === 'Received' && '📥'}
                                    {currentVal === 'Verified' && '🔍'}
                                    {currentVal === 'Processed' && '⚙️'}
                                    {currentVal === 'Approved' && '✅'}
                                    {currentVal === 'Rejected' && '❌'}
                                  </span>
                                  <span>{currentVal}</span>
                                </div>
                                <div className="flex items-center gap-1 text-slate-400 hover:text-slate-700">
                                  <span className="text-[10px] uppercase font-mono px-1 bg-black/5 rounded">Excel</span>
                                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openValidationMenuAdId === ad.id ? 'rotate-180' : ''}`} />
                                </div>
                              </div>

                              {/* Excel Data Validation In-Cell Dropdown Popup */}
                              {openValidationMenuAdId === ad.id && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => setOpenValidationMenuAdId(null)}
                                  />
                                  <div className="absolute left-0 top-full mt-1 w-64 bg-white border-2 border-emerald-600 rounded-lg shadow-xl z-50 py-1 overflow-hidden font-sans text-xs animate-in fade-in zoom-in-95">
                                    <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wide flex items-center justify-between">
                                      <span>Excel Data Validation List</span>
                                      <span className="text-emerald-700 font-mono">ভেলিডেশন তালিকা</span>
                                    </div>

                                    {/* 1. Received */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        updateAdValidationStatus(ad.id, 'Received');
                                        setOpenValidationMenuAdId(null);
                                        setValidationToast(`বিজ্ঞাপন #${ad.id} এর স্ট্যাটাস 'Received' (প্রাপ্ত) করা হয়েছে`);
                                        setTimeout(() => setValidationToast(null), 3000);
                                      }}
                                      className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-blue-50 transition-colors ${
                                        currentVal === 'Received' ? 'bg-blue-50 font-bold text-blue-900' : 'text-slate-800'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm">📥</span>
                                        <div>
                                          <div className="font-bold text-blue-900">Received (প্রাপ্ত)</div>
                                          <div className="text-[10px] text-slate-500">নতুন সাবমিট — প্রাথমিক সিস্টেম চেক</div>
                                        </div>
                                      </div>
                                      {currentVal === 'Received' && <Check className="w-4 h-4 text-blue-700 shrink-0 font-bold" />}
                                    </button>

                                    {/* 2. Verified */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        updateAdValidationStatus(ad.id, 'Verified');
                                        setOpenValidationMenuAdId(null);
                                        setValidationToast(`বিজ্ঞাপন #${ad.id} এর স্ট্যাটাস 'Verified' (যাচাইকৃত) করা হয়েছে`);
                                        setTimeout(() => setValidationToast(null), 3000);
                                      }}
                                      className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-indigo-50 transition-colors border-t border-slate-100 ${
                                        currentVal === 'Verified' ? 'bg-indigo-50 font-bold text-indigo-900' : 'text-slate-800'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm">🔍</span>
                                        <div>
                                          <div className="font-bold text-indigo-900">Verified (যাচাইকৃত)</div>
                                          <div className="text-[10px] text-slate-500">সেলার মোবাইল নম্বর ও ছবি ভেরিফাইড</div>
                                        </div>
                                      </div>
                                      {currentVal === 'Verified' && <Check className="w-4 h-4 text-indigo-700 shrink-0 font-bold" />}
                                    </button>

                                    {/* 3. Processed */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        updateAdValidationStatus(ad.id, 'Processed');
                                        setOpenValidationMenuAdId(null);
                                        setValidationToast(`বিজ্ঞাপন #${ad.id} এর স্ট্যাটাস 'Processed' (প্রক্রিয়াধীন) করা হয়েছে`);
                                        setTimeout(() => setValidationToast(null), 3000);
                                      }}
                                      className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-amber-50 transition-colors border-t border-slate-100 ${
                                        currentVal === 'Processed' ? 'bg-amber-50 font-bold text-amber-900' : 'text-slate-800'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm">⚙️</span>
                                        <div>
                                          <div className="font-bold text-amber-900">Processed (প্রক্রিয়াধীন)</div>
                                          <div className="text-[10px] text-slate-500">মূল্য ও কোয়ালিটি রিভিউ সম্পন্ন</div>
                                        </div>
                                      </div>
                                      {currentVal === 'Processed' && <Check className="w-4 h-4 text-amber-700 shrink-0 font-bold" />}
                                    </button>

                                    {/* 4. Approved */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        updateAdValidationStatus(ad.id, 'Approved');
                                        setOpenValidationMenuAdId(null);
                                        setValidationToast(`বিজ্ঞাপন #${ad.id} 'Approved' (অনুমোদিত) ও লাইভ করা হয়েছে`);
                                        setTimeout(() => setValidationToast(null), 3000);
                                      }}
                                      className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-emerald-50 transition-colors border-t border-slate-100 ${
                                        currentVal === 'Approved' ? 'bg-emerald-50 font-bold text-emerald-900' : 'text-slate-800'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm">✅</span>
                                        <div>
                                          <div className="font-bold text-emerald-900">Approved (অনুমোদিত)</div>
                                          <div className="text-[10px] text-slate-500">সাইটে সরাসরি লাইভ ক্রেতাদের জন্য</div>
                                        </div>
                                      </div>
                                      {currentVal === 'Approved' && <Check className="w-4 h-4 text-emerald-700 shrink-0 font-bold" />}
                                    </button>

                                    {/* 5. Rejected */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        updateAdValidationStatus(ad.id, 'Rejected');
                                        setOpenValidationMenuAdId(null);
                                        setValidationToast(`বিজ্ঞাপন #${ad.id} 'Rejected' (বাতিল) করা হয়েছে`);
                                        setTimeout(() => setValidationToast(null), 3000);
                                      }}
                                      className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-rose-50 transition-colors border-t border-slate-100 ${
                                        currentVal === 'Rejected' ? 'bg-rose-50 font-bold text-rose-900' : 'text-slate-800'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm">❌</span>
                                        <div>
                                          <div className="font-bold text-rose-900">Rejected (বাতিল)</div>
                                          <div className="text-[10px] text-slate-500">ত্রুটি বা নীতিমালার কারণে বাতিল</div>
                                        </div>
                                      </div>
                                      {currentVal === 'Rejected' && <Check className="w-4 h-4 text-rose-700 shrink-0 font-bold" />}
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </td>

                          {/* Quick Actions */}
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {currentVal !== 'Approved' && (
                                <button
                                  onClick={() => {
                                    updateAdValidationStatus(ad.id, 'Approved');
                                    setValidationToast(`বিজ্ঞাপন #${ad.id} 'Approved' করা হয়েছে`);
                                    setTimeout(() => setValidationToast(null), 3000);
                                  }}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                                  title="দ্রুত অনুমোদন করুন"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>লাইভ</span>
                                </button>
                              )}
                              {currentVal !== 'Rejected' && (
                                <button
                                  onClick={() => {
                                    updateAdValidationStatus(ad.id, 'Rejected');
                                    setValidationToast(`বিজ্ঞাপন #${ad.id} 'Rejected' করা হয়েছে`);
                                    setTimeout(() => setValidationToast(null), 3000);
                                  }}
                                  className="px-2 py-1 bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 rounded text-[11px] font-semibold transition-colors flex items-center gap-1"
                                  title="বাতিল করুন"
                                >
                                  <X className="w-3 h-3" />
                                  <span>বাতিল</span>
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedAd(ad);
                                  setActiveModal('adDetail');
                                }}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[11px] font-medium"
                                title="বিজ্ঞাপন বিস্তারিত দেখুন"
                              >
                                প্রিভিউ
                              </button>
                              <button
                                onClick={() => setAdminAdToDelete(ad)}
                                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-900 border border-rose-200 rounded text-[11px] font-bold transition-colors flex items-center gap-1 shadow-2xs"
                                title="কারণ উল্লেখ করে বিজ্ঞাপন ডিলিট করুন"
                              >
                                <Trash2 className="w-3 h-3 text-rose-600" />
                                <span>মুছুন</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Data Validation Rules & Criteria Modal (Requirement 04) */}
              {showValidationGuideModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
                  <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full text-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in">
                    
                    {/* Modal Header */}
                    <div className="p-4 bg-[#007460] text-white flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-amber-300" />
                        <div>
                          <h3 className="font-bold text-base sm:text-lg">
                            বিজ্ঞাপন অনুমোদন ও ডাটা ভেলিডেশন নিয়মাবলী (Rules & Criteria)
                          </h3>
                          <p className="text-[11px] text-emerald-100">
                            কোন অবস্থায় কোন স্ট্যাটাস সিলেক্ট করবেন — এডমিন গাইডলাইন
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowValidationGuideModal(false)}
                        className="text-white hover:text-emerald-200 p-1 rounded-md"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
                      
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs leading-relaxed">
                        💡 <strong>এডমিন নির্দেশিকা:</strong> এই ৫টি ভেলিডেশন ধাপের মাধ্যমে ক্রেতারা প্রতারণামুক্ত আসল পণ্য কিনতে পারেন এবং বিক্রেতারা দ্রুত সঠিক ক্রেতা খুঁজে পান। নিচে বিস্তারিত ক্যাটাগরি নিয়মাবলী দেওয়া হলো:
                      </div>

                      {/* 1. Received */}
                      <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base">📥</span>
                          <span className="font-bold text-blue-950 text-sm">১. Received (প্রাপ্ত)</span>
                          <span className="text-[10px] bg-blue-200 text-blue-900 font-bold px-2 py-0.5 rounded">ধাপ ১</span>
                        </div>
                        <p className="text-xs text-slate-700">
                          <strong>কখন Received হবে:</strong> যখন বিক্রেতা ওয়েবসাইট থেকে একটি নতুন বিজ্ঞাপন (পণ্য, জমি, ফ্ল্যাট বা দোকান) ফর্ম পূরণ করে সাবমিট করেন, তখন স্বয়ংক্রিয়ভাবে এটি "Received" স্ট্যাটাসে থাকে।
                        </p>
                        <p className="text-xs text-slate-600">
                          <strong>এডমিন কি চেক করবেন:</strong> টাইটেল, প্রোপার্টি সাইজ, মূল্য এবং ন্যূনতম ১ থেকে ৩টি আসল ছবি আপলোড হয়েছে কিনা তা প্রাথমিক নজরে দেখা।
                        </p>
                      </div>

                      {/* 2. Verified */}
                      <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🔍</span>
                          <span className="font-bold text-indigo-950 text-sm">২. Verified (যাচাইকৃত)</span>
                          <span className="text-[10px] bg-indigo-200 text-indigo-900 font-bold px-2 py-0.5 rounded">ধাপ ২</span>
                        </div>
                        <p className="text-xs text-slate-700">
                          <strong>কখন Verified করবেন:</strong> যখন এডমিন বিক্রেতার মোবাইল নম্বরটি সঠিক কিনা এবং ছবিগুলো ইন্টারনেট থেকে কপি করা নকল ছবি নয় বরং বাস্তব তোলা ছবি তা নিশ্চিত করবেন।
                        </p>
                        <p className="text-xs text-slate-600">
                          <strong>প্রোপার্টির ক্ষেত্রে:</strong> জমির অবস্থান (মিরপুর, উত্তরা ইত্যাদি), রাস্তার বিবরণ ও বিক্রেতার মালিকানা প্রাথমিকভাবে সত্য প্রতীয়মান হলে Verified দিন।
                        </p>
                      </div>

                      {/* 3. Processed */}
                      <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base">⚙️</span>
                          <span className="font-bold text-amber-950 text-sm">৩. Processed (প্রক্রিয়াধীন)</span>
                          <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">ধাপ ৩</span>
                        </div>
                        <p className="text-xs text-slate-700">
                          <strong>কখন Processed করবেন:</strong> পণ্যের মূল্য বাজারমূল্যের সাথে সামঞ্জস্যপূর্ণ কিনা (যেমন ১ লাখ টাকার ফোন ভুলবশত ১০০০ টাকা লেখা হয়নি তো?) এবং সঠিক ক্যাটাগরি (মোবাইল, জমি, দোকান, ফ্ল্যাট) নির্বাচন করা হয়েছে কিনা তা চূড়ান্ত নিরীক্ষা শেষে Processed করুন।
                        </p>
                      </div>

                      {/* 4. Approved */}
                      <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base">✅</span>
                          <span className="font-bold text-emerald-950 text-sm">৪. Approved (অনুমোদিত ও লাইভ)</span>
                          <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded">ধাপ ৪ - লাইভ</span>
                        </div>
                        <p className="text-xs text-slate-700">
                          <strong>কখন Approved করবেন:</strong> সবকিছু ১০০% সঠিক, নিরাপদ ও বিশ্বাসযোগ্য হলে Approved সিলেক্ট করুন।
                        </p>
                        <p className="text-xs text-slate-600">
                          <strong>ফলাফল:</strong> বিজ্ঞাপনটি তাৎক্ষণিকভাবে ওয়েবসাইটে লাইভ হয়ে যাবে। ক্রেতারা পণ্যটি দেখতে পাবেন, কল করতে পারবেন এবং বিকাশ/নগদে অর্ডার দিতে পারবেন।
                        </p>
                      </div>

                      {/* 5. Rejected */}
                      <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base">❌</span>
                          <span className="font-bold text-rose-950 text-sm">৫. Rejected (বাতিল / সংশোধন)</span>
                          <span className="text-[10px] bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded">বাতিল</span>
                        </div>
                        <p className="text-xs text-slate-700">
                          <strong>কখন Rejected করবেন:</strong> নিষিদ্ধ পণ্য (অস্ত্র, মাদক, অবৈধ চোরাই সামগ্রী), জাল দলিলযুক্ত জমি, ভুয়া ছবি, অবাস্তব স্ক্যাম প্রাইস বা অসম্পূর্ণ তথ্য থাকলে Rejected করবেন।
                        </p>
                        <p className="text-xs text-slate-600">
                          <strong>ফলাফল:</strong> বিজ্ঞাপনটি ওয়েবসাইটে লাইভ হবে না এবং বিক্রেতাকে সংশোধনের অনুরোধ পাঠানো হবে।
                        </p>
                      </div>

                    </div>

                    {/* Modal Footer */}
                    <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowValidationGuideModal(false)}
                        className="px-4 py-2 bg-[#007460] text-white rounded-lg text-xs font-bold hover:bg-[#005f4e] transition-colors"
                      >
                        বুঝেছি ও বন্ধ করুন
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* Audit Deletion Logs Modal (Requirement 02) */}
              {showAuditLogsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
                  <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full text-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in border border-rose-200">
                    
                    {/* Modal Header */}
                    <div className="p-4 bg-gradient-to-r from-rose-900 to-slate-900 text-white flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-5 h-5 text-rose-300" />
                        <div>
                          <h3 className="font-bold text-base sm:text-lg">
                            বিজ্ঞাপন ডিলিট অডিট হিস্ট্রি ও কারণ লগ ({adminDeletionLogs.length}টি রেকর্ড)
                          </h3>
                          <p className="text-[11px] text-rose-200">
                            কোন বিজ্ঞাপন কি কারণে এবং কখন ডিলিট করা হয়েছে তার সম্পূর্ণ আইনি ও প্রশাসনিক রেকর্ড
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowAuditLogsModal(false)}
                        className="text-white hover:text-rose-200 p-1 rounded-md"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
                      {adminDeletionLogs.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                          এখনো কোনো বিজ্ঞাপন ডিলিট করা হয়নি। অডিট হিস্ট্রি সম্পূর্ণ পরিষ্কার।
                        </div>
                      ) : (
                        <div className="overflow-x-auto border border-slate-200 rounded-lg">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
                              <tr>
                                <th className="p-2.5">লগ আইডি</th>
                                <th className="p-2.5">বিজ্ঞাপন শিরোনাম</th>
                                <th className="p-2.5">বিক্রেতা ও মোবাইল</th>
                                <th className="p-2.5">ডিলিট করার সুনির্দিষ্ট কারণ</th>
                                <th className="p-2.5">তারিখ ও সময়</th>
                                <th className="p-2.5">কর্তৃপক্ষ</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                              {adminDeletionLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50">
                                  <td className="p-2.5 font-mono font-bold text-slate-700">{log.id}</td>
                                  <td className="p-2.5">
                                    <div className="font-bold text-slate-900 line-clamp-1">{log.adTitle}</div>
                                    <div className="text-[10px] text-slate-400 font-mono">আইডি: {log.adId}</div>
                                  </td>
                                  <td className="p-2.5">
                                    <div className="font-semibold text-slate-800">{log.sellerName}</div>
                                    <div className="text-[10px] text-slate-500 font-mono">{log.sellerPhone}</div>
                                  </td>
                                  <td className="p-2.5">
                                    <span className="px-2 py-1 rounded bg-rose-50 text-rose-800 border border-rose-200 font-medium inline-block leading-tight">
                                      {log.reason}
                                    </span>
                                  </td>
                                  <td className="p-2.5 font-mono text-slate-600 whitespace-nowrap">{log.deletedAt}</td>
                                  <td className="p-2.5 text-slate-600 font-medium">{log.deletedBy}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Modal Footer */}
                    <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowAuditLogsModal(false)}
                        className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-900 transition-colors"
                      >
                        বন্ধ করুন
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: TRANSACTIONS & ESCROW MONITOR */}
          {activeTab === 'transactions' && (
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    এসক্রো ভল্ট ও ডিজিটাল পেমেন্ট মনিটর
                  </h3>
                  <p className="text-xs text-slate-500">
                    বিকাশ, নগদ, রকেট এবং কার্ড ট্রানজেকশন রিয়েল টাইমে মনিটর করুন
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">ট্রানজেকশন আইডি</th>
                      <th className="p-3">পণ্য / অর্ডার</th>
                      <th className="p-3">প্রেরক (ক্রেতা)</th>
                      <th className="p-3">গেটওয়ে</th>
                      <th className="p-3">পরিমাণ (৳)</th>
                      <th className="p-3">এসক্রো স্ট্যাটাস</th>
                      <th className="p-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((txn) => (
                      <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-slate-900">
                          {txn.trxId}
                          <div className="text-[10px] text-slate-400 font-normal">{txn.date}</div>
                        </td>

                        <td className="p-3">
                          <span className="font-semibold text-slate-800 line-clamp-1">{txn.adTitle}</span>
                          <span className="text-[10px] text-slate-500 font-mono">অর্ডার: {txn.orderId}</span>
                        </td>

                        <td className="p-3 text-slate-700">
                          {txn.sender}
                        </td>

                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            txn.gateway === 'bKash' ? 'bg-pink-100 text-[#e2136e]' :
                            txn.gateway === 'Nagad' ? 'bg-orange-100 text-orange-700' :
                            txn.gateway === 'Rocket' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {txn.gateway}
                          </span>
                        </td>

                        <td className="p-3 font-mono font-bold text-slate-900 tabular-nums">
                          ৳ {txn.amount.toLocaleString()}
                        </td>

                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            txn.status === 'Escrow Held' ? 'bg-amber-100 text-amber-800' :
                            txn.status === 'Released' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {txn.status === 'Escrow Held' && 'এসক্রো ফান্ডে রক্ষিত'}
                            {txn.status === 'Released' && 'সেলারকে রিলিজ করা হয়েছে'}
                            {txn.status === 'Refunded' && 'ক্রেতাকে রিফান্ড করা হয়েছে'}
                          </span>
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {txn.status === 'Escrow Held' && (
                              <>
                                <button
                                  onClick={() => updateTransactionStatus(txn.id, 'Released')}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-semibold"
                                >
                                  রিলিজ করুন
                                </button>
                                <button
                                  onClick={() => updateTransactionStatus(txn.id, 'Refunded')}
                                  className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-semibold"
                                >
                                  রিফান্ড দিন
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: COURIER & LOGISTICS MONITOR */}
          {activeTab === 'orders' && (
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    কুরিয়ার পার্টনার ও ডেলিভারি ট্র্যাকিং
                  </h3>
                  <p className="text-xs text-slate-500">
                    Steadfast, Pathao & Paperfly কুরিয়ার পার্সেল স্ট্যাটাস
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={ord.adImage} alt="" className="w-14 h-14 object-cover rounded-lg border" />
                      <div>
                        <div className="text-xs text-slate-500 font-mono">অর্ডার: #{ord.id} · কুরিয়ার ট্র্যাকিং: <span className="font-bold text-emerald-800">{ord.trackingNumber}</span></div>
                        <h4 className="text-sm font-bold text-slate-900">{ord.adTitle}</h4>
                        <div className="text-xs text-slate-600 mt-0.5">
                          ক্রেতা: {ord.buyerName} ({ord.buyerPhone}) · গন্তব্য: {ord.buyerAddress}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#007460] font-mono tabular-nums">
                          ৳ {ord.totalAmount.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          পদ্ধতি: {ord.paymentMethod}
                        </div>
                      </div>

                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded font-semibold text-xs">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: USERS & STAFF MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="p-4 sm:p-6 space-y-6">
              
              {/* SECTION A: COMPANY STAFF RECRUITMENT & MANAGEMENT (Requirement B) */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#007460]" />
                      <span>কোম্পানির কর্মকর্তা ও কর্মচারী নিয়োগ ব্যবস্থাপনা (Company Staff Recruitment)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      নিয়োগের সময় সকল তথ্য নির্ধারণ করুন (আইডি সিস্টেম অটো-জেনারেট করবে)। নিয়োগের পর মালিকের কাছে অনুমোদন চেকবক্স যাবে, মালিক অনুমোদন দিলে কর্মী লগইন করতে পারবে।
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStaffToEdit(null);
                      setIsRecruitModalOpen(true);
                    }}
                    className="px-3.5 py-2 bg-[#007460] hover:bg-[#005e4e] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>নতুন কর্মী নিয়োগ (+ Recruit Staff)</span>
                  </button>
                </div>

                {staffToast && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 text-[#007460] rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#007460] shrink-0" />
                    <span>{staffToast}</span>
                  </div>
                )}

                {/* Staff Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-3">অটো আইডি (৫ সংখ্যার)</th>
                        <th className="p-3">ইউনিক নেম</th>
                        <th className="p-3">নাম ও ডিপার্টমেন্ট (ক্লিক করে বিস্তারিত দেখুন)</th>
                        <th className="p-3">পদবী</th>
                        <th className="p-3">বেতন</th>
                        <th className="p-3">মোবাইল নম্বর</th>
                        <th className="p-3 text-center">মালিকের অনুমোদন স্ট্যাটাস</th>
                        <th className="p-3 text-center">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {adminList.map((staff) => {
                        const isApproved = staff.isApprovedByOwner ?? true;
                        const isOwnerStaff = staff.isOwner || staff.role === 'Super Admin';

                        return (
                          <tr key={staff.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-mono font-bold text-slate-900">
                              <div className="flex items-center gap-1.5">
                                {isOwnerStaff && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                                <span>{staff.id}</span>
                              </div>
                            </td>

                            <td className="p-3 font-mono font-bold text-emerald-800">
                              {staff.username || 'সেট করা নেই'}
                            </td>

                            <td className="p-3">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedStaffForView(staff);
                                  setIsStaffDetailOpen(true);
                                }}
                                className="font-bold text-slate-900 hover:text-[#007460] hover:underline text-left cursor-pointer flex items-center gap-1 group"
                                title="ক্লিক করে সম্পূর্ণ নিয়োগ তথ্য দেখুন"
                              >
                                <span>{staff.name}</span>
                                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#007460]" />
                              </button>
                              <span className="text-[10px] text-slate-400 block">{staff.department || 'এডমিন স্টাফ'}</span>
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

                            <td className="p-3 font-mono text-slate-800">
                              {staff.phone}
                            </td>

                            <td className="p-3 text-center">
                              {isOwnerStaff ? (
                                <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full inline-block">
                                  মালিক (কনফার্মড)
                                </span>
                              ) : isApproved ? (
                                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3 text-emerald-700" />
                                  <span>মালিক কর্তৃক অনুমোদিত</span>
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 animate-pulse">
                                  <span>মালিকের অনুমোদন অপেক্ষমাণ</span>
                                </span>
                              )}
                            </td>

                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedStaffForView(staff);
                                    setIsStaffDetailOpen(true);
                                  }}
                                  className="px-2 py-1 bg-slate-100 hover:bg-[#007460] hover:text-white text-slate-700 font-bold rounded text-[10px] transition-colors cursor-pointer"
                                  title="সব তথ্য দেখুন"
                                >
                                  তথ্য দেখুন
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setStaffToEdit(staff);
                                    setIsRecruitModalOpen(true);
                                  }}
                                  className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded text-[10px] border border-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                                  title="এডমিন তথ্য পরিবর্তন করুন"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span>তথ্য পরিবর্তন</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION B: REGISTERED CUSTOMERS & NID VERIFICATION */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      নিবন্ধিত গ্রাহক ও জাতীয় পরিচয়পত্র (NID) ভেরিফিকেশন
                    </h3>
                    <p className="text-xs text-slate-500">
                      প্রতারণা প্রতিরোধে ভেরিফাইড সেলার অনুমোদন নিয়ন্ত্রণ করুন
                    </p>
                  </div>
                </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">ইউজার নাম</th>
                      <th className="p-3">মোবাইল নম্বর</th>
                      <th className="p-3">ইমেইল (Gmail)</th>
                      <th className="p-3">এনআইডি নম্বর</th>
                      <th className="p-3">ভেরিফিকেশন স্ট্যাটাস</th>
                      <th className="p-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                        <span>আকবর হোসেন (এডমিন)</span>
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </td>
                      <td className="p-3 font-mono">01855-667788</td>
                      <td className="p-3">akbarhossain2034@gmail.com</td>
                      <td className="p-3 font-mono">19952671829000123</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px]">
                          অনুমোদিত ভেরিফাইড
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="text-xs text-emerald-700 font-semibold">সক্রিয়</span>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                        <span>তানভীর আহমেদ (সেলার)</span>
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </td>
                      <td className="p-3 font-mono">01712-345678</td>
                      <td className="p-3">tanvir.dhaka@gmail.com</td>
                      <td className="p-3 font-mono">19922671844991122</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px]">
                          অনুমোদিত ভেরিফাইড
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="text-xs text-emerald-700 font-semibold">সক্রিয়</span>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                        <span>ফারহান চৌধুরী</span>
                      </td>
                      <td className="p-3 font-mono">01911-556677</td>
                      <td className="p-3">farhan99@yahoo.com</td>
                      <td className="p-3 font-mono">প্রক্রিয়াধীন...</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold text-[11px]">
                          পেন্ডিং রিভিউ
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-semibold">
                          অনুমোদন দিন
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          )}

          {/* TAB 5: MONETIZATION & REVENUE MANAGEMENT */}
          {activeTab === 'revenue' && (
            <div className="p-4 sm:p-6 space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <CircleDollarSign className="w-5 h-5 text-amber-600" />
                    <span>প্ল্যাটফর্ম আয় ও মনিটাইজেশন কন্ট্রোল সেন্টার</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    আপনার মার্কেটপ্লেস থেকে কীভাবে আয় হচ্ছে এবং কমিশন উত্তোলন করার সম্পূর্ণ হিসাব
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <span className="text-xs font-semibold text-emerald-900">এসক্রো কমিশন রেট:</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-emerald-800 text-sm">
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="10"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(Number(e.target.value) || 2.5)}
                      className="w-14 px-1.5 py-0.5 bg-white border border-emerald-300 rounded text-center text-xs"
                    />
                    <span>%</span>
                  </div>
                </div>
              </div>

              {/* Earnings Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-xl border border-emerald-200 shadow-2xs">
                  <div className="text-xs font-semibold text-emerald-800 flex items-center justify-between">
                    <span>১. এসক্রো লেনদেন কমিশন</span>
                    <Percent className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-xl font-bold font-mono text-emerald-950 mt-1 tabular-nums">
                    ৳ {Math.round(totalVolume * (commissionRate / 100)).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-1">
                    মোট ভলিউমের ({commissionRate}%) কমিশন
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-white p-4 rounded-xl border border-amber-200 shadow-2xs">
                  <div className="text-xs font-semibold text-amber-800 flex items-center justify-between">
                    <span>২. ফিচার্ড অ্যাড বুস্টিং</span>
                    <Star className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-xl font-bold font-mono text-amber-950 mt-1 tabular-nums">
                    ৳ ৩,৯৮০
                  </div>
                  <div className="text-[11px] text-amber-700 mt-1">
                    ৮টি প্রিমিয়াম বুস্ট বিজ্ঞাপন ফি
                  </div>
                </div>

                <div className="bg-gradient-to-br from-sky-50 to-white p-4 rounded-xl border border-sky-200 shadow-2xs">
                  <div className="text-xs font-semibold text-sky-800 flex items-center justify-between">
                    <span>৩. ভেরিফাইড শপ ব্যাজ</span>
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                  </div>
                  <div className="text-xl font-bold font-mono text-sky-950 mt-1 tabular-nums">
                    ৳ ১,৯৯৮
                  </div>
                  <div className="text-[11px] text-sky-700 mt-1">
                    ২ জন ট্রাস্টেড মার্চেন্ট সাবস্ক্রিপশন
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl border border-indigo-200 shadow-2xs">
                  <div className="text-xs font-semibold text-indigo-800 flex items-center justify-between">
                    <span>৪. কুরিয়ার ডেলিভারি মার্জিন</span>
                    <Truck className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-xl font-bold font-mono text-indigo-950 mt-1 tabular-nums">
                    ৳ ৫৪০
                  </div>
                  <div className="text-[11px] text-indigo-700 mt-1">
                    স্টেডফাস্ট/পাঠাও পার্সেল কমিশন
                  </div>
                </div>

              </div>

              {/* Total Balance & Withdrawal Box */}
              <div className="p-4 sm:p-5 bg-slate-900 text-white rounded-xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                    এডমিন উত্তোলনযোগ্য নিট ব্যালেন্স (Available Net Profit)
                  </span>
                  <div className="text-3xl font-extrabold font-mono tabular-nums text-white mt-1">
                    ৳ {(Math.round(totalVolume * (commissionRate / 100)) + 3980 + 1998 + 540).toLocaleString()} BDT
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    বিকাশ, নগদ বা ব্যাংক অ্যাকাউন্টে যে কোনো সময় আয় ট্রান্সফার করতে পারেন
                  </p>
                </div>

                {/* Withdraw Form */}
                <div className="bg-slate-800 p-3.5 rounded-lg border border-slate-700 w-full md:w-auto shrink-0 space-y-2">
                  <div className="text-xs font-bold text-slate-200">আয় উত্তোলন (Withdraw)</div>
                  
                  {withdrawSuccess && (
                    <div className="p-2 bg-emerald-600 text-white rounded text-[11px] font-semibold flex items-center gap-1">
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>উত্তোলন রিকোয়েস্ট সফল হয়েছে! আপনার অ্যাকাউন্টে টাকা পৌঁছাবে।</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <select
                      value={withdrawMethod}
                      onChange={(e) => setWithdrawMethod(e.target.value as any)}
                      className="px-2 py-1 text-xs bg-slate-900 border border-slate-600 rounded text-slate-200"
                    >
                      <option value="bKash">bKash (বিকাশ)</option>
                      <option value="Nagad">Nagad (নগদ)</option>
                      <option value="Bank">ব্যাংক ট্রান্সফার</option>
                    </select>
                    <input
                      type="text"
                      value={withdrawNumber}
                      onChange={(e) => setWithdrawNumber(e.target.value)}
                      placeholder="অ্যাকাউন্ট নম্বর"
                      className="px-2 py-1 text-xs bg-slate-900 border border-slate-600 rounded text-slate-200 font-mono"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setWithdrawSuccess(true);
                      setTimeout(() => setWithdrawSuccess(false), 3000);
                    }}
                    className="w-full py-1.5 bg-[#007460] hover:bg-[#005e4e] text-white rounded text-xs font-bold transition-colors cursor-pointer"
                  >
                    টাকা উত্তোলন করুন
                  </button>
                </div>
              </div>

              {/* 5 Proven Revenue Streams Guide */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Banknote className="w-4 h-4 text-emerald-700" />
                  <span>এই ওয়েবসাইট থেকে আয় করার ৫টি নিশ্চিত মাধ্যম:</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  
                  <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-1 shadow-2xs">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] font-mono">১</span>
                      <span>এসক্রো লেনদেন কমিশন (Escrow Commission)</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed pl-6">
                      ক্রেতা যখন বিকাশ বা কার্ড দিয়ে টাকা পরিশোধ করে পণ্য কিনবেন, আপনি প্ল্যাটফর্মের পক্ষ থেকে প্রতি সফল বিক্রয়ে <strong>১% থেকে ৩%</strong> কমিশন পাবেন। যেমন: ১টি ১,০০,০০০ টাকার আইফোনে আপনার লাভ <strong>৳ ২,৫০০</strong>।
                    </p>
                  </div>

                  <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-1 shadow-2xs">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[11px] font-mono">২</span>
                      <span>বিজ্ঞাপন বুস্ট ও ফিচার্ড বিজ্ঞাপন ফি (Featured Ads)</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed pl-6">
                      বিক্রেতারা তাদের পণ্য দ্রুত বিক্রির জন্য সাইটের সবার উপরে বিজ্ঞাপন পিন করতে <strong>৳ ১৯৯ থেকে ৳ ৪৯৯</strong> দিয়ে "Urgent" বা "Featured" প্যাকেজ কিনবেন। Bikroy.com এর আয়ের বড় অংশ আসে এখান থেকে।
                    </p>
                  </div>

                  <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-1 shadow-2xs">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center text-[11px] font-mono">৩</span>
                      <span>ভেরিফাইড শপ / মেম্বারশিপ সাবস্ক্রিপশন (Shop Membership)</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed pl-6">
                      নিয়মিত দোকানদার ও পাইকারি বিক্রেতারা আনলিমিটেড বিজ্ঞাপন দেওয়া এবং বিশ্বাসযোগ্য গ্রিন/ব্লু ব্যাজ পাওয়ার জন্য মাসিক <strong>৳ ৯৯৯ বা ৳ ১,৯৯৯</strong> সাবস্ক্রিপশন ফি দেবেন।
                    </p>
                  </div>

                  <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-1 shadow-2xs">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-[11px] font-mono">৪</span>
                      <span>কুরিয়ার ডেলিভারি পার্টনারশিপ মার্জিন (Courier Margin)</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed pl-6">
                      Steadfast, Pathao Express বা RedX এর সাথে মার্চেন্ট চুক্তি করে গ্রাহকের নিকট থেকে ৳ ১২০ নেওয়া হলে কুরিয়ার চার্জ ৳ ১০০ পরিশোধ করে প্রতি পার্সেল ডেলিভারিতে <strong>৳ ২০</strong> আপনার লাভ থাকবে।
                    </p>
                  </div>

                </div>
              </div>

              {/* Admin Roles & Responsibilities Guide */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#007460]" />
                  <span>সাইট পরিচালনায় এডমিনের মূল কাজ কী কী?</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-emerald-600 font-bold">✔</span>
                    <div>
                      <strong>বিজ্ঞাপন অনুমোদন ও মডারেশন:</strong> ক্রেতাদের সুরক্ষায় ভুয়া ফোন নম্বর, বিভ্রান্তিকর দাম বা নিষিদ্ধ পণ্য থাকলে বিজ্ঞাপন বাতিল করবেন এবং সঠিক বিজ্ঞাপন অনুমোদন করবেন।
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-emerald-600 font-bold">✔</span>
                    <div>
                      <strong>এসক্রো ও পেমেন্ট রিলিজ:</strong> ক্রেতা কুরিয়ারের মাধ্যমে পণ্য পেয়ে সন্তোষ প্রকাশ করলে বিক্রেতার বিকাশ/নগদে টাকা ছাড় দেবেন।
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-emerald-600 font-bold">✔</span>
                    <div>
                      <strong>বিরোধ নিষ্পত্তি (Dispute Support):</strong> কোনো ক্রেতা ভাঙা বা ভুল পণ্য পেলে তদন্ত করে ক্রেতাকে সম্পূর্ণ টাকা রিফান্ড দেওয়ার ক্ষমতা আপনার হাতে।
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-emerald-600 font-bold">✔</span>
                    <div>
                      <strong>ইউজার ভেরিফিকেশন ও বিশ্বাসযোগ্যতা:</strong> সেলারদের জাতীয় পরিচয়পত্র (NID) নম্বর ও ডকুমেন্টস চেক করে তাদেরকে ‘ভেরিফাইড সেলার’ ব্যাজ প্রদান করবেন।
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: SITE BRANDING & DOMAIN SETTINGS (সার্ভার ও ডোমেইন সেটিংস) */}
          {activeTab === 'settings' && (
            <div className="p-4 sm:p-6 space-y-6">
              
              {/* Header Box */}
              <div className="bg-gradient-to-r from-slate-900 to-[#005a4b] text-white p-5 rounded-xl border border-slate-700 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-amber-400 text-slate-950">
                        <Globe className="w-5 h-5" />
                      </span>
                      <h3 className="text-base sm:text-lg font-bold">
                        🌐 সার্ভার ও ডোমেইন নাম কনফিগারেশন (Site Name & Domain Setup)
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-3xl leading-relaxed">
                      যেই নামে আপনি ডোমেইন কিনবেন, সেই নামটি শুধু এখানে লিখে 'সংরক্ষণ করুন' বাটনে চাপ দিন। আপনার সাইটের সকল স্থানে (লগইন/সাইন ইন পেজ, হেডার বার, ফুটার, ব্রাউজার টাইটেল ও কপি লিংক) স্বয়ংক্রিয়ভাবে পরিবর্তিত হয়ে যাবে।
                    </p>
                  </div>

                  <div className="shrink-0 bg-white/10 px-3 py-2 rounded-lg border border-white/20 text-xs">
                    <div className="text-emerald-300 font-semibold text-[11px]">বর্তমান সক্রিয় নাম:</div>
                    <div className="text-white font-bold text-sm">{siteName}</div>
                  </div>
                </div>
              </div>

              {/* Success Notification Banner */}
              {siteSettingsSaved && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 flex items-center justify-between shadow-xs animate-in fade-in duration-200">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-sm font-bold">সাইটের নাম সফলভাবে আপডেট হয়েছে!</div>
                      <div className="text-xs text-emerald-700">
                        লগইন পেজ, হেডার লোগো, ফুটার এবং ব্রাউজার ট্যাবে নতুন নাম <strong>"{siteName}"</strong> সক্রিয় করা হয়েছে।
                      </div>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded font-bold">
                    সক্রিয় লাইভ
                  </span>
                </div>
              )}

              {/* Main Settings Form Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left 7 Columns: Form Input */}
                <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-5">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>নাম ও ব্র্যান্ডিং এডিটর (Name Editor)</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      নিচে আপনার পছন্দমতো নাম টাইপ করুন অথবা সাজেস্টেড নাম থেকে একটি পছন্দ করুন:
                    </p>
                  </div>

                  <form onSubmit={handleSaveSiteSettings} className="space-y-4">
                    
                    {/* Field 1: Site Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        ০১. সাইটের নাম / ব্র্যান্ড নেম (Site Brand Name) *
                      </label>
                      <input
                        type="text"
                        value={inputSiteName}
                        onChange={(e) => setInputSiteName(e.target.value)}
                        placeholder="যেমন: BikroyBazar, DeshiBazar, আমার বাজার..."
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#007460] focus:border-[#007460] bg-slate-50 focus:bg-white"
                        required
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        এই নামটি লগইন পেজ, ওয়েবসাইটের প্রধান হেডার, কপিরাইট এবং ব্রাউজার ট্যাবে প্রদর্শিত হবে।
                      </p>
                    </div>

                    {/* Quick Preset Badges */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                        দ্রুত বাছাই করার জন্য কিছু জনপ্রিয় নাম:
                      </label>
                      <div className="flex items-center gap-2 flex-wrap">
                        {['BikroyBazar', 'DeshiBazar', 'KinboBechbo', 'AmarMarket', 'HatBazar', 'BikroyMela'].map((nameOption) => (
                          <button
                            type="button"
                            key={nameOption}
                            onClick={() => setInputSiteName(nameOption)}
                            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                              inputSiteName === nameOption 
                                ? 'bg-[#007460] text-white border-[#007460] font-bold shadow-xs' 
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {nameOption}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Field 2: Domain Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        ০২. আপনার ডোমেইন অ্যাড্রেস (Domain Name URL)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">https://</span>
                        <input
                          type="text"
                          value={inputDomainName}
                          onChange={(e) => setInputDomainName(e.target.value)}
                          placeholder="yourdomain.com"
                          className="w-full pl-18 pr-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#007460] bg-slate-50 focus:bg-white"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        আপনি ডোমেইন রেজিস্ট্রেশন করার পর যেই ডোমেইন লিংক পাবেন তা এখানে দিতে পারেন।
                      </p>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="submit"
                        className="py-2.5 px-6 bg-[#007460] hover:bg-[#005a4b] text-white rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>সংরক্ষণ করুন ও সাইট নাম আপডেট করুন</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setInputSiteName(siteName);
                          setInputDomainName(domainName);
                        }}
                        className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        রিসেট
                      </button>
                    </div>

                  </form>
                </div>

                {/* Right 5 Columns: Live Real-time Previews */}
                <div className="lg:col-span-5 space-y-4">
                  
                  {/* Preview Card */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Laptop className="w-4 h-4 text-[#007460]" />
                        <span>লাইভ প্রিভিউ (কোথায় কেমন দেখাবে)</span>
                      </h5>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                        রিয়েলটাইম
                      </span>
                    </div>

                    {/* Preview 1: Auth Page Header & Welcome Box */}
                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                      <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                        <span>০১. লগইন ও সাইন-ইন পেজে:</span>
                        <span className="text-[10px] text-emerald-600 font-semibold">১০০% ব্র্যান্ডেড</span>
                      </div>
                      
                      {/* Mini Mock Header */}
                      <div className="bg-[#007460] text-white p-2.5 rounded shadow-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 border-t-2 border-b-2 border-white"></div>
                          <span className="font-extrabold text-sm lowercase tracking-tight">
                            {inputSiteName ? inputSiteName.toLowerCase() : 'site'}
                          </span>
                        </div>
                        <div className="text-[10px] opacity-90">Cart | Login</div>
                      </div>

                      {/* Mini Mock Welcome */}
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-100 text-center space-y-0.5">
                        <div className="font-bold text-xs text-slate-900">
                          Welcome to {inputSiteName || 'Site'}!
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Please login.
                        </div>
                      </div>
                    </div>

                    {/* Preview 2: Main Website Navbar */}
                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                      <div className="text-[11px] font-bold text-slate-700">
                        ০২. মূল ওয়েবসাইটের প্রধান হেডারে:
                      </div>
                      
                      {/* Mini Mock Header */}
                      <div className="bg-[#007460] text-white p-2.5 rounded shadow-xs flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-sm">
                          <span className="text-amber-300">●</span>
                          <span>{inputSiteName || 'Site'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-emerald-100">
                          <span>সব বিজ্ঞাপন</span>
                          <span>অর্ডার</span>
                        </div>
                      </div>
                    </div>

                    {/* Preview 3: Browser Tab Title */}
                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-700">
                        ০৩. ব্রাউজার ট্যাব টাইটেল:
                      </div>
                      <div className="bg-slate-100 px-3 py-1.5 rounded border border-slate-200 text-xs font-mono text-slate-800 truncate">
                        🌐 {inputSiteName || 'Site'} – বাংলাদেশের অনলাইন কেনাবেচার প্ল্যাটফর্ম
                      </div>
                    </div>

                    {/* Actions: Test Login or View Customer View */}
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsAdminMode(false);
                          setActiveModal('auth');
                        }}
                        className="flex-1 py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold text-center transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>লগইন পেজে গিয়ে পরীক্ষা করুন</span>
                      </button>

                      <button
                        onClick={() => setIsAdminMode(false)}
                        className="py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-semibold transition-colors cursor-pointer"
                      >
                        কাষ্টমার ভিউ
                      </button>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 7: DATA BACKUP & RESTORE (ডাটা ব্যাকআপ ও রিস্টোর সেন্টার) */}
          {activeTab === 'backup' && (
            <div className="p-4 sm:p-6 space-y-6">
              
              {/* Header Box */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-5 rounded-xl border border-slate-700 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 rounded-lg bg-emerald-500 text-slate-950 font-bold shadow-xs">
                        <Database className="w-5 h-5" />
                      </span>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold">
                          💾 প্ল্যাটফর্ম ডাটা ব্যাকআপ ও ডাউনলোড সেন্টার (Data Backup & Export)
                        </h3>
                        <p className="text-xs sm:text-sm text-emerald-200 mt-0.5">
                          যেকোনো সময় ১-ক্লিকে সাইটের সমস্ত ডাটা ডাউনলোড করে সংরক্ষণ করুন অথবা ব্যাকআপ ফাইল থেকে রিস্টোর করুন।
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 bg-white/10 px-3.5 py-2 rounded-lg border border-white/20 text-xs">
                    <div className="text-emerald-300 font-semibold text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>সর্বশেষ ব্যাকআপ স্ট্যাটাস:</span>
                    </div>
                    <div className="text-white font-mono font-bold text-xs mt-0.5">{lastBackupTime}</div>
                  </div>
                </div>

                {/* Metrics Count Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-slate-700/60 text-xs">
                  <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                    <div className="text-slate-400 text-[11px]">মোট বিজ্ঞাপন (Ads)</div>
                    <div className="text-emerald-400 font-bold font-mono text-base">{ads.length} টি</div>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                    <div className="text-slate-400 text-[11px]">অর্ডার ও পার্সেল (Orders)</div>
                    <div className="text-amber-300 font-bold font-mono text-base">{orders.length} টি</div>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                    <div className="text-slate-400 text-[11px]">এসক্রো লেনদেন (Finance)</div>
                    <div className="text-sky-300 font-bold font-mono text-base">{transactions.length} টি</div>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                    <div className="text-slate-400 text-[11px]">বর্তমান ডোমেইন ও সাইট</div>
                    <div className="text-white font-bold text-xs truncate font-mono">{siteName}</div>
                  </div>
                </div>
              </div>

              {/* Notification Banner on Download */}
              {backupDownloadSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 flex items-center justify-between shadow-xs animate-in fade-in duration-200">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-sm font-bold">ডাউনলোড সফল হয়েছে!</div>
                      <div className="text-xs text-emerald-700">{backupDownloadSuccess}</div>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded font-bold">
                    সংরক্ষিত
                  </span>
                </div>
              )}

              {/* Restore Status Notification */}
              {restoreStatus.type && (
                <div className={`p-4 rounded-xl border flex items-center justify-between shadow-xs animate-in fade-in duration-200 ${
                  restoreStatus.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-red-50 border-red-300 text-red-900'
                }`}>
                  <div className="flex items-center gap-2.5">
                    {restoreStatus.type === 'success' ? (
                      <CheckCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                    )}
                    <div>
                      <div className="text-sm font-bold">
                        {restoreStatus.type === 'success' ? 'অপারেশন সম্পন্ন হয়েছে' : 'ত্রুটি দেখা দিয়েছে'}
                      </div>
                      <div className="text-xs">{restoreStatus.message}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 1: MASTER COMPLETE BACKUP (HERO CARD) */}
              <div className="bg-white p-5 sm:p-6 rounded-xl border-2 border-[#007460]/20 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <DownloadCloud className="w-5 h-5 text-[#007460]" />
                      <span>০১. সম্পূর্ণ সিস্টেম ডাটাবেজ ব্যাকআপ (Full System JSON Backup)</span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                      এই ফাইলটিতে আপনার সাইটের সমস্ত তথ্য একসাথে থাকবে—বিজ্ঞাপন, ইমেজ লিংক, ক্রেতা-বিক্রেতার অর্ডার, এসক্রো ট্রানজেকশন আইডি, চ্যাট মেসেজ, নোটিফিকেশন এবং ব্র্যান্ডিং সেটিংস। এটি যে কোনো সময় নতুন সার্ভার বা প্ল্যাটফর্মে ট্রান্সফারের জন্য সর্বোত্তম।
                    </p>
                  </div>
                  <span className="self-start sm:self-center text-xs bg-emerald-100 text-[#007460] font-bold px-3 py-1 rounded-full border border-emerald-200">
                    JSON ফরম্যাট
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <button
                    onClick={handleDownloadFullBackup}
                    className="py-3 px-6 bg-[#007460] hover:bg-[#005a4b] text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer hover:shadow-lg active:scale-98"
                  >
                    <Download className="w-4 h-4" />
                    <span>সম্পূর্ণ ডাটা ব্যাকআপ ডাউনলোড করুন (.JSON)</span>
                  </button>

                  <div className="text-xs text-slate-500 flex items-center gap-2 px-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>ফাইল নেম: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">{siteName.replace(/\s+/g, '_')}_Full_Backup_{new Date().toISOString().slice(0, 10)}.json</code></span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: MODULAR EXPORTS (CSV / EXCEL SPREADSHEETS) */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>০২. মডিউলভিত্তিক এক্সপোর্ট (Excel ও Google Sheets ফ্রেন্ডলি CSV)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    হিসাব-নিকাশ, অডিট বা রিপোর্ট পর্যালোচনার জন্য পৃথক পৃথক মডিউলের ডাটা মাইক্রোসফট এক্সেল ফরম্যাটে ডাউনলোড করুন:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  
                  {/* Modular Card 1: Ads */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-3 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="p-1.5 rounded-lg bg-emerald-100 text-[#007460] font-bold">
                          <Layers className="w-4 h-4" />
                        </span>
                        <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-semibold">
                          {ads.length} টি আইটেম
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-slate-900">বিজ্ঞাপন ও পণ্য ডাটা</h5>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        শিরোনাম, ক্যাটাগরি, মূল্য, কন্ডিশন, বিক্রেতার নাম ও মোবাইল নম্বরসহ বিজ্ঞাপনের সম্পূর্ণ তালিকা।
                      </p>
                    </div>

                    <button
                      onClick={handleDownloadAdsCSV}
                      className="w-full py-2 px-3 bg-white hover:bg-emerald-50 text-[#007460] border border-[#007460]/40 hover:border-[#007460] rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>বিজ্ঞাপন CSV ডাউনলোড</span>
                    </button>
                  </div>

                  {/* Modular Card 2: Orders & Escrow */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-3 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 font-bold">
                          <CreditCard className="w-4 h-4" />
                        </span>
                        <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-semibold">
                          {orders.length} টি অর্ডার
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-slate-900">এসক্রো অর্ডার ও আর্থিক হিসেব</h5>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        অর্ডার আইডি, লেনদেনের পরিমাণ, বিকাশ/নগদ পেমেন্ট ট্রানজেকশন, কুরিয়ার ট্র্যাকিং ও ডেলিভারি স্ট্যাটাস।
                      </p>
                    </div>

                    <button
                      onClick={handleDownloadOrdersCSV}
                      className="w-full py-2 px-3 bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 hover:border-amber-500 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>অর্ডার ও এসক্রো CSV ডাউনলোড</span>
                    </button>
                  </div>

                  {/* Modular Card 3: Users */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-3 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="p-1.5 rounded-lg bg-sky-100 text-sky-800 font-bold">
                          <Users className="w-4 h-4" />
                        </span>
                        <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-semibold">
                          সেলার ও বায়ার
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-slate-900">ইউজার ও বিক্রেতা ডিরেক্টরি</h5>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        নিবন্ধিত ক্রেতা ও ভেরিফাইড সেলারদের নাম, মোবাইল, জিমেইল, এনআইডি স্ট্যাটাস ও ঠিকানা রিপোর্ট।
                      </p>
                    </div>

                    <button
                      onClick={handleDownloadUsersCSV}
                      className="w-full py-2 px-3 bg-white hover:bg-sky-50 text-sky-800 border border-sky-300 hover:border-sky-500 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ইউজার তালিকা CSV ডাউনলোড</span>
                    </button>
                  </div>

                </div>
              </div>

              {/* SECTION 3: RESTORE / IMPORT BACKUP (ব্যাকআপ থেকে ডাটা ফিরিয়ে আনা) */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-sky-600" />
                    <span>০৩. পূর্বে সংরক্ষিত ব্যাকআপ থেকে ডাটা রিস্টোর (Restore from Backup)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    পূর্বে ডাউনলোড করা যে কোনো JSON ব্যাকআপ ফাইল আপলোড করে সাইটের যাবতীয় বিজ্ঞাপন, অর্ডার ও তথ্য আগের অবস্থায় ফিরিয়ে আনুন:
                  </p>
                </div>

                {/* Upload File Input */}
                <div className="p-5 border-2 border-dashed border-slate-300 hover:border-[#007460] rounded-xl bg-slate-50/50 text-center transition-colors">
                  <input
                    type="file"
                    id="backup-file-upload"
                    accept=".json"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="backup-file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-11 h-11 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center">
                      <FileJson className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      ক্লিক করে ব্যাকআপ JSON ফাইল নির্বাচন করুন
                    </div>
                    <div className="text-[11px] text-slate-500">
                      অথবা আপনার কম্পিউটার থেকে .json ব্যাকআপ ফাইলটি এখানে ড্রপ করুন
                    </div>
                  </label>
                </div>

                {/* Parsed File Preview Box */}
                {restoreFile && (
                  <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>ব্যাকআপ ফাইল যাচাই সম্পন্ন: {restoreFileName}</span>
                      </div>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded">
                        ভেরিফায়েড ব্যাকআপ
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="bg-white p-2 rounded border border-emerald-200">
                        <span className="text-slate-500 text-[10px] block">সাইটের নাম:</span>
                        <strong className="text-slate-900">{restoreFile.siteSettings?.siteName || restoreFile.metadata?.siteName || 'N/A'}</strong>
                      </div>
                      <div className="bg-white p-2 rounded border border-emerald-200">
                        <span className="text-slate-500 text-[10px] block">বিজ্ঞাপন সংখ্যা:</span>
                        <strong className="text-slate-900">{restoreFile.ads?.length || 0} টি</strong>
                      </div>
                      <div className="bg-white p-2 rounded border border-emerald-200">
                        <span className="text-slate-500 text-[10px] block">অর্ডার সংখ্যা:</span>
                        <strong className="text-slate-900">{restoreFile.orders?.length || 0} টি</strong>
                      </div>
                      <div className="bg-white p-2 rounded border border-emerald-200">
                        <span className="text-slate-500 text-[10px] block">তৈরির তারিখ:</span>
                        <strong className="text-slate-900 text-[11px] truncate block">{restoreFile.backupDate || 'রেকর্ড আছে'}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        onClick={handleExecuteRestore}
                        className="py-2 px-5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <CheckCheck className="w-4 h-4" />
                        <span>হ্যাঁ, এই ব্যাকআপটি কার্যকর/রিস্টোর করুন</span>
                      </button>

                      <button
                        onClick={() => {
                          setRestoreFile(null);
                          setRestoreFileName('');
                        }}
                        className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      >
                        বাতিল
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 4: SAFETY RESET / DISASTER RECOVERY (জরুরি রিসেট) */}
              <div className="bg-rose-50/70 p-5 rounded-xl border border-rose-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <h4 className="text-xs font-bold text-rose-900">
                      ০৪. সিস্টেম ফ্যাক্টরি রিসেট (Disaster Recovery & Clean Reset)
                    </h4>
                  </div>
                  <span className="text-[10px] bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded">
                    সতর্কতা
                  </span>
                </div>

                <p className="text-xs text-rose-800 leading-relaxed">
                  পরীক্ষামূলক ডাটা মুছে দিয়ে প্ল্যাটফর্মটিকে একদম নতুন প্রাথমিক ফ্যাক্টরি অবস্থায় ফিরিয়ে নিতে চাইলে নিচের রিসেট বাটনে চাপ দিন। রিসেটের পূর্বে অবশ্যই উপরের বাটনে চাপ দিয়ে একটি ব্যাকআপ ডাউনলোড করে রাখুন।
                </p>

                {showResetConfirm ? (
                  <div className="p-3 bg-white rounded-lg border border-rose-300 space-y-2">
                    <div className="text-xs font-bold text-rose-900">
                      আপনি কি নিশ্চিত যে সমস্ত টেস্ট ডাটা রিসেট করতে চান?
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleResetDataConfirm}
                        className="py-1.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                      >
                        হ্যাঁ, রিসেট নিশ্চিত করুন
                      </button>
                      <button
                        onClick={() => setShowResetConfirm(false)}
                        className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold transition-colors cursor-pointer"
                      >
                        বাতিল
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="py-2 px-4 bg-white hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>ফ্যাক্টরি রিসেট অপশন চালু করুন</span>
                  </button>
                )}
              </div>

            </div>
          )}

          {/* TAB 8: OFFERS & WELCOME BONUS (অফার ও ওয়েলকাম বোনাস ব্যবস্থাপনা) */}
          {activeTab === 'offers' && (
            <div className="p-4 sm:p-6 space-y-6">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                    <Gift className="w-5 h-5 text-amber-600" />
                    <span>অফার, ওয়েলকাম ক্যাশ বোনাস ও উইথড্রয়াল কন্ট্রোল</span>
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      প্রমোশন ইঞ্জিন
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    নতুন একাউন্ট খোলার সাইনআপ বোনাসের পরিমাণ (৫০-৫০০ টাকা) সেট করুন, টাকা তোলার আবেদন অনুমোদন করুন এবং মার্কেটিং ক্যাম্পেইন পরিচালনা করুন।
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 font-semibold bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200">
                    বর্তমান বোনাস: <b>৳ {offerSettings?.signupBonusAmount || 100}</b> ({offerSettings?.isBonusEnabled ? 'সক্রিয়' : 'নিষ্ক্রিয়'})
                  </span>
                </div>
              </div>

              {/* Status Action Notification Banner */}
              {trxActionMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{trxActionMsg}</span>
                  </div>
                  <button onClick={() => setTrxActionMsg(null)} className="text-emerald-700 hover:text-emerald-900">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* ======================================================== */}
              {/* SECTION 1: ওয়েলকাম সাইনআপ বোনাস কনফিগারেশন */}
              {/* ======================================================== */}
              <div className="bg-gradient-to-br from-amber-50/60 via-white to-slate-50 p-5 rounded-xl border border-amber-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs">
                      ৳
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        ০১. ওয়েলকাম সাইনআপ বোনাস সেটিংস (Welcome Bonus Configuration)
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        নতুন কাস্টমার একাউন্ট খোলার সাথে সাথে কত টাকা ফ্রি পাবে তা এখান থেকে সেট করুন
                      </span>
                    </div>
                  </div>

                  {offerSavedMsg && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1 shadow-2xs animate-fadeIn">
                      <Check className="w-3.5 h-3.5" />
                      <span>সেটিংস সফলভাবে সংরক্ষিত হয়েছে!</span>
                    </span>
                  )}
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  updateOfferSettings({
                    signupBonusAmount: Number(bonusAmountInput),
                    isBonusEnabled: bonusEnabledInput,
                    minWithdrawLimit: Number(minWithdrawInput),
                    isBannerActive: bannerActiveInput,
                    campaignTitleBn: campaignTitleInput.trim() || `নতুন অ্যাকাউন্ট খুললেই পাচ্ছেন ${bonusAmountInput} টাকা ফ্রি ওয়েলকাম ক্যাশ বোনাস!`,
                    campaignDescriptionBn: campaignDescInput.trim() || 'এই বোনাস ব্যালেন্স দিয়ে সাইটে যেকোনো পণ্য কিনতে পারবেন অথবা সরাসরি বিকাশ ও নগদে ক্যাশ আউট করতে পারবেন!'
                  });
                  setOfferSavedMsg(true);
                  setTimeout(() => setOfferSavedMsg(false), 3000);
                }} className="space-y-4 text-xs">
                  
                  {/* বোনাস অন/অফ সুইচ এবং টাকার পরিমাণ */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* অপশন ১: বোনাস স্ট্যাটাস */}
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                      <label className="block font-bold text-slate-800">
                        সাইনআপ বোনাস স্ট্যাটাস:
                      </label>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setBonusEnabledInput(true)}
                          className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                            bonusEnabledInput
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          ✓ বোনাস চালু
                        </button>
                        <button
                          type="button"
                          onClick={() => setBonusEnabledInput(false)}
                          className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                            !bonusEnabledInput
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          ✕ বন্ধ
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        চালু থাকলে নতুন রেজিস্টার্ড ইউজাররা স্বয়ংক্রিয়ভাবে ব্যালেন্স পাবে।
                      </span>
                    </div>

                    {/* অপশন ২: বোনাসের টাকার পরিমাণ (৫০ - ৫০০) */}
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800">
                          বোনাসের টাকার পরিমাণ:
                        </label>
                        <span className="font-mono font-black text-amber-700 text-sm">
                          ৳ {bonusAmountInput}
                        </span>
                      </div>
                      
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-slate-400">
                          ৳
                        </span>
                        <input
                          type="number"
                          min={10}
                          max={5000}
                          value={bonusAmountInput || ''}
                          onChange={(e) => setBonusAmountInput(Number(e.target.value) || 0)}
                          className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#007460]"
                        />
                      </div>

                      {/* দ্রুত নির্বাচন বাটন */}
                      <div className="flex items-center gap-1.5 pt-1">
                        {[50, 100, 200, 500].map(amt => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setBonusAmountInput(amt)}
                            className={`flex-1 py-1 text-[11px] font-bold rounded border transition-colors cursor-pointer ${
                              bonusAmountInput === amt 
                                ? 'bg-amber-500 text-slate-950 border-amber-600' 
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            ৳ {amt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* অপশন ৩: সর্বনিম্ন ক্যাশ উইথড্র লিমিট */}
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800">
                          সর্বনিম্ন উত্তোলন সীমা (Min Withdraw):
                        </label>
                        <span className="font-mono font-black text-emerald-700 text-sm">
                          ৳ {minWithdrawInput}
                        </span>
                      </div>

                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-slate-400">
                          ৳
                        </span>
                        <input
                          type="number"
                          min={20}
                          max={2000}
                          value={minWithdrawInput || ''}
                          onChange={(e) => setMinWithdrawInput(Number(e.target.value) || 0)}
                          className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#007460]"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 pt-1">
                        {[50, 100, 200, 500].map(amt => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setMinWithdrawInput(amt)}
                            className={`flex-1 py-1 text-[11px] font-bold rounded border transition-colors cursor-pointer ${
                              minWithdrawInput === amt 
                                ? 'bg-emerald-600 text-white border-emerald-700' 
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            ৳ {amt}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* প্রচারণামূলক ব্যানার টেক্সট */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Megaphone className="w-4 h-4 text-amber-600" />
                        <span>হোমপেজ ও সাইটের অফার ব্যানার কাস্টমাইজেশন</span>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={bannerActiveInput}
                          onChange={(e) => setBannerActiveInput(e.target.checked)}
                          className="rounded text-[#007460] focus:ring-[#007460]"
                        />
                        <span className="text-[11px] font-semibold text-slate-700">সাইটের শীর্ষে প্রচার ব্যানার দেখান</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">
                          অফার ব্যানারের শিরোনাম (Title):
                        </label>
                        <input
                          type="text"
                          value={campaignTitleInput}
                          onChange={(e) => setCampaignTitleInput(e.target.value)}
                          placeholder="উদাঃ নতুন অ্যাকাউন্ট খুললেই পাচ্ছেন ১০০ টাকা ফ্রি ওয়েলকাম ক্যাশ বোনাস!"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#007460]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">
                          অফার ব্যানারের বিবরণ (Description):
                        </label>
                        <input
                          type="text"
                          value={campaignDescInput}
                          onChange={(e) => setCampaignDescInput(e.target.value)}
                          placeholder="উদাঃ এই বোনাস ব্যালেন্স দিয়ে সাইটে কেনাকাটা বা বিকাশ/নগদে ক্যাশ নিন!"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#007460]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* সেভ বাটন */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#007460] hover:bg-[#005f4e] text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      <span>অফার সেটিংস সংরক্ষণ করুন (Save Settings)</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* ======================================================== */}
              {/* SECTION 2: কাস্টমারদের টাকা তোলার আবেদন ও অনুমোদন (WITHDRAWALS) */}
              {/* ======================================================== */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <ArrowDownToLine className="w-4 h-4 text-emerald-700" />
                      <span>০২. গ্রাহকদের টাকা তোলার আবেদন ও অনুমোদন (Customer Withdrawal Requests)</span>
                      <span className="bg-emerald-100 text-[#007460] text-[10px] font-black px-2 py-0.5 rounded-full">
                        মোট: {withdrawalRequests.length}টি
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      গ্রাহকরা বিকাশ, নগদ বা রকেটে টাকা তোলার যে আবেদন জমা দিয়েছেন তা যাচাই করে এখানে টাকা পাঠিয়ে স্ট্যাটাস আপডেট করুন।
                    </p>
                  </div>

                  {/* স্ট্যাটাস ফিল্টার */}
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs">
                    {[
                      { id: 'all', label: 'সকল' },
                      { id: 'Pending', label: `অপেক্ষমাণ (${withdrawalRequests.filter(w => w.status === 'Pending').length})` },
                      { id: 'Paid', label: `পেইড (${withdrawalRequests.filter(w => w.status === 'Paid').length})` },
                      { id: 'Rejected', label: `বাতিল (${withdrawalRequests.filter(w => w.status === 'Rejected').length})` }
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setWithdrawFilterStatus(f.id)}
                        className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                          withdrawFilterStatus === f.id
                            ? 'bg-white text-slate-950 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* উইথড্রয়াল টেবিল */}
                {withdrawalRequests.filter(w => withdrawFilterStatus === 'all' || w.status === withdrawFilterStatus).length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    কোনো উইথড্রয়াল রিকোয়েস্ট পাওয়া যায়নি।
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-[11px] text-slate-600 uppercase tracking-wider">
                          <th className="py-2.5 px-3 font-semibold">আবেদন আইডি</th>
                          <th className="py-2.5 px-3 font-semibold">গ্রাহকের নাম ও মোবাইল</th>
                          <th className="py-2.5 px-3 font-semibold">উত্তোলনের মাধ্যম ও নম্বর</th>
                          <th className="py-2.5 px-3 font-semibold">টাকার পরিমাণ</th>
                          <th className="py-2.5 px-3 font-semibold">তারিখ</th>
                          <th className="py-2.5 px-3 font-semibold">স্ট্যাটাস</th>
                          <th className="py-2.5 px-3 font-semibold text-right">এডমিন অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {withdrawalRequests
                          .filter(w => withdrawFilterStatus === 'all' || w.status === withdrawFilterStatus)
                          .map(item => (
                            <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-3 font-mono font-bold text-slate-800">
                                #{item.id}
                              </td>
                              <td className="py-3 px-3">
                                <div className="font-bold text-slate-900">{item.userName}</div>
                                <div className="text-[10px] text-slate-500 font-mono">{item.userPhone}</div>
                              </td>
                              <td className="py-3 px-3">
                                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                    item.gateway === 'bKash' ? 'bg-pink-100 text-pink-800' :
                                    item.gateway === 'Nagad' ? 'bg-orange-100 text-orange-800' :
                                    item.gateway === 'Rocket' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {item.gateway}
                                  </span>
                                  <span className="font-mono">{item.accountNumber}</span>
                                </div>
                                <span className="text-[10px] text-slate-500">
                                  ধরন: {item.accountType === 'agent' ? 'এজেন্ট (Agent)' : 'ব্যক্তিগত (Personal)'}
                                </span>
                              </td>
                              <td className="py-3 px-3 font-mono font-black text-emerald-700 text-sm">
                                ৳ {item.amount}
                              </td>
                              <td className="py-3 px-3 text-[11px] text-slate-500">
                                {item.requestedAt}
                              </td>
                              <td className="py-3 px-3">
                                {item.status === 'Pending' && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                    <Clock className="w-3 h-3 text-amber-600" />
                                    <span>অপেক্ষমাণ</span>
                                  </span>
                                )}
                                {item.status === 'Paid' && (
                                  <div className="inline-flex flex-col">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                                      <span>পেইড (পরিশোধিত)</span>
                                    </span>
                                    {item.trxId && (
                                      <span className="text-[9px] font-mono text-slate-500 mt-0.5">Trx: {item.trxId}</span>
                                    )}
                                  </div>
                                )}
                                {item.status === 'Rejected' && (
                                  <div className="inline-flex flex-col">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                                      <XCircle className="w-3 h-3 text-rose-600" />
                                      <span>বাতিল ও রিফান্ডেড</span>
                                    </span>
                                    {item.adminNote && (
                                      <span className="text-[9px] text-slate-500 mt-0.5">{item.adminNote}</span>
                                    )}
                                  </div>
                                )}
                              </td>
                              <td className="py-3 px-3 text-right">
                                {item.status === 'Pending' ? (
                                  <div className="flex items-center justify-end gap-1.5">
                                    {payingRequestId === item.id ? (
                                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-emerald-400 shadow-sm animate-fadeIn">
                                        <input
                                          type="text"
                                          placeholder="বিকাশ/নগদ TrxID লিখুন"
                                          value={inputTrxId}
                                          onChange={(e) => setInputTrxId(e.target.value)}
                                          className="px-2 py-1 text-xs border border-slate-300 rounded outline-none font-mono font-bold w-36"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (!inputTrxId.trim()) {
                                              alert('দয়া করে TrxID লিখুন');
                                              return;
                                            }
                                            updateWithdrawalStatus(item.id, 'Paid', inputTrxId.trim(), 'এডমিন দ্বারা অনুমোদিত ও সফলভাবে পাঠানো হয়েছে।');
                                            setPayingRequestId(null);
                                            setInputTrxId('');
                                            setTrxActionMsg('টাকা পাঠানো সম্পন্ন হয়েছে এবং স্ট্যাটাস Paid আপডেট করা হয়েছে!');
                                            setTimeout(() => setTrxActionMsg(null), 3000);
                                          }}
                                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold"
                                        >
                                          কনফার্ম
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => { setPayingRequestId(null); setInputTrxId(''); }}
                                          className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ) : (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setPayingRequestId(item.id);
                                            setInputTrxId(`BK${Date.now().toString().slice(-6)}`);
                                          }}
                                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                                        >
                                          <Check className="w-3 h-3" />
                                          <span>টাকা পাঠানো হয়েছে</span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const reason = prompt('আবেদন বাতিলের কারণ লিখুন (টাকা গ্রাহকের ওয়ালেটে ফেরত যাবে):', 'ভুল অ্যাকাউন্ট নম্বর / নম্বরটি সচল নয়');
                                            if (reason !== null) {
                                              updateWithdrawalStatus(item.id, 'Rejected', undefined, reason);
                                              setTrxActionMsg('আবেদন বাতিল করা হয়েছে এবং গ্রাহকের ওয়ালেটে রিফান্ড করা হয়েছে।');
                                              setTimeout(() => setTrxActionMsg(null), 3000);
                                            }
                                          }}
                                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-xs font-semibold transition-colors cursor-pointer"
                                        >
                                          বাতিল
                                        </button>
                                      </>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-[11px] text-slate-400 italic">সম্পন্ন হয়েছে</span>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* ======================================================== */}
              {/* SECTION 3: গ্রাহককে সরাসরি বিশেষ বোনাস প্রদান (MANUAL BONUS) */}
              {/* ======================================================== */}
              <div className="bg-gradient-to-br from-indigo-50/60 via-white to-slate-50 p-5 rounded-xl border border-indigo-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-indigo-700" />
                    <h4 className="text-sm font-bold text-slate-900">
                      ০৩. যেকোনো গ্রাহককে সরাসরি বিশেষ বোনাস বা ক্যাশ উপহার দিন (Manual Bonus Grant)
                    </h4>
                  </div>
                  {grantSuccessMsg && (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full animate-fadeIn">
                      {grantSuccessMsg}
                    </span>
                  )}
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!grantPhone.trim() || grantAmount <= 0) {
                    alert('সঠিক তথ্য দিন');
                    return;
                  }
                  grantCustomBonus(currentUser?.id || 'user-001', Number(grantAmount), grantNote);
                  setGrantSuccessMsg(`🎉 সফলভাবে ${grantPhone} গ্রাহককে ৳ ${grantAmount} বিশেষ বোনাস পাঠানো হয়েছে!`);
                  setTimeout(() => setGrantSuccessMsg(''), 4000);
                }} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs items-end">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      গ্রাহকের মোবাইল নম্বর:
                    </label>
                    <input
                      type="text"
                      value={grantPhone}
                      onChange={(e) => setGrantPhone(e.target.value)}
                      placeholder="01332520826"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      বোনাসের পরিমাণ (টাকা):
                    </label>
                    <input
                      type="number"
                      min={10}
                      value={grantAmount || ''}
                      onChange={(e) => setGrantAmount(Number(e.target.value) || 0)}
                      placeholder="যেমনঃ ১০০"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      বোনাসের কারণ বা বিবরণ:
                    </label>
                    <input
                      type="text"
                      value={grantNote}
                      onChange={(e) => setGrantNote(e.target.value)}
                      placeholder="যেমনঃ সেরা বিক্রেতা রিওয়ার্ড"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>বোনাস পাঠান</span>
                  </button>
                </form>
              </div>

              {/* ======================================================== */}
              {/* SECTION 4: নতুন মার্কেটপ্লেসের জন্য সুপার প্রমোশন ও অফার আইডিয়াবক্স */}
              {/* ======================================================== */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    ০৪. নতুন বিজনেসে কাস্টমার ও বিক্রেতা দ্রুত বাড়ানোর ৬টি প্রমাণিত অফার আইডিয়া (Growth Strategies)
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                  
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                    <div className="font-bold text-emerald-800 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">১</span>
                      <span>রেফারেল বোনাস (Refer & Earn)</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      যেকোনো ইউজার তার বন্ধুকে সাইটে আনলে এবং সে ১টি বিজ্ঞাপন দিলে উভয়কেই <b>৳ ২৫ বা ৳ ৫০</b> টাকা বোনাস দিন। এটি ফেসবুকে ভাইরাল হতে সাহায্য করে।
                    </p>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                    <div className="font-bold text-emerald-800 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">২</span>
                      <span>১ম বিজ্ঞাপনে ফ্রি ফিচার্ড / বুস্ট</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      নতুন বিক্রেতাকে প্রথম বিজ্ঞাপনে ৩ দিনের জন্য <b>টপ অ্যাড (Top Ad) বা ফিচার্ড ব্যাজ</b> সম্পূর্ণ ফ্রি দিন। এতে সে বিজ্ঞাপন দিতে অনেক বেশি উৎসাহিত হবে।
                    </p>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                    <div className="font-bold text-emerald-800 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">৩</span>
                      <span>সেলার মাইলস্টোন ক্যাশব্যাক</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      কোনো বিক্রেতা ৫টি বা ১০টি সক্রিয় বিজ্ঞাপন পোস্ট করলে তার ওয়ালেটে <b>৳ ১০০ টাকা বোনাস</b> যোগ করে দিন, যা সে সরাসরি বিকাশে তুলতে পারবে।
                    </p>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                    <div className="font-bold text-emerald-800 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">৪</span>
                      <span>১ম কেনাকাটায় ফ্রি কুরিয়ার ডেলিভারি</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      নতুন ক্রেতাদের আস্থা তৈরি করতে প্রথম এসক্রো অর্ডারে <b>১০০% ডেলিভারি চার্জ ফ্রি</b> দিন। এতে দ্বিধা দূর হবে এবং ক্রেতারা দ্রুত অর্ডার করবে।
                    </p>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                    <div className="font-bold text-emerald-800 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">৫</span>
                      <span>দৈনিক চেক-ইন ও লাকি স্পিন</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      প্রতিদিন সাইটে লগইন করলে ১০-২০ রিওয়ার্ড পয়েন্ট দিন। ১০০ পয়েন্ট হলে ১০ টাকা ডিসকাউন্ট বা বুস্টিং স্লট বিনামূল্যে পাওয়া যাবে।
                    </p>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                    <div className="font-bold text-emerald-800 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">৬</span>
                      <span>উৎসব ও মৌসুমভিত্তিক মেগা ড্র</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      ঈদ বা নতুন বছর উপলক্ষ্যে প্রতি কেনাবেচায় লটারির টিকিট দিন, যেখানে সেরা বিক্রেতা ও সেরা ক্রেতার জন্য আকর্ষণীয় গ্যাজেট বা ক্যাশ প্রাইজ থাকবে।
                    </p>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 9: (C) OWNER MASTER CONTROL PANEL (মালিকের বিশেষ নিয়ন্ত্রণ ও অভ্যন্তরীণ হিসাব) */}
          {activeTab === 'owner' && <AdminOwnerControlPanel />}

          {/* TAB 10: AUDIT & ACTION HISTORY LOGS (এডমিন অ্যাকশন ও অডিট হিস্ট্রি লগ) */}
          {activeTab === 'audit' && <AdminAuditLogsTab />}

        </div>

      </div>

      {/* Admin Specific Modals */}
      {adminAdToDelete && <AdminDeleteAdModal />}
      <BusinessPolicyModal />
      <OffersShowcaseModal />

      {/* OWNER PROFILE & INFORMATION EDIT MODAL */}
      {isOwnerProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="bg-linear-to-r from-[#007460] to-emerald-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
                  <Crown className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                    <span>মালিকের প্রোফাইল ও তথ্য পরিবর্তন</span>
                  </h3>
                  <p className="text-xs text-emerald-100">
                    এডমিন অ্যাকাউন্টের নাম, মোবাইল, আইডি ও পাসওয়ার্ড পরিবর্তন করুন
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOwnerProfileModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveOwnerProfile} className="p-5 sm:p-6 space-y-4">
              {profileSavedMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-[#007460] font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#007460] shrink-0" />
                  <span>{profileSavedMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    মালিকের পুরো নাম (Full Name) *
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Md. Akbar Hossain"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-[#007460] focus:ring-1 focus:ring-[#007460] font-medium"
                    required
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    মোবাইল নম্বর (Mobile) *
                  </label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+8801851554333"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-[#007460] focus:ring-1 focus:ring-[#007460] font-mono font-medium"
                    required
                  />
                </div>

                {/* Admin ID */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    এডমিন আইডি (Admin ID) *
                  </label>
                  <input
                    type="text"
                    value={profileId}
                    onChange={(e) => setProfileId(e.target.value)}
                    placeholder="ID-00009"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-[#007460] focus:ring-1 focus:ring-[#007460] font-mono font-bold text-[#007460]"
                    required
                  />
                </div>

                {/* Password with Eye Toggle */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    লগইন পাসওয়ার্ড (Password) *
                  </label>
                  <div className="relative">
                    <input
                      type={showProfilePass ? 'text' : 'password'}
                      value={profilePassword}
                      onChange={(e) => setProfilePassword(e.target.value)}
                      placeholder="admin"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-[#007460] focus:ring-1 focus:ring-[#007460] font-mono pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowProfilePass(!showProfilePass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      {showProfilePass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ইমেইল এড্রেস (Email - ঐচ্ছিক)
                  </label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    placeholder="akbar.office10@gmail.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-[#007460] focus:ring-1 focus:ring-[#007460] font-medium"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                <Crown className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>সতর্কতা:</strong> আপনি এই তথ্যগুলো পরিবর্তন করলে পরবর্তী প্রতিটি লগইনে নতুন মোবাইল, আইডি ও পাসওয়ার্ড ব্যবহার করতে হবে।
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOwnerProfileModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#007460] hover:bg-[#005e4e] text-white text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>তথ্য সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Detail Modal (Requirement B) */}
      <StaffDetailModal
        staff={selectedStaffForView}
        isOpen={isStaffDetailOpen}
        onClose={() => {
          setIsStaffDetailOpen(false);
          setSelectedStaffForView(null);
        }}
        onToggleApproval={toggleAdminApproval}
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
          setStaffToast(msg);
          setTimeout(() => setStaffToast(null), 4000);
        }}
      />
    </div>
  );
};
