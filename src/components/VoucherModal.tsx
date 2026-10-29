import React, { useState } from 'react';
import { X, Tag, Sparkles, Copy, Check, Percent } from 'lucide-react';
import { FEATURED_DEALS } from '../data/kfcMenu';
import { DealPromo } from '../types/kfc';

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyVoucher: (deal: DealPromo) => void;
  activePromoCode: string | null;
}

export const VoucherModal: React.FC<VoucherModalProps> = ({
  isOpen,
  onClose,
  onApplyVoucher,
  activePromoCode,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white border border-zinc-200 rounded-3xl max-w-lg w-full text-zinc-900 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center font-display text-2xl shadow-md border-2 border-red-800">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display uppercase tracking-wide text-2xl">
                KHO VOUCHER & MÃ GIẢM GIÁ
              </h3>
              <p className="text-xs text-red-100 font-medium">
                Chọn mã ưu đãi để áp dụng ngay vào đơn hàng của bạn
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

        {/* Voucher List */}
        <div className="p-6 space-y-3.5 max-h-[70vh] overflow-y-auto">
          {FEATURED_DEALS.map((deal) => {
            const isApplied = activePromoCode === deal.code;
            return (
              <div
                key={deal.id}
                className="bg-stone-50 border border-zinc-200 rounded-2xl p-4 flex flex-col justify-between hover:border-red-500 transition-all shadow-2xs relative overflow-hidden group"
              >
                {/* Accent top stripe */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${deal.bannerColor}`} />

                <div className="space-y-1.5 mb-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-red-100 text-red-700">
                      {deal.badge}
                    </span>
                    <span className="text-xs font-mono font-bold text-zinc-600">
                      Đơn tối thiểu: {deal.minOrder?.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>

                  <h4 className="font-extrabold text-zinc-950 text-base">
                    {deal.title}
                  </h4>
                  <p className="text-xs text-zinc-600">
                    {deal.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 pt-3 border-t border-zinc-200">
                  <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-zinc-300 font-mono text-xs font-bold text-red-600">
                    <span>{deal.code}</span>
                    <button
                      onClick={() => handleCopy(deal.code)}
                      title="Sao chép mã"
                      className="text-zinc-400 hover:text-zinc-800 p-0.5"
                    >
                      {copiedCode === deal.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onApplyVoucher(deal);
                      onClose();
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                      isApplied
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20'
                    }`}
                  >
                    {isApplied ? '✓ Đang Áp Dụng' : 'Áp Dụng Vào Giỏ'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-500">
          <span>* Mỗi đơn hàng chỉ áp dụng 1 mã giảm giá cao nhất</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-200 font-bold text-zinc-800 hover:bg-zinc-300 transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
