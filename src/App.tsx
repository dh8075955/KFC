/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { DealsBar } from './components/DealsBar';
import { CategoryNav } from './components/CategoryNav';
import { MenuGrid } from './components/MenuGrid';
import { BucketBuilderModal } from './components/BucketBuilderModal';
import { ItemCustomizeModal } from './components/ItemCustomizeModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { HeritageSection } from './components/HeritageSection';
import { Footer } from './components/Footer';
import { KFC_MENU_ITEMS, FEATURED_DEALS } from './data/kfcMenu';
import { MenuItem, CartItem, MenuCategory, OrderType, DealPromo, OrderDetails } from './types/kfc';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

export default function App() {
  // Fulfillment & Address
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('452 Lexington Ave, Manhattan, NY');

  // Menu filtering
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlySpicy, setOnlySpicy] = useState(false);
  const [onlyBestSellers, setOnlyBestSellers] = useState(false);

  // Cart State (Initialized with 1 starter item so the cart isn't empty)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      cartId: 'init-1',
      item: KFC_MENU_ITEMS[0], // 8-Piece Original Recipe Bucket
      quantity: 1,
      recipe: 'original',
      selectedSauces: ["Colonel's Secret Sauce", 'Smoky Kentucky BBQ'],
      totalPrice: KFC_MENU_ITEMS[0].price,
    },
  ]);
  const [appliedPromo, setAppliedPromo] = useState<DealPromo | null>(null);

  // Modals state
  const [isBucketBuilderOpen, setIsBucketBuilderOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<OrderDetails | null>(null);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Filtered Menu Items
  const filteredItems = useMemo(() => {
    return KFC_MENU_ITEMS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }
      // Spicy filter
      if (onlySpicy && !item.isSpicy) {
        return false;
      }
      // Best sellers
      if (onlyBestSellers && !item.isBestSeller) {
        return false;
      }
      return true;
    });
  }, [selectedCategory, searchQuery, onlySpicy, onlyBestSellers]);

  // Cart Calculations
  const cartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, curr) => acc + curr.totalPrice, 0);

  // Cart Handlers
  const handleAddToCart = (newItem: CartItem) => {
    setCartItems((prev) => {
      // check if identical item already exists
      const existingIdx = prev.findIndex(
        (i) =>
          i.item.id === newItem.item.id &&
          i.recipe === newItem.recipe &&
          JSON.stringify(i.selectedSauces) === JSON.stringify(newItem.selectedSauces) &&
          i.selectedSide === newItem.selectedSide &&
          i.selectedDrink === newItem.selectedDrink
      );

      if (existingIdx >= 0) {
        const updated = [...prev];
        const exist = updated[existingIdx];
        const newQty = exist.quantity + newItem.quantity;
        updated[existingIdx] = {
          ...exist,
          quantity: newQty,
          totalPrice: (exist.totalPrice / exist.quantity) * newQty,
        };
        return updated;
      }

      return [...prev, newItem];
    });

    showToast(`Added "${newItem.item.name}" to your bucket bag! 🍗`);
  };

  const handleQuickAdd = (item: MenuItem) => {
    const quickCartItem: CartItem = {
      cartId: `${item.id}-${Date.now()}`,
      item,
      quantity: 1,
      recipe: item.allowedRecipes?.[0] || 'original',
      selectedSauces: ["Colonel's Secret Sauce"],
      totalPrice: item.price,
    };
    handleAddToCart(quickCartItem);
  };

  const handleUpdateQuantity = (cartId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.cartId === cartId) {
          const unitPrice = item.totalPrice / item.quantity;
          return {
            ...item,
            quantity: newQty,
            totalPrice: unitPrice * newQty,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (cartId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Promo Handlers
  const handleApplyDeal = (deal: DealPromo) => {
    setAppliedPromo(deal);
    showToast(`Coupon "${deal.code}" applied! Save on your feast.`);
  };

  const handleApplyCouponCode = (code: string): boolean => {
    const found = FEATURED_DEALS.find(
      (d) => d.code.toUpperCase() === code.trim().toUpperCase()
    );
    if (found) {
      setAppliedPromo(found);
      showToast(`Coupon "${found.code}" applied successfully!`);
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setAppliedPromo(null);
  };

  const handleOrderSuccess = (order: OrderDetails) => {
    setCurrentOrder(order);
    setCartItems([]); // clear cart
    setAppliedPromo(null);
    setIsOrderTrackerOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-zinc-900 flex flex-col selection:bg-red-600 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border-2 border-red-600 text-zinc-900 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-xs sm:text-sm font-extrabold">{toastMessage}</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-xs bg-red-600 hover:bg-red-700 text-white font-extrabold px-3 py-1.5 rounded-xl ml-2 shrink-0 transition-colors shadow-sm"
          >
            View Bag
          </button>
        </div>
      )}

      {/* Main Header */}
      <Header
        orderType={orderType}
        setOrderType={setOrderType}
        cartCount={cartCount}
        cartTotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenDeals={() => {
          const dealsElem = document.getElementById('deals-section');
          dealsElem?.scrollIntoView({ behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        deliveryAddress={deliveryAddress}
        setDeliveryAddress={setDeliveryAddress}
      />

      {/* Hero Banner */}
      <HeroBanner
        onBuildBucket={() => setIsBucketBuilderOpen(true)}
        onBrowseMenu={() => {
          const menuElem = document.getElementById('menu-section');
          menuElem?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Deals & Coupons Bar */}
      <DealsBar
        onApplyDeal={handleApplyDeal}
        activePromoCode={appliedPromo?.code || null}
      />

      {/* Sticky Menu Category Nav */}
      <div id="menu-section">
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onlySpicy={onlySpicy}
          setOnlySpicy={setOnlySpicy}
          onlyBestSellers={onlyBestSellers}
          setOnlyBestSellers={setOnlyBestSellers}
          totalCount={filteredItems.length}
        />
      </div>

      {/* Menu Grid Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Active section title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-zinc-200 gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-wide text-zinc-950 flex items-center gap-2">
              <span>
                {selectedCategory === 'all'
                  ? 'FULL KFC MENU'
                  : selectedCategory === 'buckets'
                  ? 'CRISPY BUCKETS & FEASTS'
                  : selectedCategory === 'chicken'
                  ? 'FRIED CHICKEN & TENDERS'
                  : selectedCategory === 'burgers'
                  ? 'ZINGER BURGERS & WRAPS'
                  : selectedCategory === 'combos'
                  ? 'BOX COMBOS & MEALS'
                  : selectedCategory === 'sides'
                  ? 'GRAVY, SIDES & BISCUITS'
                  : 'DRINKS & SWEET DESSERTS'}
              </span>
              <span className="text-red-600 font-sans font-extrabold text-sm">
                ({filteredItems.length})
              </span>
            </h2>
            <p className="text-xs text-zinc-600 mt-1 font-medium">
              Cooked fresh to order. Hand-breaded and served piping hot.
            </p>
          </div>

          {/* Quick custom bucket CTA button */}
          <button
            onClick={() => setIsBucketBuilderOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-300 text-xs font-extrabold text-red-700 hover:text-red-800 transition-all flex items-center gap-2 shadow-2xs"
          >
            <span>🪣 Customize 6, 10 or 14-Pc Bucket</span>
          </button>
        </div>

        {/* Product Cards Grid */}
        <MenuGrid
          items={filteredItems}
          onSelectItem={(item) => setCustomizingItem(item)}
          onQuickAdd={handleQuickAdd}
          onResetFilters={() => {
            setSelectedCategory('all');
            setSearchQuery('');
            setOnlySpicy(false);
            setOnlyBestSellers(false);
          }}
        />

      </main>

      {/* Heritage & 11 Secret Spices Story */}
      <HeritageSection />

      {/* Footer */}
      <Footer />

      {/* MODALS */}
      {/* 1. Custom Bucket Builder Modal */}
      <BucketBuilderModal
        isOpen={isBucketBuilderOpen}
        onClose={() => setIsBucketBuilderOpen(false)}
        onAddCustomBucket={(bucket) => {
          handleAddToCart(bucket);
          setIsCartOpen(true);
        }}
      />

      {/* 2. Item Customize Modal */}
      <ItemCustomizeModal
        item={customizingItem}
        isOpen={Boolean(customizingItem)}
        onClose={() => setCustomizingItem(null)}
        onAddToCart={(cartItem) => {
          handleAddToCart(cartItem);
        }}
      />

      {/* 3. Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        orderType={orderType}
        appliedPromo={appliedPromo}
        onApplyCouponCode={handleApplyCouponCode}
        onRemoveCoupon={handleRemoveCoupon}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 4. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        orderType={orderType}
        deliveryAddress={deliveryAddress}
        appliedPromo={appliedPromo}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 5. Live Order Tracker Modal */}
      <OrderTrackerModal
        order={currentOrder}
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        onNewOrder={() => {
          setIsOrderTrackerOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Floating Quick Bag Trigger on Mobile */}
      {cartCount > 0 && !isCartOpen && (
        <div className="sm:hidden fixed bottom-5 left-4 right-4 z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white p-4 rounded-2xl shadow-2xl shadow-red-600/40 flex items-center justify-between font-extrabold text-sm border border-red-700"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>View Bucket Bag ({cartCount})</span>
            </div>
            <span className="font-mono text-base font-extrabold">${cartSubtotal.toFixed(2)}</span>
          </button>
        </div>
      )}

    </div>
  );
}
