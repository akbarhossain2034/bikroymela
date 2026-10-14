import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Gift, 
  Rocket, 
  Coins, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  Wallet,
  Award
} from 'lucide-react';

export const OffersShowcaseModal: React.FC = () => {
  const { 
    lang, 
    isOffersModalOpen, 
    setIsOffersModalOpen, 
    offerSettings, 
    setActiveModal, 
    currentUser, 
    setActiveProfileTab 
  } = useApp();

  if (!isOffersModalOpen) return null;

  const strategies = [
    {
      id: 'signup_bonus',
      badge: 'সুযোগ ০১ · ওয়েলকাম ক্যাশ ও পয়েন্ট',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      titleBn: '১. একাউন্ট খুলেই সাথে সাথে ক্যাশ বোনাস ও ১০০ পয়েন্ট লাভ',
      titleEn: '1. Instant Signup Welcome Cash Bonus & 100 Reward Points',
      icon: Gift,
      iconColor: 'text-emerald-600 bg-emerald-50',
      descriptionBn: `নতুন একাউন্ট রেজিস্টার করলেই আপনার ওয়ালেটে স্বয়ংক্রিয়ভাবে জমা হবে ৳ ${offerSettings.signupBonusAmount || 100} টাকা ক্যাশ ও ১০০ রিওয়ার্ড পয়েন্ট! এই টাকা দিয়ে পণ্য কেনার সময় ডিসকাউন্ট নিতে পারবেন কিংবা বিকাশ ও নগদে সরাসরি ক্যাশ তুলে নিতে পারবেন।`,
      actionLabel: currentUser ? 'আমার পয়েন্ট ও ওয়ালেট ব্যালেন্স দেখুন' : 'একাউন্ট খুলুন ও ১০০ পয়েন্ট নিন',
      actionHandler: () => {
        setIsOffersModalOpen(false);
        if (currentUser) {
          setActiveProfileTab('wallet');
          setActiveModal('profile');
        } else {
          setActiveModal('auth');
        }
      }
    },
    {
      id: 'first_ad_boost',
      badge: 'সুযোগ ০২ · নতুন বিক্রেতাদের ফ্রি বুস্ট',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      titleBn: '২. ১ম বিজ্ঞাপনে ৩ দিনের ফ্রি "ফিচার্ড / বুস্ট" প্রমোশন সুবিধা',
      titleEn: '2. Free 3-Day Featured Boost on Your First Ad Post',
      icon: Rocket,
      iconColor: 'text-amber-600 bg-amber-50',
      descriptionBn: 'নতুন বিক্রেতাদের দ্রুত বিক্রি নিশ্চিতে ১ম বিজ্ঞাপনে কোনো প্রকার বুস্টিং ফি নেওয়া হয় না। সাইটের হোমপেজের সবার শীর্ষে ৩ দিনের জন্য গোল্ডেন "ফিচার্ড" ব্যাজ দেওয়া হয় যা ক্রেতাদের চোখে ৩ গুণ দ্রুত পড়ে।',
      actionLabel: '১ম বিজ্ঞাপন দিন (ফ্রি বুস্ট সহ)',
      actionHandler: () => {
        setIsOffersModalOpen(false);
        setActiveModal('postAd');
      }
    },
    {
      id: 'seller_points',
      badge: 'সুযোগ ০৩ · অ্যাক্টিভ আর্নিং ও পয়েন্ট',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      titleBn: '৩. ডেইলি চেক-ইন, বিজ্ঞাপন ও রিভিউতে আনলিমিটেড পয়েন্ট অর্জন',
      titleEn: '3. Earn Reward Points on Daily Check-ins, Ads & Reviews',
      icon: Coins,
      iconColor: 'text-indigo-600 bg-indigo-50',
      descriptionBn: 'প্রতিদিন প্ল্যাটফর্মে ভিজিট করলেই দৈনিক চেক-ইন বোনাস! প্রতিটি বিজ্ঞাপন পোস্টে ১৫ পয়েন্ট এবং সফল কেনাবেচায় ২৫ পয়েন্ট জমা হবে। জমানো পয়েন্ট দিয়ে শপিং ডিসকাউন্ট বা ফ্রি বুস্টিং স্লট নিতে পারবেন।',
      actionLabel: 'রিওয়ার্ড পয়েন্টের ব্যালেন্স দেখুন',
      actionHandler: () => {
        setIsOffersModalOpen(false);
        if (currentUser) {
          setActiveProfileTab('wallet');
          setActiveModal('profile');
        } else {
          setActiveModal('auth');
        }
      }
    },
    {
      id: 'free_escrow_delivery',
      badge: 'সুযোগ ০৪ · ক্রেতার স্পেশাল ভাউচার',
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
      titleBn: '৪. ১ম অর্ডারে ১০০% ফ্রি কুরিয়ার ডেলিভারি চার্জ ভাউচার',
      titleEn: '4. 100% Free Courier Delivery Voucher on First Order',
      icon: Truck,
      iconColor: 'text-teal-600 bg-teal-50',
      descriptionBn: 'প্রথম কেনাকাটায় কোনো ডেলিভারি ফি লাগবে না— সম্পূর্ণ ফ্রি হোম ডেলিভারি! সাথে এসক্রো পেমেন্ট নিরাপত্তা, যাতে পণ্য হাতে পেয়ে মনের মতো হলে তবেই বিক্রেতা টাকা পাবেন।',
      actionLabel: 'পণ্য পছন্দ করুন ও অর্ডার করুন',
      actionHandler: () => {
        setIsOffersModalOpen(false);
      }
    },
    {
      id: 'verified_trust_badge',
      badge: 'সুযোগ ০৫ · প্রোফাইল সিকিউরিটি',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      titleBn: '৫. ভেরিফাইড মেম্বার ব্লু ব্যাজ ও ১০০% মানিব্যাক সুরক্ষা',
      titleEn: '5. Official Verified Member Blue Badge & Escrow Protection',
      icon: ShieldCheck,
      iconColor: 'text-blue-600 bg-blue-50',
      descriptionBn: 'ফোন নম্বর ও এনআইডি ভেরিফাই করলেই আপনার একাউন্ট ও পণ্যে যুক্ত হবে বিশ্বস্ত ভেরিফাইড ব্যাজ। বিশ্বস্ত সেলারদের পণ্য ক্রেতারা সবার আগে কেনে এবং কোনো ঝুঁকি থাকে না।',
      actionLabel: 'একাউন্ট ভেরিফাই করুন',
      actionHandler: () => {
        setIsOffersModalOpen(false);
        if (currentUser) {
          setActiveProfileTab('profile');
          setActiveModal('profile');
        } else {
          setActiveModal('auth');
        }
      }
    },
    {
      id: 'referral_festival',
      badge: 'সুযোগ ০৬ · রেফার ও ক্যাশ আয়',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
      titleBn: '৬. বন্ধু রেফার করলেই উভয়ের একাউন্টে ক্যাশ টাকা ও পয়েন্ট বোনাস',
      titleEn: '6. Refer Friends & Earn Cash Bonus + Points on Every Invite',
      icon: Sparkles,
      iconColor: 'text-rose-600 bg-rose-50',
      descriptionBn: 'আপনার ব্যক্তিগত রেফারেল লিংক বা কোড দিয়ে পরিচিতদের আমন্ত্রণ জানান। বন্ধু একাউন্ট খুললেই আপনার ওয়ালেটে ৫০ টাকা ও ৫০ পয়েন্ট এবং বন্ধুর ওয়ালেটেও ১০০ টাকা ক্যাশ স্বয়ংক্রিয়ভাবে জমা হবে!',
      actionLabel: 'রেফারেল লিংক ও কোড নিন',
      actionHandler: () => {
        setIsOffersModalOpen(false);
        if (currentUser) {
          setActiveProfileTab('profile');
          setActiveModal('profile');
        } else {
          setActiveModal('auth');
        }
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full text-slate-800 overflow-hidden my-auto border border-emerald-300 max-h-[94vh] flex flex-col">
        
        {/* Header - Customer Centric */}
        <div className="bg-gradient-to-r from-[#007460] via-teal-800 to-emerald-900 px-4 sm:px-6 py-4 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 text-white shrink-0 shadow-inner">
              <Gift className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  রিওয়ার্ড ও স্পেশাল প্রিভিলেজ
                </span>
                <span className="text-xs text-emerald-200">৬টি দারুণ সুযোগ</span>
              </div>
              <h3 className="font-bold text-sm sm:text-lg leading-tight mt-0.5">
                {lang === 'bn' ? '🎁 দ্রুত পয়েন্ট অর্জন, ক্যাশ বোনাস ও বিশেষ সুবিধা পাওয়ার ৬টি সেরা উপায়' : '6 Best Ways to Earn Reward Points, Cash Bonus & Special Benefits'}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsOffersModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current User Wallet Promo Ribbon */}
        <div className="bg-amber-50 px-4 sm:px-5 py-2.5 border-b border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-amber-950 font-medium">
            <Wallet className="w-4 h-4 text-amber-700" />
            <span>
              {currentUser 
                ? `আপনার ব্যালেন্স: ৳ ${(currentUser.walletBalance ?? 0).toLocaleString()} · পয়েন্ট: ${(currentUser.rewardPoints ?? 0)} Pts`
                : `নতুন একাউন্ট খুললেই সরাসরি পাবেন ৳ ${offerSettings.signupBonusAmount || 100} ক্যাশ ও ১০০ রিওয়ার্ড পয়েন্ট!`}
            </span>
          </div>
          <button
            onClick={() => {
              setIsOffersModalOpen(false);
              if (currentUser) {
                setActiveProfileTab('wallet');
                setActiveModal('profile');
              } else {
                setActiveModal('auth');
              }
            }}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{currentUser ? 'পয়েন্ট ও ওয়ালেট দেখুন ➔' : 'ক্যাশ বোনাস পেতে একাউন্ট খুলুন ➔'}</span>
          </button>
        </div>

        {/* Strategies Cards Grid */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {strategies.map((strat) => {
              const IconComp = strat.icon;
              return (
                <div 
                  key={strat.id}
                  className="p-3.5 sm:p-4 bg-slate-50 hover:bg-emerald-50/40 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between shadow-2xs group"
                >
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${strat.badgeColor}`}>
                        {strat.badge}
                      </span>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${strat.iconColor}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs sm:text-[13px] leading-snug group-hover:text-[#007460] transition-colors">
                      {strat.titleBn}
                    </h4>

                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {strat.descriptionBn}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-200/80 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> সক্রিয় সুবিধা
                    </span>
                    <button
                      onClick={strat.actionHandler}
                      className="px-2.5 py-1.5 bg-[#007460] hover:bg-[#005e4e] text-white rounded-md text-[11px] font-bold flex items-center gap-1 transition-all shadow-2xs cursor-pointer active:scale-95"
                    >
                      <span>{strat.actionLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Safe trading reminder */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 text-[11px] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>নিরাপদ এসক্রো ও ভেরিফাইড লেনদেনে পয়েন্ট দ্বিগুণ গতিতে বৃদ্ধি পায়।</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              ১০০% সুরক্ষিত
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>জমানো পয়েন্ট দিয়ে যে কোনো বিজ্ঞাপনে ফ্রি বুস্টিং ও ডিসকাউন্ট ভাউচার নেওয়া যায়।</span>
          </div>

          <button
            onClick={() => setIsOffersModalOpen(false)}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
          >
            {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
