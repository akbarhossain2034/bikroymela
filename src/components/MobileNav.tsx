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
      <div className="max-w-2xl mx-auto flex items-center justify-around">
        <button
          onClick={() => { resetFilters(); setIsAdminMode(false); }}
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-[#007460] transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-50 cursor-pointer"
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px] font-semibold leading-none">{t.allAds}</span>
        </button>

      <button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const searchInput = document.getElementById('main-search-input');
          if (searchInput) searchInput.focus();
        }}
        className="flex flex-col items-center gap-1 text-slate-600 hover:text-emerald-700"
      >
        <Search className="w-5 h-5" />
        <span className="text-[11px] font-medium leading-none">সার্চ</span>
      </button>

      {/* Post Ad Center Button - High Visibility with Yellow Badge */}
      <button
        onClick={() => {
          setActiveModal('postAd');
        }}
        className="flex flex-col items-center gap-1 -mt-6 cursor-pointer group"
        title="বিনামূল্যে বিজ্ঞাপন দিন"
      >
        <div className="w-14 h-14 rounded-full bg-[#ffc800] hover:bg-[#e6b400] text-slate-950 flex items-center justify-center shadow-lg active:scale-95 transition-all border-4 border-white ring-2 ring-amber-300">
          <PlusCircle className="w-7 h-7 text-slate-950 group-hover:rotate-90 transition-transform" />
        </div>
        <span className="text-[11px] font-extrabold text-[#007460] bg-amber-200/90 px-2 py-0.5 rounded-full leading-none shadow-2xs">
          {t.postAd}
        </span>
      </button>

      <button
        onClick={() => {
          setChatRecipient({ id: 'support-01', name: 'BikroyMela Support', phone: '09612-888999' });
          setActiveModal('chat');
        }}
        className="flex flex-col items-center gap-1 text-slate-600 hover:text-emerald-700"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-[11px] font-medium leading-none">চ্যাট</span>
      </button>

      <button
        onClick={() => {
          if (!currentUser) setActiveModal('auth');
          else setActiveModal('profile');
        }}
        className="flex flex-col items-center gap-1 text-slate-600 hover:text-emerald-700"
      >
        {currentUser ? (
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center ring-1 ring-emerald-500 shadow-xs">
            {currentUser.name ? currentUser.name.charAt(0) : 'U'}
          </div>
        ) : (
          <User className="w-5 h-5" />
        )}
        <span className="text-[11px] font-semibold leading-none">{currentUser ? 'অ্যাকাউন্ট' : 'লগইন'}</span>
      </button>
      </div>
    </nav>
  );
};
