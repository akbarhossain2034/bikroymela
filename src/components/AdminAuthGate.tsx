import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Menu, 
  ShoppingCart, 
  Search, 
  Lock, 
  CheckCircle2,
  Eye,
  EyeOff,
  Mail,
  Smartphone,
  ShieldCheck,
  RotateCw,
  AlertCircle
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
    adminList,
    setActiveAdmin
  } = useApp();

  // Multi-step flow matching 1.png, 2য়.png, 3য়.png, 4থ.png, 5ম.png
  // Exactly identical to Customer Login!
  const [step, setStep] = useState<
    'identify' | 'password' | 'forgot_password' | 'otp_verify' | 'register_details' | 'register_success'
  >('identify');

  // Input Mode in 1.png: Toggle between Mobile and Email
  const [inputMode, setInputMode] = useState<'mobile' | 'email'>('mobile');
  const [mobileOrEmail, setMobileOrEmail] = useState('');
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  // Matched Admin record
  const [matchedAdmin, setMatchedAdmin] = useState<any>(null);

  // OTP state for registration (matching 3য়.png)
  const [generatedOtp, setGeneratedOtp] = useState('1234');
  const [otpInput, setOtpInput] = useState('');
  const [otpTimer, setOtpTimer] = useState(59);
  const [canResendOtp, setCanResendOtp] = useState(false);

  // Registration details state (matching 4থ.png)
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regReferralCode, setRegReferralCode] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Registered staff result (matching 5ম.png)
  const [registeredAdminData, setRegisteredAdminData] = useState<any>(null);

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

  // Step 1: Intelligent Checking (Matching Photo 1)
  const handleIdentifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);
    setFeedbackSuccess(null);

    const cleanInput = (adminId || mobileOrEmail).trim();
    if (!cleanInput) {
      setFeedbackError('অনুগ্রহ করে আপনার এডমিন আইডি (ID) অথবা মোবাইল/ইমেইল দিন।');
      return;
    }

    setIsChecking(true);

    setTimeout(() => {
      setIsChecking(false);
      
      if (!mobileOrEmail && adminId) {
        setMobileOrEmail(adminId);
      }

      // Check admin list (includes ID, phone, email, owner email)
      const res = checkAdminExists(cleanInput);

      if (res.exists && res.admin) {
        // Registered Admin -> Go to Password Screen (matching 2য়.png)
        setMatchedAdmin(res.admin);
        setStep('password');
        setPassword('');
      } else {
        // Not registered as Admin -> Go to 3-step staff application (matching 3, 4, 5)
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
      setFeedbackError('অনুগ্রহ করে আপনার পাসওয়ার্ড দিন।');
      return;
    }

    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      const targetQuery = (adminId || mobileOrEmail).trim();
      const res = adminLogin(targetQuery, password, '7845');
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
      setFeedbackError('ভুল ওটিপি কোড! ডেমো ওটিপি: ' + generatedOtp);
      return;
    }

    // OTP Verified -> Go to Step 4 (Account Details matching 4থ.png)
    setStep('register_details');
  };

  const handleResendOtp = () => {
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newCode);
    setOtpTimer(59);
    setCanResendOtp(false);
    setOtpInput('');
    setFeedbackSuccess(`নতুন ওটিপি পাঠানো হয়েছে: ${newCode}`);
    setTimeout(() => setFeedbackSuccess(null), 3000);
  };

  // Step 4: Handle Registration Submission (matching 4থ.png)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);

    if (!regFirstName.trim() || !regLastName.trim()) {
      setFeedbackError('অনুগ্রহ করে আপনার পুরো নাম লিখুন।');
      return;
    }

    if (regPassword.length < 4) {
      setFeedbackError('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setFeedbackError('কনফার্ম পাসওয়ার্ডের সাথে মূল পাসওয়ার্ড মিলছে না!');
      return;
    }

    if (!agreedTerms) {
      setFeedbackError('অনুগ্রহ করে ব্যবহারের শর্তাবলী মেনে নিন।');
      return;
    }

    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      const fullName = `${regFirstName.trim()} ${regLastName.trim()}`;
      const cleanPhone = inputMode === 'mobile' ? mobileOrEmail : '01700-000000';
      const cleanEmail = inputMode === 'email' ? mobileOrEmail : `${mobileOrEmail.replace(/[^0-9]/g, '')}@staff.bikroymela.com`;

      const regResult = adminRegister({
        name: fullName,
        phone: cleanPhone,
        email: cleanEmail,
        role: 'Moderator',
        department: 'বিজ্ঞাপন যাচাই ও কোয়ালিটি',
        password: regPassword
      });

      if (regResult.success) {
        setRegisteredAdminData({
          id: regResult.generatedId,
          name: fullName,
          phone: cleanPhone,
          email: cleanEmail
        });
        setStep('register_success');
      } else {
        setFeedbackError(regResult.message);
      }
    }, 500);
  };

  // Forgot Password handler
  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSuccess('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে! নতুন পাসওয়ার্ড দিয়ে লগইন করুন।');
    setStep('password');
    setTimeout(() => setFeedbackSuccess(null), 3000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800 relative selection:bg-[#007460] selection:text-white">
      
      {/* ============================================================== */}
      {/* 1. TOP HEADER (BRAND GREEN #007460 - EXACT MATCH TO 1.png)     */}
      {/* ============================================================== */}
      <header className="bg-[#007460] text-white w-full sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 space-y-2.5">
          
          {/* Top row: Hamburger Menu | Site Name Logo | Cart & Login */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <button 
                onClick={handleBack}
                className="text-white hover:opacity-85 p-1 focus:outline-none cursor-pointer transition-opacity"
                title="মেনু / ফিরে যান"
              >
                <Menu className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
              </button>

              {/* Dynamic Site Name Logo (matching Photo 1) */}
              <button 
                onClick={handleBack}
                className="text-2xl sm:text-[28px] font-black tracking-tight text-white hover:opacity-95 cursor-pointer focus:outline-none font-sans lowercase"
              >
                {siteName.toLowerCase()}
              </button>
            </div>

            {/* Right: Cart icon + "| Login" */}
            <div className="flex items-center gap-2 text-white font-medium text-sm sm:text-base">
              <button 
                onClick={handleBack}
                className="flex items-center gap-1.5 hover:opacity-85 transition-opacity cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5 fill-current" />
                <span className="text-white/70 font-normal">|</span>
                <span className="font-semibold">Login</span>
              </button>
            </div>
          </div>

          {/* Row 2: Search bar (Exact match to 1.png) */}
          <div className="w-full">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4 stroke-[2]" />
              </div>
              <input
                type="text"
                readOnly
                onClick={handleBack}
                placeholder="Search for products, brands and more"
                className="w-full bg-white text-slate-800 text-xs sm:text-sm pl-9 pr-4 py-2.5 rounded-sm border-0 focus:outline-none shadow-xs cursor-pointer placeholder:text-slate-400 font-normal"
              />
            </div>
          </div>

        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. BODY CONTENT (PIXEL-PERFECT REPLICA OF 1.png & FLOW)        */}
      {/* ============================================================== */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-14 bg-white">
        
        {/* Centered Card (Clean, minimal, exactly as in 1.png) */}
        <div className="w-full max-w-[430px] mx-auto bg-white p-4 sm:p-6 text-center">

          {/* Feedback Alerts */}
          {feedbackError && (
            <div className="w-full mb-4 p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-700 flex items-center gap-2 font-medium text-left">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{feedbackError}</span>
            </div>
          )}

          {feedbackSuccess && (
            <div className="w-full mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-md text-xs text-[#007460] flex items-center gap-2 font-bold text-left">
              <CheckCircle2 className="w-4 h-4 text-[#007460] shrink-0" />
              <span>{feedbackSuccess}</span>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 1: IDENTIFY SCREEN (EXACT LAYOUT OF 1.png)              */}
          {/* ------------------------------------------------------------ */}
          {step === 'identify' && (
            <div className="space-y-4">
              
              {/* Title & Subtitle: "Welcome to {siteName}! Please login." */}
              <div className="space-y-1 mb-5">
                <h1 className="text-2xl sm:text-[26px] font-semibold text-slate-900 tracking-tight">
                  Welcome to {siteName}!
                </h1>
                <p className="text-lg sm:text-[20px] text-slate-700 font-normal">
                  Please login (Admin)
                </p>
              </div>

              {/* Top Toggle Button: [ ✉ Login with Email ] / [ 📱 Login with Mobile ] */}
              <button
                type="button"
                onClick={() => {
                  setInputMode(inputMode === 'mobile' ? 'email' : 'mobile');
                  setMobileOrEmail('');
                  setFeedbackError(null);
                }}
                className="w-full bg-[#f0f0f0] hover:bg-[#e8e8e8] text-slate-600 font-medium text-sm sm:text-base py-3 px-4 rounded-lg border border-slate-300/80 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {inputMode === 'mobile' ? (
                  <>
                    <Mail className="w-5 h-5 text-slate-500" />
                    <span>Login with <b className="font-semibold text-slate-700">Email</b></span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-5 h-5 text-slate-500" />
                    <span>Login with <b className="font-semibold text-slate-700">Mobile</b></span>
                  </>
                )}
              </button>

              {/* "Or" Divider (matching 1.png) */}
              <div className="flex items-center my-3">
                <div className="flex-1 border-t border-slate-200"></div>
                <span className="px-4 text-sm text-slate-500 font-normal">Or</span>
                <div className="flex-1 border-t border-slate-200"></div>
              </div>

              <form onSubmit={handleIdentifySubmit} className="space-y-3.5">
                {/* Input box matching 1.png: "Please enter a mobile number" / "Please enter your email" */}
                <div>
                  <input
                    type={inputMode === 'mobile' ? 'tel' : 'email'}
                    value={mobileOrEmail}
                    onChange={(e) => {
                      setMobileOrEmail(e.target.value);
                      if (e.target.value) setAdminId('');
                    }}
                    placeholder={inputMode === 'mobile' ? 'Please enter a mobile number' : 'Please enter your email'}
                    className="w-full px-4 py-3 text-sm sm:text-base bg-[#fcfcfc] border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#007460] focus:ring-1 focus:ring-[#007460] transition-all font-normal"
                    autoFocus
                  />
                </div>

                {/* Single box named 'ID' replacing Google & Facebook, placed above Sign Up/Login */}
                <div>
                  <input
                    type="text"
                    value={adminId}
                    onChange={(e) => {
                      setAdminId(e.target.value);
                      if (e.target.value) setMobileOrEmail('');
                    }}
                    placeholder="ID"
                    className="w-full px-4 py-3 text-sm sm:text-base bg-[#fcfcfc] border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#007460] focus:ring-1 focus:ring-[#007460] transition-all font-normal font-mono"
                  />
                </div>

                {/* Primary Button: "Sign Up/Login" moved slightly downward */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isChecking}
                    className="w-full bg-[#007460] hover:bg-[#005e4e] active:bg-[#004b3e] text-white font-bold text-base sm:text-lg py-3 px-4 rounded-lg transition-all shadow-xs cursor-pointer text-center flex items-center justify-center gap-2 disabled:opacity-75"
                  >
                    {isChecking ? (
                      <>
                        <RotateCw className="w-5 h-5 animate-spin" />
                        <span>Checking...</span>
                      </>
                    ) : (
                      <span>Sign Up/Login</span>
                    )}
                  </button>
                </div>
              </form>

              {/* "Forgot Your Password?" link right under the button (matching 1.png) */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep('forgot_password');
                    setFeedbackError(null);
                  }}
                  className="text-xs sm:text-sm text-slate-600 hover:text-[#007460] font-normal transition-colors cursor-pointer"
                >
                  Forgot Your Password?
                </button>
              </div>

              {/* Bottom Marketplace Link */}
              <div className="pt-3 border-t border-slate-100">
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
          {/* STEP 2: PASSWORD SCREEN (MATCHING 2য়.png)                    */}
          {/* ------------------------------------------------------------ */}
          {step === 'password' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#007460] mx-auto flex items-center justify-center mb-1">
                  <Lock className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">
                  পাসওয়ার্ড দিন (Password)
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">
                  লগইন করতে আপনার পাসওয়ার্ড লিখুন
                </p>
              </div>

              {/* Identifier Display & Change link */}
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <CheckCircle2 className="w-4 h-4 text-[#007460] shrink-0" />
                  <span className="font-semibold text-slate-800 font-mono truncate">{adminId || mobileOrEmail}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('identify')}
                  className="text-[#007460] font-bold hover:underline shrink-0 ml-2"
                >
                  পরিবর্তন
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-[#007460] focus:ring-1 focus:ring-[#007460] pr-10"
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

                {/* Login Button in Brand Green #007460 */}
                <button
                  type="submit"
                  disabled={isChecking}
                  className="w-full bg-[#007460] hover:bg-[#005e4e] active:bg-[#004b3e] text-white font-bold text-base py-3 px-4 rounded-lg transition-all shadow-xs cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  {isChecking ? (
                    <>
                      <RotateCw className="w-5 h-5 animate-spin" />
                      <span>লগইন হচ্ছে...</span>
                    </>
                  ) : (
                    <span>লগইন করুন (Log In)</span>
                  )}
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('forgot_password');
                      setFeedbackError(null);
                    }}
                    className="text-xs sm:text-sm text-slate-600 hover:text-[#007460] font-normal underline"
                  >
                    Forgot Your Password?
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* FORGOT PASSWORD RESET                                        */}
          {/* ------------------------------------------------------------ */}
          {step === 'forgot_password' && (
            <div className="space-y-4 text-left">
              <div className="text-center space-y-1">
                <h1 className="text-xl font-bold text-slate-900">পাসওয়ার্ড রিসেট</h1>
                <p className="text-xs text-slate-500">
                  {mobileOrEmail ? `${mobileOrEmail} এর জন্য নতুন পাসওয়ার্ড দিন` : 'আপনার একাউন্টের জন্য নতুন পাসওয়ার্ড দিন'}
                </p>
              </div>

              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
                {!mobileOrEmail && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      মোবাইল বা ইমেইল
                    </label>
                    <input
                      type="text"
                      value={mobileOrEmail}
                      onChange={(e) => setMobileOrEmail(e.target.value)}
                      placeholder="01332520826"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-[#007460]"
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    নতুন পাসওয়ার্ড
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-[#007460]"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('identify')}
                    className="flex-1 py-2.5 text-xs font-semibold border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 text-xs font-bold bg-[#007460] text-white rounded-lg hover:bg-[#005e4e]"
                  >
                    সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 3: OTP VERIFICATION (MATCHING 3য়.png)                    */}
          {/* ------------------------------------------------------------ */}
          {step === 'otp_verify' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <span className="inline-block bg-emerald-100 text-[#007460] font-bold text-[11px] px-2.5 py-0.5 rounded-full">
                  ধাপ ১/৩: ওটিপি যাচাইকরণ
                </span>
                <h1 className="text-2xl font-bold text-slate-900">
                  যাচাইকরণ কোড (OTP)
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">
                  আপনার <b className="text-slate-900 font-mono">{mobileOrEmail}</b> নম্বরে পাঠানো ৪-সংখ্যার কোডটি দিন।
                </p>
              </div>

              <form onSubmit={handleOtpVerify} className="space-y-4">
                <div>
                  <input
                    type="text"
                    maxLength={4}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="1234"
                    className="w-full text-center tracking-[1em] text-2xl font-black py-3 bg-[#fcfcfc] border border-slate-300 rounded-lg text-[#007460] outline-none focus:border-[#007460] focus:ring-1 focus:ring-[#007460] font-mono"
                    required
                    autoFocus
                  />
                  <span className="block text-[11px] text-slate-400 mt-1">টেস্টিং ওটিপি কোড: {generatedOtp}</span>
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

                {/* Primary Button in Brand Green #007460 */}
                <button
                  type="submit"
                  className="w-full bg-[#007460] hover:bg-[#005e4e] active:bg-[#004b3e] text-white font-bold text-base py-3 px-4 rounded-lg transition-all shadow-xs cursor-pointer text-center"
                >
                  ওটিপি যাচাই করুন (Verify OTP)
                </button>
              </form>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 4: REGISTRATION DETAILS (MATCHING 4থ.png)                */}
          {/* ------------------------------------------------------------ */}
          {step === 'register_details' && (
            <div className="space-y-4 text-left">
              <div className="text-center space-y-1">
                <span className="inline-block bg-emerald-100 text-[#007460] font-bold text-[11px] px-2.5 py-0.5 rounded-full">
                  ধাপ ২/৩: অ্যাকাউন্ট তথ্য
                </span>
                <h1 className="text-2xl font-bold text-slate-900">
                  নতুন অ্যাকাউন্ট তৈরি
                </h1>
                <p className="text-xs text-slate-500">
                  আপনার নাম ও পাসওয়ার্ড দিয়ে রেজিস্ট্রেশন সম্পন্ন করুন
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-xs flex items-center justify-between">
                <span className="text-[#007460] font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  যাচাইকৃত: <b className="font-mono">{mobileOrEmail}</b>
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      নামের প্রথম অংশ
                    </label>
                    <input
                      type="text"
                      value={regFirstName}
                      onChange={(e) => setRegFirstName(e.target.value)}
                      placeholder="মোঃ"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-[#007460]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      নামের শেষ অংশ
                    </label>
                    <input
                      type="text"
                      value={regLastName}
                      onChange={(e) => setRegLastName(e.target.value)}
                      placeholder="আকবর হোসেন"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-[#007460]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    পাসওয়ার্ড (Password)
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="কমপক্ষে ৪-৬ অক্ষর"
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
                    placeholder="একই পাসওয়ার্ড দিন"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-[#007460]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    রেফারেল বা স্টাফ কোড (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={regReferralCode}
                    onChange={(e) => setRegReferralCode(e.target.value)}
                    placeholder="e.g. ADM-STAFF"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-[#007460] font-mono text-xs uppercase"
                  />
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="admin_terms"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 accent-[#007460]"
                  />
                  <label htmlFor="admin_terms" className="text-[11px] text-slate-600 leading-tight">
                    আমি {siteName}-এর ব্যবহারের নীতিমালা ও এডমিন পলিসি মেনে নিচ্ছি।
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isChecking}
                  className="w-full bg-[#007460] hover:bg-[#005e4e] active:bg-[#004b3e] text-white font-bold text-base py-3 px-4 rounded-lg transition-all shadow-xs cursor-pointer text-center flex items-center justify-center gap-2 mt-2"
                >
                  {isChecking ? (
                    <>
                      <RotateCw className="w-5 h-5 animate-spin" />
                      <span>একাউন্ট তৈরি হচ্ছে...</span>
                    </>
                  ) : (
                    <span>রেজিস্ট্রেশন সম্পন্ন করুন</span>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 5: REGISTRATION SUCCESS (MATCHING 5ম.png)                */}
          {/* ------------------------------------------------------------ */}
          {step === 'register_success' && (
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#007460] mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div>
                <span className="inline-block bg-emerald-100 text-[#007460] font-bold text-[11px] px-2.5 py-0.5 rounded-full mb-1.5">
                  ধাপ ৩/৩: সম্পন্ন
                </span>
                <h1 className="text-2xl font-bold text-slate-900">
                  অভিনন্দন!
                </h1>
                <p className="text-sm text-slate-600 mt-0.5">
                  আপনার স্টাফ আবেদন সফলভাবে গৃহীত হয়েছে!
                </p>
              </div>

              {/* Staff ID Card */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-left shadow-2xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-semibold text-slate-600">এডমিন আইডি:</span>
                  <span className="font-mono font-bold text-[#007460] text-sm bg-white px-2 py-0.5 rounded border border-slate-300">
                    {registeredAdminData?.id || 'ADM-105'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span>নাম:</span>
                  <span className="font-bold">{registeredAdminData?.name || 'স্টাফ'}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span>মোবাইল/ইমেইল:</span>
                  <span className="font-mono">{registeredAdminData?.phone || mobileOrEmail}</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg flex items-center gap-2 mt-2">
                  <span className="text-xs font-bold text-amber-900">
                    ⏳ অবস্থা: মালিকের অনুমোদনের অপেক্ষায় রয়েছে। মালিক অনুমোদন দিলে আপনি সরাসরি এডমিনে কাজ করতে পারবেন।
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep('identify');
                  }}
                  className="w-full bg-[#007460] hover:bg-[#005e4e] text-white font-bold text-sm py-3 px-4 rounded-lg shadow-xs transition-all"
                >
                  লগইন পাতায় ফিরে যান
                </button>
                <button
                  type="button"
                  onClick={onBackToCustomer}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm py-2.5 px-4 rounded-lg transition-all"
                >
                  মার্কেটপ্লেসে কেনাকাটা করুন
                </button>
              </div>

            </div>
          )}

        </div>

      </main>

      {/* Floating WhatsApp button at bottom right (matching 1.png) */}
      <a
        href="https://wa.me/8801332520826?text=Admin%20Support"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25d366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
        title="24/7 WhatsApp Support"
      >
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.585 1.77.948 2.791.948 3.182 0 5.768-2.587 5.769-5.766.001-3.182-2.585-5.768-5.77-5.768zm0 10.375c-.933 0-1.636-.289-2.483-.808l-.178-.106-1.579.414.421-1.54-.117-.186c-.571-.913-.91-1.782-.91-2.583 0-2.518 2.05-4.568 4.571-4.568 2.519 0 4.57 2.05 4.57 4.569 0 2.519-2.051 4.572-4.57 4.572zm2.507-3.415c-.138-.069-.817-.404-.944-.45-.126-.046-.218-.069-.31.069-.092.138-.356.45-.436.542-.08.092-.16.103-.298.035-.138-.069-.583-.215-1.11-.685-.41-.366-.687-.818-.767-.956-.08-.138-.009-.213.06-.281.063-.062.138-.161.207-.241.07-.08.092-.138.138-.23.046-.092.023-.172-.011-.241-.035-.069-.31-.747-.425-1.023-.112-.269-.226-.232-.31-.237-.08-.004-.173-.005-.265-.005s-.241.035-.367.172c-.126.138-.482.471-.482 1.15 0 .678.494 1.333.563 1.425.069.092.973 1.485 2.357 2.083.33.142.587.227.788.291.331.105.632.09.87.055.266-.039.817-.334.932-.656.115-.322.115-.598.08-.656-.034-.058-.126-.092-.264-.161z"/>
        </svg>
      </a>

    </div>
  );
};
