import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, LOCATIONS } from '../data/mockData';
import { PropertyType, DealType } from '../types';
import { 
  X, 
  Upload, 
  PlusCircle, 
  CheckCircle2, 
  Camera, 
  MapPin, 
  DollarSign, 
  Tag, 
  Layers,
  Image as ImageIcon,
  Home,
  Building,
  Store,
  Compass,
  Sparkles,
  Info,
  Gift,
  Check,
  AlertCircle,
  Briefcase
} from 'lucide-react';

export const PostAdModal: React.FC = () => {
  const { lang, t, currentUser, ads, setActiveModal, postNewAd, setIsPolicyModalOpen, offerSettings } = useApp();

  const userAdsCount = currentUser?.freeAdsCount ?? ads.filter(a => a.sellerId === currentUser?.id).length;
  const isFreeAdQuotaEligible = userAdsCount < 5;
  const freeAdsRemaining = Math.max(0, 5 - userAdsCount);

  const [policyAgreed, setPolicyAgreed] = useState<boolean>(true);
  const [category, setCategory] = useState('mobiles');
  const [condition, setCondition] = useState<'used' | 'new' | 'reconditioned'>('used');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [description, setDescription] = useState('');
  const [division, setDivision] = useState('Dhaka');
  const [area, setArea] = useState('Mirpur');
  const [phone, setPhone] = useState(currentUser?.phone || '01711223344');
  const [promotionPackage, setPromotionPackage] = useState<'free' | 'urgent' | 'featured'>('free');

  // Real Estate (Property) specific states
  const [propertyType, setPropertyType] = useState<PropertyType>('flat');
  const [dealType, setDealType] = useState<DealType>('sale');
  const [propertySize, setPropertySize] = useState('১২৫০ স্কয়ার ফিট');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('2');
  const [roadWidth, setRoadWidth] = useState('২৫ ফিট পাকা রাস্তা');

  // Multiple Photo Management (Max 7 photos, 3 Free, 4-7 Paid)
  const samplePresets = [
    { label: 'স্মার্টফোন', url: '/src/assets/images/classifieds_smartphone_1791109437128.jpg', cat: 'mobiles' },
    { label: 'মোটরবাইক', url: '/src/assets/images/classifieds_motorcycle_1791109454846.jpg', cat: 'vehicles' },
    { label: 'ল্যাপটপ', url: '/src/assets/images/classifieds_laptop_1791109467340.jpg', cat: 'electronics' },
    { label: 'রেডি ফ্ল্যাট', url: '/src/assets/images/classifieds_apartment_1791109480005.jpg', cat: 'property' },
    { label: 'জমি / প্লট', url: '/src/assets/images/real_estate_land_1791471593930.jpg', cat: 'property' },
    { label: 'বাণিজ্যিক দোকান', url: '/src/assets/images/real_estate_shop_1791471612360.jpg', cat: 'property' },
  ];

  const [photosList, setPhotosList] = useState<string[]>([
    samplePresets[0].url
  ]);
  const [photoFeeMethod, setPhotoFeeMethod] = useState<'wallet' | 'bkash'>('wallet');

  const photosCount = photosList.length;
  const isExtraPhotosSelected = photosCount > 3;
  const extraPhotosCount = Math.max(0, photosCount - 3);
  const extraPhotoFee = isExtraPhotosSelected ? 30 : 0; // ৳ 30 fee for 4 to 7 photos

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (photosList.length >= 7) {
        alert(lang === 'bn' ? 'সর্বোচ্চ ৭টি ছবি যোগ করা যাবে।' : 'Maximum 7 photos allowed.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotosList(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPresetPhoto = (url: string) => {
    if (photosList.includes(url)) return;
    if (photosList.length >= 7) {
      alert(lang === 'bn' ? 'সর্বোচ্চ ৭টি ছবি যোগ করা যাবে।' : 'Maximum 7 photos allowed.');
      return;
    }
    setPhotosList(prev => [...prev, url]);
  };

  const handleRemovePhoto = (index: number) => {
    if (photosList.length <= 1) {
      alert(lang === 'bn' ? 'অন্তত একটি ছবি থাকতে হবে।' : 'At least one photo is required.');
      return;
    }
    setPhotosList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) {
      alert(lang === 'bn' ? 'বিজ্ঞাপনের শিরোনাম এবং মূল্য লিখুন' : 'Please provide title and price');
      return;
    }

    if (!policyAgreed) {
      alert(lang === 'bn' 
        ? 'বিজ্ঞাপন প্রকাশ করতে হলে বিজনেস পলিসিতে সম্মতি থাকা আবশ্যক (অবৈধ পণ্য ক্রয়-বিক্রয় নিষিদ্ধ)।' 
        : 'You must agree to the platform business policy before posting.');
      return;
    }

    if (category === 'jobs') {
      alert(lang === 'bn' ? 'চাকরি পোর্টাল শীঘ্রই উন্মোচিত হবে! বর্তমানে অন্যান্য ক্যাটাগরিতে পোস্ট করুন।' : 'Jobs portal coming soon!');
      return;
    }

    const numericPrice = parseFloat(price.replace(/,/g, '')) || 0;

    const propertySpecs: Record<string, string> = category === 'property' ? {
      'টাইপ': propertyType === 'land' ? 'জমি / প্লট (Land)' :
             propertyType === 'shop' ? 'বাণিজ্যিক দোকান / স্পেস (Shop)' :
             propertyType === 'house' ? 'বাড়ি / ডুপ্লেক্স (House)' :
             propertyType === 'room' ? 'রুম / মেস / বাসা (Room)' : 'ফ্ল্যাট / অ্যাপার্টমেন্ট (Flat)',
      'লেনদেন': dealType === 'sale' ? 'সরাসরি বিক্রয় (For Sale)' : 'ভাড়া (For Rent)',
      'আকার / পরিমাপ': propertySize,
      ...(propertyType !== 'land' && propertyType !== 'shop' ? {
        'বেডরুম': `${bedrooms} টি`,
        'বাথরুম': `${bathrooms} টি`
      } : {}),
      'রাস্তা / অবস্থান': roadWidth
    } : {};

    postNewAd({
      titleBn: title,
      titleEn: title,
      descriptionBn: description,
      descriptionEn: description,
      price: numericPrice,
      isNegotiable,
      category,
      condition,
      location: {
        division,
        areaBn: `${area}, ${division}`,
        areaEn: `${area}, ${division}`
      },
      images: photosList,
      sellerPhone: phone,
      propertyType: category === 'property' ? propertyType : undefined,
      dealType: category === 'property' ? dealType : undefined,
      propertyDetails: category === 'property' ? {
        size: propertySize,
        bedrooms: parseInt(bedrooms) || undefined,
        bathrooms: parseInt(bathrooms) || undefined,
        facing: roadWidth
      } : undefined,
      extraPhotosCount,
      extraPhotoFeePaid: isExtraPhotosSelected,
      validationStatus: 'Received', // Initial validation status per requirement 03/04
      status: 'pending', // Starts in Received stage
      urgent: promotionPackage === 'urgent',
      featured: promotionPackage === 'featured',
      specs: category === 'property' ? propertySpecs : undefined
    });

    setActiveModal(null);
  };

  const currentAreas = LOCATIONS.find(l => l.division === division)?.areas || ['Mirpur', 'Uttara', 'Dhanmondi'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full text-slate-800 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-[#007460] text-white flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#ffc800]" />
            <div>
              <h2 className="font-bold text-base sm:text-lg leading-tight">
                {lang === 'bn' ? 'বিজ্ঞাপন দিন (নতুন/পুরাতন পণ্য, জমি, ফ্ল্যাট, দোকান)' : 'Post Free Classified Ad'}
              </h2>
              <p className="text-[11px] text-emerald-100">
                {lang === 'bn' ? 'প্রথম ৫টি এড সম্পূর্ণ ফ্রি • দ্রুত ভেরিফিকেশন ও বিক্রি' : 'First 5 ads free • Fast verification'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="text-white hover:text-emerald-200 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Ad Quota Banner */}
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-[#007460] shrink-0" />
            <span className="text-emerald-950 font-medium">
              {isFreeAdQuotaEligible ? (
                <>
                  <strong className="text-emerald-800">ফ্রি বিজ্ঞাপনের কোটা:</strong> আপনার প্রথম ৫টি বিজ্ঞাপনের মধ্যে <strong className="text-emerald-700 underline font-mono">{freeAdsRemaining} টি</strong> বাকি আছে!
                </>
              ) : (
                <>
                  <strong className="text-amber-800">কোটা আপডেট:</strong> আপনি ৫টি ফ্রি বিজ্ঞাপনের কোটা সফলভাবে ব্যবহার করেছেন।
                </>
              )}
            </span>
          </div>
          <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full font-mono">
            {freeAdsRemaining}/৫ ফ্রি
          </span>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          
          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.categoryLabel} *
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (e.target.value === 'property') {
                    // auto preset property photo if only 1 default photo
                    if (photosList.length === 1 && photosList[0] === samplePresets[0].url) {
                      setPhotosList(['/src/assets/images/classifieds_apartment_1791109480005.jpg']);
                    }
                  }
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 font-medium"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {lang === 'bn' ? cat.nameBn : cat.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.condition} *
              </label>
              <div className="flex items-center gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => setCondition('used')}
                  className={`flex-1 py-1.5 px-3 rounded border text-xs font-semibold transition-colors ${
                    condition === 'used' ? 'bg-[#007460] text-white border-[#007460]' : 'bg-slate-50 text-slate-700 border-slate-300'
                  }`}
                >
                  {lang === 'bn' ? 'ব্যবহৃত (Used)' : 'Used'}
                </button>
                <button
                  type="button"
                  onClick={() => setCondition('new')}
                  className={`flex-1 py-1.5 px-3 rounded border text-xs font-semibold transition-colors ${
                    condition === 'new' ? 'bg-[#007460] text-white border-[#007460]' : 'bg-slate-50 text-slate-700 border-slate-300'
                  }`}
                >
                  {lang === 'bn' ? 'নতুন / ফ্রেশ (New)' : 'New'}
                </button>
              </div>
            </div>
          </div>

          {/* Jobs Upcoming Notification if selected */}
          {category === 'jobs' && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-start gap-2.5 text-xs text-indigo-900">
              <Briefcase className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">💼 চাকরি ও নিয়োগ পোর্টাল শীঘ্রই আসছে!</strong>
                <p className="text-[11px] text-indigo-800 mt-0.5">
                  কোম্পানি ও প্রতিষ্ঠানের জন্য চাকরির বিজ্ঞপ্তি এবং চাকরিপ্রার্থীদের জন্য সরাসরি আবেদনের ফিচারটি খুব শীঘ্রই চালু হচ্ছে। অনুগ্রহ করে বর্তমান অন্য ক্যাটাগরিতে পণ্য বা প্রোপার্টি বিজ্ঞাপন পোস্ট করুন।
                </p>
              </div>
            </div>
          )}

          {/* Real Estate / Property Section (Requirement 02) */}
          {category === 'property' && (
            <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-xs">
                  <Home className="w-4 h-4 text-amber-700" />
                  <span>রিয়েল এস্টেট ও প্রোপার্টি বিবরণ (জমি, বাড়ি, দোকান, ফ্ল্যাট)</span>
                </div>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">
                  বিশেষ প্রোপার্টি ফিচার
                </span>
              </div>

              {/* Property Sub-type & Deal Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    প্রোপার্টি টাইপ নির্বাচন করুন *
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => {
                      const val = e.target.value as PropertyType;
                      setPropertyType(val);
                      if (val === 'land') {
                        setPhotosList(['/src/assets/images/real_estate_land_1791471593930.jpg']);
                        setPropertySize('৫ কাঠা');
                      } else if (val === 'shop') {
                        setPhotosList(['/src/assets/images/real_estate_shop_1791471612360.jpg']);
                        setPropertySize('২০০ স্কয়ার ফিট');
                      } else {
                        setPhotosList(['/src/assets/images/classifieds_apartment_1791109480005.jpg']);
                        setPropertySize('১২৫০ স্কয়ার ফিট');
                      }
                    }}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-emerald-500 font-medium text-xs text-slate-900"
                  >
                    <option value="flat">🏢 ফ্ল্যাট / অ্যাপার্টমেন্ট (Flat / Apartment)</option>
                    <option value="land">🌱 জমি / প্লট (Land / Plot)</option>
                    <option value="house">🏡 বাড়ি / ডুপ্লেক্স / ভবন (House / Building)</option>
                    <option value="shop">🏪 দোকান / বাণিজ্যিক স্পেস (Shop / Showroom)</option>
                    <option value="room">🛏️ বাসা / রুম / মেস ভাড়া (Room / To-Let)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    লেনদেনের ধরন (বিক্রয় নাকি ভাড়া) *
                  </label>
                  <div className="flex items-center gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setDealType('sale')}
                      className={`flex-1 py-1.5 px-2 rounded border text-xs font-bold transition-colors ${
                        dealType === 'sale' ? 'bg-[#007460] text-white border-[#007460]' : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      💰 সরাসরি বিক্রয় (Sale)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDealType('rent')}
                      className={`flex-1 py-1.5 px-2 rounded border text-xs font-bold transition-colors ${
                        dealType === 'rent' ? 'bg-[#007460] text-white border-[#007460]' : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      🔑 ভাড়া / টু-লেট (Rent)
                    </button>
                  </div>
                </div>
              </div>

              {/* Property Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    {propertyType === 'land' ? 'পরিমাপ (কাঠা / শতক)' : 'আকার (স্কয়ার ফিট)'}
                  </label>
                  <input
                    type="text"
                    value={propertySize}
                    onChange={(e) => setPropertySize(e.target.value)}
                    placeholder={propertyType === 'land' ? 'যেমন: ৫ কাঠা' : 'যেমন: ১২৫০ স্কয়ার ফিট'}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs font-medium text-slate-900"
                  />
                </div>

                {propertyType !== 'land' && propertyType !== 'shop' ? (
                  <>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                        বেডরুম ও বাথরুম
                      </label>
                      <div className="flex gap-1.5">
                        <select
                          value={bedrooms}
                          onChange={(e) => setBedrooms(e.target.value)}
                          className="w-1/2 px-2 py-1.5 border border-slate-300 rounded bg-white text-xs font-medium text-slate-900"
                        >
                          <option value="1">১ বেড</option>
                          <option value="2">২ বেড</option>
                          <option value="3">৩ বেড</option>
                          <option value="4">৪ বেড</option>
                          <option value="5">৫+ বেড</option>
                        </select>
                        <select
                          value={bathrooms}
                          onChange={(e) => setBathrooms(e.target.value)}
                          className="w-1/2 px-2 py-1.5 border border-slate-300 rounded bg-white text-xs font-medium text-slate-900"
                        >
                          <option value="1">১ বাথ</option>
                          <option value="2">২ বাথ</option>
                          <option value="3">৩ বাথ</option>
                          <option value="4">৪+ বাথ</option>
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                      {propertyType === 'land' ? 'কাগজপত্রের অবস্থা' : 'দোকানের অবস্থান'}
                    </label>
                    <input
                      type="text"
                      defaultValue={propertyType === 'land' ? 'নামজারি ও খাজনা প্রস্তুত' : '২য় তলা, মেইন রোড সংলগ্ন'}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs font-medium text-slate-900"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    রাস্তা / ফ্লোর / দিক
                  </label>
                  <input
                    type="text"
                    value={roadWidth}
                    onChange={(e) => setRoadWidth(e.target.value)}
                    placeholder="যেমন: ৩০ ফিট প্রশস্ত রাস্তা / দক্ষিণমুখী"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs font-medium text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.adTitleLabel} *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={category === 'property' 
                ? (propertyType === 'land' ? 'যেমন: মিরপুর ডিওএইচএস সংলগ্ন ৫ কাঠা নিষ্কণ্টক জমি বিক্রয়' : 'যেমন: ধানমন্ডিতে ৩ বেডরুমের রেডি ফ্ল্যাট বিক্রয়/ভাড়া')
                : 'যেমন: iPhone 14 Pro Max 256GB Deep Purple বা Yamaha FZ-S V3'}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900"
            />
          </div>

          {/* Price & Negotiable */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {category === 'property' && dealType === 'rent' ? 'মাসিক ভাড়া (টাকা) *' : `${t.priceLabel} *`}
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="যেমন: 45000"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono tabular-nums text-slate-900 font-bold"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={isNegotiable}
                  onChange={(e) => setIsNegotiable(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>{t.negotiable} (দামাদামি করার সুযোগ আছে)</span>
              </label>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'বিভাগ' : 'Division'} *
              </label>
              <select
                value={division}
                onChange={(e) => {
                  setDivision(e.target.value);
                  const firstArea = LOCATIONS.find(l => l.division === e.target.value)?.areas[0] || 'Sadar';
                  setArea(firstArea);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900"
              >
                {LOCATIONS.map(loc => (
                  <option key={loc.division} value={loc.division}>
                    {lang === 'bn' ? loc.divisionBn : loc.division}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'এলাকা / থানা' : 'Area / Thana'} *
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900"
              >
                {currentAreas.map(a => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Photos Management (Requirement 01: First 3 Free, 4-7 Paid) */}
          <div className="space-y-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span>বিজ্ঞাপনের ছবি ব্যবস্থাপনা ({photosCount}/৭টি ছবি নির্বাচিত)</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  ৩টি ছবি ফ্রিতে দিতে পারবেন। ৩ এর অধিক (৪-৭টি ছবি) যোগ করলে নামমাত্র প্রিমিয়াম ফটো ফি প্রযোজ্য।
                </p>
              </div>

              {/* Status Badge */}
              <div className="shrink-0">
                {!isExtraPhotosSelected ? (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-md flex items-center gap-1 border border-emerald-300">
                    <Check className="w-3.5 h-3.5" /> ফ্রি ফটো কোটা (১-৩টি ছবি: ৳০)
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md flex items-center gap-1 border border-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> অতিরিক্ত ছবি ফি: ৳৩০ ({extraPhotosCount}টি অতিরিক্ত)
                  </span>
                )}
              </div>
            </div>

            {/* Currently Selected Photos Strip */}
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {photosList.map((photo, idx) => (
                <div key={idx} className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-emerald-600 shrink-0 shadow-xs group">
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-0 left-0 bg-black/60 text-white text-[9px] px-1 font-mono font-bold rounded-br">
                    #{idx + 1}
                  </div>
                  {idx >= 3 && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[8px] font-black px-1 rounded-bl">
                      PRO
                    </div>
                  )}
                  {photosList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute bottom-1 right-1 bg-rose-600 text-white rounded-full p-0.5 shadow-md hover:bg-rose-700"
                      title="Remove Photo"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}

              {/* Add More Photo Button */}
              {photosList.length < 7 && (
                <label className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-white hover:bg-emerald-50/50 flex flex-col items-center justify-center cursor-pointer text-slate-500 hover:text-emerald-700 transition-colors shrink-0">
                  <Upload className="w-5 h-5 mb-0.5" />
                  <span className="text-[9px] font-semibold text-center leading-tight">ছবি যোগ<br/>করুন</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Presets Quick-Add Options */}
            <div>
              <div className="text-[11px] font-semibold text-slate-600 mb-1.5">
                নমুনা ছবি থেকে দ্রুত যোগ করতে ক্লিক করুন (অথবা নিজের ছবি আপলোড করুন):
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {samplePresets.map((p, idx) => {
                  const isAdded = photosList.includes(p.url);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => isAdded ? null : handleAddPresetPhoto(p.url)}
                      disabled={isAdded || photosList.length >= 7}
                      className={`relative aspect-4/3 rounded border overflow-hidden transition-all text-left ${
                        isAdded ? 'border-emerald-600 ring-2 ring-emerald-500/30 opacity-70 cursor-default' : 'border-slate-300 hover:border-emerald-500 opacity-90 hover:opacity-100 cursor-pointer'
                      }`}
                    >
                      <img src={p.url} alt="" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[9px] text-center truncate px-0.5">
                        {p.label}
                      </span>
                      {isAdded && (
                        <div className="absolute top-0.5 right-0.5 bg-emerald-600 text-white rounded-full p-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Extra Photo Fee Payment Option if 4 to 7 photos selected */}
            {isExtraPhotosSelected && (
              <div className="p-3 bg-amber-100/70 border border-amber-300 rounded-lg text-xs space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    <span>অতিরিক্ত {extraPhotosCount}টি ছবি যোগের জন্য ফি ৳ ৩০</span>
                  </div>
                  <span className="font-mono font-bold text-amber-900 bg-amber-200/90 px-2 py-0.5 rounded">
                    মোট ফি: ৳ ৩০
                  </span>
                </div>
                <p className="text-[11px] text-amber-900">
                  ৩টির বেশি ৫ বা ৭টি পর্যন্ত ছবি থাকলে ক্রেতারা পণ্যটি সবদিক থেকে ভালোভাবে দেখতে পায় এবং ৩ গুণ দ্রুত বিক্রি হয়!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <label className={`p-2 rounded border cursor-pointer flex items-center gap-2 ${
                    photoFeeMethod === 'wallet' ? 'bg-white border-emerald-600 ring-1 ring-emerald-600' : 'bg-amber-50/50 border-amber-200'
                  }`}>
                    <input
                      type="radio"
                      name="photoFee"
                      checked={photoFeeMethod === 'wallet'}
                      onChange={() => setPhotoFeeMethod('wallet')}
                      className="sr-only"
                    />
                    <div className="text-[11px]">
                      <span className="font-bold text-slate-900 block">🎁 ওয়ালেট বোনাস থেকে পরিশোধ</span>
                      <span className="text-[10px] text-emerald-700 font-medium">বর্তমান বোনাস ব্যালেন্স: ৳{currentUser?.walletBalance || 50}</span>
                    </div>
                  </label>

                  <label className={`p-2 rounded border cursor-pointer flex items-center gap-2 ${
                    photoFeeMethod === 'bkash' ? 'bg-white border-[#e2136e] ring-1 ring-[#e2136e]' : 'bg-amber-50/50 border-amber-200'
                  }`}>
                    <input
                      type="radio"
                      name="photoFee"
                      checked={photoFeeMethod === 'bkash'}
                      onChange={() => setPhotoFeeMethod('bkash')}
                      className="sr-only"
                    />
                    <div className="text-[11px]">
                      <span className="font-bold text-[#e2136e] block">বিকাশ / নগদ দিয়ে পরিশোধ</span>
                      <span className="text-[10px] text-slate-500">তাৎক্ষণিক অটো-ভেরিফাই ও রিসিট</span>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.description} *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={category === 'property' 
                ? 'প্রোপার্টির অবস্থান, গ্যাস-বিদ্যুৎ ও পানি সংযোগের তথ্য, দলিলের অবস্থা, রেজিস্ট্রি প্রস্তুত কিনা বিস্তারিত লিখুন...'
                : 'পণ্যের অবস্থা, কতদিন ব্যবহার করা হয়েছে, কোনো সমস্যা বা ত্রুটি আছে কি না বিস্তারিত লিখুন...'}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900"
            />
          </div>

          {/* Contact Mobile */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {lang === 'bn' ? 'যোগাযোগের মোবাইল নম্বর (ক্রেতা সরাসরি কল বা WhatsApp করবে)' : 'Contact Phone'} *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono text-slate-900"
            />
          </div>

          {/* Promotion Packages */}
          <div className="space-y-2 pt-1 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                বিজ্ঞাপন প্রমোশন ও দ্রুত বিক্রি প্যাকেজ (ঐচ্ছিক)
              </label>
              <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold border border-amber-200">
                ৩ গুণ দ্রুত বিক্রি হবে
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label className={`p-2.5 rounded-lg border cursor-pointer text-xs transition-all ${
                promotionPackage === 'free' ? 'border-[#007460] bg-emerald-50/60 ring-1 ring-[#007460]' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="promo"
                  checked={promotionPackage === 'free'}
                  onChange={() => setPromotionPackage('free')}
                  className="sr-only"
                />
                <div className="font-bold text-slate-900">সাধারণ বিজ্ঞাপন</div>
                <div className="text-[11px] font-mono text-emerald-700 font-bold mt-0.5">ফ্রি (৳ ০)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">নিয়মিত তালিকায় দেখাবে</div>
              </label>

              <label className={`p-2.5 rounded-lg border cursor-pointer text-xs transition-all ${
                promotionPackage === 'urgent' ? 'border-rose-600 bg-rose-50/60 ring-1 ring-rose-600' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="promo"
                  checked={promotionPackage === 'urgent'}
                  onChange={() => setPromotionPackage('urgent')}
                  className="sr-only"
                />
                <div className="font-bold text-rose-950 flex items-center justify-between">
                  <span>জরুরি বিক্রি (Urgent)</span>
                  <span className="text-[9px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-bold">HOT</span>
                </div>
                <div className="text-[11px] font-mono text-rose-700 font-bold mt-0.5">৳ ১৯৯ (bKash)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">লাল ব্যাজ সহ টপে থাকবে</div>
              </label>

              <label className={`p-2.5 rounded-lg border cursor-pointer text-xs transition-all ${
                promotionPackage === 'featured' ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="promo"
                  checked={promotionPackage === 'featured'}
                  onChange={() => setPromotionPackage('featured')}
                  className="sr-only"
                />
                <div className="font-bold text-amber-950 flex items-center justify-between">
                  <span>ফিচার্ড বিজ্ঞাপন</span>
                  <span className="text-[9px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-bold">TOP</span>
                </div>
                <div className="text-[11px] font-mono text-amber-800 font-bold mt-0.5">৳ ৪৯৯ (bKash)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">৭ দিন সবার উপরে পিন থাকবে</div>
              </label>
            </div>
          </div>

          {/* Requirement 03: Prohibited Products & Business Policy Disclaimer */}
          <div className="p-3.5 bg-rose-50/90 border border-rose-300 rounded-xl space-y-2">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-rose-950 text-xs">
                  {lang === 'bn' ? '⚠️ কঠোর সতর্কতা ও বিজনেস পলিসি:' : '⚠️ Strict Policy & Legal Notice:'}
                </h4>
                <p className="text-[11px] text-rose-900 mt-0.5 leading-relaxed font-medium">
                  {lang === 'bn' 
                    ? 'অবৈধ পণ্য ক্রয়-বিক্রয় থেকে বিরত থাকুন। লোক সমাগম স্থানে টাকা-পয়সা লেনদেন করুন এবং নিজ দায়িত্বে দেখে-শুনে পণ্য কেনাবেচা করুন। নিজ দায়িত্বে লেনদেন করে প্রতারিত হলে কর্তৃপক্ষ কোনো ভাবেই দায়ী থাকবে না।' 
                    : 'Refrain from illegal items. Meet in public places and trade on your own responsibility. The authority shall not be held liable.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-rose-200/80 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900 select-none">
                <input
                  type="checkbox"
                  checked={policyAgreed}
                  onChange={(e) => setPolicyAgreed(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded border-rose-400 focus:ring-rose-500"
                  required
                />
                <span className="text-xs">আমি অঙ্গীকার করছি যে এই বিজ্ঞাপনে কোনো অবৈধ পণ্য নেই *</span>
              </label>

              <button
                type="button"
                onClick={() => setIsPolicyModalOpen(true)}
                className="text-[11px] text-rose-700 underline font-semibold hover:text-rose-950 text-left shrink-0"
              >
                সম্পূর্ণ বিজনেস পলিসি পড়ুন
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!policyAgreed}
              className={`w-full py-3 text-slate-950 font-bold text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 ${
                policyAgreed 
                  ? 'bg-[#ffc800] hover:bg-[#e6b400] cursor-pointer active:scale-[0.99]' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>
                {isExtraPhotosSelected 
                  ? `বিজ্ঞাপন জমা দিন (ফটো ফি ৳${extraPhotoFee} সহ)` 
                  : (isFreeAdQuotaEligible ? 'সম্পূর্ণ বিনামূল্যে বিজ্ঞাপন প্রকাশ করুন (৳০)' : 'বিজ্ঞাপন জমা দিন')}
              </span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
