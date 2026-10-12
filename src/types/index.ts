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
  views: number;
  specs?: Record<string, string>;
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
  loginMethod?: 'phone' | 'email' | 'facebook' | 'google';
  isPhoneVerified: boolean;
  isNidVerified: boolean;
  nidNumber?: string;
  memberSince: string;
  district: string;
  walletBalance: number; // ৳ 50 registration bonus
  rewardPoints: number; // loyalty points earned on transactions
  freeAdsCount?: number; // count of free ads posted (first 5 are free)
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
  gateway: 'bKash' | 'Nagad' | 'Rocket' | 'Visa/Mastercard' | 'COD';
  trxId: string;
  status: 'Escrow Held' | 'Released' | 'Refunded' | 'Pending';
  date: string;
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
}
