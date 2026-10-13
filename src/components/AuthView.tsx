import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Menu, 
  ShoppingCart, 
  Mail, 
  Search, 
  Phone, 
  Lock, 
  ArrowLeft,
  X,
  CheckCircle2
} from 'lucide-react';

interface AuthViewProps {
  onBackToHome?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onBackToHome }) => {
  const { lang, setCurrentUser, setActiveModal, siteName, offerSettings } = useApp();
  const bonusAmount = offerSettings?.isBonusEnabled ? offerSettings.signupBonusAmount : 0;

  // Mode: phone login/signup (default like 1.png), email login, forgot password
  const [authMode, setAuthMode] = useState<'mobile' | 'email' | 'forgot_password'>('mobile');
  const [mobileNumber, setMobileNumber] = useState('01332520826');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [forgotEmailOrPhone, setForgotEmailOrPhone] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleBack = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      setActiveModal(null);
    }
  };

  // Sign Up / Login with Mobile Number (Direct 1-Click with 50 Tk bonus & ID)
  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber.trim()) {
      alert('Please enter a mobile number');
      return;
    }

    const uniqueId = `user-${Date.now().toString().slice(-4)}`;
    setCurrentUser({
      id: uniqueId,
      name: 'Md. Hossain',
      phone: mobileNumber.trim(),
      email: 'akbar.office10@gmail.com',
      address: 'বাসা-২৪, রোড-৭, ব্লক-ডি, মিরপুর-১০, ঢাকা-১২১৬',
      permanentAddress: 'গ্রাম: রামকৃষ্ণপুর, ডাকঘর: হরিপুর, থানা: বোয়ালমারী, জেলা: ফরিদপুর-৭৮২০',
      role: 'user',
      isPhoneVerified: true,
      isNidVerified: true,
      memberSince: '২০২৩',
      district: 'Dhaka',
      loginMethod: 'phone',
      walletBalance: bonusAmount, // Configured Welcome Bonus
      rewardPoints: 120
    });

    setFeedbackMsg(`🎉 সফলভাবে একাউন্ট খোলা হয়েছে!${bonusAmount > 0 ? ` আপনার ওয়ালেটে ৳ ${bonusAmount} ওয়েলকাম বোনাস জমা হয়েছে।` : ''}`);
    setTimeout(() => {
      setActiveModal('profile');
    }, 700);
  };

  // Email Login
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailAddress.trim()) {
      alert('Please enter your email address');
      return;
    }

    setCurrentUser({
      id: `user-${Date.now().toString().slice(-4)}`,
      name: 'Md. Hossain',
      phone: '01332520826',
      email: emailAddress.trim(),
      address: 'বাসা-২৪, রোড-৭, ব্লক-ডি, মিরপুর-১০, ঢাকা-১২১৬',
      permanentAddress: 'গ্রাম: রামকৃষ্ণপুর, ডাকঘর: হরিপুর, থানা: বোয়ালমারী, জেলা: ফরিদপুর-৭৮২০',
      role: 'user',
      isPhoneVerified: true,
      isNidVerified: true,
      memberSince: '২০২৩',
      district: 'Dhaka',
      loginMethod: 'email',
      walletBalance: bonusAmount,
      rewardPoints: 120
    });

    setFeedbackMsg(`🎉 সফলভাবে লগইন সম্পন্ন হয়েছে!${bonusAmount > 0 ? ` আপনার ওয়ালেটে ৳ ${bonusAmount} বোনাস জমা রয়েছে।` : ''}`);
    setTimeout(() => {
      setActiveModal('profile');
    }, 700);
  };

  // Google 1-Click Login
  const handleGoogleLogin = () => {
    setCurrentUser({
      id: `user-g-${Date.now().toString().slice(-4)}`,
      name: 'Md. Hossain (Google)',
      email: 'akbar.office10@gmail.com',
      phone: '01332520826',
      address: 'বাসা-২৪, রোড-৭, ব্লক-ডি, মিরপুর-১০, ঢাকা-১২১৬',
      permanentAddress: 'গ্রাম: রামকৃষ্ণপুর, ডাকঘর: হরিপুর, থানা: বোয়ালমারী, জেলা: ফরিদপুর-৭৮২০',
      role: 'user',
      isPhoneVerified: true,
      isNidVerified: true,
      memberSince: '২০২৩',
      district: 'Dhaka',
      loginMethod: 'google',
      walletBalance: bonusAmount,
      rewardPoints: 120
    });
    setFeedbackMsg(`🎉 Google এর মাধ্যমে সফলভাবে লগইন হয়েছে!${bonusAmount > 0 ? ` ৳ ${bonusAmount} ওয়েলকাম বোনাস জমা হয়েছে!` : ''}`);
    setTimeout(() => {
      setActiveModal('profile');
    }, 700);
  };

  // Facebook 1-Click Login
  const handleFacebookLogin = () => {
    setCurrentUser({
      id: `user-fb-${Date.now().toString().slice(-4)}`,
      name: 'Md. Hossain (Facebook)',
      phone: '01332520826',
      email: 'akbar.office10@gmail.com',
      address: 'বাসা-২৪, রোড-৭, ব্লক-ডি, মিরপুর-১০, ঢাকা-১২১৬',
      permanentAddress: 'গ্রাম: রামকৃষ্ণপুর, ডাকঘর: হরিপুর, থানা: বোয়ালমারী, জেলা: ফরিদপুর-৭৮২০',
      role: 'user',
      isPhoneVerified: true,
      isNidVerified: true,
      memberSince: '২০২৩',
      district: 'Dhaka',
      loginMethod: 'facebook',
      walletBalance: bonusAmount,
      rewardPoints: 120
    });
    setFeedbackMsg(`🎉 Facebook এর মাধ্যমে সফলভাবে লগইন হয়েছে!${bonusAmount > 0 ? ` ৳ ${bonusAmount} বোনাস যুক্ত হয়েছে!` : ''}`);
    setTimeout(() => {
      setActiveModal('profile');
    }, 700);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmailOrPhone.trim()) {
      alert('Please enter your mobile number or email');
      return;
    }
    setFeedbackMsg('পাসওয়ার্ড রিসেট কোড আপনার মোবাইল/ইমেইলে পাঠানো হয়েছে।');
    setTimeout(() => {
      setAuthMode('mobile');
      setFeedbackMsg('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800 relative selection:bg-[#008ecc] selection:text-white">
      
      {/* ============================================================== */}
      {/* 1. TOP HEADER (EXACT REPLICA OF 1.PNG BLUE BAR + SEARCH BAR) */}
      {/* ============================================================== */}
      <header className="bg-[#008ecc] text-white w-full sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 space-y-2.5">
          
          {/* Top row: Hamburger Menu | Dynamic Site Logo | Cart & Login */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              {/* Hamburger Icon */}
              <button 
                onClick={handleBack}
                className="text-white hover:text-cyan-100 p-1 focus:outline-none cursor-pointer transition-colors"
                title="মেনু / ফিরে যান"
              >
                <Menu className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
              </button>

              {/* Dynamic Site / Brand Name logo (configured from admin, no hardcoded Pickaboo) */}
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
                className="flex items-center gap-1.5 hover:text-cyan-100 transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5 fill-current" />
                <span className="text-white/80 font-normal">|</span>
                <span className="font-semibold">Login</span>
              </button>
            </div>
          </div>

          {/* Row 2: Full-width search bar inside the blue header */}
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
      {/* 2. BODY CONTENT (EXACT REPLICA OF 1.PNG LOGIN BOX & SOCIALS)  */}
      {/* ============================================================== */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 bg-white">
        
        {/* Centered Box matching 1.png dimensions */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center">
          
          {/* Dynamic Welcome Text (uses siteName set by admin) */}
          <h1 className="text-2xl sm:text-[26px] font-bold text-[#111827] text-center tracking-tight">
            Welcome to {siteName}!
          </h1>
          <p className="text-lg sm:text-xl text-[#111827] text-center mt-1 mb-6 font-normal">
            Please login.
          </p>

          {/* Offer Banner if Bonus Enabled */}
          {offerSettings?.isBonusEnabled && bonusAmount > 0 && (
            <div className="w-full mb-4 p-3 bg-gradient-to-r from-amber-50 via-emerald-50 to-teal-50 border border-emerald-300 rounded-xl text-xs text-slate-800 flex items-center gap-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0 text-base shadow-xs">
                ৳
              </div>
              <div className="text-left">
                <span className="font-bold text-[#007460] block text-xs sm:text-sm">
                  🎁 নতুন গ্রাহকদের জন্য বিশেষ উপহার!
                </span>
                <span className="text-[11px] text-slate-600 block mt-0.5">
                  অ্যাকাউন্ট খুললেই পাচ্ছেন <b>৳ {bonusAmount}</b> টাকা ওয়েলকাম ক্যাশ বোনাস। সরাসরি বিকাশ/নগদে উত্তোলন করতে বা কেনাকাটায় খরচ করতে পারবেন!
                </span>
              </div>
            </div>
          )}

          {/* Feedback message banner if any */}
          {feedbackMsg && (
            <div className="w-full mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-md text-xs text-emerald-800 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* Form Area */}
          <div className="w-full space-y-4">
            
            {/* 1. Gray "Login with Email" button matching 1.png */}
            {authMode !== 'email' ? (
              <button
                type="button"
                onClick={() => setAuthMode('email')}
                className="w-full bg-[#ededed] hover:bg-[#e4e4e4] active:bg-[#dbdbdb] text-[#555555] font-normal text-sm sm:text-base py-3 px-4 rounded-md flex items-center justify-center gap-2 border border-[#d6d6d6] transition-colors cursor-pointer"
              >
                <Mail className="w-5 h-5 text-[#666666]" />
                <span>Login with <strong className="font-semibold text-[#444444]">Email</strong></span>
              </button>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-3 bg-slate-50 p-4 rounded-md border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span className="font-semibold">ইমেইল দিয়ে লগইন করুন</span>
                  <button 
                    type="button" 
                    onClick={() => setAuthMode('mobile')}
                    className="text-[#008ecc] font-bold hover:underline"
                  >
                    মোবাইলে ফিরুন
                  </button>
                </div>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="Please enter your email"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#cccccc] rounded-md outline-none focus:border-[#008ecc] placeholder:text-slate-400"
                  required
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Please enter password"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#cccccc] rounded-md outline-none focus:border-[#008ecc] placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="w-full bg-[#1a73e8] hover:bg-[#1558b0] text-white font-semibold text-sm py-2.5 rounded-md transition-colors cursor-pointer"
                >
                  Login with Email
                </button>
              </form>
            )}

            {/* 2. "Or" divider matching 1.png */}
            <div className="flex items-center my-3">
              <div className="flex-1 border-t border-[#dcdcdc]"></div>
              <span className="px-3 text-xs sm:text-sm text-[#777777] font-normal">Or</span>
              <div className="flex-1 border-t border-[#dcdcdc]"></div>
            </div>

            {/* 3. Mobile Number input & Sign Up/Login button matching 1.png */}
            {authMode === 'mobile' && (
              <form onSubmit={handleMobileSubmit} className="space-y-4">
                {/* Mobile input */}
                <div>
                  <input
                    type="text"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Please enter a mobile number"
                    className="w-full px-4 py-3 text-sm sm:text-base bg-white border border-[#cccccc] rounded-md text-slate-800 placeholder:text-[#888888] outline-none focus:border-[#008ecc] focus:ring-1 focus:ring-[#008ecc] transition-all"
                    required
                  />
                </div>

                {/* Blue "Sign Up/Login" button matching 1.png */}
                <button
                  type="submit"
                  className="w-full bg-[#1a73e8] hover:bg-[#1765cc] active:bg-[#1253a8] text-white font-bold text-base py-3 px-4 rounded-md transition-colors shadow-xs cursor-pointer text-center"
                >
                  Sign Up/Login
                </button>
              </form>
            )}

            {/* Forgot password mode */}
            {authMode === 'forgot_password' && (
              <form onSubmit={handleForgotPassword} className="space-y-3 bg-slate-50 p-4 rounded-md border border-slate-200">
                <div className="text-xs font-semibold text-slate-700">পাসওয়ার্ড রিসেট করুন</div>
                <input
                  type="text"
                  value={forgotEmailOrPhone}
                  onChange={(e) => setForgotEmailOrPhone(e.target.value)}
                  placeholder="Enter your mobile number or email"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#cccccc] rounded-md outline-none focus:border-[#008ecc]"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode('mobile')}
                    className="flex-1 py-2 text-xs border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs bg-[#1a73e8] text-white font-bold rounded-md hover:bg-[#1558b0]"
                  >
                    রিসেট কোড পাঠান
                  </button>
                </div>
              </form>
            )}

            {/* 4. "Forgot Your Password?" link matching 1.png */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'forgot_password' ? 'mobile' : 'forgot_password')}
                className="text-xs sm:text-sm text-[#666666] hover:text-[#1a73e8] transition-colors cursor-pointer"
              >
                Forgot Your Password?
              </button>
            </div>

            {/* 5. Google & Facebook buttons side-by-side matching 1.png */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              
              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-white hover:bg-slate-50 border border-[#d6d6d6] rounded-md py-2.5 px-3 flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
              >
                {/* Official Google G Logo */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span className="text-sm font-semibold text-[#374151]">Google</span>
              </button>

              {/* Facebook Button (Blue/Purple gradient matching 1.png) */}
              <button
                type="button"
                onClick={handleFacebookLogin}
                className="w-full bg-gradient-to-r from-[#5975eb] to-[#6860ec] hover:from-[#4f6ce7] hover:to-[#5c53e6] text-white rounded-md py-2.5 px-3 flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
              >
                {/* Facebook 'f' Logo */}
                <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm font-semibold text-white">Facebook</span>
              </button>

            </div>

          </div>

        </div>

      </main>

      {/* Floating WhatsApp button at bottom right (matching 1.png green circular icon) */}
      <a
        href="https://wa.me/8801332520826?text=Hello%20Support"
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
