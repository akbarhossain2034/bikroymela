import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  User, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  Package, 
  Trash2, 
  CheckCircle2, 
  LogOut, 
  ShoppingBag,
  Coins,
  Award,
  Star,
  Copy,
  Sparkles,
  Lock,
  Edit3,
  Save,
  Check,
  Building2,
  Compass,
  ArrowRight,
  Eye,
  AlertCircle,
  Maximize2,
  Minimize2,
  Minus,
  Square,
  Monitor,
  Tv,
  Smartphone
} from 'lucide-react';

type PortalSize = 'compact' | 'standard' | 'large' | 'fullscreen';

export const ProfileModal: React.FC = () => {
  const { 
    lang, 
    currentUser, 
    setCurrentUser, 
    setActiveModal, 
    ads, 
    orders, 
    reviews,
    setAdToDelete,
    setSelectedOrder 
  } = useApp();

  // Portal Window Size State (বড় / ছোট / ফুলস্ক্রিন করার অপশন)
  const [portalSize, setPortalSize] = useState<PortalSize>('standard');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Active section corresponding to left-side headlines
  const [activeHeadline, setActiveHeadline] = useState<
    'address' | 'profile' | 'wallet' | 'ads' | 'orders' | 'reviews' | 'security'
  >('address'); // Default to 'address' as highlighted by the user
  
  // Profile edit fields
  const [name, setName] = useState(currentUser?.name || 'Md. Hossain');
  const [phone, setPhone] = useState(currentUser?.phone || '01332520826');
  const [email, setEmail] = useState(currentUser?.email || 'akbar.office10@gmail.com');
  
  // Address edit fields (বর্তমান ঠিকানা ও স্থায়ী ঠিকানা)
  const [presentAddress, setPresentAddress] = useState(
    currentUser?.address || 'বাসা-২৪, রোড-৭, ব্লক-ডি, মিরপুর-১০, ঢাকা-১২১৬'
  );
  const [permanentAddress, setPermanentAddress] = useState(
    currentUser?.permanentAddress || 'গ্রাম: রামকৃষ্ণপুর, ডাকঘর: হরিপুর, থানা: বোয়ালমারী, জেলা: ফরিদপুর-৭৮২০'
  );
  const [presentDistrict, setPresentDistrict] = useState('ঢাকা (Dhaka)');
  const [presentThana, setPresentThana] = useState('মিরপুর-১০');
  const [permanentDistrict, setPermanentDistrict] = useState('ফরিদপুর (Faridpur)');
  const [permanentThana, setPermanentThana] = useState('বোয়ালমারী');
  const [altPhone, setAltPhone] = useState('০১৭৫৫-৯৯৮৮৭৭');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Security password fields
  const [currentPass, setCurrentPass] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [copiedId, setCopiedId] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  if (!currentUser) return null;

  // Derive unique customer ID
  const customerId = currentUser.id.includes('user-') 
    ? `#BM-${currentUser.id.replace('user-', '').slice(-4) || '9824'}` 
    : '#BM-9824';

  const myAds = ads.filter(a => a.sellerId === currentUser.id || a.sellerName === currentUser.name || a.sellerPhone === currentUser.phone);
  const myReviews = reviews.filter(r => r.targetUserId === currentUser.id || r.targetUserId === 'user-001');

  const handleCopyId = () => {
    navigator.clipboard?.writeText(customerId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser(prev => prev ? {
      ...prev,
      address: presentAddress,
      permanentAddress: permanentAddress
    } : null);
    setIsEditingAddress(false);
    setSaveSuccessMsg('🎉 আপনার বর্তমান ও স্থায়ী ঠিকানা সফলভাবে হালনাগাদ করা হয়েছে!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser(prev => prev ? {
      ...prev,
      name,
      phone,
      email
    } : null);
    setIsEditingProfile(false);
    setSaveSuccessMsg('✅ আপনার ব্যক্তিগত প্রোফাইল তথ্য সফলভাবে সেভ হয়েছে!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      alert('নতুন পাসওয়ার্ড উভয় ঘরে সঠিকভাবে লিখুন');
      return;
    }
    setCurrentPass('');
    setNewPassword('');
    setConfirmPassword('');
    setSaveSuccessMsg('🔒 আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleLogout = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে আপনার একাউন্ট থেকে লগআউট করতে চান?')) {
      setCurrentUser(null);
      setActiveModal(null);
    }
  };

  // Left-side headline menu items
  const headlineItems = [
    {
      id: 'address',
      label: 'ম্যানেজ অ্যাড্রেস',
      sublabel: 'বর্তমান ও স্থায়ী ঠিকানা',
      icon: MapPin,
      badge: '২টি ঠিকানা',
      highlight: true
    },
    {
      id: 'profile',
      label: 'প্রোফাইল তথ্য ও আইডি',
      sublabel: 'পরিচয় ও এনআইডি তথ্য',
      icon: User,
      badge: null
    },
    {
      id: 'wallet',
      label: 'ওয়ালেট ও বোনাস ব্যালেন্স',
      sublabel: '৳৫০ ওয়েলকাম বোনাস',
      icon: Coins,
      badge: `৳${(currentUser.walletBalance ?? 50)}`
    },
    {
      id: 'ads',
      label: 'আমার বিজ্ঞাপনসমূহ',
      sublabel: 'পোস্ট করা বিজ্ঞাপন তালিকা',
      icon: ShoppingBag,
      badge: `${myAds.length} টি`
    },
    {
      id: 'orders',
      label: 'আমার অর্ডার ও কেনাকাটা',
      sublabel: 'এসক্রো ও ডেলিভারি হিস্ট্রি',
      icon: Package,
      badge: `${orders.length} টি`
    },
    {
      id: 'reviews',
      label: 'রিভিউ ও রেটিং স্টার',
      sublabel: '৫.০★ ক্রেতা-বিক্রেতা ফিডব্যাক',
      icon: Star,
      badge: `${myReviews.length} টি`
    },
    {
      id: 'security',
      label: 'পাসওয়ার্ড ও নিরাপত্তা',
      sublabel: 'পাসওয়ার্ড পরিবর্তন ও সুরক্ষা',
      icon: Lock,
      badge: null
    }
  ] as const;

  // Dimensions based on user selected portal size (বড় বা ছোট করার কন্ট্রোল)
  const sizeClasses: Record<PortalSize, string> = {
    compact: 'max-w-3xl w-full max-h-[80vh] my-auto rounded-xl',
    standard: 'max-w-5xl w-full max-h-[90vh] my-auto rounded-2xl',
    large: 'max-w-7xl w-full max-h-[95vh] my-auto rounded-2xl',
    fullscreen: 'w-screen h-screen max-w-none max-h-none rounded-none m-0'
  };

  // If minimized: render Windows-style floating bottom taskbar widget
  if (isMinimized) {
    return (
      <aside 
        aria-label="অ্যাকাউন্ট পোর্টাল মিনিমাইজড বার"
        className="fixed bottom-4 right-4 sm:right-6 z-50 bg-slate-900/95 text-white backdrop-blur-md border border-emerald-500/50 shadow-2xl rounded-2xl px-3.5 py-2.5 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200"
      >
        <button 
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2.5 cursor-pointer text-left focus:outline-none hover:opacity-90"
          title="রিস্টোর করুন (Restore)"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow ring-2 ring-emerald-400 shrink-0">
            {currentUser.name ? currentUser.name.charAt(0) : 'U'}
          </div>
          <div>
            <div className="text-xs font-bold leading-tight flex items-center gap-1.5 text-white">
              <span>অ্যাকাউন্ট পোর্টাল</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="text-[10px] text-emerald-300 font-mono">
              আইডি: {customerId} · ৳{(currentUser.walletBalance ?? 50).toLocaleString()}
            </div>
          </div>
        </button>

        {/* Windows Titlebar Controls for Taskbar widget */}
        <div className="flex items-center gap-1 pl-2 border-l border-slate-700">
          <button
            onClick={() => setIsMinimized(false)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="উইন্ডো রিস্টোর / ম্যাক্সিমাইজ করুন"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { setActiveModal(null); setIsMinimized(false); }}
            className="p-1.5 rounded hover:bg-red-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs overflow-y-auto transition-all ${
      portalSize === 'fullscreen' ? 'p-0' : 'p-2 sm:p-4'
    }`}>
      <div className={`bg-white shadow-2xl text-slate-800 overflow-hidden flex flex-col border border-slate-200 transition-all duration-200 ${sizeClasses[portalSize]}`}>
        
        {/* Top Header Bar styled like Windows OS window titlebar */}
        <div className="px-4 py-2.5 sm:px-6 sm:py-3 bg-[#007460] text-white flex items-center justify-between shrink-0 shadow-sm gap-2">
          <div className="flex items-center gap-3 min-w-0">
            {/* Customer ID & Circular Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 font-black text-base flex items-center justify-center shadow ring-2 ring-emerald-300 shrink-0">
              {currentUser.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm sm:text-base leading-tight">
                  ক্রেতা ও বিক্রেতা অ্যাকাউন্ট পোর্টাল
                </span>
                {currentUser.isNidVerified && (
                  <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-800/90 text-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-semibold border border-emerald-400/40">
                    <ShieldCheck className="w-3 h-3 text-emerald-300" />
                    <span>NID ভেরিফায়েড</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-100 mt-0.5">
                <span className="bg-emerald-950/50 px-2 py-0.5 rounded font-mono font-bold tracking-wider text-amber-300 flex items-center gap-1">
                  <span>কাস্টমার আইডি: {customerId}</span>
                  <button 
                    onClick={handleCopyId}
                    title="কপি করুন" 
                    className="hover:text-white cursor-pointer ml-1"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </span>
                {copiedId && <span className="text-[10px] text-emerald-200 animate-pulse">কপি হয়েছে!</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Wallet Chip in Top Bar */}
            <div className="hidden lg:flex items-center gap-2 bg-emerald-900/70 border border-emerald-500/40 px-3 py-1 rounded-full text-xs">
              <Coins className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-amber-200 font-bold font-mono">৳{(currentUser.walletBalance ?? 50).toLocaleString()}</span>
              <span className="text-emerald-300 text-[10px]">বোনাস</span>
            </div>

            {/* Window Resizing Preset Controls (PURELY ICONS, NO TEXT! "লেখা না আইকন।") */}
            <div className="flex items-center bg-emerald-950/60 p-0.5 rounded-lg border border-emerald-500/40">
              
              {/* Compact / Small Window icon */}
              <button
                onClick={() => setPortalSize('compact')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  portalSize === 'compact' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-emerald-100 hover:bg-emerald-800'
                }`}
                title="ছোট স্ক্রিন (Compact Window)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>

              {/* Standard / Medium Window icon */}
              <button
                onClick={() => setPortalSize('standard')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  portalSize === 'standard' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-emerald-100 hover:bg-emerald-800'
                }`}
                title="মাঝারি স্ক্রিন (Standard Window)"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>

              {/* Wide / Large Window icon */}
              <button
                onClick={() => setPortalSize('large')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  portalSize === 'large' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-emerald-100 hover:bg-emerald-800'
                }`}
                title="বড় স্ক্রিন (Wide Window)"
              >
                <Tv className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Windows OS Titlebar Control Cluster: Minimize (—), Maximize/Restore (▢/❐), Close (✕) */}
            <div className="flex items-center bg-emerald-950/60 rounded-lg border border-emerald-500/40 overflow-hidden divide-x divide-emerald-800/60">
              
              {/* 1. Minimize ( — ) */}
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 sm:px-2.5 hover:bg-emerald-800 text-emerald-100 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                title="মিনিমাইজ করুন (Minimize)"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              {/* 2. Maximize / Restore ( ▢ / ❐ ) */}
              <button
                onClick={() => setPortalSize(portalSize === 'fullscreen' ? 'standard' : 'fullscreen')}
                className="p-1.5 sm:px-2.5 hover:bg-emerald-800 text-emerald-100 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                title={portalSize === 'fullscreen' ? "স্বাভাবিক আকারে রিস্টোর করুন (Restore)" : "ফুলস্ক্রিন / ম্যাক্সিমাইজ করুন (Maximize)"}
              >
                {portalSize === 'fullscreen' ? (
                  <Copy className="w-3.5 h-3.5" />
                ) : (
                  <Square className="w-3.5 h-3.5" />
                )}
              </button>

              {/* 3. Close ( ✕ ) with Windows red hover */}
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 sm:px-2.5 hover:bg-red-600 text-emerald-100 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                title="বন্ধ করুন (Close)"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* Global Success Notification Banner */}
        {saveSuccessMsg && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 text-xs text-emerald-900 font-semibold flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
            <button onClick={() => setSaveSuccessMsg('')} className="text-emerald-700 hover:text-emerald-900">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Master-Detail Body: Left Headlines, Right Details */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-100/60">
          
          {/* ======================================================== */}
          {/* বাম পাশে: মুল হেডলাইনসমূহ (LEFT COLUMN - HEADLINES MENU) */}
          {/* ======================================================== */}
          <div className="w-full md:w-72 lg:w-80 shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between overflow-y-auto">
            
            {/* Headlines Navigation List */}
            <div className="p-3 sm:p-3.5 space-y-1">
              <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
                <span>মূল মেনু ও হেডলাইন</span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                  অ্যাকাউন্ট সেন্টার
                </span>
              </div>

              {headlineItems.map(item => {
                const IconComponent = item.icon;
                const isSelected = activeHeadline === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveHeadline(item.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/90 text-[#007460] font-bold border-l-4 border-[#007460] shadow-xs'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isSelected 
                          ? 'bg-[#007460] text-white shadow-xs' 
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:text-slate-900'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-semibold truncate leading-tight">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-slate-600 truncate mt-0.5">
                          {item.sublabel}
                        </div>
                      </div>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold shrink-0 ml-1 ${
                        isSelected 
                          ? 'bg-emerald-200/80 text-emerald-950 font-bold' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions: User Info Quick Card & Logout */}
            <div className="p-3 border-t border-slate-200 bg-slate-50/80 space-y-2 shrink-0">
              <div className="flex items-center justify-between text-xs px-2 py-1 bg-white rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">
                  সদস্য: <span className="font-semibold text-slate-700">{currentUser.memberSince || '২০২৩'} সাল</span>
                </div>
                <div className="text-[11px] font-mono text-emerald-700 font-bold">
                  {currentUser.phone}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-2 px-3 text-xs font-semibold text-rose-600 hover:text-white hover:bg-rose-600 rounded-lg border border-rose-200 hover:border-rose-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>অ্যাকাউন্ট থেকে লগআউট</span>
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ডান পাশে: হেডলাইনের সোজা বিস্তারিত বিবরণ (RIGHT COLUMN) */}
          {/* ======================================================== */}
          <div className="flex-1 bg-white overflow-y-auto p-4 sm:p-6 lg:p-7">
            
            {/* ------------------------------------------------------------------ */}
            {/* 1. ম্যানেজ অ্যাড্রেস (সোজা ডান পাশে বর্তমান ও স্থায়ী ও এডিট অপশন) */}
            {/* ------------------------------------------------------------------ */}
            {activeHeadline === 'address' && (
              <div className="space-y-6">
                
                {/* Header & Description */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#007460]"></span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        ম্যানেজ অ্যাড্রেস (ঠিকানা ব্যবস্থাপনা)
                      </h3>
                      <span className="bg-emerald-100 text-[#007460] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        ভেরিফায়েড
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      পণ্য কেনাবেচা, সরাসরি সাক্ষাৎ, হোম ডেলিভারি ও কুরিয়ার পার্সেল পাওয়ার জন্য আপনার বর্তমান ও স্থায়ী ঠিকানা হালনাগাদ রাখুন।
                    </p>
                  </div>

                  <button
                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                    className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#007460] hover:bg-[#005f4e] rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditingAddress ? 'এডিট বন্ধ করুন' : 'ঠিকানা পরিবর্তন ও এডিট'}</span>
                  </button>
                </div>

                {/* দুটি প্রধান কার্ড: ১. বর্তমান ঠিকানা, ২. স্থায়ী ঠিকানা */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* কার্ড ১: বর্তমান ঠিকানা (Present / Delivery Address) */}
                  <div className="bg-gradient-to-br from-emerald-50/60 to-white border-2 border-emerald-500/40 rounded-xl p-4 sm:p-5 relative shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">১. বর্তমান ঠিকানা</h4>
                          <span className="text-[10px] text-emerald-700 font-semibold">
                            (Present / Delivery Address)
                          </span>
                        </div>
                      </div>
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        ডিফল্ট ডেলিভারি
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 bg-white rounded-lg border border-emerald-200/70 font-medium text-slate-800 leading-relaxed min-h-[56px]">
                        {presentAddress}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="p-2 bg-emerald-50/70 rounded-md">
                          <span className="text-slate-500 block">জেলা / শহর:</span>
                          <span className="font-bold text-slate-800">{presentDistrict}</span>
                        </div>
                        <div className="p-2 bg-emerald-50/70 rounded-md">
                          <span className="text-slate-500 block">থানা / এলাকা:</span>
                          <span className="font-bold text-slate-800">{presentThana}</span>
                        </div>
                      </div>

                      <div className="p-2 bg-emerald-50/70 rounded-md text-[11px] flex items-center justify-between">
                        <span className="text-slate-500">যোগাযোগের মোবাইল:</span>
                        <span className="font-mono font-bold text-slate-800">{phone}</span>
                      </div>

                      <div className="text-[10px] text-emerald-800 pt-1 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>অনলাইন অর্ডার ও সরাসরি কেনাবেচায় ডেলিভারি ঠিকানা হিসেবে প্রযোজ্য</span>
                      </div>
                    </div>
                  </div>

                  {/* কার্ড ২: স্থায়ী ঠিকানা (Permanent Address) */}
                  <div className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-300 rounded-xl p-4 sm:p-5 relative shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-700 text-white flex items-center justify-center shadow-xs">
                          <Compass className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">২. স্থায়ী ঠিকানা</h4>
                          <span className="text-[10px] text-slate-500 font-semibold">
                            (Permanent / NID Address)
                          </span>
                        </div>
                      </div>
                      <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        এনআইডি ভেরিফাইড
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-medium text-slate-800 leading-relaxed min-h-[56px]">
                        {permanentAddress}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="p-2 bg-slate-100 rounded-md">
                          <span className="text-slate-500 block">মূল জেলা:</span>
                          <span className="font-bold text-slate-800">{permanentDistrict}</span>
                        </div>
                        <div className="p-2 bg-slate-100 rounded-md">
                          <span className="text-slate-500 block">উপজেলা / থানা:</span>
                          <span className="font-bold text-slate-800">{permanentThana}</span>
                        </div>
                      </div>

                      <div className="p-2 bg-slate-100 rounded-md text-[11px] flex items-center justify-between">
                        <span className="text-slate-500">বিকল্প ইমার্জেন্সি ফোন:</span>
                        <span className="font-mono font-bold text-slate-800">{altPhone}</span>
                      </div>

                      <div className="text-[10px] text-slate-600 pt-1 flex items-center gap-1.5 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>জাতীয় পরিচয়পত্রের তথ্য অনুযায়ী স্থায়ী আবাসন ও নিরাপত্তা যাচাইকৃত</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* ৩. প্রয়োজনীয় এডিট অপশন (Address Edit Form) */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-[#007460]" />
                      <h4 className="font-bold text-sm text-slate-900">
                        ৩. প্রয়োজনীয় এডিট ও ঠিকানা পরিবর্তন অপশন
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      তথ্য পরিবর্তন শেষে "ঠিকানা সেভ করুন" চাপুন
                    </span>
                  </div>

                  <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
                    {/* বর্তমান ঠিকানা এডিট */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        বর্তমান ঠিকানা (বাসা/রোড/ব্লক/এলাকা):
                      </label>
                      <textarea
                        rows={2}
                        value={presentAddress}
                        onChange={(e) => setPresentAddress(e.target.value)}
                        placeholder="উদাঃ বাসা-২৪, রোড-৭, ব্লক-ডি, মিরপুর-১০, ঢাকা-১২১৬"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#007460] focus:border-transparent outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          বর্তমান জেলা / শহর:
                        </label>
                        <select
                          value={presentDistrict}
                          onChange={(e) => setPresentDistrict(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#007460] outline-none"
                        >
                          <option value="ঢাকা (Dhaka)">ঢাকা (Dhaka)</option>
                          <option value="চট্টগ্রাম (Chittagong)">চট্টগ্রাম (Chittagong)</option>
                          <option value="সিলেট (Sylhet)">সিলেট (Sylhet)</option>
                          <option value="রাজশাহী (Rajshahi)">রাজশাহী (Rajshahi)</option>
                          <option value="খুলনা (Khulna)">খুলনা (Khulna)</option>
                          <option value="বরিশাল (Barishal)">বরিশাল (Barishal)</option>
                          <option value="রংপুর (Rangpur)">রংপুর (Rangpur)</option>
                          <option value="ময়মনসিংহ (Mymensingh)">ময়মনসিংহ (Mymensingh)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          বর্তমান থানা / এলাকা:
                        </label>
                        <input
                          type="text"
                          value={presentThana}
                          onChange={(e) => setPresentThana(e.target.value)}
                          placeholder="উদাঃ মিরপুর-১০ / উত্তরা / গুলশান"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#007460] outline-none"
                        />
                      </div>
                    </div>

                    {/* স্থায়ী ঠিকানা এডিট */}
                    <div className="pt-2 border-t border-slate-200">
                      <label className="block font-bold text-slate-700 mb-1">
                        স্থায়ী ঠিকানা (গ্রাম/মহল্লা/ডাকঘর/উপজেলা):
                      </label>
                      <textarea
                        rows={2}
                        value={permanentAddress}
                        onChange={(e) => setPermanentAddress(e.target.value)}
                        placeholder="উদাঃ গ্রাম: রামকৃষ্ণপুর, ডাকঘর: হরিপুর, থানা: বোয়ালমারী, জেলা: ফরিদপুর"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#007460] focus:border-transparent outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          স্থায়ী জেলা:
                        </label>
                        <input
                          type="text"
                          value={permanentDistrict}
                          onChange={(e) => setPermanentDistrict(e.target.value)}
                          placeholder="উদাঃ ফরিদপুর / কুমিল্লা / বগুড়া"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#007460] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          বিকল্প ইমার্জেন্সি মোবাইল নম্বর:
                        </label>
                        <input
                          type="text"
                          value={altPhone}
                          onChange={(e) => setAltPhone(e.target.value)}
                          placeholder="উদাঃ ০১৭৫৫-৯৯৮৮৭৭"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#007460] outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>বর্তমান ও স্থায়ী ঠিকানা এসক্রো সুরক্ষায় এনক্রিপ্ট করা থাকে</span>
                      </div>

                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-[#007460] hover:bg-[#005f4e] text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer active:scale-95"
                      >
                        <Save className="w-4 h-4" />
                        <span>ঠিকানা সেভ করুন</span>
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            )}

            {/* ------------------------------------------------------------------ */}
            {/* 2. প্রোফাইল তথ্য ও আইডি (USER INFO & IDENTITY) */}
            {/* ------------------------------------------------------------------ */}
            {activeHeadline === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      প্রোফাইল তথ্য ও কাস্টমার আইডি
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      আপনার ব্যক্তিগত অ্যাকাউন্ট পরিচিতি, এনআইডি ও মেম্বারশিপ বিবরণী
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-[#007460] bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditingProfile ? 'বাতিল' : 'প্রোফাইল এডিট'}</span>
                  </button>
                </div>

                {/* Customer ID Highlight Card */}
                <div className="p-4 bg-gradient-to-r from-emerald-900 to-[#007460] rounded-xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                  <div>
                    <span className="text-[11px] text-emerald-200 uppercase font-semibold tracking-wider">
                      আপনার অফিশিয়াল ইউনিক বিক্রয়মেলা আইডি
                    </span>
                    <div className="text-xl sm:text-2xl font-mono font-black text-amber-300 tracking-wider flex items-center gap-2 mt-0.5">
                      <span>{customerId}</span>
                      <button
                        onClick={handleCopyId}
                        className="p-1 hover:bg-white/10 rounded cursor-pointer transition-colors"
                        title="কপি করুন"
                      >
                        <Copy className="w-4 h-4 text-emerald-200 hover:text-white" />
                      </button>
                    </div>
                    <span className="text-xs text-emerald-100 mt-1 block">
                      সদস্য: {currentUser.memberSince || '২০২৩'} সাল থেকে ভেরিফাইড ইউজার
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-emerald-950/50 p-2.5 rounded-lg border border-emerald-400/30">
                    <ShieldCheck className="w-6 h-6 text-emerald-300 shrink-0" />
                    <div className="text-xs">
                      <div className="font-bold text-white">এনআইডি যাচাইকৃত</div>
                      <div className="text-[10px] text-emerald-200 font-mono">
                        {currentUser.nidNumber || '19952671829000123'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Information Form / Cards */}
                {isEditingProfile ? (
                  <form onSubmit={handleSaveProfile} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3.5 text-xs">
                    <h4 className="font-bold text-slate-900">ব্যক্তিগত তথ্য হালনাগাদ করুন</h4>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">পূর্ণ নাম:</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#007460]"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">মোবাইল নম্বর:</label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#007460] font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">ইমেইল ঠিকানা:</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#007460]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100"
                      >
                        বাতিল
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#007460] text-white font-bold rounded-lg hover:bg-[#005f4e]"
                      >
                        সংরক্ষণ করুন
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">ইউজার নাম</span>
                      <span className="font-bold text-slate-900 text-sm mt-0.5 block">{currentUser.name}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">মোবাইল নম্বর (ভেরিফাইড)</span>
                      <span className="font-bold text-slate-900 text-sm mt-0.5 block font-mono">{currentUser.phone}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">ইমেইল অ্যাকাউন্ট</span>
                      <span className="font-bold text-slate-900 text-sm mt-0.5 block">{currentUser.email || 'akbar.office10@gmail.com'}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">অ্যাকাউন্টের ধরন ও রোল</span>
                      <span className="font-bold text-emerald-800 text-sm mt-0.5 block">ক্রেতা ও বিক্রেতা (সক্রিয়)</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------------ */}
            {/* 3. ওয়ালেট ও রিওয়ার্ড পয়েন্ট (WALLET & POINTS) */}
            {/* ------------------------------------------------------------------ */}
            {activeHeadline === 'wallet' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-200">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    ওয়ালেট ব্যালেন্স ও রিওয়ার্ড পয়েন্ট
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    অ্যাকাউন্ট খোলার ৫০ টাকা বোনাস এবং কেনাবেচা করে অর্জিত পয়েন্টের হিসাব
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* ৫০ টাকা বোনাস কার্ড */}
                  <div className="p-5 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl text-white shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <Coins className="w-6 h-6 text-amber-300" />
                      </div>
                      <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                        রেজিস্ট্রেশন বোনাস
                      </span>
                    </div>
                    <div className="mt-4">
                      <span className="text-xs text-emerald-100 block">বর্তমান ওয়ালেট ব্যালেন্স</span>
                      <div className="text-3xl font-black font-mono text-white mt-1">
                        ৳ {(currentUser.walletBalance ?? 50).toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-emerald-400/40 text-[11px] text-emerald-100 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span>এই ৫০ টাকা দিয়ে সাইটে কেনাকাটা বা সার্ভিস ফি দিতে পারবেন</span>
                    </div>
                  </div>

                  {/* রিওয়ার্ড পয়েন্ট কার্ড */}
                  <div className="p-5 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl text-white shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <span className="bg-white text-amber-900 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                        লয়্যালটি পয়েন্ট
                      </span>
                    </div>
                    <div className="mt-4">
                      <span className="text-xs text-amber-100 block">মোট অর্জিত পয়েন্ট</span>
                      <div className="text-3xl font-black font-mono text-white mt-1">
                        {(currentUser.rewardPoints ?? 120)} <span className="text-lg font-normal">পয়েন্ট</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-amber-400/40 text-[11px] text-amber-100 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                      <span>পণ্য কেনাবেচা ও রেটিং দিলে আইডিতে স্বয়ংক্রিয়ভাবে পয়েন্ট যোগ হয়</span>
                    </div>
                  </div>
                </div>

                {/* ট্রানজেকশন তালিকা */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                  <h4 className="font-bold text-xs text-slate-800 mb-3">সাম্প্রতিক পয়েন্ট ও বোনাস বিবরণী:</h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="font-semibold text-slate-800">নতুন অ্যাকাউন্ট খোলার স্বাগতম উপহার</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-700">+৳ ৫০.০০</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span className="font-semibold text-slate-800">এনআইডি ও ফোন নম্বর যাচাইকরণ রিওয়ার্ড</span>
                      </div>
                      <span className="font-mono font-bold text-amber-700">+২০ পয়েন্ট</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span className="font-semibold text-slate-800">মার্কেটপ্লেসে সফল লেনদেন বোনাস</span>
                      </div>
                      <span className="font-mono font-bold text-amber-700">+১০০ পয়েন্ট</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------ */}
            {/* 4. আমার বিজ্ঞাপনসমূহ (MY ADS) */}
            {/* ------------------------------------------------------------------ */}
            {activeHeadline === 'ads' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      আমার বিজ্ঞাপনসমূহ ({myAds.length})
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      আপনার পোস্ট করা বিজ্ঞাপনের তালিকা, ভিউ সংখ্যা ও নিয়ন্ত্রণ
                    </p>
                  </div>
                  <button
                    onClick={() => { setActiveModal(null); setTimeout(() => setActiveModal('postAd'), 100); }}
                    className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-[#ffc800] hover:bg-[#e6b400] rounded-lg shadow-xs cursor-pointer"
                  >
                    + নতুন বিজ্ঞাপন দিন
                  </button>
                </div>

                {myAds.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
                    <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-600 font-semibold">আপনার কোনো সক্রিয় বিজ্ঞাপন নেই।</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myAds.map(ad => (
                      <div key={ad.id} className="p-3 sm:p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-3">
                          <img 
                            src={ad.images[0]} 
                            alt={ad.titleBn} 
                            className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                              {ad.titleBn}
                            </h4>
                            <div className="font-bold font-mono text-[#007460] text-sm mt-0.5">
                              ৳ {ad.price.toLocaleString()}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                              <span>ভিউ: {ad.views} বার</span>
                              <span>·</span>
                              <span className="text-emerald-700 font-semibold">স্ট্যাটাস: সক্রিয়</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => setAdToDelete(ad)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                            title="বিজ্ঞাপন মুছুন (কারণ ও ফি সংক্রান্ত নিয়মাবলী)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>মুছুন</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------------ */}
            {/* 5. আমার অর্ডার ও কেনাকাটা (MY ORDERS) */}
            {/* ------------------------------------------------------------------ */}
            {activeHeadline === 'orders' && (
              <div className="space-y-4">
                <div className="pb-4 border-b border-slate-200">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    আমার অর্ডার ও কেনাকাটা ({orders.length})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    এসক্রো সুরক্ষিত ক্রয়-বিক্রয় ও কুরিয়ার ডেলিভারি ট্র্যাকিং
                  </p>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
                    <Package className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-600 font-semibold">কোনো অর্ডার এখনো করা হয়নি।</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map(order => (
                      <div key={order.id} className="p-3 sm:p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-3">
                          <img src={order.adImage} alt={order.adTitle} className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-200" />
                          <div>
                            <div className="text-[11px] font-mono font-bold text-emerald-800">
                              অর্ডার #{order.id}
                            </div>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                              {order.adTitle}
                            </h4>
                            <div className="text-xs font-mono font-bold text-slate-800 mt-0.5">
                              ৳ {order.totalAmount.toLocaleString()} ({order.paymentMethod})
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold bg-emerald-100 text-emerald-800">
                            এসক্রো সুরক্ষিত
                          </span>
                          <button
                            onClick={() => { setSelectedOrder(order); setActiveModal('orderTracking'); }}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-[#007460] hover:bg-[#005f4e] rounded-lg cursor-pointer"
                          >
                            ট্র্যাক করুন
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------------ */}
            {/* 6. রিভিউ ও রেটিং স্টার (REVIEWS & RATINGS) */}
            {/* ------------------------------------------------------------------ */}
            {activeHeadline === 'reviews' && (
              <div className="space-y-4">
                <div className="pb-4 border-b border-slate-200">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    রিভিউ ও রেটিং স্টার ({myReviews.length})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ক্রেতা ও বিক্রেতাদের পরস্পরের দেওয়া রেটিং ও রিভিউ
                  </p>
                </div>

                {/* Rating Overview Card */}
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-black text-amber-900">৫.০</div>
                    <div>
                      <div className="flex items-center text-amber-500">
                        {'★'.repeat(5)}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        ১০০% ইতিবাচক কাস্টমার সন্তুষ্টি স্কোর
                      </div>
                    </div>
                  </div>
                  <span className="bg-amber-200 text-amber-900 font-bold text-xs px-3 py-1 rounded-full">
                    টপ রেটেড মেম্বার
                  </span>
                </div>

                <div className="space-y-3">
                  {myReviews.map(rev => (
                    <div key={rev.id} className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-900">{rev.reviewerName}</span>
                        <div className="text-amber-500 font-bold">
                          {'★'.repeat(rev.rating)}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        "{rev.comment}"
                      </p>
                      <span className="text-[10px] text-slate-600 mt-1 block">
                        পণ্য: {rev.adTitle}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------ */}
            {/* 7. পাসওয়ার্ড ও নিরাপত্তা (SECURITY & PASSWORD) */}
            {/* ------------------------------------------------------------------ */}
            {activeHeadline === 'security' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-200">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    পাসওয়ার্ড ও অ্যাকাউন্ট নিরাপত্তা
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    পাসওয়ার্ড পরিবর্তন ও দ্বি-স্তর বিশিষ্ট সুরক্ষা সেটিংস
                  </p>
                </div>

                <form onSubmit={handlePasswordChange} className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3.5 text-xs max-w-md">
                  <h4 className="font-bold text-slate-900">পাসওয়ার্ড পরিবর্তন করুন</h4>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">বর্তমান পাসওয়ার্ড:</label>
                    <input
                      type="password"
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                      placeholder="বর্তমান পাসওয়ার্ড দিন"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#007460]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">নতুন পাসওয়ার্ড:</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="কমপক্ষে ৬ ডিজিটের নতুন পাসওয়ার্ড"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#007460]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">নতুন পাসওয়ার্ড নিশ্চিত করুন:</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="পুনরায় নতুন পাসওয়ার্ড লিখুন"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#007460]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#007460] hover:bg-[#005f4e] text-white font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    পাসওয়ার্ড আপডেট করুন
                  </button>
                </form>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2 font-medium">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span>আপনার অ্যাকাউন্টটি টু-ফ্যাক্টর এসএমএস ওটিপি দ্বারা সুরক্ষিত রয়েছে।</span>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
