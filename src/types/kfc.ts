export type MenuCategory = 
  | 'all'
  | 'buckets'
  | 'chicken'
  | 'burgers'
  | 'combos'
  | 'sides'
  | 'drinks'
  | 'deals';

export type RecipeType = 'original' | 'crispy' | 'spicy_nashville' | 'sweet_chili';

export interface MenuItem {
  id: string;
  name: string;
  category: 'buckets' | 'chicken' | 'burgers' | 'combos' | 'sides' | 'drinks';
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  calories?: number;
  pieces?: number;
  isSpicy?: boolean;
  spiceLevel?: 1 | 2 | 3; // 1 = mild, 2 = medium, 3 = fire
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
  discountAmount?: number;
  minOrder?: number;
  badge: string;
  bannerColor: string;
}

export type OrderType = 'delivery' | 'pickup' | 'dinein';

export interface OrderDetails {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  orderType: OrderType;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'cod' | 'vietqr' | 'card' | 'momo';
  status: 'received' | 'cooking' | 'delivering' | 'delivered';
  placedAt: string;
  estimatedDeliveryMins: number;
}
