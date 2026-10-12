import React, { useState } from 'react';
import { X, MapPin, Phone, User, CreditCard, ShieldCheck, ArrowRight, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, OrderType, DealPromo, OrderDetails } from '../types/kfc';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  orderType: OrderType;
  deliveryAddress: string;
  appliedPromo: DealPromo | null;
  onOrderSuccess: (order: OrderDetails) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  orderType,
  deliveryAddress,
  appliedPromo,
  onOrderSuccess,
}) => {
  const [customerName, setCustomerName] = useState('Alex Morgan');
  const [phone, setPhone] = useState('0988 123 456');
  const [address, setAddress] = useState(deliveryAddress);
  const [instructions, setInstructions] = useState('Leave on the front porch table, ring doorbell.');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'momo' | 'vietqr'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent) {
      discount = (subtotal * appliedPromo.discountPercent) / 100;
    } else if (appliedPromo.discountAmount) {
      discount = Math.min(appliedPromo.discountAmount, subtotal);
    }
  }

  const deliveryFee = orderType === 'delivery' ? (subtotal >= 35 ? 0 : 2.99) : 0;
  const estimatedTax = (subtotal - discount) * 0.08;
  const total = Math.max(0, subtotal - discount + deliveryFee + estimatedTax);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Trigger confetti celebration!
    confetti({
      particleCount: 130,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#e4002b', '#ffffff', '#f59e0b', '#000000'],
    });

    setTimeout(() => {
      const newOrder: OrderDetails = {
        orderId: `KFC-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName,
        phone,
        address,
        orderType,
        items,
        subtotal,
        discount,
        deliveryFee,
        total,
        paymentMethod,
        status: 'received',
        placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        estimatedDeliveryMins: 30,
      };

      setIsSubmitting(false);
      onOrderSuccess(newOrder);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white border border-zinc-200 rounded-3xl max-w-xl w-full text-zinc-900 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white flex items-center justify-between">
          <div>
            <h3 className="font-display uppercase tracking-wide text-2xl">
              HOT FRIED CHICKEN CHECKOUT
            </h3>
            <p className="text-xs text-red-100 font-medium">
              We&apos;re preparing the fryer. Review your delivery info below.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/20 hover:bg-black/35 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Customer Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-800">
              Customer Contact Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 mb-1">Full Name</label>
                <div className="flex items-center bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 focus-within:border-red-600 focus-within:bg-white shadow-2xs">
                  <User className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="bg-transparent border-none text-xs text-zinc-900 focus:outline-none w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 mb-1">Phone Number (For Courier)</label>
                <div className="flex items-center bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 focus-within:border-red-600 focus-within:bg-white shadow-2xs">
                  <Phone className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-transparent border-none text-xs text-zinc-900 focus:outline-none w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {orderType === 'delivery' && (
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-800">
                Delivery Location
              </h4>
              <div className="flex items-center bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 focus-within:border-red-600 focus-within:bg-white shadow-2xs">
                <MapPin className="w-4 h-4 text-red-600 mr-2 shrink-0" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-transparent border-none text-xs text-zinc-900 focus:outline-none w-full"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 mb-1">
                  Delivery instructions (Gate code, apartment #, landmark)
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-red-600 focus:bg-white shadow-2xs"
                />
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-800">
              Payment Method
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when hot food arrives', icon: DollarSign },
                { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Amex', icon: CreditCard },
                { id: 'vietqr', label: 'Instant VietQR', sub: 'Scan bank QR 24/7', icon: ShieldCheck },
                { id: 'momo', label: 'E-Wallet / Apple Pay', sub: 'Fast 1-touch checkout', icon: ShieldCheck },
              ].map((p) => {
                const isSelected = paymentMethod === p.id;
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaymentMethod(p.id as any)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      isSelected
                        ? 'bg-red-50 border-red-500 shadow-sm'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-red-600' : 'text-zinc-500'}`} />
                      <span className="font-extrabold text-xs text-zinc-900">{p.label}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500">{p.sub}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Order Summary Recap */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-zinc-200 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-600">
              <span>Items count:</span>
              <span className="text-zinc-900 font-bold">{items.length} items</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal:</span>
              <span className="text-zinc-900 font-mono font-bold">${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Discount Promo:</span>
                <span className="font-mono">-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-600">
              <span>Delivery Fee:</span>
              <span className="text-zinc-900 font-mono font-bold">
                {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-zinc-950 pt-2 border-t border-zinc-200">
              <span>Total Payment:</span>
              <span className="text-red-600 font-mono text-lg font-extrabold">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-base shadow-xl shadow-red-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 border border-red-700"
          >
            {isSubmitting ? (
              <span>Placing Order with Kitchen...</span>
            ) : (
              <>
                <span>Place Order • ${total.toFixed(2)}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-zinc-500 font-medium">
            🔒 Safe & encrypted checkout. 100% crispy hot guarantee on arrival.
          </p>

        </form>

      </div>
    </div>
  );
};
