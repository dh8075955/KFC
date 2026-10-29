import React, { useState } from 'react';
import { X, MapPin, Phone, User, CreditCard, ShieldCheck, ArrowRight, DollarSign, Wallet, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, OrderType, DealPromo, OrderDetails, DeliveryAddress } from '../types/kfc';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  orderType: OrderType;
  activeAddress: DeliveryAddress;
  onOpenAddressManager: () => void;
  walletBalance: number;
  onOpenWallet: () => void;
  appliedPromo: DealPromo | null;
  onOrderSuccess: (order: OrderDetails, usedWallet: boolean) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  orderType,
  activeAddress,
  onOpenAddressManager,
  walletBalance,
  onOpenWallet,
  appliedPromo,
  onOrderSuccess,
}) => {
  const [customerName, setCustomerName] = useState(activeAddress.recipientName);
  const [phone, setPhone] = useState(activeAddress.phone);
  const [instructions, setInstructions] = useState(activeAddress.notes || 'Bấm chuông, giao tận cửa nhà.');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'cod' | 'vietqr' | 'momo'>('wallet');
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

  const freeThreshold = 160000;
  const deliveryFee = orderType === 'delivery' ? (subtotal >= freeThreshold ? 0 : 25000) : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const isWalletInsufficient = paymentMethod === 'wallet' && walletBalance < total;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isWalletInsufficient) {
      onOpenWallet();
      return;
    }

    setIsSubmitting(true);

    confetti({
      particleCount: 140,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#e4002b', '#ffffff', '#f59e0b', '#000000'],
    });

    const now = new Date();
    const placedTimeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const etaDate = new Date(now.getTime() + 30 * 60000);
    const etaTimeStr = etaDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    setTimeout(() => {
      const fullAddressString = `${activeAddress.street}, ${activeAddress.ward}, ${activeAddress.district}, ${activeAddress.city}`;
      const newOrder: OrderDetails = {
        orderId: `KFC-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: fullAddressString,
        orderType,
        items,
        subtotal,
        discount,
        deliveryFee,
        total,
        paymentMethod,
        status: 'received',
        placedAt: placedTimeStr,
        estimatedDeliveryMins: 30,
        estimatedDeliveryTime: etaTimeStr,
        courier: {
          name: 'Nguyễn Văn Cường',
          phone: '0912 888 999',
          vehicle: 'Honda Wave • Thùng giữ nhiệt đỏ KFC',
        },
      };

      setIsSubmitting(false);
      onOrderSuccess(newOrder, paymentMethod === 'wallet');
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
              THANH TOÁN ĐƠN GÀ RÁN
            </h3>
            <p className="text-xs text-red-100 font-medium">
              Kiểm tra thông tin giao hàng & chọn phương thức thanh toán
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
          
          {/* Nơi giao hàng & nút chỉnh */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-800">
                Nơi Giao Hàng ({activeAddress.title})
              </h4>
              <button
                type="button"
                onClick={onOpenAddressManager}
                className="text-xs text-red-600 font-extrabold hover:underline"
              >
                Chỉnh nơi giao hàng →
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-zinc-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 border border-red-200 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-xs space-y-0.5">
                <div className="font-extrabold text-zinc-900">
                  {activeAddress.street}, {activeAddress.ward}, {activeAddress.district}, {activeAddress.city}
                </div>
                <div className="text-zinc-500 font-medium">
                  Người nhận: {customerName} • SĐT: {phone}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1">Tên người nhận</label>
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
              <label className="block text-xs font-semibold text-zinc-600 mb-1">Số điện thoại tài xế gọi</label>
              <div className="flex items-center bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 focus-within:border-red-600 focus-within:bg-white shadow-2xs">
                <Phone className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-transparent border-none text-xs text-zinc-900 focus:outline-none w-full font-mono"
                />
              </div>
            </div>
          </div>

          {/* Ghi chú giao hàng */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 mb-1">
              Ghi chú cho tài xế (Số phòng, số tầng, chỉ dẫn đường đi...)
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-red-600 focus:bg-white shadow-2xs"
            />
          </div>

          {/* Phương thức thanh toán */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-800">
              Phương Thức Thanh Toán
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { 
                  id: 'wallet', 
                  label: 'Ví KFC Pay', 
                  sub: `Số dư: ${walletBalance.toLocaleString('vi-VN')} ₫`, 
                  icon: Wallet,
                  isWallet: true
                },
                { id: 'cod', label: 'Tiền Mặt (COD)', sub: 'Trả tiền khi nhận gà nóng', icon: DollarSign },
                { id: 'vietqr', label: 'Quét Mã VietQR', sub: 'Chuyển khoản tự động 24/7', icon: QrCode },
                { id: 'momo', label: 'Ví MoMo / ZaloPay', sub: 'Thanh toán 1 chạm', icon: ShieldCheck },
              ].map((p) => {
                const isSelected = paymentMethod === p.id;
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaymentMethod(p.id as any)}
                    className={`p-3 rounded-2xl text-left border transition-all relative ${
                      isSelected
                        ? 'bg-red-50 border-red-500 shadow-sm'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-red-600' : 'text-zinc-500'}`} />
                      <span className="font-extrabold text-xs text-zinc-900">{p.label}</span>
                    </div>
                    <p className={`text-[10px] ${p.isWallet && walletBalance < total ? 'text-red-600 font-bold' : 'text-zinc-500'}`}>
                      {p.sub}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Thông báo nếu ví không đủ số dư */}
            {isWalletInsufficient && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between text-xs text-amber-900">
                <span>Số dư ví không đủ để thanh toán đơn này.</span>
                <button
                  type="button"
                  onClick={onOpenWallet}
                  className="font-extrabold text-red-600 underline ml-2"
                >
                  Nạp tiền ngay →
                </button>
              </div>
            )}

            {/* Chi tiết chuyển khoản nếu chọn VietQR */}
            {paymentMethod === 'vietqr' && (
              <div className="p-4 rounded-2xl bg-stone-50 border-2 border-red-500 space-y-3 text-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                  <div className="flex items-center gap-2 font-extrabold text-zinc-900">
                    <QrCode className="w-4 h-4 text-red-600" />
                    <span>Mã QR Chuyển Khoản TPBank (Hết hạn sau 30 phút)</span>
                  </div>
                  <span className="font-mono font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded text-[11px]">
                    30:00
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src="/assets/aistudio/1e40683a-d4e6-4f9c-931d-7b3ccb55b1da_7813f039.jfif"
                    alt="Mã QR TPBank"
                    className="w-20 h-auto rounded-lg border border-red-300 shadow-2xs"
                  />
                  <div className="space-y-0.5 text-[11px]">
                    <div className="font-extrabold text-zinc-900">Ngân hàng TPBank (Tiên Phong)</div>
                    <div>Chủ TK: <strong className="text-red-600">LE TRUONG MINH</strong></div>
                    <div>STK: <strong className="font-mono text-zinc-900">0376 4688 888</strong></div>
                    <div className="text-zinc-500 mt-1 italic">
                      * Sau khi bấm Đặt hàng, bạn có thể xem lại mã QR và đếm ngược 30 phút trong mục &quot;Xem Đơn Hàng&quot;.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chi tiết đơn hàng */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-zinc-200 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-600">
              <span>Số lượng món:</span>
              <span className="text-zinc-900 font-bold">{items.length} món</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Tổng tiền món:</span>
              <span className="text-zinc-900 font-mono font-bold">{subtotal.toLocaleString('vi-VN')} ₫</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Voucher giảm giá:</span>
                <span className="font-mono">-{discount.toLocaleString('vi-VN')} ₫</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-600">
              <span>Phí vận chuyển:</span>
              <span className="text-zinc-900 font-mono font-bold">
                {deliveryFee === 0 ? 'MIỄN PHÍ' : `${deliveryFee.toLocaleString('vi-VN')} ₫`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-zinc-950 pt-2 border-t border-zinc-200">
              <span>Tổng số tiền thanh toán:</span>
              <span className="text-red-600 font-mono text-lg font-extrabold">
                {total.toLocaleString('vi-VN')} ₫
              </span>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-base shadow-xl shadow-red-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 border border-red-700"
          >
            {isSubmitting ? (
              <span>Đang gửi đơn tới nhà bếp KFC...</span>
            ) : isWalletInsufficient ? (
              <span>Nạp Tiền Vào Ví Để Thanh Toán</span>
            ) : (
              <>
                <span>Xác Nhận Đặt Hàng • {total.toLocaleString('vi-VN')} ₫</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-zinc-500 font-medium">
            🔒 Đảm bảo 100% gà rán giao nóng giòn tận nơi trong 30 phút.
          </p>

        </form>

      </div>
    </div>
  );
};
