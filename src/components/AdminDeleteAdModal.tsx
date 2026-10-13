import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, AlertTriangle, ShieldAlert, CheckCircle2, FileText, Ban } from 'lucide-react';

export const AdminDeleteAdModal: React.FC = () => {
  const { lang, adminAdToDelete, setAdminAdToDelete, deleteAdWithAdminReason } = useApp();

  const [selectedReason, setSelectedReason] = useState<string>('অবৈধ বা নিষিদ্ধ পণ্য (বিজনেস পলিসি লঙ্ঘন)');
  const [customNote, setCustomNote] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

  if (!adminAdToDelete) return null;

  const predefinedReasons = [
    {
      id: 'illegal_product',
      titleBn: '১. অবৈধ বা নিষিদ্ধ পণ্য (বিজনেস পলিসি লঙ্ঘন)',
      titleEn: '1. Illegal or Prohibited Item (Business Policy Violation)',
      severity: 'high',
      descriptionBn: 'পণ্যটি প্ল্যাটফর্মের নীতিমালা ও দেশের প্রচলিত আইনের পরিপন্থী (যেমন: অনুমোদনহীন ওষুধ, অস্ত্র, চোরাই বা ক্ষতিকারক সামগ্রী)।'
    },
    {
      id: 'expired_3_months',
      titleBn: '২. ৩ মাস (৯০ দিন) অতিক্রান্ত — অবিক্রিত মেয়াদোত্তীর্ণ বিজ্ঞাপন',
      titleEn: '2. Expired after 3 months (90 days) unsold ad',
      severity: 'medium',
      descriptionBn: 'বিজ্ঞাপনটির বয়স ৩ মাসের বেশি এবং পণ্যটি বিক্রি হয়নি। প্ল্যাটফর্ম ডাটাবেজ ফ্রেশ রাখতে অটো-ক্লিন পলিসি অনুযায়ী মুছে ফেলা হচ্ছে।'
    },
    {
      id: 'fake_info_spam',
      titleBn: '৩. বিভ্রান্তিকর তথ্য, ভূয়া মূল্য বা কপিরাইট লঙ্ঘন',
      titleEn: '3. Misleading info, fake price, or copyright breach',
      severity: 'high',
      descriptionBn: 'বিজ্ঞাপনে অবাস্তব মূল্য, অস্পষ্ট/চুরি করা ছবি বা ভুল বিবরণ দেওয়া হয়েছে যা ক্রেতাদের বিভ্রান্ত করতে পারে।'
    },
    {
      id: 'seller_unreachable',
      titleBn: '৪. বিক্রেতার সাথে যোগাযোগ অসম্ভব / ভূয়া মোবাইল নম্বর',
      titleEn: '4. Seller unreachable / invalid contact number',
      severity: 'medium',
      descriptionBn: 'প্রদত্ত মোবাইল নম্বরে কল যাচ্ছে না বা বিক্রেতার কোনো সাড়া পাওয়া যাচ্ছে না।'
    },
    {
      id: 'seller_requested',
      titleBn: '৫. বিক্রেতার ব্যক্তিগত অনুরোধে বিজ্ঞাপন প্রত্যাহার',
      titleEn: '5. Deleted on seller request',
      severity: 'low',
      descriptionBn: 'বিক্রেতা নিজে বিজ্ঞাপন মুছে ফেলার অনুরোধ জানিয়েছেন।'
    },
    {
      id: 'custom_reason',
      titleBn: '৬. অন্যান্য সুনির্দিষ্ট কারণ (নোট লিখুন)',
      titleEn: '6. Other specific reason (write custom note)',
      severity: 'medium',
      descriptionBn: 'বিশেষ কোনো পরিস্থিতি বা ম্যানেজমেন্ট সিদ্ধান্ত অনুযায়ী মুছে ফেলা।'
    }
  ];

  const handleConfirmDelete = () => {
    if (selectedReason.includes('অন্যান্য') && !customNote.trim()) {
      alert(lang === 'bn' ? 'দয়া করে ডিলিট করার সুনির্দিষ্ট কারণ উল্লেখ করুন।' : 'Please provide specific reason details.');
      return;
    }

    setIsDeleting(true);
    deleteAdWithAdminReason(adminAdToDelete.id, selectedReason, customNote.trim() || undefined);
    setSuccessFeedback(
      lang === 'bn'
        ? `বিজ্ঞাপনটি সফলভাবে মুছে ফেলা হয়েছে এবং অডিট লগে কারণ সংরক্ষিত হয়েছে!`
        : 'Ad successfully deleted and reason recorded in audit log!'
    );

    setTimeout(() => {
      setIsDeleting(false);
      setSuccessFeedback(null);
      setAdminAdToDelete(null);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full text-slate-800 overflow-hidden my-auto border border-rose-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-800 to-red-900 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 text-white shrink-0">
              <ShieldAlert className="w-5 h-5 text-rose-200" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {lang === 'bn' ? 'এডমিন বিজ্ঞাপন অপসরণ ও কারণ যাচাই' : 'Admin Ad Deletion with Mandatory Reason'}
              </h3>
              <p className="text-xs text-rose-200 mt-0.5">
                {lang === 'bn' ? 'বিজ্ঞাপন ডিলিট করতে কারণ নির্বাচন করা বাধ্যতামূলক' : 'Reason is mandatory before deleting this post'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAdminAdToDelete(null)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Feedback Banner */}
        {successFeedback && (
          <div className="p-4 bg-emerald-50 border-b border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successFeedback}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          
          {/* Target Ad Info Card */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
            <img
              src={adminAdToDelete.images[0]}
              alt=""
              className="w-14 h-14 object-cover rounded-lg border border-slate-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="font-bold text-slate-900 text-sm line-clamp-1">
                {adminAdToDelete.titleBn || adminAdToDelete.titleEn}
              </span>
              <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-2 font-mono">
                <span>আইডি: {adminAdToDelete.id}</span>
                <span>•</span>
                <span className="text-emerald-700 font-bold">৳ {adminAdToDelete.price.toLocaleString()}</span>
                <span>•</span>
                <span>সেলার: {adminAdToDelete.sellerName} ({adminAdToDelete.sellerPhone})</span>
              </div>
            </div>
          </div>

          {/* Business Policy Alert */}
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2.5 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>পলিসি সতর্কতা:</strong> অবৈধ পণ্য বা মেয়াদোত্তীর্ণ বিজ্ঞাপন মুছে ফেলার সিদ্ধান্ত অডিট লগে স্থায়ীভাবে রেকর্ড হবে। বিক্রেতাকে স্বয়ংক্রিয় নোটিফিকেশনে কারণ জানিয়ে দেওয়া হবে।
            </p>
          </div>

          {/* Select Mandatory Reason */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Ban className="w-4 h-4 text-rose-600" />
              <span>ডিলিট করার সুনির্দিষ্ট কারণ নির্বাচন করুন *</span>
            </label>

            <div className="space-y-2">
              {predefinedReasons.map(r => {
                const isSelected = selectedReason === r.titleBn;
                return (
                  <label
                    key={r.id}
                    onClick={() => setSelectedReason(r.titleBn)}
                    className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/70 ring-1 ring-rose-500 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="admin_delete_reason"
                      checked={isSelected}
                      onChange={() => setSelectedReason(r.titleBn)}
                      className="mt-0.5 text-rose-600 focus:ring-rose-500"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <span>{lang === 'bn' ? r.titleBn : r.titleEn}</span>
                        {r.severity === 'high' && (
                          <span className="text-[9px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-semibold border border-rose-300">
                            উচ্চ গুরুত্ব
                          </span>
                        )}
                        {r.severity === 'medium' && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold border border-amber-300">
                            পলিসি
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        {r.descriptionBn}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Additional Admin Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>এডমিন অতিরিক্ত মন্তব্য / স্পেসিফিক নোট (ঐচ্ছিক)</span>
            </label>
            <textarea
              rows={2}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="যেমন: অভিযোগ নম্বর #৯৮২৪, কিংবা ৩ মাস অবিক্রিত অবস্থায় গ্রাহক ফোন রিসিভ করছেন না..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() => setAdminAdToDelete(null)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors"
          >
            {lang === 'bn' ? 'বাতিল' : 'Cancel'}
          </button>
          
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleConfirmDelete}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'মুছে ফেলা হচ্ছে...' : 'কারণ সহ নিশ্চিত ডিলিট করুন'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
