import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ad, Language, Order, Transaction, User, NotificationItem, ChatMessage, Review, SystemBackup, ValidationStatus } from '../types';
import { INITIAL_ADS, INITIAL_NOTIFICATIONS, INITIAL_ORDERS, INITIAL_TRANSACTIONS, INITIAL_USER, INITIAL_REVIEWS } from '../data/mockData';
import { translations } from '../data/translations';

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (typeof translations)['bn'];
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  ads: Ad[];
  favorites: string[];
  toggleFavorite: (adId: string) => void;
  orders: Order[];
  transactions: Transaction[];
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  selectedAd: Ad | null;
  setSelectedAd: (ad: Ad | null) => void;
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  chatRecipient: { id: string; name: string; phone: string; adTitle?: string } | null;
  setChatRecipient: (val: { id: string; name: string; phone: string; adTitle?: string } | null) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;
  postNewAd: (adData: Partial<Ad>) => void;
  createOrder: (orderData: Partial<Order>) => Order;
  updateAdStatus: (adId: string, status: 'active' | 'pending' | 'sold' | 'rejected') => void;
  updateAdValidationStatus: (adId: string, validationStatus: ValidationStatus, rejectionReason?: string) => void;
  updateTransactionStatus: (trxId: string, status: 'Escrow Held' | 'Released' | 'Refunded') => void;
  updateUserVerification: (isNid: boolean, isPhone: boolean) => void;
  // Reviews & Ratings
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  // Delete Ad with Reason & 10 Tk Fee
  adToDelete: Ad | null;
  setAdToDelete: (ad: Ad | null) => void;
  deleteAdWithReason: (adId: string, reason: string, feeDeducted: boolean) => void;
  // User Profile Tab Navigation
  activeProfileTab: string;
  setActiveProfileTab: (tab: string) => void;
  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  selectedDivision: string | null;
  setSelectedDivision: (div: string | null) => void;
  selectedArea: string | null;
  setSelectedArea: (area: string | null) => void;
  selectedCondition: string;
  setSelectedCondition: (cond: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: 'newest' | 'priceLowHigh' | 'priceHighLow';
  setSortBy: (sort: 'newest' | 'priceLowHigh' | 'priceHighLow') => void;
  resetFilters: () => void;
  // Dynamic Site & Domain Settings
  siteName: string;
  setSiteName: (name: string) => void;
  updateSiteName: (name: string) => void;
  domainName: string;
  setDomainName: (domain: string) => void;
  updateDomainName: (domain: string) => void;
  // Data Backup & Restore
  exportBackupData: () => SystemBackup;
  importBackupData: (backup: SystemBackup) => { success: boolean; message: string; counts?: { ads: number; orders: number; transactions: number } };
  resetToFactoryData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('bikroy_lang') as Language) || 'bn';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bikroy_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [ads, setAds] = useState<Ad[]>(() => {
    const saved = localStorage.getItem('bikroy_ads');
    return saved ? JSON.parse(saved) : INITIAL_ADS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('bikroy_favorites');
    return saved ? JSON.parse(saved) : ['ad-101'];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bikroy_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('bikroy_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('bikroy_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [isAdminMode, setIsAdminModeState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (
        params.get('mode') === 'admin' ||
        params.get('admin') === 'true' ||
        params.get('role') === 'admin' ||
        hash.includes('admin') ||
        path.includes('/admin')
      ) {
        return true;
      }
    }
    return false;
  });

  const setIsAdminMode = (val: boolean) => {
    setIsAdminModeState(val);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (val) {
        url.searchParams.set('admin', 'true');
        window.location.hash = 'admin';
      } else {
        url.searchParams.delete('admin');
        url.searchParams.delete('mode');
        url.searchParams.delete('role');
        window.location.hash = 'user';
      }
      window.history.pushState({}, '', url.toString());
    }
  };

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const shouldBeAdmin = Boolean(
        params.get('mode') === 'admin' ||
        params.get('admin') === 'true' ||
        params.get('role') === 'admin' ||
        hash.includes('admin') ||
        path.includes('/admin')
      );
      setIsAdminModeState(shouldBeAdmin);
      if (params.get('action') === 'post' || params.get('modal') === 'postAd' || params.get('post') === 'true') {
        setActiveModal('postAd');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret Admin Key combinations: Alt+A or Ctrl+Shift+A
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        setIsAdminModeState((prev) => {
          const next = !prev;
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            if (next) {
              url.searchParams.set('admin', 'true');
              window.location.hash = 'admin';
            } else {
              url.searchParams.delete('admin');
              url.searchParams.delete('mode');
              url.searchParams.delete('role');
              window.location.hash = 'user';
            }
            window.history.pushState({}, '', url.toString());
          }
          return next;
        });
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  const [siteName, setSiteName] = useState<string>(() => {
    return localStorage.getItem('bikroy_site_name') || 'BikroyMela';
  });

  const [domainName, setDomainName] = useState<string>(() => {
    return localStorage.getItem('bikroy_domain_name') || 'bikroymela.com';
  });

  const updateSiteName = (name: string) => {
    const trimmed = name.trim() || 'BikroyMela';
    setSiteName(trimmed);
    localStorage.setItem('bikroy_site_name', trimmed);
    if (typeof document !== 'undefined') {
      document.title = `${trimmed} – বাংলাদেশের অনলাইন কেনাবেচার প্ল্যাটফর্ম`;
    }
  };

  const updateDomainName = (domain: string) => {
    const trimmed = domain.trim().toLowerCase() || 'bikroymela.com';
    setDomainName(trimmed);
    localStorage.setItem('bikroy_domain_name', trimmed);
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = `${siteName} – বাংলাদেশের অনলাইন কেনাবেচার প্ল্যাটফর্ম`;
    }
  }, [siteName]);

  const [activeModal, setActiveModal] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('action') === 'post' || params.get('modal') === 'postAd' || params.get('post') === 'true') {
        return 'postAd';
      }
    }
    return null;
  });
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [chatRecipient, setChatRecipient] = useState<{ id: string; name: string; phone: string; adTitle?: string } | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      senderId: 'user-002',
      receiverId: 'user-001',
      adId: 'ad-101',
      adTitle: 'iPhone 14 Pro Max 256GB Deep Purple',
      text: 'আসসালামু আলাইকুম ভাই। ফোনটির ব্যাপারে জানতে চাচ্ছিলেন?',
      timestamp: '11:20 AM',
      read: true
    },
    {
      id: 'm-2',
      senderId: 'user-001',
      receiverId: 'user-002',
      adId: 'ad-101',
      adTitle: 'iPhone 14 Pro Max 256GB Deep Purple',
      text: 'ওয়ালাইকুমুস সালাম। ভাই ব্যাটারি কি অরিজিনাল? শেষ কত রাখবেন?',
      timestamp: '11:22 AM',
      read: true
    },
    {
      id: 'm-3',
      senderId: 'user-002',
      receiverId: 'user-001',
      adId: 'ad-101',
      adTitle: 'iPhone 14 Pro Max 256GB Deep Purple',
      text: 'জি শতভাগ অরিজিনাল অ্যাপল ব্যাটারি। এসক্রো ডেলিভারি নিতে পারেন অথবা মিরপুর ১০ এসে দেখে নিতে পারেন। সর্বনিম্ন ৯৭,০০০ রাখা যাবে।',
      timestamp: '11:25 AM',
      read: true
    }
  ]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [sortBy, setSortBy] = useState<'newest' | 'priceLowHigh' | 'priceHighLow'>('newest');

  useEffect(() => {
    localStorage.setItem('bikroy_lang', lang);
  }, [lang]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bikroy_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('bikroy_ads', JSON.stringify(ads));
  }, [ads]);

  useEffect(() => {
    localStorage.setItem('bikroy_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('bikroy_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('bikroy_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('bikroy_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const toggleFavorite = (adId: string) => {
    setFavorites(prev => 
      prev.includes(adId) ? prev.filter(id => id !== adId) : [...prev, adId]
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser?.id || 'guest',
      receiverId: chatRecipient?.id || 'seller',
      adTitle: chatRecipient?.adTitle,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true
    };
    setChatMessages(prev => [...prev, newMsg]);

    // Simulated reply from seller or support after 1.5s
    setTimeout(() => {
      const autoReplyText = lang === 'bn' 
        ? 'ধন্যবাদ আপনার বার্তার জন্য। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।'
        : 'Thank you for your message. We will get back to you shortly.';
      
      const replyMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        senderId: chatRecipient?.id || 'seller',
        receiverId: currentUser?.id || 'guest',
        adTitle: chatRecipient?.adTitle,
        text: autoReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      setChatMessages(prev => [...prev, replyMsg]);
    }, 1500);
  };

  const postNewAd = (adData: Partial<Ad>) => {
    const isApprovedByDefault = adData.status === 'active' || adData.validationStatus === 'Approved';
    const initValidationStatus: ValidationStatus = adData.validationStatus || (isApprovedByDefault ? 'Approved' : 'Received');
    const initStatus = isApprovedByDefault ? 'active' : 'pending';

    const newAd: Ad = {
      id: `ad-${Date.now()}`,
      titleBn: adData.titleBn || adData.titleEn || 'নতুন পণ্য বিক্রয়',
      titleEn: adData.titleEn || adData.titleBn || 'New Item for Sale',
      descriptionBn: adData.descriptionBn || '',
      descriptionEn: adData.descriptionEn || '',
      price: adData.price || 0,
      isNegotiable: adData.isNegotiable ?? true,
      category: adData.category || 'mobiles',
      condition: adData.condition || 'used',
      location: adData.location || {
        division: 'Dhaka',
        areaBn: 'মিরপুর, ঢাকা',
        areaEn: 'Mirpur, Dhaka'
      },
      images: adData.images && adData.images.length > 0 
        ? adData.images 
        : ['/src/assets/images/classifieds_smartphone_1791109437128.jpg'],
      sellerId: currentUser?.id || 'user-001',
      sellerName: currentUser?.name || 'ব্যবহারকারী',
      sellerPhone: currentUser?.phone || '01700-000000',
      sellerVerified: currentUser?.isNidVerified || false,
      sellerRating: 5.0,
      sellerMemberSince: '2026',
      createdAt: lang === 'bn' ? 'এইমাত্র' : 'Just now',
      status: initStatus,
      validationStatus: initValidationStatus,
      propertyType: adData.propertyType,
      dealType: adData.dealType,
      propertyDetails: adData.propertyDetails,
      extraPhotosCount: adData.extraPhotosCount || 0,
      extraPhotoFeePaid: adData.extraPhotoFeePaid || false,
      featured: adData.featured || false,
      urgent: adData.urgent || false,
      views: 1,
      specs: adData.specs || {}
    };

    setAds(prev => [newAd, ...prev]);

    // Update user free ad count
    if (currentUser) {
      setCurrentUser(prev => prev ? {
        ...prev,
        freeAdsCount: (prev.freeAdsCount || 0) + 1
      } : null);
    }

    // Add notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      titleBn: 'আপনার বিজ্ঞাপনটি সফলভাবে জমা হয়েছে!',
      titleEn: 'Your ad has been successfully submitted!',
      descriptionBn: `${newAd.titleBn} – স্ট্যাটাস: ${initValidationStatus === 'Approved' ? 'লাইভ ও অনুমোদিত' : 'পর্যালোচনায় আছে (Received)'}`,
      descriptionEn: `${newAd.titleEn} – Status: ${initValidationStatus}`,
      time: 'এখনই',
      read: false,
      type: 'ad'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const createOrder = (orderData: Partial<Order>): Order => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      adId: orderData.adId || '',
      adTitle: orderData.adTitle || '',
      adImage: orderData.adImage || '',
      buyerId: currentUser?.id || 'user-001',
      buyerName: orderData.buyerName || currentUser?.name || 'ক্রেতা',
      buyerPhone: orderData.buyerPhone || currentUser?.phone || '',
      buyerAddress: orderData.buyerAddress || '',
      sellerId: orderData.sellerId || '',
      sellerName: orderData.sellerName || 'সেলার',
      price: orderData.price || 0,
      deliveryFee: 120,
      totalAmount: (orderData.price || 0) + 120,
      paymentMethod: orderData.paymentMethod || 'bKash',
      paymentStatus: 'escrow_held',
      courierName: 'Steadfast Courier / Pathao Express',
      trackingNumber: `ST-${Math.floor(10000 + Math.random() * 90000)}-DH`,
      status: 'confirmed',
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      timeline: [
        {
          titleBn: 'অর্ডার প্লেস করা হয়েছে এবং এসক্রো ফান্ড সুরক্ষিত',
          titleEn: 'Order placed & Escrow funds held securely',
          date: 'আজকে',
          completed: true
        },
        {
          titleBn: 'বিক্রেতা অর্ডার গ্রহণ করেছেন এবং পার্সেল প্রস্তুত হচ্ছে',
          titleEn: 'Seller confirmed order & preparing dispatch',
          date: 'প্রসেসিং',
          completed: true
        },
        {
          titleBn: 'কুরিয়ার পার্টনার পিকআপ করবে',
          titleEn: 'Courier to pick up package',
          date: 'অপেক্ষমাণ',
          completed: false
        },
        {
          titleBn: 'ট্রানজিটে পৌঁছাবে',
          titleEn: 'Package in transit',
          date: 'অপেক্ষমাণ',
          completed: false
        },
        {
          titleBn: 'ডেলিভারি সম্পন্ন ও সেলার ফান্ড রিলিজ',
          titleEn: 'Delivered and fund release',
          date: 'অপেক্ষমাণ',
          completed: false
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);

    // Create escrow transaction entry
    const newTxn: Transaction = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      orderId: newOrder.id,
      adTitle: newOrder.adTitle,
      sender: `${newOrder.buyerName} (${newOrder.buyerPhone})`,
      receiver: 'বিক্রয়মেলা এসক্রো সিকিউর ভল্ট',
      amount: newOrder.totalAmount,
      gateway: newOrder.paymentMethod === 'Card' ? 'Visa/Mastercard' : (newOrder.paymentMethod as any),
      trxId: `${newOrder.paymentMethod.toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: 'Escrow Held',
      date: new Date().toLocaleString()
    };
    setTransactions(prev => [newTxn, ...prev]);

    // Add notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      titleBn: `অর্ডার নিশ্চিত করা হয়েছে! #${newOrder.id}`,
      titleEn: `Order Confirmed! #${newOrder.id}`,
      descriptionBn: `আপনার ৳ ${newOrder.totalAmount.toLocaleString()} টাকার অর্ডার এসক্রো সুরক্ষায় আছে। ট্র্যাকিং: ${newOrder.trackingNumber}`,
      descriptionEn: `Your order of ৳ ${newOrder.totalAmount.toLocaleString()} is protected by Escrow. Tracking: ${newOrder.trackingNumber}`,
      time: 'এইমাত্র',
      read: false,
      type: 'order'
    };
    setNotifications(prev => [notif, ...prev]);

    return newOrder;
  };

  const updateAdStatus = (adId: string, status: 'active' | 'pending' | 'sold' | 'rejected') => {
    setAds(prev => prev.map(a => a.id === adId ? { ...a, status } : a));
  };

  const updateAdValidationStatus = (adId: string, validationStatus: ValidationStatus, rejectionReason?: string) => {
    let newStatus: 'active' | 'pending' | 'sold' | 'rejected' = 'pending';
    if (validationStatus === 'Approved') {
      newStatus = 'active';
    } else if (validationStatus === 'Rejected') {
      newStatus = 'rejected';
    } else {
      newStatus = 'pending';
    }

    setAds(prev => prev.map(a => {
      if (a.id === adId) {
        return {
          ...a,
          validationStatus,
          status: newStatus,
          rejectionReason: rejectionReason !== undefined ? rejectionReason : a.rejectionReason
        };
      }
      return a;
    }));

    const targetAd = ads.find(a => a.id === adId);
    const statusLabels: Record<ValidationStatus, { bn: string; en: string }> = {
      'Received': { bn: 'প্রাপ্ত (Received) - সিস্টেম প্রাথমিক যাচাইয়ে আছে', en: 'Received - Initial system review' },
      'Verified': { bn: 'যাচাইকৃত (Verified) - বিক্রেতা ও বিবরণ ভেরিফাইড', en: 'Verified - Seller & details confirmed' },
      'Processed': { bn: 'প্রক্রিয়াধীন (Processed) - কোয়ালিটি ও মূল্য চেকড', en: 'Processed - Quality & pricing checked' },
      'Approved': { bn: 'অনুমোদিত (Approved) - বিজ্ঞাপনটি লাইভ হয়েছে!', en: 'Approved - Your ad is now live!' },
      'Rejected': { bn: 'বাতিল (Rejected) - নীতিমালার কারণে বাতিল বা সংশোধনের অনুরোধ', en: 'Rejected - Policy issue / revision needed' }
    };

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      titleBn: `বিজ্ঞাপন ডাটা ভেলিডেশন: ${validationStatus}`,
      titleEn: `Ad Data Validation: ${validationStatus}`,
      descriptionBn: `"${targetAd?.titleBn || 'বিজ্ঞাপন'}" স্ট্যাটাস পরিবর্তিত হয়েছে: ${statusLabels[validationStatus].bn}`,
      descriptionEn: `"${targetAd?.titleEn || 'Ad'}" status updated to: ${statusLabels[validationStatus].en}`,
      time: 'এইমাত্র',
      read: false,
      type: 'ad'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const updateTransactionStatus = (trxId: string, status: 'Escrow Held' | 'Released' | 'Refunded') => {
    setTransactions(prev => prev.map(t => t.id === trxId ? { ...t, status } : t));
  };

  const updateUserVerification = (isNid: boolean, isPhone: boolean) => {
    if (currentUser) {
      setCurrentUser(prev => prev ? {
        ...prev,
        isNidVerified: isNid,
        isPhoneVerified: isPhone,
        nidNumber: isNid ? (prev.nidNumber || '19952671829000123') : undefined
      } : null);
    }
  };

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('bikroy_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [adToDelete, setAdToDelete] = useState<Ad | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<string>('account_info');

  useEffect(() => {
    localStorage.setItem('bikroy_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    setReviews(prev => [newRev, ...prev]);

    // Give 10 reward points for leaving a review!
    if (currentUser) {
      setCurrentUser(prev => prev ? {
        ...prev,
        rewardPoints: (prev.rewardPoints || 0) + 10
      } : null);
    }
  };

  const deleteAdWithReason = (adId: string, reason: string, feeDeducted: boolean) => {
    // If feeDeducted is true, deduct 10 Tk from wallet balance
    if (feeDeducted && currentUser) {
      setCurrentUser(prev => prev ? {
        ...prev,
        walletBalance: Math.max(0, (prev.walletBalance || 0) - 10)
      } : null);
    }
    setAds(prev => prev.filter(a => a.id !== adId));
    setAdToDelete(null);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedDivision(null);
    setSelectedArea(null);
    setSelectedCondition('all');
    setPriceRange([0, 10000000]);
    setSortBy('newest');
  };

  // Data Backup & Restore Functions
  const exportBackupData = (): SystemBackup => {
    return {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      backupDate: new Date().toLocaleString('bn-BD', { dateStyle: 'full', timeStyle: 'medium' }),
      metadata: {
        siteName,
        domainName,
        totalAds: ads.length,
        totalOrders: orders.length,
        totalTransactions: transactions.length,
        totalUsers: 1 + (currentUser ? 1 : 0),
      },
      siteSettings: {
        siteName,
        domainName,
        lang,
      },
      ads,
      orders,
      transactions,
      currentUser,
      favorites,
      notifications,
      chatMessages,
      reviews,
    };
  };

  const importBackupData = (backup: SystemBackup): { success: boolean; message: string; counts?: { ads: number; orders: number; transactions: number } } => {
    try {
      if (!backup || typeof backup !== 'object') {
        return { success: false, message: 'অবৈধ ব্যাকআপ ফাইল। সঠিক JSON ফাইল নির্বাচন করুন।' };
      }

      if (Array.isArray(backup.ads)) {
        setAds(backup.ads);
        localStorage.setItem('bikroy_ads', JSON.stringify(backup.ads));
      }
      if (Array.isArray(backup.orders)) {
        setOrders(backup.orders);
        localStorage.setItem('bikroy_orders', JSON.stringify(backup.orders));
      }
      if (Array.isArray(backup.transactions)) {
        setTransactions(backup.transactions);
        localStorage.setItem('bikroy_transactions', JSON.stringify(backup.transactions));
      }
      if (backup.currentUser) {
        setCurrentUser(backup.currentUser);
        localStorage.setItem('bikroy_user', JSON.stringify(backup.currentUser));
      }
      if (Array.isArray(backup.favorites)) {
        setFavorites(backup.favorites);
        localStorage.setItem('bikroy_favorites', JSON.stringify(backup.favorites));
      }
      if (Array.isArray(backup.notifications)) {
        setNotifications(backup.notifications);
        localStorage.setItem('bikroy_notifications', JSON.stringify(backup.notifications));
      }
      if (Array.isArray(backup.chatMessages)) {
        setChatMessages(backup.chatMessages);
      }
      if (Array.isArray(backup.reviews)) {
        setReviews(backup.reviews);
        localStorage.setItem('bikroy_reviews', JSON.stringify(backup.reviews));
      }
      if (backup.siteSettings?.siteName) {
        updateSiteName(backup.siteSettings.siteName);
      }
      if (backup.siteSettings?.domainName) {
        updateDomainName(backup.siteSettings.domainName);
      }
      if (backup.siteSettings?.lang) {
        setLang(backup.siteSettings.lang);
        localStorage.setItem('bikroy_lang', backup.siteSettings.lang);
      }

      return {
        success: true,
        message: 'ডাটা ব্যাকআপ সফলভাবে রিস্টোর করা হয়েছে!',
        counts: {
          ads: backup.ads?.length || 0,
          orders: backup.orders?.length || 0,
          transactions: backup.transactions?.length || 0,
        }
      };
    } catch (err) {
      console.error('Failed to import backup:', err);
      return { success: false, message: 'ব্যাকআপ ফাইল প্রসেসিং এ ত্রুটি হয়েছে।' };
    }
  };

  const resetToFactoryData = () => {
    localStorage.removeItem('bikroy_ads');
    localStorage.removeItem('bikroy_orders');
    localStorage.removeItem('bikroy_transactions');
    localStorage.removeItem('bikroy_user');
    localStorage.removeItem('bikroy_favorites');
    localStorage.removeItem('bikroy_notifications');
    localStorage.removeItem('bikroy_reviews');
    setAds(INITIAL_ADS);
    setOrders(INITIAL_ORDERS);
    setTransactions(INITIAL_TRANSACTIONS);
    setCurrentUser(INITIAL_USER);
    setFavorites(['ad-101']);
    setNotifications(INITIAL_NOTIFICATIONS);
    setReviews(INITIAL_REVIEWS);
  };

  const t = translations[lang];

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        currentUser,
        setCurrentUser,
        ads,
        favorites,
        toggleFavorite,
        orders,
        transactions,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        isAdminMode,
        setIsAdminMode,
        activeModal,
        setActiveModal,
        selectedAd,
        setSelectedAd,
        selectedOrder,
        setSelectedOrder,
        chatRecipient,
        setChatRecipient,
        chatMessages,
        sendChatMessage,
        postNewAd,
        createOrder,
        updateAdStatus,
        updateAdValidationStatus,
        updateTransactionStatus,
        updateUserVerification,
        // Reviews & Ratings
        reviews,
        addReview,
        // Delete Ad with Reason & 10 Tk Fee
        adToDelete,
        setAdToDelete,
        deleteAdWithReason,
        // Profile Tab Navigation
        activeProfileTab,
        setActiveProfileTab,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedDivision,
        setSelectedDivision,
        selectedArea,
        setSelectedArea,
        selectedCondition,
        setSelectedCondition,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        resetFilters,
        // Dynamic Site & Domain Settings
        siteName,
        setSiteName,
        updateSiteName,
        domainName,
        setDomainName,
        updateDomainName,
        // Data Backup & Restore
        exportBackupData,
        importBackupData,
        resetToFactoryData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
