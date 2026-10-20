import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
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
  Wallet,
  Send,
  Clock,
  Heart,
  Headphones,
  Crown,
  CreditCard,
  Share2,
  ChevronRight,
  ArrowLeft,
  X,
  Mail,
  Calendar,
  CheckCircle,
  Layers,
  PlusCircle,
  CheckSquare,
  XCircle,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Tag,
  Filter,
  EyeOff
} from 'lucide-react';

export const ProfileModal: React.FC = () => {
  const { 
    lang, 
    currentUser, 
    setCurrentUser, 
    customerLogout,
    setIsAdminMode,
    setActiveModal, 
    ads, 
    orders, 
    reviews,
    setAdToDelete,
    setSelectedOrder,
    offerSettings,
    withdrawalRequests,
    requestWithdrawal,
    setChatRecipient,
    siteName,
    activeProfileTab,
    setActiveProfileTab,
    setSelectedAd,
    updateAdValidationStatus,
    updateAdStatus
  } = useApp();

  // Active section corresponding to left-side navigation matching કાષ્ટমার আইডি1.png
  const [activeTab, setActiveTab] = useState<
    'manage_account' | 'my_ads' | 'orders' | 'wishlist' | 'support' | 'club' | 'point' | 'credit' | 'share_earn' | 'addresses'
  >('manage_account');

  // Sync activeTab with activeProfileTab from context (e.g. from Header 'মাই বিজ্ঞাপন' button)
  useEffect(() => {
    if (activeProfileTab === 'my_ads') {
      setActiveTab('my_ads');
    }
  }, [activeProfileTab]);

  // My Ads Filtering State (চলমান, ওয়েটিং ও ক্যানসেল)
  const [myAdsFilter, setMyAdsFilter] = useState<'all' | 'active' | 'pending' | 'rejected'>('all');

  // Customer's own Ads (মাই বিজ্ঞাপন)
  const myAds = ads.filter(a => a.sellerId === currentUser?.id || a.sellerPhone === currentUser?.phone);
  const activeMyAds = myAds.filter(a => a.status === 'active' || a.validationStatus === 'Approved');
  const pendingMyAds = myAds.filter(a => (a.status === 'pending' || a.validationStatus === 'Received' || a.validationStatus === 'Verified' || a.validationStatus === 'Processed') && a.status !== 'rejected' && a.validationStatus !== 'Rejected');
  const rejectedMyAds = myAds.filter(a => a.status === 'rejected' || a.validationStatus === 'Rejected');

  const displayedMyAds = myAds.filter(ad => {
    if (myAdsFilter === 'active') return ad.status === 'active' || ad.validationStatus === 'Approved';
    if (myAdsFilter === 'pending') return (ad.status === 'pending' || ad.validationStatus === 'Received' || ad.validationStatus === 'Verified' || ad.validationStatus === 'Processed') && ad.status !== 'rejected' && ad.validationStatus !== 'Rejected';
    if (myAdsFilter === 'rejected') return ad.status === 'rejected' || ad.validationStatus === 'Rejected';
    return true;
  });

  // Edit User Information modal/state for mobile & desktop (Requirement B-03)
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [firstName, setFirstName] = useState(currentUser?.firstName || 'Md. Akbar');
  const [lastName, setLastName] = useState(currentUser?.lastName || 'Hossain');
  const [contactNumber, setContactNumber] = useState(currentUser?.phone || '01332520826');
  const [emailAddress, setEmailAddress] = useState(currentUser?.email || 'akbar.office10@gmail.com');
  const [dob, setDob] = useState(currentUser?.dob || '1995-05-12');
  const [gender, setGender] = useState(currentUser?.gender || 'পুরুষ (Male)');
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser?.address || 'মিরপুর-১০, ঢাকা-১২১৬');
  const [permanentAddress, setPermanentAddress] = useState(
    currentUser?.permanentAddress || 'গ্রাম: রামকৃষ্ণপুর, ডাকঘর: হরিপুর, থানা: বোয়ালমারী, জেলা: ফরিদপুর-৭৮২০'
  );

  // Password change state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Address edit state
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Withdrawal state (inside Credit/Wallet tab)
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(() => offerSettings?.minWithdrawLimit || 100);
  const [withdrawGateway, setWithdrawGateway] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank'>('bKash');
  const [withdrawAccount, setWithdrawAccount] = useState(currentUser?.phone || '');
  const [withdrawAccountType, setWithdrawAccountType] = useState<'personal' | 'agent'>('personal');
  const [withdrawFeedback, setWithdrawFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);

  const [copiedReferral, setCopiedReferral] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [resubmitSuccessMsg, setResubmitSuccessMsg] = useState<string | null>(null);

  // Sync internal fields if currentUser changes
  useEffect(() => {
    if (currentUser) {
      const isOldTruncated = currentUser.firstName === 'Md.' && currentUser.name?.includes('Akbar');
      const fName = isOldTruncated ? 'Md. Akbar' : (currentUser.firstName || (currentUser.name ? currentUser.name.split(' ').slice(0, -1).join(' ') : 'Md. Akbar'));
      const lName = currentUser.lastName || (currentUser.name ? currentUser.name.split(' ').slice(-1).join(' ') : 'Hossain');
      setFirstName(fName || 'Md. Akbar');
      setLastName(lName || 'Hossain');
      setContactNumber(currentUser.phone);
      setEmailAddress(currentUser.email || 'akbar.office10@gmail.com');
      setDob(currentUser.dob || '1995-05-12');
      setGender(currentUser.gender || 'পুরুষ (Male)');
      setDeliveryAddress(currentUser.address || 'মিরপুর-১০, ঢাকা-১২১৬');
      setWithdrawAccount(currentUser.phone);
    }
  }, [currentUser]);

  const handleSaveUserInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const updatedUser = {
      ...currentUser,
      name: fullName || currentUser.name,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: contactNumber.trim(),
      email: emailAddress.trim(),
      dob: dob.trim(),
      gender: gender.trim(),
      address: deliveryAddress.trim(),
      permanentAddress: permanentAddress.trim()
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('bikroy_user', JSON.stringify(updatedUser));
    setSaveSuccessMsg(lang === 'bn' ? 'ব্যক্তিগত তথ্য সফলভাবে সংরক্ষিত হয়েছে!' : 'User information saved successfully!');
    setIsEditUserModalOpen(false);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      alert(lang === 'bn' ? 'নতুন পাসওয়ার্ড দুটি মিলছে না।' : 'Passwords do not match.');
      return;
    }
    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setIsPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 2000);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawFeedback(null);
    setIsSubmittingWithdraw(true);

    setTimeout(() => {
      const res = requestWithdrawal({
        amount: Number(withdrawAmount),
        gateway: withdrawGateway,
        accountNumber: withdrawAccount,
        accountType: withdrawAccountType
      });

      if (res.success) {
        setWithdrawFeedback({ type: 'success', message: res.message });
        setShowWithdrawForm(false);
      } else {
        setWithdrawFeedback({ type: 'error', message: res.message });
      }
      setIsSubmittingWithdraw(false);
    }, 600);
  };

  const handleBackToShopping = () => {
    setActiveModal(null);
  };

  const handleResubmitRejectedAd = (adId: string) => {
    updateAdValidationStatus(adId, 'Received');
    updateAdStatus(adId, 'pending');
    setResubmitSuccessMsg('বিজ্ঞাপনটি পুনরায় যাচাই ও অনুমোদনের জন্য অপেক্ষামান (ওয়েটিং) তালিকায় পাঠানো হয়েছে!');
    setTimeout(() => setResubmitSuccessMsg(null), 4000);
  };

  const handleViewAd = (ad: typeof ads[0]) => {
    setSelectedAd(ad);
    setActiveModal('adDetail');
  };

  const handleDeleteAd = (ad: typeof ads[0]) => {
    setAdToDelete(ad);
  };

  const handlePostNewAd = () => {
    setActiveModal('postAd');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-4">
          <User className="w-16 h-16 text-slate-300 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">
            {lang === 'bn' ? 'লগইন করা নেই' : 'Not Logged In'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'bn' ? 'আপনার একাউন্ট তথ্য ও আইডি দেখতে অনুগ্রহ করে লগইন করুন।' : 'Please log in to view your account information.'}
          </p>
          <button
            onClick={() => setActiveModal('auth')}
            className="w-full py-2.5 bg-[#007460] text-white font-bold rounded-xl text-xs hover:bg-[#005e4e] transition-colors"
          >
            {lang === 'bn' ? 'লগইন করুন' : 'Login'}
          </button>
        </div>
      </div>
    );
  }

  const referralCode = currentUser.referralCode || `REF-${currentUser.phone.slice(-4)}-9824`;
  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/?ref=${referralCode}`;

  return (
    <div className="h-screen bg-[#f4f6f8] text-slate-800 flex flex-col w-full overflow-hidden">
      
      {/* FIXED TOP HEADER CONTAINER: Never moves when scrolling */}
      <header className="shrink-0 z-40 bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-sm">
        {/* Row 1: Back/Arrow Icon, Home, Customer ID, Number & Accounts, Return to Shopping */}
        <div className="border-b border-slate-100 px-3 sm:px-6 lg:px-8 xl:px-10 py-2.5">
          <div className="max-w-[1780px] 2xl:max-w-[1920px] mx-auto flex items-center justify-between gap-3 flex-wrap">
            
            {/* Left: Back Arrow Icon + Home + Customer ID + Number + Accounts */}
            <div className="flex items-center flex-wrap gap-2 text-xs text-slate-600">
              <button
                type="button"
                onClick={handleBackToShopping}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-800 font-bold transition-colors cursor-pointer border border-slate-200"
                title="হোমে ফিরুন"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-700" />
                <span>হোম</span>
              </button>

              <span className="text-slate-300">/</span>

              {/* Customer ID */}
              <div className="flex items-center gap-1 bg-slate-100/90 border border-slate-200 px-2 py-0.5 rounded-md">
                <span className="text-slate-500 font-medium text-[11px]">কাষ্টমার আইডি:</span>
                <span className="font-mono font-bold text-slate-900 text-xs">{currentUser.id || 'CUST-01'}</span>
              </div>

              {/* Number */}
              <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                <span className="text-emerald-800 font-medium text-[11px]">নম্বর:</span>
                <span className="font-mono font-bold text-emerald-800 text-xs">{currentUser.phone}</span>
              </div>

              {/* Accounts */}
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                <span className="text-amber-900 font-medium text-[11px]">একাউন্টস:</span>
                <span className="font-bold text-amber-900 text-[11px]">
                  {currentUser.role === 'seller' ? 'বিক্রেতা একাউন্ট' : 'ক্রেতা একাউন্ট'}
                </span>
              </div>
            </div>

            {/* Right: Return to Shopping button */}
            <button
              type="button"
              onClick={handleBackToShopping}
              className="px-3.5 py-1.5 bg-[#007460] hover:bg-[#005e4e] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
              title="শপিংয়ে ফিরুন"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>— শপিংয়ে ফিরুন</span>
            </button>

          </div>
        </div>

        {/* Row 2: Customer Navigation Header Items (স্থির থাকে, ক্লিক করলে কোনো নড়াচড়া বা লাফালাফি করবে না) */}
        <div className="px-3 sm:px-6 lg:px-8 xl:px-10 py-2 bg-slate-50/90 border-t border-slate-100">
          <div className="max-w-[1780px] 2xl:max-w-[1920px] mx-auto flex items-center gap-2 sm:gap-3 overflow-x-auto custom-scrollbar text-xs">
            {/* হেডার: মাই বিজ্ঞাপন (My Ads) */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('my_ads');
              }}
              className={`h-9 px-3.5 rounded-xl flex items-center gap-2 border text-xs font-bold whitespace-nowrap cursor-pointer transition-colors shrink-0 ${
                activeTab === 'my_ads'
                  ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-xs ring-1 ring-amber-400'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <Layers className="w-4 h-4 text-slate-950" />
              <span>মাই বিজ্ঞাপন (My Ads)</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1 ${
                activeTab === 'my_ads' ? 'bg-slate-950 text-amber-300' : 'bg-amber-100 text-amber-900'
              }`}>
                <span>{myAds.length}</span>
                {(pendingMyAds.length > 0 || rejectedMyAds.length > 0) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                )}
              </span>
            </button>

            {/* হেডার: Manage Account (ব্যক্তিগত তথ্য) */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('manage_account');
              }}
              className={`h-9 px-3.5 rounded-xl flex items-center gap-1.5 border text-xs font-bold whitespace-nowrap cursor-pointer transition-colors shrink-0 ${
                activeTab === 'manage_account'
                  ? 'bg-sky-600 border-sky-600 text-white shadow-xs ring-1 ring-sky-500'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Manage Account (ব্যক্তিগত তথ্য)</span>
            </button>

            {/* হেডার: My orders */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('orders');
              }}
              className={`h-9 px-3.5 rounded-xl flex items-center gap-1.5 border text-xs font-bold whitespace-nowrap cursor-pointer transition-colors shrink-0 ${
                activeTab === 'orders'
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs ring-1 ring-emerald-500'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>My orders ({orders.length})</span>
            </button>

            {/* হেডার: ক্রেডিট ও ক্যাশ উত্তোলন */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('credit');
              }}
              className={`h-9 px-3.5 rounded-xl flex items-center gap-1.5 border text-xs font-bold whitespace-nowrap cursor-pointer transition-colors shrink-0 ${
                activeTab === 'credit'
                  ? 'bg-teal-600 border-teal-600 text-white shadow-xs ring-1 ring-teal-500'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>ক্রেডিট ও উত্তোলন</span>
            </button>

            {/* হেডার: সাপোর্ট */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('support');
              }}
              className={`h-9 px-3.5 rounded-xl flex items-center gap-1.5 border text-xs font-bold whitespace-nowrap cursor-pointer transition-colors shrink-0 ${
                activeTab === 'support'
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs ring-1 ring-indigo-500'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>কাস্টমার সাপোর্ট</span>
            </button>
          </div>
        </div>
      </header>

      {/* Success banner if information saved */}
      {saveSuccessMsg && (
        <div className="max-w-[1780px] 2xl:max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-10 mt-2 shrink-0">
          <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center justify-between shadow-2xs animate-in fade-in">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
            <button onClick={() => setSaveSuccessMsg('')} className="text-emerald-700 hover:text-emerald-950">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Dashboard Layout: Left Sidebar Card (Fixed, internally scrollable) + Right Content Card (Independent Scroll) */}
      <div className="flex-1 min-h-0 w-full max-w-[1780px] 2xl:max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 py-3 sm:py-4 flex flex-col lg:flex-row gap-5 overflow-hidden">
        
        {/* LEFT COLUMN: User Card & Menu Sidebar - Fixed in place, scrollable within boundary with visible draggable scrollbar */}
        <aside className="w-full lg:w-80 xl:w-88 shrink-0 h-auto lg:h-full max-h-[35vh] lg:max-h-full overflow-y-auto custom-scrollbar space-y-4 pr-1.5 pb-4">
            
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
              
              <div className="flex items-center gap-3.5">
                {/* Circular Initial Avatar */}
                <div className="w-14 h-14 rounded-full bg-[#007460] text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
                  {currentUser.name ? currentUser.name.charAt(0) : 'M'}
                </div>

                <div className="overflow-hidden">
                  <h3 className="font-bold text-slate-900 text-base leading-tight truncate">
                    {currentUser.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {currentUser.phone}
                  </p>

                  {/* Badges: Member & Points */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2.5 py-0.5 bg-[#007460] text-white rounded-full text-[11px] font-bold shadow-2xs">
                      {siteName || 'বিক্রয় মেলা'} মেম্বার
                    </span>
                    <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-[11px] font-bold">
                      {currentUser.rewardPoints ?? 100} Pts
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary Balance & Points Boxes */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                  <span className="text-[11px] text-slate-500 font-medium block">ক্রেডিট ব্যালেন্স</span>
                  <span className="text-base font-extrabold text-emerald-700 font-mono mt-0.5 block">
                    ৳{currentUser.walletBalance?.toLocaleString() ?? '৩৫০০'}
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                  <span className="text-[11px] text-slate-500 font-medium block">অর্জিত পয়েন্ট</span>
                  <span className="text-base font-extrabold text-amber-600 font-mono mt-0.5 block">
                    {currentUser.rewardPoints ?? 100}
                  </span>
                </div>
              </div>

            </div>

            {/* Navigation Menu List */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden divide-y divide-slate-100 text-xs">
              
              {/* 1. My Accounts: User Information (ব্যক্তিগত তথ্য) */}
              <button
                type="button"
                onClick={() => setActiveTab('manage_account')}
                className={`w-full px-4 py-3.5 text-left flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === 'manage_account'
                    ? 'bg-sky-50 text-sky-800 font-bold border-l-4 border-sky-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-sky-600 shrink-0" />
                  <div>
                    <span className="block font-bold">User Information (ব্যক্তিগত তথ্য)</span>
                    <span className="text-[10px] text-slate-500 font-normal">My Accounts • একাউন্ট তথ্য ও পরিবর্তন</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              {/* 2. My Ads: মাই বিজ্ঞাপন (My Advertisements) */}
              <button
                type="button"
                onClick={() => setActiveTab('my_ads')}
                className={`w-full px-4 py-3.5 text-left flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === 'my_ads'
                    ? 'bg-amber-50 text-amber-950 font-bold border-l-4 border-amber-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="block font-bold">মাই বিজ্ঞাপন (My Advertisements)</span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-1.5 py-0.2 rounded-full font-mono">
                        {myAds.length}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-normal">
                      My Ads • চলমান: {activeMyAds.length} • ওয়েটিং: {pendingMyAds.length} • বাতিল: {rejectedMyAds.length}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              {/* 3. My Order: অর্ডার ও ট্র্যাকিং হিস্ট্রি */}
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`w-full px-4 py-3.5 text-left flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="block font-bold">অর্ডার ও ট্র্যাকিং হিস্ট্রি</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-1.5 py-0.2 rounded-full font-mono">
                        {orders.length}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-normal">My Order • অর্ডার ট্র্যাকিং ও হিস্ট্রি ({orders.length})</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              {/* 4. Manage Address: সংরক্ষিত ডেলিভারি ঠিকানা (Manage Addresses) */}
              <button
                type="button"
                onClick={() => setActiveTab('addresses')}
                className={`w-full px-4 py-3.5 text-left flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === 'addresses'
                    ? 'bg-sky-50 text-sky-800 font-bold border-l-4 border-sky-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                  <div>
                    <span className="block font-bold">সংরক্ষিত ডেলিভারি ঠিকানা (Manage Addresses)</span>
                    <span className="text-[10px] text-slate-500 font-normal">Manage Address • ঠিকানা পরিবর্তন ও যোগ</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              {/* 5. My wishlist */}
              <button
                type="button"
                onClick={() => setActiveTab('wishlist')}
                className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === 'wishlist'
                    ? 'bg-rose-50 text-rose-800 font-bold border-l-4 border-rose-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-rose-600 shrink-0" />
                  <div>
                    <span className="block font-bold">My wishlist</span>
                    <span className="text-[10px] text-slate-400 font-normal">পছন্দের পণ্যের তালিকা</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              {/* 6. Support tickets */}
              <button
                type="button"
                onClick={() => setActiveTab('support')}
                className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === 'support'
                    ? 'bg-indigo-50 text-indigo-800 font-bold border-l-4 border-indigo-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Headphones className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <span className="block font-bold">Support tickets</span>
                    <span className="text-[10px] text-slate-400 font-normal">অভিযোগ ও লাইভ সমাধান</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              {/* 7. BikroyMela Club */}
              <button
                type="button"
                onClick={() => setActiveTab('club')}
                className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === 'club'
                    ? 'bg-amber-50 text-amber-900 font-bold border-l-4 border-amber-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <span className="block font-bold">{siteName || 'বিক্রয় মেলা'} ক্লাব</span>
                    <span className="text-[10px] text-slate-400 font-normal">ভিআইপি মেম্বারশিপ অফার</span>
                  </div>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">VIP</span>
              </button>

              {/* 8. BikroyMela Point */}
              <button
                type="button"
                onClick={() => setActiveTab('point')}
                className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === 'point'
                    ? 'bg-amber-50 text-amber-900 font-bold border-l-4 border-amber-500'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Coins className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="block font-bold">{siteName || 'বিক্রয় মেলা'} পয়েন্ট</span>
                    <span className="text-[10px] text-slate-400 font-normal">পয়েন্ট ব্যালেন্স ও ক্যাশব্যাক</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded font-mono">
                  {currentUser.rewardPoints ?? 100} Pts
                </span>
              </button>

              {/* 9. BikroyMela Credit */}
              <button
                type="button"
                onClick={() => setActiveTab('credit')}
                className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === 'credit'
                    ? 'bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="block font-bold">{siteName || 'বিক্রয় মেলা'} ক্রেডিট</span>
                    <span className="text-[10px] text-slate-400 font-normal">শপিং ক্রেডিট ও লিমিট</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded font-mono">
                  ৳{currentUser.walletBalance?.toLocaleString() ?? '৩৫০০'}
                </span>
              </button>

              {/* 10. Share & Earn */}
              <button
                type="button"
                onClick={() => setActiveTab('share_earn')}
                className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === 'share_earn'
                    ? 'bg-teal-50 text-teal-800 font-bold border-l-4 border-teal-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Share2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <div>
                    <span className="block font-bold">Share & Earn</span>
                    <span className="text-[10px] text-slate-400 font-normal">আইডি শেয়ার করে আয় করুন</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              {/* 11. Log Out */}
              <button
                type="button"
                onClick={() => {
                  if (confirm(lang === 'bn' ? 'আপনি কি নিশ্চিত যে লগআউট করতে চান?' : 'Are you sure you want to log out?')) {
                    customerLogout();
                  }
                }}
                className="w-full px-4 py-3.5 text-left flex items-center justify-between text-rose-600 hover:bg-rose-50 transition-colors font-bold cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>লগ আউট (Log Out)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-rose-400 shrink-0" />
              </button>

            </div>

          </aside>

          {/* RIGHT COLUMN: Main Content Area - Independent Scroll (ডান পাশে মাউস রেখে স্ক্রল করা যাবে, বাম পাশ স্থির থাকবে) */}
          <main className="flex-1 min-w-0 h-full overflow-y-auto custom-scrollbar space-y-6 pr-1 pb-16">
            
            {/* TAB: MANAGE ACCOUNT (Exact match to કાષ્ટমার আইডি1.png) */}
            {activeTab === 'manage_account' && (
              <div className="space-y-6">
                
                {/* CARD 1: User Information (ব্যক্তিগত তথ্য) with [Edit] Button */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm sm:text-base">
                      <User className="w-4 h-4 text-sky-600" />
                      <span>User Information (ব্যক্তিগত তথ্য)</span>
                    </div>

                    {/* Edit Button (Opens mobile-responsive drawer/modal, solves B-03) */}
                    <button
                      type="button"
                      onClick={() => setIsEditUserModalOpen(true)}
                      className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1.5 transition-colors cursor-pointer hover:underline"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit (এডিট করুন)</span>
                    </button>
                  </div>

                  {/* 2-Column Responsive Information Grid matching કાષ્ટমার আইডি1.png */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium block">Full Name (সম্পূর্ণ নাম)</span>
                      <span className="font-bold text-slate-900 text-sm mt-0.5 block">{currentUser.name}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block">First Name (প্রদত্ত নাম)</span>
                      <span className="font-bold text-slate-800 text-sm mt-0.5 block">{firstName}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block">Last Name (বংশ পদবী)</span>
                      <span className="font-bold text-slate-800 text-sm mt-0.5 block">{lastName}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block">Contact Number (মোবাইল)</span>
                      <span className="font-bold text-slate-800 font-mono text-sm mt-0.5 block">{contactNumber}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block">Date of Birth (জন্ম তারিখ)</span>
                      <span className="font-bold text-slate-800 font-mono text-sm mt-0.5 block">{dob}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block">Gender (লিঙ্গ)</span>
                      <span className="font-bold text-slate-800 text-sm mt-0.5 block">{gender}</span>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-slate-400 font-medium block">Delivery Address (ডেলিভারি ঠিকানা)</span>
                      <span className="font-bold text-slate-800 text-sm mt-0.5 block">{deliveryAddress}</span>
                    </div>
                  </div>
                </div>

                {/* CARD 2: Account Security (লগইন ও পাসওয়ার্ড সুরক্ষা) matching કાષ્ટমার আইডি1.png */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm sm:text-base border-b border-slate-100 pb-3">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>Account Security (লগইন ও পাসওয়ার্ড সুরক্ষা)</span>
                  </div>

                  <div className="space-y-4 text-xs">
                    {/* Email Field with Verified Tag */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-slate-400 font-medium block">Email Address (ইমেইল ঠিকানা)</span>
                        <span className="font-bold text-slate-800 font-mono text-sm mt-0.5 block">{emailAddress}</span>
                      </div>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full text-xs font-bold flex items-center gap-1 shrink-0 self-start sm:self-auto">
                        <Check className="w-3.5 h-3.5" />
                        <span>ভেরিফাইড</span>
                      </span>
                    </div>

                    {/* Password Field with Change Password CTA */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-slate-400 font-medium block">Password (পাসওয়ার্ড)</span>
                        <span className="font-mono text-base font-bold text-slate-800 tracking-widest mt-0.5 block">••••••••</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 self-start sm:self-auto shadow-2xs"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================= */}
            {/* TAB: MY ADS (মাই বিজ্ঞাপন - চলমান, ওয়েটিং ও ক্যানসেল)    */}
            {/* ========================================================= */}
            {activeTab === 'my_ads' && (
              <div className="space-y-5 animate-in fade-in">
                {/* Resubmit Success Toast */}
                {resubmitSuccessMsg && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{resubmitSuccessMsg}</span>
                    </div>
                    <button onClick={() => setResubmitSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* 1. Header Card: মাই বিজ্ঞাপন */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs shrink-0">
                        <Layers className="w-5 h-5 text-slate-950" />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                          <span>মাই বিজ্ঞাপন (My Advertisements)</span>
                          <span className="text-xs bg-amber-100 text-amber-900 font-mono font-bold px-2 py-0.5 rounded-full border border-amber-300">
                            মোট: {myAds.length}টি
                          </span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          আপনার পোস্টকৃত সকল বিজ্ঞাপনের লাইভ স্থিতি, ডাটা ভেলিডেশন ও অনুমোদন ট্র্যাকিং
                        </p>
                      </div>
                    </div>

                    {/* CTA: Post Ad Button */}
                    <button
                      type="button"
                      onClick={handlePostNewAd}
                      className="px-4 py-2 bg-[#007460] hover:bg-[#005e4e] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs self-start sm:self-auto shrink-0"
                    >
                      <PlusCircle className="w-4 h-4 text-amber-300" />
                      <span>+ নতুন বিজ্ঞাপন দিন</span>
                    </button>
                  </div>

                  {/* 2. Three Metric Status Cards: চলমান, ওয়েটিং, ক্যানসেল */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {/* Card 1: চলমান (Active / Live) */}
                    <button
                      type="button"
                      onClick={() => setMyAdsFilter('active')}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                        myAdsFilter === 'active'
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/50 shadow-xs'
                          : 'bg-slate-50/80 border-slate-200 hover:bg-emerald-50/40 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>চলমান বিজ্ঞাপন</span>
                        </span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="text-2xl font-extrabold text-emerald-900 font-mono">
                        {activeMyAds.length}
                      </div>
                      <p className="text-[10px] text-emerald-700 mt-1">অনুমোদিত ও ক্রেতাদের জন্য লাইভ</p>
                    </button>

                    {/* Card 2: ওয়েটিং / অপেক্ষামান (Waiting / Pending) */}
                    <button
                      type="button"
                      onClick={() => setMyAdsFilter('pending')}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                        myAdsFilter === 'pending'
                          ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/50 shadow-xs'
                          : 'bg-slate-50/80 border-slate-200 hover:bg-amber-50/40 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                          <span>ওয়েটিং বিজ্ঞাপন</span>
                        </span>
                        <Clock className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="text-2xl font-extrabold text-amber-900 font-mono">
                        {pendingMyAds.length}
                      </div>
                      <p className="text-[10px] text-amber-700 mt-1">এডমিন ভেলিডেশন ও পর্যালোচনায় অপেক্ষামান</p>
                    </button>

                    {/* Card 3: ক্যানসেল / বাতিল (Cancelled / Rejected) */}
                    <button
                      type="button"
                      onClick={() => setMyAdsFilter('rejected')}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                        myAdsFilter === 'rejected'
                          ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-400/50 shadow-xs'
                          : 'bg-slate-50/80 border-slate-200 hover:bg-rose-50/40 hover:border-rose-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-rose-800 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                          <span>ক্যানসেল বিজ্ঞাপন</span>
                        </span>
                        <XCircle className="w-4 h-4 text-rose-600" />
                      </div>
                      <div className="text-2xl font-extrabold text-rose-900 font-mono">
                        {rejectedMyAds.length}
                      </div>
                      <p className="text-[10px] text-rose-700 mt-1">সংশোধন ও পুনরায় আবেদনযোগ্য</p>
                    </button>
                  </div>

                  {/* 3. Sub-Tab Switcher Filter Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setMyAdsFilter('all')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        myAdsFilter === 'all'
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      সকল বিজ্ঞাপন ({myAds.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setMyAdsFilter('active')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                        myAdsFilter === 'active'
                          ? 'bg-emerald-700 text-white shadow-2xs'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>চলমান ({activeMyAds.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMyAdsFilter('pending')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                        myAdsFilter === 'pending'
                          ? 'bg-amber-600 text-white shadow-2xs'
                          : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                      <span>ওয়েটিং / অপেক্ষামান ({pendingMyAds.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMyAdsFilter('rejected')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                        myAdsFilter === 'rejected'
                          ? 'bg-rose-700 text-white shadow-2xs'
                          : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                      <span>ক্যানসেল / বাতিল ({rejectedMyAds.length})</span>
                    </button>
                  </div>
                </div>

                {/* 4. Advertisements List matching filter */}
                {displayedMyAds.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <Layers className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      {myAdsFilter === 'active' && 'আপনার কোনো চলমান বিজ্ঞাপন নেই'}
                      {myAdsFilter === 'pending' && 'আপনার কোনো অপেক্ষামান / ওয়েটিং বিজ্ঞাপন নেই'}
                      {myAdsFilter === 'rejected' && 'আপনার কোনো ক্যানসেল বিজ্ঞাপন নেই'}
                      {myAdsFilter === 'all' && 'আপনি এখনও কোনো বিজ্ঞাপন পোস্ট করেননি'}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      পণ্য বিক্রয় করতে খুব সহজেই নতুন বিজ্ঞাপন পোস্ট করুন। এডমিন যাচাই করে দ্রুত লাইভ করে দেবে।
                    </p>
                    <button
                      type="button"
                      onClick={handlePostNewAd}
                      className="px-4 py-2 bg-[#007460] hover:bg-[#005e4e] text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4 text-amber-300" />
                      <span>নতুন বিজ্ঞাপন পোস্ট করুন</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {displayedMyAds.map((ad) => {
                      const isAdActive = ad.status === 'active' || ad.validationStatus === 'Approved';
                      const isAdPending = (ad.status === 'pending' || ad.validationStatus === 'Received' || ad.validationStatus === 'Verified' || ad.validationStatus === 'Processed') && ad.status !== 'rejected' && ad.validationStatus !== 'Rejected';
                      const isAdRejected = ad.status === 'rejected' || ad.validationStatus === 'Rejected';

                      return (
                        <div
                          key={ad.id}
                          className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between ${
                            isAdRejected
                              ? 'border-rose-300 bg-rose-50/20'
                              : isAdPending
                              ? 'border-amber-300 bg-amber-50/20'
                              : 'border-slate-200/90 hover:border-emerald-300'
                          }`}
                        >
                          {/* Left: Thumbnail & Info */}
                          <div className="flex items-start gap-3.5 flex-1 min-w-0">
                            {/* Thumbnail Image */}
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                              {ad.images && ad.images.length > 0 ? (
                                <img
                                  src={ad.images[0]}
                                  alt={ad.titleBn}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                  <ShoppingBag className="w-6 h-6" />
                                </div>
                              )}

                              {/* Status Overlay Corner Badge */}
                              <span
                                className={`absolute top-1 left-1 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                                  isAdActive
                                    ? 'bg-emerald-700 text-white'
                                    : isAdPending
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-rose-700 text-white'
                                }`}
                              >
                                {isAdActive ? 'চলমান' : isAdPending ? 'ওয়েটিং' : 'ক্যানসেল'}
                              </span>
                            </div>

                            {/* Details */}
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                                  ID: {ad.id}
                                </span>
                                <span className="text-[10px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                  {ad.category}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  • {ad.createdAt}
                                </span>
                              </div>

                              <h3
                                className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 hover:text-emerald-700 cursor-pointer"
                                onClick={() => handleViewAd(ad)}
                              >
                                {ad.titleBn || ad.titleEn}
                              </h3>

                              <div className="flex items-center gap-2 font-mono">
                                <span className="text-base font-extrabold text-emerald-700">
                                  ৳{ad.price.toLocaleString()}
                                </span>
                                {ad.isNegotiable && (
                                  <span className="text-[10px] text-slate-500 font-sans">(আলোচনা সাপেক্ষ)</span>
                                )}
                                <span className="text-[10px] text-slate-400 font-sans ml-auto sm:ml-2">
                                  👁️ {ad.views || 0} বার দেখা হয়েছে
                                </span>
                              </div>

                              {/* Paid Package & Transaction Voucher Info */}
                              {ad.isPaidAd && (
                                <div className="p-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg text-xs space-y-1 my-1.5">
                                  <div className="flex items-center justify-between text-emerald-950 font-bold text-[11px]">
                                    <span className="flex items-center gap-1">
                                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>প্যাকেজ: {ad.paymentBreakdown?.packageName || (ad.urgent ? 'জরুরি বিক্রি' : 'ফিচার্ড')}</span>
                                    </span>
                                    <span className="font-mono text-emerald-900 bg-emerald-200/80 px-1.5 py-0.2 rounded text-[10px] font-bold">
                                      ৳ {ad.paidAmount} ({ad.paymentGateway || 'bKash'})
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-emerald-800 flex items-center justify-between flex-wrap gap-1">
                                    <span>TrxID: <strong className="font-mono text-emerald-950">{ad.paymentTrxId || 'TRX-VERIFIED'}</strong></span>
                                    <span className={`font-bold px-1.5 py-0.2 rounded text-[9px] ${
                                      isAdActive ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-900 border border-amber-300'
                                    }`}>
                                      {isAdActive ? '✓ পেমেন্ট অনুমোদিত ও লাইভ' : '⏳ পেমেন্ট সম্পন্ন • এডমিন অনুমোদনের অপেক্ষায়'}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Status Specific Description & Notes */}
                              {isAdActive && (
                                <div className="pt-1 flex items-center gap-2 text-xs text-emerald-800">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span>বিজ্ঞাপনটি সক্রিয় আছে এবং ক্রেতারা সাইটে দেখতে পাচ্ছেন।</span>
                                </div>
                              )}

                              {isAdPending && (
                                <div className="pt-1 space-y-1">
                                  <div className="flex items-center gap-1.5 text-xs text-amber-800 font-medium">
                                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 animate-spin" />
                                    <span>{ad.isPaidAd ? 'পেমেন্ট প্রাপ্তি ও ডাটা ভেলিডেশন শেষে এডমিন লাইভ করবেন' : `এডমিন ডাটা ভেলিডেশন ও পর্যালোচনায় অপেক্ষামান (${ad.validationStatus || 'Received'})`}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                                    <span>অগ্রগতি:</span>
                                    <span className="bg-emerald-100 text-emerald-800 px-1 rounded">১. {ad.isPaidAd ? 'পেমেন্ট ও সাবমিট' : 'সাবমিট'}</span>
                                    <span>➔</span>
                                    <span className="bg-amber-100 text-amber-900 font-bold px-1 rounded">২. এডমিন ভেলিডেশন</span>
                                    <span>➔</span>
                                    <span className="text-slate-400">৩. সাইটে লাইভ অনুমোদন</span>
                                  </div>
                                </div>
                              )}

                              {isAdRejected && (
                                <div className="pt-1 space-y-1.5">
                                  <div className="p-2.5 bg-rose-100/80 border border-rose-300 rounded-lg text-xs text-rose-900">
                                    <div className="flex items-center gap-1.5 font-bold mb-0.5">
                                      <XCircle className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                                      <span>বিজ্ঞাপনটি বাতিল করার কারণ:</span>
                                    </div>
                                    <p className="text-slate-800 leading-relaxed font-sans text-[11px]">
                                      {ad.rejectionReason || 'বিজ্ঞাপনের ছবি বা বিবরণ অসম্পূর্ণ থাকায় সাময়িক বাতিল করা হয়েছে।'}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right: Action Buttons */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleViewAd(ad)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-600" />
                              <span>বিজ্ঞাপন দেখুন</span>
                            </button>

                            {isAdRejected && (
                              <button
                                type="button"
                                onClick={() => handleResubmitRejectedAd(ad.id)}
                                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                                title="সংশোধন নিশ্চিত করে এডমিনের কাছে পুনরায় অনুমোদনের আবেদন করুন"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>পুনরায় আবেদন করুন</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDeleteAd(ad)}
                              className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                              title="বিজ্ঞাপনটি মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>মুছে ফেলুন</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB: MY ORDERS */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <Package className="w-4 h-4 text-emerald-600" />
                    <span>অর্ডার ও ট্র্যাকিং হিস্ট্রি ({orders.length})</span>
                  </h3>
                </div>

                {orders.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <Package className="w-10 h-10 mx-auto text-slate-300" />
                    <p className="text-xs">এখনও কোনো অর্ডার করেননি।</p>
                    <button
                      onClick={handleBackToShopping}
                      className="px-4 py-2 bg-[#007460] text-white rounded-lg text-xs font-bold"
                    >
                      কেনাকাটা শুরু করুন
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map(ord => (
                      <div key={ord.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{ord.adTitle}</span>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono font-bold rounded text-[10px]">
                              #{ord.id}
                            </span>
                          </div>
                          <p className="text-slate-500">
                            মূল্য: <span className="font-bold text-emerald-700 font-mono">৳{ord.totalAmount?.toLocaleString()}</span> · কুরিয়ার ট্র্যাকিং: <span className="font-mono text-slate-700">{ord.trackingNumber}</span>
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setActiveModal('orderTracking');
                          }}
                          className="px-3 py-1.5 bg-[#007460] hover:bg-[#005e4e] text-white rounded-lg text-xs font-semibold whitespace-nowrap self-start sm:self-auto"
                        >
                          লাইভ ট্র্যাকিং দেখুন ➔
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: MY WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-600" />
                    <span>পছন্দের বিজ্ঞাপনের তালিকা (Wishlist)</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ads.slice(0, 4).map(ad => (
                    <div key={ad.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex gap-3 text-xs">
                      <img src={ad.images[0]} alt={ad.titleBn} className="w-16 h-16 object-cover rounded-lg shrink-0" />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <h4 className="font-bold text-slate-900 truncate">{ad.titleBn}</h4>
                        <span className="font-extrabold text-emerald-700 font-mono">৳{ad.price.toLocaleString()}</span>
                        <button
                          onClick={handleBackToShopping}
                          className="text-[11px] font-bold text-[#007460] hover:underline text-left mt-1"
                        >
                          পণ্যটি দেখুন ➔
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SUPPORT TICKETS */}
            {activeTab === 'support' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-indigo-600" />
                    <span>২৪/৭ কাস্টমার সাপোর্ট ও হেল্পডেস্ক</span>
                  </h3>
                </div>

                <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-3 text-xs">
                  <p className="text-slate-700 leading-relaxed">
                    যেকোনো অভিযোগ, ডেলিভারি সমস্যা বা এসক্রো পেমেন্ট সংক্রান্ত সহায়তায় আমাদের অভিজ্ঞ সাপোর্ট টিম সবসময় আপনার পাশে আছে।
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => {
                        setChatRecipient({ id: 'support-01', name: 'বিক্রয়মেলা হেল্পডেস্ক', phone: '09612-888999' });
                        setActiveModal('chat');
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-2xs"
                    >
                      <Headphones className="w-3.5 h-3.5" />
                      <span>লাইভ সাপোর্ট চ্যাট শুরু করুন</span>
                    </button>
                    <a
                      href="https://wa.me/8801332520826"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg font-bold flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>হোয়াটসঅ্যাপ সাপোর্ট</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CLUB / VIP */}
            {activeTab === 'club' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-500" />
                    <span>{siteName || 'বিক্রয় মেলা'} ক্লাব – প্রিমিয়াম মেম্বারশিপ ও ভিআইপি সুবিধা</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                    <span className="font-bold text-amber-950 block">👑 গোল্ডেন ফিচার্ড বুস্টিং</span>
                    <p className="text-slate-600">প্রতি মাসে ১টি বিজ্ঞাপনে সম্পূর্ণ ফ্রি হোমপেজ ফিচার্ড বুস্টিং সুবিধা।</p>
                  </div>
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                    <span className="font-bold text-emerald-950 block">🚚 ফ্রি ডেলিভারি ভাউচার</span>
                    <p className="text-slate-600">প্রতিটি অর্ডারে ৫০% ডেলিভারি ডিসকাউন্ট এবং জিরো এসক্রো ফি সুবিধা।</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: POINT (REWARD POINT) */}
            {activeTab === 'point' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span>পয়েন্ট ব্যালেন্স ও ক্যাশব্যাক রিওয়ার্ড</span>
                  </h3>
                  <span className="text-sm font-extrabold text-amber-800 bg-amber-100 px-3 py-1 rounded-full font-mono">
                    মোট পয়েন্ট: {currentUser.rewardPoints ?? 100} Pts
                  </span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
                  <h4 className="font-bold text-slate-800">পয়েন্ট অর্জনের সুযোগ:</h4>
                  <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                    <li>দৈনিক সাইটে প্রবেশ করলে: ২০ পয়েন্ট</li>
                    <li>প্রতিটি নতুন বিজ্ঞাপন দিলে: ১৫ পয়েন্ট</li>
                    <li>সফল অর্ডারে ক্যাশব্যাক: প্রতি ১০০ টাকায় ১ পয়েন্ট</li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB: CREDIT & WITHDRAWAL */}
            {activeTab === 'credit' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>{siteName || 'বিক্রয় মেলা'} ক্রেডিট – ওয়ালেট ব্যালেন্স ও ক্যাশ উত্তোলন</span>
                  </h3>
                </div>

                <div className="p-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-200 font-medium">বর্তমান ওয়ালেট ব্যালেন্স</span>
                    <span className="text-xs bg-emerald-700/80 px-2 py-0.5 rounded font-mono">১০০% ক্যাশ যোগ্য</span>
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-amber-300">
                    ৳{(currentUser.walletBalance ?? 3500).toLocaleString()}
                  </div>
                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => setShowWithdrawForm(!showWithdrawForm)}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-2xs cursor-pointer"
                    >
                      {showWithdrawForm ? 'ফর্ম বন্ধ করুন' : 'বিকাশ/নগদে ক্যাশ তুলুন ➔'}
                    </button>
                  </div>
                </div>

                {/* Cash Withdrawal Form */}
                {showWithdrawForm && (
                  <form onSubmit={handleWithdrawSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs animate-in fade-in">
                    <h4 className="font-bold text-slate-800">ক্যাশ টাকা উত্তোলনের আবেদন করুন:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-600 font-medium block mb-1">উত্তোলনের পরিমাণ (টাকা)</label>
                        <input
                          type="number"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                          min={offerSettings?.minWithdrawLimit || 50}
                          max={currentUser.walletBalance || 50000}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 font-medium block mb-1">গেটওয়ে নির্বাচন</label>
                        <select
                          value={withdrawGateway}
                          onChange={(e) => setWithdrawGateway(e.target.value as any)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                        >
                          <option value="bKash">bKash (বিকাশ)</option>
                          <option value="Nagad">Nagad (নগদ)</option>
                          <option value="Rocket">Rocket (রকেট)</option>
                          <option value="Bank">ব্যাংক একাউন্ট</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-slate-600 font-medium block mb-1">অ্যাকাউন্ট নম্বর</label>
                        <input
                          type="text"
                          value={withdrawAccount}
                          onChange={(e) => setWithdrawAccount(e.target.value)}
                          placeholder="01XXXXXXXXX"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingWithdraw}
                      className="px-4 py-2 bg-[#007460] hover:bg-[#005e4e] text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
                    >
                      {isSubmittingWithdraw ? 'আবেদন পাঠানো হচ্ছে...' : 'উত্তোলন নিশ্চিত করুন'}
                    </button>
                  </form>
                )}

                {withdrawFeedback && (
                  <div className={`p-3 rounded-lg text-xs font-semibold ${
                    withdrawFeedback.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {withdrawFeedback.message}
                  </div>
                )}
              </div>
            )}

            {/* TAB: SHARE & EARN */}
            {activeTab === 'share_earn' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-teal-600" />
                    <span>Share & Earn – বন্ধুদের সাথে শেয়ার করে আয় করুন</span>
                  </h3>
                </div>

                <div className="p-5 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl space-y-4 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-teal-950 text-sm block">আপনার ইউনিক রেফারেল কোড ও লিংক</span>
                    <p className="text-slate-600">
                      আপনার পরিচিত কেউ এই কোড বা লিংক ব্যবহার করে একাউন্ট খুললেই আপনার একাউন্টে ৫০ টাকা ক্যাশ বোনাস ও ৫০ পয়েন্ট জমা হবে!
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={referralLink}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-700 text-xs"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(referralLink);
                        setCopiedReferral(true);
                        setTimeout(() => setCopiedReferral(false), 2500);
                      }}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      {copiedReferral ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedReferral ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MANAGE ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-600" />
                    <span>সংরক্ষিত ডেলিভারি ঠিকানা (Manage Addresses)</span>
                  </h3>
                  <button
                    onClick={() => setIsEditUserModalOpen(true)}
                    className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>ঠিকানা পরিবর্তন</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                      প্রাথমিক ডেলিভারি ঠিকানা
                    </span>
                    <p className="font-bold text-slate-800 text-sm">{deliveryAddress}</p>
                    <p className="text-slate-500">ফোন: {contactNumber}</p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-full inline-block">
                      স্থায়ী ঠিকানা
                    </span>
                    <p className="font-bold text-slate-800 text-sm">{permanentAddress}</p>
                  </div>
                </div>
              </div>
            )}

          </main>
      </div>

      {/* MODAL 1: EDIT USER INFORMATION (Requirement B-03 - Mobile Responsive) */}
      {isEditUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 my-auto">
            
            <div className="bg-slate-900 px-5 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Edit3 className="w-4 h-4 text-sky-400" />
                <span>ব্যক্তিগত তথ্য পরিবর্তন ও আপডেট (Edit User Info)</span>
              </div>
              <button
                onClick={() => setIsEditUserModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUserInfo} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">First Name (প্রথম নাম)</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Last Name (শেষ নাম)</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Contact Number (মোবাইল নম্বর)</label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Email Address (ইমেইল ঠিকানা)</label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Date of Birth (জন্ম তারিখ)</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Gender (লিঙ্গ)</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="পুরুষ (Male)">পুরুষ (Male)</option>
                    <option value="মহিলা (Female)">মহিলা (Female)</option>
                    <option value="অন্যান্য (Other)">অন্যান্য (Other)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Delivery Address (ডেলিভারি ঠিকানা)</label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditUserModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>তথ্য সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: CHANGE PASSWORD */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 my-auto">
            <div className="bg-slate-900 px-5 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>পাসওয়ার্ড পরিবর্তন করুন</span>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="p-5 space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">বর্তমান পাসওয়ার্ড</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg pr-9"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4 text-[#007460]" /> : <Eye className="w-4 h-4 text-slate-500" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">নতুন পাসওয়ার্ড</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="কমপক্ষে ৬ অক্ষর"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg pr-9"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    title={showNewPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4 text-[#007460]" /> : <Eye className="w-4 h-4 text-slate-500" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">নতুন পাসওয়ার্ড নিশ্চিত করুন</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="আবার টাইপ করুন"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg pr-9"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    title={showConfirmPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 text-[#007460]" /> : <Eye className="w-4 h-4 text-slate-500" />}
                  </button>
                </div>
              </div>

              {passwordSuccess && (
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-center">
                  ✓ পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#007460] hover:bg-[#005e4e] text-white rounded-lg font-bold"
                >
                  পাসওয়ার্ড আপডেট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
