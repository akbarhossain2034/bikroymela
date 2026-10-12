import { Ad, Category, Order, Transaction, User, NotificationItem, Review } from '../types';

export const LOCATIONS = [
  { division: 'Dhaka', divisionBn: 'ঢাকা', areas: ['Mirpur', 'Uttara', 'Dhanmondi', 'Gulshan', 'Mohammadpur', 'Motijheel', 'Banani', 'Badda'] },
  { division: 'Chattogram', divisionBn: 'চট্টগ্রাম', areas: ['Agrabad', 'GEC Circle', 'Nasirabad', 'Chawkbazar', 'Halishahar', 'Panchlaish'] },
  { division: 'Sylhet', divisionBn: 'সিলেট', areas: ['Zindabazar', 'Uposhohor', 'Amberkhana', 'Shibganj', 'Subidbazar'] },
  { division: 'Rajshahi', divisionBn: 'রাজশাহী', areas: ['Shaheb Bazar', 'Motihar', 'Boalia', 'Kazla', 'Upashahar'] },
  { division: 'Khulna', divisionBn: 'খুলনা', areas: ['Sonadanga', 'Boyra', 'Khalishpur', 'Daulatpur', 'Shibbari'] },
  { division: 'Barishal', divisionBn: 'বরিশাল', areas: ['Sadar', 'Natun Bazar', 'Rupatali', 'Amtala'] },
  { division: 'Rangpur', divisionBn: 'রংপুর', areas: ['Dhap', 'Jahaj Company Mor', 'Modern Mor', 'College Road'] },
  { division: 'Mymensingh', divisionBn: 'ময়মনসিংহ', areas: ['Ganginar Par', 'Charpara', 'Town Hall', 'Kashor'] }
];

export const CATEGORIES: Category[] = [
  { id: 'mobiles', nameBn: 'মোবাইল ও গ্যাজেট', nameEn: 'Mobiles & Gadgets', icon: 'Smartphone', count: 1845 },
  { id: 'electronics', nameBn: 'ইলেকট্রনিক্স ও ল্যাপটপ', nameEn: 'Electronics & Laptops', icon: 'Laptop', count: 960 },
  { id: 'vehicles', nameBn: 'যানবাহন ও মোটরবাইক', nameEn: 'Vehicles & Bikes', icon: 'Car', count: 720 },
  { id: 'property', nameBn: 'প্রোপার্টি (জমি, বাড়ি, দোকান, ফ্ল্যাট)', nameEn: 'Property (Land, House, Shop, Flat)', icon: 'Home', count: 850 },
  { id: 'home', nameBn: 'হোম ও লিভিং', nameEn: 'Home & Living', icon: 'Sofa', count: 410 },
  { id: 'fashion', nameBn: 'ফ্যাশন ও রূপচর্চা', nameEn: 'Fashion & Beauty', icon: 'ShoppingBag', count: 320 },
  { id: 'pets', nameBn: 'পোষা প্রাণী ও পাখি', nameEn: 'Pets & Animals', icon: 'PawPrint', count: 190 },
  { id: 'services', nameBn: 'ব্যবসা ও সেবা', nameEn: 'Services & Business', icon: 'Briefcase', count: 280 },
  { id: 'jobs', nameBn: '💼 চাকরি ও নিয়োগ (আসন্ন)', nameEn: 'Jobs & Careers (Coming Soon)', icon: 'Award', count: 0, isUpcoming: true }
];

export const INITIAL_ADS: Ad[] = [
  {
    id: 'ad-101',
    titleBn: 'iPhone 14 Pro Max 256GB Deep Purple (অফিসিয়াল ও ফ্রেশ কন্ডিশন)',
    titleEn: 'iPhone 14 Pro Max 256GB Deep Purple (Official & Pristine)',
    descriptionBn: 'সম্পূর্ণ ফ্রেশ কন্ডিশন, কোনো দাগ বা স্ক্র্যাচ নেই। ব্যাটারি হেলথ ৮৯%। বক্স, অরিজিনাল ক্যাবল ও মানি রিসিট সহ দেওয়া হবে। মিরপুর-১০ এসে দেখে নিতে পারবেন।',
    descriptionEn: 'Mint condition, zero scratches. 89% battery health. Comes with original box, cable, and purchase cash memo. Self-pickup at Mirpur-10.',
    price: 98500,
    isNegotiable: true,
    category: 'mobiles',
    condition: 'used',
    location: {
      division: 'Dhaka',
      areaBn: 'মিরপুর-১০, ঢাকা',
      areaEn: 'Mirpur-10, Dhaka'
    },
    images: ['/src/assets/images/classifieds_smartphone_1791109437128.jpg'],
    sellerId: 'user-002',
    sellerName: 'তানভীর আহমেদ',
    sellerPhone: '01712-345678',
    sellerVerified: true,
    sellerRating: 4.9,
    sellerMemberSince: '2023',
    createdAt: '২ ঘণ্টা আগে',
    status: 'active',
    featured: true,
    urgent: true,
    views: 428,
    specs: {
      'Storage': '256 GB',
      'Battery Health': '89%',
      'Color': 'Deep Purple',
      'Warranty': '3 Months Shop'
    }
  },
  {
    id: 'ad-102',
    titleBn: 'Yamaha FZ-S Version 3.0 ABS (ডিজিটাল নাম্বার প্লেট সহ)',
    titleEn: 'Yamaha FZ-S Version 3.0 Dual ABS (With Digital Number Plate)',
    descriptionBn: 'বাইকটি মাত্র ১২,০০০ কি.মি রান করেছে। প্রথম মালিক, মিরপুর বিআরটিএ থেকে ২ বছরের কাগজ করা। কোনো এক্সিডেন্ট হিস্ট্রি নেই। সরাসরি দেখে দামাদামি করতে পারবেন।',
    descriptionEn: 'Run only 12,000 km. First owner, 2-year registration from Mirpur BRTA. Never in an accident. Test drive welcome at Dhanmondi.',
    price: 195000,
    isNegotiable: true,
    category: 'vehicles',
    condition: 'used',
    location: {
      division: 'Dhaka',
      areaBn: 'ধানমন্ডি, ঢাকা',
      areaEn: 'Dhanmondi, Dhaka'
    },
    images: ['/src/assets/images/classifieds_motorcycle_1791109454846.jpg'],
    sellerId: 'user-003',
    sellerName: 'মাহমুদুল হাসান',
    sellerPhone: '01819-876543',
    sellerVerified: true,
    sellerRating: 4.8,
    sellerMemberSince: '2022',
    createdAt: '৪ ঘণ্টা আগে',
    status: 'active',
    featured: true,
    urgent: false,
    views: 890,
    specs: {
      'Engine': '149 cc',
      'KM Driven': '12,000 km',
      'Registration': 'Mirpur BRTA (2 Years)',
      'Condition': 'Like New'
    }
  },
  {
    id: 'ad-103',
    titleBn: 'Apple MacBook Pro M2 Pro 14-inch (16GB RAM / 512GB SSD)',
    titleEn: 'Apple MacBook Pro M2 Pro 14-inch (16GB RAM / 512GB SSD)',
    descriptionBn: 'ইউএসএ থেকে আনা, ব্যক্তিগত ব্যবহারের জন্য কেনা হয়েছিল। ব্যাটারি সাইকেল কাউন্ট মাত্র ৪২। সাথে অরিজিনাল ৯৬ ওয়াট ফাস্ট চার্জার ও বক্স রয়েছে।',
    descriptionEn: 'Imported from USA, lightly used for coding. Battery cycle count only 42. Includes original 96W MagSafe charger and pristine retail box.',
    price: 172000,
    isNegotiable: false,
    category: 'electronics',
    condition: 'used',
    location: {
      division: 'Dhaka',
      areaBn: 'গুলশান-২, ঢাকা',
      areaEn: 'Gulshan-2, Dhaka'
    },
    images: ['/src/assets/images/classifieds_laptop_1791109467340.jpg'],
    sellerId: 'user-004',
    sellerName: 'আরিফুল ইসলাম',
    sellerPhone: '01911-223344',
    sellerVerified: true,
    sellerRating: 5.0,
    sellerMemberSince: '2021',
    createdAt: 'আজ সকালে',
    status: 'active',
    featured: false,
    urgent: true,
    views: 312,
    specs: {
      'Processor': 'Apple M2 Pro (10-Core)',
      'RAM': '16 GB Unified',
      'Storage': '512 GB SSD',
      'Battery Cycle': '42 cycles'
    }
  },
  {
    id: 'ad-104',
    titleBn: 'উত্তরার ৪ নম্বর সেক্টরে ১৩৫০ স্কয়ার ফুটের লাক্সারি রেডি ফ্ল্যাট বিক্রয়',
    titleEn: '1350 Sqft Ready Luxury Flat for Sale in Uttara Sector 4',
    descriptionBn: '৩ বেড, ৩ বাথ, ৩ ব্যালকনি এবং কার পার্কিং সহ ৫ম তলায় দক্ষিণমুখী চমৎকার আলো-বাতাসপূর্ণ রেডি ফ্ল্যাট। লিফট, জেনারেটর ও ২৪/৭ সিকিউরিটি ব্যবস্থা।',
    descriptionEn: '3 Bed, 3 Bath, 3 Balconies with dedicated car parking on 5th floor. South facing, airy flat with lift, generator backup, and 24/7 security.',
    price: 9200000,
    isNegotiable: true,
    category: 'property',
    condition: 'new',
    location: {
      division: 'Dhaka',
      areaBn: 'উত্তরা সেক্টর ৪, ঢাকা',
      areaEn: 'Uttara Sector 4, Dhaka'
    },
    images: ['/src/assets/images/classifieds_apartment_1791109480005.jpg'],
    sellerId: 'user-005',
    sellerName: 'মোহাম্মদ রফিকুল আলম',
    sellerPhone: '01755-998877',
    sellerVerified: true,
    sellerRating: 4.7,
    sellerMemberSince: '2020',
    createdAt: 'গতকাল',
    status: 'active',
    validationStatus: 'Approved',
    featured: true,
    urgent: false,
    views: 1240,
    specs: {
      'Size': '1,350 sqft',
      'Bedrooms': '3 Bed, 3 Bath',
      'Floor': '5th Floor (Lift-5)',
      'Facing': 'South Facing'
    }
  },
  {
    id: 'ad-105',
    titleBn: 'মিরপুর ডিওএইচএস সংলগ্ন ৫ কাঠা নিষ্কণ্টক আবাসিক জমি / প্লট বিক্রয়',
    titleEn: '5 Katha Residential Land Plot for Sale near Mirpur DOHS',
    descriptionBn: '১০০% নির্ভেজাল, নিষ্কণ্টক বাউন্ডারি করা ৫ কাঠা জমি। গ্যাস-বিদ্যুৎ ও পানি সংযোগের সুব্যবস্থা রয়েছে। সামনে ৩০ ফিট প্রশস্ত পাকা রাস্তা। কাগজপত্র শতভাগ ফ্রেশ ও রেজিস্ট্রি প্রস্তুত।',
    descriptionEn: '100% genuine demarcated 5 katha residential plot. Utilities available with 30ft wide front road. Mutation & registry ready.',
    price: 35000000,
    isNegotiable: true,
    category: 'property',
    propertyType: 'land',
    dealType: 'sale',
    condition: 'new',
    location: {
      division: 'Dhaka',
      areaBn: 'মিরপুর ডিওএইচএস, ঢাকা',
      areaEn: 'Mirpur DOHS, Dhaka'
    },
    images: ['/src/assets/images/real_estate_land_1791471593930.jpg'],
    sellerId: 'user-006',
    sellerName: 'ইঞ্জিনিয়ার মোস্তাফিজুর রহমান',
    sellerPhone: '01711-889900',
    sellerVerified: true,
    sellerRating: 5.0,
    sellerMemberSince: '2022',
    createdAt: '৩ ঘণ্টা আগে',
    status: 'active',
    validationStatus: 'Approved',
    featured: true,
    urgent: true,
    views: 654,
    specs: {
      'টাইপ': 'জমি / প্লট (Land)',
      'লেনদেন': 'সরাসরি বিক্রয় (Sale)',
      'পরিমাপ': '৫ কাঠা (৮.২৫ শতাংশ)',
      'রাস্তা': '৩০ ফিট প্রশস্ত রাস্তা',
      'কাগজপত্র': 'সিএস, এসএ, আরএস নামজারি সম্পন্ন'
    }
  },
  {
    id: 'ad-106',
    titleBn: 'যমুনা ফিউচার পার্ক ২য় তলায় ২০০ স্কয়ার ফিট রানিং দোকান স্পেস ভাড়া',
    titleEn: '200 Sqft Running Commercial Shop Space for Rent at Jamuna Future Park',
    descriptionBn: 'শপিং কমপ্লেক্সের প্রাইম লোকেশনে ফুল ডেকোরেশন করা কাঁচের ফ্রন্ট শো-রুম স্পেস ভাড়া দেওয়া হবে। পোশাক, ইলেকট্রনিক্স বা গ্যাজেট ব্যবসার জন্য দারুণ উপযোগী। অ্যাডভান্স ও মাসিক ভাড়া আলোচনা সাপেক্ষে।',
    descriptionEn: 'Fully decorated 200 sqft glass storefront commercial shop for rent on 2nd floor. Perfect for fashion, gadgets, or electronics.',
    price: 38000,
    isNegotiable: true,
    category: 'property',
    propertyType: 'shop',
    dealType: 'rent',
    condition: 'new',
    location: {
      division: 'Dhaka',
      areaBn: 'বারিধারা / কুড়িল, ঢাকা',
      areaEn: 'Baridhara / Kuril, Dhaka'
    },
    images: ['/src/assets/images/real_estate_shop_1791471612360.jpg'],
    sellerId: 'user-007',
    sellerName: 'হাজী শফিকুল ইসলাম',
    sellerPhone: '01811-224466',
    sellerVerified: true,
    sellerRating: 4.85,
    sellerMemberSince: '2021',
    createdAt: '৫ ঘণ্টা আগে',
    status: 'active',
    validationStatus: 'Approved',
    featured: false,
    urgent: true,
    views: 420,
    specs: {
      'টাইপ': 'দোকান / বাণিজ্যিক স্পেস (Shop)',
      'লেনদেন': 'মাসিক ভাড়া (For Rent)',
      'আকার': '২০০ স্কয়ার ফিট',
      'অবস্থান': '২য় তলা, প্রাইম পয়েন্ট',
      'সুবিধা': 'সেন্ট্রাল এসি ও সার্বক্ষণিক নিরাপত্তা'
    }
  },
  {
    id: 'ad-107',
    titleBn: 'ধানমন্ডি ৮/এ তে ৩ তলা ব্যক্তিগত ডুপ্লেক্স বাড়ি বিক্রয়',
    titleEn: '3-Storey Private Duplex House for Sale at Dhanmondi 8/A',
    descriptionBn: 'ধানমন্ডি লেকের সন্নিকটে নিরিবিলি পরিবেশে ৩ তলা বিশিষ্ট ডুপ্লেক্স বাড়ি। ৪টি গাড়ি পার্কিং, ছাদবাগান এবং কাজের লোকের আলাদা কোয়ার্টার রয়েছে। সরাসরি ক্রয় করতে আগ্রহী ক্রেতা যোগাযোগ করুন।',
    descriptionEn: 'Exclusive 3-storey private duplex house near Dhanmondi lake. 4 car parkings, rooftop garden and servants quarter.',
    price: 48500000,
    isNegotiable: true,
    category: 'property',
    propertyType: 'house',
    dealType: 'sale',
    condition: 'used',
    location: {
      division: 'Dhaka',
      areaBn: 'ধানমন্ডি, ঢাকা',
      areaEn: 'Dhanmondi, Dhaka'
    },
    images: ['/src/assets/images/classifieds_apartment_1791109480005.jpg'],
    sellerId: 'user-008',
    sellerName: 'ব্যারিস্টার খালেদ মাহমুদ',
    sellerPhone: '01911-335577',
    sellerVerified: true,
    sellerRating: 4.9,
    sellerMemberSince: '2020',
    createdAt: '১ দিন আগে',
    status: 'active',
    validationStatus: 'Approved',
    featured: true,
    urgent: false,
    views: 890,
    specs: {
      'টাইপ': 'বাড়ি / ডুপ্লেক্স (House)',
      'লেনদেন': 'সরাসরি বিক্রয় (Sale)',
      'আকার': '৪,২০০ স্কয়ার ফিট ভবন',
      'বেডরুম': '৫টি মাস্টার বেডরুম',
      'পার্কিং': '৪টি প্রাইভেট কার'
    }
  },
  {
    id: 'ad-108',
    titleBn: 'মিরপুর-২ এ ফ্যামিলি বা চাকরিজীবীদের জন্য ২ রুমের ফ্ল্যাট/বাসা ভাড়া',
    titleEn: '2-Room Family Flat / Room for Rent at Mirpur-2',
    descriptionBn: '৪র্থ তলায় আলো-বাতাসপূর্ণ ২ রুম, ১ ডাইনিং, ২ বাথ ও ১ বারান্দা বিশিষ্ট বাসা ভাড়া হবে। গ্যাস সিলিন্ডার ও প্রিপেইড বিদ্যুৎ। শান্ত পরিবেশ। ১ তারিখ থেকে উঠতে পারবেন।',
    descriptionEn: '2 bed, 1 dining, 2 bath flat for rent on 4th floor at Mirpur-2 for family or working professionals.',
    price: 16500,
    isNegotiable: true,
    category: 'property',
    propertyType: 'room',
    dealType: 'rent',
    condition: 'new',
    location: {
      division: 'Dhaka',
      areaBn: 'মিরপুর-২, ঢাকা',
      areaEn: 'Mirpur-2, Dhaka'
    },
    images: ['/src/assets/images/classifieds_apartment_1791109480005.jpg'],
    sellerId: 'user-009',
    sellerName: 'ফারহানা ইয়াসমিন',
    sellerPhone: '01611-998822',
    sellerVerified: true,
    sellerRating: 4.6,
    sellerMemberSince: '2024',
    createdAt: '১ দিন আগে',
    status: 'pending',
    validationStatus: 'Received',
    featured: false,
    urgent: false,
    views: 78,
    specs: {
      'টাইপ': 'বাসা / ফ্ল্যাট ভাড়া (To-Let)',
      'লেনদেন': 'মাসিক ভাড়া',
      'রুম সংখ্যা': '২ রুম + ডাইনিং',
      'বাথরুম': '২টি'
    }
  },
  {
    id: 'ad-109',
    titleBn: 'Samsung Galaxy S23 Ultra 5G (12/256GB Phantom Black)',
    titleEn: 'Samsung Galaxy S23 Ultra 5G (12/256GB Phantom Black)',
    descriptionBn: 'অফিসিয়াল ডিভাইস, ওয়ারেন্টি বাকি ৪ মাস। সাথে অরিজিনাল ৪৫ ওয়াট চার্জার ও এস-পেন রয়েছে। কোনো খোলা বা রিপেয়ার হয়নি।',
    descriptionEn: 'Official device with 4 months warranty remaining. S-Pen, 45W charger included.',
    price: 84000,
    isNegotiable: true,
    category: 'mobiles',
    condition: 'used',
    location: {
      division: 'Dhaka',
      areaBn: 'ধানমন্ডি, ঢাকা',
      areaEn: 'Dhanmondi, Dhaka'
    },
    images: ['/src/assets/images/classifieds_smartphone_1791109437128.jpg'],
    sellerId: 'user-010',
    sellerName: 'রাকিবুল হাসান',
    sellerPhone: '01511-445566',
    sellerVerified: true,
    sellerRating: 4.8,
    sellerMemberSince: '2024',
    createdAt: '২ দিন আগে',
    status: 'pending',
    validationStatus: 'Verified',
    featured: false,
    urgent: false,
    views: 110
  },
  {
    id: 'ad-110',
    titleBn: 'Honda CB Hornet 160R CBS (স্মার্ট কার্ড ও ট্যাক্স টোকেন আপডেট)',
    titleEn: 'Honda CB Hornet 160R CBS (Smart Card & Tax Token Updated)',
    descriptionBn: '১ম মালিক, ঢাকা মেট্রো ল-সিরিজ। নিয়মিত সার্ভিসিং করা হয়েছে। ইঞ্জিন সাউন্ড একদম নতুনের মতো। এসে টেস্ট ড্রাইভ দিতে পারেন।',
    descriptionEn: '1st owner, Dhaka Metro registration. Regular serviced, showroom sound.',
    price: 135000,
    isNegotiable: true,
    category: 'vehicles',
    condition: 'used',
    location: {
      division: 'Dhaka',
      areaBn: 'মিরপুর-১০, ঢাকা',
      areaEn: 'Mirpur-10, Dhaka'
    },
    images: ['/src/assets/images/classifieds_motorcycle_1791109454846.jpg'],
    sellerId: 'user-011',
    sellerName: 'কামাল হোসেন',
    sellerPhone: '01711-665544',
    sellerVerified: false,
    sellerRating: 4.5,
    sellerMemberSince: '2024',
    createdAt: '২ দিন আগে',
    status: 'pending',
    validationStatus: 'Processed',
    featured: false,
    urgent: false,
    views: 145
  }
];

export const INITIAL_USER: User = {
  id: 'user-001',
  name: 'Md. Hossain',
  firstName: 'Md.',
  lastName: 'Hossain',
  email: 'akbar.office10@gmail.com',
  phone: '01332520826',
  avatar: '',
  address: 'বাসা-২৪, রোড-৭, ব্লক-ডি, মিরপুর-১০, ঢাকা-১২১৬',
  permanentAddress: 'গ্রাম: রামকৃষ্ণপুর, ডাকঘর: হরিপুর, থানা: বোয়ালমারী, জেলা: ফরিদপুর',
  dob: '1995-10-14',
  gender: 'Male',
  role: 'user',
  isPhoneVerified: true,
  isNidVerified: true,
  nidNumber: '19952671829000123',
  memberSince: '2023',
  district: 'Dhaka',
  walletBalance: 50, // ৳ ৫০ রেজিস্ট্রেশন ওয়েলকাম বোনাস
  rewardPoints: 120 // কেনাবেচা থেকে প্রাপ্ত রিওয়ার্ড পয়েন্ট
};

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    adTitle: 'iPhone 14 Pro Max 256GB',
    reviewerName: 'তানভীর আহমেদ (সেলার)',
    targetUserId: 'user-001',
    rating: 5,
    comment: 'চমৎকার ক্রেতা! দ্রুত পেমেন্ট কনফার্ম করেছেন এবং ব্যবহারে দারুণ ভদ্র।',
    createdAt: '০৩ অক্টোবর ২০২৬',
    role: 'seller'
  },
  {
    id: 'rev-2',
    adTitle: 'Apple MacBook Pro M2',
    reviewerName: 'আরিফুল ইসলাম',
    targetUserId: 'user-001',
    rating: 5,
    comment: 'সময়মতো লেনদেন সম্পন্ন হয়েছে। শুভকামনা রইল!',
    createdAt: '২৮ সেপ্টেম্বর ২০২৬',
    role: 'seller'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-8924',
    adId: 'ad-101',
    adTitle: 'iPhone 14 Pro Max 256GB Deep Purple',
    adImage: '/src/assets/images/classifieds_smartphone_1791109437128.jpg',
    buyerId: 'user-001',
    buyerName: 'আকবর হোসেন',
    buyerPhone: '01855-667788',
    buyerAddress: 'বাসা-২৪, রোড-৭, ব্লক-ডি, মিরপুর-২, ঢাকা',
    sellerId: 'user-002',
    sellerName: 'তানভীর আহমেদ',
    price: 98500,
    deliveryFee: 150,
    totalAmount: 98650,
    paymentMethod: 'bKash',
    paymentStatus: 'escrow_held',
    courierName: 'Steadfast Courier',
    trackingNumber: 'ST-90281-DH',
    status: 'in_transit',
    createdAt: '2026-10-03 14:30',
    updatedAt: '2026-10-04 09:15',
    timeline: [
      { titleBn: 'অর্ডার প্লেস করা হয়েছে এবং এসক্রো ফান্ড জমা হয়েছে', titleEn: 'Order placed & escrow funds held', date: '03 Oct, 2:30 PM', completed: true },
      { titleBn: 'বিক্রেতা পার্সেল প্যাকিং সম্পন্ন করেছেন', titleEn: 'Seller packed and ready for dispatch', date: '03 Oct, 5:45 PM', completed: true },
      { titleBn: 'স্টেডফাস্ট কুরিয়ার পার্সেল পিকআপ করেছে', titleEn: 'Steadfast Courier picked up parcel', date: '04 Oct, 09:15 AM', completed: true },
      { titleBn: 'পার্সেল মিরপুর ডেলিভারি হাবে ট্রানজিটে আছে', titleEn: 'In transit to Mirpur central hub', date: '04 Oct, 11:30 AM', completed: false },
      { titleBn: 'ডেলিভারি সম্পন্ন ও বিক্রেতার ফান্ড রিলিজ', titleEn: 'Delivered & escrow payment release', date: 'Pending', completed: false }
    ]
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-77401',
    orderId: 'ORD-8924',
    adTitle: 'iPhone 14 Pro Max 256GB Deep Purple',
    sender: 'আকবর হোসেন (01855-667788)',
    receiver: 'বিক্রয়মেলা এসক্রো অ্যাকাউন্ট',
    amount: 98650,
    gateway: 'bKash',
    trxId: 'BK9A2847LK1',
    status: 'Escrow Held',
    date: '2026-10-03 14:30'
  },
  {
    id: 'TXN-77395',
    orderId: 'ORD-8712',
    adTitle: 'Sony PlayStation 5 Disc Edition',
    sender: 'শাকিল আহমেদ',
    receiver: 'ফারহান চৌধুরী (সেলার)',
    amount: 62000,
    gateway: 'Nagad',
    trxId: 'NG771928300',
    status: 'Released',
    date: '2026-10-02 18:20'
  },
  {
    id: 'TXN-77380',
    orderId: 'ORD-8650',
    adTitle: 'Canon EOS 80D with 18-135mm Lens',
    sender: 'জাকিরুল ইসলাম',
    receiver: 'ক্রেতা রিফান্ড ওয়ালেট',
    amount: 54500,
    gateway: 'Visa/Mastercard',
    trxId: 'CARD-9920147',
    status: 'Refunded',
    date: '2026-10-01 11:10'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    titleBn: 'আপনার অর্ডারের নতুন আপডেট!',
    titleEn: 'New update on your order!',
    descriptionBn: 'iPhone 14 Pro Max এর পার্সেলটি স্টেডফাস্ট কুরিয়ারের ট্রানজিটে রয়েছে। ট্র্যাকিং: ST-90281-DH',
    descriptionEn: 'Your parcel for iPhone 14 Pro Max is in transit via Steadfast Courier. Tracking: ST-90281-DH',
    time: '১ ঘণ্টা আগে',
    read: false,
    type: 'order'
  },
  {
    id: 'notif-2',
    titleBn: 'নতুন চ্যাট মেসেজ এসেছে',
    titleEn: 'New message received',
    descriptionBn: 'তানভীর আহমেদ আপনার বার্তার উত্তর দিয়েছেন: "জি ভাই, মিরপুর ১০ নম্বর গোলচত্বরে দেখা করা যাবে।"',
    descriptionEn: 'Tanvir Ahmed replied: "Yes brother, we can meet at Mirpur 10 circle."',
    time: '৩ ঘণ্টা আগে',
    read: false,
    type: 'chat'
  },
  {
    id: 'notif-3',
    titleBn: 'এসক্রো পেমেন্ট সুরক্ষিত আছে',
    titleEn: 'Escrow payment is secured',
    descriptionBn: 'আপনার ৳ ৯৮,৬৫০ টাকা বিক্রয়মেলা এসক্রো অ্যাকাউন্টে নিরাপদে সংরক্ষিত আছে।',
    descriptionEn: 'Your payment of 98,650 BDT is safely held in BikroyMela Escrow vault.',
    time: 'গতকাল',
    read: true,
    type: 'payment'
  }
];
