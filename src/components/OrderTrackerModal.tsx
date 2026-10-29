import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  ChefHat, 
  Bike, 
  PackageCheck, 
  Flame, 
  Layers
} from 'lucide-react';
import { OrderDetails } from '../types/kfc';

interface OrderTrackerModalProps {
  order: OrderDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onNewOrder: () => void;
  activeOrders?: OrderDetails[];
  onSelectOrder?: (order: OrderDetails) => void;
  onMarkDelivered?: (orderId: string) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  order,
  isOpen,
  onClose,
  onNewOrder,
  activeOrders = [],
  onSelectOrder,
  onMarkDelivered,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(2); // 1: received, 2: cooking, 3: delivering, 4: delivered
  const [secondsRemaining, setSecondsRemaining] = useState<number>(1680); // 28 mins

  useEffect(() => {
    if (!isOpen) return;

    // Simulate order progress advancing
    const stepTimer = setTimeout(() => {
      setCurrentStep(3); // Driver on the way
    }, 7000);

    const countdownInterval = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearTimeout(stepTimer);
      clearInterval(countdownInterval);
    };
  }, [isOpen, order?.orderId]);

  if (!isOpen || !order) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  const steps = [
    {
      id: 1,
      title: 'Đã tiếp nhận đơn hàng',
      desc: 'Phiếu in trực tiếp tại bếp chiên KFC Express',
      icon: CheckCircle2,
    },
    {
      id: 2,
      title: 'Đang chiên áp suất giòn tan',
      desc: 'Tẩm ướp 11 thảo mộc bí truyền & chiên vàng ruộm',
      icon: ChefHat,
    },
    {
      id: 3,
      title: 'Tài xế đang trên đường giao tới',
      desc: 'Bảo quản thùng giữ nhiệt đỏ KFC 100% nóng giòn',
      icon: Bike,
    },
    {
      id: 4,
      title: 'Đã giao tận nơi thành công',
      desc: 'Chúc bạn ngon miệng với bữa tiệc gà rán KFC!',
      icon: PackageCheck,
    },
  ];

  const deliveringOrders = activeOrders.filter((o) => o.status !== 'delivered');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white border border-zinc-200 rounded-3xl max-w-xl w-full text-zinc-900 shadow-2xl overflow-hidden my-6">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-zinc-900 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center text-lg shadow-sm">
              🍗
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">
                  Mã #{order.orderId}
                </span>
                <span className="text-xs text-zinc-400">
                  Đặt lúc {order.placedAt}
                </span>
              </div>
              <h3 className="font-bold text-lg text-white tracking-tight mt-0.5">
                Theo Dõi Giao Hàng Trực Tiếp
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-order switcher tabs if multiple orders active */}
        {deliveringOrders.length > 1 && (
          <div className="bg-stone-50 border-b border-zinc-200 p-2.5 px-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-semibold text-zinc-500 shrink-0 flex items-center gap-1 mr-1">
              <Layers className="w-3.5 h-3.5 text-zinc-600" />
              <span>Chuyển đơn:</span>
            </span>
            {deliveringOrders.map((ord, idx) => {
              const isSelected = ord.orderId === order.orderId;
              return (
                <button
                  key={ord.orderId}
                  onClick={() => onSelectOrder && onSelectOrder(ord)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
                  }`}
                >
                  <span>Đơn #{idx + 1} ({ord.customerName.split(' ').pop()})</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-red-50 text-red-600 font-bold'
                  }`}>
                    {ord.orderId.slice(-4)}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[72vh] overflow-y-auto">
          
          {/* Estimated time display */}
          <div className="bg-stone-50 border border-zinc-200 p-4 sm:p-5 rounded-2xl text-center space-y-1.5 relative overflow-hidden shadow-2xs">
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />
            
            <div className="text-xs font-semibold text-zinc-600 flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-red-600 animate-spin" />
              <span>Thời gian giao dự kiến</span>
            </div>

            <div className="text-4xl font-mono font-bold text-zinc-950 tracking-tight">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>

            {order.estimatedDeliveryTime && (
              <div className="text-xs text-zinc-600">
                Nhận gà khoảng: <span className="text-red-600 font-bold font-mono">{order.estimatedDeliveryTime}</span>
              </div>
            )}

            <p className="text-xs text-emerald-700 font-semibold flex items-center justify-center gap-1 pt-0.5">
              <Flame className="w-3.5 h-3.5 text-red-600" />
              <span>Cam kết giao nóng giòn trong 30 phút</span>
            </p>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-800">
              Tiến độ làm gà & giao hàng
            </h4>
            <div className="space-y-3 relative pl-6 border-l-2 border-zinc-200 ml-3">
              {steps.map((st) => {
                const isPassed = currentStep >= st.id;
                const isCurrent = currentStep === st.id;
                const Icon = st.icon;

                return (
                  <div key={st.id} className="relative group">
                    <div
                      className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-4 ring-red-100 scale-105'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-zinc-200 text-zinc-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="pl-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-sm ${
                            isCurrent
                              ? 'text-red-600'
                              : isPassed
                              ? 'text-zinc-900'
                              : 'text-zinc-400'
                          }`}
                        >
                          {st.title}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200 animate-pulse">
                            Đang xử lý
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Courier Info Card */}
          <div className="bg-stone-50 border border-zinc-200 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-lg border border-red-200">
                🛵
              </div>
              <div>
                <div className="text-[11px] text-zinc-500">Tài xế phụ trách</div>
                <div className="font-bold text-zinc-950 text-sm">{order.courier?.name || 'Nguyễn Văn Cường'}</div>
                <div className="text-[11px] text-zinc-500">{order.courier?.vehicle || 'Xe Honda Wave • Thùng đỏ KFC'}</div>
              </div>
            </div>

            <a
              href={`tel:${order.courier?.phone || '0912888999'}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-800 border border-emerald-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>Gọi Tài Xế</span>
            </a>
          </div>

          {/* Delivery Destination & Customer Info */}
          <div className="bg-red-50/60 p-4 rounded-2xl border border-red-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-red-200/60 pb-2">
              <span className="font-bold text-red-700 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>Nơi giao hàng & người nhận</span>
              </span>
              <a
                href={`tel:${order.phone}`}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-[11px] flex items-center gap-1 shadow-2xs"
              >
                <Phone className="w-3 h-3" />
                <span>Gọi Khách ({order.phone})</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
              <div>
                <span className="text-zinc-500 block text-[11px]">Người nhận hàng:</span>
                <span className="font-bold text-sm text-zinc-950">{order.customerName}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">Số điện thoại:</span>
                <span className="font-mono font-bold text-sm text-zinc-950">{order.phone}</span>
              </div>
            </div>

            <div className="pt-1 text-xs">
              <span className="text-zinc-500 block text-[11px]">Địa chỉ giao hàng:</span>
              <span className="font-semibold text-zinc-900 leading-snug">{order.address}</span>
            </div>

            {order.notes && (
              <div className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200 font-medium">
                📌 <strong>Ghi chú:</strong> {order.notes}
              </div>
            )}
          </div>

          {/* Receipt Items Breakdown */}
          <div className="space-y-2 border-t border-zinc-200 pt-3 text-xs">
            <div className="font-bold text-zinc-800">
              Danh sách món trong đơn ({order.items.length})
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-zinc-600">
                  <span className="truncate pr-2">
                    {it.quantity}x {it.item.name}
                  </span>
                  <span className="font-mono text-zinc-900 font-semibold shrink-0">
                    {it.totalPrice.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold text-sm text-zinc-950 pt-2 border-t border-zinc-200">
              <span>Tổng tiền ({order.paymentMethod === 'wallet' ? 'Ví KFC Pay' : order.paymentMethod.toUpperCase()})</span>
              <span className="font-mono text-red-600 text-base font-bold">
                {order.total.toLocaleString('vi-VN')} ₫
              </span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-2.5">
          {onMarkDelivered && order.status !== 'delivered' && (
            <button
              onClick={() => {
                onMarkDelivered(order.orderId);
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Xác Nhận Đã Nhận Đơn Này</span>
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-semibold text-xs transition-colors"
            >
              Đóng Cửa Sổ
            </button>
            <button
              onClick={() => {
                onNewOrder();
                onClose();
              }}
              className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-sm"
            >
              + Đặt Thêm Đơn Khác
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
