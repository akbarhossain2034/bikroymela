import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Package, 
  Star, 
  MessageSquare, 
  Gift, 
  Share2, 
  MapPin, 
  CreditCard, 
  HelpCircle, 
  Edit3, 
  Lock, 
  Mail, 
  ShieldCheck, 
  ArrowLeft, 
  Menu, 
  Search, 
  ShoppingCart, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Save, 
  X, 
  CheckCircle,
  Phone,
  Building2,
  Calendar,
  FileText,
  History,
  CheckSquare,
  Clock,
  Filter,
  Layers,
  ExternalLink,
  XCircle,
  Briefcase,
  DollarSign
} from 'lucide-react';

interface AdminManageAccountViewProps {
  onBackToDashboard: () => void;
}

export const AdminManageAccountView: React.FC<AdminManageAccountViewProps> = ({ onBackToDashboard }) => {
  const { siteName, activeAdmin, updateAdminProfile, adminLogout, ads, adModerationLogs } = useApp();

  const [activeSidebarTab, setActiveSidebarTab] = useState<string>('account_info');
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form states initialized with activeAdmin
  const splitName = (activeAdmin?.name || 'Md. Akbar Hossain').split(' ');
  const [firstName, setFirstName] = useState(splitName.slice(0, -1).join(' ') || splitName[0] || 'Akbar');
  const [lastName, setLastName] = useState(splitName.slice(-1).join(' ') || 'Hossain');
  const [contactNumber, setContactNumber] = useState(activeAdmin?.phone || '+8801851554333');
  const [designation, setDesignation] = useState(activeAdmin?.designation || activeAdmin?.role || '');
  const [department, setDepartment] = useState(activeAdmin?.department || '');
  const [salary, setSalary] = useState(activeAdmin?.salary || '');
  const [dob, setDob] = useState(activeAdmin?.dob || '1988-05-12');
  const [gender, setGender] = useState(activeAdmin?.gender || 'Male');
  const [uniqueName, setUniqueName] = useState(activeAdmin?.username || 'Arifhossain388@');
  const [telephone, setTelephone] = useState(activeAdmin?.telephone || '০২-৯৮৭৬৫৪৩');
  const [nid, setNid] = useState(activeAdmin?.nid || '১৯৮৮১২৩৪৫৬৭৮৯');
  const [presentAddress, setPresentAddress] = useState(activeAdmin?.presentAddress || 'ধানমন্ডি, রোড ৭, ঢাকা');
  const [permanentAddress, setPermanentAddress] = useState(activeAdmin?.permanentAddress || 'মিরপুর ২, ঢাকা');
  const [emergencyName, setEmergencyName] = useState(activeAdmin?.emergencyContact?.name || 'সালমা বেগম');
  const [emergencyPhone, setEmergencyPhone] = useState(activeAdmin?.emergencyContact?.phone || '01711-223344');
  const [emergencyRelation, setEmergencyRelation] = useState(activeAdmin?.emergencyContact?.relation || 'স্ত্রী');

  const [emailInput, setEmailInput] = useState(activeAdmin?.email || 'Akbarhossain2044@gmail.com');
  const [passwordInput, setPasswordInput] = useState(activeAdmin?.password || 'admin');
  const [showPassword, setShowPassword] = useState(false);

  // Work History States (Requirement 03: 5 Years Range & Search by Ad ID / Title)
  const [historySearch, setHistorySearch] = useState('');
  const [historyActionFilter, setHistoryActionFilter] = useState<'all' | 'Approved' | 'Verified' | 'Processed' | 'Rejected'>('all');
  const [historyStartDate, setHistoryStartDate] = useState('2021-01-01');
  const [historyEndDate, setHistoryEndDate] = useState('2026-12-31');
  const [historyPreset, setHistoryPreset] = useState<string>('5years');
  const [selectedAdForView, setSelectedAdForView] = useState<any | null>(null);

  // Sync states whenever activeAdmin changes
  React.useEffect(() => {
    if (activeAdmin) {
      const sName = (activeAdmin.name || '').split(' ');
      setFirstName(sName.slice(0, -1).join(' ') || sName[0] || '');
      setLastName(sName.slice(-1).join(' ') || '');
      setContactNumber(activeAdmin.phone || '');
      setDesignation(activeAdmin.designation || activeAdmin.role || '');
      setDepartment(activeAdmin.department || '');
      setSalary(activeAdmin.salary || '');
      setDob(activeAdmin.dob || '1990-01-01');
      setGender(activeAdmin.gender || 'Male');
      setUniqueName(activeAdmin.username || '');
      setTelephone(activeAdmin.telephone || '');
      setNid(activeAdmin.nid || '');
      setPresentAddress(activeAdmin.presentAddress || '');
      setPermanentAddress(activeAdmin.permanentAddress || '');
      setEmergencyName(activeAdmin.emergencyContact?.name || '');
      setEmergencyPhone(activeAdmin.emergencyContact?.phone || '');
      setEmergencyRelation(activeAdmin.emergencyContact?.relation || '');
      setEmailInput(activeAdmin.email || '');
      setPasswordInput(activeAdmin.password || '');
    }
  }, [activeAdmin]);

  // Save Account Information
  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAdmin) return;
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const res = updateAdminProfile(activeAdmin?.id || 'ID-00009', {
      name: fullName,
      phone: contactNumber.trim(),
      designation: designation.trim(),
      role: designation.trim() || activeAdmin?.role || 'Moderator',
      department: department.trim(),
      salary: salary,
      dob: dob.trim(),
      gender,
      username: uniqueName.trim(),
      telephone: telephone.trim(),
      nid: nid.trim(),
      presentAddress: presentAddress.trim(),
      permanentAddress: permanentAddress.trim(),
      emergencyContact: {
        name: emergencyName.trim(),
        phone: emergencyPhone.trim(),
        relation: emergencyRelation.trim()
      }
    });

    setSuccessToast(res.message || 'অ্যাকাউন্ট তথ্য সফলভাবে হালনাগাদ করা হয়েছে!');
    setIsEditingInfo(false);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Save Email
  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !activeAdmin) return;
    updateAdminProfile(activeAdmin?.id || 'ID-00009', { email: emailInput.trim() });
    setSuccessToast('ইমেইল সফলভাবে পরিবর্তন করা হয়েছে!');
    setIsChangingEmail(false);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Save Password
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim() || !activeAdmin) return;
    updateAdminProfile(activeAdmin?.id || 'ID-00009', { password: passwordInput.trim() });
    setSuccessToast('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!');
    setIsChangingPass(false);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Helper to parse year from timestamp
  const parseYearFromTimestamp = (str: string): number => {
    if (!str) return 2026;
    const match = str.match(/202[0-9]|201[0-9]/);
    if (match) return parseInt(match[0], 10);
    const bnMatch = str.match(/২০২[০-৯]|২০১[০-৯]/);
    if (bnMatch) {
      const bnToEn: Record<string, string> = { '০':'0', '১':'1', '২':'2', '৩':'3', '৪':'4', '৫':'5', '৬':'6', '৭':'7', '৮':'8', '৯':'9' };
      const enYear = bnMatch[0].split('').map(c => bnToEn[c] || c).join('');
      return parseInt(enYear, 10);
    }
    return 2026;
  };

  const applyDatePreset = (preset: '5years' | '2026' | '2025' | '2024' | '2023' | '2022' | '30days') => {
    setHistoryPreset(preset);
    if (preset === '5years') {
      setHistoryStartDate('2021-01-01');
      setHistoryEndDate('2026-12-31');
    } else if (preset === '2026') {
      setHistoryStartDate('2026-01-01');
      setHistoryEndDate('2026-12-31');
    } else if (preset === '2025') {
      setHistoryStartDate('2025-01-01');
      setHistoryEndDate('2025-12-31');
    } else if (preset === '2024') {
      setHistoryStartDate('2024-01-01');
      setHistoryEndDate('2024-12-31');
    } else if (preset === '2023') {
      setHistoryStartDate('2023-01-01');
      setHistoryEndDate('2023-12-31');
    } else if (preset === '2022') {
      setHistoryStartDate('2022-01-01');
      setHistoryEndDate('2022-12-31');
    } else if (preset === '30days') {
      setHistoryStartDate('2026-09-17');
      setHistoryEndDate('2026-10-17');
    }
  };

  // Requirement 03: Gather All Work Logs for this Admin's ID
  const rawAdminWorkLogs = useMemo(() => {
    if (!activeAdmin) return [];

    const matchesCurrentAdmin = (logAdminId?: string, logAdminName?: string) => {
      if (!logAdminId && !logAdminName) return false;
      const cleanTargetId = (logAdminId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanActiveId = (activeAdmin.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      
      if (cleanTargetId && cleanActiveId && (cleanTargetId === cleanActiveId || cleanTargetId.includes(cleanActiveId) || cleanActiveId.includes(cleanTargetId))) {
        return true;
      }
      if (activeAdmin.isOwner && (logAdminId === 'ADM-101' || logAdminId === 'ID-00009' || logAdminId === '00009')) {
        return true;
      }
      if (logAdminName && activeAdmin.name && logAdminName.toLowerCase().trim() === activeAdmin.name.toLowerCase().trim()) {
        return true;
      }
      return false;
    };

    // 1. Direct logs from adModerationLogs
    const directLogs = (adModerationLogs || []).filter(log => matchesCurrentAdmin(log.adminId, log.adminName));

    // 2. Extra logs from ads collection
    const extraLogs: typeof adModerationLogs = [];
    (ads || []).forEach(ad => {
      if (ad.lastModeratedBy && matchesCurrentAdmin(ad.lastModeratedBy.adminId, ad.lastModeratedBy.adminName)) {
        const alreadyExists = directLogs.some(l => l.adId === ad.id && l.timestamp === ad.lastModeratedBy?.timestamp);
        if (!alreadyExists) {
          extraLogs.push({
            id: `LOG-AD-${ad.id}`,
            adId: ad.id,
            adTitle: ad.titleBn || ad.titleEn,
            adminId: ad.lastModeratedBy.adminId,
            adminName: ad.lastModeratedBy.adminName,
            action: (ad.lastModeratedBy.action as any) || 'Approved',
            newStatus: ad.status,
            timestamp: ad.lastModeratedBy.timestamp,
            note: 'বিজ্ঞাপন পর্যালোচনা ও অনুমোদন সম্পন্ন করা হয়েছে।'
          });
        }
      }
    });

    const combined = [...directLogs, ...extraLogs];

    // If activeAdmin has few or zero mock logs yet, populate high-fidelity past 5 years activity records
    if (combined.length === 0) {
      return [
        {
          id: `HIST-LOG-01`,
          adId: 'ad-101',
          adTitle: 'iPhone 14 Pro Max 256GB Deep Purple',
          adminId: activeAdmin.id,
          adminName: activeAdmin.name,
          adminRole: activeAdmin.isOwner ? 'মালিক' : (activeAdmin.designation || activeAdmin.role),
          action: 'Approved' as const,
          newStatus: 'Approved',
          timestamp: '১৩ অক্টোবর ২০২৬, সকাল ১০:১৫',
          note: 'কাগজপত্র ও অরিজিনাল ক্যাশমেমো ছবি যাচাইপূর্বক চূড়ান্ত অনুমোদন প্রদান করা হয়েছে।'
        },
        {
          id: `HIST-LOG-02`,
          adId: 'ad-103',
          adTitle: 'Sony Bravia 55 Inch 4K Smart Android TV',
          adminId: activeAdmin.id,
          adminName: activeAdmin.name,
          adminRole: activeAdmin.isOwner ? 'মালিক' : (activeAdmin.designation || activeAdmin.role),
          action: 'Verified' as const,
          newStatus: 'Verified',
          timestamp: '০৮ সেপ্টেম্বর ২০২৫, দুপুর ১২:৩০',
          note: 'বিক্রেতার সাথে যোগাযোগ করে টিভির ওয়ারেন্টি কার্ড ও এনআইডি কপি যাচাই সম্পন্ন।'
        },
        {
          id: `HIST-LOG-03`,
          adId: 'ad-105',
          adTitle: 'Royal Enfield Classic 350 Stealth Black',
          adminId: activeAdmin.id,
          adminName: activeAdmin.name,
          adminRole: activeAdmin.isOwner ? 'মালিক' : (activeAdmin.designation || activeAdmin.role),
          action: 'Approved' as const,
          newStatus: 'Approved',
          timestamp: '১৪ জুন ২০২৪, বিকাল ০৪:১০',
          note: 'বিআরটিএ রেজিস্ট্রেশন ও ব্লুবুক পেপারস যাচাই করে অনুমোদন দেওয়া হয়েছে।'
        },
        {
          id: `HIST-LOG-04`,
          adId: 'ad-108',
          adTitle: 'MacBook Pro M2 16GB 512GB Space Grey',
          adminId: activeAdmin.id,
          adminName: activeAdmin.name,
          adminRole: activeAdmin.isOwner ? 'মালিক' : (activeAdmin.designation || activeAdmin.role),
          action: 'Processed' as const,
          newStatus: 'Processed',
          timestamp: '২২ নভেম্বর ২০২৩, রাত ০৯:৪৫',
          note: 'ছবি ও ব্যাটারি সাইকেল কাউন্ট ডাটা প্রসেস করা হয়েছে।'
        },
        {
          id: `HIST-LOG-05`,
          adId: 'ad-112',
          adTitle: 'Dell XPS 15 9520 OLED Touchscreen',
          adminId: activeAdmin.id,
          adminName: activeAdmin.name,
          adminRole: activeAdmin.isOwner ? 'মালিক' : (activeAdmin.designation || activeAdmin.role),
          action: 'Rejected' as const,
          newStatus: 'Rejected',
          timestamp: '০৫ জানুয়ারি ২০২২, সকাল ১১:২০',
          note: 'অসম্পূর্ণ বিবরণ ও অস্পষ্ট ছবি থাকার কারণে পুনরায় আপলোডের নির্দেশনা দিয়ে বাতিল করা হয়েছে।'
        }
      ];
    }

    return combined;
  }, [activeAdmin, adModerationLogs, ads]);

  // Filter Work History by Search (Ad ID / Title), Action, and 5-Year Date Range
  const filteredWorkLogs = useMemo(() => {
    return rawAdminWorkLogs.filter(log => {
      // 1. Search Filter (Ad ID or Title or Note)
      if (historySearch.trim()) {
        const query = historySearch.toLowerCase().trim();
        const matchesAdId = log.adId.toLowerCase().includes(query);
        const matchesTitle = log.adTitle.toLowerCase().includes(query);
        const matchesNote = log.note ? log.note.toLowerCase().includes(query) : false;
        if (!matchesAdId && !matchesTitle && !matchesNote) return false;
      }

      // 2. Action Filter
      if (historyActionFilter !== 'all' && log.action !== historyActionFilter) {
        return false;
      }

      // 3. Year & Date Filter
      const logYear = parseYearFromTimestamp(log.timestamp);
      const startYear = parseInt(historyStartDate.slice(0, 4), 10) || 2021;
      const endYear = parseInt(historyEndDate.slice(0, 4), 10) || 2026;
      if (logYear < startYear || logYear > endYear) {
        return false;
      }

      return true;
    });
  }, [rawAdminWorkLogs, historySearch, historyActionFilter, historyStartDate, historyEndDate]);

  // Statistics for Work History
  const approvedCount = rawAdminWorkLogs.filter(l => l.action === 'Approved').length;
  const verifiedCount = rawAdminWorkLogs.filter(l => l.action === 'Verified').length;
  const processedCount = rawAdminWorkLogs.filter(l => l.action === 'Processed').length;
  const rejectedCount = rawAdminWorkLogs.filter(l => l.action === 'Rejected').length;

  return (
    <div className="min-h-screen bg-[#f5f7f9] text-slate-800 flex flex-col font-sans">
      {/* ============================================================== */}
      {/* 1. TOP HEADER (BRAND THEME #007460)                            */}
      {/* ============================================================== */}
      <header className="bg-[#007460] text-white w-full sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          
          {/* Left: Back to Dashboard & Logo */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button 
              onClick={onBackToDashboard}
              className="text-white hover:opacity-80 p-1 cursor-pointer transition-opacity flex items-center gap-1.5 bg-black/20 hover:bg-black/30 px-2.5 py-1 rounded-lg text-xs font-semibold"
              title="এডমিন ড্যাশবোর্ডে ফিরুন"
            >
              <ArrowLeft className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">ড্যাশবোর্ডে ফিরুন</span>
            </button>
            <button
              onClick={onBackToDashboard}
              className="text-xl sm:text-2xl font-black tracking-tight text-white hover:opacity-95 cursor-pointer font-sans"
            >
              {siteName}
            </button>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-xl mx-2 sm:mx-4 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="বিজ্ঞাপন নম্বর, ইউজার আইডি বা তথ্য অনুসন্ধান করুন..."
                value={historySearch}
                onChange={(e) => {
                  setHistorySearch(e.target.value);
                  if (activeSidebarTab !== 'work_history' && e.target.value.trim()) {
                    setActiveSidebarTab('work_history');
                  }
                }}
                className="w-full bg-white text-slate-800 pl-4 pr-10 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm outline-none placeholder-slate-400 shadow-inner"
              />
              <button 
                type="button" 
                onClick={() => setActiveSidebarTab('work_history')}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-[#007460] text-white rounded-full hover:bg-[#005e4e] transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: User Profile Icon */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center shadow-xs">
                {activeAdmin?.name ? activeAdmin.name.charAt(0) : 'M'}
              </div>
              <div className="hidden lg:flex flex-col text-left leading-tight text-white">
                <span className="font-bold text-xs truncate max-w-[130px]">{activeAdmin?.name}</span>
                <span className="text-[10px] text-amber-300 font-mono">
                  {activeAdmin?.id} ({activeAdmin?.isOwner ? 'মালিক' : (activeAdmin?.designation || activeAdmin?.role || 'কর্মকর্তা')})
                </span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. SUB-HEADER BREADCRUMB & RETURN SHORTCUT                    */}
      {/* ============================================================== */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button onClick={onBackToDashboard} className="hover:text-[#007460] font-medium cursor-pointer">
              এডমিন প্যানেল
            </button>
            <span>/</span>
            <span className="text-slate-900 font-bold">Manage Account</span>
            <span>/</span>
            <span className="text-[#007460] font-semibold">
              {activeSidebarTab === 'work_history' ? 'কাজের হিস্ট্রি ও বিজ্ঞাপন অনুমোদন' : 'ব্যক্তিগত তথ্য ও প্রোফাইল'}
            </span>
          </div>

          <button
            onClick={onBackToDashboard}
            className="text-xs font-bold text-[#007460] hover:text-[#005e4e] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>এডমিন কন্ট্রোল প্যানেলে ফিরুন</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. MAIN CONTENT: Split Layout (Sidebar + Details)              */}
      {/* ============================================================== */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex-1">
        {successToast && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-300 text-[#007460] rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-[#007460] shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ============================================================ */}
          {/* LEFT SIDEBAR: "My Account" Options                           */}
          {/* ============================================================ */}
          <aside className="lg:col-span-3 bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">My Account</h2>
                <span className="text-[11px] text-slate-500 font-mono">
                  {activeAdmin?.id} ({activeAdmin?.isOwner ? 'মালিক' : (activeAdmin?.designation || activeAdmin?.role || 'কর্মকর্তা')})
                </span>
              </div>
            </div>

            <nav className="divide-y divide-slate-100 text-xs sm:text-sm font-medium">
              {/* 1. Account Information */}
              <button
                type="button"
                onClick={() => setActiveSidebarTab('account_info')}
                className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors cursor-pointer ${
                  activeSidebarTab === 'account_info'
                    ? 'bg-[#007460] text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    activeSidebarTab === 'account_info' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span>Account Information</span>
                </div>
              </button>

              {/* 2. Work History & Approval Audit (Requirement 03) */}
              <button
                type="button"
                onClick={() => setActiveSidebarTab('work_history')}
                className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors cursor-pointer ${
                  activeSidebarTab === 'work_history'
                    ? 'bg-[#007460] text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    activeSidebarTab === 'work_history' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-[#007460]'
                  }`}>
                    <History className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">কাজের হিস্ট্রি ও অনুমোদন লগ</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shrink-0 ${
                  activeSidebarTab === 'work_history' ? 'bg-white text-[#007460]' : 'bg-emerald-100 text-[#007460]'
                }`}>
                  {rawAdminWorkLogs.length}
                </span>
              </button>

              {/* 3. My Orders */}
              <button
                type="button"
                onClick={() => setActiveSidebarTab('orders')}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer ${
                  activeSidebarTab === 'orders' ? 'bg-[#007460] text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Package className="w-4 h-4 text-slate-400" />
                <span>My Orders</span>
              </button>

              {/* 4. Support Tickets */}
              <button
                type="button"
                onClick={() => setActiveSidebarTab('tickets')}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer ${
                  activeSidebarTab === 'tickets' ? 'bg-[#007460] text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>Support Tickets</span>
              </button>

              {/* 5. Help & Knowledge Base */}
              <button
                type="button"
                onClick={() => setActiveSidebarTab('help')}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer ${
                  activeSidebarTab === 'help' ? 'bg-[#007460] text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>Help & Knowledge Base</span>
              </button>
            </nav>
          </aside>

          {/* ============================================================ */}
          {/* RIGHT CONTENT AREA                                           */}
          {/* ============================================================ */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* ========================================================== */}
            {/* VIEW 1: WORK HISTORY & AD APPROVAL AUDIT (Requirement 03)  */}
            {/* ========================================================== */}
            {activeSidebarTab === 'work_history' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                
                {/* Header Banner */}
                <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold bg-[#007460] text-white px-2.5 py-0.5 rounded">
                          আইডি: {activeAdmin?.id}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">
                          {activeAdmin?.name} — কাজের হিস্ট্রি ও বিজ্ঞাপন অনুমোদন রেকর্ড
                        </h3>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                          {activeAdmin?.isOwner ? 'মালিক' : (activeAdmin?.designation || activeAdmin?.role || 'কর্মকর্তা')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        এই আইডি দিয়ে বিগত ৫ বছরে কোন কোন বিজ্ঞাপন অনুমোদন, যাচাই বা বাতিল করা হয়েছে তার স্বয়ংক্রিয় কাজের হিস্ট্রি।
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveSidebarTab('account_info')}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>প্রোফাইল তথ্য দেখুন</span>
                    </button>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5">
                      <div className="flex items-center justify-between text-emerald-800 text-xs font-bold mb-1">
                        <span>অনুমোদিত বিজ্ঞাপন</span>
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-emerald-950">{approvedCount}</div>
                      <span className="text-[10px] text-emerald-700 mt-0.5 block">Approved Ads</span>
                    </div>

                    <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-3.5">
                      <div className="flex items-center justify-between text-sky-800 text-xs font-bold mb-1">
                        <span>যাচাইকৃত বিজ্ঞাপন</span>
                        <ShieldCheck className="w-4 h-4 text-sky-600" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-sky-950">{verifiedCount}</div>
                      <span className="text-[10px] text-sky-700 mt-0.5 block">Verified Ads</span>
                    </div>

                    <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5">
                      <div className="flex items-center justify-between text-amber-800 text-xs font-bold mb-1">
                        <span>প্রসেসড বিজ্ঞাপন</span>
                        <Clock className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-amber-950">{processedCount}</div>
                      <span className="text-[10px] text-amber-700 mt-0.5 block">Processed</span>
                    </div>

                    <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-3.5">
                      <div className="flex items-center justify-between text-rose-800 text-xs font-bold mb-1">
                        <span>বাতিলকৃত বিজ্ঞাপন</span>
                        <XCircle className="w-4 h-4 text-rose-600" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-rose-950">{rejectedCount}</div>
                      <span className="text-[10px] text-rose-700 mt-0.5 block">Rejected</span>
                    </div>
                  </div>
                </div>

                {/* Search & 5-Year Date Range Filter Card */}
                <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Filter className="w-4 h-4 text-[#007460]" />
                      <span>নির্দিষ্ট তারিখ ও বিজ্ঞাপন নম্বর অনুযায়ী অনুসন্ধান (Search Filters)</span>
                    </h4>

                    {/* Quick Date Range Preset Buttons */}
                    <div className="flex items-center gap-1.5 flex-wrap text-xs">
                      <span className="text-[11px] text-slate-500 mr-1">রেঞ্জ প্রিসেট:</span>
                      <button
                        type="button"
                        onClick={() => applyDatePreset('5years')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                          historyPreset === '5years'
                            ? 'bg-[#007460] text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        গত ৫ বছর (সব)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyDatePreset('2026')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                          historyPreset === '2026'
                            ? 'bg-[#007460] text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        ২০২৬
                      </button>
                      <button
                        type="button"
                        onClick={() => applyDatePreset('2025')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                          historyPreset === '2025'
                            ? 'bg-[#007460] text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        ২০২৫
                      </button>
                      <button
                        type="button"
                        onClick={() => applyDatePreset('2024')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                          historyPreset === '2024'
                            ? 'bg-[#007460] text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        ২০২৪
                      </button>
                      <button
                        type="button"
                        onClick={() => applyDatePreset('30days')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                          historyPreset === '30days'
                            ? 'bg-[#007460] text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        গত ৩০ দিন
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                    {/* Search by Ad ID / Ad Number */}
                    <div className="sm:col-span-5">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        বিজ্ঞাপন নম্বর বা নাম দিয়ে খুঁজুন:
                      </label>
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={historySearch}
                          onChange={(e) => setHistorySearch(e.target.value)}
                          placeholder="যেমন: ad-101, iPhone, বাইক..."
                          className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:border-[#007460]"
                        />
                        {historySearch && (
                          <button 
                            type="button" 
                            onClick={() => setHistorySearch('')} 
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* From Date */}
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        শুরুর তারিখ (From):
                      </label>
                      <div className="relative">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="date"
                          value={historyStartDate}
                          onChange={(e) => {
                            setHistoryStartDate(e.target.value);
                            setHistoryPreset('custom');
                          }}
                          className="w-full pl-8 pr-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:border-[#007460] font-mono"
                        />
                      </div>
                    </div>

                    {/* To Date */}
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        শেষের তারিখ (To):
                      </label>
                      <div className="relative">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="date"
                          value={historyEndDate}
                          onChange={(e) => {
                            setHistoryEndDate(e.target.value);
                            setHistoryPreset('custom');
                          }}
                          className="w-full pl-8 pr-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:border-[#007460] font-mono"
                        />
                      </div>
                    </div>

                    {/* Action Filter */}
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1">অ্যাকশন:</label>
                      <select
                        value={historyActionFilter}
                        onChange={(e) => setHistoryActionFilter(e.target.value as any)}
                        className="w-full py-1.5 px-2 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:border-[#007460]"
                      >
                        <option value="all">সব</option>
                        <option value="Approved">Approved</option>
                        <option value="Verified">Verified</option>
                        <option value="Processed">Processed</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Work History Table */}
                <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
                  <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                        বিজ্ঞাপন অনুমোদন ও কাজের বিস্তারিত তালিকা ({filteredWorkLogs.length}টি রেকর্ড)
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        আইডি <strong className="font-mono text-slate-800">{activeAdmin?.id}</strong> দ্বারা সম্পন্নকৃত অ্যাকশন হিস্ট্রি
                      </p>
                    </div>

                    <span className="text-xs bg-emerald-100 text-[#007460] font-bold px-2.5 py-1 rounded-full">
                      বিগত ৫ বছরের ডাটা
                    </span>
                  </div>

                  {filteredWorkLogs.length === 0 ? (
                    <div className="p-10 text-center text-slate-500">
                      <History className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="text-sm font-semibold text-slate-700">কোন কাজের হিস্ট্রি পাওয়া যায়নি</p>
                      <p className="text-xs text-slate-400 mt-1">
                        তারিখের রেঞ্জ অথবা সার্চ ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setHistorySearch('');
                          setHistoryActionFilter('all');
                          applyDatePreset('5years');
                        }}
                        className="mt-3 px-3 py-1.5 bg-[#007460] text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        সকল রেকর্ড দেখুন (৫ বছর)
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                          <tr>
                            <th className="py-3 px-4">বিজ্ঞাপন নম্বর</th>
                            <th className="py-3 px-4">বিজ্ঞাপনের শিরোনাম ও ক্যাটাগরি</th>
                            <th className="py-3 px-4">অনুমোদনের তারিখ ও সময়</th>
                            <th className="py-3 px-4">অ্যাকশন / পদক্ষেপ</th>
                            <th className="py-3 px-4">অডিট নোট ও কাজের বিবরণ</th>
                            <th className="py-3 px-4">বিজ্ঞাপনের মূল্য</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredWorkLogs.map((log) => {
                            // Find matching ad for extra details
                            const matchingAd = (ads || []).find(a => a.id === log.adId);

                            return (
                              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                {/* Ad Number / ID */}
                                <td className="py-3 px-4 align-top">
                                  <span className="font-mono font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.8 rounded block w-fit text-[11px]">
                                    {log.adId}
                                  </span>
                                  {matchingAd?.status && (
                                    <span className="text-[10px] text-slate-500 block mt-1">
                                      বর্তমান: {matchingAd.status}
                                    </span>
                                  )}
                                </td>

                                {/* Ad Title & Category */}
                                <td className="py-3 px-4 align-top max-w-[220px]">
                                  <strong className="text-slate-900 font-bold block truncate">
                                    {log.adTitle}
                                  </strong>
                                  <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500 flex-wrap">
                                    {matchingAd?.category && (
                                      <span className="bg-slate-100 px-1.5 py-0.5 rounded">
                                        {matchingAd.category}
                                      </span>
                                    )}
                                    {matchingAd?.sellerName && (
                                      <span>সেলার: {matchingAd.sellerName}</span>
                                    )}
                                  </div>
                                </td>

                                {/* Approval Date & Time */}
                                <td className="py-3 px-4 align-top whitespace-nowrap">
                                  <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span>{log.timestamp}</span>
                                  </div>
                                </td>

                                {/* Action Performed */}
                                <td className="py-3 px-4 align-top whitespace-nowrap">
                                  {log.action === 'Approved' && (
                                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold text-[11px]">
                                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Approved (অনুমোদিত)</span>
                                    </span>
                                  )}
                                  {log.action === 'Verified' && (
                                    <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-800 px-2.5 py-1 rounded-full font-bold text-[11px]">
                                      <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                                      <span>Verified (যাচাইকৃত)</span>
                                    </span>
                                  )}
                                  {log.action === 'Processed' && (
                                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full font-bold text-[11px]">
                                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                                      <span>Processed (প্রসেসড)</span>
                                    </span>
                                  )}
                                  {log.action === 'Rejected' && (
                                    <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 px-2.5 py-1 rounded-full font-bold text-[11px]">
                                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                      <span>Rejected (বাতিলকৃত)</span>
                                    </span>
                                  )}
                                </td>

                                {/* Audit Note */}
                                <td className="py-3 px-4 align-top text-slate-600 max-w-[260px]">
                                  <p className="line-clamp-2 text-[11px] leading-relaxed">
                                    {log.note || 'যাচাই ও অনুমোদন রেকর্ড লিপিবদ্ধ করা হয়েছে।'}
                                  </p>
                                </td>

                                {/* Price */}
                                <td className="py-3 px-4 align-top font-mono font-bold text-slate-900 whitespace-nowrap">
                                  {matchingAd?.price ? `৳ ${matchingAd.price.toLocaleString()}` : '৳ ৫০,০০০+'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ========================================================== */}
            {/* VIEW 2: ACCOUNT INFORMATION (PROFILE EDIT & DETAILS)       */}
            {/* ========================================================== */}
            {activeSidebarTab === 'account_info' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* CARD 1: ACCOUNT INFORMATION (MATCHING Admin User Part.png) */}
                <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 sm:p-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        Account Information
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        প্রয়োজনে যে কোনো তথ্য পরিবর্তন ও সংরক্ষণ করতে পারবেন
                      </p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setIsEditingInfo(!isEditingInfo)}
                      className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#007460] border border-[#007460] rounded-md hover:bg-emerald-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isEditingInfo ? 'Cancel' : 'Edit Information'}</span>
                    </button>
                  </div>

                  {isEditingInfo ? (
                    /* EDIT FORM */
                    <form onSubmit={handleSaveInfo} className="space-y-4 text-xs sm:text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">First Name</label>
                          <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-[#007460]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-[#007460]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">পদবী (Designation)</label>
                          <input
                            type="text"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            placeholder="যেমন: মডারেটর, কোয়ালিটি অফিসার"
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-[#007460]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">ডিপার্টমেন্ট (Department)</label>
                          <input
                            type="text"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            placeholder="যেমন: কোয়ালিটি ও কনটেন্ট"
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-[#007460]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Contact Number</label>
                          <input
                            type="text"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-[#007460] font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                          <input
                            type="text"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            placeholder="YYYY-MM-DD"
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-[#007460]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                          <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-[#007460]"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">ইউনিক নেম (Unique Name)</label>
                          <input
                            type="text"
                            maxLength={20}
                            value={uniqueName}
                            onChange={(e) => setUniqueName(e.target.value)}
                            placeholder="Arifhossain388@"
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-[#007460] font-mono font-bold text-[#007460]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">টেলিফোন (Telephone)</label>
                          <input
                            type="text"
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-[#007460]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">এনআইডি নম্বর (NID)</label>
                          <input
                            type="text"
                            value={nid}
                            onChange={(e) => setNid(e.target.value)}
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-[#007460] font-mono"
                          />
                        </div>

                        {salary && (
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">বেতন (Salary)</label>
                            <input
                              type="text"
                              value={salary}
                              onChange={(e) => setSalary(e.target.value)}
                              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-[#007460]"
                            />
                          </div>
                        )}

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">বর্তমান ঠিকানা</label>
                          <input
                            type="text"
                            value={presentAddress}
                            onChange={(e) => setPresentAddress(e.target.value)}
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-[#007460]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">স্থায়ী ঠিকানা</label>
                          <input
                            type="text"
                            value={permanentAddress}
                            onChange={(e) => setPermanentAddress(e.target.value)}
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-[#007460]"
                          />
                        </div>

                        {/* Emergency Contact */}
                        <div className="sm:col-span-2 p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                          <span className="text-xs font-bold text-slate-800 block">জরুরী যোগাযোগকৃত ব্যক্তি:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={emergencyName}
                              onChange={(e) => setEmergencyName(e.target.value)}
                              placeholder="ব্যক্তির নাম"
                              className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs"
                            />
                            <input
                              type="text"
                              value={emergencyPhone}
                              onChange={(e) => setEmergencyPhone(e.target.value)}
                              placeholder="ফোন নম্বর"
                              className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                            />
                            <input
                              type="text"
                              value={emergencyRelation}
                              onChange={(e) => setEmergencyRelation(e.target.value)}
                              placeholder="সম্পর্ক (পিতা/মাতা/স্ত্রী)"
                              className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setIsEditingInfo(false)}
                          className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#007460] hover:bg-[#005e4e] text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* READ-ONLY VIEW (TWO-COLUMN CLEAN LAYOUT) */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs sm:text-sm">
                      <div>
                        <span className="text-slate-400 block text-xs font-normal">First Name</span>
                        <strong className="text-slate-900 block font-medium mt-0.5">{firstName}</strong>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-xs font-normal">Last Name</span>
                        <strong className="text-slate-900 block font-medium mt-0.5">{lastName}</strong>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-xs font-normal">আইডি ও পদবী</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <strong className="text-slate-900 font-mono font-bold">{activeAdmin?.id}</strong>
                          <span className="bg-emerald-100 text-[#007460] font-bold text-xs px-2 py-0.5 rounded">
                            {activeAdmin?.isOwner ? 'মালিক' : (activeAdmin?.designation || activeAdmin?.role || 'কর্মকর্তা')}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-xs font-normal">Contact Number</span>
                        <strong className="text-slate-900 block font-mono font-medium mt-0.5">{contactNumber}</strong>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-xs font-normal">Date of Birth</span>
                        <span className="text-slate-700 block font-medium mt-0.5">{dob || 'Enter your birthday'}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-xs font-normal">Gender</span>
                        <strong className="text-slate-900 block font-medium mt-0.5">{gender}</strong>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-xs font-normal">Unique Name</span>
                        <strong className="text-[#007460] block font-mono font-bold mt-0.5">{uniqueName}</strong>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-xs font-normal">টেলিফোন (Telephone)</span>
                        <span className="text-slate-800 block mt-0.5">{telephone || 'N/A'}</span>
                      </div>

                      {activeAdmin?.nid && (
                        <div>
                          <span className="text-slate-400 block text-xs font-normal">এনআইডি নম্বর (NID)</span>
                          <strong className="text-slate-900 block font-mono font-medium mt-0.5">{activeAdmin.nid}</strong>
                        </div>
                      )}

                      {activeAdmin?.salary && (
                        <div>
                          <span className="text-slate-400 block text-xs font-normal">নির্ধারিত বেতন (Salary)</span>
                          <strong className="text-slate-900 block font-medium mt-0.5">৳ {activeAdmin.salary}</strong>
                        </div>
                      )}

                      {activeAdmin?.presentAddress && (
                        <div className="sm:col-span-2">
                          <span className="text-slate-400 block text-xs font-normal">বর্তমান ঠিকানা</span>
                          <span className="text-slate-800 block mt-0.5">{activeAdmin.presentAddress}</span>
                        </div>
                      )}

                      {activeAdmin?.permanentAddress && (
                        <div className="sm:col-span-2">
                          <span className="text-slate-400 block text-xs font-normal">স্থায়ী ঠিকানা</span>
                          <span className="text-slate-800 block mt-0.5">{activeAdmin.permanentAddress}</span>
                        </div>
                      )}

                      {activeAdmin?.emergencyContact?.name && (
                        <div className="sm:col-span-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                          <span className="text-xs font-bold text-slate-700 block mb-1">জরুরী যোগাযোগ:</span>
                          <span className="text-slate-800 text-xs">
                            <strong>{activeAdmin.emergencyContact.name}</strong> ({activeAdmin.emergencyContact.relation}) — <span className="font-mono">{activeAdmin.emergencyContact.phone}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* CARD 2: ACCOUNT SECURITY (MATCHING Admin User Part.png) */}
                <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
                    Account Security
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
                    {/* Email Section */}
                    <div className="space-y-1">
                      <span className="text-slate-400 block text-xs">Email</span>
                      <strong className="text-slate-900 block font-mono font-medium">{activeAdmin?.email || emailInput}</strong>
                      
                      {isChangingEmail ? (
                        <form onSubmit={handleSaveEmail} className="pt-2 flex gap-2">
                          <input
                            type="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className="px-2.5 py-1.5 border border-slate-300 rounded text-xs outline-none focus:border-[#007460] flex-1"
                            required
                          />
                          <button type="submit" className="px-3 py-1 bg-[#007460] text-white rounded text-xs font-bold cursor-pointer">
                            Save
                          </button>
                          <button type="button" onClick={() => setIsChangingEmail(false)} className="px-2 text-xs text-slate-500 cursor-pointer">
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsChangingEmail(true)}
                          className="text-xs font-semibold text-[#007460] hover:underline cursor-pointer block pt-1"
                        >
                          Change email address
                        </button>
                      )}
                    </div>

                    {/* Password Section */}
                    <div className="space-y-1">
                      <span className="text-slate-400 block text-xs">Password</span>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 font-mono">
                          {showPassword ? (activeAdmin?.password || 'admin') : '••••••••'}
                        </strong>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {isChangingPass ? (
                        <form onSubmit={handleSavePassword} className="pt-2 flex gap-2">
                          <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            placeholder="New Password"
                            className="px-2.5 py-1.5 border border-slate-300 rounded text-xs outline-none focus:border-[#007460] flex-1"
                            required
                          />
                          <button type="submit" className="px-3 py-1 bg-[#007460] text-white rounded text-xs font-bold cursor-pointer">
                            Save
                          </button>
                          <button type="button" onClick={() => setIsChangingPass(false)} className="px-2 text-xs text-slate-500 cursor-pointer">
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsChangingPass(true)}
                          className="text-xs font-semibold text-[#007460] hover:underline cursor-pointer block pt-1"
                        >
                          Change password
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: ORDERS */}
            {activeSidebarTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-8 text-center text-slate-500 animate-in fade-in">
                <Package className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                <h4 className="font-bold text-slate-800 text-sm">কোনো ব্যক্তিগত অর্ডার নেই</h4>
                <p className="text-xs text-slate-400 mt-1">প্ল্যাটফর্মের সকল কুরিয়ার ও কাস্টমার অর্ডার দেখতে এডমিন ড্যাশবোর্ডের "০৩. কুরিয়ার ও ডেলিভারি ট্র্যাকিং" ভিজিট করুন।</p>
                <button onClick={onBackToDashboard} className="mt-4 px-4 py-2 bg-[#007460] text-white rounded-lg text-xs font-bold cursor-pointer">
                  এডমিন ড্যাশবোর্ডে যান
                </button>
              </div>
            )}

            {/* VIEW 4: TICKETS */}
            {activeSidebarTab === 'tickets' && (
              <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-8 text-center text-slate-500 animate-in fade-in">
                <MessageSquare className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                <h4 className="font-bold text-slate-800 text-sm">সাপোর্ট টিকিট ইনবক্স</h4>
                <p className="text-xs text-slate-400 mt-1">বর্তমানে কোনো মুলতুবি সাপোর্ট টিকিট নেই। সমস্ত গ্রাহক সহায়তা সেশন সক্রিয় রয়েছে।</p>
              </div>
            )}

            {/* VIEW 5: HELP */}
            {activeSidebarTab === 'help' && (
              <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4 animate-in fade-in">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#007460]" />
                  <span>এডমিন হেল্প ও নলেজ বেস</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  এডমিন অ্যাকাউন্টের মাধ্যমে আপনি বিজ্ঞাপন যাচাই, এসক্রো অনুমোদন, ডেলিভারি ট্র্যাকিং ও নতুন কর্মী নিয়োগ পরিচালনা করতে পারেন। যেকোনো তথ্য বা পাসওয়ার্ড ভুলে গেলে মালিকের অনুমোদন ও ওটিপির মাধ্যমে রিকভার করা সম্ভব।
                </p>
              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
};
