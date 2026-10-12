import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, 
  X, 
  Send, 
  HelpCircle, 
  ShieldCheck, 
  Phone, 
  ExternalLink,
  ChevronRight,
  Headphones
} from 'lucide-react';

export const WhatsAppSupportWidget: React.FC = () => {
  const { lang, setActiveModal, setChatRecipient } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  const officialWhatsAppNumber = '+8801700000000';
  const displayPhone = '01700-000000 (হোয়াটসঅ্যাপ)';

  const quickIssues = [
    {
      id: 'issue_login',
      titleBn: '🔑 একাউন্ট লগইন বা পাসওয়ার্ড রিসেট সমস্যা',
      titleEn: '🔑 Login or Password Reset Help',
      msg: 'আসসালামু আলাইকুম, বিক্রয়মেলা অ্যাপে আমার একাউন্ট লগইন বা পাসওয়ার্ড সংক্রান্ত সমস্যা হচ্ছে। অনুগ্রহ করে সহায়তা করুন।'
    },
    {
      id: 'issue_bonus',
      titleBn: '🎁 ৫০ টাকা ওয়েলকাম বোনাস ও ওয়ালেট সংক্রান্ত',
      titleEn: '🎁 50 Tk Welcome Bonus & Wallet Inquiry',
      msg: 'আসসালামু আলাইকুম, বিক্রয়মেলা অ্যাপের ৫০ টাকা বোনাস ওয়ালেট ব্যালেন্স ব্যবহারের নিয়ম জানতে চাই।'
    },
    {
      id: 'issue_ad',
      titleBn: '📢 বিজ্ঞাপন পোস্ট বা ডিলিট ফি (১০ টাকা) সংক্রান্ত তথ্য',
      titleEn: '📢 Ad Posting or Deletion Fee Inquiry',
      msg: 'আসসালামু আলাইকুম, বিজ্ঞাপন প্রকাশ বা মুছে ফেলার নীতিমালা সম্পর্কে জানতে চাই।'
    },
    {
      id: 'issue_escrow',
      titleBn: '🛡️ এসক্রো পেমেন্ট ও ডেলিভারি ট্র্যাকিং সমস্যা',
      titleEn: '🛡️ Escrow Payment & Courier Delivery Help',
      msg: 'আসসালামু আলাইকুম, আমার এসক্রো পেমেন্ট ও কুরিয়ার ট্র্যাকিং নিয়ে জরুরি সাহায্য প্রয়োজন।'
    },
    {
      id: 'issue_bug',
      titleBn: '⚙️ সফটওয়্যার বা ওয়েবসাইটে ত্রুটি রিপোর্ট',
      titleEn: '⚙️ Software / Technical Issue Report',
      msg: 'আসসালামু আলাইকুম, বিক্রয়মেলা ওয়েবসাইটে একটি সফটওয়্যার ত্রুটি পেয়েছি, বিস্তারিত স্ক্রিনশট দিতে চাই।'
    }
  ];

  const handleOpenWhatsApp = (customMessage?: string) => {
    const textToSend = customMessage || (selectedIssue 
      ? quickIssues.find(q => q.id === selectedIssue)?.msg 
      : 'আসসালামু আলাইকুম, বিক্রয়মেলা (BikroyMela) সফটওয়্যার ও কাস্টমার সার্ভিস থেকে জরুরি সহায়তা প্রয়োজন।');
    
    const waUrl = `https://wa.me/8801700000000?text=${encodeURIComponent(textToSend || '')}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleOpenInAppChat = () => {
    setChatRecipient({
      id: 'support-01',
      name: lang === 'bn' ? 'বিক্রয়মেলা ২৪/৭ সাপোর্ট হেল্পডেস্ক' : 'BikroyMela 24/7 Support Desk',
      phone: '09612-888999'
    });
    setActiveModal('chat');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating WhatsApp Live Button */}
      <aside aria-label="WhatsApp Support" className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center group">
        {/* Floating Button Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-200 border-2 border-white cursor-pointer"
          aria-label="WhatsApp Support"
          title={lang === 'bn' ? 'সফটওয়্যার জনিত সমস্যায় হোয়াটসঅ্যাপে যোগাযোগ করুন' : 'Contact WhatsApp Live Support'}
        >
          {/* Pulsing Ring Indicator */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping pointer-events-none"></span>

          {/* Official WhatsApp SVG Icon */}
          <svg className="w-7 h-7 fill-current relative z-10" viewBox="0 0 24 24">
            <path d="M12.031 2C6.5 2 2 6.5 2 12.031c0 1.969.562 3.844 1.625 5.469L2 22l4.656-1.594C8.219 21.375 10.094 22 12.031 22 17.562 22 22 17.5 22 12.031 22 6.5 17.562 2 12.031 2zm0 18.25c-1.719 0-3.375-.5-4.812-1.437l-.344-.219-2.75.938.969-2.656-.25-.375c-1-1.469-1.562-3.188-1.562-5c0-4.688 3.812-8.5 8.5-8.5s8.5 3.812 8.5 8.5-3.812 8.5-8.5 8.5zm4.656-6.375c-.25-.125-1.5-.75-1.75-.812-.219-.094-.406-.125-.562.125-.188.25-.688.812-.844 1-.156.156-.312.188-.562.062-.25-.125-1.062-.375-2.031-1.25-.75-.656-1.25-1.469-1.406-1.719-.156-.25 0-.406.125-.531.094-.125.25-.312.375-.469.125-.156.156-.25.25-.438.094-.156.031-.344-.031-.469-.062-.125-.562-1.375-.781-1.875-.219-.5-.438-.438-.594-.438h-.531c-.188 0-.5.062-.75.344-.25.281-.969.938-.969 2.281 0 1.344 1 2.656 1.125 2.844.156.156 1.938 2.969 4.719 4.156.656.281 1.188.469 1.594.594.656.219 1.25.188 1.719.125.531-.094 1.5-.625 1.719-1.25.219-.594.219-1.125.156-1.25-.094-.125-.281-.188-.531-.312z"/>
          </svg>

          {/* Live Dot */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-300 border-2 border-white rounded-full"></span>
        </button>
      </aside>

      {/* Interactive WhatsApp Live Drawer / Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-6 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-200">
            
            {/* Header */}
            <div className="bg-[#007460] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-md">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 2C6.5 2 2 6.5 2 12.031c0 1.969.562 3.844 1.625 5.469L2 22l4.656-1.594C8.219 21.375 10.094 22 12.031 22 17.562 22 22 17.5 22 12.031 22 6.5 17.562 2 12.031 2zm0 18.25c-1.719 0-3.375-.5-4.812-1.437l-.344-.219-2.75.938.969-2.656-.25-.375c-1-1.469-1.562-3.188-1.562-5c0-4.688 3.812-8.5 8.5-8.5s8.5 3.812 8.5 8.5-3.812 8.5-8.5 8.5z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                    <span>বিক্রয়মেলা WhatsApp সাপোর্ট</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </h3>
                  <p className="text-[11px] text-emerald-100 flex items-center gap-1 mt-0.5">
                    <span>২৪/৭ লাইভ হেল্পলাইন: {displayPhone}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-emerald-200 hover:text-white p-1 rounded-full hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 bg-[#ece5dd]/20 space-y-3.5 max-h-[75vh] overflow-y-auto">
              {/* Agent Greeting Bubble */}
              <div className="bg-white p-3 rounded-xl shadow-xs border border-slate-200 text-xs text-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
                  <span>কাস্টমার সাপোর্ট অফিসার</span>
                  <span>অনলাইন</span>
                </div>
                <p className="leading-relaxed">
                  আসসালামু আলাইকুম! কোনো সফটওয়্যার সমস্যা, একাউন্ট বোনাস বা পণ্য কেনাবেচায় সহায়তা প্রয়োজন? নিচের বিষয়টি নির্বাচন করে সরাসরি হোয়াটসঅ্যাপে চ্যাট করুন।
                </p>
              </div>

              {/* Quick Problem Selectors */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  সমস্যার বিষয় নির্বাচন করুন:
                </span>
                
                {quickIssues.map((issue) => (
                  <button
                    key={issue.id}
                    onClick={() => {
                      setSelectedIssue(issue.id);
                      handleOpenWhatsApp(issue.msg);
                    }}
                    className="w-full text-left p-2.5 bg-white hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-400 rounded-xl text-xs text-slate-800 transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
                  >
                    <span className="font-medium pr-2">{issue.titleBn}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 shrink-0" />
                  </button>
                ))}
              </div>

              {/* Direct Actions */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <button
                  onClick={() => handleOpenWhatsApp()}
                  className="w-full py-2.5 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>সরাসরি হোয়াটসঅ্যাপে মেসেজ দিন</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </button>

                <button
                  onClick={handleOpenInAppChat}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Headphones className="w-3.5 h-3.5 text-slate-500" />
                  <span>ওয়েবসাইট লাইভ চ্যাট হেল্পডেস্ক</span>
                </button>
              </div>

              <div className="text-[10px] text-center text-slate-500">
                🛡️ গ্রাহক সুরক্ষা ও লেনদেনের নিরাপত্তায় আমাদের টিম সার্বক্ষণিক সহায়তায় প্রস্তুত।
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
