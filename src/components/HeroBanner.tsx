import React from 'react';
import { Sparkles, Flame, Clock, Award, ShieldCheck, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  onBuildBucket: () => void;
  onBrowseMenu: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onBuildBucket,
  onBrowseMenu,
}) => {
  return (
    <section className="relative overflow-hidden bg-white border-b border-zinc-200 py-12 md:py-20">
      {/* Background radial accent with warm fried chicken glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-red-100/60 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-100/50 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-extrabold uppercase tracking-widest shadow-2xs">
              <Flame className="w-4 h-4 text-red-600 animate-bounce" />
              <span>11 Secret Herbs & Spices • Pressure Fried Golden</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-display uppercase tracking-tight text-zinc-950 leading-[1.05]">
              CRISPY, JUICY, <br />
              <span className="text-red-600 underline decoration-amber-400 decoration-wavy decoration-4">
                FINGER LICKIN&apos;
              </span> <br />
              FRIED CHICKEN.
            </h1>

            {/* Subtitle */}
            <p className="text-zinc-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Hand-breaded in small batches with our legendary top-secret recipe. 
              Fried to golden, crackling crunch on the outside and tender, steaming juiciness inside. 
              Delivered piping hot to your table.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onBuildBucket}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-base shadow-xl shadow-red-600/30 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group border border-red-700"
              >
                <span>🍗 Build Your Custom Bucket</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onBrowseMenu}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-300 text-zinc-900 font-bold text-base transition-all flex items-center justify-center gap-2 shadow-2xs"
              >
                <span>Browse Full Menu</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-zinc-200 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900">30 Min Hot</div>
                  <div className="text-[11px] text-zinc-500">Guaranteed delivery</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900">100% Fresh</div>
                  <div className="text-[11px] text-zinc-500">Never frozen chicken</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900">Original 1939</div>
                  <div className="text-[11px] text-zinc-500">Authentic recipe</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Visual Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative frame with KFC red glow */}
              <div className="relative rounded-3xl overflow-hidden border-4 border-red-600 shadow-2xl shadow-red-600/20 group bg-zinc-950">
                <img
                  src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1000&q=80"
                  alt="KFC Fried Chicken Bucket Feast"
                  className="w-full h-[380px] sm:h-[440px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/20 to-transparent" />

                {/* Floating promo badge */}
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3.5 py-1.5 rounded-xl font-display tracking-wider text-sm shadow-lg flex items-center gap-1.5 border border-red-500">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>MOST ORDERED MEAL</span>
                </div>

                {/* Price tag pill */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-zinc-950 px-3 py-1.5 rounded-xl font-mono text-sm font-extrabold shadow-md border border-zinc-200">
                  <span className="text-red-600 text-xs font-sans uppercase font-bold mr-1">from</span>
                  $19.99
                </div>

                {/* Bottom caption overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-zinc-200 p-4 rounded-2xl shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-zinc-950 text-base">The 8-Pc Original Recipe Bucket</h4>
                      <p className="text-xs text-zinc-600">Drumsticks, Thighs & Breasts + 2 Large Sides</p>
                    </div>
                    <button
                      onClick={onBuildBucket}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold uppercase shrink-0 transition-colors shadow-md shadow-red-600/20"
                    >
                      Customize
                    </button>
                  </div>
                </div>

              </div>

              {/* Floating mini review card */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white border border-zinc-200 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <div className="text-xs font-extrabold text-zinc-900">4.9 / 5 Rating</div>
                  <div className="text-[10px] text-zinc-500">Over 50,000+ happy chicken lovers</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
