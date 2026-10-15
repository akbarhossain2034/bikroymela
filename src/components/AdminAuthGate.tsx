import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Menu, 
  ShoppingCart, 
  Search, 
  Lock, 
  ArrowLeft,
  X,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  Crown,
  KeyRound,
  RotateCw,
  UserCheck,
  AlertCircle,
  Building2,
  Sparkles
} from 'lucide-react';

interface AdminAuthGateProps {
  onBackToCustomer: () => void;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({ onBackToCustomer }) => {
  const { 
    siteName, 
    adminLogin, 
    adminRegister,
    checkAdminExists,
    adminList
  } = useApp();

  // Multi-step flow matching customer login:
  // 1. 'identify' (Initial Screen: Admin ID/Phone/Email + Sign Up/Login)
  // 2. 'password' (2nd Screen: Password + Security OTP matching 2য়.png)
  // 3. 'forgot_password' (Admin Password Reset)
  // 4. 'otp_verify' (Step 1 of Registration: OTP verification matching 3য়.png)
  // 5. 'register_details' (Step 2 of Registration: Staff application matching 4থ.png)
  // 6. 'register_success' (Step 3 of Registration: Success notice & Owner review matching 5ম.png)
  const [step, setStep] = useState<
    'identify' | 'password' | 'forgot_password' | 'otp_verify' | 'register_details' | 'register_success'
  >('identify');

  // Input states
  const [identifier, setIdentifier] = useState('ADM-101');
  const [password, setPassword] = useState('admin');
  const [securityOtp, setSecurityOtp] = useState('7845');
  const [showPassword, setShowPassword] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  // Matched Admin info
  const [matchedAdmin, setMatchedAdmin] = useState<any>(null);

  // OTP state for registration
  const [generatedOtp, setGeneratedOtp] = useState('1234');
  const [otpInput, setOtpInput] = useState('');
  const [otpTimer, setOtpTimer] = useState(59);
  const [canResendOtp, setCanResendOtp] = useState(false);

  // Staff application state
  const [regName, setRegName] = useState('');
  const [regRole, setRegRole] = useState<'Moderator' | 'Quality Officer'>('Moderator');
  const [regDepartment, setRegDepartment] = useState('বিজ্ঞাপন যাচাই ও কোয়ালিটি');
  const [regPassword, setRegPassword] = useState('staff');
  const [regConfirmPassword, setRegConfirmPassword] = useState('staff');
  const [generatedAdminId, setGeneratedAdminId] = useState('');

  // OTP countdown timer
  useEffect(() => {
    let timer: any;
    if (step === 'otp_verify' && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setCanResendOtp(true);
    }
    return () => clearInterval(timer);
  }, [step, otpTimer]);

  const handleBack = () => {
    if (step !== 'identify') {
      setStep('identify');
      setFeedbackError(null);
      setFeedbackSuccess(null);
      return;
    }
    onBackToCustomer();
  };

  // Step 1: Intelligent Checking
  const handleIdentifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);
    setFeedbackSuccess(null);

    const cleanInput = identifier.trim();
    if (!cleanInput) {
      setFeedbackError('অনুগ্রহ করে এডমিন আইডি, মোবাইল নম্বর অথবা ইমেইল দিন।');
      return;
    }

    setIsChecking(true);

    setTimeout(() => {
      setIsChecking(false);
      const res = checkAdminExists(cleanInput);

      if (res.exists && res.admin) {
        // Exists -> Go to Password + Security PIN Screen (matching 2য়.png)
        setMatchedAdmin(res.admin);
        setStep('password');
        setPassword(res.admin.isOwner ? 'admin' : 'staff');
        setSecurityOtp('7845');
      } else {
        // Not registered as Admin -> Go to 3-step Staff Registration flow (matching 3য়.png)
        const newCode = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedOtp(newCode);
        setOtpInput('');
        setOtpTimer(59);
        setCanResendOtp(false);
        setStep('otp_verify');
      }
    }, 400);
  };

  // Step 2: Handle Password Login (matching 2য়.png)
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);

    if (!password.trim()) {
      setFeedbackError('অনুগ্রহ করে পাসওয়ার্ড দিন।');
      return;
    }

    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      const res = adminLogin(identifier, password, securityOtp);
      if (res.success) {
        setFeedbackSuccess(res.message);
      } else {
        setFeedbackError(res.message);
      }
    }, 400);
  };

  // Step 3: Handle OTP Verification (matching 3য়.png)
  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);

    if (otpInput.trim() !== generatedOtp && otpInput.trim() !== '1234') {
      setFeedbackError('ভুল ওটিপি কোড! ডেমো ওটিপি কোড: ' + generatedOtp);
      return;
    }

    setStep('register_details');
  };

  const handleResendOtp = () => {
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newCode);
    setOtpTimer(59);
    setCanResendOtp(false);
    setFeedbackSuccess('নতুন ওটিপি কোড পাঠানো হয়েছে!');
    setTimeout(() => setFeedbackSuccess(null), 3000);
  };

  // Step 4: Handle Admin Staff Registration Form (matching 4থ.png)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);

    if (!regName.trim()) {
      setFeedbackError('অনুগ্রহ করে আবেদনকারীর পুরো নাম দিন।');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setFeedbackError('উভয় পাসওয়ার্ড একই হতে হবে।');
      return;
    }

    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      const isEmail = identifier.includes('@');
      const res = adminRegister({
        name: regName.trim(),
        phone: isEmail ? '01711-889900' : identifier.trim(),
        email: isEmail ? identifier.trim() : `${identifier.replace(/[^0-9]/g, '')}@bikroymela.com`,
        role: regRole,
        department: regDepartment,
        password: regPassword
      });

      if (res.success) {
        setGeneratedAdminId(res.generatedId);
        setStep('register_success');
      } else {
        setFeedbackError(res.message);
      }
    }, 450);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800 relative selection:bg-[#007460] selection:text-white">
      
      {/* ============================================================== */}
      {/* 1. TOP HEADER (BRAND GREEN #007460 - IDENTICAL TO CUSTOMER)     */}
      {/* ============================================================== */}
      <header className="bg-[#007460] text-white w-full sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 space-y-2.5">
          
          {/* Top row: Back to Customer | Brand Logo | Security Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <button 
                onClick={handleBack}
                className="text-white hover:text-emerald-100 p-1 focus:outline-none cursor-pointer transition-colors flex items-center gap-1.5"
                title="কাষ্টমার মার্কেটপ্লেসে ফিরে যান"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="hidden sm:inline text-xs font-semibold bg-emerald-800/80 px-2 py-1 rounded">
                  মার্কেটপ্লেস
                </span>
              </button>

              <button 
                onClick={onBackToCustomer}
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white hover:opacity-95 cursor-pointer focus:outline-none font-sans lowercase"
              >
                {siteName.toLowerCase()}
              </button>
            </div>

            {/* Right: Admin Gateway Badge */}
            <div className="flex items-center gap-2 text-white font-medium text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 bg-emerald-800/80 px-2.5 py-1.5 rounded-lg border border-emerald-600/60">
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span className="font-bold">এডমিন সিকিউরিটি গেটওয়ে</span>
              </div>
            </div>
          </div>

          {/* Row 2: Search bar */}
          <div className="w-full">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4 stroke-[2]" />
              </div>
              <input
                type="text"
                readOnly
                placeholder="এডমিন প্যানেল সিকিউরিটি ও ভেরিফিকেশন গেটওয়ে"
                className="w-full bg-white text-slate-800 text-xs sm:text-sm pl-9 pr-4 py-2.5 rounded-sm border-0 focus:outline-none shadow-xs cursor-default placeholder:text-slate-400 font-normal"
              />
            </div>
          </div>

        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. BODY CONTENT (INTELLIGENT CHECKING & MULTI-STEP FLOW)       */}
      {/* ============================================================== */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        
        {/* Centered Card */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200/80">
          
          {/* Security Notice */}
          <div className="w-full mb-4 p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-slate-800 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#007460] shrink-0" />
            <div className="text-[11px] leading-tight text-slate-700">
              <b className="text-[#007460] font-bold">এডমিন ও মালিক সিকিউরিটি:</b> অনিবন্ধিত যে কেউ এডমিন লিংক পেলেও লগইন করতে পারবে না।
            </div>
          </div>

          {/* Feedback Messages */}
          {feedbackError && (
            <div className="w-full mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{feedbackError}</span>
            </div>
          )}

          {feedbackSuccess && (
            <div className="w-full mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-[#007460] flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#007460] shrink-0" />
              <span>{feedbackSuccess}</span>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 1: IDENTIFICATION (Check Admin Account)                  */}
          {/* ------------------------------------------------------------ */}
          {step === 'identify' && (
            <div className="space-y-5">
              <div className="text-center">
                <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight">
                  Admin Portal Login
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  এডমিন আইডি, মোবাইল নম্বর অথবা ইমেইল দিন
                </p>
              </div>

              {/* Fast Testing Quick Selector */}
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                <div className="font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-[#007460]" />
                  <span>দ্রুত টেস্ট বাটন (Quick Fill):</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIdentifier('ADM-101');
                      setFeedbackError(null);
                    }}
                    className={`py-1.5 px-2 text-[11px] rounded text-left border transition-all ${
                      identifier === 'ADM-101'
                        ? 'bg-emerald-100 border-[#007460] text-[#007460] font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block font-bold">মালিক / Super Admin</span>
                    <span className="text-[10px] text-slate-500 font-mono">ADM-101</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIdentifier('01799001122');
                      setFeedbackError(null);
                    }}
                    className={`py-1.5 px-2 text-[11px] rounded text-left border transition-all ${
                      identifier === '01799001122'
                        ? 'bg-emerald-100 border-[#007460] text-[#007460] font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block font-bold text-amber-700">নতুন স্টাফ আবেদন</span>
                    <span className="text-[10px] text-slate-500 font-mono">01799001122</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleIdentifySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    এডমিন আইডি / মোবাইল / ইমেইল
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. ADM-101 or 01711-000001"
                    className="w-full px-4 py-3 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#007460] focus:ring-2 focus:ring-[#007460]/20 transition-all font-medium"
                    required
                  />
                </div>

                {/* Primary Button: Exact Brand Green #007460 */}
                <button
                  type="submit"
                  disabled={isChecking}
                  className="w-full bg-[#007460] hover:bg-[#005e4e] active:bg-[#004b3e] text-white font-bold text-base py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer text-center flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {isChecking ? (
                    <>
                      <RotateCw className="w-5 h-5 animate-spin" />
                      <span>যাচাই করা হচ্ছে...</span>
                    </>
                  ) : (
                    <span>Sign Up / Login</span>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={onBackToCustomer}
                  className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
                >
                  মার্কেটপ্লেসে ফিরে যান (Back to Customer Marketplace)
                </button>
              </div>

            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 2: PASSWORD + SECURITY OTP (Matching 2য়.png)           */}
          {/* ------------------------------------------------------------ */}
          {step === 'password' && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#007460] mx-auto flex items-center justify-center mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">
                  এডমিন পাসওয়ার্ড দিন
                </h1>
                <p className="text-xs text-slate-600 mt-1">
                  অ্যাকাউন্ট ভেরিফায়েড হয়েছে। সিকিউরিটি ক্রেডেনশিয়াল দিন।
                </p>
              </div>

              {/* Matched Admin Profile Badge */}
              <div className="bg-slate-100 p-3 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    {matchedAdmin?.isOwner && <Crown className="w-4 h-4 text-amber-500" />}
                    <span>{matchedAdmin?.name || 'এডমিন ব্যবহারকারী'}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    ID: {matchedAdmin?.id} | পদবী: {matchedAdmin?.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('identify')}
                  className="text-[#007460] font-bold hover:underline shrink-0"
                >
                  পরিবর্তন
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      পাসওয়ার্ড (Password)
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">ডেমো: {matchedAdmin?.isOwner ? 'admin' : 'staff'}</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                      className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-[#007460] pr-10"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      সিকিউরিটি ওটিপি (Security OTP)
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">ডিফল্ট কোড: 7845</span>
                  </div>
                  <input
                    type="text"
                    value={securityOtp}
                    onChange={(e) => setSecurityOtp(e.target.value)}
                    placeholder="7845"
                    className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-[#007460] font-mono"
                    required
                  />
                </div>

                {/* Login Button in Brand Green #007460 */}
                <button
                  type="submit"
                  disabled={isChecking}
                  className="w-full bg-[#007460] hover:bg-[#005e4e] active:bg-[#004b3e] text-white font-bold text-base py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  {isChecking ? (
                    <>
                      <RotateCw className="w-5 h-5 animate-spin" />
                      <span>এডমিন প্যানেলে প্রবেশ হচ্ছে...</span>
                    </>
                  ) : (
                    <span>লগইন করুন (Admin Login)</span>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('forgot_password');
                    }}
                    className="text-xs text-slate-600 hover:text-[#007460] font-medium underline"
                  >
                    Forgot Your Password? (পাসওয়ার্ড ভুলে গেছেন?)
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* FORGOT PASSWORD                                              */}
          {/* ------------------------------------------------------------ */}
          {step === 'forgot_password' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold text-slate-900">এডমিন পাসওয়ার্ড রিসেট</h1>
                <p className="text-xs text-slate-500 mt-1">
                  সুপার এডমিন বা মালিকের অনুমতি সাপেক্ষে পাসওয়ার্ড পরিবর্তন করুন।
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-300 p-3 rounded-lg text-xs text-amber-900">
                এডমিন ও স্টাফ পাসওয়ার্ড রিসেটের ক্ষেত্রে মূল মালিকের ৪-সংখ্যার মাস্টার পিন (Master PIN: 1234) প্রয়োজন।
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('password')}
                  className="flex-1 py-2.5 text-xs font-semibold border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  ফিরে যান
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPassword('admin');
                    setSecurityOtp('7845');
                    setStep('password');
                    setFeedbackSuccess('ডিফল্ট পাসওয়ার্ড (admin) সেট করা হয়েছে!');
                  }}
                  className="flex-1 py-2.5 text-xs font-bold bg-[#007460] text-white rounded-lg hover:bg-[#005e4e]"
                >
                  রিসেট কনফার্ম
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 3: OTP VERIFICATION FOR NEW STAFF (Matching 3য়.png)    */}
          {/* ------------------------------------------------------------ */}
          {step === 'otp_verify' && (
            <div className="space-y-5">
              <div className="text-center">
                <span className="inline-block bg-emerald-100 text-[#007460] font-bold text-[11px] px-2.5 py-0.5 rounded-full mb-2">
                  ধাপ ১/৩: স্টাফ ওটিপি যাচাইকরণ
                </span>
                <h1 className="text-2xl font-bold text-slate-900">
                  যাচাইকরণ কোড (OTP)
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  আমরা আপনার <b className="text-slate-900 font-mono">{identifier}</b> নম্বরে ওটিপি পাঠিয়েছি।
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-300 p-3 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-amber-900 block">সিমুলেশন ওটিপি কোড:</span>
                  <span className="font-mono text-base font-black text-amber-800 tracking-widest">{generatedOtp}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOtpInput(generatedOtp)}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-2.5 py-1.5 rounded shadow-xs"
                >
                  অটো-ফিল কোড
                </button>
              </div>

              <form onSubmit={handleOtpVerify} className="space-y-4">
                <div>
                  <input
                    type="text"
                    maxLength={4}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="• • • •"
                    className="w-full text-center tracking-[1em] text-2xl font-black py-3 bg-white border border-slate-300 rounded-lg text-[#007460] outline-none focus:border-[#007460] font-mono"
                    required
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  {canResendOtp ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-[#007460] font-bold hover:underline"
                    >
                      কোড পুনরায় পাঠান
                    </button>
                  ) : (
                    <span>পুনরায় পাঠানোর সময়: <b className="text-slate-700 font-mono">{otpTimer}s</b></span>
                  )}
                  <button
                    type="button"
                    onClick={() => setStep('identify')}
                    className="text-slate-500 hover:text-slate-800 underline"
                  >
                    নম্বর পরিবর্তন
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#007460] hover:bg-[#005e4e] text-white font-bold text-base py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer text-center"
                >
                  ওটিপি যাচাই করুন ও এগিয়ে যান
                </button>
              </form>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 4: STAFF REGISTRATION DETAILS (Matching 4থ.png)         */}
          {/* ------------------------------------------------------------ */}
          {step === 'register_details' && (
            <div className="space-y-4">
              <div className="text-center">
                <span className="inline-block bg-emerald-100 text-[#007460] font-bold text-[11px] px-2.5 py-0.5 rounded-full mb-1.5">
                  ধাপ ২/৩: স্টাফ আবেদন
                </span>
                <h1 className="text-2xl font-bold text-slate-900">
                  এডমিন স্টাফ আবেদন
                </h1>
                <p className="text-xs text-slate-500">
                  আপনার তথ্য ও পদবী নির্বাচন করে আবেদন সম্পন্ন করুন
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    স্টাফের পুরো নাম
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. রাশেদুল হাসান"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-[#007460]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      পদবী (Role)
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-[#007460] font-medium"
                    >
                      <option value="Moderator">Moderator (মডারেটর)</option>
                      <option value="Quality Officer">Quality Officer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      বিভাগ (Department)
                    </label>
                    <input
                      type="text"
                      value={regDepartment}
                      onChange={(e) => setRegDepartment(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-[#007460]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      পাসওয়ার্ড
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="পাসওয়ার্ড লিখুন"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-[#007460]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      কনফার্ম পাসওয়ার্ড
                    </label>
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="কনফার্ম করুন"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-[#007460]"
                      required
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 leading-tight">
                  ⚠️ <b>মালিকের নিয়ন্ত্রণ নোটিশ:</b> আবেদন সম্পন্ন হলে নতুন এডমিন আইডি তৈরি হবে, কিন্তু মালিক অনুমোদন (Approve) না দেওয়া পর্যন্ত প্রবেশ করা যাবে না।
                </div>

                <button
                  type="submit"
                  disabled={isChecking}
                  className="w-full bg-[#007460] hover:bg-[#005e4e] text-white font-bold text-base py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer text-center flex items-center justify-center gap-2 mt-2"
                >
                  {isChecking ? (
                    <>
                      <RotateCw className="w-5 h-5 animate-spin" />
                      <span>আবেদন জমা হচ্ছে...</span>
                    </>
                  ) : (
                    <span>আবেদন সম্পন্ন করুন</span>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 5: REGISTRATION SUCCESS & OWNER NOTICE (Matching 5ম.png) */}
          {/* ------------------------------------------------------------ */}
          {step === 'register_success' && (
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#007460] mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div>
                <span className="inline-block bg-emerald-100 text-[#007460] font-bold text-[11px] px-2.5 py-0.5 rounded-full mb-1.5">
                  ধাপ ৩/৩: আবেদন গৃহীত হয়েছে
                </span>
                <h1 className="text-2xl font-bold text-slate-900">
                  আবেদন সফল হয়েছে!
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  আপনার এডমিন স্টাফ অ্যাকাউন্ট তৈরি করা হয়েছে।
                </p>
              </div>

              {/* Staff ID Card */}
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 border-2 border-emerald-400 p-4 rounded-xl text-left shadow-sm space-y-2">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                  <span className="text-xs font-semibold text-slate-700">নতুন এডমিন আইডি:</span>
                  <span className="font-mono font-bold text-[#007460] text-sm bg-white px-2.5 py-0.5 rounded border border-emerald-300">
                    {generatedAdminId}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span>স্টাফের নাম:</span>
                  <span className="font-bold">{regName}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span>পদবী:</span>
                  <span className="font-bold text-slate-800">{regRole}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span>স্ট্যাটাস:</span>
                  <span className="font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded">
                    মালিকের অনুমোদনের অপেক্ষায় (Pending)
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 text-left leading-relaxed">
                👑 <b>মালিকের এপ্রুভাল প্রসেস:</b> মূল মালিক তার নিয়ন্ত্রণ প্যানেলে (Owner Panel) গিয়ে আপনার আইডি <b className="text-slate-800 font-mono">{generatedAdminId}</b> অনুমোদন করলেই আপনি পাসওয়ার্ড দিয়ে লগইন করতে পারবেন।
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIdentifier(generatedAdminId);
                    setStep('identify');
                  }}
                  className="w-full bg-[#007460] hover:bg-[#005e4e] text-white font-bold text-sm py-2.5 px-4 rounded-lg shadow-md transition-all"
                >
                  লগইন পেজে যান
                </button>
                <button
                  type="button"
                  onClick={onBackToCustomer}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm py-2.5 px-4 rounded-lg transition-all"
                >
                  মার্কেটপ্লেসে ফিরে যান
                </button>
              </div>

            </div>
          )}

        </div>

      </main>

    </div>
  );
};
