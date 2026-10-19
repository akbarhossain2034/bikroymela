import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Truck, Headphones, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { 
    lang, 
    t, 
    resetFilters, 
    setIsAdminMode, 
    setActiveModal, 
    siteName, 
    setIsPolicyModalOpen, 
    setIsOffersModalOpen,
    setPolicyModalTab 
  } = useApp();
  const clickCountRef = React.useRef(0);
  const clickTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSecretAdminClick = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      setIsAdminMode(true);
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 1500);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-20 lg:pb-12 border-t border-slate-800 text-xs">
      
      {/* 4 Trust Pillars */}
      <div className="max-w-[1720px] 2xl:max-w-[1880px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pb-10 border-b border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">
                {lang === 'bn' ? '১০০% এসক্রো সুরক্ষা' : '100% Escrow Protection'}
              </h4>
              <p className="text-slate-400 mt-1 leading-relaxed">
                {lang === 'bn' ? `পণ্য বুঝে না পাওয়া পর্যন্ত আপনার টাকা ${siteName}-এর ট্রাস্ট অ্যাকাউন্টে সুরক্ষিত।` : 'Your money stays in escrow until you safely receive and verify the item.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">
                {lang === 'bn' ? 'সারা দেশে দ্রুত ডেলিভারি' : 'Nationwide Fast Delivery'}
              </h4>
              <p className="text-slate-400 mt-1 leading-relaxed">
                {lang === 'bn' ? 'স্টেডফাস্ট ও পাঠাও এক্সপ্রেসের মাধ্যমে হোম ডেলিভারি এবং সার্বক্ষণিক ট্র্যাকিং।' : 'Integrated doorstep courier pickup with real-time tracking.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">
                {lang === 'bn' ? 'নিরাপদ পেমেন্ট গেটওয়ে' : 'Secure Payment Gateways'}
              </h4>
              <p className="text-slate-400 mt-1 leading-relaxed">
                {lang === 'bn' ? 'বিকাশ, নগদ, রকেট এবং ভিসা/মাস্টারকার্ড ডেবিট ও ক্রেডিট কার্ড সাপোর্ট।' : 'Instant payments via bKash, Nagad, Rocket and Cards.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">
                {lang === 'bn' ? '২৪/৭ গ্রাহক সহায়তা' : '24/7 Dedicated Support'}
              </h4>
              <p className="text-slate-400 mt-1 leading-relaxed">
                {lang === 'bn' ? 'কেনাবেচায় যেকোনো সহায়তার জন্য আমাদের লাইভ চ্যাট অথবা হটলাইনে যোগাযোগ করুন।' : 'Direct buyer-seller messaging & live customer support desk.'}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Links & Information */}
      <div className="max-w-[1720px] 2xl:max-w-[1880px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div>
          <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
            {lang === 'bn' ? 'সকল বিভাগ' : 'All Divisions'}
          </h5>
          <ul className="space-y-2 text-slate-400">
            <li>ঢাকা ও আশেপাশের এলাকা</li>
            <li>চট্টগ্রাম ও কক্সবাজার</li>
            <li>রাজশাহী ও বগুড়া</li>
            <li>খুলনা ও যশোর</li>
            <li>সিলেট ও মৌলভীবাজার</li>
            <li>বরিশাল ও কুয়াকাটা</li>
            <li>রংপুর ও দিনাজপুর</li>
            <li>ময়মনসিংহ ও জামালপুর</li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
            {lang === 'bn' ? 'জনপ্রিয় ক্যাটাগরি' : 'Top Categories'}
          </h5>
          <ul className="space-y-2 text-slate-400">
            <li>মোবাইল ও গ্যাজেট</li>
            <li>ইলেকট্রনিক্স ও ল্যাপটপ</li>
            <li>মোটরবাইক ও যানবাহন</li>
            <li>প্রোপার্টি (জমি, বাড়ি, দোকান, ফ্ল্যাট)</li>
            <li>হোম ও লিভিং</li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
            {lang === 'bn' ? 'সহায়তা ও নিরাপত্তা' : 'Help & Safety'}
          </h5>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button 
                onClick={() => { setPolicyModalTab('safety'); setIsPolicyModalOpen(true); }} 
                className="hover:text-rose-400 transition-colors text-left cursor-pointer"
              >
                আইনি দায়মুক্তি ও নিরাপত্তা গাইড
              </button>
            </li>
            <li>
              <button 
                onClick={() => setIsOffersModalOpen(true)} 
                className="hover:text-amber-400 transition-colors text-left cursor-pointer"
              >
                🎁 অফার ও ওয়েলকাম বোনাস শর্তাবলী
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setPolicyModalTab('payment'); setIsPolicyModalOpen(true); }} 
                className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
              >
                এসক্রো রিফান্ড পলিসি (১০০% সুরক্ষা)
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setPolicyModalTab('moderation'); setIsPolicyModalOpen(true); }} 
                className="hover:text-amber-300 transition-colors text-left cursor-pointer"
              >
                ৩ মাস অবিক্রিত পণ্যের মেয়াদোত্তীর্ণ পলিসি
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
            {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
          </h5>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button 
                onClick={() => { setPolicyModalTab('all'); setIsPolicyModalOpen(true); }} 
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                বিজনেস পলিসি ও শর্তাবলী
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setPolicyModalTab('about'); setIsPolicyModalOpen(true); }} 
                className="hover:text-white transition-colors text-left cursor-pointer font-medium text-emerald-300"
              >
                আমাদের লক্ষ্য ও পরিচিতি (About Us)
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setPolicyModalTab('support'); setIsPolicyModalOpen(true); }} 
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                ২৪/৭ কাস্টমার হেল্পডেস্ক
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setPolicyModalTab('legal'); setIsPolicyModalOpen(true); }} 
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                গোপনীয়তা নীতি (Privacy Policy)
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div 
        onClick={handleSecretAdminClick}
        className="max-w-[1720px] 2xl:max-w-[1880px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-6 border-t border-slate-800 text-center text-slate-500 text-[11px] cursor-default select-none"
        title=""
      >
        © 2026 {siteName}. সর্বস্বত্ব সংরক্ষিত। বাংলাদেশের অগ্রণী অনলাইন ক্লাসিফাইডস ও ইকমার্স প্ল্যাটফর্ম।
      </div>

    </footer>
  );
};
