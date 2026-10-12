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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
      <button
        onClick={() => { resetFilters(); setIsAdminMode(false); }}
        className="flex flex-col items-center gap-1 text-slate-600 hover:text-emerald-700"
      >
        <Home className="w-5 h-5" />
        <span className="text-[11px] font-medium leading-none">{t.allAds}</span>
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

      {/* Post Ad Center Button */}
      <button
        onClick={() => {
          if (!currentUser) setActiveModal('auth');
          else setActiveModal('postAd');
        }}
        className="flex flex-col items-center gap-1 -mt-5"
      >
        <div className="w-12 h-12 rounded-full bg-[#ffc800] text-slate-950 flex items-center justify-center shadow-md active:scale-95 transition-transform border-2 border-white">
          <PlusCircle className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-bold text-slate-900 leading-none">{t.postAd}</span>
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
        <span className="text-[11px] font-medium leading-none">{currentUser ? 'অ্যাকাউন্ট' : 'লগইন'}</span>
      </button>
    </div>
  );
};
