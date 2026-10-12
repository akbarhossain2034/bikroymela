import React from 'react';
import { Ad } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, MapPin, ShieldCheck, Truck } from 'lucide-react';

interface AdCardProps {
  ad: Ad;
}

export const AdCard: React.FC<AdCardProps> = ({ ad }) => {
  const { lang, favorites, toggleFavorite, setSelectedAd, setActiveModal } = useApp();

  const isFav = favorites.includes(ad.id);
  const title = lang === 'bn' ? ad.titleBn : ad.titleEn;
  const area = lang === 'bn' ? ad.location.areaBn : ad.location.areaEn;

  const handleCardClick = () => {
    setSelectedAd(ad);
    setActiveModal('adDetail');
  };

  return (
    <article
      onClick={handleCardClick}
      className="group bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col h-full"
    >
      {/* Product Image Area */}
      <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
        {ad.images && ad.images[0] ? (
          <img
            src={ad.images[0]}
            alt={title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
            {lang === 'bn' ? 'ছবি উপলব্ধ নেই' : 'No photo available'}
          </div>
        )}

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(ad.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-colors ${
            isFav
              ? 'bg-white/90 text-rose-600 shadow-sm'
              : 'bg-black/30 hover:bg-black/50 text-white'
          }`}
          aria-label="Save Ad"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Urgent or Featured Label */}
        {(ad.urgent || ad.featured) && (
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
            {ad.urgent && (
              <span className="text-[10px] font-bold tracking-wider uppercase bg-rose-600 text-white px-2 py-0.5 rounded-sm shadow-xs">
                {lang === 'bn' ? 'জরুরি বিক্রি' : 'Urgent'}
              </span>
            )}
            {ad.featured && (
              <span className="text-[10px] font-bold tracking-wider uppercase bg-amber-500 text-slate-950 px-2 py-0.5 rounded-sm shadow-xs">
                {lang === 'bn' ? 'ফিচার্ড' : 'Featured'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata (Zero-Pill discipline) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1.5 flex-wrap">
            {ad.category === 'property' && ad.propertyType ? (
              <span className="font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                {ad.propertyType === 'land' ? '🌱 জমি / প্লট' :
                 ad.propertyType === 'shop' ? '🏪 বাণিজ্যিক দোকান' :
                 ad.propertyType === 'house' ? '🏡 বাড়ি / ডুপ্লেক্স' :
                 ad.propertyType === 'room' ? '🛏️ বাসা / রুম' : '🏢 ফ্ল্যাট'}
              </span>
            ) : (
              <span className="capitalize">{ad.condition === 'used' ? (lang === 'bn' ? 'ব্যবহৃত' : 'Used') : (lang === 'bn' ? 'নতুন' : 'New')}</span>
            )}
            <span aria-hidden="true">·</span>
            <span>{ad.category === 'property' ? 'প্রোপার্টি' : ad.category}</span>
            {ad.dealType && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-amber-700 bg-amber-50 px-1 rounded text-[10px]">
                  {ad.dealType === 'rent' ? 'ভাড়া / টু-লেট' : 'সরাসরি বিক্রয়'}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-[#007460] line-clamp-2 transition-colors leading-snug">
            {title}
          </h3>
        </div>

        {/* Price & Location & Seller */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between">
            <div className="text-base sm:text-lg font-bold text-[#007460] font-mono tabular-nums">
              ৳ {ad.price.toLocaleString()}
            </div>
            {ad.isNegotiable && (
              <span className="text-[11px] text-slate-600">
                {lang === 'bn' ? 'আলোচনা সাপেক্ষে' : 'Negotiable'}
              </span>
            )}
          </div>

          {/* Location & Time */}
          <div className="flex items-center justify-between text-xs text-slate-600 mt-2">
            <div className="flex items-center gap-1 truncate max-w-[65%]">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{area}</span>
            </div>
            <span className="text-[11px] text-slate-600 shrink-0">{ad.createdAt}</span>
          </div>

          {/* Trust Marker (Escrow & Verified) */}
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-emerald-800 bg-emerald-50/70 px-2 py-1 rounded">
            <div className="flex items-center gap-1 truncate">
              {ad.sellerVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
              <span className="truncate">{ad.sellerName}</span>
            </div>
            <div className="flex items-center gap-1 text-[#007460] font-medium shrink-0">
              <Truck className="w-3 h-3" />
              <span>{lang === 'bn' ? 'এসক্রো ডেলিভারি' : 'Escrow Delivery'}</span>
            </div>
          </div>

        </div>

      </div>
    </article>
  );
};
