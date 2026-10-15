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
  Phone,
  Mail,
  Gift,
  ShieldCheck,
  Sparkles,
  KeyRound,
  RotateCw,
  UserCheck,
  AlertCircle
} from 'lucide-react';

interface AuthViewProps {
  onBackToHome?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onBackToHome }) => {
  const { 
    lang, 
    setCurrentUser, 
    setActiveModal, 
    siteName, 
    offerSettings,
    checkCustomerExists,
    customerLogin,
    customerRegister,
    resetCustomerPassword
  } = useApp();

  const bonusAmount = offerSettings?.isBonusEnabled ? offerSettings.signupBonusAmount : 50;

  // Flow steps:
  // 1. 'identify' (Initial Screen: Email/Phone input + Sign Up/Login)
  // 2. 'password' (2nd Screen: Registered user password login matching 2য়.png)
  // 3. 'forgot_password' (Password reset via OTP)
  // 4. 'otp_verify' (Step 1 of Registration: OTP verification matching 3য়.png)
  // 5. 'register_details' (Step 2 of Registration: Name, Password setup matching 4থ.png)
  // 6. 'register_success' (Step 3 of Registration: Success & Bonus card matching 5ম.png)
  const [step, setStep] = useState<
    'identify' | 'password' | 'forgot_password' | 'otp_verify' | 'register_details' | 'register_success'
  >('identify');

  // Input states
  const [identifier, setIdentifier] = useState('01332520826');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  // OTP state for registration & reset (matching 3য়.png)
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

  // Registered result (matching 5ম.png)
  const [registeredUserData, setRegisteredUserData] = useState<any>(null);

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
    if (onBackToHome) {
      onBackToHome();
    } else {
      setActiveModal(null);
    }
  };

  // Step 1: Handle Initial Identification (Checking if registered or new)
  const handleIdentifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);
    setFeedbackSuccess(null);

    const cleanInput = identifier.trim();
    if (!cleanInput) {
      setFeedbackError('অনুগ্রহ করে আপনার মোবাইল নম্বর অথবা ইমেইল দিন।');
      return;
    }

    setIsChecking(true);

    // Brief check delay for realistic system checking
    setTimeout(() => {
      setIsChecking(false);
      const res = checkCustomerExists(cleanInput);

      if (res.exists) {
        // Registered User -> Go to Password Screen (2nd Photo matching 2য়.png)
        setStep('password');
        setPassword('');
      } else {
        // Not Registered -> Go to 3-step registration flow (Photos 3, 4, 5)
        // Step 1: Send OTP
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
      const res = customerLogin(identifier, password);
      if (res.success) {
        setFeedbackSuccess(res.message);
        setTimeout(() => {
          setActiveModal(null);
        }, 600);
      } else {
        setFeedbackError(res.message);
      }
    }, 350);
  };

  // Step 3: Handle OTP Verification (matching 3য়.png)
  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);

    if (otpInput.trim() !== generatedOtp && otpInput.trim() !== '1234') {
      setFeedbackError('ভুল ওটিপি কোড! অনুগ্রহ করে সঠিক ৪-সংখ্যার ওটিপি কোড দিন। ডেমো ওটিপি: ' + generatedOtp);
      return;
    }

    // OTP Verified -> Advance to Registration Form (matching 4থ.png)
    setStep('register_details');
  };

  // Resend OTP
  const handleResendOtp = () => {
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newCode);
    setOtpTimer(59);
    setCanResendOtp(false);
    setFeedbackSuccess('নতুন ওটিপি কোড পাঠানো হয়েছে!');
    setTimeout(() => setFeedbackSuccess(null), 3000);
  };

  // Step 4: Handle Registration Submission (matching 4থ.png)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);

    const fullName = `${regFirstName.trim()} ${regLastName.trim()}`.trim();
    if (!fullName) {
      setFeedbackError('অনুগ্রহ করে আপনার নাম প্রদান করুন।');
      return;
    }

    if (regPassword.length < 4) {
      setFeedbackError('পাসওয়ার্ড কমপক্ষে ৪-৬ অক্ষরের হতে হবে।');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setFeedbackError('উভয় পাসওয়ার্ড একই হতে হবে। আবার চেক করুন।');
      return;
    }

    if (!agreedTerms) {
      setFeedbackError('একাউন্ট তৈরি করতে ব্যবহারের শর্তাবলীতে সম্মতি দিন।');
      return;
    }

    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      const isEmail = identifier.includes('@');
      const res = customerRegister({
        name: fullName,
        phone: isEmail ? '01700-000000' : identifier.trim(),
        email: isEmail ? identifier.trim() : undefined,
        password: regPassword,
        referralCode: regReferralCode.trim()
      });

      if (res.success) {
        setRegisteredUserData(res.user);
        setStep('register_success'); // matching 5ম.png
      } else {
        setFeedbackError(res.message);
      }
    }, 450);
  };

  // Handle Forgot Password
  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);
    if (!password.trim()) {
      setFeedbackError('অনুগ্রহ করে নতুন পাসওয়ার্ড দিন।');
      return;
    }
    const res = resetCustomerPassword(identifier, password);
    if (res.success) {
      setFeedbackSuccess(res.message);
      setTimeout(() => {
        setStep('password');
        setFeedbackSuccess(null);
      }, 1000);
    } else {
      setFeedbackError(res.message);
    }
  };

  // Google 1-Click Login (Cohesive)
  const handleGoogleLogin = () => {
    const res = checkCustomerExists('akbar.office10@gmail.com');
    if (res.exists && res.user) {
      customerLogin('akbar.office10@gmail.com', res.user.password || '123456');
    } else {
      customerRegister({
        name: 'Md. Akbar Hossain (Google)',
        phone: '01332520826',
        email: 'akbar.office10@gmail.com',
        password: 'google-auth-user'
      });
    }
    setFeedbackSuccess('Google এর মাধ্যমে সফলভাবে লগইন হয়েছে!');
    setTimeout(() => {
      setActiveModal(null);
    }, 600);
  };

  // Facebook 1-Click Login (Cohesive)
  const handleFacebookLogin = () => {
    const res = checkCustomerExists('01332520826');
    if (res.exists && res.user) {
      customerLogin('01332520826', res.user.password || '123456');
    } else {
      customerRegister({
        name: 'Md. Akbar Hossain (Facebook)',
        phone: '01332520826',
        email: 'akbar.office10@gmail.com',
        password: 'fb-auth-user'
      });
    }
    setFeedbackSuccess('Facebook এর মাধ্যমে সফলভাবে লগইন হয়েছে!');
    setTimeout(() => {
      setActiveModal(null);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800 relative selection:bg-[#007460] selection:text-white">
      
      {/* ============================================================== */}
      {/* 1. TOP HEADER (BRAND GREEN #007460 - CONSISTENT FOR ENTIRE SITE) */}
      {/* ============================================================== */}
      <header className="bg-[#007460] text-white w-full sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 space-y-2.5">
          
          {/* Top row: Hamburger Menu | Dynamic Site Logo | Cart & Login */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              {/* Hamburger Icon */}
              <button 
                onClick={handleBack}
                className="text-white hover:text-emerald-100 p-1 focus:outline-none cursor-pointer transition-colors"
                title="মেনু / ফিরে যান"
              >
                <Menu className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
              </button>

              {/* Dynamic Site / Brand Name logo */}
              <button 
                onClick={handleBack}
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white hover:opacity-95 cursor-pointer focus:outline-none font-sans lowercase"
              >
                {siteName.toLowerCase()}
              </button>
            </div>

            {/* Right: Cart icon + "| Login" */}
            <div className="flex items-center gap-2 text-white font-medium text-sm sm:text-base">
              <button 
                onClick={handleBack}
                className="flex items-center gap-1.5 hover:text-emerald-100 transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5 fill-current" />
                <span className="text-white/80 font-normal">|</span>
                <span className="font-semibold">{step === 'register_details' || step === 'otp_verify' ? 'Sign Up' : 'Login'}</span>
              </button>
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
                onClick={handleBack}
                placeholder="Search for products, brands and more"
                className="w-full bg-white text-slate-800 text-xs sm:text-sm pl-9 pr-4 py-2.5 rounded-sm border-0 focus:outline-none shadow-xs cursor-pointer placeholder:text-slate-400 font-normal"
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
          
          {/* Offer Banner if Bonus Enabled */}
          {offerSettings?.isBonusEnabled && bonusAmount > 0 && (
            <div className="w-full mb-5 p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-300 rounded-xl text-xs text-slate-800 flex items-center gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-[#007460] text-amber-300 font-black flex items-center justify-center shrink-0 text-base shadow-xs">
                ৳
              </div>
              <div className="text-left">
                <span className="font-bold text-[#007460] block text-xs">
                  🎁 নতুন গ্রাহকদের জন্য বিশেষ উপহার!
                </span>
                <span className="text-[11px] text-slate-600 block mt-0.5">
                  অ্যাকাউন্ট খুললেই ওয়ালেটে পাবেন <b>৳ {bonusAmount}</b> টাকা ওয়েলকাম ক্যাশ ও ১০০ রিওয়ার্ড পয়েন্ট।
                </span>
              </div>
            </div>
          )}

          {/* Global Error Banner */}
          {feedbackError && (
            <div className="w-full mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{feedbackError}</span>
            </div>
          )}

          {/* Global Success Banner */}
          {feedbackSuccess && (
            <div className="w-full mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-[#007460] flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#007460] shrink-0" />
              <span>{feedbackSuccess}</span>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 1: IDENTIFICATION (Check if Phone/Email Registered)     */}
          {/* ------------------------------------------------------------ */}
          {step === 'identify' && (
            <div className="space-y-5">
              <div className="text-center">
                <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight">
                  Welcome to {siteName}!
                </h1>
                <p className="text-sm sm:text-base text-slate-600 mt-1">
                  Please enter your email or mobile number
                </p>
              </div>

              {/* Quick Profile Select for Fast Testing */}
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                <div className="font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-[#007460]" />
                  <span>দ্রুত যাচাই পরীক্ষা (Quick Demo Switch):</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIdentifier('01332520826');
                      setFeedbackError(null);
                    }}
                    className={`py-1.5 px-2 text-[11px] rounded text-left border transition-all ${
                      identifier === '01332520826'
                        ? 'bg-emerald-100 border-[#007460] text-[#007460] font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block font-bold">রেজিস্টার্ড গ্রাহক</span>
                    <span className="text-[10px] text-slate-500 font-mono">01332520826</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIdentifier('01799887766');
                      setFeedbackError(null);
                    }}
                    className={`py-1.5 px-2 text-[11px] rounded text-left border transition-all ${
                      identifier === '01799887766'
                        ? 'bg-emerald-100 border-[#007460] text-[#007460] font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block font-bold text-amber-700">নতুন গ্রাহক</span>
                    <span className="text-[10px] text-slate-500 font-mono">01799887766</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleIdentifySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    ইমেইল অথবা মোবাইল নম্বর (Email or Phone)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. 01332520826 or user@example.com"
                      className="w-full px-4 py-3 text-sm sm:text-base bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#007460] focus:ring-2 focus:ring-[#007460]/20 transition-all font-medium"
                      required
                    />
                  </div>
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
                      <span>সিস্টেম যাচাই করছে...</span>
                    </>
                  ) : (
                    <span>Sign Up / Login</span>
                  )}
                </button>
              </form>

              {/* "Or" divider */}
              <div className="flex items-center my-3">
                <div className="flex-1 border-t border-slate-200"></div>
                <span className="px-3 text-xs sm:text-sm text-slate-400 font-medium">Or</span>
                <div className="flex-1 border-t border-slate-200"></div>
              </div>

              {/* Google & Facebook buttons with cohesive brand styling */}
              <div className="grid grid-cols-2 gap-3">
                {/* Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-300 rounded-lg py-2.5 px-3 flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span className="text-sm font-semibold text-slate-700">Google</span>
                </button>

                {/* Facebook Button */}
                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg py-2.5 px-3 flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-sm font-semibold">Facebook</span>
                </button>
              </div>

            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 2: PASSWORD LOGIN (Matching 2য়.png)                     */}
          {/* ------------------------------------------------------------ */}
          {step === 'password' && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#007460] mx-auto flex items-center justify-center mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">
                  পাসওয়ার্ড দিন (Password)
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  আপনার অ্যাকাউন্ট যাচাইকৃত হয়েছে। লগইন করতে পাসওয়ার্ড দিন।
                </p>
              </div>

              {/* Identifier Pill with Change button */}
              <div className="bg-slate-100 p-2.5 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <CheckCircle2 className="w-4 h-4 text-[#007460] shrink-0" />
                  <span className="font-semibold text-slate-800 font-mono truncate">{identifier}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('identify')}
                  className="text-[#007460] font-bold hover:underline shrink-0 ml-2"
                >
                  পরিবর্তন করুন
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      পাসওয়ার্ড লিখুন
                    </label>
                    <span className="text-[11px] text-slate-400">ডেমো পাসওয়ার্ড: 123456</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#007460] focus:ring-2 focus:ring-[#007460]/20 transition-all pr-10"
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

                {/* Login Button in Brand Green #007460 */}
                <button
                  type="submit"
                  disabled={isChecking}
                  className="w-full bg-[#007460] hover:bg-[#005e4e] active:bg-[#004b3e] text-white font-bold text-base py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer text-center flex items-center justify-center gap-2 disabled:opacity-75"
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

                {/* Forgot Your Password? Link (matching 2য়.png) */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('forgot_password');
                      setFeedbackError(null);
                      setFeedbackSuccess(null);
                    }}
                    className="text-xs sm:text-sm text-slate-600 hover:text-[#007460] font-medium transition-colors cursor-pointer underline"
                  >
                    Forgot Your Password? (পাসওয়ার্ড ভুলে গেছেন?)
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* FORGOT PASSWORD SCREEN                                       */}
          {/* ------------------------------------------------------------ */}
          {step === 'forgot_password' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold text-slate-900">পাসওয়ার্ড রিসেট</h1>
                <p className="text-xs text-slate-500 mt-1">
                  {identifier} অ্যাকাউন্টের জন্য নতুন পাসওয়ার্ড সেট করুন।
                </p>
              </div>

              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    নতুন পাসওয়ার্ড দিন
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
                    onClick={() => setStep('password')}
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
          {/* STEP 3: OTP VERIFICATION (Matching 3য়.png)                   */}
          {/* ------------------------------------------------------------ */}
          {step === 'otp_verify' && (
            <div className="space-y-5">
              <div className="text-center">
                <span className="inline-block bg-emerald-100 text-[#007460] font-bold text-[11px] px-2.5 py-0.5 rounded-full mb-2">
                  ধাপ ১/৩: ওটিপি যাচাইকরণ
                </span>
                <h1 className="text-2xl font-bold text-slate-900">
                  যাচাইকরণ কোড (OTP)
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  আমরা আপনার <b className="text-slate-900 font-mono">{identifier}</b> নম্বরে ৪-সংখ্যার ওটিপি কোড পাঠিয়েছি।
                </p>
              </div>

              {/* Demo OTP Auto-fill Badge */}
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 text-center">
                    ৪-সংখ্যার ওটিপি কোডটি লিখুন
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="• • • •"
                    className="w-full text-center tracking-[1em] text-2xl font-black py-3 bg-white border border-slate-300 rounded-lg text-[#007460] outline-none focus:border-[#007460] focus:ring-2 focus:ring-[#007460]/20 font-mono"
                    required
                    autoFocus
                  />
                </div>

                {/* Resend Timer */}
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
                    <span>পুনরায় কোড পাঠানোর সময়: <b className="text-slate-700 font-mono">{otpTimer}s</b></span>
                  )}
                  <button
                    type="button"
                    onClick={() => setStep('identify')}
                    className="text-slate-500 hover:text-slate-800 underline"
                  >
                    নম্বর পরিবর্তন
                  </button>
                </div>

                {/* Verify Button in Brand Green #007460 */}
                <button
                  type="submit"
                  className="w-full bg-[#007460] hover:bg-[#005e4e] active:bg-[#004b3e] text-white font-bold text-base py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer text-center"
                >
                  ওটিপি যাচাই করুন (Verify OTP)
                </button>
              </form>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 4: REGISTRATION DETAILS FORM (Matching 4থ.png)           */}
          {/* ------------------------------------------------------------ */}
          {step === 'register_details' && (
            <div className="space-y-4">
              <div className="text-center">
                <span className="inline-block bg-emerald-100 text-[#007460] font-bold text-[11px] px-2.5 py-0.5 rounded-full mb-1.5">
                  ধাপ ২/৩: অ্যাকাউন্ট তথ্য
                </span>
                <h1 className="text-2xl font-bold text-slate-900">
                  নতুন অ্যাকাউন্ট তৈরি
                </h1>
                <p className="text-xs text-slate-500">
                  আপনার নাম ও পাসওয়ার্ড সেট করে রেজিস্ট্রেশন সম্পন্ন করুন
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-xs flex items-center justify-between">
                <span className="text-[#007460] font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  যাচাইকৃত: <b className="font-mono">{identifier}</b>
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
                    পাসওয়ার্ড সেট করুন (Password)
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="কমপক্ষে ৪ বা ৬ অক্ষর"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-[#007460]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    কনফার্ম পাসওয়ার্ড (Confirm Password)
                  </label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="একই পাসওয়ার্ড আবার দিন"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-[#007460]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    রেফারেল কোড (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={regReferralCode}
                    onChange={(e) => setRegReferralCode(e.target.value)}
                    placeholder="e.g. REF-BM-101"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-[#007460] font-mono text-xs uppercase"
                  />
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 accent-[#007460]"
                  />
                  <label htmlFor="terms" className="text-[11px] text-slate-600 leading-tight">
                    আমি বিক্রয় মেলার ব্যবহারের নীতিমালা ও প্রাইভেসি পলিসি মেনে নিচ্ছি।
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isChecking}
                  className="w-full bg-[#007460] hover:bg-[#005e4e] active:bg-[#004b3e] text-white font-bold text-base py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer text-center flex items-center justify-center gap-2 mt-2"
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
          {/* STEP 5: REGISTRATION SUCCESS & BONUS (Matching 5ম.png)        */}
          {/* ------------------------------------------------------------ */}
          {step === 'register_success' && (
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#007460] mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div>
                <span className="inline-block bg-emerald-100 text-[#007460] font-bold text-[11px] px-2.5 py-0.5 rounded-full mb-1.5">
                  ধাপ ৩/৩: রেজিস্ট্রেশন সম্পন্ন
                </span>
                <h1 className="text-2xl font-bold text-slate-900">
                  অভিনন্দন!
                </h1>
                <p className="text-sm text-slate-600 mt-0.5">
                  আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!
                </p>
              </div>

              {/* Bonus Gift Card */}
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 border-2 border-emerald-400 p-4 rounded-xl text-left shadow-sm space-y-2.5">
                <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                  <span className="text-xs font-semibold text-slate-700">ইউজার আইডি (ID):</span>
                  <span className="font-mono font-bold text-[#007460] text-sm bg-white px-2 py-0.5 rounded border border-emerald-300">
                    {registeredUserData?.id || 'BM-9824'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span>গ্রাহকের নাম:</span>
                  <span className="font-bold">{registeredUserData?.name || 'ব্যবহারকারী'}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span>মোবাইল/ইমেইল:</span>
                  <span className="font-mono">{registeredUserData?.phone || identifier}</span>
                </div>
                
                <div className="bg-white p-2.5 rounded-lg border border-emerald-300 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#007460] text-amber-300 font-black flex items-center justify-center shrink-0 text-base shadow-xs">
                    ৳
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#007460] block">
                      🎁 ওয়েলকাম ক্যাশ বোনাস: ৳ {bonusAmount} টাকা
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      + ১০০ রিওয়ার্ড পয়েন্ট ওয়ালেটে জমা হয়েছে!
                    </span>
                  </div>
                </div>
              </div>

              {/* Go to Dashboard / Marketplace Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal('profile');
                  }}
                  className="w-full bg-[#007460] hover:bg-[#005e4e] text-white font-bold text-sm py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  আমার অ্যাকাউন্ট প্রোফাইলে যান
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm py-2.5 px-4 rounded-lg transition-all"
                >
                  মার্কেটপ্লেসে কেনাকাটা করুন
                </button>
              </div>

            </div>
          )}

        </div>

      </main>

      {/* Floating WhatsApp button at bottom right */}
      <a
        href="https://wa.me/8801332520826?text=Hello%20BikroyMela%20Support"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25d366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
        title="24/7 WhatsApp Live Support"
      >
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.585 1.77.948 2.791.948 3.182 0 5.768-2.587 5.769-5.766.001-3.182-2.585-5.768-5.77-5.768zm0 10.375c-.933 0-1.636-.289-2.483-.808l-.178-.106-1.579.414.421-1.54-.117-.186c-.571-.913-.91-1.782-.91-2.583 0-2.518 2.05-4.568 4.571-4.568 2.519 0 4.57 2.05 4.57 4.569 0 2.519-2.051 4.572-4.57 4.572zm2.507-3.415c-.138-.069-.817-.404-.944-.45-.126-.046-.218-.069-.31.069-.092.138-.356.45-.436.542-.08.092-.16.103-.298.035-.138-.069-.583-.215-1.11-.685-.41-.366-.687-.818-.767-.956-.08-.138-.009-.213.06-.281.063-.062.138-.161.207-.241.07-.08.092-.138.138-.23.046-.092.023-.172-.011-.241-.035-.069-.31-.747-.425-1.023-.112-.269-.226-.232-.31-.237-.08-.004-.173-.005-.265-.005s-.241.035-.367.172c-.126.138-.482.471-.482 1.15 0 .678.494 1.333.563 1.425.069.092.973 1.485 2.357 2.083.33.142.587.227.788.291.331.105.632.09.87.055.266-.039.817-.334.932-.656.115-.322.115-.598.08-.656-.034-.058-.126-.092-.264-.161z"/>
        </svg>
      </a>

    </div>
  );
};
