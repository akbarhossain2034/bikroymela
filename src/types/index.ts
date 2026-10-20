export type Language = 'bn' | 'en';

export type AdCondition = 'used' | 'new' | 'reconditioned';

export type ValidationStatus = 'Received' | 'Verified' | 'Processed' | 'Approved' | 'Rejected';

export type PropertyType = 'land' | 'flat' | 'house' | 'shop' | 'room' | 'commercial';
export type DealType = 'sale' | 'rent';

export interface Category {
  id: string;
  nameBn: string;
  nameEn: string;
  icon: string;
  count: number;
  isUpcoming?: boolean;
}

export interface Ad {
  id: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  price: number;
  isNegotiable: boolean;
  category: string;
  condition: AdCondition;
  location: {
    division: string;
    areaBn: string;
    areaEn: string;
  };
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerVerified: boolean;
  sellerRating: number;
  sellerMemberSince: string;
  createdAt: string;
  status: 'active' | 'pending' | 'sold' | 'rejected';
  validationStatus?: ValidationStatus;
  rejectionReason?: string;
  propertyType?: PropertyType;
  dealType?: DealType;
  propertyDetails?: {
    size?: string;
    bedrooms?: number;
    bathrooms?: number;
    floorLevel?: string;
    facing?: string;
  };
  extraPhotosCount?: number;
  extraPhotoFeePaid?: boolean;
  youtubeUrl?: string;
  featured?: boolean;
  urgent?: boolean;
  isPaidAd?: boolean;
  paymentStatus?: 'paid' | 'unpaid' | 'free';
  paidAmount?: number;
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
  views: number;
  specs?: Record<string, string>;
  createdTimestamp?: number;
  postedDate?: string;
  daysRemaining?: number; // 90 days countdown
  isExpired?: boolean;
  deletionReason?: string;
  deletedAt?: string;
  moderationLogs?: AdModerationLog[];
  lastModeratedBy?: {
    adminId: string;
    adminName: string;
    action: string;
    timestamp: string;
  };
}

export interface AdModerationLog {
  id: string;
  adId: string;
  adTitle: string;
  adminId: string; // e.g. "ADM-101"
  adminName: string; // e.g. "Md. Akbar Hossain"
  adminRole?: string; // e.g. "Super Admin"
  action: 'Received' | 'Verified' | 'Processed' | 'Approved' | 'Rejected' | 'Deleted' | 'StatusChanged';
  previousStatus?: string;
  newStatus: string;
  timestamp: string;
  note?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  username?: string; // Unique Name e.g. Arifhossain388@
  role: 'Super Admin' | 'Moderator' | 'Quality Officer' | 'Account Manager' | 'Support Executive' | string;
  designation?: string;
  phone: string;
  email: string;
  department?: string;
  salary?: string | number;
  dob?: string;
  telephone?: string;
  nid?: string;
  presentAddress?: string;
  permanentAddress?: string;
  gender?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  isOwner?: boolean;
  isApprovedByOwner?: boolean;
  password?: string;
  registeredAt?: string;
}

export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone: string;
  avatar?: string;
  address?: string;
  permanentAddress?: string;
  dob?: string;
  gender?: string;
  role: 'user' | 'seller' | 'admin';
  password?: string;
  loginMethod?: 'phone' | 'email' | 'facebook' | 'google';
  isPhoneVerified: boolean;
  isNidVerified: boolean;
  nidNumber?: string;
  memberSince: string;
  district: string;
  walletBalance: number; // ৳ 50 registration bonus
  rewardPoints: number; // loyalty points earned on transactions
  freeAdsCount?: number; // count of free ads posted (first 5 are free)
  referralCode?: string; // unique referral code e.g. REF-BM-9824
  referredBy?: string;
  referralCount?: number;
  referralEarnings?: number;
  lastCheckInDate?: string;
  hasUsedFirstAdBoost?: boolean;
  hasUsedFirstOrderFreeDelivery?: boolean;
}

export interface Review {
  id: string;
  orderId?: string;
  adTitle: string;
  reviewerName: string;
  targetUserId: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: string;
  role: 'buyer' | 'seller';
}

export interface RevenueStats {
  escrowCommissionRate: number; // e.g. 2.5%
  totalEscrowEarned: number;
  totalFeaturedEarned: number;
  totalDeliveryMargin: number;
  totalPlatformNetProfit: number;
}

export interface Order {
  id: string;
  adId: string;
  adTitle: string;
  adImage: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  sellerId: string;
  sellerName: string;
  price: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Card' | 'COD';
  paymentStatus: 'paid' | 'escrow_held' | 'released' | 'refunded';
  courierName: string;
  trackingNumber: string;
  status: 'order_placed' | 'confirmed' | 'dispatched' | 'in_transit' | 'delivered';
  createdAt: string;
  updatedAt: string;
  timeline: {
    titleBn: string;
    titleEn: string;
    date: string;
    completed: boolean;
  }[];
}

export interface Transaction {
  id: string;
  orderId: string;
  adTitle: string;
  sender: string;
  receiver: string;
  amount: number;
  gateway: 'bKash' | 'Nagad' | 'Rocket' | 'Visa/Mastercard' | 'COD' | 'Wallet';
  trxId: string;
  status: 'Escrow Held' | 'Released' | 'Refunded' | 'Pending' | 'Company Revenue';
  date: string;
  type?: 'escrow_order' | 'ad_promotion' | 'extra_photos' | 'wallet_topup';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  adId?: string;
  adTitle?: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface NotificationItem {
  id: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  time: string;
  read: boolean;
  type: 'order' | 'ad' | 'chat' | 'payment';
}

export interface BonusOfferSettings {
  isBonusEnabled: boolean;
  signupBonusAmount: number; // e.g. 50, 100, 200, 500 BDT
  minWithdrawLimit: number; // e.g. 100, 200 BDT
  allowedGateways: ('bKash' | 'Nagad' | 'Rocket' | 'Bank')[];
  allowPurchaseWithBonus: boolean;
  campaignTitleBn: string;
  campaignTitleEn: string;
  campaignDescriptionBn: string;
  isBannerActive: boolean;
  // 6 Proven Growth & Marketing Features
  referralBonusAmount: number; // e.g. ৳ 50 per successful friend invite
  dailyCheckInPoints: number; // e.g. 15-20 points daily
  firstAdFreeBoostEnabled: boolean; // 3-day Free Top Ad for new sellers
  firstOrderFreeDeliveryEnabled: boolean; // 100% free delivery on 1st escrow order
  festiveCampaignMode: 'normal' | 'eid_mega' | 'new_year';
  autoDeleteUnsoldDays: number; // default 90 days (3 months)
}

export interface AdminAdDeletionLog {
  id: string;
  adId: string;
  adTitle: string;
  sellerName: string;
  sellerPhone: string;
  reason: string;
  deletedAt: string;
  deletedBy: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  amount: number;
  gateway: 'bKash' | 'Nagad' | 'Rocket' | 'Bank';
  accountNumber: string;
  accountType?: 'personal' | 'agent';
  status: 'Pending' | 'Paid' | 'Rejected';
  trxId?: string;
  requestedAt: string;
  processedAt?: string;
  adminNote?: string;
}

export interface SystemBackup {
  version: string;
  timestamp: string;
  backupDate: string;
  metadata: {
    siteName: string;
    domainName: string;
    totalAds: number;
    totalOrders: number;
    totalTransactions: number;
    totalUsers: number;
  };
  siteSettings: {
    siteName: string;
    domainName: string;
    lang: Language;
  };
  ads: Ad[];
  orders: Order[];
  transactions: Transaction[];
  currentUser: User | null;
  registeredUsers?: User[];
  favorites: string[];
  notifications: NotificationItem[];
  chatMessages: ChatMessage[];
  reviews: Review[];
  offerSettings?: BonusOfferSettings;
  withdrawalRequests?: WithdrawalRequest[];
  adminDeletionLogs?: AdminAdDeletionLog[];
  adModerationLogs?: AdModerationLog[];
}
