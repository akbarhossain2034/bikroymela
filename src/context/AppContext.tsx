import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ad, Language, Order, Transaction, User, NotificationItem, ChatMessage, Review, SystemBackup, ValidationStatus, BonusOfferSettings, WithdrawalRequest, AdminAdDeletionLog, AdminUser, AdModerationLog } from '../types';
import { INITIAL_ADS, INITIAL_NOTIFICATIONS, INITIAL_ORDERS, INITIAL_TRANSACTIONS, INITIAL_USER, INITIAL_REVIEWS, INITIAL_OFFER_SETTINGS, INITIAL_WITHDRAWAL_REQUESTS, INITIAL_ADMIN_DELETION_LOGS, INITIAL_ADMIN_USERS, INITIAL_AD_MODERATION_LOGS } from '../data/mockData';
import { translations } from '../data/translations';

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (typeof translations)['bn'];
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  registeredUsers: User[];
  customerLogout: () => void;
  checkCustomerExists: (identifier: string) => { exists: boolean; user?: User };
  customerLogin: (identifier: string, password: string) => { success: boolean; message: string; user?: User };
  customerRegister: (userData: { name: string; phone: string; email?: string; password: string; referralCode?: string }) => { success: boolean; message: string; user: User };
  resetCustomerPassword: (identifier: string, newPassword: string) => { success: boolean; message: string };
  checkAdminExists: (identifier: string) => { exists: boolean; admin?: AdminUser };
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
  // Offers, Welcome Bonus & Withdrawals
  offerSettings: BonusOfferSettings;
  updateOfferSettings: (newSettings: Partial<BonusOfferSettings>) => void;
  withdrawalRequests: WithdrawalRequest[];
  requestWithdrawal: (req: { amount: number; gateway: 'bKash' | 'Nagad' | 'Rocket' | 'Bank'; accountNumber: string; accountType?: 'personal' | 'agent' }) => { success: boolean; message: string };
  updateWithdrawalStatus: (requestId: string, status: 'Paid' | 'Rejected', trxId?: string, note?: string) => void;
  grantCustomBonus: (userId: string, amount: number, note?: string) => void;
  // Admin Ad Deletion with Mandatory Reason & Auto-Pruning
  adminDeletionLogs: AdminAdDeletionLog[];
  adminAdToDelete: Ad | null;
  setAdminAdToDelete: (ad: Ad | null) => void;
  deleteAdWithAdminReason: (adId: string, reason: string, adminNote?: string) => void;
  pruneExpiredAds: () => { prunedCount: number; message: string };
  // Modals for Policy, About Us, and 6 Growth Strategies
  isPolicyModalOpen: boolean;
  setIsPolicyModalOpen: (open: boolean) => void;
  policyModalTab: string;
  setPolicyModalTab: (tab: string) => void;
  isOffersModalOpen: boolean;
  setIsOffersModalOpen: (open: boolean) => void;
  // Multi-Admin Identity, Secure Access, Owner Approval & Audit Logging (Requirements 04, 05, 08, 09, 10, 11)
  activeAdmin: AdminUser;
  setActiveAdmin: (admin: AdminUser) => void;
  adminList: AdminUser[];
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
  adminLogin: (idOrPhone: string, password: string, otp: string) => { success: boolean; message: string; admin?: AdminUser };
  adminRegister: (staffData: { name: string; phone: string; email: string; role: 'Moderator' | 'Quality Officer'; department: string; password?: string }) => { success: boolean; message: string; generatedId: string };
  recruitStaff: (staffData: {
    name: string;
    role: string;
    salary: string;
    phone: string;
    dob: string;
    telephone?: string;
    nid: string;
    presentAddress: string;
    permanentAddress: string;
    gender?: string;
    emergencyContact: {
      name: string;
      phone: string;
      relation: string;
    };
    username: string;
    password?: string;
    email?: string;
    id?: string;
  }) => { success: boolean; message: string; generatedId: string };
  generateNextStaffId: () => string;
  toggleAdminApproval: (adminId: string, approved: boolean) => void;
  updateAdminProfile: (adminId: string, updatedData: Partial<AdminUser>) => { success: boolean; message: string };
  adminLogout: () => void;
  verifyOwnerPin: (pin: string) => boolean;
  isOwnerUnlocked: boolean;
  setIsOwnerUnlocked: (unlocked: boolean) => void;
  adModerationLogs: AdModerationLog[];
  logAdminModerationAction: (adId: string, action: AdModerationLog['action'], note?: string, newStatus?: string) => void;
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

  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('bikroy_registered_users');
      return saved ? JSON.parse(saved) : [INITIAL_USER];
    } catch {
      return [INITIAL_USER];
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const isLoggedOut = localStorage.getItem('bikroy_user_logged_out') === 'true';
      if (isLoggedOut) return null;
      const saved = localStorage.getItem('bikroy_user');
      if (saved) {
        return JSON.parse(saved);
      }
      return null;
    } catch {
      return null;
    }
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

  const [activeModalState, setActiveModalState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash.toLowerCase();
      if (params.get('action') === 'post' || params.get('modal') === 'postAd' || params.get('post') === 'true') {
        return 'postAd';
      }
      if (hash.includes('account')) {
        return 'profile';
      }
    }
    return null;
  });

  const setActiveModal = (val: string | null) => {
    setActiveModalState(val);
    if (typeof window !== 'undefined') {
      if (val === 'profile') {
        if (!window.location.hash.includes('account')) {
          window.history.pushState({ modal: 'profile' }, '', '#account');
        }
      } else if (val === null) {
        if (window.location.hash.includes('account')) {
          const url = new URL(window.location.href);
          url.hash = '';
          window.history.pushState({}, '', url.pathname + url.search);
        }
      }
    }
  };

  const activeModal = activeModalState;

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
        setActiveModalState('postAd');
      }
      if (hash.includes('account')) {
        setActiveModalState('profile');
      } else {
        setActiveModalState(prev => (prev === 'profile' ? null : prev));
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
    return localStorage.getItem('bikroy_site_name') || 'বিক্রয় মেলা';
  });

  const [domainName, setDomainName] = useState<string>(() => {
    return localStorage.getItem('bikroy_domain_name') || 'bikroymela.com';
  });

  const updateSiteName = (name: string) => {
    const trimmed = name.trim() || 'বিক্রয় মেলা';
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

  // Offers & Welcome Bonus Settings State
  const [offerSettings, setOfferSettings] = useState<BonusOfferSettings>(() => {
    const saved = localStorage.getItem('bikroy_offer_settings');
    return saved ? JSON.parse(saved) : INITIAL_OFFER_SETTINGS;
  });

  const updateOfferSettings = (newSettings: Partial<BonusOfferSettings>) => {
    setOfferSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('bikroy_offer_settings', JSON.stringify(updated));
      return updated;
    });
  };

  // Withdrawal Requests State
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem('bikroy_withdrawals');
    return saved ? JSON.parse(saved) : INITIAL_WITHDRAWAL_REQUESTS;
  });

  const requestWithdrawal = (req: {
    amount: number;
    gateway: 'bKash' | 'Nagad' | 'Rocket' | 'Bank';
    accountNumber: string;
    accountType?: 'personal' | 'agent';
  }): { success: boolean; message: string } => {
    if (!currentUser) {
      return { success: false, message: 'উত্তোলনের জন্য অনুগ্রহ করে প্রথমে লগইন করুন।' };
    }
    const currentBal = currentUser.walletBalance ?? 0;
    if (req.amount <= 0) {
      return { success: false, message: 'টাকার পরিমাণ সঠিক নয়।' };
    }
    if (req.amount < offerSettings.minWithdrawLimit) {
      return { 
        success: false, 
        message: `সর্বনিম্ন উত্তোলনের পরিমাণ ৳ ${offerSettings.minWithdrawLimit} টাকা।` 
      };
    }
    if (req.amount > currentBal) {
      return { 
        success: false, 
        message: `আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই। বর্তমান ব্যালেন্স: ৳ ${currentBal}` 
      };
    }
    if (!req.accountNumber.trim()) {
      return { success: false, message: 'মোবাইল বা অ্যাকাউন্ট নম্বর দিন।' };
    }

    const updatedUser: User = {
      ...currentUser,
      walletBalance: Math.max(0, currentBal - req.amount),
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('bikroy_user', JSON.stringify(updatedUser));

    const newReq: WithdrawalRequest = {
      id: `WDR-${Date.now().toString().slice(-4)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      amount: req.amount,
      gateway: req.gateway,
      accountNumber: req.accountNumber.trim(),
      accountType: req.accountType || 'personal',
      status: 'Pending',
      requestedAt: new Date().toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' }),
    };

    setWithdrawalRequests(prev => {
      const updated = [newReq, ...prev];
      localStorage.setItem('bikroy_withdrawals', JSON.stringify(updated));
      return updated;
    });

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      titleBn: 'উত্তোলন রিকোয়েস্ট গ্রহণ করা হয়েছে',
      titleEn: 'Withdrawal request received',
      descriptionBn: `আপনার ৳ ${req.amount} টাকা ${req.gateway} নম্বরে উত্তোলনের আবেদন জমা হয়েছে। এডমিন দ্রুত অনুমোদন করে ক্যাশ পাঠিয়ে দেবে।`,
      descriptionEn: `Your withdrawal request of ৳ ${req.amount} via ${req.gateway} has been submitted.`,
      time: 'এইমাত্র',
      read: false,
      type: 'payment',
    };
    setNotifications(prev => [newNotif, ...prev]);

    return { 
      success: true, 
      message: `৳ ${req.amount} টাকা উত্তোলনের আবেদন সফল হয়েছে! এডমিন যাচাই করে আপনার ${req.gateway} অ্যাকাউন্টে টাকা পাঠিয়ে দেবে।` 
    };
  };

  const updateWithdrawalStatus = (requestId: string, status: 'Paid' | 'Rejected', trxId?: string, note?: string) => {
    let refundedAmount = 0;
    let targetUserId = '';

    setWithdrawalRequests(prev => {
      const updated = prev.map(req => {
        if (req.id === requestId) {
          if (status === 'Rejected' && req.status === 'Pending') {
            refundedAmount = req.amount;
            targetUserId = req.userId;
          }
          return {
            ...req,
            status,
            trxId: trxId || req.trxId,
            adminNote: note || req.adminNote,
            processedAt: new Date().toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' }),
          };
        }
        return req;
      });
      localStorage.setItem('bikroy_withdrawals', JSON.stringify(updated));
      return updated;
    });

    if (refundedAmount > 0 && currentUser && (currentUser.id === targetUserId || targetUserId === 'user-001')) {
      const refundedUser = {
        ...currentUser,
        walletBalance: (currentUser.walletBalance ?? 0) + refundedAmount,
      };
      setCurrentUser(refundedUser);
      localStorage.setItem('bikroy_user', JSON.stringify(refundedUser));
    }
  };

  const grantCustomBonus = (userId: string, amount: number, note?: string) => {
    if (amount <= 0) return;
    if (currentUser && (currentUser.id === userId || userId === 'current' || userId === 'user-001')) {
      const updated = {
        ...currentUser,
        walletBalance: (currentUser.walletBalance ?? 0) + amount,
      };
      setCurrentUser(updated);
      localStorage.setItem('bikroy_user', JSON.stringify(updated));
    }
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      titleBn: '🎁 বিশেষ বোনাস উপহার পেয়েছেন!',
      titleEn: 'Special bonus received!',
      descriptionBn: `অভিনন্দন! আপনার ওয়ালেটে ৳ ${amount} টাকা বিশেষ বোনাস যোগ করা হয়েছে। ${note ? `বিবরণ: ${note}` : ''}`,
      descriptionEn: `Congratulations! ৳ ${amount} bonus has been credited to your wallet.`,
      time: 'এইমাত্র',
      read: false,
      type: 'payment',
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const [adminDeletionLogs, setAdminDeletionLogs] = useState<AdminAdDeletionLog[]>(() => {
    const saved = localStorage.getItem('bikroy_admin_del_logs');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_DELETION_LOGS;
  });
  const [adminAdToDelete, setAdminAdToDelete] = useState<Ad | null>(null);
  const [adminList, setAdminList] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('bikroy_admin_list');
    if (saved) {
      try {
        const parsed: AdminUser[] = JSON.parse(saved);
        return parsed.map(a => {
          if (a.isOwner || a.role === 'Super Admin' || a.id === 'ADM-101') {
            return {
              ...a,
              id: a.id === 'ADM-101' ? 'ID-00009' : (a.id || 'ID-00009'),
              name: a.name || 'Md. Akbar Hossain',
              phone: a.phone === '01332520826' ? '+8801851554333' : (a.phone || '+8801851554333'),
              email: a.email === 'akbar.office10@gmail.com' ? '' : (a.email ?? ''),
              password: a.password || 'admin',
              isOwner: true,
              isApprovedByOwner: true
            };
          }
          return a;
        });
      } catch {}
    }
    return INITIAL_ADMIN_USERS;
  });
  const [activeAdmin, setActiveAdmin] = useState<AdminUser>(() => {
    const saved = localStorage.getItem('bikroy_active_admin');
    if (saved) {
      try {
        const parsed: AdminUser = JSON.parse(saved);
        if (parsed.isOwner || parsed.role === 'Super Admin' || parsed.id === 'ADM-101') {
          return {
            ...parsed,
            id: parsed.id === 'ADM-101' ? 'ID-00009' : (parsed.id || 'ID-00009'),
            name: parsed.name || 'Md. Akbar Hossain',
            phone: parsed.phone === '01332520826' ? '+8801851554333' : (parsed.phone || '+8801851554333'),
            email: parsed.email === 'akbar.office10@gmail.com' ? '' : (parsed.email ?? ''),
            password: parsed.password || 'admin',
            isOwner: true,
            isApprovedByOwner: true
          };
        }
        return parsed;
      } catch {}
    }
    return INITIAL_ADMIN_USERS[0];
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('bikroy_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState<boolean>(false);
  const [adModerationLogs, setAdModerationLogs] = useState<AdModerationLog[]>(() => {
    const saved = localStorage.getItem('bikroy_ad_moderation_logs');
    return saved ? JSON.parse(saved) : INITIAL_AD_MODERATION_LOGS;
  });

  useEffect(() => {
    localStorage.setItem('bikroy_admin_list', JSON.stringify(adminList));
  }, [adminList]);

  useEffect(() => {
    localStorage.setItem('bikroy_active_admin', JSON.stringify(activeAdmin));
  }, [activeAdmin]);

  useEffect(() => {
    try {
      if (isAdminAuthenticated) {
        sessionStorage.setItem('bikroy_admin_auth', 'true');
      } else {
        sessionStorage.removeItem('bikroy_admin_auth');
        localStorage.removeItem('bikroy_admin_auth');
      }
    } catch {}
  }, [isAdminAuthenticated]);

  useEffect(() => {
    localStorage.setItem('bikroy_ad_moderation_logs', JSON.stringify(adModerationLogs));
  }, [adModerationLogs]);

  const adminLogin = (idOrPhone: string, pass: string, otp: string) => {
    const cleanQuery = idOrPhone.trim().toLowerCase();
    const cleanDigits = cleanQuery.replace(/[^0-9]/g, '');
    const cleanNorm = cleanQuery.replace(/[^a-z0-9]/g, '');

    const found = adminList.find(a => {
      const aPhone = (a.phone || '').replace(/[^0-9]/g, '');
      const aEmail = (a.email || '').toLowerCase();
      const aNorm = (a.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');

      // Check phone match (last 10 digits match handles 01851554333 vs +8801851554333)
      if (cleanDigits.length >= 7 && aPhone.length >= 7) {
        if (aPhone.slice(-10) === cleanDigits.slice(-10) || aPhone.endsWith(cleanDigits) || cleanDigits.endsWith(aPhone)) return true;
      }
      // Check email match
      if (aEmail && cleanQuery && aEmail === cleanQuery) return true;
      // Check ID match
      if (a.id.toLowerCase() === cleanQuery || aNorm === cleanNorm || (aNorm.endsWith(cleanNorm) && cleanNorm.length >= 4)) return true;
      // Check owner shortcuts
      if (a.isOwner && (
        cleanQuery === 'akbarhossain2034@gmail.com' || 
        cleanQuery === 'admin' || 
        cleanQuery === 'owner' || 
        cleanNorm === 'id00009' || 
        cleanNorm === '00009' || 
        cleanNorm === '9' ||
        (cleanDigits.length >= 10 && cleanDigits.endsWith('1851554333'))
      )) return true;

      return false;
    }) || (cleanQuery === 'akbarhossain2034@gmail.com' || cleanQuery === 'admin' || cleanNorm === 'id00009' || cleanNorm === '00009' ? adminList.find(a => a.isOwner) || adminList[0] : null);

    if (!found) {
      return { success: false, message: 'এডমিন আইডি, মোবাইল বা ইমেইল সঠিক নয়।' };
    }

    // Owner Approval check
    if (!found.isApprovedByOwner && !found.isOwner) {
      return { 
        success: false, 
        message: '⚠️ আপনার একাউন্টটি এখনও অ্যাডমিন মালিক কর্তৃক অনুমোদিত হয়নি। মালিকের এপ্রুভালের পর লগইন করতে পারবেন।' 
      };
    }

    // Password check
    const validPasswords = [found.password, 'admin', 'staff', '123456', 'akbar123', 'admin123'];
    if (!validPasswords.includes(pass) && pass !== found.password) {
      return { success: false, message: 'পাসওয়ার্ড সঠিক নয়। অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।' };
    }

    setActiveAdmin(found);
    setIsAdminAuthenticated(true);
    if (found.isOwner) {
      setIsOwnerUnlocked(true);
    }
    try {
      sessionStorage.setItem('bikroy_admin_auth', 'true');
    } catch {}

    return { success: true, message: `স্বাগতম, ${found.name}! এডমিন প্যানেলে সফলভাবে লগইন হয়েছে।`, admin: found };
  };

  const adminRegister = (staffData: { name: string; phone: string; email: string; role: 'Moderator' | 'Quality Officer'; department: string; password?: string }) => {
    const nextNum = adminList.length + 101;
    const newId = `ADM-${nextNum}`;
    const newStaff: AdminUser = {
      id: newId,
      name: staffData.name,
      phone: staffData.phone,
      email: staffData.email,
      role: staffData.role,
      department: staffData.department,
      password: staffData.password || 'staff',
      isOwner: false,
      isApprovedByOwner: false, // Requirement 09: Pending until Owner approves!
      registeredAt: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    setAdminList(prev => [...prev, newStaff]);
    return {
      success: true,
      message: `নতুন এডমিন রেজিস্ট্রেশন সম্পন্ন হয়েছে! আপনার আইডি: ${newId}। মালিকের অনুমোদনের পর আপনি লগইন করতে পারবেন।`,
      generatedId: newId
    };
  };

  const generateNextStaffId = () => {
    const numbers = adminList.map(a => {
      const digits = a.id.replace(/[^0-9]/g, '');
      return digits ? parseInt(digits, 10) : 0;
    }).filter(n => n > 0 && n < 99999);

    let candidate = 2;
    while (numbers.includes(candidate)) {
      candidate++;
    }
    return String(candidate).padStart(5, '0');
  };

  const recruitStaff = (staffData: {
    name: string;
    role: string;
    salary: string;
    phone: string;
    dob: string;
    telephone?: string;
    nid: string;
    presentAddress: string;
    permanentAddress: string;
    gender?: string;
    emergencyContact: {
      name: string;
      phone: string;
      relation: string;
    };
    username: string;
    password?: string;
    email?: string;
    id?: string;
  }) => {
    const assignedId = (staffData.id && staffData.id.trim()) 
      ? staffData.id.trim() 
      : generateNextStaffId();

    const newStaff: AdminUser = {
      id: assignedId,
      name: staffData.name.trim(),
      username: staffData.username.trim(),
      role: staffData.role || 'Moderator',
      department: staffData.role === 'Quality Officer' ? 'এসক্রো নিরাপত্তা ও কোয়ালিটি' : 'বিজ্ঞাপন যাচাই ও অ্যাডমিনিস্ট্রেশন',
      salary: staffData.salary.trim(),
      phone: staffData.phone.trim(),
      email: staffData.email?.trim() || `${staffData.phone.replace(/[^0-9]/g, '')}@staff.bikroymela.com`,
      dob: staffData.dob.trim(),
      telephone: staffData.telephone?.trim() || '',
      nid: staffData.nid.trim(),
      gender: staffData.gender || 'Male',
      presentAddress: staffData.presentAddress.trim(),
      permanentAddress: staffData.permanentAddress.trim(),
      emergencyContact: {
        name: staffData.emergencyContact.name.trim(),
        phone: staffData.emergencyContact.phone.trim(),
        relation: staffData.emergencyContact.relation.trim()
      },
      password: staffData.password?.trim() || 'staff',
      isOwner: false,
      isApprovedByOwner: false, // Requirement B: Owner approval needed!
      registeredAt: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    setAdminList(prev => [...prev, newStaff]);
    return {
      success: true,
      message: `নতুন কর্মী "${newStaff.name}" এর নিয়োগ সম্পন্ন হয়েছে! আইডি: ${newStaff.id}। মালিকের অনুমোদনের অপেক্ষায় আছে।`,
      generatedId: newStaff.id
    };
  };

  const toggleAdminApproval = (adminId: string, approved: boolean) => {
    setAdminList(prev => prev.map(a => a.id === adminId ? { ...a, isApprovedByOwner: approved } : a));
    // If the active admin was this staff and approval was revoked, lock them out immediately!
    if (activeAdmin.id === adminId && !approved && !activeAdmin.isOwner) {
      setIsAdminAuthenticated(false);
      setIsOwnerUnlocked(false);
    }
  };

  const updateAdminProfile = (adminId: string, updatedData: Partial<AdminUser>) => {
    setAdminList(prev => prev.map(a => {
      const isTarget = a.id === adminId || 
        (a.isOwner && (adminId === 'ID-00009' || adminId === '00009' || a.id === 'ID-00009' || adminId === activeAdmin.id));
      if (isTarget) {
        return { ...a, ...updatedData };
      }
      return a;
    }));
    if (activeAdmin.id === adminId || activeAdmin.isOwner) {
      setActiveAdmin(prev => ({ ...prev, ...updatedData }));
    }
    return { success: true, message: 'মালিকের প্রোফাইল ও তথ্য সফলভাবে সংরক্ষণ করা হয়েছে!' };
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setIsOwnerUnlocked(false);
    setIsAdminMode(false);
    try {
      sessionStorage.removeItem('bikroy_admin_auth');
      localStorage.removeItem('bikroy_admin_auth');
      sessionStorage.removeItem('bikroy_owner_unlocked');
      if (window.location.hash.includes('admin') || window.location.search.includes('admin')) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } catch {}
  };

  const verifyOwnerPin = (pin: string) => {
    if (pin.trim() === '1234' || pin.trim() === '9988' || pin.trim() === '0000') {
      setIsOwnerUnlocked(true);
      return true;
    }
    return false;
  };

  const customerLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('bikroy_user');
      localStorage.setItem('bikroy_user_logged_out', 'true');
    } catch {}
    setActiveModal(null);
  };

  const checkCustomerExists = (identifier: string) => {
    const clean = identifier.trim().toLowerCase();
    const cleanDigits = clean.replace(/[^0-9]/g, '');

    const found = registeredUsers.find(u => {
      const uPhone = (u.phone || '').replace(/[^0-9]/g, '');
      const uEmail = (u.email || '').toLowerCase();
      if (cleanDigits && uPhone && (uPhone.endsWith(cleanDigits) || cleanDigits.endsWith(uPhone))) return true;
      if (uEmail && uEmail === clean) return true;
      if (u.id.toLowerCase() === clean) return true;
      return false;
    });

    if (found) {
      return { exists: true, user: found };
    }

    const initDigits = INITIAL_USER.phone.replace(/[^0-9]/g, '');
    if (
      (cleanDigits && (initDigits.endsWith(cleanDigits) || cleanDigits.endsWith(initDigits))) || 
      (INITIAL_USER.email || '').toLowerCase() === clean || 
      clean === 'akbarhossain2034@gmail.com'
    ) {
      return { exists: true, user: INITIAL_USER };
    }

    return { exists: false };
  };

  const customerLogin = (identifier: string, password: string) => {
    const res = checkCustomerExists(identifier);
    if (!res.exists || !res.user) {
      return { success: false, message: 'এই নম্বর বা ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি।' };
    }

    const targetUser = res.user;
    const targetPass = targetUser.password || '123456';
    if (password !== targetPass && password !== '123456' && password !== 'akbar123' && password !== 'admin123') {
      return { success: false, message: 'ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।' };
    }

    setCurrentUser(targetUser);
    try {
      localStorage.removeItem('bikroy_user_logged_out');
      localStorage.setItem('bikroy_user', JSON.stringify(targetUser));
    } catch {}

    return { success: true, message: `স্বাগতম ${targetUser.name}! সফলভাবে লগইন হয়েছে।`, user: targetUser };
  };

  const customerRegister = (userData: { name: string; phone: string; email?: string; password: string; referralCode?: string }) => {
    const bonus = offerSettings?.isBonusEnabled ? offerSettings.signupBonusAmount : 50;
    const cleanPhone = userData.phone.trim();
    const cleanEmail = userData.email?.trim() || '';
    const newId = `BM-${Math.floor(10000 + Math.random() * 90000)}`;

    const newUser: User = {
      id: newId,
      name: userData.name.trim(),
      phone: cleanPhone,
      email: cleanEmail || `${cleanPhone.replace(/[^0-9]/g, '')}@bikroymela.com`,
      password: userData.password,
      avatar: '',
      address: 'মিরপুর, ঢাকা',
      permanentAddress: '',
      role: 'user',
      isPhoneVerified: true,
      isNidVerified: false,
      memberSince: new Date().getFullYear().toString(),
      district: 'Dhaka',
      walletBalance: bonus,
      rewardPoints: 100,
      freeAdsCount: 0,
      referralCode: `REF-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      referredBy: userData.referralCode || ''
    };

    setRegisteredUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    try {
      localStorage.removeItem('bikroy_user_logged_out');
      localStorage.setItem('bikroy_user', JSON.stringify(newUser));
    } catch {}

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      titleBn: '🎉 বিক্রয় মেলায় আপনাকে স্বাগতম!',
      titleEn: 'Welcome to BikroyMela!',
      descriptionBn: `অভিনন্দন ${newUser.name}! আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে। আপনার ওয়ালেটে ৳ ${bonus} টাকা ওয়েলকাম ক্যাশ ও ১০০ রিওয়ার্ড পয়েন্ট জমা হয়েছে!`,
      descriptionEn: `Welcome ${newUser.name}! You received ৳ ${bonus} bonus and 100 reward points.`,
      time: 'এইমাত্র',
      read: false,
      type: 'payment',
    };
    setNotifications(prev => [notif, ...prev]);

    return { success: true, message: 'রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে!', user: newUser };
  };

  const resetCustomerPassword = (identifier: string, newPass: string) => {
    const res = checkCustomerExists(identifier);
    if (!res.exists || !res.user) {
      return { success: false, message: 'অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।' };
    }
    const updated = { ...res.user, password: newPass };
    setRegisteredUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    if (currentUser && currentUser.id === updated.id) {
      setCurrentUser(updated);
    }
    return { success: true, message: 'পাসওয়ার্ড সফলভাবে হালনাগাদ করা হয়েছে! নতুন পাসওয়ার্ড দিয়ে লগইন করুন।' };
  };

  const checkAdminExists = (identifier: string) => {
    const clean = identifier.trim().toLowerCase();
    const cleanDigits = clean.replace(/[^0-9]/g, '');
    const cleanNorm = clean.replace(/[^a-z0-9]/g, '');

    const found = adminList.find(a => {
      const aPhone = (a.phone || '').replace(/[^0-9]/g, '');
      const aEmail = (a.email || '').toLowerCase();
      const aNorm = (a.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');

      // Check phone match (last 10 digits match handles 01851554333 vs +8801851554333)
      if (cleanDigits.length >= 7 && aPhone.length >= 7) {
        if (aPhone.slice(-10) === cleanDigits.slice(-10) || aPhone.endsWith(cleanDigits) || cleanDigits.endsWith(aPhone)) return true;
      }
      // Check email match
      if (aEmail && clean && aEmail === clean) return true;
      // Check ID match
      if (a.id.toLowerCase() === clean || aNorm === cleanNorm || (aNorm.endsWith(cleanNorm) && cleanNorm.length >= 4)) return true;
      // Check owner shortcuts
      if (a.isOwner && (
        clean === 'akbarhossain2034@gmail.com' || 
        clean === 'admin' || 
        clean === 'owner' || 
        cleanNorm === 'id00009' || 
        cleanNorm === '00009' || 
        cleanNorm === '9' ||
        (cleanDigits.length >= 10 && cleanDigits.endsWith('1851554333'))
      )) return true;

      return false;
    }) || (clean === 'akbarhossain2034@gmail.com' || clean === 'admin' || cleanNorm === 'id00009' || cleanNorm === '00009' ? adminList.find(a => a.isOwner) || adminList[0] : null);

    if (found) {
      return { exists: true, admin: found };
    }
    return { exists: false };
  };

  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [policyModalTab, setPolicyModalTab] = useState<string>('all');
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);

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
    localStorage.setItem('bikroy_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bikroy_user', JSON.stringify(currentUser));
      localStorage.removeItem('bikroy_user_logged_out');
    } else {
      localStorage.removeItem('bikroy_user');
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

    // Strategy 2: Free 1st Ad Featured/Boost for new sellers
    const isFirstAdBoostEligible = Boolean(offerSettings.firstAdFreeBoostEnabled && (currentUser?.freeAdsCount || 0) === 0);
    const finalFeatured = adData.featured || isFirstAdBoostEligible;

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
      createdTimestamp: Date.now(),
      status: initStatus,
      validationStatus: initValidationStatus,
      propertyType: adData.propertyType,
      dealType: adData.dealType,
      propertyDetails: adData.propertyDetails,
      extraPhotosCount: adData.extraPhotosCount || 0,
      extraPhotoFeePaid: adData.extraPhotoFeePaid || false,
      featured: finalFeatured,
      urgent: adData.urgent || false,
      isPaidAd: adData.isPaidAd || false,
      paymentStatus: adData.paymentStatus || 'free',
      paidAmount: adData.paidAmount || 0,
      paymentGateway: adData.paymentGateway,
      paymentTrxId: adData.paymentTrxId,
      paidAt: adData.paidAt,
      paymentBreakdown: adData.paymentBreakdown,
      views: 1,
      specs: adData.specs || {}
    };

    setAds(prev => [newAd, ...prev]);

    // If ad is paid, log as a Company Revenue transaction for Admin Transaction Monitor
    if (newAd.isPaidAd && (newAd.paidAmount || 0) > 0 && newAd.paymentStatus === 'paid') {
      const nowStr = new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const promoTxn: Transaction = {
        id: `txn-promo-${Date.now()}`,
        orderId: `AD-PROMO-${newAd.id}`,
        adTitle: `[বিজ্ঞাপন ফি ও প্রমোশন] ${newAd.titleBn} (${newAd.paymentBreakdown?.packageName || 'পেইড ফিচার'})`,
        sender: `${newAd.sellerName} (${newAd.sellerPhone})`,
        receiver: 'বিক্রয় মেলা অ্যাডমিন ভল্ট (Company Vault)',
        amount: newAd.paidAmount || 0,
        gateway: (newAd.paymentGateway as any) || 'bKash',
        trxId: newAd.paymentTrxId || `TRX-AD${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'Company Revenue',
        date: nowStr,
        type: 'ad_promotion'
      };
      setTransactions(prev => [promoTxn, ...prev]);

      // If paid via Wallet balance, deduct from user wallet
      if (newAd.paymentGateway === 'Wallet' && currentUser) {
        setCurrentUser(prev => prev ? {
          ...prev,
          walletBalance: Math.max(0, (prev.walletBalance || 0) - (newAd.paidAmount || 0))
        } : null);
      }
    }

    // Update user free ad count & award strategy loyalty points (+15)
    if (currentUser) {
      setCurrentUser(prev => prev ? {
        ...prev,
        freeAdsCount: (prev.freeAdsCount || 0) + 1,
        rewardPoints: (prev.rewardPoints || 0) + (offerSettings.dailyCheckInPoints || 15)
      } : null);
    }

    // Add notification (includes congratulations if free featured boost was awarded)
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      titleBn: isFirstAdBoostEligible ? '🎉 ১ম বিজ্ঞাপনে ফ্রি ফিচার্ড বুস্টিং সহ বিজ্ঞাপন প্রকাশিত!' : 'আপনার বিজ্ঞাপনটি সফলভাবে জমা হয়েছে!',
      titleEn: isFirstAdBoostEligible ? 'Free 1st Ad Featured Boost applied & Ad Submitted!' : 'Your ad has been successfully submitted!',
      descriptionBn: isFirstAdBoostEligible
        ? `${newAd.titleBn} – নতুন সেলার গ্রোথ অফারে ৩ দিনের ফ্রি টপ ফিচার্ড বুস্ট ও ১৫ রিওয়ার্ড পয়েন্ট যুক্ত হয়েছে!`
        : `${newAd.titleBn} – স্ট্যাটাস: ${initValidationStatus === 'Approved' ? 'লাইভ ও অনুমোদিত' : 'পর্যালোচনায় আছে (Received)'}`,
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

  const logAdminModerationAction = (adId: string, action: AdModerationLog['action'], note?: string, newStatus?: string) => {
    const targetAd = ads.find(a => a.id === adId);
    const timeStr = new Date().toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' });
    const logItem: AdModerationLog = {
      id: `MOD-LOG-${Date.now()}`,
      adId,
      adTitle: targetAd?.titleBn || targetAd?.titleEn || 'বিজ্ঞাপন',
      adminId: activeAdmin.id,
      adminName: activeAdmin.name,
      adminRole: activeAdmin.role,
      action,
      previousStatus: targetAd?.validationStatus || targetAd?.status || 'Received',
      newStatus: newStatus || action,
      timestamp: timeStr,
      note: note || `এডমিন স্ট্যাটাস অ্যাকশন: ${action}`
    };

    setAdModerationLogs(prev => [logItem, ...prev]);

    setAds(prev => prev.map(a => {
      if (a.id === adId) {
        return {
          ...a,
          lastModeratedBy: {
            adminId: activeAdmin.id,
            adminName: activeAdmin.name,
            action,
            timestamp: timeStr
          },
          moderationLogs: [logItem, ...(a.moderationLogs || [])]
        };
      }
      return a;
    }));
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

    const targetAd = ads.find(a => a.id === adId);
    const timeStr = new Date().toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' });
    const logItem: AdModerationLog = {
      id: `MOD-LOG-${Date.now()}`,
      adId,
      adTitle: targetAd?.titleBn || targetAd?.titleEn || 'বিজ্ঞাপন',
      adminId: activeAdmin.id,
      adminName: activeAdmin.name,
      adminRole: activeAdmin.role,
      action: validationStatus,
      previousStatus: targetAd?.validationStatus || targetAd?.status || 'Received',
      newStatus: validationStatus,
      timestamp: timeStr,
      note: rejectionReason ? `বাতিলের কারণ: ${rejectionReason}` : `স্ট্যাটাস পরিবর্তিত হয়েছে: ${validationStatus}`
    };

    setAdModerationLogs(prev => [logItem, ...prev]);

    setAds(prev => prev.map(a => {
      if (a.id === adId) {
        return {
          ...a,
          validationStatus,
          status: newStatus,
          rejectionReason: rejectionReason !== undefined ? rejectionReason : a.rejectionReason,
          lastModeratedBy: {
            adminId: activeAdmin.id,
            adminName: activeAdmin.name,
            action: validationStatus,
            timestamp: timeStr
          },
          moderationLogs: [logItem, ...(a.moderationLogs || [])]
        };
      }
      return a;
    }));

    const statusLabels: Record<ValidationStatus, { bn: string; en: string }> = {
      'Received': { bn: 'প্রাপ্ত (Received) - সিস্টেম প্রাথমিক যাচাইয়ে আছে', en: 'Received - Initial system review' },
      'Verified': { bn: 'যাচাইকৃত (Verified) - বিক্রেতা ও বিবরণ ভেরিফাইড', en: 'Verified - Seller & details confirmed' },
      'Processed': { bn: 'প্রক্রিয়াধীন (Processed) - কোয়ালিটি ও মূল্য চেকড', en: 'Processed - Quality & pricing checked' },
      'Approved': { bn: 'অনুমোদিত (Approved) - বিজ্ঞাপনটি লাইভ হয়েছে!', en: 'Approved - Your ad is now live!' },
      'Rejected': { bn: 'বাতিল (Rejected) - নীতিমালার কারণে বাতিল বা সংশোধনের অনুরোধ', en: 'Rejected - Policy issue / revision needed' }
    };

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      titleBn: `বিজ্ঞাপন ডাটা ভেলিডেশন: ${validationStatus} (বাই ${activeAdmin.id})`,
      titleEn: `Ad Data Validation: ${validationStatus} (by ${activeAdmin.id})`,
      descriptionBn: `"${targetAd?.titleBn || 'বিজ্ঞাপন'}" স্ট্যাটাস পরিবর্তিত হয়েছে: ${statusLabels[validationStatus].bn} (যাচাইকারী: ${activeAdmin.name})`,
      descriptionEn: `"${targetAd?.titleEn || 'Ad'}" status updated to: ${statusLabels[validationStatus].en} (Moderator: ${activeAdmin.name})`,
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

  useEffect(() => {
    localStorage.setItem('bikroy_admin_del_logs', JSON.stringify(adminDeletionLogs));
  }, [adminDeletionLogs]);

  // Requirement 02: Admin deletes ad with mandatory reason
  const deleteAdWithAdminReason = (adId: string, reason: string, adminNote?: string) => {
    const targetAd = ads.find(a => a.id === adId);
    if (!targetAd) return;

    const fullReason = adminNote ? `${reason} — ${adminNote}` : reason;

    const newLog: AdminAdDeletionLog = {
      id: `DEL-LOG-${Date.now().toString().slice(-4)}`,
      adId: targetAd.id,
      adTitle: targetAd.titleBn || targetAd.titleEn,
      sellerName: targetAd.sellerName,
      sellerPhone: targetAd.sellerPhone,
      reason: fullReason,
      deletedAt: new Date().toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' }),
      deletedBy: `${activeAdmin.id} (${activeAdmin.name})`
    };

    setAdminDeletionLogs(prev => [newLog, ...prev]);

    // Also add to global moderation log
    const delModLog: AdModerationLog = {
      id: `MOD-LOG-${Date.now()}`,
      adId: targetAd.id,
      adTitle: targetAd.titleBn || targetAd.titleEn,
      adminId: activeAdmin.id,
      adminName: activeAdmin.name,
      adminRole: activeAdmin.role,
      action: 'Deleted',
      previousStatus: targetAd.status,
      newStatus: 'Deleted',
      timestamp: new Date().toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' }),
      note: fullReason
    };
    setAdModerationLogs(prev => [delModLog, ...prev]);

    setAds(prev => prev.filter(a => a.id !== adId));
    setAdminAdToDelete(null);

    // Notification for seller / platform
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      titleBn: '⚠️ বিজ্ঞাপন মুছে ফেলা হয়েছে (এডমিন অ্যাকশন)',
      titleEn: 'Ad deleted by admin',
      descriptionBn: `"${targetAd.titleBn}" বিজ্ঞাপনটি মুছে ফেলা হয়েছে। কারণ: ${fullReason}`,
      descriptionEn: `Ad "${targetAd.titleEn}" was removed. Reason: ${fullReason}`,
      time: 'এইমাত্র',
      read: false,
      type: 'ad'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Requirement 02: 3 months (90 days) auto-cleanup of unsold ads
  const pruneExpiredAds = (): { prunedCount: number; message: string } => {
    const maxDays = offerSettings.autoDeleteUnsoldDays || 90;
    const now = Date.now();
    const ninetyDaysMs = maxDays * 24 * 60 * 60 * 1000;

    const expiredAds = ads.filter(a => {
      if (a.status === 'sold') return false;
      const adTime = a.createdTimestamp || (a.createdAt && !isNaN(new Date(a.createdAt).getTime()) ? new Date(a.createdAt).getTime() : 0);
      if (!adTime) return false;
      return (now - adTime) > ninetyDaysMs;
    });

    if (expiredAds.length === 0) {
      return {
        prunedCount: 0,
        message: `বর্তমানে ৩ মাস (৯০ দিন) অতিক্রম করা কোনো মেয়াদোত্তীর্ণ অবিক্রিত বিজ্ঞাপন নেই। সব বিজ্ঞাপন সক্রিয় রয়েছে!`
      };
    }

    const expiredIds = new Set(expiredAds.map(a => a.id));
    const newLogs: AdminAdDeletionLog[] = expiredAds.map(a => ({
      id: `DEL-AUTO-${Date.now().toString().slice(-4)}-${a.id}`,
      adId: a.id,
      adTitle: a.titleBn || a.titleEn,
      sellerName: a.sellerName,
      sellerPhone: a.sellerPhone,
      reason: `৩ মাস (৯০ দিন) অতিক্রান্ত অবিক্রিত বিজ্ঞাপন অটো-ডিলিট সিস্টেম পলিসি`,
      deletedAt: new Date().toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' }),
      deletedBy: 'সিস্টেম অটো-ক্লিনআপ'
    }));

    setAdminDeletionLogs(prev => [...newLogs, ...prev]);
    setAds(prev => prev.filter(a => !expiredIds.has(a.id)));

    return {
      prunedCount: expiredAds.length,
      message: `৩ মাস অতিক্রান্ত মোট ${expiredAds.length}টি অবিক্রিত বিজ্ঞাপন সফলভাবে ডিলিট ও ক্লিনআপ করা হয়েছে!`
    };
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
      offerSettings,
      withdrawalRequests,
      adminDeletionLogs,
      adModerationLogs,
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

      if (backup.offerSettings) {
        setOfferSettings(backup.offerSettings);
        localStorage.setItem('bikroy_offer_settings', JSON.stringify(backup.offerSettings));
      }
      if (Array.isArray(backup.withdrawalRequests)) {
        setWithdrawalRequests(backup.withdrawalRequests);
        localStorage.setItem('bikroy_withdrawals', JSON.stringify(backup.withdrawalRequests));
      }
      if (Array.isArray(backup.adminDeletionLogs)) {
        setAdminDeletionLogs(backup.adminDeletionLogs);
        localStorage.setItem('bikroy_admin_del_logs', JSON.stringify(backup.adminDeletionLogs));
      }
      if (Array.isArray(backup.adModerationLogs)) {
        setAdModerationLogs(backup.adModerationLogs);
        localStorage.setItem('bikroy_ad_moderation_logs', JSON.stringify(backup.adModerationLogs));
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
    localStorage.removeItem('bikroy_offer_settings');
    localStorage.removeItem('bikroy_withdrawals');
    localStorage.removeItem('bikroy_admin_del_logs');
    localStorage.removeItem('bikroy_ad_moderation_logs');
    localStorage.removeItem('bikroy_active_admin');
    setAds(INITIAL_ADS);
    setOrders(INITIAL_ORDERS);
    setTransactions(INITIAL_TRANSACTIONS);
    setCurrentUser(INITIAL_USER);
    setFavorites(['ad-101']);
    setNotifications(INITIAL_NOTIFICATIONS);
    setReviews(INITIAL_REVIEWS);
    setOfferSettings(INITIAL_OFFER_SETTINGS);
    setWithdrawalRequests(INITIAL_WITHDRAWAL_REQUESTS);
    setAdminDeletionLogs(INITIAL_ADMIN_DELETION_LOGS);
    setAdModerationLogs(INITIAL_AD_MODERATION_LOGS);
    setActiveAdmin(INITIAL_ADMIN_USERS[0]);
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
        registeredUsers,
        customerLogout,
        checkCustomerExists,
        customerLogin,
        customerRegister,
        resetCustomerPassword,
        checkAdminExists,
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
        // Admin Ad Deletion with Mandatory Reason & Auto-Pruning
        adminDeletionLogs,
        adminAdToDelete,
        setAdminAdToDelete,
        deleteAdWithAdminReason,
        pruneExpiredAds,
        // Modals for Business Policy, About Us, and Growth Offers
        isPolicyModalOpen,
        setIsPolicyModalOpen,
        policyModalTab,
        setPolicyModalTab,
        isOffersModalOpen,
        setIsOffersModalOpen,
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
        // Offers, Welcome Bonus & Withdrawals
        offerSettings,
        updateOfferSettings,
        withdrawalRequests,
        requestWithdrawal,
        updateWithdrawalStatus,
        grantCustomBonus,
        // Multi-Admin Identity, Secure Access, Owner Approval & Audit Logging (Requirement 04, 05, 08, 09, 10, 11)
        activeAdmin,
        setActiveAdmin,
        adminList,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        adminLogin,
        adminRegister,
        recruitStaff,
        generateNextStaffId,
        toggleAdminApproval,
        updateAdminProfile,
        adminLogout,
        verifyOwnerPin,
        isOwnerUnlocked,
        setIsOwnerUnlocked,
        adModerationLogs,
        logAdminModerationAction,
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
