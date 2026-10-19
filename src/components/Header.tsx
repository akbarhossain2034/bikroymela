import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  MessageSquare, 
  User, 
  PlusCircle, 
  ShieldCheck, 
  Package, 
  Globe, 
  ChevronDown,
  Menu,
  X,
  Gift,
  Heart,
  Headphones,
  Crown,
  Coins,
  CreditCard,
  LogOut,
  Sparkles,
  Layers
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    lang, 
    setLang, 
    t, 
    currentUser, 
    setCurrentUser,
    customerLogout,
    isAdminMode, 
    setIsAdminMode, 
    notifications, 
    markNotificationRead,
    markAllNotificationsRead,
    setActiveModal,
    setActiveProfileTab,
    setChatRecipient,
    resetFilters,
    siteName,
    offerSettings,
    setIsOffersModalOpen,
    ads
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const myAdsCount = currentUser ? ads.filter(a => a.sellerId === currentUser.id || a.sellerPhone === currentUser.phone).length : 0;

  return (
    <header className="sticky top-0 z-40 shadow-md">
      {/* Top Welcome Bonus Promotional Banner */}
      {offerSettings?.isBannerActive && offerSettings?.isBonusEnabled && !isAdminMode && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 py-1 px-4 text-xs font-semibold shadow-inner">
          <div className="max-w-[1720px] 2xl:max-w-[1880px] mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <span className="w-4 h-4 rounded-full bg-slate-950 text-amber-300 flex items-center justify-center font-black text-[10px] shrink-0">
                ৳
              </span>
              <span className="truncate text-[11px] sm:text-xs">
                {lang === 'bn' ? offerSettings.campaignTitleBn : offerSettings.campaignTitleEn}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  if (currentUser) {
                    setActiveModal('profile');
                  } else {
                    setActiveModal('auth');
                  }
                }}
                className="px-2.5 py-0.5 bg-slate-950 hover:bg-slate-800 text-amber-300 hover:text-white rounded-full text-[10px] sm:text-[11px] font-bold transition-colors cursor-pointer shadow-xs whitespace-nowrap"
              >
                {currentUser ? 'ক্যাশ তুলুন ➔' : 'বোনাস নিন ➔'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#007460] text-white">
        <div className="max-w-[1720px] 2xl:max-w-[1880px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { resetFilters(); setIsAdminMode(false); }}
              className="text-2xl font-bold tracking-tight text-white hover:text-emerald-100 transition-colors flex items-center gap-1.5 focus:outline-none"
            >
              <span className="text-[#ffc800]">●</span>
              <span>{siteName}</span>
            </button>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-emerald-50">
            <button
              onClick={() => { resetFilters(); setIsAdminMode(false); }}
              className={`hover:text-white transition-colors cursor-pointer ${!isAdminMode ? 'text-white font-semibold underline decoration-2 underline-offset-8' : ''}`}
            >
              {t.allAds}
            </button>

            <button
              onClick={() => {
                setChatRecipient({ id: 'support-01', name: lang === 'bn' ? 'বিক্রয়মেলা হেল্পডেস্ক' : 'BikroyMela Support', phone: '09612-888999' });
                setActiveModal('chat');
              }}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <MessageSquare className="w-4 h-4 text-emerald-200" />
              <span>{t.chatSupport}</span>
            </button>

            <button
              onClick={() => setIsOffersModalOpen(true)}
              className="hover:text-amber-200 transition-colors cursor-pointer flex items-center gap-1.5 font-bold text-amber-300 bg-emerald-800/60 px-2.5 py-1 rounded-md"
              title="দ্রুত পয়েন্ট অর্জন ও বিশেষ গ্রাহক সুবিধা দেখুন"
            >
              <Gift className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === 'bn' ? 'পয়েন্ট ও অফার' : 'Points & Rewards'}</span>
            </button>

            {/* মাই বিজ্ঞাপন (চলমান, ওয়েটিং ও ক্যানসেল) */}
            {currentUser && !isAdminMode && (
              <button
                onClick={() => {
                  setActiveProfileTab('my_ads');
                  setActiveModal('profile');
                }}
                className="hover:text-amber-200 transition-colors cursor-pointer flex items-center gap-1.5 font-bold text-amber-300 bg-emerald-900/80 hover:bg-emerald-900 px-2.5 py-1 rounded-md border border-amber-400/40 shadow-2xs"
                title="আপনার পোস্টকৃত চলমান, ওয়েটিং ও ক্যানসেল বিজ্ঞাপন দেখুন"
              >
                <Layers className="w-3.5 h-3.5 text-amber-300" />
                <span>মাই বিজ্ঞাপন</span>
                {myAdsCount > 0 && (
                  <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full font-mono font-extrabold">
                    {myAdsCount}
                  </span>
                )}
              </button>
            )}

            {/* Admin Switcher - only when already in Admin Mode */}
            {isAdminMode && (
              <button
                onClick={() => setIsAdminMode(false)}
                className="px-2.5 py-1 text-xs font-bold rounded transition-colors flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm cursor-pointer"
                title={lang === 'bn' ? 'কাষ্টমার মার্কেটপ্লেসে ফিরে যান' : 'Switch to Customer View'}
              >
                <User className="w-3.5 h-3.5" />
                <span>{t.switchToUser}</span>
              </button>
            )}
          </nav>

          {/* Zone 3: 1-2 primary actions + Language & Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-100 hover:text-white bg-emerald-800/80 hover:bg-emerald-800 rounded transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="font-semibold">{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-emerald-100 hover:text-white hover:bg-emerald-800/60 rounded-full transition-colors focus:outline-none"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-slate-200 text-slate-800 z-50 overflow-hidden">
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-900">{t.notifications}</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllNotificationsRead}
                        className="text-xs text-emerald-700 hover:underline"
                      >
                        {t.markAllRead}
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">
                        কোনো নোটিফিকেশন নেই
                      </div>
                    ) : (
                      notifications.map(item => (
                        <div 
                          key={item.id}
                          onClick={() => {
                            markNotificationRead(item.id);
                            if (item.type === 'order') setActiveModal('orderTracking');
                            if (item.type === 'chat') setActiveModal('chat');
                          }}
                          className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                            !item.read ? 'bg-emerald-50/70' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold text-slate-900 mb-1">
                            <span>{lang === 'bn' ? item.titleBn : item.titleEn}</span>
                            <span className="text-[10px] text-slate-600 font-normal">{item.time}</span>
                          </div>
                          <p className="text-slate-600 leading-relaxed">
                            {lang === 'bn' ? item.descriptionBn : item.descriptionEn}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile or Login - Circular with essential info, no user text name on main page */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setActiveModal('profile')}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 text-xs font-semibold text-white bg-emerald-800/80 hover:bg-emerald-800 rounded-full transition-all group cursor-pointer border border-emerald-600/70 shadow-xs"
                  title="আপনার অ্যাকাউন্ট, আইডি ও ম্যানেজ অ্যাড্রেস"
                >
                  {/* গোলাকার অবতার (Circular Avatar) - কোনো নাম দেখা যাবে না */}
                  <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-md ring-2 ring-emerald-300/80 group-hover:scale-105 transition-transform shrink-0">
                    {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                    {currentUser.isNidVerified && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center ring-1 ring-white" title="NID ভেরিফায়েড">
                        <ShieldCheck className="w-2.5 h-2.5 text-white" />
                      </span>
                    )}
                  </div>

                  {/* প্রয়োজনীয় তথ্য (ব্যালেন্স ও পয়েন্ট) - নাম দেখা যাবে না */}
                  <div className="hidden sm:flex flex-col text-left leading-tight pr-1">
                    <span className="text-[11px] font-bold text-amber-300 font-mono flex items-center gap-1">
                      <span>৳{(currentUser.walletBalance ?? 50).toLocaleString()}</span>
                      <span className="text-[9px] bg-emerald-950/70 text-emerald-200 px-1 py-0.2 rounded font-sans">বোনাস</span>
                    </span>
                    <span className="text-[10px] text-emerald-200 font-mono flex items-center gap-1">
                      <span>{currentUser.rewardPoints ?? 120} পয়েন্ট</span>
                    </span>
                  </div>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveModal('auth')}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded transition-colors whitespace-nowrap border border-emerald-600/50"
              >
                {t.login}
              </button>
            )}

            {/* Post ad button removed from top right as requested - unified at bottom navigation bar */}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-emerald-100 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-emerald-600/60 flex flex-col gap-2">
            <button
              onClick={() => { resetFilters(); setIsAdminMode(false); setMobileMenuOpen(false); }}
              className="text-left py-2 px-2 text-sm text-white hover:bg-emerald-800/50 rounded"
            >
              {t.allAds}
            </button>
            <button
              onClick={() => {
                setChatRecipient({ id: 'support-01', name: 'BikroyMela Support', phone: '09612-888999' });
                setActiveModal('chat');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-2 text-sm text-white hover:bg-emerald-800/50 rounded flex items-center justify-between"
            >
              <span>{t.chatSupport}</span>
              <MessageSquare className="w-4 h-4" />
            </button>
            {currentUser && (
              <button
                onClick={() => {
                  setActiveProfileTab('my_ads');
                  setActiveModal('profile');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-2 text-sm text-amber-300 font-bold hover:bg-emerald-800/50 rounded flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-300" />
                  <span>মাই বিজ্ঞাপন (চলমান, ওয়েটিং, ক্যানসেল)</span>
                </span>
                <span className="text-xs bg-amber-400 text-slate-950 font-mono font-bold px-1.5 py-0.2 rounded-full">
                  {myAdsCount}
                </span>
              </button>
            )}
            {currentUser && (
              <button
                onClick={() => {
                  customerLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-2 text-sm text-rose-300 font-semibold hover:bg-emerald-800/50 rounded flex items-center justify-between"
              >
                <span>লগ আউট</span>
                <LogOut className="w-4 h-4" />
              </button>
            )}
            {isAdminMode && (
              <button
                onClick={() => { setIsAdminMode(false); setMobileMenuOpen(false); }}
                className="text-left py-2 px-2 text-sm text-amber-300 font-semibold hover:bg-emerald-800/50 rounded flex items-center justify-between"
              >
                <span>{t.switchToUser}</span>
                <User className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        </div>
      </div>
    </header>
  );
};
