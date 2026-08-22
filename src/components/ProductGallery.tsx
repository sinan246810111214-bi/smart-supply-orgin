import { useState } from "react";
import { Play, X, Check, ArrowRight, Shield } from "lucide-react";
import { Product } from "../types";

interface ProductGalleryProps {
  product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Custom simulation steps for our demo modal based on product
  const getDemoSteps = (prodId: string) => {
    switch (prodId) {
      case "chopper-12in1":
        return [
          {
            title: "Step 1: Choose Blade",
            desc: "Pick from 8 heavy-duty blades (dice, grate, slice, wavy or fine) and snap it easily into the lid.",
            gifPlaceholder: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=500&auto=format&fit=crop"
          },
          {
            title: "Step 2: Press Handle Down",
            desc: "Place onion, tomato, or potato on the cutting platform and close the lid firmly. No slipping!",
            gifPlaceholder: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop"
          },
          {
            title: "Step 3: Instant Rinsing & Cleaning",
            desc: "The catch container keeps your kitchen platform perfectly dry. Press the comb button to rinse the grid clean under water.",
            gifPlaceholder: "https://images.unsplash.com/photo-1595855759920-86582396756a?w=500&auto=format&fit=crop"
          }
        ];
      case "water-pump":
        return [
          {
            title: "Step 1: Attach Silicone Hose",
            desc: "Insert the 304 stainless steel faucet spout and connect the food-grade silicone tube to the base.",
            gifPlaceholder: "https://images.unsplash.com/photo-1562016600-ece13e8ba570?w=500&auto=format&fit=crop"
          },
          {
            title: "Step 2: Mount on Can Neck",
            desc: "Simply push the pump over the top of any standard 20L / 15L water bottle neck. No screwing needed.",
            gifPlaceholder: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500&auto=format&fit=crop"
          },
          {
            title: "Step 3: Tap to Dispense",
            desc: "Press the metal button on top to dispense water instantly. Tap again to stop anytime. Automatic shutoff after 60s.",
            gifPlaceholder: "https://images.unsplash.com/photo-1548839130-3bfac27b43ae?w=500&auto=format&fit=crop"
          }
        ];
      default:
        return [
          {
            title: "Step 1: Swan Neck Hooking",
            desc: "Hook the triangular swan-neck basket directly onto your sink divider or faucet. Ready in 1 second.",
            gifPlaceholder: "https://images.unsplash.com/photo-1585421514738-ee18559bf85b?w=500&auto=format&fit=crop"
          },
          {
            title: "Step 2: Wash & Drain Fast",
            desc: "Dump fresh grapes, berries, or cut vegetables. The hollow grid lets dirty water exit immediately.",
            gifPlaceholder: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&auto=format&fit=crop"
          },
          {
            title: "Step 3: Organize Clean Tools",
            desc: "Use it as a sturdy holster to store wet dish scrubs, sponges, and kitchen soap to dry naturally without mold.",
            gifPlaceholder: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop"
          }
        ];
    }
  };

  const steps = getDemoSteps(product.id);
  const [modalStep, setModalStep] = useState(0);

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Main Image Frame */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group">
        {/* Floating Best Seller/Trending Badge */}
        <div className="absolute top-4 left-4 z-10 bg-amber-500 text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider shadow-md">
          {product.tag}
        </div>

        <img
          src={product.gallery[activeIndex] || product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />

        {/* Video / GIF Demo Trigger Badge */}
        <button
          onClick={() => {
            setModalStep(0);
            setShowDemoModal(true);
          }}
          className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 bg-gray-900/90 hover:bg-emerald-600 text-white py-2.5 px-4 rounded-xl flex items-center justify-center gap-2.5 backdrop-blur-sm text-xs font-bold transition-all shadow-lg active:scale-95 group-hover:-translate-y-1"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <Play className="w-3.5 h-3.5 fill-white text-white" />
          <span>📽️ SEE HOW IT WORKS (GIF DEMO)</span>
        </button>
      </div>

      {/* Thumbnail Bar */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-200">
        {product.gallery.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`relative flex-shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden border-2 transition-all ${
              activeIndex === idx
                ? "border-emerald-600 shadow-md ring-2 ring-emerald-100"
                : "border-gray-150 hover:border-gray-400"
            }`}
          >
            <img
              src={img}
              alt={`${product.name} thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
        ))}
      </div>

      {/* Interactive Demonstration Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 fill-white" />
                <div>
                  <h3 className="font-extrabold text-base">Interactive Product Guide</h3>
                  <p className="text-[10px] text-emerald-100 font-medium">Smart & Easy Kitchen Solutions</p>
                </div>
              </div>
              <button
                onClick={() => setShowDemoModal(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content - Current Step Info */}
            <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-5">
              <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-150 shadow-inner relative">
                <img
                  src={steps[modalStep].gifPlaceholder}
                  alt={steps[modalStep].title}
                  className="w-full h-full object-cover transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-3 left-3 bg-gray-950/80 text-white text-[10px] px-2.5 py-1 rounded-md font-bold tracking-wider">
                  DEMO STEP {modalStep + 1} OF 3
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <h4 className="text-gray-900 font-extrabold text-lg flex items-center gap-2">
                  <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {modalStep + 1}
                  </span>
                  {steps[modalStep].title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {steps[modalStep].desc}
                </p>
              </div>

              {/* Steps Progress Visualizer */}
              <div className="flex items-center gap-2 pt-2">
                {steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setModalStep(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      modalStep === idx ? "w-10 bg-emerald-600" : "w-2 bg-gray-200 hover:bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Modal Action Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              {modalStep > 0 ? (
                <button
                  onClick={() => setModalStep((prev) => prev - 1)}
                  className="text-gray-600 text-xs font-bold hover:text-gray-800 py-2 px-3"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {modalStep < 2 ? (
                <button
                  onClick={() => setModalStep((prev) => prev + 1)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <span>Next Feature</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Got It, Thanks!</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
