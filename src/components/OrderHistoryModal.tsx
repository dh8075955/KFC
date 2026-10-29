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
  ChevronUp
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
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  onTrackOrder,
  onReorder,
  onConfirmPayment,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'delivering' | 'completed'>('all');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [expandedQR, setExpandedQR] = useState<{ [orderId: string]: boolean }>({});
  const [enlargedQRImage, setEnlargedQRImage] = useState<boolean>(false);

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
          <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-extrabold text-[11px] border border-amber-300">
            ⏳ Đã Nhận Đơn {isPaid ? '• Đã Thanh Toán' : '• Chờ Chuyển Khoản'}
          </span>
        );
      case 'cooking':
        return (
          <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-700 font-extrabold text-[11px] border border-red-300 animate-pulse">
            🍗 Đang Chiên Giòn {isPaid && '• Đã Thanh Toán'}
          </span>
        );
      case 'delivering':
        return (
          <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-extrabold text-[11px] border border-blue-300">
            🛵 Đang Giao Tới Bạn {isPaid && '• Đã Thanh Toán'}
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-[11px] border border-emerald-300">
            ✓ Đã Giao Thành Công
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
        <div className="bg-white border border-zinc-200 rounded-3xl max-w-2xl w-full text-zinc-900 shadow-2xl overflow-hidden my-6">
          
          {/* Header with KFC Red gradient */}
          <div className="p-6 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center font-display text-2xl shadow-md border-2 border-red-800">
                <PackageCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display uppercase tracking-wide text-2xl">
                  CHI TIẾT ĐƠN HÀNG & GIAO HÀNG
                </h3>
                <p className="text-xs text-red-100 font-medium">
                  Xem tên đơn hàng, địa chỉ, số điện thoại & quét mã QR chuyển khoản
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-black/20 hover:bg-black/35 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="bg-stone-50 border-b border-zinc-200 px-6 py-3 flex gap-2">
            {[
              { id: 'all', label: `Tất cả (${orders.length})` },
              { id: 'delivering', label: 'Đang giao / Chưa nhận' },
              { id: 'completed', label: 'Đã hoàn thành' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white shadow-2xs'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-950'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Orders List */}
          <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto">
            {filteredOrders.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="text-5xl">🍗</div>
                <h4 className="font-extrabold text-base text-zinc-900">
                  Chưa có đơn hàng nào
                </h4>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  Bạn chưa đặt đơn gà rán nào. Hãy chọn món nóng giòn để trải nghiệm giao nhanh 30 phút!
                </p>
              </div>
            ) : (
              filteredOrders.map((ord) => {
                const isQRVisible = expandedQR[ord.orderId] ?? true; // Default open for easy transfer
                const mainItemName = ord.items[0]?.item.name || 'Gà Rán KFC';
                const orderSummaryTitle = ord.orderTitle || `${mainItemName} (${ord.items.length} món)`;

                return (
                  <div
                    key={ord.orderId}
                    className="bg-white border-2 border-zinc-200 rounded-3xl p-5 hover:border-red-400 transition-all space-y-4 shadow-sm"
                  >
                    
                    {/* 1. TÊN ĐƠN HÀNG & MÃ ĐƠN & TRẠNG THÁI */}
                    <div className="bg-stone-50 border border-zinc-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display tracking-wider text-lg text-zinc-950 font-bold">
                            🍗 {orderSummaryTitle}
                          </span>
                          {getStatusBadge(ord.status, ord.isPaid)}
                        </div>
                        <div className="text-xs text-zinc-600 mt-1 flex items-center gap-2">
                          <span className="font-mono font-bold text-red-600">Mã đơn: #{ord.orderId}</span>
                          <span>•</span>
                          <span>Đặt lúc: {ord.placedAt}</span>
                          <span>•</span>
                          <span className="font-semibold text-zinc-800">
                            {ord.orderType === 'delivery' ? '🛵 Giao tận nơi' : '🚗 Đến lấy tại quầy'}
                          </span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-[11px] text-zinc-500 block uppercase font-bold">Tổng thanh toán</span>
                        <span className="font-mono font-extrabold text-xl text-red-600">
                          {ord.total.toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                    </div>

                    {/* 2. THÔNG TIN NGƯỜI NHẬN, ĐỊA CHỈ & SỐ ĐIỆN THOẠI (RÕ RÀNG ĐỂ GIAO HÀNG) */}
                    <div className="bg-red-50/60 border border-red-200 p-4 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-red-700 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-red-600" />
                          <span>Thông Tin Giao Hàng & Liên Hệ Nhận Món</span>
                        </h4>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                          Hotline Giao Hàng: 1900 6886
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {/* Tên người nhận */}
                        <div className="bg-white p-3 rounded-xl border border-red-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-zinc-500" />
                            <div>
                              <div className="text-[10px] text-zinc-400 font-bold uppercase">Họ & Tên Người Nhận</div>
                              <div className="font-extrabold text-sm text-zinc-900">{ord.customerName}</div>
                            </div>
                          </div>
                        </div>

                        {/* Số điện thoại người nhận */}
                        <div className="bg-white p-3 rounded-xl border border-red-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-emerald-600" />
                            <div>
                              <div className="text-[10px] text-zinc-400 font-bold uppercase">Số Điện Thoại Khách Hàng</div>
                              <div className="font-mono font-extrabold text-sm text-zinc-900">{ord.phone}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <a
                              href={`tel:${ord.phone}`}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition-colors"
                            >
                              Gọi
                            </a>
                            <button
                              onClick={() => handleCopyText(ord.phone, `phone-${ord.orderId}`)}
                              className="p-1 text-zinc-500 hover:text-zinc-800 border border-zinc-200 rounded-lg"
                              title="Sao chép số điện thoại"
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

                      {/* Địa chỉ giao hàng đầy đủ */}
                      <div className="bg-white p-3.5 rounded-xl border border-red-100 space-y-1">
                        <div className="text-[10px] text-zinc-400 font-bold uppercase flex items-center justify-between">
                          <span>Địa Chỉ Giao Hàng Chi Tiết</span>
                          <button
                            onClick={() => handleCopyText(ord.address, `addr-${ord.orderId}`)}
                            className="text-red-600 hover:underline flex items-center gap-1 text-[11px] font-bold"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedField === `addr-${ord.orderId}` ? 'Đã chép' : 'Sao chép địa chỉ'}</span>
                          </button>
                        </div>
                        <div className="font-bold text-sm text-zinc-900 leading-snug">
                          {ord.address}
                        </div>
                        {ord.notes && (
                          <div className="text-xs text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200 font-medium mt-1">
                            📌 <strong>Ghi chú giao hàng:</strong> {ord.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 3. PHẦN QR CHUYỂN KHOẢN VỚI ẢNH NGƯỜI DÙNG & ĐẾM NGƯỢC 30 PHÚT */}
                    <div className="bg-gradient-to-br from-red-50 via-white to-amber-50 border-2 border-red-500 rounded-2xl overflow-hidden shadow-sm">
                      
                      {/* Tiêu đề & nút bật tắt */}
                      <div 
                        onClick={() => toggleQR(ord.orderId)}
                        className="p-4 bg-gradient-to-r from-red-600 to-red-700 text-white flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-white text-red-600 flex items-center justify-center font-bold">
                            <QrCode className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-extrabold text-sm uppercase tracking-wide flex items-center gap-2">
                              <span>MÃ QR CHUYỂN KHOẢN NGÂN HÀNG (VIETQR)</span>
                              {ord.isPaid ? (
                                <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                  ✓ ĐÃ THANH TOÁN
                                </span>
                              ) : (
                                <span className="bg-amber-400 text-zinc-950 text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                                  HẾT HẠN SAU {timerString}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-red-100">
                              Quét bằng ứng dụng ngân hàng TPBank, VCB, MB, Techcombank, VNPAY...
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isQRVisible ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>

                      {/* Nội dung QR và Đếm ngược 30 phút */}
                      {isQRVisible && (
                        <div className="p-5 space-y-4">
                          
                          {/* THANH ĐẾM NGƯỢC 30 PHÚT */}
                          <div className="bg-white p-3.5 rounded-xl border border-zinc-200 shadow-2xs space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-extrabold text-zinc-800 flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-red-600 animate-spin" />
                                <span>Thời gian giữ mã QR chuyển khoản:</span>
                              </span>
                              <span className="font-mono font-extrabold text-base text-red-600">
                                {timerString}
                              </span>
                            </div>

                            {/* Thanh tiến trình đếm ngược */}
                            <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-1000 rounded-full"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>

                            <p className="text-[11px] text-zinc-500 italic">
                              * Mã QR có hiệu lực trong 30 phút kể từ lúc đặt hàng. Sau 30 phút đơn hàng sẽ tự động hủy nếu chưa thanh toán.
                            </p>
                          </div>

                          {/* KHỐI ẢNH MÃ QR & THÔNG TIN TÀI KHOẢN TPBANK */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                            
                            {/* Cột Trái: Bức ảnh QR của người dùng */}
                            <div className="md:col-span-5 flex flex-col items-center">
                              <div 
                                onClick={() => setEnlargedQRImage(true)}
                                className="relative bg-white p-2.5 rounded-2xl border-2 border-red-500 shadow-lg cursor-pointer group hover:scale-[1.02] transition-transform max-w-[210px]"
                              >
                                <img
                                  src="/assets/aistudio/1e40683a-d4e6-4f9c-931d-7b3ccb55b1da_7813f039.jfif"
                                  alt="Mã QR Chuyển Khoản TPBank LE TRUONG MINH"
                                  className="w-full h-auto rounded-xl object-contain"
                                />
                                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                                  <ExternalLink className="w-4 h-4" />
                                  <span>Phóng to</span>
                                </div>
                              </div>
                              <span className="text-[11px] text-zinc-500 font-semibold mt-1.5">
                                Nhấn vào ảnh để xem to mã QR
                              </span>
                            </div>

                            {/* Cột Phải: Thông tin chi tiết để chuyển khoản & Nút sao chép */}
                            <div className="md:col-span-7 space-y-2 text-xs">
                              
                              {/* Ngân hàng */}
                              <div className="p-2.5 rounded-xl bg-white border border-zinc-200 flex items-center justify-between">
                                <div>
                                  <div className="text-[10px] text-zinc-400 uppercase font-bold">Ngân Hàng Thụ Hưởng</div>
                                  <div className="font-extrabold text-sm text-zinc-950">TPBank (Ngân Hàng Tiên Phong)</div>
                                </div>
                                <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                                  VietQR
                                </span>
                              </div>

                              {/* Tên chủ tài khoản */}
                              <div className="p-2.5 rounded-xl bg-white border border-zinc-200 flex items-center justify-between">
                                <div>
                                  <div className="text-[10px] text-zinc-400 uppercase font-bold">Chủ Tài Khoản</div>
                                  <div className="font-extrabold text-sm text-red-600">LE TRUONG MINH</div>
                                </div>
                                <button
                                  onClick={() => handleCopyText('LE TRUONG MINH', `owner-${ord.orderId}`)}
                                  className="text-zinc-500 hover:text-zinc-800 p-1"
                                  title="Sao chép tên chủ tài khoản"
                                >
                                  {copiedField === `owner-${ord.orderId}` ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                </button>
                              </div>

                              {/* Số tài khoản */}
                              <div className="p-2.5 rounded-xl bg-white border border-zinc-200 flex items-center justify-between">
                                <div>
                                  <div className="text-[10px] text-zinc-400 uppercase font-bold">Số Tài Khoản</div>
                                  <div className="font-mono font-extrabold text-base text-zinc-950">0376 4688 888</div>
                                </div>
                                <button
                                  onClick={() => handleCopyText('03764688888', `stk-${ord.orderId}`)}
                                  className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg border border-red-200 flex items-center gap-1"
                                >
                                  {copiedField === `stk-${ord.orderId}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                  <span>Sao chép</span>
                                </button>
                              </div>

                              {/* Số tiền cần chuyển */}
                              <div className="p-2.5 rounded-xl bg-white border border-zinc-200 flex items-center justify-between">
                                <div>
                                  <div className="text-[10px] text-zinc-400 uppercase font-bold">Số Tiền Chuyển Khoản</div>
                                  <div className="font-mono font-extrabold text-base text-red-600">
                                    {ord.total.toLocaleString('vi-VN')} ₫
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleCopyText(String(ord.total), `amt-${ord.orderId}`)}
                                  className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg border border-red-200 flex items-center gap-1"
                                >
                                  {copiedField === `amt-${ord.orderId}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                  <span>Sao chép</span>
                                </button>
                              </div>

                              {/* Nội dung chuyển khoản */}
                              <div className="p-2.5 rounded-xl bg-white border border-zinc-200 flex items-center justify-between">
                                <div>
                                  <div className="text-[10px] text-zinc-400 uppercase font-bold">Nội Dung Chuyển Khoản</div>
                                  <div className="font-mono font-extrabold text-sm text-zinc-900">
                                    KFC {ord.orderId}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleCopyText(`KFC ${ord.orderId}`, `note-${ord.orderId}`)}
                                  className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg border border-red-200 flex items-center gap-1"
                                >
                                  {copiedField === `note-${ord.orderId}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                  <span>Sao chép</span>
                                </button>
                              </div>

                            </div>

                          </div>

                          {/* Nút xác nhận tôi đã chuyển khoản */}
                          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-200">
                            <span className="text-xs text-zinc-600 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                              <span>Hệ thống tự động duyệt thanh toán sau 30 giây khi nhận được tiền.</span>
                            </span>

                            <button
                              type="button"
                              onClick={() => handleMarkAsPaid(ord.orderId)}
                              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Tôi Đã Chuyển Khoản Thành Công</span>
                            </button>
                          </div>

                        </div>
                      )}
                    </div>

                    {/* 4. DANH SÁCH MÓN TRONG ĐƠN HÀNG */}
                    <div className="space-y-1.5 text-xs text-zinc-700 bg-stone-50 p-3.5 rounded-2xl border border-zinc-200">
                      <div className="font-extrabold text-zinc-900 text-xs uppercase mb-1">
                        Chi Tiết Các Món Trong Đơn ({ord.items.length})
                      </div>
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center py-0.5">
                          <div className="flex items-center gap-2 truncate pr-2">
                            <span className="font-bold font-mono text-zinc-950">
                              {it.quantity}x
                            </span>
                            <span className="truncate">{it.item.name}</span>
                            {it.recipe && (
                              <span className="text-[10px] text-red-600 font-semibold bg-red-50 px-1 rounded">
                                {it.recipe === 'crispy_spicy' ? 'Giòn Cay' : it.recipe === 'cheese' ? 'Phô Mai' : 'Truyền Thống'}
                              </span>
                            )}
                          </div>
                          <span className="font-mono font-semibold text-zinc-900 shrink-0">
                            {it.totalPrice.toLocaleString('vi-VN')} ₫
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* 5. CÁC NÚT THAO TÁC */}
                    <div className="flex flex-wrap items-center justify-between pt-2 gap-2">
                      <div className="text-xs text-zinc-500">
                        Phương thức thanh toán:{' '}
                        <strong className="text-zinc-800 uppercase">
                          {ord.paymentMethod === 'vietqr' ? 'Chuyển khoản VietQR' : ord.paymentMethod === 'wallet' ? 'Ví KFC Pay' : ord.paymentMethod.toUpperCase()}
                        </strong>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onReorder(ord.items)}
                          className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 font-bold text-xs text-zinc-800 transition-colors flex items-center gap-1.5 border border-zinc-200"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Đặt Lại Đơn</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onTrackOrder(ord);
                            onClose();
                          }}
                          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-600/20 transition-all flex items-center gap-1.5"
                        >
                          <Bike className="w-3.5 h-3.5" />
                          <span>Kiểm Tra Khi Nào Giao Hàng</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-stone-50 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-600">
            <span>Cần trợ giúp giao hàng? Gọi hotline: <strong className="text-red-600 font-mono">1900 6886</strong></span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-extrabold text-xs shadow-md transition-colors"
            >
              Đóng
            </button>
          </div>

        </div>
      </div>

      {/* MODAL PHÓNG TO MÃ QR TPBANK */}
      {enlargedQRImage && (
        <div 
          onClick={() => setEnlargedQRImage(false)}
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl relative"
          >
            <button
              onClick={() => setEnlargedQRImage(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="font-extrabold text-base text-zinc-950">MÃ QR THANH TOÁN TPBANK</h3>
              <p className="text-xs text-red-600 font-mono font-bold">LE TRUONG MINH • 0376 4688 888</p>
              <p className="text-[11px] text-amber-700 mt-0.5">Mã hết hạn sau {timerString}</p>
            </div>

            <div className="border-4 border-red-600 p-2 rounded-2xl bg-white shadow-md inline-block">
              <img
                src="/assets/aistudio/1e40683a-d4e6-4f9c-931d-7b3ccb55b1da_7813f039.jfif"
                alt="Mã QR TPBank LE TRUONG MINH"
                className="w-64 h-auto mx-auto rounded-xl"
              />
            </div>

            <p className="text-xs text-zinc-500">
              Quét mã bằng camera hoặc ứng dụng ngân hàng để hoàn tất thanh toán
            </p>

            <button
              onClick={() => setEnlargedQRImage(false)}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 font-extrabold text-xs text-white"
            >
              Đóng Cửa Sổ Phóng To
            </button>
          </div>
        </div>
      )}
    </>
  );
};
