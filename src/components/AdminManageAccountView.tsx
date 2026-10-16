import React, { useState } from 'react';
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
  FileText
} from 'lucide-react';

interface AdminManageAccountViewProps {
  onBackToDashboard: () => void;
}

export const AdminManageAccountView: React.FC<AdminManageAccountViewProps> = ({ onBackToDashboard }) => {
  const { siteName, activeAdmin, updateAdminProfile, adminLogout } = useApp();

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

  // Sync states whenever activeAdmin changes
  React.useEffect(() => {
    if (activeAdmin) {
      const sName = (activeAdmin.name || '').split(' ');
      setFirstName(sName.slice(0, -1).join(' ') || sName[0] || '');
      setLastName(sName.slice(-1).join(' ') || '');
      setContactNumber(activeAdmin.phone || '');
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
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const res = updateAdminProfile(activeAdmin.id, {
      name: fullName,
      phone: contactNumber.trim(),
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
    if (!emailInput.trim()) return;
    updateAdminProfile(activeAdmin.id, { email: emailInput.trim() });
    setSuccessToast('ইমেইল সফলভাবে পরিবর্তন করা হয়েছে!');
    setIsChangingEmail(false);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Save Password
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    updateAdminProfile(activeAdmin.id, { password: passwordInput.trim() });
    setSuccessToast('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!');
    setIsChangingPass(false);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f5f7f9] text-slate-800 flex flex-col font-sans">
      {/* ============================================================== */}
      {/* 1. TOP HEADER (BRAND THEME #007460 MATCHING PHOTO)             */}
      {/* ============================================================== */}
      <header className="bg-[#007460] text-white w-full sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          
          {/* Left: Hamburger & Logo */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button 
              onClick={onBackToDashboard}
              className="text-white hover:opacity-80 p-1 cursor-pointer transition-opacity"
              title="ড্যাশবোর্ডে ফিরে যান"
            >
              <Menu className="w-6 h-6 stroke-[2.2]" />
            </button>
            <button
              onClick={onBackToDashboard}
              className="text-2xl sm:text-[26px] font-black tracking-tight text-white hover:opacity-95 cursor-pointer lowercase font-sans"
            >
              {siteName.toLowerCase()}
            </button>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative w-full">
              <input
                type="text"
                readOnly
                placeholder="Search for products, brands and more"
                className="w-full bg-white text-slate-800 text-xs sm:text-sm pl-4 pr-10 py-2 rounded-sm border-0 focus:outline-none shadow-2xs font-normal"
              />
              <button className="absolute right-0 top-0 bottom-0 px-3 bg-white text-slate-500 rounded-r-sm flex items-center justify-center">
                <Search className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Right: My Account Dropdown & Cart (Exact Match to attached screenshot) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* My Account Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-white hover:opacity-90 font-semibold text-xs sm:text-sm cursor-pointer py-1 px-1.5"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 text-white flex items-center justify-center">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span>My Account</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {/* Dropdown Menu matching Screenshot 2026-03-17 150110.png */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-lg shadow-xl border border-slate-200 text-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95 text-xs">
                  <button
                    onClick={() => { setActiveSidebarTab('account_info'); setDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 font-medium text-slate-800 flex items-center gap-2"
                  >
                    Manage Account
                  </button>
                  <button
                    onClick={() => { onBackToDashboard(); setDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 font-medium text-slate-800 flex items-center gap-2"
                  >
                    Central Dashboard
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => { adminLogout(); setDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 font-bold"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <button 
              onClick={onBackToDashboard}
              className="text-white hover:opacity-85 flex items-center gap-1.5 p-1 cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5 fill-current" />
              <span className="text-xs font-bold hidden sm:inline">Cart</span>
            </button>
          </div>

        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. SUB-BAR: QUICK RETURN TO CENTRAL DASHBOARD                   */}
      {/* ============================================================== */}
      <div className="bg-slate-900 text-white py-2 px-4 sm:px-6 shadow-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-200">
              এডমিন আইডি: <strong className="font-mono text-amber-300">{activeAdmin?.id}</strong> ({activeAdmin?.name})
            </span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-emerald-300 font-bold hidden sm:inline">
              ইউনিক নেম: <span className="font-mono">{activeAdmin?.username || 'Arifhossain388@'}</span>
            </span>
          </div>

          <button
            onClick={onBackToDashboard}
            className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>এডমিন কন্ট্রোল প্যানেলে ফিরুন</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. MAIN CONTENT: EXACT PIXEL MATCH TO Admin User Part.png       */}
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
          {/* LEFT SIDEBAR: "My Account" (MATCHING Admin User Part.png)     */}
          {/* ============================================================ */}
          <aside className="lg:col-span-3 bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">My Account</h2>
            </div>

            <nav className="divide-y divide-slate-100 text-xs sm:text-sm font-medium">
              {/* 1. Account Information (Active Tab in Photo) */}
              <button
                type="button"
                onClick={() => setActiveSidebarTab('account_info')}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                  activeSidebarTab === 'account_info'
                    ? 'bg-[#007460] text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  activeSidebarTab === 'account_info' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <User className="w-3.5 h-3.5" />
                </div>
                <span>Account Information</span>
              </button>

              {/* 2. My Orders */}
              <button
                type="button"
                onClick={() => setActiveSidebarTab('orders')}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                  activeSidebarTab === 'orders' ? 'bg-[#007460] text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Package className="w-4 h-4 text-slate-400" />
                <span>My Orders</span>
              </button>

              {/* 3. My Product Reviews */}
              <button
                type="button"
                onClick={() => setActiveSidebarTab('reviews')}
                className="w-full text-left px-4 py-3 flex items-center gap-3 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Star className="w-4 h-4 text-slate-400" />
                <span>My Product Reviews</span>
              </button>

              {/* 4. Support Tickets */}
              <button
                type="button"
                onClick={() => setActiveSidebarTab('tickets')}
                className="w-full text-left px-4 py-3 flex items-center gap-3 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>Support Tickets</span>
              </button>

              {/* 5. Pickaboo Club */}
              <button
                type="button"
                onClick={() => setActiveSidebarTab('club')}
                className="w-full text-left px-4 py-3 flex items-center gap-3 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Gift className="w-4 h-4 text-slate-400" />
                <span>Pickaboo Club</span>
              </button>

              {/* 6. Share & Earn */}
              <button
                type="button"
                onClick={() => setActiveSidebarTab('share')}
                className="w-full text-left px-4 py-3 flex items-center gap-3 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Share2 className="w-4 h-4 text-slate-400" />
                <span>Share & Earn</span>
              </button>

              {/* 7. Manage Addresses */}
              <button
                type="button"
                onClick={() => setActiveSidebarTab('addresses')}
                className="w-full text-left px-4 py-3 flex items-center gap-3 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Manage Addresses</span>
              </button>

              {/* 8. Saved Payment Methods */}
              <button
                type="button"
                onClick={() => setActiveSidebarTab('payment')}
                className="w-full text-left px-4 py-3 flex items-center gap-3 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <CreditCard className="w-4 h-4 text-slate-400" />
                <span>Saved Payment Methods</span>
              </button>

              {/* 9. Help & Knowledge Base */}
              <button
                type="button"
                onClick={() => setActiveSidebarTab('help')}
                className="w-full text-left px-4 py-3 flex items-center gap-3 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>Help & Knowledge Base</span>
              </button>
            </nav>
          </aside>

          {/* ============================================================ */}
          {/* RIGHT CONTENT: Account Information & Security                */}
          {/* ============================================================ */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* CARD 1: ACCOUNT INFORMATION (MATCHING PHOTO) */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 sm:p-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Account Information
                </h3>
                
                <button
                  type="button"
                  onClick={() => setIsEditingInfo(!isEditingInfo)}
                  className="px-3.5 py-1 text-xs sm:text-sm font-semibold text-[#007460] border border-[#007460] rounded-md hover:bg-emerald-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingInfo ? 'Cancel' : 'Edit'}</span>
                </button>
              </div>

              {isEditingInfo ? (
                /* EDIT FORM */
                <form onSubmit={handleSaveInfo} className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-[#007460]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-[#007460]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Contact Number *</label>
                      <input
                        type="text"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-[#007460] font-mono"
                        required
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
                      className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#007460] hover:bg-[#005e4e] text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* READ-ONLY VIEW (EXACT TWO-COLUMN LAYOUT OF PHOTO) */
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

                  {/* Company / Staff Extended Info */}
                  <div>
                    <span className="text-slate-400 block text-xs font-normal">এডমিন আইডি (Admin ID)</span>
                    <strong className="text-slate-900 block font-mono font-bold mt-0.5">{activeAdmin?.id}</strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-xs font-normal">পদবী ও ডিপার্টমেন্ট</span>
                    <strong className="text-slate-900 block font-medium mt-0.5">{activeAdmin?.role} ({activeAdmin?.department || 'ম্যানেজমেন্ট'})</strong>
                  </div>

                  {activeAdmin?.salary && (
                    <div>
                      <span className="text-slate-400 block text-xs font-normal">নির্ধারিত বেতন (Salary)</span>
                      <strong className="text-slate-900 block font-medium mt-0.5">৳ {activeAdmin.salary}</strong>
                    </div>
                  )}

                  {activeAdmin?.nid && (
                    <div>
                      <span className="text-slate-400 block text-xs font-normal">এনআইডি নম্বর (NID)</span>
                      <strong className="text-slate-900 block font-mono font-medium mt-0.5">{activeAdmin.nid}</strong>
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

            {/* CARD 2: ACCOUNT SECURITY (MATCHING PHOTO) */}
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
                      <button type="submit" className="px-3 py-1 bg-[#007460] text-white rounded text-xs font-bold">
                        Save
                      </button>
                      <button type="button" onClick={() => setIsChangingEmail(false)} className="px-2 text-xs text-slate-500">
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
                      className="text-slate-400 hover:text-slate-600 p-0.5"
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
                      <button type="submit" className="px-3 py-1 bg-[#007460] text-white rounded text-xs font-bold">
                        Save
                      </button>
                      <button type="button" onClick={() => setIsChangingPass(false)} className="px-2 text-xs text-slate-500">
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

        </div>
      </main>
    </div>
  );
};
