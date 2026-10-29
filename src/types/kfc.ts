export type MenuCategory = 
  | 'all'
  | 'combos'
  | 'buckets'
  | 'chicken'
  | 'burgers'
  | 'rice'
  | 'sides'
  | 'drinks';

export type RecipeType = 'crispy_spicy' | 'original' | 'cheese' | 'sweet_chili';

export interface MenuItem {
  id: string;
  name: string;
  category: 'combos' | 'buckets' | 'chicken' | 'burgers' | 'rice' | 'sides' | 'drinks';
  description: string;
  price: number; // in VNĐ
  originalPrice?: number;
  image: string;
  calories?: number;
  pieces?: number;
  isSpicy?: boolean;
  spiceLevel?: 1 | 2 | 3;
  isBestSeller?: boolean;
  isNew?: boolean;
  isDeal?: boolean;
  allowedRecipes?: RecipeType[];
  includedSides?: string[];
  includedDrinks?: string[];
}

export interface CartItem {
  cartId: string;
  item: MenuItem;
  quantity: number;
  recipe?: RecipeType;
  selectedPieces?: {
    drumsticks: number;
    thighs: number;
    breasts: number;
    wings: number;
  };
  selectedSauces: string[];
  selectedSide?: string;
  selectedDrink?: string;
  notes?: string;
  totalPrice: number;
}

export interface DealPromo {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  discountPercent?: number;
  discountAmount?: number; // in VNĐ
  minOrder?: number; // in VNĐ
  badge: string;
  bannerColor: string;
}

export type OrderType = 'delivery' | 'pickup' | 'dinein';

export interface DeliveryAddress {
  id: string;
  title: string; // Nhà riêng, Công ty, v.v.
  recipientName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  notes?: string;
  isDefault: boolean;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'topup' | 'payment';
  description: string;
  createdAt: string;
  method: string;
}

export interface OrderDetails {
  orderId: string;
  orderTitle?: string;
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  orderType: OrderType;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'cod' | 'vietqr' | 'momo' | 'wallet' | 'card';
  isPaid?: boolean;
  qrExpiresAt?: number;
  status: 'received' | 'cooking' | 'delivering' | 'delivered';
  placedAt: string;
  estimatedDeliveryMins: number;
  estimatedDeliveryTime?: string;
  courier?: {
    name: string;
    phone: string;
    vehicle: string;
  };
}
