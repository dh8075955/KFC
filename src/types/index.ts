export type IndustryType = 
  | 'ecommerce' 
  | 'corporate' 
  | 'realestate' 
  | 'restaurant' 
  | 'spa' 
  | 'portfolio' 
  | 'education';

export interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  primaryHex: string;
  secondary: string;
  accent: string;
  badge: string;
}

export interface WebsiteConfig {
  industry: IndustryType;
  brandName: string;
  tagline: string;
  description: string;
  colorThemeId: string;
  fontStyle: 'modern' | 'serif' | 'clean';
  heroHeadline: string;
  heroSubheadline: string;
  ctaText: string;
  ctaLink: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  heroImage: string;
  features: {
    title: string;
    desc: string;
    icon: string;
  }[];
  services: {
    name: string;
    desc: string;
    price: string;
    image: string;
  }[];
  testimonials: {
    name: string;
    role: string;
    comment: string;
    avatar: string;
    rating: number;
  }[];
  showZaloChat: boolean;
  showReviews: boolean;
  showPricing: boolean;
  showNewsletter: boolean;
}

export interface WebTemplate {
  id: string;
  title: string;
  category: IndustryType;
  categoryLabel: string;
  description: string;
  image: string;
  speedScore: number;
  seoScore: number;
  rating: number;
  views: number;
  tags: string[];
  features: string[];
  sampleConfig: Partial<WebsiteConfig>;
}

export interface CalculatorState {
  webType: 'landing' | 'business' | 'ecommerce' | 'custom';
  domainType: 'com' | 'vn' | 'com_vn' | 'existing';
  hostingPlan: 'basic' | 'pro' | 'enterprise' | 'existing';
  maintenanceMonths: number;
  features: {
    paymentGateway: boolean; // VNPay, MoMo, VietQR
    zaloChatIntegration: boolean;
    multiLanguage: boolean;
    advancedSeo: boolean;
    inventorySync: boolean;
    logoDesign: boolean;
    contentWriting: boolean;
    speedOptimization: boolean;
  };
  discountCode: string;
}

export interface LeadSubmission {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  projectType: string;
  estimatedBudget: string;
  timeline: string;
  notes: string;
  createdAt: string;
  configSnapshot?: Partial<WebsiteConfig>;
}
