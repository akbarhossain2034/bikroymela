import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  Smartphone
} from 'lucide-react';

export const PaymentModal: React.FC = () => {
  const { 
    lang, 
    t, 
    selectedAd, 
    currentUser, 
    setCurrentUser,
    setActiveModal, 
    createOrder, 
    setSelectedOrder 
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Card' | 'COD'>('bKash');
  const [recipientName, setRecipientName] = useState(currentUser?.name || '');
  const [recipientPhone, setRecipientPhone] = useState(currentUser?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState('বাসা-১২, রোড-৪, ধানমন্ডি, ঢাকা');
  const [applyWalletDiscount, setApplyWalletDiscount] = useState(Boolean(currentUser && (currentUser.walletBalance ?? 0) >= 10));
  
  // Payment gateway simulation states
  const [gatewayStep, setGatewayStep] = useState<'form' | 'gateway_otp' | 'success'>('form');
  const [gatewayPhone, setGatewayPhone] = useState(currentUser?.phone || '01855667788');
  const [otpCode, setOtpCode] = useState('4829');
  const [pinCode, setPinCode] = useState('••••');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!selectedAd) return null;

  const deliveryFee = 120;
  const userWalletBalance = currentUser?.walletBalance ?? 50;
  const walletDiscountAmount = applyWalletDiscount ? Math.min(userWalletBalance, 50) : 0;
  const totalAmount = Math.max(0, selectedAd.price + deliveryFee - walletDiscountAmount);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !recipientPhone.trim() || !deliveryAddress.trim()) {
      alert(lang === 'bn' ? 'দয়া করে আপনার নাম, মোবাইল নম্বর এবং ঠিকানা পূরণ করুন' : 'Please provide recipient name, phone, and delivery address');
      return;
    }

    if (paymentMethod === 'COD') {
      // Direct COD order creation
      completeCheckout();
    } else {
      // Open realistic payment gateway simulation
      setGatewayStep('gateway_otp');
    }
  };

  const completeCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const order = createOrder({
        adId: selectedAd.id,
        adTitle: lang === 'bn' ? selectedAd.titleBn : selectedAd.titleEn,
        adImage: selectedAd.images[0],
        sellerId: selectedAd.sellerId,
        sellerName: selectedAd.sellerName,
        buyerName: recipientName,
        buyerPhone: recipientPhone,
        buyerAddress: deliveryAddress,
        price: selectedAd.price,
        deliveryFee,
        totalAmount,
        paymentMethod
      });

      setSelectedOrder(order);
      setIsProcessing(false);
      setGatewayStep('success');

      // Deduct wallet balance used & award +25 loyalty reward points on purchase!
      if (currentUser) {
        setCurrentUser(prev => prev ? {
          ...prev,
          walletBalance: Math.max(0, (prev.walletBalance ?? 50) - walletDiscountAmount),
          rewardPoints: (prev.rewardPoints ?? 0) + 25
        } : null);
      }

      // After 2s transition to order tracking modal
      setTimeout(() => {
        setActiveModal('orderTracking');
      }, 1600);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full text-slate-800 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-[#007460] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            <h2 className="font-bold text-base sm:text-lg">
              {lang === 'bn' ? 'নিরাপদ এসক্রো চেকআউট' : 'Secure Escrow Checkout'}
            </h2>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="text-white hover:text-emerald-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          
          {gatewayStep === 'form' && (
            <form onSubmit={handleProceedToPayment} className="space-y-5">
              
              {/* Product mini summary */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <img
                  src={selectedAd.images[0]}
                  alt="item"
                  className="w-16 h-16 object-cover rounded-md border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                    {lang === 'bn' ? selectedAd.titleBn : selectedAd.titleEn}
                  </h4>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {lang === 'bn' ? 'বিক্রেতা' : 'Seller'}: {selectedAd.sellerName}
                  </div>
                  <div className="text-sm font-bold text-[#007460] font-mono tabular-nums mt-1">
                    ৳ {selectedAd.price.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t.deliveryAddress}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {t.receiverName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="আপনার পূর্ণ নাম"
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {t.receiverPhone} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {t.detailedAddress} *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="বাড়ি নং, রোড নং, এলাকা এবং জেলা"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t.selectPayment}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  
                  {/* bKash */}
                  <label className={`p-3 border rounded-lg cursor-pointer flex items-start gap-3 transition-colors ${
                    paymentMethod === 'bKash' ? 'border-[#e2136e] bg-pink-50/60 ring-2 ring-pink-500/20' : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bKash'}
                      onChange={() => setPaymentMethod('bKash')}
                      className="mt-1 text-[#e2136e] focus:ring-[#e2136e]"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#e2136e]"></span>
                        <span>bKash (বিকাশ)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{t.bkashSubtext}</p>
                    </div>
                  </label>

                  {/* Nagad */}
                  <label className={`p-3 border rounded-lg cursor-pointer flex items-start gap-3 transition-colors ${
                    paymentMethod === 'Nagad' ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20' : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Nagad'}
                      onChange={() => setPaymentMethod('Nagad')}
                      className="mt-1 text-orange-600 focus:ring-orange-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                        <span>Nagad (নগদ)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{t.nagadSubtext}</p>
                    </div>
                  </label>

                  {/* Rocket */}
                  <label className={`p-3 border rounded-lg cursor-pointer flex items-start gap-3 transition-colors ${
                    paymentMethod === 'Rocket' ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-600/20' : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Rocket'}
                      onChange={() => setPaymentMethod('Rocket')}
                      className="mt-1 text-purple-600 focus:ring-purple-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-700"></span>
                        <span>Rocket (রকেট)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{t.rocketSubtext}</p>
                    </div>
                  </label>

                  {/* Card */}
                  <label className={`p-3 border rounded-lg cursor-pointer flex items-start gap-3 transition-colors ${
                    paymentMethod === 'Card' ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20' : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Card'}
                      onChange={() => setPaymentMethod('Card')}
                      className="mt-1 text-blue-600 focus:ring-blue-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                        <span>Visa / Mastercard</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{t.cardSubtext}</p>
                    </div>
                  </label>

                  {/* COD */}
                  <label className={`p-3 border rounded-lg cursor-pointer flex items-start gap-3 transition-colors ${
                    paymentMethod === 'COD' ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20' : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="mt-1 text-emerald-600 focus:ring-emerald-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>ক্যাশ অন ডেলিভারি (COD)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{t.codSubtext}</p>
                    </div>
                  </label>

                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>{lang === 'bn' ? 'পণ্যের মূল্য' : 'Item Price'}</span>
                  <span className="font-mono tabular-nums">৳ {selectedAd.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{lang === 'bn' ? 'স্টেডফাস্ট এক্সপ্রেস ডেলিভারি চার্জ' : 'Steadfast Courier Delivery'}</span>
                  <span className="font-mono tabular-nums">৳ {deliveryFee}</span>
                </div>

                {/* 50 Tk Welcome Bonus Discount Option */}
                {userWalletBalance > 0 && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer text-emerald-950 font-semibold">
                      <input
                        type="checkbox"
                        checked={applyWalletDiscount}
                        onChange={(e) => setApplyWalletDiscount(e.target.checked)}
                        className="text-[#007460] rounded focus:ring-[#007460]"
                      />
                      <span>🎁 ওয়ালেট ব্যালেন্স থেকে ৫০ টাকা ছাড় ব্যবহার করুন</span>
                    </label>
                    <span className="font-mono font-bold text-emerald-700">- ৳ {walletDiscountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
                  <span>{lang === 'bn' ? 'সর্বমোট প্রদেয়' : 'Total Amount'}</span>
                  <span className="text-[#007460] font-mono tabular-nums">৳ {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Escrow badge */}
              <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.escrowBadgeText}</span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 bg-[#007460] hover:bg-[#005e4e] text-white font-bold text-sm rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>{paymentMethod === 'COD' ? t.confirmOrder : `${paymentMethod} দিয়ে নিরাপদ পেমেন্ট করুন`}</span>
              </button>

            </form>
          )}

          {/* Realistic Payment Gateway Simulation (bKash / Nagad / Rocket / Card) */}
          {gatewayStep === 'gateway_otp' && (
            <div className="space-y-4">
              {/* Simulated Gateway Banner */}
              <div className={`p-4 rounded-xl text-white ${
                paymentMethod === 'bKash' ? 'bg-[#e2136e]' :
                paymentMethod === 'Nagad' ? 'bg-[#f7941d]' :
                paymentMethod === 'Rocket' ? 'bg-[#8c3494]' : 'bg-slate-900'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="font-bold text-lg">
                    {paymentMethod === 'bKash' && 'bKash Payment Gateway'}
                    {paymentMethod === 'Nagad' && 'Nagad Direct Checkout'}
                    {paymentMethod === 'Rocket' && 'Rocket DBBL Gateway'}
                    {paymentMethod === 'Card' && 'Secure 3D Card Verification'}
                  </div>
                  <Lock className="w-5 h-5 text-white/80" />
                </div>
                <div className="mt-2 text-xs text-white/90">
                  {lang === 'bn' ? 'মার্চেন্ট' : 'Merchant'}: BikroyMela Escrow Vault
                </div>
                <div className="mt-1 text-2xl font-mono tabular-nums font-bold">
                  ৳ {totalAmount.toLocaleString()} BDT
                </div>
              </div>

              {/* Payment Details Form depending on gateway */}
              {paymentMethod === 'Card' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">কার্ড নম্বর</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">মেয়াদ (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded font-mono"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 bg-slate-50 p-4 border border-slate-200 rounded-lg">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {paymentMethod} অ্যাকাউন্ট নম্বর
                    </label>
                    <input
                      type="text"
                      value={gatewayPhone}
                      onChange={(e) => setGatewayPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        ওটিপি কোড (OTP)
                      </label>
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded font-mono text-center tracking-widest font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        গোপন পিন (PIN)
                      </label>
                      <input
                        type="password"
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded font-mono text-center tracking-widest"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 text-center">
                    (ডেমো পরিবেশ: স্বয়ংক্রিয়ভাবে ওটিপি এবং পিন পূর্ণ করা হয়েছে)
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setGatewayStep('form')}
                  className="w-1/3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-lg"
                >
                  {lang === 'bn' ? 'ফিরে যান' : 'Back'}
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={completeCheckout}
                  className="w-2/3 py-2.5 bg-[#007460] hover:bg-[#005e4e] text-white font-bold text-xs sm:text-sm rounded-lg shadow transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span>{lang === 'bn' ? 'প্রসেসিং হচ্ছে...' : 'Processing...'}</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{lang === 'bn' ? 'পেমেন্ট নিশ্চিত করুন' : 'Confirm Payment'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Success Step */}
          {gatewayStep === 'success' && (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {lang === 'bn' ? 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!' : 'Order Placed Successfully!'}
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                {lang === 'bn'
                  ? 'আপনার অর্থ এসক্রো সুরক্ষায় আছে। ডেলিভারি ট্র্যাকিং পেজে রিডাইরেক্ট করা হচ্ছে...'
                  : 'Your payment is safely held in Escrow. Redirecting to delivery tracking...'}
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
