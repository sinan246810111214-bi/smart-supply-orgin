import { useState } from "react";
import { Star, Check, HelpCircle, RefreshCw, MessageCircle, ArrowRight } from "lucide-react";
import { Product } from "../types";

interface ProductFlipCardProps {
  key?: string;
  product: Product;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ProductFlipCard({ product, isSelected, onSelect }: ProductFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Pre-fill WhatsApp message text for quick manual orders
  const getWhatsAppOrderUrl = (prod: Product) => {
    const text = encodeURIComponent(
      `Hello Smart Supply,\nI want to place an order for:\n📦 Product: ${prod.name}\n💵 COD Price: ₹${prod.discountedPrice}\nFree COD Shipping & 7 Days Replacement.\n\nPlease help me complete my order!`
    );
    return `https://wa.me/919946597203?text=${text}`;
  };

  return (
    <div className="perspective-1000 w-full h-[520px] cursor-default group" id={`product-card-${product.id}`}>
      {/* Outer Rotator */}
      <div
        className={`relative w-full h-full duration-700 transform-style-3d transition-transform ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* FRONT SIDE */}
        <div
          onClick={onSelect}
          className={`absolute inset-0 w-full h-full bg-white border rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between backface-hidden cursor-pointer ${
            isSelected ? "border-emerald-500 ring-2 ring-emerald-500/10" : "border-gray-150"
          }`}
        >
          {/* Top image + tags */}
          <div className="flex flex-col gap-3.5">
            <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              {/* Floating Badge */}
              <div className="absolute top-3 left-3 z-10 bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider shadow-md">
                {product.tag}
              </div>

              {/* Free Shipping Badge */}
              <div className="absolute top-3 right-3 z-10 bg-amber-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider shadow-md">
                Free Shipping
              </div>

              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Title & Reviews */}
            <div>
              <div className="flex items-center gap-1.5 mb-1 text-amber-500">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="text-[11px] text-gray-500 font-extrabold">
                  {product.rating} ({product.reviewCount}+ ratings)
                </span>
              </div>
              <h3 className="text-gray-900 font-black text-base tracking-tight leading-snug line-clamp-1">
                {product.name}
              </h3>
              <p className="text-emerald-700 text-xs font-bold leading-normal mt-0.5 line-clamp-1">
                {product.tagline}
              </p>
            </div>
          </div>

          {/* Pricing & Footer Actions */}
          <div className="flex flex-col gap-3">
            {/* Pricing Section */}
            <div className="bg-gray-50/60 border border-gray-100 rounded-2xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Special COD Price</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl font-black text-emerald-600">₹{product.discountedPrice}</span>
                  <span className="text-gray-400 line-through text-xs font-semibold">₹{product.originalPrice}</span>
                </div>
              </div>
              <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-2 py-1 rounded-md uppercase">
                Save {product.discountPercent}%
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                className={`w-full font-black py-3 px-4 rounded-xl shadow-sm text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100"
                    : "bg-gray-900 hover:bg-gray-800 text-white"
                }`}
              >
                <span>⚡ ORDER NOW</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(true);
                  }}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold py-2.5 px-3 rounded-xl text-[11px] transition-colors flex items-center justify-center gap-1.5 border border-emerald-100 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin-slow text-emerald-600" />
                  <span>View Specs</span>
                </button>

                <a
                  href={getWhatsAppOrderUrl(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-2.5 px-3 rounded-xl text-[11px] transition-all flex items-center justify-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div
          className={`absolute inset-0 w-full h-full bg-white border rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between backface-hidden rotate-y-180 ${
            isSelected ? "border-emerald-500 ring-2 ring-emerald-500/10" : "border-gray-150"
          }`}
        >
          {/* Back title & Features */}
          <div className="flex flex-col gap-3 overflow-y-auto pr-1 scrollbar-thin">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div>
                <h4 className="text-gray-900 font-black text-sm tracking-tight">Key Features</h4>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Premium Problem Solver</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-7 h-7 rounded-full flex items-center justify-center transition-colors text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Features Checklist */}
            <ul className="flex flex-col gap-2 text-[11px]">
              {product.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-1.5 leading-tight font-medium text-gray-700">
                  <div className="w-4 h-4 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3.5px]" />
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-100 pt-2 mt-1">
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Technical Specs</span>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[10px]">
                {Object.entries(product.specs).slice(0, 4).map(([k, v]) => (
                  <div key={k} className="flex flex-col border-b border-gray-50 pb-1">
                    <span className="text-gray-400 font-bold uppercase text-[8px]">{k}</span>
                    <span className="text-gray-800 font-extrabold truncate mt-0.5">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Squeeze back card buttons */}
          <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-100 cursor-pointer"
            >
              <span>⚡ ORDER NOW</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold py-2 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Flip Back to Photo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
