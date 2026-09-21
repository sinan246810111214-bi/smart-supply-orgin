import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Phone, 
  Mail, 
  Sparkles, 
  Clock, 
  Check, 
  Star, 
  ShieldCheck, 
  ArrowRight, 
  TrendingUp, 
  ShoppingBag, 
  ChevronRight, 
  Award,
  Maximize2
} from "lucide-react";
import { Product } from "../types";
import { subscribeToProducts, saveOrderToFirestore } from "../lib/firebase";
import { PRODUCTS, REVIEWS } from "../data";
import CODForm from "./CODForm";
import SuccessView from "./SuccessView";
import TrustBadges from "./TrustBadges";

interface AdsCatalogProps {
  productsList?: Product[];
}

export default function AdsCatalog({ productsList: initialProductsList }: AdsCatalogProps) {
  const navigate = useNavigate();
  const [productsList, setProductsList] = useState<Product[]>(initialProductsList || []);
  const [activeTabProduct, setActiveTabProduct] = useState<Product | null>(null);
  
  // Success states
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderedQty, setOrderedQty] = useState(1);
  const [orderedTotal, setOrderedTotal] = useState(0);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  // Sale countdown timer
  const [minutes, setMinutes] = useState(12);
  const [seconds, setSeconds] = useState(45);

  const checkoutFormRef = useRef<HTMLDivElement | null>(null);

  // Subscriptions for real-time sync
  useEffect(() => {
    const unsubscribe = subscribeToProducts((dbProducts) => {
      if (dbProducts && dbProducts.length > 0) {
        setProductsList(dbProducts);
      } else {
        setProductsList(PRODUCTS);
      }
    });
    return () => unsubscribe();
  }, []);

  // Filter products for Ads Catalog
  const adsProducts = productsList.filter((p) => p.isAdsCatalog === true);
  
  // Dynamic fallback so the page never looks empty
  const activeProducts = adsProducts.length > 0 ? adsProducts : productsList.slice(0, 3);

  // Auto-set the active checkout target product on mount or when product list changes
  useEffect(() => {
    if (activeProducts.length > 0 && !activeTabProduct) {
      setActiveTabProduct(activeProducts[0]);
    } else if (activeProducts.length > 0 && activeTabProduct) {
      // Keep it synced if the active product itself updates in the DB
      const currentFresh = activeProducts.find(p => p.id === activeTabProduct.id);
      if (currentFresh) {
        setActiveTabProduct(currentFresh);
      }
    }
  }, [activeProducts, activeTabProduct]);

  // Urgency Timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else {
        setMinutes(15);
        setSeconds(0);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [minutes, seconds]);

  const handleOrderSuccess = (
    newOrderId: string,
    quantity: number,
    total: number,
    details: any
  ) => {
    setOrderId(newOrderId);
    setOrderedQty(quantity);
    setOrderedTotal(total);
    setOrderDetails(details);
    setOrderSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Try to play success audio chime (C5 -> E5 -> G5 -> C6)
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, index) => {
          const startTime = ctx.currentTime + index * 0.08;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.12, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.4);
        });
      }
    } catch (err) {
      console.warn("Audio Context success chime blocked or unavailable", err);
    }
  };

  const handleResetOrder = () => {
    setOrderSuccess(false);
    setOrderId("");
    setOrderedQty(1);
    setOrderedTotal(0);
    setOrderDetails(null);
  };

  const scrollToCheckout = (prod: Product) => {
    setActiveTabProduct(prod);
    setTimeout(() => {
      if (checkoutFormRef.current) {
        checkoutFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        const elem = document.getElementById("ads-checkout-panel");
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800 antialiased relative">
      {/* Upper Mini-Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white text-[11px] font-black tracking-wider uppercase text-center py-2.5 px-4 select-none flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>📢 ADS CATALOG EXCLUSIVE: FREE HOME DELIVERY + PAY CASH ON DELIVERY (വിലക്കുറവിൽ വീട്ടിലെത്തിച്ചു പണം വാങ്ങുന്നു)</span>
      </div>

      {/* Main Container */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 md:py-10 flex flex-col gap-8 animate-fade-in">
        {orderSuccess && orderDetails && activeTabProduct ? (
          <SuccessView
            orderId={orderId}
            quantity={orderedQty}
            totalPrice={orderedTotal}
            orderDetails={orderDetails}
            onReset={() => {
              handleResetOrder();
              navigate("/");
            }}
          />
        ) : (
          <>
            {/* Header / Brand Announcement */}
            <div className="w-full bg-white border border-gray-150 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden select-none">
              <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-blue-500/5 skew-x-12 pointer-events-none" />
              <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
                <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-md animate-pulse">
                  🛍️
                </div>
                <div>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold tracking-widest px-2.5 py-0.5 rounded-full uppercase">HOT OFFERS</span>
                  <h1 className="font-black text-2xl md:text-3xl tracking-tight leading-tight text-gray-950 mt-1">
                    Hovozon Ads Catalog
                  </h1>
                  <p className="text-gray-500 text-xs font-bold mt-1">
                    Curated selection of our highest-rated, time-saving lifestyle & kitchen gadgets.
                  </p>
                </div>
              </div>

              {/* Urgency countdown box */}
              <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 px-5 py-3 rounded-2xl shadow-inner">
                <Clock className="w-4.5 h-4.5 text-rose-600 animate-spin" />
                <div className="text-left">
                  <p className="text-[10px] text-rose-500 font-black uppercase tracking-wider">LIMITED ADS OFFER</p>
                  <p className="text-xs font-bold text-gray-700">Ends In: <span className="font-mono font-black text-rose-600 text-sm bg-rose-100/50 px-1.5 py-0.5 rounded ml-1">{minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}</span></p>
                </div>
              </div>
            </div>

            {/* Subscriptions Fallback Label */}
            {adsProducts.length === 0 && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold p-3.5 rounded-2xl text-center leading-relaxed">
                👉 <span className="font-black">Admin Notice:</span> No products are flagged for the "Ads Catalog" in the system ledger yet. Showing our default best-sellers below. Toggle products in the Admin Panel to update this page dynamically!
              </div>
            )}

            {/* Dynamic Grid of Showcase Products */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
              {activeProducts.map((prod) => (
                <div 
                  key={prod.id} 
                  className={`bg-white border transition-all duration-300 rounded-3xl shadow-sm p-5 md:p-8 flex flex-col lg:flex-row gap-8 relative overflow-hidden ${
                    activeTabProduct?.id === prod.id ? "border-blue-500 ring-4 ring-blue-500/5" : "border-gray-150 hover:border-gray-300"
                  }`}
                >
                  {/* Promo Badge */}
                  <div className="absolute top-0 right-0 bg-rose-600 text-white font-black text-[9px] tracking-widest uppercase px-4 py-1.5 rounded-bl-2xl">
                    🔥 {prod.tag || "50% OFF"}
                  </div>

                  {/* Left Column: Visual Product Frame */}
                  <div className="w-full lg:w-[40%] flex flex-col gap-4">
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group">
                      <img 
                        src={prod.imageUrl} 
                        alt={prod.name} 
                        className="w-full h-full object-cover block"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Simple Micro Gallery if multiple images are present */}
                    {prod.gallery && prod.gallery.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {prod.gallery.slice(0, 4).map((img, i) => (
                          <div key={i} className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white">
                            <img src={img} alt="Gallery thumbnail" className="w-full h-full object-cover block" referrerPolicy="no-referrer" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Descriptions & Dynamic CTA */}
                  <div className="flex-1 flex flex-col justify-between gap-4">
                    <div className="flex flex-col gap-3">
                      {/* Rating details */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          ))}
                        </div>
                        <span className="text-[11px] text-gray-500 font-extrabold">{prod.rating || 4.8} ({prod.reviewCount || 340} Reviews)</span>
                        <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-0.5">
                          ✔ 100% Genuine
                        </span>
                      </div>

                      {/* Product Name & Tagline */}
                      <h2 className="text-xl md:text-2xl font-black text-gray-950 tracking-tight leading-tight">
                        {prod.name}
                      </h2>
                      <p className="text-blue-600 text-xs md:text-sm font-black leading-snug">
                        ✨ {prod.tagline}
                      </p>

                      {/* Description */}
                      <p className="text-gray-600 text-xs leading-relaxed font-semibold">
                        {prod.description}
                      </p>

                      {/* Key Features Bullet checklist */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gray-50/50 border border-gray-150 p-4 rounded-2xl mt-1">
                        {prod.features && prod.features.slice(0, 4).map((feat, index) => (
                          <div key={index} className="flex items-start gap-2 text-[11px] font-extrabold text-gray-700">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>

                      {/* Specifications Preview */}
                      {prod.specs && Object.keys(prod.specs).length > 0 && (
                        <div className="text-[10px] text-gray-400 font-bold flex flex-wrap gap-x-4 gap-y-1 mt-1 border-t border-gray-100 pt-3">
                          {Object.entries(prod.specs).slice(0, 3).map(([key, val]) => (
                            <span key={key}>🏷️ <strong className="text-gray-500">{key}:</strong> {val}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom row: pricing and action button */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-4 border-t border-gray-100 pt-4">
                      {/* Price Section */}
                      <div className="flex items-baseline gap-3">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-extrabold leading-none uppercase">OFFER PRICE</span>
                          <span className="text-2xl md:text-3xl font-black text-blue-600 leading-none mt-1">₹{prod.discountedPrice}</span>
                        </div>
                        <span className="text-xs text-gray-400 line-through font-extrabold">MRP ₹{prod.originalPrice}</span>
                        <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-2 py-0.5 rounded-lg">
                          Save {prod.discountPercent}% OFF
                        </span>
                      </div>

                      {/* CTA Pulse Action Button */}
                      <button
                        type="button"
                        onClick={() => scrollToCheckout(prod)}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-black px-6 py-4.5 rounded-2xl shadow-xl shadow-rose-200 hover:shadow-rose-300 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 text-xs uppercase animate-pulse shrink-0 tracking-wide"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>ക്ലിക്ക് ചെയ്ത് ഓർഡർ ചെയ്യുക (Order Now)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Checkout Section (Single-Focus Container) */}
            {activeTabProduct && (
              <div 
                id="ads-checkout-panel"
                ref={checkoutFormRef} 
                className="bg-white border border-gray-200 rounded-3xl p-5 md:p-8 shadow-md flex flex-col gap-6 scroll-mt-6 animate-fade-in"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center font-black text-lg">
                      📝
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-black text-lg tracking-tight">വിലാസം നൽകുക (Checkout Address Form)</h3>
                      <p className="text-xs text-gray-400 font-bold">Please fill in your exact delivery address details below.</p>
                    </div>
                  </div>
                  
                  {/* Selected Product info card in form header */}
                  <div className="bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl flex items-center gap-3 self-start md:self-auto max-w-full">
                    <img src={activeTabProduct.imageUrl} alt="selected" className="w-8 h-8 object-cover rounded-lg border border-gray-200" referrerPolicy="no-referrer" />
                    <div className="truncate">
                      <p className="text-[10px] text-gray-400 font-black leading-none">ORDERING TARGET</p>
                      <p className="text-xs font-black text-gray-900 mt-0.5 truncate max-w-[160px]">{activeTabProduct.name}</p>
                    </div>
                  </div>
                </div>

                {/* Actual checkout form reuse */}
                <CODForm 
                  product={activeTabProduct} 
                  onOrderSuccess={handleOrderSuccess} 
                />
              </div>
            )}

            {/* Support info & trust section */}
            <div className="mt-4">
              <TrustBadges />
            </div>
            
            {/* Elegant reviews testimonals on campaign */}
            <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
              <div className="border-b border-gray-100 pb-3 text-center md:text-left">
                <h3 className="text-gray-950 font-black text-lg tracking-tight">Verified Customer Feedback</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">What our active online ad buyers say</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {REVIEWS.slice(0, 2).map((rev) => (
                  <div key={rev.id} className="bg-gray-50/50 border border-gray-150 p-5 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-black text-xs">
                          {rev.author[0]}
                        </div>
                        <div>
                          <p className="text-gray-950 font-extrabold text-xs">{rev.author}</p>
                          <p className="text-[9px] text-gray-400 font-bold">{rev.location} • {rev.date}</p>
                        </div>
                      </div>
                      <div className="flex text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-[11px] leading-relaxed mt-3 font-medium">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Trust & Details Footer */}
      <footer className="w-full bg-gray-900 text-gray-400 py-10 px-4 mt-16 border-t border-gray-800">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-800 pb-8">
            {/* Column 1 */}
            <div className="flex flex-col gap-3">
              <span className="text-white font-extrabold text-sm tracking-tight">Hovozon Brand Guarantee</span>
              <p className="text-xs leading-relaxed text-gray-400">
                Bringing the world's cleverest, time-saving kitchen accessories and gadgets to your home with zero prepaid risk. We deliver genuine quality products that make your life simpler. Pay only when you physically check the parcel!
              </p>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-3">
              <span className="text-white font-extrabold text-sm tracking-tight">Quick Support Contacts</span>
              <div className="flex flex-col gap-2 text-xs">
                <a href="tel:+919946597203" className="hover:text-white flex items-center gap-2 transition-colors">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <span>+91 9946597203 (Helpline)</span>
                </a>
                <a href="tel:+919539364862" className="hover:text-white flex items-center gap-2 transition-colors">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <span>+91 95393 64862 (Alternate)</span>
                </a>
                <a href="mailto:smartsupply36@gmail.com" className="hover:text-white flex items-center gap-2 transition-colors">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span>smartsupply36@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>© 2026 Hovozon Kitchen Solvers. All Rights Reserved.</p>
            <div className="flex gap-4 font-bold text-gray-500">
              <span onClick={() => navigate("/")} className="hover:text-gray-300 transition-colors cursor-pointer">Main Shop</span>
              <span>•</span>
              <span className="hover:text-gray-300 transition-colors cursor-pointer">Terms & Conditions</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
