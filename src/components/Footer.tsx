import React from 'react';
import { Phone, MapPin, Clock, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 text-white border-t border-zinc-800">
      {/* Iconic KFC Stripe divider */}
      <div className="w-full h-3 kfc-stripes-horizontal" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-red-600 px-3.5 py-1.5 rounded-lg font-display text-2xl tracking-wider text-white border-2 border-red-500 shadow-md">
                KFC
              </div>
              <div>
                <span className="font-display tracking-wide text-xl text-white block">
                  FRIED CHICKEN EXPRESS
                </span>
                <span className="text-[10px] uppercase font-bold text-red-500 tracking-widest">
                  It&apos;s Finger Lickin&apos; Good®
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              Serving the world&apos;s crispiest hand-breaded fried chicken since 1939. 
              Our 11 herbs & spices recipe remains the most famous culinary secret in fast food history.
            </p>

            <div className="space-y-2 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500" />
                <span className="font-bold">Hotline Ordering: 1900 6886 or (800) 225-5532</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Delivery: 10:00 AM – 11:30 PM • Drive-thru 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Over 1,200+ Express Kitchens nationwide</span>
              </div>
            </div>
          </div>

          {/* Quick Menu */}
          <div className="space-y-3">
            <h4 className="font-display uppercase tracking-wider text-sm text-zinc-200">
              POPULAR MENU
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><a href="#menu-section" className="hover:text-red-400 transition-colors">Original Recipe Buckets</a></li>
              <li><a href="#menu-section" className="hover:text-red-400 transition-colors">Spicy Zinger Burgers</a></li>
              <li><a href="#menu-section" className="hover:text-red-400 transition-colors">Extra Crispy Tenders</a></li>
              <li><a href="#menu-section" className="hover:text-red-400 transition-colors">Nashville Hot Wings</a></li>
              <li><a href="#menu-section" className="hover:text-red-400 transition-colors">Mashed Potatoes & Gravy</a></li>
              <li><a href="#menu-section" className="hover:text-red-400 transition-colors">Buttermilk Biscuits</a></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="font-display uppercase tracking-wider text-sm text-zinc-200">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><a href="#deals-section" className="hover:text-red-400 transition-colors">Deals & Coupons</a></li>
              <li><span className="hover:text-red-400 cursor-pointer">Nutritional & Calorie Guide</span></li>
              <li><span className="hover:text-red-400 cursor-pointer">Allergen Information</span></li>
              <li><span className="hover:text-red-400 cursor-pointer">Find Nearest KFC Location</span></li>
              <li><span className="hover:text-red-400 cursor-pointer">Colonel&apos;s Club Rewards</span></li>
              <li><span className="hover:text-red-400 cursor-pointer">Order Tracking FAQ</span></li>
            </ul>
          </div>

          {/* App download */}
          <div className="space-y-3">
            <h4 className="font-display uppercase tracking-wider text-sm text-zinc-200">
              KFC FAST ORDER APP
            </h4>
            <p className="text-xs text-zinc-400">
              Download for 1-tap reordering and secret menu deals.
            </p>
            <div className="space-y-2">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 flex items-center gap-3 cursor-pointer hover:border-zinc-700 transition-colors">
                <span className="text-2xl">📱</span>
                <div>
                  <div className="text-[10px] text-zinc-400 leading-none">Download on the</div>
                  <div className="font-bold text-xs text-white">Apple App Store</div>
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 flex items-center gap-3 cursor-pointer hover:border-zinc-700 transition-colors">
                <span className="text-2xl">🤖</span>
                <div>
                  <div className="text-[10px] text-zinc-400 leading-none">Get it on</div>
                  <div className="font-bold text-xs text-white">Google Play</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© 2026 KFC Corporation. All Rights Reserved. The Colonel&apos;s secret recipe is a registered trademark.</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Delivery</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-red-500 font-bold">
              Fried with <Heart className="w-3.5 h-3.5 fill-red-500" />
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
