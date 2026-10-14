import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { CategoryBar } from './components/CategoryBar';
import { AdCard } from './components/AdCard';
import { AdDetailModal } from './components/AdDetailModal';
import { PostAdModal } from './components/PostAdModal';
import { PaymentModal } from './components/PaymentModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { ChatModal } from './components/ChatModal';
import { AuthModal } from './components/AuthModal';
import { AuthView } from './components/AuthView';
import { ProfileModal } from './components/ProfileModal';
import { AdminDashboard } from './components/AdminDashboard';
import { MobileNav } from './components/MobileNav';
import { Footer } from './components/Footer';
import { WhatsAppSupportWidget } from './components/WhatsAppSupportWidget';
import { DeleteAdReasonModal } from './components/DeleteAdReasonModal';
import { AdminDeleteAdModal } from './components/AdminDeleteAdModal';
import { BusinessPolicyModal } from './components/BusinessPolicyModal';
import { OffersShowcaseModal } from './components/OffersShowcaseModal';
import { ReviewModal } from './components/ReviewModal';
import { 
  Filter, 
  ArrowUpDown, 
  X, 
  Sparkles, 
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

const MainMarketplace: React.FC = () => {
  const { 
    lang, 
    t, 
    ads, 
    searchQuery, 
    selectedCategory, 
    selectedDivision, 
    selectedArea, 
    selectedCondition, 
    setSelectedCondition,
    sortBy, 
    setSortBy,
    priceRange,
    setPriceRange,
    resetFilters,
    isAdminMode,
    activeModal,
    selectedAd,
    adToDelete,
    adminAdToDelete,
    setActiveModal
  } = useApp();

  if (isAdminMode) {
    return <AdminDashboard />;
  }

  // Full-page Buyer/Seller Auth Page matching 1.png
  if (activeModal === 'auth') {
    return <AuthView onBackToHome={() => setActiveModal(null)} />;
  }

  // Full-page Customer ID / Account Dashboard matching কাষ্টমার আইডি1.png
  if (activeModal === 'profile') {
    return <ProfileModal />;
  }

  // Filter ads
  const filteredAds = ads.filter(ad => {
    // Only active ads in marketplace
    if (ad.status !== 'active') return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = ad.titleBn.toLowerCase().includes(q) || ad.titleEn.toLowerCase().includes(q);
      const matchDesc = ad.descriptionBn.toLowerCase().includes(q) || ad.descriptionEn.toLowerCase().includes(q);
      const matchSeller = ad.sellerName.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchSeller) return false;
    }

    // Category
    if (selectedCategory && ad.category !== selectedCategory) return false;

    // Division & Area
    if (selectedDivision && ad.location.division !== selectedDivision) return false;
    if (selectedArea && !ad.location.areaEn.includes(selectedArea) && !ad.location.areaBn.includes(selectedArea)) return false;

    // Condition
    if (selectedCondition !== 'all' && ad.condition !== selectedCondition) return false;

    // Price range
    if (ad.price < priceRange[0] || ad.price > priceRange[1]) return false;

    return true;
  });

  // Sort ads
  const sortedAds = [...filteredAds].sort((a, b) => {
    if (sortBy === 'priceLowHigh') return a.price - b.price;
    if (sortBy === 'priceHighLow') return b.price - a.price;
    return 0; // default newest
  });

  const featuredAds = sortedAds.filter(a => a.featured || a.urgent);
  const regularAds = sortedAds;

  const hasActiveFilters = Boolean(
    searchQuery || 
    selectedCategory || 
    selectedDivision || 
    selectedArea || 
    selectedCondition !== 'all' || 
    priceRange[0] > 0 || 
    priceRange[1] < 10000000
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f8]">
      <Header />
      
      {/* Hero with Search and Location modal */}
      <HeroSearch />

      {/* Category Grid */}
      <CategoryBar />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Filter Sidebar (3 cols on desktop) */}
          <aside className="lg:col-span-3 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
                <SlidersHorizontal className="w-4 h-4 text-[#007460]" />
                <span>{lang === 'bn' ? 'ফিল্টার ও বাছাই' : 'Filters & Sort'}</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  <span>{lang === 'bn' ? 'রিসেট' : 'Reset'}</span>
                </button>
              )}
            </div>

            {/* Condition Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {t.condition}
              </label>
              <div className="flex flex-col gap-1.5 text-xs text-slate-700">
                {[
                  { id: 'all', label: t.allConditions },
                  { id: 'used', label: t.used },
                  { id: 'new', label: t.new }
                ].map(cond => (
                  <label key={cond.id} className="flex items-center gap-2 cursor-pointer hover:text-[#007460]">
                    <input
                      type="radio"
                      name="condition"
                      checked={selectedCondition === cond.id}
                      onChange={() => setSelectedCondition(cond.id)}
                      className="text-emerald-700 focus:ring-emerald-600"
                    />
                    <span>{cond.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {t.filterByPrice}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold">{t.minPrice}</span>
                  <input
                    type="number"
                    value={priceRange[0] === 0 ? '' : priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                    placeholder="০"
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold">{t.maxPrice}</span>
                  <input
                    type="number"
                    value={priceRange[1] === 10000000 ? '' : priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 10000000])}
                    placeholder="সর্বোচ্চ"
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Safe Trading Reminder */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-lg text-xs space-y-1">
              <span className="font-bold text-emerald-950 flex items-center gap-1">
                <span>🛡️</span>
                <span>{lang === 'bn' ? 'নিরাপদ বেচাকেনা' : 'Safe Trading'}</span>
              </span>
              <p className="text-[11px] text-emerald-900 leading-relaxed">
                {lang === 'bn' 
                  ? 'সবসময় এসক্রো গেটওয়ে ও অফিশিয়াল কুরিয়ার ডেলিভারি ব্যবহার করুন।' 
                  : 'Always use integrated Escrow payment and trusted courier.'}
              </p>
            </div>

          </aside>

          {/* Right Product Grid (9 cols on desktop) */}
          <section className="lg:col-span-9 space-y-5">
            
            {/* Sort & Count Header */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-xs text-slate-600 font-medium">
                {lang === 'bn' ? 'মোট দেখানো হচ্ছে: ' : 'Showing: '}
                <span className="font-bold text-slate-900 font-mono tabular-nums">{sortedAds.length}</span>
                {lang === 'bn' ? ' টি বিজ্ঞাপন' : ' Ads'}
                {selectedCategory && <span className="text-[#007460] font-semibold"> ({selectedCategory})</span>}
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">{t.sortBy}:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="newest">{t.newest}</option>
                  <option value="priceLowHigh">{t.priceLowHigh}</option>
                  <option value="priceHighLow">{t.priceHighLow}</option>
                </select>
              </div>
            </div>

            {/* Ads Grid */}
            {sortedAds.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-800">{t.noAdsFound}</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">{t.tryAdjustingFilters}</p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-[#007460] text-white text-xs font-semibold rounded-lg hover:bg-[#005e4e] transition-colors"
                >
                  {lang === 'bn' ? 'সব ফিল্টার মুছুন' : 'Clear All Filters'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {sortedAds.map(ad => (
                  <AdCard key={ad.id} ad={ad} />
                ))}
              </div>
            )}

          </section>

        </div>
      </main>

      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Floating 24/7 WhatsApp Live Support */}
      <WhatsAppSupportWidget />

      {/* Global Modals */}
      {(selectedAd || activeModal === 'adDetail') && <AdDetailModal />}
      {activeModal === 'postAd' && <PostAdModal />}
      {activeModal === 'payment' && <PaymentModal />}
      {activeModal === 'orderTracking' && <OrderTrackingModal />}
      {activeModal === 'chat' && <ChatModal />}
      {activeModal === 'auth' && <AuthModal />}
      {activeModal === 'profile' && <ProfileModal />}
      {activeModal === 'addReview' && <ReviewModal />}
      {adToDelete && <DeleteAdReasonModal />}
      {adminAdToDelete && <AdminDeleteAdModal />}
      <BusinessPolicyModal />
      <OffersShowcaseModal />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainMarketplace />
    </AppProvider>
  );
}
