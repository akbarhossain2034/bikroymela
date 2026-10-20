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
  Briefcase,
  CreditCard,
  Lock,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Receipt
} from 'lucide-react';

export const PostAdModal: React.FC = () => {
  const { lang, t, currentUser, ads, setActiveModal, postNewAd, setIsPolicyModalOpen, offerSettings, setIsAdminMode } = useApp();

  const userAdsCount = currentUser?.freeAdsCount ?? ads.filter(a => a.sellerId === currentUser?.id).length;
  const isFreeAdQuotaEligible = userAdsCount < 5;
  const freeAdsRemaining = Math.max(0, 5 - userAdsCount);

  // Modal Step: 'form' | 'payment' | 'success'
  const [modalStep, setModalStep] = useState<'form' | 'payment' | 'success'>('form');

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
  const [photosList, setPhotosList] = useState<string[]>([]);

  // Payment Gateway States for Paid Ads (Urgent, Featured, Extra photos)
  const [selectedGateway, setSelectedGateway] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Wallet'>('bKash');
  const [paymentMode, setPaymentMode] = useState<'instant' | 'manual'>('instant');
  const [gatewayPhoneInput, setGatewayPhoneInput] = useState(currentUser?.phone || phone || '01711223344');
  const [gatewayOtpInput, setGatewayOtpInput] = useState('5928');
  const [gatewayPinInput, setGatewayPinInput] = useState('••••');
  const [manualTrxIdInput, setManualTrxIdInput] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedPaymentReceipt, setCompletedPaymentReceipt] = useState<{
    trxId: string;
    amount: number;
    gateway: string;
    date: string;
    packageName: string;
    adTitle: string;
  } | null>(null);

  const photosCount = photosList.length;
  const isExtraPhotosSelected = photosCount > 3;
  const extraPhotosCount = Math.max(0, photosCount - 3);
  const extraPhotoFee = isExtraPhotosSelected ? 30 : 0; // ৳ 30 fee for 4 to 7 photos
  const promotionFee = promotionPackage === 'urgent' ? 199 : (promotionPackage === 'featured' ? 499 : 0);
  const totalAdFee = extraPhotoFee + promotionFee;
  const isPaidAd = totalAdFee > 0;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const remainingSlots = 7 - photosList.length;
      if (remainingSlots <= 0) {
        alert(lang === 'bn' ? 'সর্বোচ্চ ৭টি ছবি যোগ করা যাবে।' : 'Maximum 7 photos allowed.');
        return;
      }
      const filesToProcess = Array.from(files).slice(0, remainingSlots);
      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setPhotosList(prev => {
              if (prev.length >= 7) return prev;
              return [...prev, reader.result as string];
            });
          }
        };
        reader.readAsDataURL(file);
      });
    }
    e.target.value = '';
  };

  const handleRemovePhoto = (index: number) => {
    setPhotosList(prev => prev.filter((_, i) => i !== index));
  };

  const executePostAd = (paymentData: {
    isPaidAd: boolean;
    paymentStatus: 'paid' | 'free' | 'unpaid';
    paidAmount: number;
    expectedPackageAmount?: number;
    paymentMatchStatus?: 'matched' | 'mismatched' | 'pending_review';
    paymentGateway?: 'bKash' | 'Nagad' | 'Rocket' | 'Wallet';
    paymentTrxId?: string;
    paidAt?: string;
    paymentBreakdown?: {
      extraPhotosFee: number;
      promotionFee: number;
      packageName: string;
      expectedAmount?: number;
    };
  }) => {
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
      validationStatus: 'Received',
      status: 'pending',
      urgent: promotionPackage === 'urgent',
      featured: promotionPackage === 'featured',
      isPaidAd: paymentData.isPaidAd,
      paymentStatus: paymentData.paymentStatus,
      paidAmount: paymentData.paidAmount,
      expectedPackageAmount: paymentData.expectedPackageAmount ?? (paymentData.isPaidAd ? totalAdFee : 0),
      paymentMatchStatus: paymentData.paymentMatchStatus ?? (paymentData.isPaidAd ? (paymentData.paidAmount >= totalAdFee ? 'matched' : 'mismatched') : 'matched'),
      paymentGateway: paymentData.paymentGateway,
      paymentTrxId: paymentData.paymentTrxId,
      paidAt: paymentData.paidAt,
      paymentBreakdown: paymentData.paymentBreakdown,
      specs: category === 'property' ? propertySpecs : undefined
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) {
      alert(lang === 'bn' ? 'বিজ্ঞাপনের শিরোনাম এবং মূল্য লিখুন' : 'Please provide title and price');
      return;
    }

    if (photosList.length === 0) {
      alert(lang === 'bn' ? 'অনুগ্রহ করে পণ্যের অন্তত একটি ছবি যোগ বা আপলোড করুন।' : 'Please upload at least one photo of your item.');
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

    // CRITICAL: If any Paid option chosen (Urgent, Featured, or Extra photos > 3)
    // The user MUST proceed through the payment gateway! Unpaid ads cannot be posted!
    if (isPaidAd) {
      setModalStep('payment');
      return;
    }

    // Free ad submission (within quota, <= 3 photos, free promo)
    executePostAd({
      isPaidAd: false,
      paymentStatus: 'free',
      paidAmount: 0,
      expectedPackageAmount: 0,
      paymentMatchStatus: 'matched',
      paymentBreakdown: {
        extraPhotosFee: 0,
        promotionFee: 0,
        packageName: 'সাধারণ বিজ্ঞাপন (ফ্রি কোটা ৳০)',
        expectedAmount: 0
      }
    });

    setActiveModal(null);
  };

  const handleConfirmPaymentAndPost = () => {
    if (selectedGateway === 'Wallet') {
      const userBal = currentUser?.walletBalance || 0;
      if (userBal < totalAdFee) {
        alert(lang === 'bn' ? `আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই (বর্তমান: ৳${userBal})। অনুগ্রহ করে বিকাশ বা নগদ নির্বাচন করুন।` : 'Insufficient wallet balance. Please choose bKash or Nagad.');
        return;
      }
    }

    if (paymentMode === 'manual' && !manualTrxIdInput.trim()) {
      alert(lang === 'bn' ? 'অনুগ্রহ করে প্রাপ্ত ট্রানজেকশন আইডি (TrxID) লিখুন।' : 'Please enter the Transaction ID.');
      return;
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      let finalTrxId = '';
      if (paymentMode === 'manual' && manualTrxIdInput.trim()) {
        finalTrxId = manualTrxIdInput.trim().toUpperCase();
      } else {
        const prefix = selectedGateway === 'bKash' ? 'BK' : selectedGateway === 'Nagad' ? 'NG' : selectedGateway === 'Rocket' ? 'RK' : 'WAL';
        finalTrxId = `TRX-${prefix}${Math.floor(100000 + Math.random() * 900000)}`;
      }

      const nowTime = new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const packageName = promotionPackage === 'urgent' && isExtraPhotosSelected 
        ? 'জরুরি দ্রুত বিক্রি + অতিরিক্ত ফটো প্যাক'
        : promotionPackage === 'featured' && isExtraPhotosSelected
        ? 'ফিচার্ড টপ পিন + অতিরিক্ত ফটো প্যাক'
        : promotionPackage === 'urgent'
        ? 'জরুরি বিক্রি প্যাকেজ (Urgent Hot)'
        : promotionPackage === 'featured'
        ? 'ফিচার্ড বিজ্ঞাপন প্যাকেজ (Featured Top Pin)'
        : 'অতিরিক্ত ফটো প্যাক (৪-৭টি ছবি)';

      const receipt = {
        trxId: finalTrxId,
        amount: totalAdFee,
        gateway: selectedGateway,
        date: nowTime,
        packageName,
        adTitle: title
      };

      setCompletedPaymentReceipt(receipt);

      // Execute actual ad creation with payment proof
      executePostAd({
        isPaidAd: true,
        paymentStatus: 'paid',
        paidAmount: totalAdFee,
        expectedPackageAmount: totalAdFee,
        paymentMatchStatus: 'matched',
        paymentGateway: selectedGateway,
        paymentTrxId: finalTrxId,
        paidAt: nowTime,
        paymentBreakdown: {
          extraPhotosFee: extraPhotoFee,
          promotionFee,
          packageName,
          expectedAmount: totalAdFee
        }
      });

      setIsProcessingPayment(false);
      setModalStep('success');
    }, 1200);
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

        {/* Form or Payment Steps */}
        {modalStep === 'form' ? (
          /* Content Form */
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          
          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.categoryLabel} *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                        setPropertySize('৫ কাঠা');
                      } else if (val === 'shop') {
                        setPropertySize('২০০ স্কয়ার ফিট');
                      } else {
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

            {/* Upload Area & Selected Photos Strip */}
            {photosList.length === 0 ? (
              <label className="w-full py-6 sm:py-8 border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-white hover:bg-emerald-50/40 rounded-xl flex flex-col items-center justify-center cursor-pointer text-slate-600 hover:text-emerald-700 transition-all group">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#007460] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-xs">
                  <Camera className="w-6 h-6 text-[#007460]" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-800">
                  পণ্যের আসল ছবি আপলোড করুন (ছবি যোগ করুন)
                </span>
                <span className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>মোবাইল গ্যালারি বা ক্যামেরা থেকে ১-৭টি ছবি নির্বাচন করুন</span>
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            ) : (
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
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute bottom-1 right-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-0.5 shadow-md cursor-pointer transition-transform hover:scale-110"
                      title="ছবি মুছুন"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Add More Photo Button */}
                {photosList.length < 7 && (
                  <label className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-white hover:bg-emerald-50/50 flex flex-col items-center justify-center cursor-pointer text-slate-500 hover:text-emerald-700 transition-colors shrink-0">
                    <Upload className="w-5 h-5 mb-0.5" />
                    <span className="text-[9px] font-semibold text-center leading-tight">আরও ছবি<br/>যোগ করুন</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            )}

            {/* Extra Photo Notice if 4 to 7 photos selected */}
            {isExtraPhotosSelected && (
              <div className="p-3 bg-amber-100/80 border border-amber-300 rounded-lg text-xs space-y-1.5 mt-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>অতিরিক্ত {extraPhotosCount}টি ছবির প্রিমিয়াম প্যাক (মোট {photosCount}টি ছবি)</span>
                  </div>
                  <span className="font-mono font-bold text-amber-900 bg-amber-200/90 px-2 py-0.5 rounded text-[11px]">
                    ফি: ৳ ৩০
                  </span>
                </div>
                <p className="text-[11px] text-amber-900">
                  ৩টির বেশি ৪ থেকে ৭টি ছবি থাকলে ক্রেতারা পণ্যটি সবদিক থেকে যাচাই করতে পারেন এবং দ্রুত বিশ্বাস অর্জন করা যায়। এই ফি পরবর্তী ধাপে বিকাশ/নগদ বা ওয়ালেট দিয়ে পরিশোধ করতে হবে।
                </p>
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
                <div className="text-[11px] font-mono text-rose-700 font-bold mt-0.5">৳ ১৯৯ (bKash/Nagad)</div>
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
                <div className="text-[11px] font-mono text-amber-800 font-bold mt-0.5">৳ ৪৯৯ (bKash/Nagad)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">৭ দিন সবার উপরে পিন থাকবে</div>
              </label>
            </div>
          </div>

          {/* Dynamic Billing Summary Box */}
          {isPaidAd ? (
            <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-700" />
                  <span>পেইড বিজ্ঞাপন বিলিং সারাংশ (পেমেন্ট আবশ্যক)</span>
                </span>
                <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-800" />
                  <span>পেমেন্ট ছাড়া পোস্ট হবে না</span>
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700 bg-white/90 p-2.5 rounded-lg border border-amber-200">
                {isExtraPhotosSelected && (
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-600">📸 অতিরিক্ত {extraPhotosCount}টি ছবি ফি ({photosCount}টি ছবি):</span>
                    <span className="font-mono font-bold text-slate-900">৳ {extraPhotoFee}</span>
                  </div>
                )}
                {promotionPackage === 'urgent' && (
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="flex items-center gap-1.5 text-rose-900 font-medium">
                      <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                      <span>জরুরি দ্রুত বিক্রি প্যাকেজ (Urgent Hot Badge):</span>
                    </span>
                    <span className="font-mono font-bold text-rose-700">৳ ১৯৯</span>
                  </div>
                )}
                {promotionPackage === 'featured' && (
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="flex items-center gap-1.5 text-amber-900 font-medium">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span>ফিচার্ড সবার উপরে পিন প্যাকেজ (৭ দিন):</span>
                    </span>
                    <span className="font-mono font-bold text-amber-800">৳ ৪৯৯</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-1.5 flex justify-between items-center font-bold text-slate-950 text-xs">
                  <span>সর্বমোট প্রদেয় ফি:</span>
                  <span className="font-mono text-emerald-800 text-sm font-extrabold">৳ {totalAdFee}</span>
                </div>
              </div>

              <div className="text-[11px] text-amber-900 font-medium flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <span>পরবর্তী ধাপে বিকাশ, নগদ, রকেট বা ওয়ালেট দিয়ে ৳{totalAdFee} পরিশোধ নিশ্চিত করে বিজ্ঞাপন প্রকাশ করতে হবে। পেমেন্ট সম্পন্ন না করা পর্যন্ত বিজ্ঞাপনটি অপেক্ষামান থাকবে।</span>
              </div>
            </div>
          ) : (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-900 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>১-৩টি ছবি ও সাধারণ বিজ্ঞাপনে কোনো ফি নেই</span>
              </div>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                ৳ ০ (সম্পূর্ণ ফ্রি)
              </span>
            </div>
          )}

          {/* Prohibited Products & Business Policy Disclaimer */}
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

          {/* Submit Action Button */}
          <div className="pt-2">
            {isPaidAd ? (
              <button
                type="submit"
                disabled={!policyAgreed}
                className={`w-full py-3 text-slate-950 font-bold text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 ${
                  policyAgreed 
                    ? 'bg-[#ffc800] hover:bg-[#e6b400] cursor-pointer active:scale-[0.99]' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CreditCard className="w-4 h-4 text-slate-950" />
                <span>পেমেন্ট করুন ও বিজ্ঞাপন পোস্ট করুন (মোট ৳{totalAdFee})</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            ) : (
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
                <span>সম্পূর্ণ বিনামূল্যে বিজ্ঞাপন প্রকাশ করুন (৳০)</span>
              </button>
            )}
          </div>

        </form>
        ) : modalStep === 'payment' ? (
          /* STEP 2: Realistic Payment Gateway Screen */
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
            
            {/* Payment Step Top Alert */}
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-950 text-xs">বিজ্ঞাপন ফি পরিশোধ গেটওয়ে (Ad Promotion Payment)</h4>
                <p className="text-[11px] text-amber-900 mt-0.5">
                  আপনি অতিরিক্ত ছবি বা জরুরি/ফিচার্ড প্রমোশন প্যাকেজ নির্বাচন করেছেন। পেমেন্ট সম্পন্ন না করা পর্যন্ত বিজ্ঞাপনটি লাইভ হবে না।
                </p>
              </div>
            </div>

            {/* Bill Summary Invoice */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <Receipt className="w-4 h-4 text-[#007460]" />
                  <span>বিলিং ইনভয়েস বিবরণ</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  অর্ডার টাইপ: বিজ্ঞাপন প্রমোশন
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">বিজ্ঞাপনের শিরোনাম:</span>
                  <span className="font-bold text-slate-900 max-w-[240px] truncate">{title}</span>
                </div>
                {isExtraPhotosSelected && (
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-600">অতিরিক্ত {extraPhotosCount}টি ছবি ফি ({photosCount}টি ছবি):</span>
                    <span className="font-mono font-bold text-slate-900">৳ {extraPhotoFee}</span>
                  </div>
                )}
                {promotionPackage === 'urgent' && (
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-rose-900 font-medium">🔥 জরুরি বিক্রি প্যাকেজ (Urgent Hot):</span>
                    <span className="font-mono font-bold text-rose-700">৳ ১৯৯</span>
                  </div>
                )}
                {promotionPackage === 'featured' && (
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-amber-900 font-medium">⭐ ফিচার্ড বিজ্ঞাপন প্যাকেজ (Top Pin ৭ দিন):</span>
                    <span className="font-mono font-bold text-amber-800">৳ ৪৯৯</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-2 flex justify-between items-center font-bold text-slate-950 text-sm">
                  <span>সর্বমোট প্রদেয় ফি:</span>
                  <span className="font-mono text-emerald-800 text-base font-black">৳ {totalAdFee}</span>
                </div>
              </div>
            </div>

            {/* Choose Payment Method */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                পেমেন্ট মাধ্যম নির্বাচন করুন *
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* bKash */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('bKash')}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                    selectedGateway === 'bKash' 
                      ? 'border-[#e2136e] bg-pink-50 ring-2 ring-[#e2136e]/30' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-[#e2136e] text-xs">bKash</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">বিকাশ ওয়ালেট</div>
                </button>

                {/* Nagad */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('Nagad')}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                    selectedGateway === 'Nagad' 
                      ? 'border-[#f7941d] bg-orange-50 ring-2 ring-[#f7941d]/30' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-[#f7941d] text-xs">Nagad</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">নগদ ওয়ালেট</div>
                </button>

                {/* Rocket */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('Rocket')}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                    selectedGateway === 'Rocket' 
                      ? 'border-[#8c3494] bg-purple-50 ring-2 ring-[#8c3494]/30' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-[#8c3494] text-xs">Rocket</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">রকেট ওয়ালেট</div>
                </button>

                {/* Wallet Balance */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('Wallet')}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                    selectedGateway === 'Wallet' 
                      ? 'border-[#007460] bg-emerald-50 ring-2 ring-[#007460]/30' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-[#007460] text-xs">ওয়ালেট ব্যালেন্স</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-mono">৳ {currentUser?.walletBalance || 50}</div>
                </button>
              </div>
            </div>

            {/* Gateway Modes: Instant Gateway Simulation vs Manual TrxID Entry */}
            {selectedGateway !== 'Wallet' ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('instant')}
                    className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                      paymentMode === 'instant' ? 'bg-[#007460] text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    ⚡ অটো গেটওয়ে (OTP & PIN)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('manual')}
                    className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                      paymentMode === 'manual' ? 'bg-[#007460] text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    📝 সরাসরি TrxID এন্ট্রি
                  </button>
                </div>

                {paymentMode === 'instant' ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          আপনার {selectedGateway} নম্বর
                        </label>
                        <input
                          type="tel"
                          value={gatewayPhoneInput}
                          onChange={(e) => setGatewayPhoneInput(e.target.value)}
                          placeholder="01XXXXXXXXX"
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono text-xs bg-white text-slate-900 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          ৪ ডিজিট OTP কোড (সিমুলেটেড)
                        </label>
                        <input
                          type="text"
                          value={gatewayOtpInput}
                          onChange={(e) => setGatewayOtpInput(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono text-xs bg-white text-slate-900 font-bold tracking-widest text-center"
                        />
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{selectedGateway} সিকিউর গেটওয়ে সার্ভার থেকে তাৎক্ষণিক ওটিপি ভেরিফিকেশন ও ট্রানজেকশন প্রসেসিং।</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-900 space-y-1">
                      <p><strong>ধাপ ১:</strong> আপনার {selectedGateway} অ্যাপ থেকে আমাদের মার্চেন্ট অ্যাকাউন্টে <strong>৳ {totalAdFee}</strong> পাঠান।</p>
                      <p><strong>মার্চেন্ট নম্বর:</strong> <span className="font-mono font-bold text-blue-950">01700-112233</span> (বিক্রয়মেলা সার্ভিস)</p>
                      <p><strong>রেফারেন্স:</strong> <span className="font-mono font-bold text-blue-950">AD-PROMO</span></p>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        প্রাপ্ত ট্রানজেকশন আইডি (TrxID) লিখুন *
                      </label>
                      <input
                        type="text"
                        value={manualTrxIdInput}
                        onChange={(e) => setManualTrxIdInput(e.target.value)}
                        placeholder="যেমন: BK92841X বা NG77182"
                        className="w-full px-3 py-2 border border-slate-300 rounded font-mono text-xs uppercase font-bold text-slate-900 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-950">🎁 ওয়ালেট বোনাস থেকে পেমেন্ট</span>
                  <span className="font-mono font-bold text-emerald-800">ব্যালেন্স: ৳{currentUser?.walletBalance || 50}</span>
                </div>
                <p className="text-[11px] text-emerald-900">
                  {(currentUser?.walletBalance || 50) >= totalAdFee 
                    ? `আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স আছে। নিশ্চিত করলে স্বয়ংক্রিয়ভাবে ওয়ালেট থেকে ৳${totalAdFee} কেটে নেওয়া হবে।` 
                    : `আপনার ওয়ালেট ব্যালেন্স (৳${currentUser?.walletBalance || 50}) প্রদেয় ফি (৳${totalAdFee}) থেকে কম। অনুগ্রহ করে বিকাশ বা নগদ গেটওয়ে নির্বাচন করুন।`}
                </p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalStep('form')}
                className="px-4 py-2.5 border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>ফিরে যান ও তথ্য পরিবর্তন করুন</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmPaymentAndPost}
                disabled={isProcessingPayment}
                className="flex-1 py-3 bg-[#007460] hover:bg-[#005e4e] text-white font-bold text-xs sm:text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>পেমেন্ট ও ভেরিফিকেশন চলছে...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-200" />
                    <span>পেমেন্ট নিশ্চিত করুন ও পোস্ট করুন (৳{totalAdFee})</span>
                  </>
                )}
              </button>
            </div>

          </div>
        ) : (
          /* STEP 3: Payment Success Voucher Screen */
          <div className="p-6 text-center space-y-4 my-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm animate-in zoom-in-75">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">🎉 পেমেন্ট সফল হয়েছে ও বিজ্ঞাপন অনুমোদনের জন্য পাঠানো হয়েছে!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                আপনার নির্বাচিত প্যাকেজের বিজ্ঞাপন ফি সফলভাবে পরিশোধিত হয়েছে। এডমিন টাকা প্রাপ্তি ও নীতিমালা যাচাই করে অল্প সময়ের মধ্যেই বিজ্ঞাপনটি সাইটে লাইভ করবেন।
              </p>
            </div>

            {/* Official Payment Voucher Card */}
            {completedPaymentReceipt && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-2 font-sans shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-800">ডিজিটাল পেমেন্ট রিসিট ভাউচার</span>
                  <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    PAID & VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-500 block">ট্রানজেকশন আইডি (TrxID):</span>
                    <span className="font-mono font-bold text-slate-900">{completedPaymentReceipt.trxId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">পরিশোধিত ফি:</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">৳ {completedPaymentReceipt.amount}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">পেমেন্ট মেথড:</span>
                    <span className="font-semibold text-slate-800">{completedPaymentReceipt.gateway}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">প্যাকেজ:</span>
                    <span className="font-semibold text-slate-800 truncate block">{completedPaymentReceipt.packageName}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block">বিজ্ঞাপনের শিরোনাম:</span>
                    <span className="font-bold text-slate-900">{completedPaymentReceipt.adTitle}</span>
                  </div>
                  <div className="col-span-2 text-[10px] text-slate-400">
                    তারিখ ও সময়: {completedPaymentReceipt.date}
                  </div>
                </div>
              </div>
            )}

            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-left text-xs text-blue-900 max-w-md mx-auto flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>এডমিন নোটিশ:</strong> এই ট্রানজেকশনটি অ্যাডমিন প্যানেলের <strong>"০২. সব লেনদেন মনিটর"</strong> এবং <strong>"০১. বিজ্ঞাপন অনুমোদন ও নিয়ন্ত্রণ"</strong> টেবিলে সম্পূর্ণ ফি বিবরণ সহ যুক্ত হয়েছে।
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 bg-[#007460] hover:bg-[#005e4e] text-white font-bold text-xs rounded-lg shadow-md transition-colors cursor-pointer"
              >
                বিজ্ঞাপন তালিকা ও মার্কেটপ্লেসে ফিরে যান
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
