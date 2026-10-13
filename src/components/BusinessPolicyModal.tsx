import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  Ban, 
  Lock, 
  FileCheck, 
  PhoneCall, 
  Scale, 
  Clock, 
  Wallet, 
  Search, 
  UserX, 
  HelpCircle,
  FileText,
  BadgeAlert,
  Sparkles,
  ExternalLink,
  Store,
  Users,
  Eye,
  MapPin,
  Compass,
  HeartHandshake
} from 'lucide-react';

export const BusinessPolicyModal: React.FC = () => {
  const { 
    lang, 
    isPolicyModalOpen, 
    setIsPolicyModalOpen, 
    siteName, 
    setIsOffersModalOpen,
    policyModalTab,
    setPolicyModalTab 
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>(policyModalTab || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync internal activeTab whenever policyModalTab changes externally
  useEffect(() => {
    if (policyModalTab) {
      setActiveTab(policyModalTab);
    }
  }, [policyModalTab]);

  if (!isPolicyModalOpen) return null;

  const policySections = [
    {
      id: 'about',
      category: 'about',
      titleBn: '১. আমাদের লক্ষ্য ও পরিচিতি — হাট-বাজারের মতো উন্মুক্ত কেনাবেচার মাধ্যম (About Us & Mission)',
      titleEn: '1. Our Mission & Identity — Open Marketplace (Haat-Bazaar Concept)',
      icon: Store,
      color: 'emerald',
      isHighlight: true,
      pointsBn: [
        `এটি শুধুমাত্র একটি ক্রয়-বিক্রয়ের অনলাইন মাধ্যম মাত্র। আমাদের মূল লক্ষ্য ক্রেতা ও বিক্রেতার মধ্যে সরাসরি যোগাযোগ স্থাপন করা— যাতে তারা নতুন ও পুরাতন পণ্য সহজে ও দ্রুত কেনাবেচা করতে পারে।`,
        'হাট-বাজারের মতো উন্মুক্ত প্ল্যাটফর্ম: ক্রেতা পণ্য ক্রয় করতে এবং বিক্রেতা পণ্য বিক্রি করতে যেমন চিরাচরিত হাটে যান, ঠিক তেমনই আমাদের এই প্ল্যাটফর্মটি একটি আধুনিক ডিজিটাল হাট-বাজার।',
        'আমাদের লক্ষ্য বাংলাদেশের প্রতিটি জেলা, উপজেলা ও গ্রামের প্রান্তিক মানুষ যেন মধ্যস্বত্বভোগী বা দালালের অতিরিক্ত কমিশন ছাড়াই নিজেদের পছন্দের সামগ্রী ন্যায্যমূল্যে বেচাকেনা করতে পারে।',
        'আমরা কোনো পণ্যের পাইকারি মজুতদার বা প্রত্যক্ষ বিক্রেতা নই; আমরা কেবল ক্রেতা-বিক্রেতার নির্ভরযোগ্য মিলনবিন্দু (Connecting Bridge) হিসেবে কাজ করি।'
      ]
    },
    {
      id: 'safety',
      category: 'safety',
      titleBn: '২. লোকসমাগম স্থানে লেনদেন ও স্ব-দায়িত্বের কড়া নীতিমালা (Public Meetup & Self-Responsibility)',
      titleEn: '2. Meeting in Public Places & Buyer Self-Responsibility',
      icon: Users,
      color: 'amber',
      isHighlight: true,
      pointsBn: [
        'লোকসমাগম স্থানে টাকা পয়সা লেনদেন করুন: যেকোনো মুখোমুখি (Face-to-face) কেনাবেচায় সবসময় শপিংমল, মার্কেট, বাস টার্মিনাল বা দিনের আলোতে ব্যস্ত লোকবহুল স্থান নির্বাচন করুন। কোনো নির্জন, অপরিচিত বা ঝুঁকিপূর্ণ স্থানে গিয়ে লেনদেন সম্পূর্ণ নিষিদ্ধ।',
        'নিজ দায়িত্বে দেখে, বুঝে ও শুনে পণ্য ক্রয়-বিক্রয় করুন: কেনার পূর্বে পণ্যের আসল রূপ, বাহ্যিক অবস্থা, কার্যক্ষমতা, মেমোরি/ব্যাটারি ও কাগজপত্র নিজ চোখে ভালো করে যাচাই করে নিন।',
        'আইনি স্পষ্টীকরণ: নিজ দায়িত্বে পণ্য ক্রয়-বিক্রয় করে কোনো ব্যবহারকারী প্রতারিত হলে কর্তৃপক্ষ কোনোভাবেই এর জন্য দায়ী থাকবে না।',
        'অগ্রিম টাকা পাঠানো নিষেধ: হাতে পণ্য পাওয়ার পূর্বে কোনো অপরিচিত ব্যক্তিকে ব্যক্তিগত বিকাশ, নগদ বা রকেটে অগ্রিম কোনো টাকা পাঠাবেন না। ব্যক্তিগত অগ্রিম পেমেন্টের কোনো ক্ষতিপূরণ কর্তৃপক্ষ দেবে না।'
      ]
    },
    {
      id: 'liability',
      category: 'legal',
      titleBn: '৩. প্ল্যাটফর্মের ভূমিকা ও আইনি দায়মুক্তি ঘোষণা (Limitation of Liability)',
      titleEn: '3. Platform Limitation of Liability & Legal Disclaimer',
      icon: Scale,
      color: 'rose',
      pointsBn: [
        `${siteName} একটি ক্লাসিফাইড বিজ্ঞাপন ও এসক্রো ট্রাস্ট প্ল্যাটফর্ম। প্ল্যাটফর্মটি কেবল প্রযুক্তিগত সেবা প্রদান করে থাকে।`,
        'কোনো বিক্রেতা তার পণ্যের বিষয়ে কোনো মিথ্যা আশ্বাস দিলে বা ত্রুটি গোপন করলে তার সম্পূর্ণ দায় সংশ্লিষ্ট বিক্রেতার।',
        'প্ল্যাটফর্মের মাধ্যমে সংঘটিত যেকোনো লেনদেনে উভয় পক্ষকে দেশীয় আইন, ভোক্তা অধিকার ও সততা বজায় রাখার অনুরোধ করা হচ্ছে।'
      ]
    },
    {
      id: 'prohibited',
      category: 'safety',
      titleBn: '৪. অবৈধ ও নিষিদ্ধ পণ্যের পূর্ণাঙ্গ তালিকা (Strictly Prohibited Items)',
      titleEn: '4. Strictly Prohibited & Illegal Items',
      icon: Ban,
      color: 'red',
      pointsBn: [
        'অস্ত্র, গোলাবারুদ, বিস্ফোরক, ধারালো দেশীয় অস্ত্র ও পটকা/আতশবাজি প্রদর্শন বা বিক্রি সম্পূর্ণরূপে নিষিদ্ধ।',
        'মাদকদ্রব্য, অ্যালকোহল, সিগারেট, ক্ষতিকর রাসায়নিক বা লাইসেন্সহীন ওষুধ।',
        'চোরাই পণ্য, চোরাচালানের সামগ্রী, জাল টাকা বা জাল কাগজপত্র/সার্টিফিকেট।',
        'অনুমোদনহীন আর্থিক স্কিম, এমএলএম (MLM), পিরামিড স্কিম, জুয়া বা লটারি কার্যক্রম।',
        'বন্যপ্রাণী ও পরিবেশ আইনের পরিপন্থী পাখি, বুনো পশু বা বিপন্ন প্রাণীর অংশবিশেষ।',
        'আইনশৃঙ্খলা রক্ষাকারী বাহিনীর চাহিদা মোতাবেক অবৈধ কার্যকলাপে জড়িত যে কারো আইপি, ফোন নম্বর ও তথ্য তাৎক্ষণিক সরবরাহ করা হবে।'
      ]
    },
    {
      id: 'expiry',
      category: 'moderation',
      titleBn: '৫. ৩ মাস (৯০ দিন) পর বিজ্ঞাপন অটো-ডিলিট পলিসি (Ad Expiry Policy)',
      titleEn: '5. 3 Months Ad Expiry & Auto-Deletion Policy',
      icon: Clock,
      color: 'amber',
      pointsBn: [
        'বিজ্ঞাপনের প্রাথমিক মেয়াদ সর্বোচ্চ ৯০ দিন (৩ মাস)।',
        '৩ মাস অতিক্রান্ত হওয়ার পর পণ্য বিক্রি না হলে প্ল্যাটফর্ম ডাটাবেজ ফ্রেশ রাখতে বিজ্ঞাপনটি স্বয়ংক্রিয়ভাবে মুছে ফেলা হয়।',
        'কোনো বিজ্ঞাপনে ভুল বা বিভ্রান্তিকর তথ্য পাওয়া গেলে অ্যাডমিন যেকোনো সময় সুনির্দিষ্ট কারণ উল্লেখ করে তা তাৎক্ষণিক ডিলিট করার পূর্ণ অধিকার সংরক্ষণ করেন।'
      ]
    },
    {
      id: 'payment',
      category: 'payment',
      titleBn: '৬. এসক্রো ও পেমেন্ট নিরাপত্তা নীতিমালা (Escrow & Safe Payment)',
      titleEn: '6. Escrow System & Payment Security',
      icon: Lock,
      color: 'emerald',
      pointsBn: [
        'নিরাপদ কেনাবেচার স্বার্থে সবসময় প্ল্যাটফর্মের এসক্রো (Escrow) গেটওয়ে ব্যবহার করার পরামর্শ দেওয়া হয়।',
        'এসক্রো পেমেন্টে ক্রেতার টাকা নিরাপদ ভল্টে জমা থাকে; ক্রেতা পণ্য হাতে পেয়ে সঠিকতা যাচাই করে সন্তুষ্ট হলেই কেবল বিক্রেতার একাউন্টে টাকা ছাড় করা হয় (১০০% মানিব্যাক সুরক্ষা)।',
        'প্ল্যাটফর্মের বাইরে সরাসরি কোনো ঝুঁকি নিয়ে ক্যাশ পাঠিয়ে প্রতারিত হলে কোনো দায় কর্তৃপক্ষ নেবে না।'
      ]
    },
    {
      id: 'bonus',
      category: 'bonus',
      titleBn: '৭. ওয়েলকাম বোনাস, রেফারেল ও অফার নীতিমালা (Bonus & Promotional Terms)',
      titleEn: '7. Welcome Bonus & Promotional Campaign Policy',
      icon: Wallet,
      color: 'amber',
      pointsBn: [
        'নতুন একাউন্ট খোলার সাথে সাথে ওয়ালেটে দেওয়া ক্যাশ বোনাস (৳ ৫০ - ৫০০) একজন ব্যবহারকারী কেবল একবারই তার আসল মোবাইল নম্বর দিয়ে পাবেন।',
        'এই বোনাস টাকা দিয়ে প্ল্যাটফর্মে পণ্য কেনাকাটায় ডিসকাউন্ট নেওয়া যাবে অথবা অ্যাডমিনের শর্ত সাপেক্ষে বিকাশ/নগদে ক্যাশ উত্তোলন করা যাবে।',
        'কোনো অসদুপায় বা ডুপ্লিকেট একাউন্ট বানিয়ে বোনাস অপব্যবহারের চেষ্টা করা হলে সংশ্লিষ্ট একাউন্ট ব্লক ও ব্যালেন্স বাজেয়াপ্ত করা হবে।'
      ]
    },
    {
      id: 'support',
      category: 'support',
      titleBn: '৮. বিরোধ নিষ্পত্তি ও ২৪/৭ হেল্পডেস্ক (Dispute Resolution & Support)',
      titleEn: '8. Dispute Resolution & Customer Support',
      icon: HelpCircle,
      color: 'indigo',
      pointsBn: [
        'এসক্রো অর্ডারে পণ্য বিবরণের সাথে না মিললে বা ত্রুটিপূর্ণ হলে পণ্য গ্রহণের সর্বোচ্চ ৪৮ ঘণ্টার মধ্যে হেল্পডেস্কে ক্লেইম করতে হবে।',
        'আমাদের নিরপেক্ষ সাপোর্ট টিম প্রমাণপত্র (ছবি, আনবক্সিং ভিডিও ও চ্যাট হিস্টোরি) যাচাই করে রিফান্ড বা সমাধান প্রদান করবে।'
      ]
    }
  ];

  const filteredSections = policySections.filter(sec => {
    const matchesTab = activeTab === 'all' || sec.category === activeTab || sec.id === activeTab;
    if (!matchesTab) return false;
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const titleMatch = sec.titleBn.toLowerCase().includes(query) || sec.titleEn.toLowerCase().includes(query);
    const pointMatch = sec.pointsBn.some(p => p.toLowerCase().includes(query));
    return titleMatch || pointMatch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full text-slate-800 overflow-hidden my-auto border border-emerald-300 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 px-5 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-300 shrink-0">
              <Store className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight flex items-center gap-2">
                <span>{siteName} – পলিসি, শর্তাবলী ও আমাদের লক্ষ্য</span>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-mono">
                  ডিজিটাল হাট-বাজার
                </span>
              </h3>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                {lang === 'bn' ? 'অনলাইন উন্মুক্ত হাট-বাজার — ক্রেতা ও বিক্রেতার নিরাপদ সেতুবন্ধন' : 'Open digital marketplace connecting buyers and sellers safely'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPolicyModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Quick Category Filters */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 shrink-0 space-y-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পলিসি খুঁজুন (যেমন: হাট-বাজার, লোকসমাগম স্থান, নিজ দায়িত্ব, এসক্রো, নিষিদ্ধ পণ্য)..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-0.5">
            {[
              { id: 'all', label: 'সকল ধারা (All)' },
              { id: 'about', label: '🏪 আমাদের লক্ষ্য ও পরিচিতি' },
              { id: 'safety', label: '👥 লোকসমাগম স্থান ও সতর্কতা' },
              { id: 'legal', label: '⚖️ আইনি দায়মুক্তি' },
              { id: 'payment', label: '🔒 এসক্রো ও পেমেন্ট' },
              { id: 'moderation', label: '⏳ ৩ মাসের অটো-ডিলিট' },
              { id: 'bonus', label: '🎁 বোনাস ও অফার' },
              { id: 'support', label: '📞 হেল্পডেস্ক' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setPolicyModalTab(tab.id);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#007460] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto text-xs leading-relaxed max-h-[65vh]">
          
          {/* Main User Directive 1: Core Haat-Bazaar Mission Box */}
          <div className="p-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 border-2 border-emerald-400 rounded-xl shadow-xs space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 font-bold text-sm mt-0.5 shadow-xs">
                🏪
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-emerald-950 text-xs sm:text-sm tracking-wide">
                  আমাদের লক্ষ্য ও মূল উদ্দেশ্য: "হাট-বাজারের মতো উন্মুক্ত কেনাবেচার প্ল্যাটফর্ম"
                </h4>
                <p className="text-slate-800 font-semibold leading-relaxed text-xs sm:text-[13px]">
                  "এটি শুধুমাত্র একটি ক্রয়-বিক্রয়ের অনলাইন মাধ্যম মাত্র। আমাদের মূল লক্ষ্য ক্রেতা ও বিক্রেতার মধ্যে সরাসরি যোগাযোগ স্থাপন করা— যাতে তারা নতুন ও পুরাতন পণ্য সহজে ও ন্যায্যমূল্যে কেনাবেচা করতে পারে। <span className="text-emerald-800 font-bold">যেমন সনাতন হাট-বাজারে ক্রেতা কিনতে এবং বিক্রেতা বিক্রি করতে সমবেত হন</span>, আমাদের প্ল্যাটফর্মটি ঠিক তেমনই একটি ডিজিটাল হাট-বাজার।"
                </p>
              </div>
            </div>
          </div>

          {/* Main User Directive 2: Public Places & Self-Responsibility Warning */}
          <div className="p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-2 border-amber-400 rounded-xl shadow-xs space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 font-bold text-sm mt-0.5 shadow-xs">
                ⚠️
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-amber-950 text-xs sm:text-sm tracking-wide">
                  ব্যক্তিগত নিরাপত্তা ও দায়মুক্তি নির্দেশনা:
                </h4>
                <p className="text-slate-900 font-bold leading-relaxed text-xs sm:text-[13px]">
                  "লোক সমাগম স্থানে টাকা পয়সা ও পণ্যের লেনদেন করুন। নিজ দায়িত্বে দেখে, বুঝে ও শুনে পণ্য ক্রয়-বিক্রয় করুন। <span className="text-rose-700 underline font-black">নিজ দায়িত্বে পণ্য ক্রয়-বিক্রয় করে কোনো প্রকার প্রতারিত হলে কর্তৃপক্ষ কোনোভাবেই দায়ী থাকবে না।</span>"
                </p>
              </div>
            </div>
          </div>

          {/* Structured Policy Sections */}
          <div className="space-y-4">
            {filteredSections.map((sec) => {
              const IconComp = sec.icon;
              return (
                <div 
                  key={sec.id} 
                  className={`p-4 rounded-xl space-y-2.5 shadow-2xs border transition-colors ${
                    sec.isHighlight 
                      ? 'bg-emerald-50/50 border-emerald-300' 
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs shrink-0">
                      <IconComp className="w-4 h-4 text-[#007460]" />
                    </div>
                    <h5 className="font-bold text-slate-900 text-xs sm:text-[13px]">
                      {sec.titleBn}
                    </h5>
                  </div>

                  <ul className="space-y-1.5 text-slate-700 text-xs pl-2">
                    {sec.pointsBn.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-700 font-bold mt-0.5 shrink-0">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {filteredSections.length === 0 && (
              <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-xs font-semibold">আপনার অনুসন্ধানের সাথে মিল রেখে কোনো পলিসি পাওয়া যায়নি।</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveTab('all'); }}
                  className="mt-2 text-xs text-emerald-700 font-bold underline"
                >
                  সব পলিসি দেখুন
                </button>
              </div>
            )}
          </div>

          {/* Trust & Safe Trading Reminder */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-emerald-950 font-bold">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>নিরাপদ থাকতে সবসময় এসক্রো (Escrow) ব্যবহার করুন — ১০০% মানিব্যাক গ্যারান্টি।</span>
            </div>

            <button
              onClick={() => {
                setIsPolicyModalOpen(false);
                setIsOffersModalOpen(true);
              }}
              className="px-3 py-1.5 bg-[#007460] hover:bg-[#005a4b] text-white rounded-lg font-bold text-xs shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>৬টি আকর্ষণীয় গ্রোথ অফার দেখুন</span>
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span>আইনি ও সাপোর্ট হেল্পডেস্ক: <b>০৯৬১২-৮৮৮৯৯৯</b> (support@bikroymela.com)</span>
          </div>
          
          <button
            type="button"
            onClick={() => setIsPolicyModalOpen(false)}
            className="w-full sm:w-auto px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs transition-colors shadow-xs cursor-pointer"
          >
            {lang === 'bn' ? 'আমি বুঝতে পেরেছি ও সম্মত' : 'I Understand & Agree'}
          </button>
        </div>

      </div>
    </div>
  );
};
