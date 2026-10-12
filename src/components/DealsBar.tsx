import React, { useState } from 'react';
import { Sparkles, Copy, Check, Tag } from 'lucide-react';
import { FEATURED_DEALS } from '../data/kfcMenu';
import { DealPromo } from '../types/kfc';

interface DealsBarProps {
  onApplyDeal: (deal: DealPromo) => void;
  activePromoCode: string | null;
}

export const DealsBar: React.FC<DealsBarProps> = ({ onApplyDeal, activePromoCode }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section id="deals-section" className="bg-stone-50 border-b border-zinc-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/10 text-red-600 border border-red-200 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display uppercase tracking-wide text-lg text-zinc-950">
                TODAY&apos;S HOTTEST DEALS & COUPONS
              </h3>
              <p className="text-xs text-zinc-500">
                Tap &apos;Apply&apos; to instantly add promotional savings to your bucket bag
              </p>
            </div>
          </div>
          <div className="text-xs text-red-700 font-extrabold bg-red-50 border border-red-200 px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>Limited Time Offers</span>
          </div>
        </div>

        {/* Coupon Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {FEATURED_DEALS.map((deal) => {
            const isApplied = activePromoCode === deal.code;
            return (
              <div
                key={deal.id}
                className="bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col justify-between hover:border-red-500 hover:shadow-md transition-all relative overflow-hidden group shadow-2xs"
              >
                {/* Accent corner line */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${deal.bannerColor}`} />

                <div className="space-y-1.5 mb-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-800">
                      {deal.badge}
                    </span>
                    <span className="text-xs font-mono font-semibold text-zinc-500">
                      Min. ${deal.minOrder}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-zinc-950 text-sm sm:text-base tracking-tight">
                    {deal.title}
                  </h4>
                  <p className="text-xs text-zinc-600">
                    {deal.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-zinc-100">
                  <div className="flex items-center gap-1.5 bg-zinc-50 px-2.5 py-1.5 rounded-lg border border-zinc-200 font-mono text-xs font-bold text-red-600">
                    <span>{deal.code}</span>
                    <button
                      onClick={() => handleCopy(deal.code)}
                      title="Copy code"
                      className="text-zinc-400 hover:text-zinc-700 p-0.5"
                    >
                      {copiedCode === deal.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => onApplyDeal(deal)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                      isApplied
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-600/20'
                    }`}
                  >
                    {isApplied ? '✓ Applied' : 'Apply Coupon'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
