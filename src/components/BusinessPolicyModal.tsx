import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldAlert, AlertTriangle, CheckCircle, Ban, Lock, FileCheck, PhoneCall } from 'lucide-react';

export const BusinessPolicyModal: React.FC = () => {
  const { lang, isPolicyModalOpen, setIsPolicyModalOpen, siteName } = useApp();

  if (!isPolicyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full text-slate-800 overflow-hidden my-auto border border-amber-300 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-red-950 px-5 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30 text-amber-300 shrink-0">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {lang === 'bn' ? `${siteName} – বিজনেস পলিসি ও আইনি দায়মুক্তি` : `${siteName} – Business Policy & Disclaimer`}
              </h3>
              <p className="text-xs text-amber-200 mt-0.5">
                {lang === 'bn' ? 'অবৈধ পণ্য ক্রয়-বিক্রয় নিষিদ্ধকরণ ও ব্যবহারের শর্তাবলী' : 'Prohibited items policy and terms of platform use'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPolicyModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto text-xs leading-relaxed">
          
          {/* Main Official Declaration Callout */}
          <div className="p-4 bg-gradient-to-br from-rose-50 via-red-50 to-amber-50 border-2 border-rose-400 rounded-xl shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 font-bold text-base mt-0.5">
                !
              </div>
              <div className="space-y-1.5">
                <h4 className="font-black text-rose-950 text-sm tracking-wide">
                  {lang === 'bn' ? '⚠️ কঠোর আইনি সতর্কতা ও মূল বিজনেস পলিসি:' : '⚠️ Strict Legal Notice & Core Policy:'}
                </h4>
                <p className="text-slate-900 font-bold leading-normal text-xs sm:text-[13px]">
                  "অবৈধ ও নিষিদ্ধ পণ্য ক্রয়-বিক্রয় থেকে সম্পূর্ণ বিরত থাকুন। প্ল্যাটফর্মের মাধ্যমে কোনো প্রকার অবৈধ, অননুমোদিত বা ক্ষতিকর সামগ্রীর লেনদেন কঠোরভাবে নিষিদ্ধ। কোনো ব্যবহারকারী এর ব্যত্যয় ঘটালে কিংবা প্রতারণামূলক কার্যকলাপে লিপ্ত হলে— <span className="text-rose-700 underline font-black">এতে কর্তৃপক্ষ কোনো ভাবেই দায়ী থাকবে না।</span>"
                </p>
              </div>
            </div>
          </div>

          {/* Core Terms Breakdown */}
          <div className="space-y-3">
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b pb-1">
              <Ban className="w-4 h-4 text-rose-600" />
              <span>১. নিষিদ্ধ ও অবৈধ পণ্যের তালিকা (Prohibited Items)</span>
            </h5>
            <p className="text-slate-600">
              নিম্নলিখিত পণ্যসমূহ বা সেবাসমূহ প্ল্যাটফর্মে বিজ্ঞাপন দেওয়া, প্রদর্শন করা কিংবা কেনাবেচা করা সম্পূর্ণ নিষিদ্ধ:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-medium text-slate-700">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>অস্ত্র, গোলাবারুদ, বিস্ফোরক ও আতশবাজি</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>মাদকদ্রব্য, অ্যালকোহল ও অবৈধ ওষুধ</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>চোরাই পণ্য, নকল নথি ও জাল সনদপত্র</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>অনুমোদনহীন আর্থিক স্কিম বা পিরামিড স্কিম</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>বন্যপ্রাণী ও পরিবেশ আইনের পরিপন্থী সামগ্রী</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>কপিরাইট ও ট্রেডমার্ক লঙ্ঘনকারী নকল পণ্য</span>
              </div>
            </div>
          </div>

          {/* 3 Months Expiry Policy */}
          <div className="space-y-2 p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl">
            <h5 className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-amber-700" />
              <span>২. ৩ মাসের বিজ্ঞাপন পলিসি ও অটো-ডিলিট সিস্টেম (3 Months Expiry)</span>
            </h5>
            <p className="text-amber-900 leading-relaxed text-[11px]">
              বিজ্ঞাপন পোস্ট করার পর যদি ৩ মাস (৯০ দিন) সময় অতিবাহিত হয়ে যায় এবং পণ্যটি বিক্রি না হয়, তবে সিস্টেমের স্বচ্ছতা বজায় রাখতে বিজ্ঞাপনটি স্বয়ংক্রিয়ভাবে মুছে ফেলা হতে পারে। এছাড়াও কোনো বিজ্ঞাপন পলিসি লঙ্ঘন করলে এডমিন তাৎক্ষণিকভাবে সুনির্দিষ্ট কারণ উল্লেখ করে তা মুছে ফেলার সম্পূর্ণ অধিকার সংরক্ষণ করেন।
            </p>
          </div>

          {/* Authority Disclaimer */}
          <div className="space-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-700" />
              <span>৩. কর্তৃপক্ষের দায়মুক্তি ও ব্যবহারকারীর দায়িত্ব (Limitation of Liability)</span>
            </h5>
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside text-[11px]">
              <li>{siteName} মূলত একটি ক্লাসিফাইড বিজ্ঞাপন ও এসক্রো ট্রাস্ট প্ল্যাটফর্ম। ক্রেতা ও বিক্রেতা নিজ দায়িত্বে পণ্যের গুণগত মান, শর্ত ও মালিকানা যাচাই করে লেনদেন করবেন।</li>
              <li>প্ল্যাটফর্মের বাইরে কোনো গোপন বা বেআইনি লেনদেন সংঘটিত হলে তার জন্য কর্তৃপক্ষ কোনোভাবেই দায়বদ্ধ থাকবে না।</li>
              <li>আইনশৃঙ্খলা রক্ষাকারী বাহিনীর চাহিদা মোতাবেক অবৈধ কার্যকলাপে জড়িত যে কারো আইপি ও তথ্য প্রকাশ করা হবে।</li>
            </ul>
          </div>

          {/* Safe Escrow Advisory */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>নিরাপদ থাকতে সবসময় এসক্রো (Escrow) পেমেন্ট ব্যবহার করুন।</span>
            </div>
            <span className="text-[10px] bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded font-mono font-bold">
              ১০০% মানিব্যাক
            </span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
            <span>আইনি বা পলিসি রিপোর্ট: support@bikroymela.com</span>
          </div>
          
          <button
            type="button"
            onClick={() => setIsPolicyModalOpen(false)}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs transition-colors"
          >
            {lang === 'bn' ? 'আমি বুঝতে পেরেছি ও সম্মত' : 'I Understand & Agree'}
          </button>
        </div>

      </div>
    </div>
  );
};
