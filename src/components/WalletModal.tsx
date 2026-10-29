import React, { useState, useEffect } from 'react';
import { X, Wallet, ArrowDownLeft, ShieldCheck, CheckCircle2, QrCode, CreditCard, Sparkles, Clock, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WalletTransaction } from '../types/kfc';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onTopUp: (amount: number, method: string) => void;
  transactions: WalletTransaction[];
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  balance,
  onTopUp,
  transactions,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(200000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<'vietqr' | 'momo' | 'zalopay' | 'atm'>('vietqr');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // 30-minute countdown timer (1800s)
  const [qrSecondsLeft, setQrSecondsLeft] = useState<number>(1800);

  useEffect(() => {
    if (!showQR) return;
    const timer = setInterval(() => {
      setQrSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [showQR]);

  if (!isOpen) return null;

  const presetAmounts = [
    { value: 50000, label: '50.000 ₫' },
    { value: 100000, label: '100.000 ₫' },
    { value: 200000, label: '200.000 ₫', popular: true },
    { value: 500000, label: '500.000 ₫', bonus: '+50.000 ₫' },
    { value: 1000000, label: '1.000.000 ₫', bonus: '+150.000 ₫' },
  ];

  const currentAmount = customAmount ? parseInt(customAmount, 10) || 0 : selectedAmount;
  const minutes = Math.floor(qrSecondsLeft / 60);
  const seconds = qrSecondsLeft % 60;
  const countdownText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleCopyText = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleStartTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAmount < 20000) return;

    if (selectedMethod === 'vietqr') {
      setShowQR(true);
      setQrSecondsLeft(1800);
    } else {
      processTopUp();
    }
  };

  const processTopUp = () => {
    setIsProcessing(true);
    setTimeout(() => {
      let finalAmount = currentAmount;
      if (currentAmount >= 1000000) finalAmount += 150000;
      else if (currentAmount >= 500000) finalAmount += 50000;

      onTopUp(finalAmount, selectedMethod.toUpperCase());
      setIsProcessing(false);
      setShowQR(false);

      confetti({
        particleCount: 110,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e4002b', '#10b981', '#f59e0b', '#ffffff'],
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white border border-zinc-200 rounded-3xl max-w-lg w-full text-zinc-900 shadow-2xl overflow-hidden my-6">
        
        {/* Header with KFC Red gradient */}
        <div className="p-6 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center font-display text-2xl shadow-md border-2 border-red-800">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display uppercase tracking-wide text-2xl">
                VÍ KFC PAY TIỆN LỢI
              </h3>
              <p className="text-xs text-red-100 font-medium">
                Nạp tiền 1 chạm, thanh toán nhanh & nhận ưu đãi độc quyền
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-red-600 via-red-700 to-zinc-950 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-extrabold tracking-widest text-red-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Số dư khả dụng
              </span>
              <span className="font-display text-lg tracking-wider text-amber-300">
                KFC VIP MEMBER
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-mono font-extrabold tracking-tight">
              {balance.toLocaleString('vi-VN')} ₫
            </div>

            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-red-100">
              <span>Thanh toán đơn hàng KFC 1-chạm</span>
              <span className="font-bold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Miễn phí giao dịch
              </span>
            </div>
          </div>

          {/* QR Scan Screen with TPBank image & 30-min countdown */}
          {showQR ? (
            <div className="bg-stone-50 border-2 border-red-500 rounded-2xl p-5 text-center space-y-4 shadow-sm animate-in zoom-in-95 duration-200">
              
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                <div className="flex items-center gap-2 text-sm font-extrabold text-zinc-900">
                  <QrCode className="w-5 h-5 text-red-600" />
                  <span>Quét Mã Chuyển Khoản Nạp Tiền</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-mono font-extrabold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                  <Clock className="w-3.5 h-3.5 animate-spin text-red-600" />
                  <span>Hết hạn: {countdownText}</span>
                </div>
              </div>

              {/* QR Image from User's Uploaded Asset */}
              <div className="bg-white p-3 rounded-2xl inline-block border-2 border-red-500 shadow-md max-w-[220px]">
                <img
                  src="/assets/aistudio/1e40683a-d4e6-4f9c-931d-7b3ccb55b1da_7813f039.jfif"
                  alt="Mã QR Nạp Tiền TPBank LE TRUONG MINH"
                  className="w-full h-auto rounded-xl object-contain mx-auto"
                />
              </div>

              {/* Thông tin tài khoản */}
              <div className="bg-white p-3.5 rounded-xl border border-zinc-200 text-xs text-left space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Ngân hàng:</span>
                  <span className="font-extrabold text-zinc-900">TPBank (Tiên Phong Bank)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Chủ tài khoản:</span>
                  <span className="font-extrabold text-red-600">LE TRUONG MINH</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Số tài khoản:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-extrabold text-zinc-950">0376 4688 888</span>
                    <button
                      onClick={() => handleCopyText('03764688888', 'stk-wallet')}
                      className="text-red-600 hover:text-red-700 p-0.5"
                    >
                      {copiedField === 'stk-wallet' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Số tiền nạp:</span>
                  <span className="font-mono font-extrabold text-red-600">
                    {currentAmount.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Nội dung chuyển khoản:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-zinc-900">NAP KFC {currentAmount / 1000}K</span>
                    <button
                      onClick={() => handleCopyText(`NAP KFC ${currentAmount / 1000}K`, 'note-wallet')}
                      className="text-red-600 hover:text-red-700 p-0.5"
                    >
                      {copiedField === 'note-wallet' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowQR(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-200 font-bold text-xs text-zinc-700"
                >
                  Quay lại
                </button>
                <button
                  type="button"
                  onClick={processTopUp}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-extrabold text-xs text-white shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isProcessing ? 'Đang xác nhận...' : 'Tôi Đã Chuyển Khoản'}</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleStartTopUp} className="space-y-5">
              
              {/* Chọn mệnh giá */}
              <div className="space-y-2.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-800">
                  1. Chọn Số Tiền Cần Nạp
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {presetAmounts.map((opt) => {
                    const isSelected = selectedAmount === opt.value && !customAmount;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(opt.value);
                          setCustomAmount('');
                        }}
                        className={`p-3 rounded-xl text-center border transition-all relative ${
                          isSelected
                            ? 'bg-red-50 border-red-500 shadow-sm'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300'
                        }`}
                      >
                        {opt.bonus && (
                          <span className="absolute -top-2 right-2 bg-red-600 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-full shadow-2xs">
                            {opt.bonus}
                          </span>
                        )}
                        <div className="font-extrabold text-sm text-zinc-950 font-mono">
                          {opt.label}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Nhập số tiền khác */}
                <div className="mt-2">
                  <input
                    type="number"
                    min="20000"
                    step="10000"
                    placeholder="Hoặc nhập số tiền khác (tối thiểu 20.000 ₫)..."
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(0);
                    }}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-red-600 focus:bg-white shadow-2xs font-mono"
                  />
                </div>
              </div>

              {/* Phương thức nạp tiền */}
              <div className="space-y-2.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-800">
                  2. Chọn Kênh Nạp Tiền
                </label>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  {[
                    { id: 'vietqr', name: 'VietQR TPBank', sub: 'Quét ảnh QR chuyển 24/7', icon: QrCode },
                    { id: 'momo', name: 'Ví MoMo', sub: 'Quét mã / 1 chạm', icon: Wallet },
                    { id: 'zalopay', name: 'Ví ZaloPay', sub: 'Tích hợp tài khoản Zalo', icon: Wallet },
                    { id: 'atm', name: 'Thẻ ATM / Visa / Master', sub: 'Cổng thanh toán bảo mật', icon: CreditCard },
                  ].map((m) => {
                    const isSelected = selectedMethod === m.id;
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMethod(m.id as any)}
                        className={`p-3 rounded-2xl text-left border transition-all ${
                          isSelected
                            ? 'bg-red-50 border-red-500 shadow-2xs'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-red-600' : 'text-zinc-500'}`} />
                          <span className="font-extrabold text-xs text-zinc-900">{m.name}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500">{m.sub}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Nút bấm Nạp Tiền */}
              <button
                type="submit"
                disabled={isProcessing || currentAmount < 20000}
                className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-base shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 border border-red-700"
              >
                <ArrowDownLeft className="w-5 h-5" />
                <span>Nạp {currentAmount.toLocaleString('vi-VN')} ₫ Vào Ví KFC</span>
              </button>

            </form>
          )}

          {/* Lịch sử giao dịch */}
          <div className="space-y-2 pt-4 border-t border-zinc-200">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-800">
              Lịch Sử Giao Dịch Gần Đây
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {transactions.length === 0 ? (
                <p className="text-xs text-zinc-400 italic">Chưa có giao dịch nào.</p>
              ) : (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs"
                  >
                    <div>
                      <div className="font-bold text-zinc-900">{tx.description}</div>
                      <div className="text-[10px] text-zinc-500">
                        {tx.createdAt} • {tx.method}
                      </div>
                    </div>
                    <span
                      className={`font-mono font-extrabold ${
                        tx.type === 'topup' ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {tx.type === 'topup' ? '+' : '-'}{tx.amount.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
