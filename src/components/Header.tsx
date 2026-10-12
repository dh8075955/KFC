import React, { useState } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Clock, 
  Search, 
  Percent, 
  ChevronDown, 
  UtensilsCrossed,
  Flame,
  X
} from 'lucide-react';
import { OrderType } from '../types/kfc';

interface HeaderProps {
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenDeals: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  deliveryAddress: string;
  setDeliveryAddress: (addr: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  orderType,
  setOrderType,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenDeals,
  searchQuery,
  setSearchQuery,
  deliveryAddress,
  setDeliveryAddress,
}) => {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [tempAddress, setTempAddress] = useState(deliveryAddress);
  const [isSearching, setIsSearching] = useState(false);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempAddress.trim()) {
      setDeliveryAddress(tempAddress.trim());
      setShowAddressModal(false);
    }
  };

  return (
    <>
      {/* Iconic KFC 3-stripes bar */}
      <div className="w-full h-2.5 kfc-stripes-horizontal shadow-sm" />

      {/* Main navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 text-zinc-900 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <a href="#" className="flex items-center gap-2.5 group">
                {/* Authentic KFC Red block logo */}
                <div className="bg-red-600 px-3.5 py-1.5 rounded-lg shadow-md shadow-red-600/30 font-display text-2xl tracking-wider text-white border-2 border-red-700 group-hover:scale-105 transition-transform flex items-center justify-center">
                  KFC
                </div>
                <div>
                  <div className="font-display tracking-wide text-xl text-zinc-950 group-hover:text-red-600 transition-colors leading-none">
                    FRIED CHICKEN
                  </div>
                  <div className="text-[10px] uppercase font-extrabold text-red-600 tracking-wider mt-0.5">
                    It&apos;s Finger Lickin&apos; Good®
                  </div>
                </div>
              </a>

              {/* Order Mode Toggle: Delivery vs Pickup */}
              <div className="hidden md:flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200 ml-4">
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    orderType === 'delivery'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <span>🛵</span> Delivery
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
                  <span>🚗</span> Pick-up
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
                  <UtensilsCrossed className="w-3.5 h-3.5" /> Dine-in
                </button>
              </div>
            </div>

            {/* Delivery address button */}
            <button
              onClick={() => setShowAddressModal(true)}
              className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-zinc-200 text-left text-xs max-w-xs group transition-colors shadow-2xs"
            >
              <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-[10px] text-zinc-500 font-semibold flex items-center gap-1">
                  <span>{orderType === 'delivery' ? 'Deliver to' : 'Pickup at store'}</span>
                  <Clock className="w-3 h-3 text-emerald-600 ml-1" />
                  <span className="text-emerald-700 font-bold">25-35m</span>
                </div>
                <div className="font-bold text-zinc-800 truncate group-hover:text-red-600">
                  {deliveryAddress}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-1" />
            </button>

            {/* Search, Deals & Cart */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Search bar */}
              <div className="relative">
                {isSearching ? (
                  <div className="flex items-center bg-zinc-100 rounded-xl border border-zinc-300 px-3 py-1.5 w-48 sm:w-64 focus-within:border-red-500 focus-within:bg-white shadow-inner">
                    <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search chicken, buckets..."
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
                    title="Search Menu"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Deals button */}
              <button
                onClick={onOpenDeals}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-extrabold transition-colors"
              >
                <Percent className="w-3.5 h-3.5" />
                <span>Deals</span>
                <Flame className="w-3.5 h-3.5 text-red-600 animate-bounce" />
              </button>

              {/* Shopping Bag Button */}
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-lg shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all border border-red-700"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Bucket Bag</span>
                <span className="font-extrabold font-mono bg-white text-red-600 text-xs px-2 py-0.5 rounded-full shadow-2xs">
                  {cartCount}
                </span>
                {cartTotal > 0 && (
                  <span className="hidden md:inline text-xs text-red-100 font-mono border-l border-red-500/60 pl-2">
                    ${cartTotal.toFixed(2)}
                  </span>
                )}
              </button>

            </div>

          </div>
        </div>

        {/* Mobile order mode bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-2.5 bg-zinc-50 border-t border-zinc-200 text-xs">
          <div className="flex gap-1">
            <button
              onClick={() => setOrderType('delivery')}
              className={`px-3 py-1 rounded-lg font-bold text-[11px] ${
                orderType === 'delivery' ? 'bg-red-600 text-white shadow-2xs' : 'text-zinc-600 bg-white border border-zinc-200'
              }`}
            >
              Delivery (30m)
            </button>
            <button
              onClick={() => setOrderType('pickup')}
              className={`px-3 py-1 rounded-lg font-bold text-[11px] ${
                orderType === 'pickup' ? 'bg-red-600 text-white shadow-2xs' : 'text-zinc-600 bg-white border border-zinc-200'
              }`}
            >
              Pick-up
            </button>
          </div>
          <button
            onClick={() => setShowAddressModal(true)}
            className="flex items-center gap-1 text-[11px] text-zinc-700 font-semibold truncate max-w-[190px]"
          >
            <MapPin className="w-3 h-3 text-red-600 shrink-0" />
            <span className="truncate">{deliveryAddress}</span>
          </button>
        </div>
      </header>

      {/* Address Edit Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white border border-zinc-200 rounded-3xl max-w-md w-full p-6 text-zinc-900 shadow-2xl relative">
            <button
              onClick={() => setShowAddressModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-zinc-900">Delivery Location</h3>
                <p className="text-xs text-zinc-500">Where should we deliver your hot fried chicken?</p>
              </div>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Street Address or Landmark
                </label>
                <input
                  type="text"
                  value={tempAddress}
                  onChange={(e) => setTempAddress(e.target.value)}
                  placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                  required
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-red-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setTempAddress('452 Lexington Ave, Manhattan, NY')}
                  className="p-2.5 rounded-xl bg-zinc-50 hover:bg-red-50 hover:border-red-300 text-left border border-zinc-200 transition-colors"
                >
                  <span className="font-bold block text-zinc-800">Downtown NY</span>
                  <span className="text-[10px] text-zinc-500">Lexington Ave (25m)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTempAddress('88 Market St, San Francisco, CA')}
                  className="p-2.5 rounded-xl bg-zinc-50 hover:bg-red-50 hover:border-red-300 text-left border border-zinc-200 transition-colors"
                >
                  <span className="font-bold block text-zinc-800">Financial District</span>
                  <span className="text-[10px] text-zinc-500">Market St (20m)</span>
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 font-bold text-sm text-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 font-extrabold text-sm text-white shadow-lg shadow-red-600/30 transition-colors"
                >
                  Set Delivery Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
