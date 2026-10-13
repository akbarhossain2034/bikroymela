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
  Wallet
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
      badge: 'কৌশল ০১ · তাত্ক্ষণিক ক্যাশ',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      titleBn: '১. সাইন-আপ ও একাউন্ট খোলার সাথে সাথে ক্যাশ বোনাস (৳ ৫০ - ৫০০)',
      titleEn: '1. Instant Signup Welcome Cash Bonus (৳ 50 - 500)',
      icon: Gift,
      iconColor: 'text-emerald-600 bg-emerald-50',
      descriptionBn: `নতুন একাউন্ট রেজিস্টার করলেই স্বয়ংক্রিয়ভাবে পাবেন ৳ ${offerSettings.signupBonusAmount || 100} টাকা ওয়েলকাম বোনাস! এই টাকা দিয়ে পণ্য কেনার সময় ডিসকাউন্ট নিতে পারবেন কিংবা বিকাশ ও নগদে সরাসরি ক্যাশ তুলে নিতে পারবেন।`,
      actionLabel: currentUser ? 'আমার ওয়ালেট ব্যালেন্স দেখুন' : 'একাউন্ট খুলুন ও ৳১০০ নিন',
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
      badge: 'কৌশল ০২ · নতুন সেলারদের জন্য',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      titleBn: '২. প্রথম বিজ্ঞাপনে ৩ দিনের ফ্রি "ফিচার্ড / বুস্ট" প্রমোশন ব্যাজ',
      titleEn: '2. Free 3-Day Featured Boost on First Ad Post',
      icon: Rocket,
      iconColor: 'text-amber-600 bg-amber-50',
      descriptionBn: 'নতুন বিক্রেতাদের দ্রুত বিক্রি ও উৎসাহ দিতে প্রথম বিজ্ঞাপনে কোনো টাকা নেওয়া হয় না। স্বয়ংক্রিয়ভাবে ৩ দিনের জন্য গোল্ডেন "ফিচার্ড" ব্যাজ দেওয়া হয় যা হোমপেজের সবার শীর্ষে থাকে।',
      actionLabel: '১ম ফ্রি বিজ্ঞাপন দিন (ফ্রি বুস্ট সহ)',
      actionHandler: () => {
        setIsOffersModalOpen(false);
        setActiveModal('postAd');
      }
    },
    {
      id: 'seller_points',
      badge: 'কৌশল ০৩ · লয়্যালটি রিওয়ার্ড',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      titleBn: '৩. সেলার রিওয়ার্ড কয়েন ও পয়েন্ট লয়্যালটি সিস্টেম',
      titleEn: '3. Seller Reward Coins & Loyalty Point Program',
      icon: Coins,
      iconColor: 'text-indigo-600 bg-indigo-50',
      descriptionBn: 'প্রতিটি সফল বিজ্ঞাপন পোস্ট, ৫-স্টার কাস্টমার রিভিউ এবং সফল লেনদেনে আপনার অ্যাকাউন্টে পয়েন্ট যোগ হবে। পরবর্তীতে এই পয়েন্ট দিয়ে বিজ্ঞাপন বুস্টিং বা ক্যাশ টাকায় রূপান্তর করা যায়।',
      actionLabel: 'রিওয়ার্ড পয়েন্ট স্টেটাস দেখুন',
      actionHandler: () => {
        setIsOffersModalOpen(false);
        if (currentUser) {
          setActiveProfileTab('reward_points');
          setActiveModal('profile');
        } else {
          setActiveModal('auth');
        }
      }
    },
    {
      id: 'free_escrow_delivery',
      badge: 'কৌশল ০৪ · ক্রেতার আস্থা অর্জন',
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
      titleBn: '৪. ১ম কেনাকাটায় ১০০% ফ্রি এসক্রো ডেলিভারি অফার',
      titleEn: '4. 100% Free Escrow Delivery on First Purchase',
      icon: Truck,
      iconColor: 'text-teal-600 bg-teal-50',
      descriptionBn: 'অনলাইন কেনাকাটায় ক্রেতার ভয় ও দ্বিধা দূর করতে প্রথম অর্ডারে কুরিয়ার ডেলিভারি চার্জ সম্পূর্ণ ফ্রি! সাথে থাকছে পণ্য হাতে পেয়ে যাচাই করার পর মূল্য ছাড়ের ১০০% মানিব্যাক গ্যারান্টি।',
      actionLabel: 'পণ্য পছন্দ করুন ও কিনুন',
      actionHandler: () => {
        setIsOffersModalOpen(false);
      }
    },
    {
      id: 'verified_trust_badge',
      badge: 'কৌশল ০৫ · বিশ্বস্ততা বৃদ্ধি',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      titleBn: '৫. ভেরিফাইড সেলার ট্রাস্ট ব্যাজ ও ফাস্ট-ট্র্যাক মার্চেন্ট',
      titleEn: '5. Verified Seller Blue Trust Badge',
      icon: ShieldCheck,
      iconColor: 'text-blue-600 bg-blue-50',
      descriptionBn: 'মোবাইল নম্বর ও জাতীয় পরিচয়পত্র (NID) ভেরিফাই করলেই প্রোফাইলে ও বিজ্ঞাপনে যুক্ত হবে অফিসিয়াল ভেরিফাইড ব্লু ট্রাস্ট টিক। এতে ক্রেতারা দ্বিগুণ দ্রুত আপনার পণ্য বিশ্বাস করে কিনবে।',
      actionLabel: 'এনআইডি ও ফোন ভেরিফাই করুন',
      actionHandler: () => {
        setIsOffersModalOpen(false);
        if (currentUser) {
          setActiveProfileTab('security_nid');
          setActiveModal('profile');
        } else {
          setActiveModal('auth');
        }
      }
    },
    {
      id: 'referral_festival',
      badge: 'কৌশল ০৬ · রেফারেল ও ক্যাম্পেইন',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
      titleBn: '৬. রেফারেল ক্যাশব্যাক (৳ ৫০) ও মেগা উৎসব ক্যাম্পেইন',
      titleEn: '6. Referral Cashback (৳ 50) & Festival Campaigns',
      icon: Sparkles,
      iconColor: 'text-rose-600 bg-rose-50',
      descriptionBn: 'আপনার বন্ধুদের প্ল্যাটফর্মে আমন্ত্রণ জানালে প্রতি সফল রেফারেলে আপনার ওয়ালেটে ৳ ৫০ টাকা সরাসরি জমা হবে! এছাড়াও ঈদ, পূজা ও নববর্ষে চলবে মেগা ডিসকাউন্ট ও গিফট ক্যাম্পেইন।',
      actionLabel: 'রেফারেল কোড কপি করুন',
      actionHandler: () => {
        setIsOffersModalOpen(false);
        if (currentUser) {
          setActiveProfileTab('referral_program');
          setActiveModal('profile');
        } else {
          setActiveModal('auth');
        }
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full text-slate-800 overflow-hidden my-auto border border-emerald-300 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#007460] via-teal-800 to-emerald-900 px-5 sm:px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 text-white shrink-0 shadow-inner">
              <Gift className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  গ্রোথ ও অফার স্পেশাল
                </span>
                <span className="text-xs text-emerald-200">৬টি প্রমাণিত অফার</span>
              </div>
              <h3 className="font-bold text-base sm:text-lg leading-tight mt-0.5">
                {lang === 'bn' ? 'মার্কেটপ্লেস ব্যবসা বড় করার ৬টি সেরা অফার ও সুবিধা' : '6 Proven Growth Offers & Promotion Strategies'}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsOffersModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current User Wallet Promo Ribbon */}
        <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-amber-950 font-medium">
            <Wallet className="w-4 h-4 text-amber-700" />
            <span>
              {currentUser 
                ? `আপনার বর্তমান ওয়ালেট ব্যালেন্স: ৳ ${(currentUser.walletBalance ?? 0).toLocaleString()} (পণ্য কিনতে বা তুলতে পারবেন)`
                : `নতুন একাউন্ট খুললেই পাবেন সরাসরি ৳ ${offerSettings.signupBonusAmount || 100} টাকা ওয়েলকাম বোনাস!`}
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
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline flex items-center gap-1"
          >
            <span>{currentUser ? 'ওয়ালেট তুলুন / ব্যবহার করুন' : 'ক্যাশ বোনাস পেতে লগইন'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Strategies Cards Grid */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategies.map((strat) => {
              const IconComp = strat.icon;
              return (
                <div 
                  key={strat.id}
                  className="p-4 bg-slate-50 hover:bg-emerald-50/40 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between shadow-2xs group"
                >
                  <div className="space-y-2">
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
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> সক্রিয় অফার
                    </span>
                    <button
                      onClick={strat.actionHandler}
                      className="px-2.5 py-1.5 bg-[#007460] hover:bg-[#005e4e] text-white rounded-md text-[11px] font-bold flex items-center gap-1 transition-all shadow-2xs"
                    >
                      <span>{strat.actionLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Business Policy Reminder Note */}
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-[11px] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-black text-rose-700 text-xs">⚠️ সতর্কতা:</span>
              <span>অবৈধ পণ্য ক্রয়-বিক্রয় সম্পূর্ণ নিষিদ্ধ। এতে কর্তৃপক্ষ কোনোভাবেই দায়ী থাকবে না।</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>এডমিন প্যানেল থেকে সকল অফারের মান ও সেটিংস পরিবর্তন করা সম্ভব।</span>
          </div>

          <button
            onClick={() => setIsOffersModalOpen(false)}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs transition-colors"
          >
            {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
