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
import { WalletModal } from './components/WalletModal';
import { AddressManagerModal } from './components/AddressManagerModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { VoucherModal } from './components/VoucherModal';
import { HeritageSection } from './components/HeritageSection';
import { Footer } from './components/Footer';
import { KFC_MENU_ITEMS, FEATURED_DEALS, INITIAL_SAVED_ADDRESSES } from './data/kfcMenu';
import { MenuItem, CartItem, MenuCategory, OrderType, DealPromo, OrderDetails, DeliveryAddress, WalletTransaction } from './types/kfc';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

export default function App() {
  // Fulfillment & Address State
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>(INITIAL_SAVED_ADDRESSES);
  const [activeAddressId, setActiveAddressId] = useState<string>(INITIAL_SAVED_ADDRESSES[0].id);

  const activeAddress = useMemo(() => {
    return savedAddresses.find((a) => a.id === activeAddressId) || savedAddresses[0];
  }, [savedAddresses, activeAddressId]);

  // Wallet State (Khởi tạo sẵn 250.000 ₫ để khách hàng dùng thử nạp/trừ tiền ngay)
  const [walletBalance, setWalletBalance] = useState<number>(250000);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([
    {
      id: 'tx-init-1',
      amount: 250000,
      type: 'topup',
      description: 'Nạp tiền vào Ví KFC Pay thành công',
      createdAt: '28/10/2026 20:30',
      method: 'VIETQR',
    },
  ]);

  // Order History State (Khởi tạo sẵn 2 đơn hàng đang giao đồng thời để khách kiểm tra và nhận nhiều đơn)
  const [orderHistory, setOrderHistory] = useState<OrderDetails[]>([
    {
      orderId: 'KFC-839210',
      orderTitle: 'Combo Gà Giòn 1 Người (x2)',
      customerName: 'Nguyễn Văn Minh',
      phone: '0988 123 456',
      address: 'Số 128 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      notes: 'Giao lên tầng 3 phòng 302, gọi điện trước khi đến',
      orderType: 'delivery',
      items: [
        {
          cartId: 'item-demo-1',
          item: KFC_MENU_ITEMS[0], // Combo Gà Giòn 1 Người
          quantity: 2,
          recipe: 'crispy_spicy',
          selectedSauces: ['Sốt Bí Truyền Colonel'],
          totalPrice: 178000,
        },
      ],
      subtotal: 178000,
      discount: 25000,
      deliveryFee: 0,
      total: 153000,
      paymentMethod: 'vietqr',
      isPaid: false,
      status: 'delivering',
      placedAt: '20:45',
      estimatedDeliveryMins: 20,
      estimatedDeliveryTime: '21:15',
      courier: {
        name: 'Nguyễn Văn Cường',
        phone: '0912 888 999',
        vehicle: 'Honda Wave • Thùng đỏ KFC',
      },
    },
    {
      orderId: 'KFC-591240',
      orderTitle: 'Xô Gà Tiệc Tùng 5 Miếng + Khoai Tây',
      customerName: 'Trần Hoàng Lan',
      phone: '0903 456 789',
      address: 'Tầng 12, Tòa nhà Bitexco, 02 Hải Triều, Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      notes: 'Để ở quầy lễ tân tầng 1 nếu không gọi được',
      orderType: 'delivery',
      items: [
        {
          cartId: 'item-demo-2',
          item: KFC_MENU_ITEMS[3], // Xô Gà Tiệc Tùng 5 Miếng
          quantity: 1,
          recipe: 'crispy_spicy',
          selectedSauces: ['Sốt Bí Truyền Colonel', 'Tương Cà KFC'],
          totalPrice: 245000,
        },
      ],
      subtotal: 245000,
      discount: 0,
      deliveryFee: 0,
      total: 245000,
      paymentMethod: 'wallet',
      isPaid: true,
      status: 'cooking',
      placedAt: '20:55',
      estimatedDeliveryMins: 25,
      estimatedDeliveryTime: '21:25',
      courier: {
        name: 'Lê Quốc Tuấn',
        phone: '0938 777 666',
        vehicle: 'Yamaha Sirius • Thùng đỏ KFC',
      },
    },
  ]);

  // Menu filtering
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlySpicy, setOnlySpicy] = useState(false);
  const [onlyBestSellers, setOnlyBestSellers] = useState(false);

  // Cart State (Initialized with 1 starter item: Combo Gà Giòn)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      cartId: 'init-1',
      item: KFC_MENU_ITEMS[0], // Combo Gà Giòn 1 Người
      quantity: 1,
      recipe: 'crispy_spicy',
      selectedSauces: ['Sốt Bí Truyền Colonel', 'Tương Ớt Cay KFC'],
      totalPrice: KFC_MENU_ITEMS[0].price,
    },
  ]);
  const [appliedPromo, setAppliedPromo] = useState<DealPromo | null>(null);

  // Modals state
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isOrderHistoryModalOpen, setIsOrderHistoryModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [isBucketBuilderOpen, setIsBucketBuilderOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<OrderDetails | null>(orderHistory[0]);
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
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }
      if (onlySpicy && !item.isSpicy) {
        return false;
      }
      if (onlyBestSellers && !item.isBestSeller) {
        return false;
      }
      return true;
    });
  }, [selectedCategory, searchQuery, onlySpicy, onlyBestSellers]);

  // Cart Calculations
  const cartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, curr) => acc + curr.totalPrice, 0);

  // Wallet Top-up Handler
  const handleTopUp = (amount: number, method: string) => {
    setWalletBalance((prev) => prev + amount);
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      amount,
      type: 'topup',
      description: `Nạp tiền vào Ví KFC Pay (${method})`,
      createdAt: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
      method,
    };
    setWalletTransactions((prev) => [newTx, ...prev]);
    showToast(`Nạp thành công +${amount.toLocaleString('vi-VN')} ₫ vào Ví KFC Pay! 💳`);
  };

  // Address Handlers
  const handleAddAddress = (newAddr: DeliveryAddress) => {
    setSavedAddresses((prev) => [newAddr, ...prev]);
    setActiveAddressId(newAddr.id);
    showToast(`Đã thêm địa chỉ giao hàng: ${newAddr.title}! 📍`);
  };

  const handleDeleteAddress = (id: string) => {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
    if (activeAddressId === id && savedAddresses.length > 1) {
      const remaining = savedAddresses.filter((a) => a.id !== id);
      setActiveAddressId(remaining[0].id);
    }
    showToast('Đã xóa địa chỉ thành công.');
  };

  const handleSelectAddress = (addr: DeliveryAddress) => {
    setActiveAddressId(addr.id);
    showToast(`Đã chọn nơi giao hàng: ${addr.title} (${addr.street})`);
  };

  // Cart Handlers
  const handleAddToCart = (newItem: CartItem) => {
    setCartItems((prev) => {
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

    showToast(`Đã thêm "${newItem.item.name}" vào giỏ hàng! 🍗`);
  };

  const handleQuickAdd = (item: MenuItem) => {
    const quickCartItem: CartItem = {
      cartId: `${item.id}-${Date.now()}`,
      item,
      quantity: 1,
      recipe: item.allowedRecipes?.[0] || 'crispy_spicy',
      selectedSauces: ['Sốt Bí Truyền Colonel'],
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
    showToast(`Đã áp dụng mã "${deal.code}"! Tiết kiệm cho đơn hàng.`);
  };

  const handleApplyCouponCode = (code: string): boolean => {
    const found = FEATURED_DEALS.find(
      (d) => d.code.toUpperCase() === code.trim().toUpperCase()
    );
    if (found) {
      setAppliedPromo(found);
      showToast(`Áp dụng mã giảm giá "${found.code}" thành công!`);
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setAppliedPromo(null);
  };

  // Order Handlers
  const handleOrderSuccess = (order: OrderDetails, usedWallet: boolean) => {
    if (usedWallet) {
      setWalletBalance((prev) => Math.max(0, prev - order.total));
      const payTx: WalletTransaction = {
        id: `tx-pay-${Date.now()}`,
        amount: order.total,
        type: 'payment',
        description: `Thanh toán đơn hàng KFC #${order.orderId}`,
        createdAt: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
        method: 'VÍ KFC PAY',
      };
      setWalletTransactions((prev) => [payTx, ...prev]);
    }

    setOrderHistory((prev) => [order, ...prev]);
    setCartItems([]);
    setAppliedPromo(null);
    setActiveTrackingOrder(order);
    setIsOrderTrackerOpen(true);
  };

  const handleConfirmPayment = (orderId: string) => {
    setOrderHistory((prev) =>
      prev.map((ord) => {
        if (ord.orderId === orderId) {
          return { ...ord, isPaid: true };
        }
        return ord;
      })
    );
    showToast(`Đã ghi nhận chuyển khoản cho đơn #${orderId}! Nhà bếp đang chuẩn bị gà. 🍗`);
  };

  const handleMarkOrderReceived = (orderId: string) => {
    setOrderHistory((prev) =>
      prev.map((ord) => {
        if (ord.orderId === orderId) {
          return { ...ord, status: 'delivered' };
        }
        return ord;
      })
    );
    showToast(`Đã nhận đơn hàng #${orderId} thành công! Chúc bạn ngon miệng với gà rán KFC! 🍗`);
  };

  const handleMarkAllReceived = () => {
    const deliveringCount = orderHistory.filter((o) => o.status !== 'delivered').length;
    setOrderHistory((prev) =>
      prev.map((ord) => (ord.status !== 'delivered' ? { ...ord, status: 'delivered' } : ord))
    );
    showToast(`Đã nhận tất cả ${deliveringCount} đơn hàng thành công! Cảm ơn bạn đã ủng hộ KFC! 🍗🎉`);
  };

  const handleTrackSpecificOrder = (order: OrderDetails) => {
    setActiveTrackingOrder(order);
    setIsOrderTrackerOpen(true);
  };

  const handleReorder = (items: CartItem[]) => {
    setCartItems(items);
    setIsOrderHistoryModalOpen(false);
    setIsCartOpen(true);
    showToast('Đã thêm các món vào giỏ hàng!');
  };

  const activeOrdersCount = orderHistory.filter((o) => o.status !== 'delivered').length;

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
            Xem Giỏ Hàng
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
        onOpenDeals={() => setIsVoucherModalOpen(true)}
        onOpenWallet={() => setIsWalletModalOpen(true)}
        onOpenOrders={() => setIsOrderHistoryModalOpen(true)}
        onOpenAddressManager={() => setIsAddressModalOpen(true)}
        activeOrdersCount={activeOrdersCount}
        walletBalance={walletBalance}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeAddress={activeAddress}
      />

      {/* Hero Banner */}
      <HeroBanner
        onBuildBucket={() => setIsBucketBuilderOpen(true)}
        onBrowseMenu={() => {
          const menuElem = document.getElementById('menu-section');
          menuElem?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenVouchers={() => setIsVoucherModalOpen(true)}
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
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 flex items-center gap-2">
              <span>
                {selectedCategory === 'all'
                  ? 'Thực đơn Gà Rán KFC Việt Nam'
                  : selectedCategory === 'combos'
                  ? 'Combo Gà Rán Tiết Kiệm'
                  : selectedCategory === 'buckets'
                  ? 'Xô Gà Tiệc Tùng Hoành Tráng'
                  : selectedCategory === 'chicken'
                  ? 'Gà Rán Giòn Cay & Cánh Gà'
                  : selectedCategory === 'burgers'
                  ? 'Burger Zinger & Burger Tôm'
                  : selectedCategory === 'rice'
                  ? 'Cơm Gà KFC Chuẩn Vị Việt'
                  : selectedCategory === 'sides'
                  ? 'Khoai Tây & Bánh Trứng Nướng'
                  : 'Thức Uống & Tráng Miệng'}
              </span>
              <span className="text-red-600 font-sans font-bold text-sm">
                ({filteredItems.length} món)
              </span>
            </h2>
            <p className="text-xs text-zinc-600 mt-1 font-medium">
              Chế biến tươi nóng mỗi ngày. Giao hàng nóng giòn trong 30 phút.
            </p>
          </div>

          {/* Quick action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVoucherModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-extrabold text-amber-900 transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <span>🎟️ Kho Voucher KFC</span>
            </button>

            <button
              onClick={() => setIsBucketBuilderOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-300 text-xs font-extrabold text-red-700 hover:text-red-800 transition-all flex items-center gap-2 shadow-2xs"
            >
              <span>🪣 Tự Phối Xô Gà 5, 8 hoặc 12 Miếng</span>
            </button>
          </div>
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
        onOpenVouchers={() => setIsVoucherModalOpen(true)}
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
        activeAddress={activeAddress}
        onOpenAddressManager={() => {
          setIsAddressModalOpen(true);
        }}
        walletBalance={walletBalance}
        onOpenWallet={() => setIsWalletModalOpen(true)}
        appliedPromo={appliedPromo}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 5. Live Order Tracker Modal */}
      <OrderTrackerModal
        order={activeTrackingOrder}
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        onNewOrder={() => {
          setIsOrderTrackerOpen(false);
          const menuElem = document.getElementById('menu-section');
          menuElem?.scrollIntoView({ behavior: 'smooth' });
        }}
        activeOrders={orderHistory}
        onSelectOrder={setActiveTrackingOrder}
        onMarkDelivered={handleMarkOrderReceived}
      />

      {/* 6. Wallet Modal (Nạp tiền & Ví KFC Pay) */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        balance={walletBalance}
        onTopUp={handleTopUp}
        transactions={walletTransactions}
      />

      {/* 7. Address Manager Modal (Sổ địa chỉ & Chỉnh nơi giao hàng) */}
      <AddressManagerModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        addresses={savedAddresses}
        activeAddressId={activeAddressId}
        onSelectAddress={handleSelectAddress}
        onAddAddress={handleAddAddress}
        onDeleteAddress={handleDeleteAddress}
      />

      {/* 8. Order History Modal (Xem đơn hàng & Lịch sử) */}
      <OrderHistoryModal
        isOpen={isOrderHistoryModalOpen}
        onClose={() => setIsOrderHistoryModalOpen(false)}
        orders={orderHistory}
        onTrackOrder={handleTrackSpecificOrder}
        onReorder={handleReorder}
        onConfirmPayment={handleConfirmPayment}
        onAddNewOrderPrompt={() => {
          const menuElem = document.getElementById('menu-section');
          menuElem?.scrollIntoView({ behavior: 'smooth' });
        }}
        onMarkOrderReceived={handleMarkOrderReceived}
        onMarkAllReceived={handleMarkAllReceived}
      />

      {/* 9. Voucher & Mã giảm giá Modal */}
      <VoucherModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        onApplyVoucher={handleApplyDeal}
        activePromoCode={appliedPromo?.code || null}
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
              <span>Xem Giỏ Hàng ({cartCount})</span>
            </div>
            <span className="font-mono text-base font-extrabold">{cartSubtotal.toLocaleString('vi-VN')} ₫</span>
          </button>
        </div>
      )}

    </div>
  );
}
