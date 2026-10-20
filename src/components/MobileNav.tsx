import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Search, PlusCircle, MessageSquare, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { 
    t, 
    currentUser, 
    setActiveModal, 
    setChatRecipient, 
    isAdminMode, 
    setIsAdminMode,
    resetFilters 
  } = useApp();

  return (
    <nav 
      aria-label="Bottom Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] py-1.5 px-3"
    >
      <div className="max-w-xl mx-auto flex items-center justify-around">
        {/* 1. Buy / Home */}
        <button
          onClick={() => { resetFilters(); setIsAdminMode(false); }}
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-[#007460] transition-colors py-1 px-2 rounded-lg hover:bg-slate-50 cursor-pointer"
          title="হোম ও ক্রয় করুন"
        >
          <Home className="w-5 h-5 text-emerald-700" />
          <span className="text-[10px] font-bold leading-none text-slate-800">হোম / ক্রয়</span>
        </button>

        {/* 2. WhatsApp Direct Live Chat */}
        <button
          onClick={() => {
            const waUrl = 'https://wa.me/8801700000000?text=' + encodeURIComponent('আসসালামু আলাইকুম, বিক্রয়মেলা (BikroyMela) থেকে জরুরি সহায়তা প্রয়োজন।');
            window.open(waUrl, '_blank', 'noopener,noreferrer');
          }}
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-emerald-700 py-1 px-2 rounded-lg cursor-pointer group"
          title="হোয়াটসঅ্যাপ আলাপ"
        >
          <div className="relative">
            <svg className="w-5 h-5 fill-[#25D366]" viewBox="0 0 24 24">
              <path d="M12.031 2C6.5 2 2 6.5 2 12.031c0 1.969.562 3.844 1.625 5.469L2 22l4.656-1.594C8.219 21.375 10.094 22 12.031 22 17.562 22 22 17.5 22 12.031 22 6.5 17.562 2 12.031 2zm0 18.25c-1.719 0-3.375-.5-4.812-1.437l-.344-.219-2.75.938.969-2.656-.25-.375c-1-1.469-1.562-3.188-1.562-5c0-4.688 3.812-8.5 8.5-8.5s8.5 3.812 8.5 8.5-3.812 8.5-8.5 8.5zm4.656-6.375c-.25-.125-1.5-.75-1.75-.812-.219-.094-.406-.125-.562.125-.188.25-.688.812-.844 1-.156.156-.312.188-.562.062-.25-.125-1.062-.375-2.031-1.25-.75-.656-1.25-1.469-1.406-1.719-.156-.25 0-.406.125-.531.094-.125.25-.312.375-.469.125-.156.156-.25.25-.438.094-.156.031-.344-.031-.469-.062-.125-.562-1.375-.781-1.875-.219-.5-.438-.438-.594-.438h-.531c-.188 0-.5.062-.75.344-.25.281-.969.938-.969 2.281 0 1.344 1 2.656 1.125 2.844.156.156 1.938 2.969 4.719 4.156.656.281 1.188.469 1.594.594.656.219 1.25.188 1.719.125.531-.094 1.5-.625 1.719-1.25.219-.594.219-1.125.156-1.25-.094-.125-.281-.188-.531-.312z"/>
            </svg>
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          </div>
          <span className="text-[10px] font-bold leading-none text-emerald-800">হোয়াটসঅ্যাপ</span>
        </button>

        {/* 3. Post Ad / Sell Center Button */}
        <button
          onClick={() => {
            setActiveModal('postAd');
          }}
          className="flex flex-col items-center gap-1 -mt-6 cursor-pointer group shrink-0"
          title="বিজ্ঞাপন দিন ও বিক্রি করুন"
        >
          <div className="w-13 h-13 rounded-full bg-[#ffc800] hover:bg-[#e6b400] text-slate-950 flex items-center justify-center shadow-lg active:scale-95 transition-all border-4 border-white ring-2 ring-amber-300">
            <PlusCircle className="w-6 h-6 text-slate-950 group-hover:rotate-90 transition-transform" />
          </div>
          <span className="text-[10px] font-black text-[#007460] bg-amber-200/90 px-2 py-0.5 rounded-full leading-none shadow-2xs">
            বিজ্ঞাপন / বিক্রয়
          </span>
        </button>

        {/* 4. Chat */}
        <button
          onClick={() => {
            setChatRecipient({ id: 'support-01', name: 'BikroyMela Support', phone: '09612-888999' });
            setActiveModal('chat');
          }}
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-emerald-700 py-1 px-2 rounded-lg cursor-pointer"
          title="চ্যাট আলাপ"
        >
          <MessageSquare className="w-5 h-5 text-slate-600" />
          <span className="text-[10px] font-bold leading-none text-slate-800">চ্যাট</span>
        </button>

        {/* 5. My ID / Profile */}
        <button
          onClick={() => {
            if (!currentUser) setActiveModal('auth');
            else setActiveModal('profile');
          }}
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-emerald-700 py-1 px-2 rounded-lg cursor-pointer"
          title="নিজের কাষ্টমার আইডি ও একাউন্ট দেখুন"
        >
          {currentUser ? (
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center ring-1 ring-emerald-500 shadow-xs">
              {currentUser.name ? currentUser.name.charAt(0) : 'U'}
            </div>
          ) : (
            <User className="w-5 h-5 text-slate-600" />
          )}
          <span className="text-[10px] font-bold leading-none text-slate-800">
            {currentUser ? 'আমার আইডি' : 'লগইন'}
          </span>
        </button>
      </div>
    </nav>
  );
};
