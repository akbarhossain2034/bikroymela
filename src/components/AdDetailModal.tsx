import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  Truck, 
  ShieldAlert, 
  CheckCircle2, 
  Heart,
  Share2,
  Calendar,
  Eye,
  Star
} from 'lucide-react';

export const AdDetailModal: React.FC = () => {
  const { 
    lang, 
    t, 
    selectedAd, 
    setSelectedAd, 
    favorites, 
    toggleFavorite, 
    setActiveModal, 
    setChatRecipient 
  } = useApp();

  const [showPhone, setShowPhone] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [tokenHoldBooked, setTokenHoldBooked] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!selectedAd) return null;

  const isFav = favorites.includes(selectedAd.id);
  const title = lang === 'bn' ? selectedAd.titleBn : selectedAd.titleEn;
  const description = lang === 'bn' ? selectedAd.descriptionBn : selectedAd.descriptionEn;
  const area = lang === 'bn' ? selectedAd.location.areaBn : selectedAd.location.areaEn;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleStartChat = () => {
    setChatRecipient({
      id: selectedAd.sellerId,
      name: selectedAd.sellerName,
      phone: selectedAd.sellerPhone,
      adTitle: title
    });
    setActiveModal('chat');
  };

  const handleBuyNow = () => {
    setActiveModal('payment');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full text-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 truncate pr-4">
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
              {selectedAd.category}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-300 truncate">{area}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavorite(selectedAd.id)}
              className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title="Save Ad"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={() => setSelectedAd(null)}
              className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Top Grid: Images + Main Buy Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Gallery Left (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-4/3 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-2xs">
                <img
                  src={selectedAd.images[activeImageIndex] || selectedAd.images[0]}
                  alt={title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-200"
                />
                {(selectedAd.urgent || selectedAd.featured) && (
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {selectedAd.urgent && (
                      <span className="text-xs font-bold uppercase bg-rose-600 text-white px-2.5 py-1 rounded shadow-sm">
                        {lang === 'bn' ? 'জরুরি বিক্রি' : 'Urgent'}
                      </span>
                    )}
                    {selectedAd.featured && (
                      <span className="text-xs font-bold uppercase bg-amber-500 text-slate-950 px-2.5 py-1 rounded shadow-sm">
                        {lang === 'bn' ? 'ফিচার্ড বিজ্ঞাপন' : 'Featured'}
                      </span>
                    )}
                  </div>
                )}
                {selectedAd.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                    {activeImageIndex + 1}/{selectedAd.images.length}
                  </div>
                )}
              </div>

              {/* Thumbnails if multiple images (Up to 7 photos) */}
              {selectedAd.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {selectedAd.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        activeImageIndex === idx 
                          ? 'border-[#007460] ring-2 ring-[#007460]/20 scale-105' 
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 right-0 bg-black/60 text-white text-[8px] px-1 font-mono">
                        #{idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Unboxed Metadata Strip */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {area}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {selectedAd.createdAt}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  {selectedAd.views} {t.views}
                </span>
              </div>
            </div>

            {/* Purchase & Seller Info Right (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {title}
                </h1>

                {/* Price Display */}
                <div className="mt-3 p-3.5 bg-emerald-50/80 border border-emerald-100 rounded-lg">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#007460] font-mono tabular-nums">
                    ৳ {selectedAd.price.toLocaleString()}
                  </div>
                  <div className="text-xs text-emerald-800 font-medium mt-1 flex items-center gap-2">
                    <span>{selectedAd.isNegotiable ? (lang === 'bn' ? 'আলোচনা সাপেক্ষে' : 'Negotiable Price') : (lang === 'bn' ? 'নির্দিষ্ট মূল্য (Fixed Price)' : 'Fixed Price')}</span>
                    <span>·</span>
                    <span className="capitalize">{selectedAd.condition === 'used' ? (lang === 'bn' ? 'ব্যবহৃত' : 'Used') : (lang === 'bn' ? 'নতুন' : 'Brand New')}</span>
                  </div>
                </div>

                {/* Escrow Guarantee Box */}
                <div className="mt-4 p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Truck className="w-4 h-4 text-amber-700" />
                    <span>{lang === 'bn' ? 'নিরাপদ ডেলিভারি ও এসক্রো সুরক্ষা' : 'Safe Escrow Delivery Guarantee'}</span>
                  </div>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    {lang === 'bn'
                      ? 'টাকা বিক্রেতার কাছে সরাসরি যাবে না। আপনি পার্সেল হাতে পেয়ে সঠিক পণ্য যাচাই করার পরই পেমেন্ট সেলারকে রিলিজ করা হবে।'
                      : 'Funds are securely held in escrow. The seller is only paid after you inspect the item in person upon courier delivery.'}
                  </p>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="space-y-2 pt-2">
                {/* Buy with Escrow CTA */}
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 bg-[#007460] hover:bg-[#005e4e] active:scale-[0.99] text-white font-bold text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>{t.buyNowWithEscrow}</span>
                </button>

                {/* In-Person Inspection Token Hold for Face-to-Face Deals */}
                <button
                  onClick={() => {
                    setTokenHoldBooked(true);
                    setTimeout(() => setTokenHoldBooked(false), 5000);
                  }}
                  className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-amber-300 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>সরাসরি দেখে কিনতে বুকিং টোকেন (Hold Item ৳ ৫০০)</span>
                </button>

                {tokenHoldBooked && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs rounded-lg font-medium leading-relaxed">
                    ✓ <strong>বুকিং নিশ্চিত:</strong> আপনার ৳ ৫০০ এসক্রো টোকেন জমা হয়েছে। বিক্রেতা আগামী ৪৮ ঘণ্টা পণ্যটি অন্য কারও কাছে বিক্রি না করে আপনার সরাসরি পরিদর্শনের জন্য সংরক্ষণ (Hold) রাখবেন।
                  </div>
                )}

                {/* Call Seller Toggle */}
                <button
                  onClick={() => setShowPhone(!showPhone)}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 border border-slate-300 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>
                    {showPhone 
                      ? selectedAd.sellerPhone 
                      : (lang === 'bn' ? `কল করুন: ${selectedAd.sellerPhone.substring(0, 5)}... (ক্লিক করে দেখুন)` : `Call: ${selectedAd.sellerPhone.substring(0, 5)}... (Click to reveal)`)}
                  </span>
                </button>

                {showPhone && (
                  <div className="p-2 bg-amber-50 border border-amber-200 text-amber-900 text-[11px] rounded-lg leading-relaxed">
                    ⚠️ <strong>সতর্কতা:</strong> সরাসরি কোনো নম্বরে অগ্রিম টাকা পাঠাবেন না। প্রতারণা এড়াতে ও ১০০% ক্যাশব্যাক গ্যারান্টি পেতে উপরে <strong>'নিরাপদ ডেলিভারিতে কিনুন'</strong> বাটন ব্যবহার করুন।
                  </div>
                )}

                {/* Direct WhatsApp Contact Button */}
                {selectedAd.sellerPhone && (
                  <a
                    href={`https://wa.me/88${selectedAd.sellerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `আসসালামু আলাইকুম, আমি BikroyMela-তে আপনার "${title}" বিজ্ঞাপনটি (মূল্য: ৳ ${selectedAd.price.toLocaleString()}) দেখেছি। এ বিষয়ে বিস্তারিত জানতে চাচ্ছি।`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span>{lang === 'bn' ? 'WhatsApp-এ যোগাযোগ করুন' : 'Chat on WhatsApp'}</span>
                  </a>
                )}

                {/* Chat with Seller (In-app) */}
                <button
                  onClick={handleStartChat}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{t.chatWithSeller}</span>
                </button>
              </div>

              {/* Seller Profile Summary with Star Ratings & Review CTA */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <span>{selectedAd.sellerName}</span>
                    {selectedAd.sellerVerified && (
                      <span className="flex items-center gap-0.5 text-emerald-700 text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded font-medium">
                        <ShieldCheck className="w-3 h-3" />
                        {t.verifiedSeller}
                      </span>
                    )}
                  </div>
                  <div className="text-slate-600 text-[11px] mt-0.5 flex items-center gap-1.5">
                    <span className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current inline mr-0.5" />
                      {selectedAd.sellerRating} ★
                    </span>
                    <span>·</span>
                    <span>{t.memberSince}: {selectedAd.sellerMemberSince}</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModal('addReview')}
                  className="px-2.5 py-1.5 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                  <span>রিভিউ দিন</span>
                </button>
              </div>

            </div>

          </div>

          {/* Description & Specifications Section */}
          <div className="border-t border-slate-200 pt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Description (8 cols) */}
            <div className="md:col-span-7 space-y-4">
              <h2 className="text-base font-bold text-slate-900">
                {t.description}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-lg border border-slate-200/80">
                {description}
              </p>

              {/* Specifications Table */}
              {selectedAd.specs && Object.keys(selectedAd.specs).length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">
                    {t.specifications}
                  </h3>
                  <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-200 text-xs">
                    {Object.entries(selectedAd.specs).map(([key, val]) => (
                      <div key={key} className="flex px-3 py-2 bg-white even:bg-slate-50">
                        <span className="w-1/3 font-semibold text-slate-600">{key}</span>
                        <span className="w-2/3 font-mono tabular-nums text-slate-900">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Safety Tips (5 cols) */}
            <div className="md:col-span-5">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-xs sm:text-sm">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{t.safetyTips}</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-2 pl-4 list-disc leading-relaxed">
                  <li>{t.safetyTip1}</li>
                  <li>{t.safetyTip2}</li>
                  <li>{t.safetyTip3}</li>
                </ul>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            বিজ্ঞাপন আইডি: <span className="font-mono">{selectedAd.id}</span>
          </span>
          <button
            onClick={() => setSelectedAd(null)}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded transition-colors"
          >
            {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
