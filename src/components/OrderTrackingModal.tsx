import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

export const OrderTrackingModal: React.FC = () => {
  const { 
    lang, 
    t, 
    orders, 
    selectedOrder, 
    setSelectedOrder, 
    setActiveModal, 
    updateTransactionStatus 
  } = useApp();

  const [activeOrderId, setActiveOrderId] = useState<string>(
    selectedOrder ? selectedOrder.id : (orders[0]?.id || '')
  );
  const [releaseSuccess, setReleaseSuccess] = useState(false);
  const [disputeReported, setDisputeReported] = useState(false);

  const currentOrder = orders.find(o => o.id === activeOrderId) || orders[0];

  if (!currentOrder && orders.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base mb-1">
            {lang === 'bn' ? 'কোনো সক্রিয় অর্ডার নেই' : 'No Active Orders'}
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            {lang === 'bn' ? 'আপনার কোনো চলমান অর্ডার পাওয়া যায়নি।' : 'You do not have any active orders yet.'}
          </p>
          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 bg-[#007460] text-white text-xs font-semibold rounded-lg"
          >
            {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    );
  }

  const handleReleaseFunds = () => {
    // Release escrow
    updateTransactionStatus(currentOrder.id, 'Released');
    setReleaseSuccess(true);
    setTimeout(() => setReleaseSuccess(false), 3000);
  };

  const handleReportDispute = () => {
    setDisputeReported(true);
    setTimeout(() => setDisputeReported(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full text-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-base sm:text-lg">
              {lang === 'bn' ? 'অর্ডার ট্র্যাকিং ও ডেলিভারি স্ট্যাটাস' : 'Order Tracking & Delivery Status'}
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedOrder(null);
              setActiveModal(null);
            }}
            className="text-slate-300 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Order Selector (if multiple orders exist) */}
          {orders.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                {lang === 'bn' ? 'অর্ডার নির্বাচন:' : 'Select Order:'}
              </span>
              {orders.map(ord => (
                <button
                  key={ord.id}
                  onClick={() => setActiveOrderId(ord.id)}
                  className={`px-3 py-1 text-xs rounded-md font-mono tabular-nums whitespace-nowrap transition-colors ${
                    ord.id === activeOrderId 
                      ? 'bg-[#007460] text-white font-bold' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  #{ord.id}
                </button>
              ))}
            </div>
          )}

          {/* Current Order Summary Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={currentOrder.adImage}
                alt="Product"
                className="w-16 h-16 object-cover rounded-lg border border-slate-200"
              />
              <div>
                <div className="text-xs text-slate-500 font-mono">
                  অর্ডার আইডি: #{currentOrder.id}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {currentOrder.adTitle}
                </h3>
                <div className="text-xs font-semibold text-[#007460] font-mono tabular-nums mt-0.5">
                  ৳ {currentOrder.totalAmount.toLocaleString()} ({currentOrder.paymentMethod})
                </div>
              </div>
            </div>

            {/* Courier Info Box */}
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs w-full sm:w-auto shrink-0 space-y-1">
              <div className="text-slate-500 font-medium">
                {lang === 'bn' ? 'কুরিয়ার পার্টনার' : 'Courier Partner'}:
              </div>
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{currentOrder.courierName}</span>
              </div>
              <div className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                {currentOrder.trackingNumber}
              </div>
            </div>
          </div>

          {/* Visual Tracking Progress Timeline */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>{t.orderTimeline}</span>
            </h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {currentOrder.timeline.map((step, idx) => {
                const isDone = step.completed;
                return (
                  <div key={idx} className="relative flex items-start gap-3">
                    {/* Circle icon */}
                    <div className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      isDone 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                      {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    <div className="flex-1 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs sm:text-sm font-semibold ${isDone ? 'text-slate-900' : 'text-slate-500'}`}>
                          {lang === 'bn' ? step.titleBn : step.titleEn}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                          {step.date}
                        </span>
                      </div>
                      {idx === 2 && isDone && (
                        <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
                          <span>স্টেডফাস্ট হাব থেকে রাইডার ডেলিভারির উদ্দেশ্যে রওনা হয়েছে।</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Address & Customer Details */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>{lang === 'bn' ? 'ডেলিভারির গন্তব্য' : 'Delivery Destination'}</span>
            </div>
            <div className="text-slate-700">{currentOrder.buyerName} ({currentOrder.buyerPhone})</div>
            <div className="text-slate-600 leading-relaxed">{currentOrder.buyerAddress}</div>
          </div>

          {/* Escrow Release & Customer Action Bar */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs sm:text-sm font-bold text-emerald-950">
                  {lang === 'bn' ? 'এসক্রো সুরক্ষা ও ডেলিভারি কনফার্মেশন' : 'Escrow Protection & Delivery Confirmation'}
                </h5>
                <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                  {lang === 'bn'
                    ? 'পণ্য আপনার হাতে পৌঁছানোর পর ভালো করে চেক করুন। সন্তুষ্ট হলে নিচের বাটনে ক্লিক করে বিক্রেতার কাছে টাকা পাঠিয়ে দিন।'
                    : 'Inspect your parcel upon delivery. If satisfied, click below to release payment to the seller.'}
                </p>
              </div>
            </div>

            {releaseSuccess && (
              <div className="p-2.5 bg-emerald-600 text-white text-xs font-semibold rounded flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{lang === 'bn' ? 'ধন্যবাদ! বিক্রেতার অ্যাকাউন্টে অর্থ সফলভাবে রিলিজ করা হয়েছে।' : 'Thank you! Payment released to seller successfully.'}</span>
              </div>
            )}

            {disputeReported && (
              <div className="p-2.5 bg-rose-600 text-white text-xs font-semibold rounded flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>{lang === 'bn' ? 'সমস্যার নোটিশ গৃহীত হয়েছে। এডমিন তদন্ত শুরু করেছেন।' : 'Dispute received. Admin team is investigating.'}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <button
                onClick={handleReleaseFunds}
                className="w-full sm:w-auto flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{lang === 'bn' ? 'পণ্য পেয়েছি – ফান্ড রিলিজ করুন' : 'Confirm Delivery & Release Payment'}</span>
              </button>

              <button
                onClick={handleReportDispute}
                className="w-full sm:w-auto py-2.5 px-4 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>{lang === 'bn' ? 'সমস্যা রিপোর্ট করুন' : 'Report Issue'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
