import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { CartItem, OrderType, DealPromo } from '../types/kfc';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartId: string, newQty: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
  orderType: OrderType;
  appliedPromo: DealPromo | null;
  onApplyCouponCode: (code: string) => boolean;
  onRemoveCoupon: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  orderType,
  appliedPromo,
  onApplyCouponCode,
  onRemoveCoupon,
  onCheckout,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  // Compute discount
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent) {
      discount = (subtotal * appliedPromo.discountPercent) / 100;
    } else if (appliedPromo.discountAmount) {
      discount = Math.min(appliedPromo.discountAmount, subtotal);
    }
  }

  // Delivery fee
  const deliveryFee = orderType === 'delivery' ? (subtotal >= 35 ? 0 : 2.99) : 0;
  const estimatedTax = (subtotal - discount) * 0.08;
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee + estimatedTax);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const success = onApplyCouponCode(couponInput.trim());
    if (success) {
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code or minimum order not met.');
    }
  };

  // Free reward threshold (e.g. $35)
  const freeThreshold = 35;
  const progressPercent = Math.min(100, (subtotal / freeThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-l border-zinc-200 w-full max-w-md h-full flex flex-col justify-between shadow-2xl text-zinc-900 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-display text-lg shadow-md shadow-red-600/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display uppercase tracking-wide text-lg text-zinc-950">
                YOUR BUCKET BAG
              </h3>
              <p className="text-xs text-zinc-500 font-medium">
                {items.length} {items.length === 1 ? 'item' : 'items'} •{' '}
                <span className="capitalize text-red-600 font-extrabold">{orderType}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-[11px] text-zinc-500 hover:text-red-600 font-bold px-2 py-1 rounded"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Delivery / Reward Progress Bar */}
        {subtotal > 0 && (
          <div className="bg-red-50/70 px-5 py-3 border-b border-red-100 text-xs">
            <div className="flex items-center justify-between mb-1.5 font-bold">
              <span className="flex items-center gap-1.5 text-zinc-800">
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                {subtotal >= freeThreshold ? (
                  <span className="text-emerald-700 font-extrabold">Unlocked FREE Delivery! 🎉</span>
                ) : (
                  <span>Add ${(freeThreshold - subtotal).toFixed(2)} for FREE Delivery</span>
                )}
              </span>
              <span className="font-mono text-zinc-600 font-bold">
                ${subtotal.toFixed(2)} / ${freeThreshold}
              </span>
            </div>
            <div className="w-full h-1.5 bg-red-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Items Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="text-5xl">🪣</div>
              <h4 className="font-extrabold text-zinc-950 text-lg">Your Bucket is Empty</h4>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                Crispy fried chicken, hot wings, and family feasts are waiting for you.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 font-extrabold text-xs uppercase tracking-wide text-white transition-colors shadow-md shadow-red-600/20"
              >
                Start Ordering
              </button>
            </div>
          ) : (
            items.map((cartItem) => (
              <div
                key={cartItem.cartId}
                className="bg-stone-50 border border-zinc-200 rounded-2xl p-3.5 flex gap-3 hover:border-red-300 transition-colors shadow-2xs"
              >
                {/* Item Thumbnail */}
                <img
                  src={cartItem.item.image}
                  alt={cartItem.item.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 bg-zinc-100"
                />

                {/* Info & Options */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-extrabold text-zinc-950 text-xs sm:text-sm truncate">
                        {cartItem.item.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(cartItem.cartId)}
                        className="text-zinc-400 hover:text-red-600 p-1 shrink-0"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Custom selections tags */}
                    <div className="space-y-0.5 mt-1 text-[11px] text-zinc-600">
                      {cartItem.recipe && (
                        <div>
                          <span className="text-red-600 font-bold">Recipe:</span>{' '}
                          {cartItem.recipe === 'original'
                            ? 'Original (11 Herbs)'
                            : cartItem.recipe === 'crispy'
                            ? 'Extra Crispy'
                            : 'Nashville Hot Fire'}
                        </div>
                      )}
                      {cartItem.selectedSide && (
                        <div>
                          <span className="text-amber-700 font-bold">Sides:</span>{' '}
                          {cartItem.selectedSide}
                        </div>
                      )}
                      {cartItem.selectedSauces?.length > 0 && (
                        <div>
                          <span className="text-zinc-500 font-bold">Sauces:</span>{' '}
                          {cartItem.selectedSauces.join(', ')}
                        </div>
                      )}
                      {cartItem.selectedDrink && (
                        <div>
                          <span className="text-cyan-700 font-bold">Drink:</span>{' '}
                          {cartItem.selectedDrink}
                        </div>
                      )}
                      {cartItem.notes && (
                        <div className="italic text-zinc-500 truncate">
                          &quot;{cartItem.notes}&quot;
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-zinc-200">
                    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-zinc-300">
                      <button
                        onClick={() =>
                          onUpdateQuantity(cartItem.cartId, cartItem.quantity - 1)
                        }
                        className="text-zinc-500 hover:text-zinc-950 p-0.5"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-extrabold text-xs text-zinc-950 w-4 text-center">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(cartItem.cartId, cartItem.quantity + 1)
                        }
                        className="text-zinc-500 hover:text-zinc-950 p-0.5"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-mono font-extrabold text-sm text-zinc-950">
                      ${cartItem.totalPrice.toFixed(2)}
                    </span>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer with Coupon & Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-zinc-200 bg-stone-50 space-y-4">
            
            {/* Promo Code Input or Applied Badge */}
            {appliedPromo ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 p-2.5 rounded-xl text-xs text-emerald-800">
                <div className="flex items-center gap-1.5 font-bold">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Promo {appliedPromo.code} applied!</span>
                </div>
                <button
                  onClick={onRemoveCoupon}
                  className="text-emerald-700 hover:text-emerald-950 font-bold text-[11px]"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon (e.g. CRISPY20)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 uppercase font-mono focus:outline-none focus:border-red-600 shadow-2xs"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-xs font-bold text-white transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-red-600 font-semibold">{couponError}</p>
                )}
              </form>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-zinc-950 font-bold">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount</span>
                  <span className="font-mono">-${discount.toFixed(2)}</span>
                </div>
              )}
              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-mono text-zinc-950 font-bold">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 uppercase font-extrabold">FREE</span>
                    ) : (
                      `$${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-mono text-zinc-950 font-bold">${estimatedTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-zinc-950 pt-2 border-t border-zinc-200">
                <span>Total Due</span>
                <span className="font-mono text-xl text-red-600">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={onCheckout}
              className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-base shadow-xl shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-red-700"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
