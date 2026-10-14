import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Phone, 
  Mail, 
  Key, 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles,
  Building2,
  UserPlus,
  LogIn,
  Check
} from 'lucide-react';

interface AdminAuthGateProps {
  onBackToCustomer: () => void;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({ onBackToCustomer }) => {
  const { lang, siteName, adminLogin, adminRegister } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('ADM-101');
  const [loginPassword, setLoginPassword] = useState('admin');
  const [loginOtp, setLoginOtp] = useState('7845');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Register Form State (Requirement 08 & 09)
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<'Moderator' | 'Quality Officer'>('Moderator');
  const [regDepartment, setRegDepartment] = useState('বিজ্ঞাপন যাচাই ও কোয়ালিটি');
  const [regPassword, setRegPassword] = useState('staff');
  const [regOtp, setRegOtp] = useState('7845');
  const [regFeedback, setRegFeedback] = useState<{ type: 'success' | 'error'; message: string; generatedId?: string } | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccess(null);
    setIsLoggingIn(true);

    setTimeout(() => {
      const res = adminLogin(loginIdentifier, loginPassword, loginOtp);
      if (res.success) {
        setLoginSuccess(res.message);
      } else {
        setLoginError(res.message);
      }
      setIsLoggingIn(false);
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegFeedback(null);
    setIsRegistering(true);

    setTimeout(() => {
      if (!regName.trim() || !regPhone.trim()) {
        setRegFeedback({ type: 'error', message: 'অনুগ্রহ করে নাম এবং মোবাইল নম্বর প্রদান করুন।' });
        setIsRegistering(false);
        return;
      }

      const res = adminRegister({
        name: regName.trim(),
        phone: regPhone.trim(),
        email: regEmail.trim(),
        role: regRole,
        department: regDepartment,
        password: regPassword
      });

      if (res.success) {
        setRegFeedback({ 
          type: 'success', 
          message: res.message, 
          generatedId: res.generatedId 
        });
        // Clear fields
        setRegName('');
        setRegPhone('');
        setRegEmail('');
      } else {
        setRegFeedback({ type: 'error', message: res.message });
      }
      setIsRegistering(false);
    }, 400);
  };

  const handleQuickFill = (id: string, pass: string) => {
    setLoginIdentifier(id);
    setLoginPassword(pass);
    setLoginOtp('7845');
    setLoginError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white flex flex-col justify-between p-4 sm:p-6">
      
      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pt-2">
        <button
          onClick={onBackToCustomer}
          className="text-xs text-emerald-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>কাষ্টমার মার্কেটপ্লেসে ফিরে যান</span>
        </button>

        <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
          SECURE GATEWAY
        </span>
      </div>

      {/* Center Auth Card */}
      <div className="max-w-md w-full mx-auto my-auto py-6">
        <div className="bg-white text-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-emerald-500/30">
          
          {/* Card Header (Identical for owner & staff - Requirement 11) */}
          <div className="bg-slate-900 text-white p-5 text-center relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold mx-auto mb-2 shadow-lg">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-extrabold tracking-tight">
              {siteName} এডমিন কন্ট্রোল পোর্টাল
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              কর্মকর্তা ও কর্মচারীদের প্রবেশাধিকার ও ওটিপি ভেরিফিকেশন গেট
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 text-xs font-bold text-center">
            <button
              onClick={() => {
                setAuthMode('login');
                setLoginError(null);
              }}
              className={`py-3 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-emerald-800 border-b-2 border-emerald-600 shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>এডমিন লগইন</span>
            </button>

            <button
              onClick={() => {
                setAuthMode('register');
                setRegFeedback(null);
              }}
              className={`py-3 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                authMode === 'register'
                  ? 'bg-white text-emerald-800 border-b-2 border-emerald-600 shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>কর্মচারী রেজিস্ট্রেশন</span>
            </button>
          </div>

          <div className="p-5 sm:p-6">
            
            {/* TAB 1: LOGIN */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                
                {/* Error Banner */}
                {loginError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-start gap-2 animate-in fade-in">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-semibold">{loginError}</span>
                  </div>
                )}

                {/* Success Banner */}
                {loginSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-start gap-2 animate-in fade-in">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-semibold">{loginSuccess}</span>
                  </div>
                )}

                {/* Admin Identifier */}
                <div>
                  <label className="text-slate-700 font-bold block mb-1">
                    এডমিন আইডি, মোবাইল বা অফিসিয়াল ইমেইল
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="যেমন: ADM-101 অথবা 01332520826"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-slate-700 font-bold block mb-1">
                    পাসওয়ার্ড
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="পাসওয়ার্ড দিন"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      required
                    />
                  </div>
                </div>

                {/* OTP Verification (Requirement 08) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-bold">
                      মোবাইল / জিমেইল ওটিপি (OTP) কোড
                    </label>
                    <button
                      type="button"
                      onClick={() => setLoginOtp('7845')}
                      className="text-[10px] text-emerald-700 hover:underline font-bold"
                      title="ডেমো ওটিপি কোড বসান"
                    >
                      ডেমো ওটিপি: 7845
                    </button>
                  </div>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={loginOtp}
                      onChange={(e) => setLoginOtp(e.target.value)}
                      placeholder="৪ ডিজিট ওটিপি দিন (যেমন: 7845)"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      required
                    />
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-2.5 bg-[#007460] hover:bg-[#005e4e] text-white font-extrabold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isLoggingIn ? 'যাচাই করা হচ্ছে...' : 'এডমিন এক্সেস নিশ্চিত করুন'}</span>
                </button>

                {/* Fast Test Shortcuts for Reviewers */}
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block mb-1.5 uppercase tracking-wider">
                    এক ক্লিকে টেস্ট অ্যাকাউন্ট সিলেক্ট করুন:
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuickFill('ADM-101', 'admin')}
                      className="text-left p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold block">👑 মালিক / সুপার এডমিন (ADM-101)</span>
                        <span className="text-[10px] text-emerald-700">Md. Akbar Hossain · সম্পূর্ণ কন্ট্রোল</span>
                      </div>
                      <span className="text-[10px] bg-emerald-700 text-white font-bold px-2 py-0.5 rounded">সিলেক্ট</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickFill('ADM-102', 'staff')}
                      className="text-left p-2 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-950 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold block">👤 মডারেটর স্টাফ (ADM-102)</span>
                        <span className="text-[10px] text-sky-700">কায়সার আহমেদ · অনুমোদিত কর্মকর্তা</span>
                      </div>
                      <span className="text-[10px] bg-sky-700 text-white font-bold px-2 py-0.5 rounded">সিলেক্ট</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickFill('ADM-104', 'staff')}
                      className="text-left p-2 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold block">⚠️ অপেক্ষমাণ কর্মচারী (ADM-104)</span>
                        <span className="text-[10px] text-amber-800">তানভীর হাসান · মালিক কর্তৃক এখনও এপ্রুভড নয়</span>
                      </div>
                      <span className="text-[10px] bg-amber-600 text-white font-bold px-2 py-0.5 rounded">টেস্ট</span>
                    </button>
                  </div>
                </div>

              </form>
            )}

            {/* TAB 2: REGISTER (Requirements 08 & 09) */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                
                {regFeedback && (
                  <div className={`p-3 rounded-xl border flex items-start gap-2 animate-in fade-in ${
                    regFeedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}>
                    {regFeedback.type === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold block leading-relaxed">{regFeedback.message}</span>
                      {regFeedback.generatedId && (
                        <p className="text-[11px] text-emerald-700 mt-1">
                          মালিক তার কন্ট্রোল প্যানেলে এই আইডিতে এপ্রুভ বাটনে টিক দিলে আপনি লগইন করতে পারবেন।
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-slate-700 font-bold block mb-1">কর্মকর্তার নাম</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="পুরো নাম লিখুন"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">অফিসিয়াল মোবাইল</label>
                    <input
                      type="text"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">অফিসিয়াল ইমেইল</label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="staff@bikroymela.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">পদবী (Role)</label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold"
                    >
                      <option value="Moderator">বিজ্ঞাপন মডারেটর (Moderator)</option>
                      <option value="Quality Officer">কোয়ালিটি অফিসার (Quality Officer)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">ডিপার্টমেন্ট</label>
                    <input
                      type="text"
                      value={regDepartment}
                      onChange={(e) => setRegDepartment(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">লগইন পাসওয়ার্ড সেট করুন</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="পাসওয়ার্ড দিন"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-bold">ওটিপি কোড (OTP Verification)</label>
                    <span className="text-[10px] text-emerald-700 font-bold">ডেমো ওটিপি: 7845</span>
                  </div>
                  <input
                    type="text"
                    value={regOtp}
                    onChange={(e) => setRegOtp(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono tracking-widest font-bold text-slate-900"
                    required
                  />
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                  <span className="font-bold block">মালিকের এপ্রুভাল নোটিশ (Requirement 09):</span>
                  রেজিস্ট্রেশন সম্পন্ন হওয়ার পর মালিক তার কন্ট্রোল প্যানেলে আপনার আইডি দেখে অনুমোদন দিলেই কেবল আপনার লগইন কার্যকর হবে।
                </div>

                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isRegistering ? 'রেজিস্ট্রেশন হচ্ছে...' : 'কর্মচারী একাউন্ট রেজিস্ট্রেশন করুন'}</span>
                </button>

              </form>
            )}

          </div>

        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-[11px] text-slate-400 pb-2">
        {siteName} Enterprise Security Framework · Role-Based Staff Governance
      </div>

    </div>
  );
};
