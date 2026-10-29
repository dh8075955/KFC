import React, { useState } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Clock, 
  Search, 
  Tag, 
  ChevronDown, 
  UtensilsCrossed,
  Flame,
  X,
  Wallet,
  PackageCheck,
  Plus
} from 'lucide-react';
import { OrderType, DeliveryAddress } from '../types/kfc';

interface HeaderProps {
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenDeals: () => void;
  onOpenWallet: () => void;
  onOpenOrders: () => void;
  onOpenAddressManager: () => void;
  activeOrdersCount: number;
  walletBalance: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeAddress: DeliveryAddress;
}

export const Header: React.FC<HeaderProps> = ({
  orderType,
  setOrderType,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenDeals,
  onOpenWallet,
  onOpenOrders,
  onOpenAddressManager,
  activeOrdersCount,
  walletBalance,
  searchQuery,
  setSearchQuery,
  activeAddress,
}) => {
  const [isSearching, setIsSearching] = useState(false);

  return (
    <>
      {/* Iconic KFC 3-stripes bar */}
      <div className="w-full h-2.5 kfc-stripes-horizontal shadow-sm" />

      {/* Main navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 text-zinc-900 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-3">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <a href="#" className="flex items-center gap-2.5 group">
                <div className="bg-red-600 px-3.5 py-1.5 rounded-lg shadow-md shadow-red-600/30 font-display text-2xl tracking-wider text-white border-2 border-red-700 group-hover:scale-105 transition-transform flex items-center justify-center">
                  KFC
                </div>
                <div>
                  <div className="font-display tracking-wide text-xl text-zinc-950 group-hover:text-red-600 transition-colors leading-none">
                    VIỆT NAM
                  </div>
                  <div className="text-[10px] uppercase font-extrabold text-red-600 tracking-wider mt-0.5">
                    Vị ngon trên từng ngón tay®
                  </div>
                </div>
              </a>

              {/* Order Mode Toggle: Delivery vs Pickup */}
              <div className="hidden lg:flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200 ml-2">
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    orderType === 'delivery'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <span>🛵</span> Giao Hàng
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('pickup')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    orderType === 'pickup'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <span>🚗</span> Đặt Đến Lấy
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('dinein')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    orderType === 'dinein'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <UtensilsCrossed className="w-3.5 h-3.5" /> Tại Bàn
                </button>
              </div>
            </div>

            {/* Delivery address button: Chỉnh nơi giao hàng */}
            <button
              onClick={onOpenAddressManager}
              className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-stone-50 hover:bg-red-50 hover:border-red-300 border border-zinc-200 text-left text-xs max-w-xs group transition-colors shadow-2xs"
              title="Chỉnh nơi giao hàng"
            >
              <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-[10px] text-zinc-500 font-semibold flex items-center gap-1">
                  <span>Giao tới: <strong className="text-zinc-800">{activeAddress.title}</strong></span>
                  <Clock className="w-3 h-3 text-emerald-600 ml-1" />
                  <span className="text-emerald-700 font-bold">25-30p</span>
                </div>
                <div className="font-bold text-zinc-800 truncate group-hover:text-red-600">
                  {activeAddress.street}, {activeAddress.district}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-1" />
            </button>

            {/* Actions: Nạp Tiền Ví, Xem Đơn Hàng, Voucher, Giỏ Hàng */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              
              {/* Nạp tiền / Ví KFC */}
              <button
                onClick={onOpenWallet}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-extrabold text-amber-900 transition-colors shadow-2xs"
                title="Ví KFC Pay & Nạp tiền"
              >
                <Wallet className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline font-mono font-bold">
                  {walletBalance.toLocaleString('vi-VN')} ₫
                </span>
                <span className="text-[10px] bg-amber-500 text-zinc-950 px-1.5 py-0.5 rounded-full font-bold ml-0.5">
                  Nạp tiền
                </span>
              </button>

              {/* Xem Đơn Hàng */}
              <button
                onClick={onOpenOrders}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-xs font-extrabold text-zinc-800 transition-colors"
                title="Xem đơn hàng & Theo dõi giao hàng"
              >
                <PackageCheck className="w-4 h-4 text-red-600" />
                <span className="hidden xl:inline">Xem Đơn</span>
                {activeOrdersCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping absolute top-1.5 right-1.5" />
                )}
              </button>

              {/* Voucher & Mã Giảm Giá */}
              <button
                onClick={onOpenDeals}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-extrabold transition-colors"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Voucher</span>
                <Flame className="w-3.5 h-3.5 text-red-600 animate-bounce" />
              </button>

              {/* Tìm kiếm */}
              <div className="relative">
                {isSearching ? (
                  <div className="flex items-center bg-zinc-100 rounded-xl border border-zinc-300 px-3 py-1.5 w-44 sm:w-56 focus-within:border-red-500 focus-within:bg-white shadow-inner">
                    <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Tìm gà rán, burger, combo..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="bg-transparent border-none text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none px-2 w-full"
                    />
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setIsSearching(false);
                      }}
                      className="text-zinc-400 hover:text-zinc-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSearching(true)}
                    className="p-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 border border-zinc-200 transition-colors"
                    title="Tìm món"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Nút Giỏ Hàng */}
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-lg shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all border border-red-700"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Giỏ Hàng</span>
                <span className="font-extrabold font-mono bg-white text-red-600 text-xs px-2 py-0.5 rounded-full shadow-2xs">
                  {cartCount}
                </span>
                {cartTotal > 0 && (
                  <span className="hidden md:inline text-xs text-red-100 font-mono border-l border-red-500/60 pl-2">
                    {cartTotal.toLocaleString('vi-VN')} ₫
                  </span>
                )}
              </button>

            </div>

          </div>
        </div>

        {/* Mobile order mode & address bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-2.5 bg-zinc-50 border-t border-zinc-200 text-xs">
          <div className="flex gap-1">
            <button
              onClick={() => setOrderType('delivery')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                orderType === 'delivery' ? 'bg-red-600 text-white shadow-2xs' : 'text-zinc-600 bg-white border border-zinc-200'
              }`}
            >
              Giao Hàng (30p)
            </button>
            <button
              onClick={() => setOrderType('pickup')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                orderType === 'pickup' ? 'bg-red-600 text-white shadow-2xs' : 'text-zinc-600 bg-white border border-zinc-200'
              }`}
            >
              Đến Lấy
            </button>
          </div>
          <button
            onClick={onOpenAddressManager}
            className="flex items-center gap-1 text-[11px] text-zinc-700 font-semibold truncate max-w-[200px]"
          >
            <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span className="truncate">{activeAddress.street}, {activeAddress.city}</span>
          </button>
        </div>
      </header>
    </>
  );
};
