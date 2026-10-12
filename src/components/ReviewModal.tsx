import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  User, 
  Award,
  Sparkles
} from 'lucide-react';

export const ReviewModal: React.FC = () => {
  const { 
    lang, 
    activeModal, 
    setActiveModal, 
    currentUser, 
    selectedAd, 
    addReview 
  } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [submitted, setSubmitted] = useState(false);

  if (activeModal !== 'addReview') return null;

  const targetName = selectedAd?.sellerName || 'তানভীর আহমেদ (সেলার)';
  const adTitle = selectedAd?.titleBn || 'iPhone 14 Pro Max 256GB Deep Purple';
  const targetUserId = selectedAd?.sellerId || 'user-002';

  const starLabels: Record<number, string> = {
    1: 'সন্তোষজনক নয় (১/৫)',
    2: 'মোটামুটি (২/৫)',
    3: 'ভালো (৩/৫)',
    4: 'খুব ভালো (৪/৫)',
    5: 'অসাধারণ ও শতভাগ বিশ্বস্ত (৫/৫)'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert(lang === 'bn' ? 'অনুগ্রহ করে আপনার অভিজ্ঞতা সম্পর্কে একটি মন্তব্য লিখুন' : 'Please provide a comment about your experience');
      return;
    }

    addReview({
      adTitle,
      reviewerName: currentUser?.name || 'সম্মানিত ব্যবহারকারী',
      targetUserId,
      rating,
      comment,
      role
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setActiveModal(null);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full text-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col border border-slate-200">
        
        {/* Header */}
        <div className="p-4 bg-[#007460] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
            <h3 className="font-bold text-base">
              {lang === 'bn' ? 'স্টার রেটিং ও রিভিউ প্রদান' : 'Submit Rating & Review'}
            </h3>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="text-white hover:text-emerald-200 p-1 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-[#007460] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-base text-slate-900">
                রিভিউ সফলভাবে জমা দেওয়া হয়েছে!
              </h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                আপনার মূল্যবান মতামতের জন্য ধন্যবাদ। আপনার একাউন্টে <strong>+১০ রিওয়ার্ড পয়েন্ট</strong> যোগ হয়েছে।
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Target info card */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="text-[11px] text-slate-500 font-medium">লেনদেন ও ব্যবহারকারী:</div>
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#007460]" />
                  <span>{targetName}</span>
                </div>
                <div className="text-[11px] text-slate-600 truncate">
                  পণ্য: {adTitle}
                </div>
              </div>

              {/* Role Toggle */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  আপনি এই লেনদেনে ছিলেন:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`py-2 px-3 rounded-lg border font-semibold transition-all cursor-pointer ${
                      role === 'buyer'
                        ? 'bg-emerald-50 border-[#007460] text-[#007460] ring-1 ring-[#007460]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🛍️ আমি ক্রেতা (Buyer)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('seller')}
                    className={`py-2 px-3 rounded-lg border font-semibold transition-all cursor-pointer ${
                      role === 'seller'
                        ? 'bg-emerald-50 border-[#007460] text-[#007460] ring-1 ring-[#007460]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🏷️ আমি বিক্রেতা (Seller)
                  </button>
                </div>
              </div>

              {/* Star Rating Interactive Selector */}
              <div className="text-center py-2 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
                <span className="font-bold text-xs text-slate-800 block">
                  স্টার নির্বাচন করুন (১ থেকে ৫ স্টার):
                </span>
                
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            active
                              ? 'fill-amber-400 text-amber-500'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs font-bold text-amber-900">
                  {starLabels[hoverRating || rating]}
                </div>
              </div>

              {/* Review Comment */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  আপনার মতামত বা মন্তব্য লিখুন:
                </label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="যেমন: পণ্যটি যেমন বর্ণনা করা হয়েছিল তেমনই ছিল। সময়মতো ডেলিভারি পেয়েছি এবং বিক্রেতা অত্যন্ত ভদ্র।"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#007460] focus:outline-none"
                />
              </div>

              {/* Incentive Callout */}
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-[11px] text-emerald-900">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>রিভিউ সাবমিট করলেই আপনার প্রোফাইলে <strong>১০ রিওয়ার্ড পয়েন্ট</strong> যুক্ত হবে!</span>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#007460] hover:bg-[#005e4e] text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
                >
                  রিভিউ প্রকাশ করুন
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
