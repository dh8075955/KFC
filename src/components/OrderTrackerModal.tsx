import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Clock, MapPin, Phone, ChefHat, Bike, PackageCheck, Flame } from 'lucide-react';
import { OrderDetails } from '../types/kfc';

interface OrderTrackerModalProps {
  order: OrderDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onNewOrder: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  order,
  isOpen,
  onClose,
  onNewOrder,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(2); // 1: received, 2: cooking, 3: delivering, 4: delivered
  const [secondsRemaining, setSecondsRemaining] = useState<number>(1740); // 29 mins

  useEffect(() => {
    if (!isOpen) return;

    // Simulate order progress advancing
    const stepTimer = setTimeout(() => {
      setCurrentStep(3); // Driver on the way
    }, 6000);

    const countdownInterval = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearTimeout(stepTimer);
      clearInterval(countdownInterval);
    };
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  const steps = [
    {
      id: 1,
      title: 'Order Confirmed',
      desc: 'Ticket printed at Kentucky Fryer Station',
      icon: CheckCircle2,
    },
    {
      id: 2,
      title: 'Pressure Frying Golden',
      desc: 'Hand-breaded in 11 secret herbs & spices',
      icon: ChefHat,
    },
    {
      id: 3,
      title: 'Driver Out For Delivery',
      desc: 'Hot thermal bag in transit to your door',
      icon: Bike,
    },
    {
      id: 4,
      title: 'Arrived Hot & Fresh',
      desc: 'Enjoy your finger lickin’ good feast!',
      icon: PackageCheck,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white border border-zinc-200 rounded-3xl max-w-xl w-full text-zinc-900 shadow-2xl overflow-hidden my-6">
        
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center font-display text-2xl shadow-md border-2 border-red-800">
              🍗
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded bg-black/25 text-white">
                  Order #{order.orderId}
                </span>
                <span className="text-xs font-mono text-red-100 font-semibold">
                  Placed at {order.placedAt}
                </span>
              </div>
              <h3 className="font-display uppercase text-2xl tracking-wide text-white">
                LIVE ORDER TRACKER
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/20 hover:bg-black/35 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Estimated time display */}
          <div className="bg-stone-50 border border-zinc-200 p-5 rounded-2xl text-center space-y-2 relative overflow-hidden shadow-2xs">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600" />
            <div className="text-xs font-extrabold uppercase tracking-widest text-zinc-600 flex items-center justify-center gap-1.5">
              <Clock className="w-4 h-4 text-red-600 animate-spin" />
              <span>Estimated Hot Delivery Time</span>
            </div>
            <div className="text-4xl sm:text-5xl font-mono font-extrabold text-zinc-950 tracking-tight">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <p className="text-xs text-emerald-700 font-extrabold flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-600" />
              <span>Guaranteed hot & crispy or your next bucket is on us</span>
            </p>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-800">
              Kitchen & Delivery Progress
            </h4>
            <div className="space-y-3 relative pl-6 border-l-2 border-zinc-200 ml-3">
              {steps.map((st) => {
                const isPassed = currentStep >= st.id;
                const isCurrent = currentStep === st.id;
                const Icon = st.icon;

                return (
                  <div key={st.id} className="relative group">
                    {/* Step Icon circle */}
                    <div
                      className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 ring-4 ring-red-100 scale-110'
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
                          className={`font-extrabold text-sm ${
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
                          <span className="text-[10px] uppercase font-mono font-extrabold px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200 animate-pulse">
                            In Progress
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
          <div className="bg-stone-50 border border-zinc-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-display text-xl border border-red-200">
                🛵
              </div>
              <div>
                <div className="text-xs text-zinc-500 font-semibold">Assigned Fast Courier</div>
                <div className="font-extrabold text-zinc-950 text-sm">Nguyen Van Cuong</div>
                <div className="text-[11px] text-zinc-500">Honda Lead • Red Thermal Bag</div>
              </div>
            </div>

            <a
              href="tel:0912888999"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-xs font-extrabold text-emerald-800 border border-emerald-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>Call Courier</span>
            </a>
          </div>

          {/* Delivery Destination */}
          <div className="bg-stone-50 p-3.5 rounded-xl border border-zinc-200 flex items-start gap-2.5 text-xs text-zinc-700">
            <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-zinc-950">Delivering to: </span>
              {order.address} ({order.customerName})
            </div>
          </div>

          {/* Receipt Items Breakdown */}
          <div className="space-y-2 border-t border-zinc-200 pt-4 text-xs">
            <div className="font-extrabold text-zinc-800 uppercase tracking-wider">
              Ordered Items ({order.items.length})
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-zinc-600">
                  <span className="truncate pr-2">
                    {it.quantity}x {it.item.name}
                  </span>
                  <span className="font-mono text-zinc-900 font-bold shrink-0">
                    ${it.totalPrice.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-extrabold text-sm text-zinc-950 pt-2 border-t border-zinc-200">
              <span>Total Paid ({order.paymentMethod.toUpperCase()})</span>
              <span className="font-mono text-red-600 text-base font-extrabold">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 bg-stone-50 border-t border-zinc-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold text-xs transition-colors"
          >
            Keep Window Open
          </button>
          <button
            onClick={() => {
              onNewOrder();
              onClose();
            }}
            className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wide shadow-lg shadow-red-600/30 transition-colors border border-red-700"
          >
            Order More Chicken 🍗
          </button>
        </div>

      </div>
    </div>
  );
};
