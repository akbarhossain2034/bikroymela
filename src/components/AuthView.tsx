import React, { useState, useEffect, useRef } from 'react';
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
  Mail,
  Smartphone,
  Phone,
  ShieldCheck,
  RotateCw,
  AlertCircle
} from 'lucide-react';
import { User } from '../types';

interface AuthViewProps {
  onBackToHome?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onBackToHome }) => {
  const { 
    siteName, 
    setCurrentUser,
    setActiveModal, 
    checkCustomerExists,
    customerLogin,
    customerRegister,
    resetCustomerPassword,
    offerSettings
  } = useApp();

  const bonusAmount = offerSettings?.isBonusEnabled ? offerSettings.signupBonusAmount : 50;

  // Flow steps:
  // 1. 'identify' (Initial Screen: Matches 1.png exactly)
  // 2. 'password' (2nd Screen: Registered user password login matching 2য়.png)
  // 3. 'forgot_password' (Password reset via OTP)
  // 4. 'otp_verify' (Step 1 of Registration: OTP verification matching 3য়.png)
  // 5. 'register_details' (Step 2 of Registration: Name, Password setup matching 4থ.png)
  // 6. 'register_success' (Step 3 of Registration: Success & Bonus matching 5ম.png)
  // 7. 'guest_login' (Guest login matching 2য়.png with password blocked)
  // 8. 'guest_otp' (Guest 4-digit OTP matching 3য়.png & 4থ.png with 5-minute timer)
  const [step, setStep] = useState<
    'identify' | 'password' | 'forgot_password' | 'otp_verify' | 'register_details' | 'register_success' | 'guest_login' | 'guest_otp'
  >('identify');

  // Input Mode in 1.png: Toggle between Mobile and Email
  const [inputMode, setInputMode] = useState<'mobile' | 'email'>('mobile');
  const [mobileOrEmail, setMobileOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  // Guest flow states (matching 2য়.png, 3য়.png, 4থ.png)
  const [guestMobile, setGuestMobile] = useState('01332520826');
  const [guestOtpDigits, setGuestOtpDigits] = useState<string[]>(['', '', '', '']);
  const [generatedGuestOtp, setGeneratedGuestOtp] = useState('3837');
  const [guestOtpTimer, setGuestOtpTimer] = useState(300); // 5 minutes (300s)
  const [canResendGuestOtp, setCanResendGuestOtp] = useState(false);
  const otp0Ref = useRef<HTMLInputElement>(null);
  const otp1Ref = useRef<HTMLInputElement>(null);
  const otp2Ref = useRef<HTMLInputElement>(null);
  const otp3Ref = useRef<HTMLInputElement>(null);
  const guestOtpRefs = [otp0Ref, otp1Ref, otp2Ref, otp3Ref];

  // Format MM:SS for 5-minute countdown
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Guest OTP 5-minute countdown (300 seconds)
  useEffect(() => {
    let timer: any;
    if (step === 'guest_otp' && guestOtpTimer > 0) {
      timer = setInterval(() => {
        setGuestOtpTimer(prev => prev - 1);
      }, 1000);
    } else if (guestOtpTimer === 0) {
      setCanResendGuestOtp(true);
    }
    return () => clearInterval(timer);
  }, [step, guestOtpTimer]);

  const handleDigitChange = (index: number, val: string) => {
    const digit = val.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...guestOtpDigits];
    newDigits[index] = digit;
    setGuestOtpDigits(newDigits);
    setFeedbackError(null);
    if (digit && index < 3) {
      guestOtpRefs[index + 1].current?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !guestOtpDigits[index] && index > 0) {
      guestOtpRefs[index - 1].current?.focus();
    }
  };

  const handleGuestLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = guestMobile.trim();
    if (!cleanNumber || cleanNumber.replace(/[^0-9]/g, '').length < 11) {
      setFeedbackError('অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।');
      return;
    }
    setFeedbackError(null);
    setFeedbackSuccess(null);
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedGuestOtp(randomCode);
    setGuestOtpDigits(['', '', '', '']);
    setGuestOtpTimer(300); // 5 minutes
    setCanResendGuestOtp(false);
    setStep('guest_otp');
  };

  const handleResendGuestOtp = () => {
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedGuestOtp(newCode);
    setGuestOtpDigits(['', '', '', '']);
    setGuestOtpTimer(300); // 5 minutes
    setCanResendGuestOtp(false);
    setFeedbackSuccess(`নতুন ৪-সংখ্যার ওটিপি পাঠানো হয়েছে: ${newCode}`);
    setTimeout(() => setFeedbackSuccess(null), 3000);
  };

  const handleGuestOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = guestOtpDigits.join('');
    if (entered.length < 4) {
      setFeedbackError('অনুগ্রহ করে ৪ ডিজিটের ওটিপি নম্বরটি পূরণ করুন।');
      return;
    }
    if (entered !== generatedGuestOtp && entered !== '3837' && entered !== '1234') {
      setFeedbackError(`ভুল ওটিপি কোড! ডেমো কোড: ${generatedGuestOtp}`);
      return;
    }

    const cleanDigits = guestMobile.replace(/[^0-9]/g, '');
    const guestId = `GUEST-${cleanDigits.slice(-5) || Math.floor(10000 + Math.random() * 90000)}`;
    const guestUser: User = {
      id: guestId,
      name: `গেস্ট ক্রেতা (${guestMobile.slice(-4)})`,
      firstName: 'গেস্ট',
      lastName: 'ক্রেতা',
      phone: guestMobile,
      email: `${cleanDigits}@guest.bikroymela.com`,
      avatar: '',
      address: 'মিরপুর, ঢাকা',
      permanentAddress: '',
      role: 'user',
      isPhoneVerified: true,
      isNidVerified: false,
      memberSince: new Date().getFullYear().toString(),
      district: 'Dhaka',
      walletBalance: 0,
      rewardPoints: 50,
      freeAdsCount: 1,
      referralCode: `REF-${guestId}`
    };

    setCurrentUser(guestUser);
    try {
      localStorage.removeItem('bikroy_user_logged_out');
      localStorage.setItem('bikroy_user', JSON.stringify(guestUser));
    } catch {}

    setFeedbackSuccess('🎉 গেস্ট ভেরিফিকেশন সফল হয়েছে! এখন পাসওয়ার্ড ছাড়াই যেকোনো পণ্য কেনাকাটা বা বিজ্ঞাপন দিতে পারবেন।');
    setTimeout(() => {
      setActiveModal(null);
    }, 600);
  };

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
    if (step === 'guest_otp') {
      setStep('guest_login');
      setFeedbackError(null);
      setFeedbackSuccess(null);
      return;
    }
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

    const cleanInput = mobileOrEmail.trim();
    if (!cleanInput) {
      setFeedbackError(
        inputMode === 'mobile' 
          ? 'অনুগ্রহ করে আপনার মোবাইল নম্বর দিন।' 
          : 'অনুগ্রহ করে আপনার ইমেইল এড্রেস দিন।'
      );
      return;
    }

    setIsChecking(true);

    // Realistic system checking
    setTimeout(() => {
      setIsChecking(false);
      const res = checkCustomerExists(cleanInput);

      if (res.exists) {
        // Registered User -> Go to Password Screen (matching 2য়.png)
        setStep('password');
        setPassword('');
      } else {
        // Not Registered -> Go to 3-step registration flow (Photos 3, 4, 5)
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
      const res = customerLogin(mobileOrEmail, password);
      if (res.success) {
        setFeedbackSuccess(res.message);
        setTimeout(() => {
          setActiveModal(null);
        }, 500);
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
      setFeedbackError(`ভুল ওটিপি কোড! অনুগ্রহ করে সঠিক কোড দিন। (ওটিপি: ${generatedOtp})`);
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
      setFeedbackError('উভয় পাসওয়ার্ড একই হতে হবে।');
      return;
    }

    if (!agreedTerms) {
      setFeedbackError('একাউন্ট তৈরি করতে ব্যবহারের শর্তাবলীতে সম্মতি দিন।');
      return;
    }

    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      const isEmail = mobileOrEmail.includes('@');
      const res = customerRegister({
        name: fullName,
        phone: isEmail ? '01700-000000' : mobileOrEmail.trim(),
        email: isEmail ? mobileOrEmail.trim() : undefined,
        password: regPassword,
        referralCode: regReferralCode.trim()
      });

      if (res.success) {
        setRegisteredUserData(res.user);
        setStep('register_success');
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
    const res = resetCustomerPassword(mobileOrEmail, password);
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

  // Google 1-Click Login
  const handleGoogleLogin = () => {
    const res = checkCustomerExists('user@gmail.com');
    if (res.exists && res.user) {
      customerLogin('user@gmail.com', res.user.password || '123456');
    } else {
      customerRegister({
        name: 'Google User',
        phone: '01711-223344',
        email: 'user@gmail.com',
        password: '123'
      });
    }
    setFeedbackSuccess('Google এর মাধ্যমে সফলভাবে লগইন হয়েছে!');
    setTimeout(() => {
      setActiveModal(null);
    }, 500);
  };

  // Facebook 1-Click Login
  const handleFacebookLogin = () => {
    const res = checkCustomerExists('01332520826');
    if (res.exists && res.user) {
      customerLogin('01332520826', res.user.password || '123456');
    } else {
      customerRegister({
        name: 'Facebook User',
        phone: '01332520826',
        email: 'fbuser@bikroymela.com',
        password: '123'
      });
    }
    setFeedbackSuccess('Facebook এর মাধ্যমে সফলভাবে লগইন হয়েছে!');
    setTimeout(() => {
      setActiveModal(null);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800 relative selection:bg-[#007460] selection:text-white">
      
      {/* ============================================================== */}
      {/* 1. TOP HEADER (BRAND GREEN #007460 - EXACTLY MATCHING 1.png)  */}
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

              {/* Dynamic Site Name Logo (Not hardcoded to external name, but exact same visual placement) */}
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
      {/* 2. BODY CONTENT (PIXEL-PERFECT REPLICA OF 1.png)               */}
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
                  Please login.
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

              <form onSubmit={handleIdentifySubmit} className="space-y-4">
                {/* Input box matching 1.png: "Please enter a mobile number" */}
                <div>
                  <input
                    type={inputMode === 'mobile' ? 'tel' : 'email'}
                    value={mobileOrEmail}
                    onChange={(e) => setMobileOrEmail(e.target.value)}
                    placeholder={inputMode === 'mobile' ? 'Please enter a mobile number' : 'Please enter your email'}
                    className="w-full px-4 py-3 text-sm sm:text-base bg-[#fcfcfc] border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#007460] focus:ring-1 focus:ring-[#007460] transition-all font-normal"
                    required
                    autoFocus
                  />
                </div>

                {/* Primary Button: "Sign Up/Login" in Brand Green #007460 */}
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
              </form>

              {/* "Forgot Your Password? / Guest?" link right under the button (matching user request) */}
              <div className="pt-1 flex items-center justify-center gap-1.5 text-xs sm:text-sm text-slate-600">
                <button
                  type="button"
                  onClick={() => {
                    setStep('forgot_password');
                    setFeedbackError(null);
                  }}
                  className="hover:text-[#007460] font-normal transition-colors cursor-pointer"
                >
                  Forgot Your Password?
                </button>
                <span className="text-slate-400 font-semibold select-none">/</span>
                <button
                  type="button"
                  onClick={() => {
                    const clean = mobileOrEmail.replace(/[^0-9]/g, '');
                    setGuestMobile(clean.length >= 11 ? mobileOrEmail : '01332520826');
                    setFeedbackError(null);
                    setFeedbackSuccess(null);
                    setStep('guest_login');
                  }}
                  className="text-amber-700 hover:text-amber-800 font-bold transition-colors cursor-pointer hover:underline"
                  title="পাসওয়ার্ড ছাড়া দ্রুত গেস্ট কেনাকাটা ও বিক্রয়"
                >
                  Guest?
                </button>
              </div>

              {/* Social Login Buttons: Google & Facebook side by side (matching 1.png) */}
              <div className="grid grid-cols-2 gap-3 pt-2">
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

                {/* Facebook Button (Cohesive Brand Blue matching 1.png) */}
                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  className="w-full bg-[#5d78e5] hover:bg-[#4d6bd9] text-white rounded-lg py-2.5 px-3 flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-sm font-semibold">Facebook</span>
                </button>
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* GUEST SCREEN 1: LOGIN (MATCHING 2য়.png)                      */}
          {/* Password is BLOCKED and Forgot Password is BLOCKED           */}
          {/* ============================================================ */}
          {step === 'guest_login' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden text-left">
              {/* Card Header matching 2য়.png */}
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">Login</h2>
              </div>

              <div className="p-6 space-y-5">
                {/* Back button matching 2য়.png */}
                <button
                  type="button"
                  onClick={() => {
                    setStep('identify');
                    setFeedbackError(null);
                  }}
                  className="text-sm font-bold text-sky-500 hover:text-sky-600 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>← Back</span>
                </button>

                <form onSubmit={handleGuestLoginSubmit} className="space-y-5 pt-1">
                  {/* Mobile Number input matching 2য়.png */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        value={guestMobile}
                        onChange={(e) => setGuestMobile(e.target.value)}
                        placeholder="01332520826"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 text-base outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-medium"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Password Field - BLOCKED/DISABLED FOR GUEST as requested */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-bold text-slate-900">
                        Password
                      </label>
                      <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        পাসওয়ার্ড ব্লক (Guest Mode)
                      </span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        disabled
                        value="•••••••• (গেস্টদের পাসওয়ার্ড প্রয়োজন নেই)"
                        className="w-full pl-10 pr-10 py-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-400 text-xs sm:text-sm cursor-not-allowed select-none font-medium"
                        readOnly
                      />
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-300">
                        <EyeOff className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      * গেস্ট হিসেবে পণ্য ক্রয় বা বিক্রয়ের জন্য পাসওয়ার্ড প্রয়োজন নেই।
                    </p>
                  </div>

                  {/* Forgot Your Password? BLOCKED/CLOSED as requested */}
                  <div className="flex justify-end pt-0.5">
                    <span className="text-xs text-slate-300 line-through select-none cursor-not-allowed">
                      Forgot Your Password? (বন্ধ)
                    </span>
                  </div>

                  {/* Login Button matching 2য়.png vibrant button */}
                  <button
                    type="submit"
                    className="w-full bg-[#ff5722] hover:bg-[#f4511e] active:bg-[#e64a19] text-white font-bold text-lg py-3 px-4 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer text-center"
                  >
                    Login
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* GUEST SCREEN 2: OTP VERIFICATION (MATCHING 3য়.png & 4থ.png)   */}
          {/* 4 separate boxes, 5-minute timer (4:50, 1:16 style)          */}
          {/* ============================================================ */}
          {step === 'guest_otp' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden text-left">
              {/* Card Header matching 3য়.png */}
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">Login</h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Back button matching 3য়.png */}
                <button
                  type="button"
                  onClick={() => {
                    setStep('guest_login');
                    setFeedbackError(null);
                  }}
                  className="text-sm font-bold text-sky-500 hover:text-sky-600 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>← Back</span>
                </button>

                {/* Inner verification box matching 3য়.png & 4থ.png */}
                <div className="bg-[#f8fafc] border border-slate-200/90 rounded-2xl p-6 sm:p-8 text-center space-y-5">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                      Enter 4-Digit Verification Code
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Code sent to <b className="text-slate-900 font-bold">{guestMobile}</b>
                    </p>
                  </div>

                  {/* 4-Digit Separate Boxes matching 3য়.png & 4থ.png */}
                  <div className="flex items-center justify-center gap-3 sm:gap-4 py-2">
                    {[0, 1, 2, 3].map((index) => (
                      <input
                        key={index}
                        ref={guestOtpRefs[index]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={guestOtpDigits[index]}
                        onChange={(e) => handleDigitChange(index, e.target.value)}
                        onKeyDown={(e) => handleDigitKeyDown(index, e)}
                        className={`w-14 h-16 sm:w-16 sm:h-20 bg-white border-2 rounded-xl text-center text-2xl sm:text-3xl font-black text-slate-900 outline-none transition-all shadow-xs ${
                          guestOtpDigits[index] 
                            ? 'border-sky-500 ring-2 ring-sky-200 bg-sky-50/20' 
                            : 'border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200'
                        }`}
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>

                  {/* 5-minute countdown timer matching 3য়.png & 4থ.png */}
                  <div className="text-sm text-slate-600 font-medium pt-1">
                    {canResendGuestOtp ? (
                      <button
                        type="button"
                        onClick={handleResendGuestOtp}
                        className="text-sky-600 font-bold hover:underline cursor-pointer"
                      >
                        Resend code
                      </button>
                    ) : (
                      <span>
                        Resend code in <b className="text-sky-600 font-bold font-mono">{formatTimer(guestOtpTimer)}</b>
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-400 bg-slate-100/90 py-1.5 px-3 rounded-lg inline-block font-mono">
                    টেস্টিং ডেমো ওটিপি কোড: <b className="text-slate-700">{generatedGuestOtp}</b>
                  </div>
                </div>

                {/* Verify OTP Button matching 3য়.png & 4থ.png vibrant button */}
                <button
                  type="button"
                  onClick={handleGuestOtpSubmit}
                  className="w-full bg-[#ff5722] hover:bg-[#f4511e] active:bg-[#e64a19] text-white font-bold text-lg py-3.5 px-4 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer text-center"
                >
                  Verify OTP
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
                  <span className="font-semibold text-slate-800 font-mono truncate">{mobileOrEmail}</span>
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
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="নতুন পাসওয়ার্ড দিন"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-[#007460] focus:ring-1 focus:ring-[#007460] pr-10"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                      title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-[#007460]" /> : <Eye className="w-4 h-4 text-slate-500" />}
                    </button>
                  </div>
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
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="কমপক্ষে ৪-৬ অক্ষর"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-[#007460] pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      title={showRegPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                      tabIndex={-1}
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4 text-[#007460]" /> : <Eye className="w-4 h-4 text-slate-500" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    কনফার্ম পাসওয়ার্ড
                  </label>
                  <div className="relative">
                    <input
                      type={showRegConfirmPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="একই পাসওয়ার্ড দিন"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:border-[#007460] pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      title={showRegConfirmPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                      tabIndex={-1}
                    >
                      {showRegConfirmPassword ? <EyeOff className="w-4 h-4 text-[#007460]" /> : <Eye className="w-4 h-4 text-slate-500" />}
                    </button>
                  </div>
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
                    আমি {siteName}-এর ব্যবহারের নীতিমালা ও প্রাইভেসি পলিসি মেনে নিচ্ছি।
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
                  আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!
                </p>
              </div>

              {/* Bonus Gift Card */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-left shadow-2xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-semibold text-slate-600">ইউজার আইডি:</span>
                  <span className="font-mono font-bold text-[#007460] text-sm bg-white px-2 py-0.5 rounded border border-slate-300">
                    {registeredUserData?.id || 'BM-9824'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span>নাম:</span>
                  <span className="font-bold">{registeredUserData?.name || 'ব্যবহারকারী'}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span>মোবাইল/ইমেইল:</span>
                  <span className="font-mono">{registeredUserData?.phone || mobileOrEmail}</span>
                </div>
                {offerSettings?.isBonusEnabled && bonusAmount > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg flex items-center gap-2.5 mt-2">
                    <span className="text-xs font-bold text-[#007460]">
                      🎁 ওয়েলকাম ক্যাশ বোনাস: ৳ {bonusAmount} টাকা ওয়ালেটে যোগ হয়েছে!
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal('profile');
                  }}
                  className="w-full bg-[#007460] hover:bg-[#005e4e] text-white font-bold text-sm py-3 px-4 rounded-lg shadow-xs transition-all"
                >
                  আমার প্রোফাইলে যান
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

      {/* Floating WhatsApp button at bottom right (matching 1.png) */}
      <a
        href="https://wa.me/8801332520826?text=Hello%20Support"
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
