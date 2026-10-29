import React, { useState, useEffect } from 'react';
import { 
  X, 
  PackageCheck, 
  MapPin, 
  Bike, 
  RotateCcw, 
  ArrowRight, 
  Phone, 
  User, 
  QrCode, 
  Clock, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { OrderDetails, CartItem } from '../types/kfc';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderDetails[];
  onTrackOrder: (order: OrderDetails) => void;
  onReorder: (items: CartItem[]) => void;
  onConfirmPayment?: (orderId: string) => void;
  onAddNewOrderPrompt?: () => void;
  onMarkOrderReceived?: (orderId: string) => void;
  onMarkAllReceived?: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  onTrackOrder,
  onReorder,
  onConfirmPayment,
  onAddNewOrderPrompt,
  onMarkOrderReceived,
  onMarkAllReceived,
}) => {
  const [activeTab, setActiveTab] = useState<'delivering' | 'all' | 'completed'>('delivering');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [expandedQR, setExpandedQR] = useState<{ [orderId: string]: boolean }>({});
  const [enlargedQRImage, setEnlargedQRImage] = useState<{ order: OrderDetails } | null>(null);

  // 30-minute countdown timer state (1800 seconds)
  const [secondsLeft, setSecondsLeft] = useState<number>(1800);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timerString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = Math.max(0, (secondsLeft / 1800) * 100);

  // Active / delivering orders count
  const activeOrders = orders.filter((o) => o.status !== 'delivered');
  const completedOrders = orders.filter((o) => o.status === 'delivered');

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'delivering') return o.status !== 'delivered';
    if (activeTab === 'completed') return o.status === 'delivered';
    return true;
  });

  const handleCopyText = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleMarkAsPaid = (orderId: string) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e4002b', '#10b981', '#f59e0b', '#ffffff'],
    });

    if (onConfirmPayment) {
      onConfirmPayment(orderId);
    }
  };

  const toggleQR = (orderId: string) => {
    setExpandedQR((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const getStatusBadge = (status: OrderDetails['status'], isPaid?: boolean) => {
    switch (status) {
      case 'received':
        return (
          <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-semibold text-xs border border-amber-200 flex items-center gap-1">
            <span>⏳</span> Đã nhận đơn {isPaid ? '• Đã thanh toán' : '• Chờ chuyển khoản'}
          </span>
        );
      case 'cooking':
        return (
          <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 font-semibold text-xs border border-red-200 flex items-center gap-1 animate-pulse">
            <span>🍗</span> Đang chiên giòn {isPaid && '• Đã thanh toán'}
          </span>
        );
      case 'delivering':
        return (
          <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-200 flex items-center gap-1">
            <span>🛵</span> Đang giao tới bạn {isPaid && '• Đã thanh toán'}
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200 flex items-center gap-1">
            <span>✓</span> Đã giao thành công
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
        <div className="bg-white border border-zinc-200 rounded-3xl max-w-2xl w-full text-zinc-900 shadow-xl overflow-hidden my-6">
          
          {/* Header */}
          <div className="p-5 sm:p-6 bg-stone-900 text-white flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg sm:text-xl text-white tracking-tight">
                  Theo Dõi Đơn Hàng Của Bạn
                </h3>
                <p className="text-xs text-zinc-400 font-normal">
                  Hỗ trợ nhận và quản lý nhiều đơn hàng giao cùng lúc
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Tabs & Multi-order summary */}
          <div className="bg-stone-50 border-b border-zinc-200 px-5 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-1.5">
              <button
                onClick={() => setActiveTab('delivering')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'delivering'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <span>Đang giao / Chưa nhận</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'delivering' ? 'bg-white/25 text-white' : 'bg-red-100 text-red-700'
                }`}>
                  {activeOrders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'all'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Tất cả ({orders.length})
              </button>

              <button
                onClick={() => setActiveTab('completed')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'completed'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Đã nhận ({completedOrders.length})
              </button>
            </div>

            {/* Quick Button: Đặt thêm đơn khác giao cùng lúc */}
            {onAddNewOrderPrompt && (
              <button
                onClick={() => {
                  onClose();
                  onAddNewOrderPrompt();
                }}
                className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 py-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Đặt thêm đơn khác</span>
              </button>
            )}
          </div>

          {/* Multi-Order Notice Banner when multiple active orders exist */}
          {activeTab === 'delivering' && activeOrders.length > 0 && (
            <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Bạn đang có <strong>{activeOrders.length} đơn hàng</strong> đang được chuẩn bị và giao đồng thời.
                </span>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {onMarkAllReceived && activeOrders.length > 1 && (
                  <button
                    onClick={() => onMarkAllReceived()}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Nhận tất cả ({activeOrders.length}) đơn cùng lúc</span>
                  </button>
                )}
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-lg">
                  {activeOrders.length > 1 ? 'Đang giao đồng thời' : 'Đang xử lý'}
                </span>
              </div>
            </div>
          )}

          {/* Orders List */}
          <div className="p-5 sm:p-6 space-y-5 max-h-[68vh] overflow-y-auto">
            {filteredOrders.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="text-4xl">🍗</div>
                <h4 className="font-bold text-base text-zinc-900">
                  Không có đơn hàng nào trong mục này
                </h4>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  {activeTab === 'delivering'
                    ? 'Hiện tại không có đơn nào đang giao. Bạn có thể chọn món và đặt hàng ngay!'
                    : 'Chưa có lịch sử đơn hàng nào.'}
                </p>
                {onAddNewOrderPrompt && (
                  <button
                    onClick={() => {
                      onClose();
                      onAddNewOrderPrompt();
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors"
                  >
                    Đặt Món Ngay
                  </button>
                )}
              </div>
            ) : (
              filteredOrders.map((ord, orderIndex) => {
                const isQRVisible = expandedQR[ord.orderId] ?? true;
                const mainItemName = ord.items[0]?.item.name || 'Gà Rán KFC';
                const orderSummaryTitle = ord.orderTitle || `${mainItemName} (${ord.items.length} món)`;

                return (
                  <div
                    key={ord.orderId}
                    className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5 hover:border-zinc-300 transition-all space-y-3.5 shadow-xs"
                  >
                    
                    {/* 1. Header Đơn Hàng: Đơn thứ X / Tổng số đơn */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {activeOrders.length > 1 && ord.status !== 'delivered' && (
                            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-zinc-800 font-bold text-[11px] border border-zinc-200">
                              Đơn #{orderIndex + 1}/{activeOrders.length}
                            </span>
                          )}
                          <span className="font-bold text-base text-zinc-950">
                            {orderSummaryTitle}
                          </span>
                          {getStatusBadge(ord.status, ord.isPaid)}
                        </div>
                        <div className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                          <span className="font-semibold text-zinc-700">Mã đơn: #{ord.orderId}</span>
                          <span>•</span>
                          <span>Đặt lúc: {ord.placedAt}</span>
                          <span>•</span>
                          <span className="text-zinc-600">
                            {ord.orderType === 'delivery' ? 'Giao tận nơi' : 'Lấy tại quầy'}
                          </span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-[11px] text-zinc-400 block font-medium">Tổng tiền</span>
                        <span className="font-bold text-base sm:text-lg text-red-600 font-mono">
                          {ord.total.toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                    </div>

                    {/* 2. THÔNG TIN GIAO HÀNG (TÊN, SĐT, ĐỊA CHỈ TỐI GIẢN & DỄ NHÌN) */}
                    <div className="bg-stone-50 rounded-xl p-3.5 border border-zinc-200/80 space-y-2 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Người nhận */}
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-zinc-400 shrink-0" />
                          <div>
                            <span className="text-[11px] text-zinc-500 block">Khách nhận:</span>
                            <span className="font-bold text-zinc-900">{ord.customerName}</span>
                          </div>
                        </div>

                        {/* SĐT */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div>
                              <span className="text-[11px] text-zinc-500 block">Điện thoại:</span>
                              <span className="font-bold font-mono text-zinc-900">{ord.phone}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <a
                              href={`tel:${ord.phone}`}
                              className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] rounded transition-colors"
                            >
                              Gọi
                            </a>
                            <button
                              onClick={() => handleCopyText(ord.phone, `phone-${ord.orderId}`)}
                              className="p-1 text-zinc-500 hover:text-zinc-800"
                              title="Sao chép SĐT"
                            >
                              {copiedField === `phone-${ord.orderId}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Địa chỉ giao */}
                      <div className="pt-2 border-t border-zinc-200/60 flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[11px] text-zinc-500 block">Địa chỉ giao hàng:</span>
                            <span className="font-semibold text-zinc-800 leading-snug">{ord.address}</span>
                            {ord.notes && (
                              <p className="text-[11px] text-zinc-500 italic mt-0.5">
                                Ghi chú: {ord.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleCopyText(ord.address, `addr-${ord.orderId}`)}
                          className="text-zinc-500 hover:text-red-600 text-[11px] font-semibold shrink-0"
                        >
                          {copiedField === `addr-${ord.orderId}` ? 'Đã sao chép' : 'Sao chép'}
                        </button>
                      </div>
                    </div>

                    {/* 3. KHỐI QR CHUYỂN KHOẢN (NẾU CHƯA THANH TOÁN HOẶC CHỌN VIETQR) */}
                    <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
                      <div 
                        onClick={() => toggleQR(ord.orderId)}
                        className="px-3.5 py-2.5 bg-stone-50 hover:bg-stone-100 flex items-center justify-between cursor-pointer transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <QrCode className="w-4 h-4 text-red-600" />
                          <span className="font-bold text-zinc-900">
                            Mã QR Chuyển Khoản TPBank
                          </span>
                          {ord.isPaid ? (
                            <span className="text-emerald-700 bg-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Đã thanh toán
                            </span>
                          ) : (
                            <span className="text-red-600 font-mono font-bold text-[11px]">
                              Hết hạn sau {timerString}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-zinc-400">
                          {isQRVisible ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>

                      {isQRVisible && (
                        <div className="p-4 space-y-3 border-t border-zinc-100">
                          
                          {/* Đếm ngược 30 phút */}
                          <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-100">
                            <span className="text-zinc-500 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-red-600" />
                              <span>Thời gian QR còn hiệu lực:</span>
                            </span>
                            <span className="font-mono font-bold text-red-600 text-sm">
                              {timerString}
                            </span>
                          </div>

                          <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-600 transition-all duration-1000 rounded-full"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>

                          {/* Chi tiết QR + Ảnh */}
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-1">
                            <div className="sm:col-span-5 flex flex-col items-center">
                              <div 
                                onClick={() => setEnlargedQRImage({ order: ord })}
                                className="bg-white p-2 rounded-xl border border-zinc-200 shadow-xs cursor-pointer group hover:border-red-500 transition-colors max-w-[170px]"
                              >
                                <img
                                  src="/assets/aistudio/1e40683a-d4e6-4f9c-931d-7b3ccb55b1da_7813f039.jfif"
                                  alt="Mã QR TPBank"
                                  className="w-full h-auto rounded-lg object-contain"
                                />
                              </div>
                              <span className="text-[11px] text-zinc-400 mt-1">Bấm để phóng to</span>
                            </div>

                            <div className="sm:col-span-7 space-y-1.5 text-xs">
                              <div className="flex justify-between items-center py-1 border-b border-zinc-100">
                                <span className="text-zinc-500">Ngân hàng:</span>
                                <span className="font-bold text-zinc-900">TPBank</span>
                              </div>
                              <div className="flex justify-between items-center py-1 border-b border-zinc-100">
                                <span className="text-zinc-500">Chủ tài khoản:</span>
                                <span className="font-bold text-zinc-900">LE TRUONG MINH</span>
                              </div>
                              <div className="flex justify-between items-center py-1 border-b border-zinc-100">
                                <span className="text-zinc-500">Số tài khoản:</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono font-bold text-zinc-950">0376 4688 888</span>
                                  <button
                                    onClick={() => handleCopyText('03764688888', `stk-${ord.orderId}`)}
                                    className="text-red-600 hover:text-red-700 font-semibold text-[11px]"
                                  >
                                    {copiedField === `stk-${ord.orderId}` ? 'Đã chép' : 'Chép'}
                                  </button>
                                </div>
                              </div>
                              <div className="flex justify-between items-center py-1 border-b border-zinc-100">
                                <span className="text-zinc-500">Số tiền:</span>
                                <span className="font-mono font-bold text-red-600">
                                  {ord.total.toLocaleString('vi-VN')} ₫
                                </span>
                              </div>
                              <div className="flex justify-between items-center py-1">
                                <span className="text-zinc-500">Nội dung:</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono font-semibold text-zinc-900">KFC {ord.orderId}</span>
                                  <button
                                    onClick={() => handleCopyText(`KFC ${ord.orderId}`, `note-${ord.orderId}`)}
                                    className="text-red-600 hover:text-red-700 font-semibold text-[11px]"
                                  >
                                    {copiedField === `note-${ord.orderId}` ? 'Đã chép' : 'Chép'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Xác nhận chuyển khoản */}
                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleMarkAsPaid(ord.orderId)}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Tôi Đã Chuyển Khoản Xong</span>
                            </button>
                          </div>

                        </div>
                      )}
                    </div>

                    {/* 4. Tóm tắt món ăn */}
                    <div className="text-xs text-zinc-600 py-1">
                      <span className="font-semibold text-zinc-700">Món đã đặt: </span>
                      {ord.items.map((it) => `${it.quantity}x ${it.item.name}`).join(', ')}
                    </div>

                    {/* 5. Nút Thao Tác: Theo dõi & Đặt lại */}
                    <div className="flex flex-wrap items-center justify-between pt-2 border-t border-zinc-100 gap-2">
                      <div className="text-[11px] text-zinc-400">
                        Thanh toán: <span className="font-medium text-zinc-700 uppercase">{ord.paymentMethod}</span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {ord.status !== 'delivered' && onMarkOrderReceived && (
                          <button
                            type="button"
                            onClick={() => {
                              onMarkOrderReceived(ord.orderId);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs transition-colors flex items-center gap-1 shadow-2xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Đã Nhận Đơn Này</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onReorder(ord.items)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 font-semibold text-xs text-zinc-700 transition-colors flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Đặt lại</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onTrackOrder(ord);
                            onClose();
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <Bike className="w-3.5 h-3.5" />
                          <span>Kiểm Tra Khi Nào Giao</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-stone-50 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-500">
            <span>Tổng đài giao hàng: <strong className="text-red-600 font-mono">1900 6886</strong></span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-semibold text-xs transition-colors"
            >
              Đóng
            </button>
          </div>

        </div>
      </div>

      {/* Modal Phóng To Mã QR */}
      {enlargedQRImage && (
        <div 
          onClick={() => setEnlargedQRImage(null)}
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-5 rounded-2xl max-w-sm w-full text-center space-y-3 shadow-xl relative"
          >
            <button
              onClick={() => setEnlargedQRImage(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="font-bold text-base text-zinc-900">Mã QR Chuyển Khoản TPBank</h3>
              <p className="text-xs text-red-600 font-mono font-bold">LE TRUONG MINH • 0376 4688 888</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Mã có hiệu lực trong 30 phút</p>
            </div>

            <div className="border border-zinc-200 p-2 rounded-xl bg-white shadow-xs inline-block">
              <img
                src="/assets/aistudio/1e40683a-d4e6-4f9c-931d-7b3ccb55b1da_7813f039.jfif"
                alt="Mã QR TPBank LE TRUONG MINH"
                className="w-60 h-auto mx-auto rounded-lg"
              />
            </div>

            <button
              onClick={() => setEnlargedQRImage(null)}
              className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-xs text-white"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
};
