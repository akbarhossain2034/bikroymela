import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Gift, 
  HelpCircle,
  Coins
} from 'lucide-react';

export const DeleteAdReasonModal: React.FC = () => {
  const { 
    lang, 
    adToDelete, 
    setAdToDelete, 
    deleteAdWithReason, 
    currentUser 
  } = useApp();

  const [selectedReason, setSelectedReason] = useState<string>('sold_on_platform');
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  if (!adToDelete) return null;

  const currentWallet = currentUser?.walletBalance ?? 50;

  const reasons = [
    {
      id: 'sold_on_platform',
      titleBn: '১. বিক্রয়মেলা (BikroyMela) প্ল্যাটফর্মের মাধ্যমেই সফলভাবে বিক্রি হয়েছে',
      titleEn: '1. Successfully sold through BikroyMela platform',
      badgeBn: 'বোনাস: +১০ রিওয়ার্ড পয়েন্ট',
      badgeEn: 'Bonus: +10 Reward Points',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      fee: 0,
      descriptionBn: 'অভিনন্দন! সাইটের মাধ্যমে সফল বিক্রির জন্য আপনার প্রোফাইলে ১০টি রিওয়ার্ড পয়েন্ট যোগ হবে। কোনো ফি নেই।'
    },
    {
      id: 'sold_offline_leakage',
      titleBn: '২. ক্রেতার সাথে সাইটে যোগাযোগ হয়েছিল, কিন্তু বাইরে অফলাইনে বিক্রি করেছি',
      titleEn: '2. Buyer contacted via site, but sold offline outside',
      badgeBn: 'ফি: ১০ টাকা ধার্য হবে',
      badgeEn: 'Fee: 10 Tk will be charged',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      fee: 10,
      isOutsideSale: true,
      descriptionBn: 'সতর্কতা: সাইট থেকে ক্রেতার সন্ধান পেয়ে প্ল্যাটফর্ম এড়িয়ে লেনদেন করলে কোনো এসক্রো সুরক্ষা পাওয়া যায় না। নিয়ম অনুযায়ী আপনার স্বাগতম বোনাস ওয়ালেট থেকে নামমাত্র ১০ টাকা সার্ভার চার্জ সমন্বয় করা হবে।'
    },
    {
      id: 'cancelled_by_seller',
      titleBn: '৩. পণ্যটি আপাতত আর বিক্রি করতে চাচ্ছি না (স্থগিত)',
      titleEn: '3. Do not want to sell anymore (Cancelled)',
      badgeBn: 'ফি: ৳০ (ফ্রি)',
      badgeEn: 'Fee: 0 Tk (Free)',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
      fee: 0,
      descriptionBn: 'পণ্যটি বিক্রি না করে বিজ্ঞাপন প্রত্যাহার করা সম্পূর্ণ বিনামূল্যে।'
    },
    {
      id: 'repost_correct_info',
      titleBn: '৪. বিজ্ঞাপনের তথ্য বা মূল্যে ভুল হয়েছিল, পুনরায় সঠিক তথ্য দিয়ে পোস্ট করব',
      titleEn: '4. Information or price had error, will repost correctly',
      badgeBn: 'ফি: ৳০ (ফ্রি)',
      badgeEn: 'Fee: 0 Tk (Free)',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      fee: 0,
      descriptionBn: 'তথ্য সংশোধনের জন্য বিজ্ঞাপন মুছে ফেলে নতুন বিজ্ঞাপন দেওয়া সম্পূর্ণ ফ্রি।'
    }
  ];

  const handleConfirmDelete = () => {
    const isFeeRequired = selectedReason === 'sold_offline_leakage';

    if (isFeeRequired && currentWallet < 10) {
      alert(lang === 'bn' 
        ? 'আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই। তবে সতর্কতামূলক নোটিশ সহ বিজ্ঞাপনটি মুছে ফেলা হলো।' 
        : 'Insufficient wallet balance. Ad will be removed with advisory notice.');
    }

    deleteAdWithReason(adToDelete.id, selectedReason, isFeeRequired);

    if (isFeeRequired) {
      setFeedbackSuccess(lang === 'bn' 
        ? 'বিজ্ঞাপন মুছে ফেলা হয়েছে। নীতিমালা অনুযায়ী ওয়ালেট থেকে ১০ টাকা সমন্বয় করা হয়েছে।' 
        : 'Ad deleted. 10 Tk fee adjusted from bonus wallet per platform policy.');
    } else if (selectedReason === 'sold_on_platform') {
      setFeedbackSuccess(lang === 'bn'
        ? 'অভিনন্দন! সফল বিক্রির জন্য আপনার একাউন্টে +১০ রিওয়ার্ড পয়েন্ট যোগ হয়েছে।'
        : 'Congratulations! +10 Reward points credited for successful in-app trade.');
    } else {
      setFeedbackSuccess(lang === 'bn' ? 'বিজ্ঞাপন সফলভাবে মুছে ফেলা হয়েছে।' : 'Ad removed successfully.');
    }

    setTimeout(() => {
      setFeedbackSuccess(null);
      setAdToDelete(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full text-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col border border-slate-200">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-sm sm:text-base">
              বিজ্ঞাপন মুছে ফেলার কারণ নির্বাচন করুন
            </h3>
          </div>
          <button
            onClick={() => setAdToDelete(null)}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">

          {feedbackSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedbackSuccess}</span>
            </div>
          )}

          {/* Ad preview snippet */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
            <img 
              src={adToDelete.images[0]} 
              alt={adToDelete.titleBn} 
              className="w-14 h-14 object-cover rounded-lg border border-slate-200 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                {adToDelete.titleBn}
              </h4>
              <div className="text-xs font-mono font-bold text-[#007460] mt-0.5">
                ৳ {adToDelete.price.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500">
                এলাকা: {adToDelete.location.areaBn}
              </div>
            </div>
          </div>

          {/* User's wallet status callout */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-950">
              <Coins className="w-4 h-4 text-emerald-700" />
              <span>আপনার বর্তমান ওয়ালেট ব্যালেন্স:</span>
            </div>
            <span className="font-bold font-mono text-[#007460] text-sm">
              ৳ {currentWallet.toLocaleString()}
            </span>
          </div>

          {/* Prompt */}
          <div className="text-xs text-slate-600 leading-relaxed">
            মার্কেটপ্লেসের মান ও নিরাপত্তা বজায় রাখতে, অনুগ্রহ করে বিজ্ঞাপনটি সরানোর সঠিক কারণ জানান:
          </div>

          {/* Radio Options */}
          <div className="space-y-2.5">
            {reasons.map((r) => {
              const isSelected = selectedReason === r.id;
              return (
                <label
                  key={r.id}
                  className={`block p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#007460] bg-emerald-50/40 ring-1 ring-[#007460]'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="delete_reason"
                      value={r.id}
                      checked={isSelected}
                      onChange={() => setSelectedReason(r.id)}
                      className="mt-0.5 text-[#007460] focus:ring-[#007460]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-bold text-xs text-slate-900">{r.titleBn}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${r.badgeColor}`}>
                          {r.badgeBn}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        {r.descriptionBn}
                      </p>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Warning notice when offline sale is selected */}
          {selectedReason === 'sold_offline_leakage' && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs space-y-1.5 animate-in fade-in">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                <span>প্ল্যাটফর্ম লিক রোধ ও রক্ষণাবেক্ষণ নীতি:</span>
              </div>
              <p className="text-amber-900 text-[11px] leading-relaxed">
                বিক্রয়মেলায় বিনামূল্যে বিজ্ঞাপন দিয়ে ক্রেতা পাওয়ার পর বাইরে গিয়ে অফলাইনে লেনদেন করলে প্ল্যাটফর্মের সার্ভার ও প্রমোশন ব্যয় ক্ষতিগ্রস্ত হয়। 
                এজন্য আপনার <strong>৳ ৫০ ওয়েলকাম বোনাস ওয়ালেট</strong> থেকে <strong>১০ টাকা</strong> সার্ভার ফি হিসেবে কেটে রাখা হবে।
              </p>
            </div>
          )}

          {/* Reason 1 bonus notice */}
          {selectedReason === 'sold_on_platform' && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs flex items-center gap-2">
              <Gift className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-emerald-950 text-[11px]">
                ধন্যবাদ! প্ল্যাটফর্মের মাধ্যমে লেনদেন করার জন্য কোনো ফি নেওয়া হবে না এবং আপনার প্রোফাইলে <strong>১০ রিওয়ার্ড পয়েন্ট</strong> যোগ করা হবে।
              </span>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="p-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => setAdToDelete(null)}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            বাতিল করুন
          </button>

          <button
            type="button"
            onClick={handleConfirmDelete}
            className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedReason === 'sold_offline_leakage'
                ? 'bg-amber-600 hover:bg-amber-700'
                : selectedReason === 'sold_on_platform'
                ? 'bg-[#007460] hover:bg-[#005e4e]'
                : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>মুছে ফেলা নিশ্চিত করুন</span>
          </button>
        </div>

      </div>
    </div>
  );
};
