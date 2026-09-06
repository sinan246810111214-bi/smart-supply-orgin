import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  Mail,
  MessageCircle,
  Truck,
  RotateCcw,
  Star,
  ShieldCheck,
  Check,
  Gift,
  AlertCircle,
  TrendingUp,
  Clock,
  ArrowRight,
  MapPin,
  Sparkles,
  PhoneCall,
  Settings,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";

import { PRODUCTS, REVIEWS } from "./data";
import { Product, Review } from "./types";

import Header from "./components/Header";
import ProductFlipCard from "./components/ProductFlipCard";
import CODForm from "./components/CODForm";
import SuccessView from "./components/SuccessView";
import FAQSection from "./components/FAQSection";
import TrustBadges from "./components/TrustBadges";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [productsList, setProductsList] = useState<Product[]>(() => {
    const saved = localStorage.getItem("smart_supply_products");
    return saved ? JSON.parse(saved) : PRODUCTS;
  });

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [activeProduct, setActiveProduct] = useState<Product>(() => {
    const saved = localStorage.getItem("smart_supply_products");
    const parsed = saved ? JSON.parse(saved) : PRODUCTS;
    return parsed[0] || PRODUCTS[0];
  });

  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [justSelected, setJustSelected] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderedQty, setOrderedQty] = useState(1);
  const [orderedTotal, setOrderedTotal] = useState(0);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  // Countdown timer state
  const [minutes, setMinutes] = useState(14);
  const [seconds, setSeconds] = useState(52);

  // Pincode estimator state
  const [pincodeInput, setPincodeInput] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<"idle" | "loading" | "valid" | "invalid">("idle");
  const [estimatedDate, setEstimatedDate] = useState("");

  const formSectionRef = useRef<HTMLDivElement | null>(null);

  // Tick down the high-urgency flash-sale timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else {
        // Reset to keep the urgency loop going
        setMinutes(15);
        setSeconds(0);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [minutes, seconds]);

  // Persist products list
  useEffect(() => {
    localStorage.setItem("smart_supply_products", JSON.stringify(productsList));
  }, [productsList]);

  // Handle PIN-code check action
  const handlePincodeCheck = (val: string) => {
    const cleaned = val.replace(/\D/g, "");
    setPincodeInput(cleaned);

    if (cleaned.length === 6) {
      setPincodeStatus("loading");
      setTimeout(() => {
        // Simple logic: Indian pincodes starting with digits between 1-9 are valid
        const firstDigit = parseInt(cleaned[0]);
        if (firstDigit >= 1 && firstDigit <= 9) {
          setPincodeStatus("valid");
          // Add 3-4 days to today
          const deliveryDate = new Date();
          deliveryDate.setDate(deliveryDate.getDate() + 3 + (parseInt(cleaned[5]) % 3));
          const formatted = deliveryDate.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "short"
          });
          setEstimatedDate(formatted);
        } else {
          setPincodeStatus("invalid");
        }
      }, 500);
    } else {
      setPincodeStatus("idle");
    }
  };

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

    // Instantly persist into Admin Orders ledger
    try {
      const saved = localStorage.getItem("smart_supply_orders");
      const current = saved ? JSON.parse(saved) : [];
      const newOrder = {
        id: newOrderId,
        name: details.name || "Unknown Buyer",
        phone: details.phone || "No phone",
        address: details.address || "No address",
        pincode: details.pincode || "000000",
        productName: activeProduct.name,
        quantity: quantity,
        totalPrice: total,
        status: "Pending",
        timestamp: new Date().toLocaleString("en-IN")
      };
      const updated = [newOrder, ...current];
      localStorage.setItem("smart_supply_orders", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to append placed order into admin storage:", err);
    }

    // Synthesize a beautiful, clean ascending mobile success chime (C5 -> E5 -> G5 -> C6)
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
      console.warn("Web Audio chime could not play due to user gesture constraints", err);
    }
  };

  const resetOrderState = () => {
    setOrderSuccess(false);
    setOrderId("");
    setOrderedQty(1);
    setOrderedTotal(0);
    setOrderDetails(null);
  };

  const scrollToCheckout = () => {
    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      const container = document.getElementById("cod-checkout-container");
      if (container) {
        container.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Pre-fill WhatsApp message text for quick manual orders
  const getWhatsAppOrderUrl = (prod: Product) => {
    const text = encodeURIComponent(
      `Hello Smart Supply,\nI want to place an order for:\n📦 Product: ${prod.name}\n💵 COD Price: ₹${prod.discountedPrice}\nFree COD Shipping & 7 Days Replacement.\n\nPlease help me complete my order!`
    );
    return `https://wa.me/919946597203?text=${text}`;
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "ss2468") {
      setIsAdminAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Incorrect Admin Password. Access Denied.");
    }
  };

  if (isAdminMode) {
    if (!isAdminAuthenticated) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 select-none font-sans">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col p-8">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-gray-900 uppercase">Logistics Access Gate</h3>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1">Authorized personnel only</p>
              </div>
            </div>

            <form onSubmit={handleAdminLogin} className="mt-8 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Secret Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter admin password..."
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (passwordError) setPasswordError("");
                    }}
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                  <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
                  <p className="font-extrabold">{passwordError}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminMode(false);
                    setPasswordInput("");
                    setPasswordError("");
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-black py-3 rounded-xl transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-black py-3 rounded-xl transition-all shadow-md cursor-pointer text-center"
                >
                  Unlock Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    return (
      <AdminPanel
        onBackToShop={() => {
          setIsAdminMode(false);
          setIsAdminAuthenticated(false);
          setPasswordInput("");
        }}
        productsList={productsList}
        onProductsUpdate={setProductsList}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800 antialiased selection:bg-blue-500 selection:text-white">
      {/* Universal Sticky / Float Top Header */}
      <Header onAdminClick={() => setIsAdminMode(true)} />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 md:py-10 flex flex-col gap-10">
        {orderSuccess && orderDetails ? (
          <SuccessView
            orderId={orderId}
            quantity={orderedQty}
            totalPrice={orderedTotal}
            orderDetails={orderDetails}
            onReset={() => {
              resetOrderState();
              setCheckoutProduct(null);
            }}
          />
        ) : checkoutProduct ? (
          <div className="w-full flex flex-col gap-8 animate-fade-in">
            {/* Header / Breadcrumb navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-150 p-5 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCheckoutProduct(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer border border-gray-200"
                >
                  ← ORDER OTHER PRODUCTS
                </button>
                <div className="h-6 w-[1px] bg-gray-200 hidden sm:block" />
                <div>
                  <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest block font-sans">SECURE CHECKOUT</span>
                  <h2 className="text-gray-900 font-black text-lg tracking-tight leading-none mt-1">Cash on Delivery Order Page</h2>
                </div>
              </div>
              <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Verified Doorstep Payment (COD)</span>
              </div>
            </div>

            {/* Split Page: Left Product summary & Details, Right COD Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT: Product Summary & specs */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
                  <div className="flex items-start gap-4">
                    <img
                      src={checkoutProduct.imageUrl}
                      alt={checkoutProduct.name}
                      className="w-24 h-24 rounded-2xl object-cover border border-gray-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="bg-blue-50 text-blue-700 text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wide">
                        {checkoutProduct.tag}
                      </span>
                      <h3 className="text-gray-900 font-black text-base tracking-tight leading-snug mt-1.5">
                        {checkoutProduct.name}
                      </h3>
                      <p className="text-gray-500 text-xs mt-1 leading-relaxed font-semibold">
                        {checkoutProduct.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-2">Checkout Price Summary</span>
                    <div className="bg-gray-50/60 border border-gray-100 rounded-2xl p-4 flex flex-col gap-2 text-xs">
                      <div className="flex justify-between text-gray-500">
                        <span>Original Price:</span>
                        <span className="line-through">₹{checkoutProduct.originalPrice}</span>
                      </div>
                      <div className="flex justify-between text-rose-600 font-bold">
                        <span>Special Promo Discount:</span>
                        <span>- ₹{checkoutProduct.originalPrice - checkoutProduct.discountedPrice}</span>
                      </div>
                      <div className="flex justify-between text-blue-600 font-bold">
                        <span>Delivery Charges (100% Free):</span>
                        <span>₹0</span>
                      </div>
                      <div className="h-[1px] bg-gray-200/60 my-1" />
                      <div className="flex justify-between text-gray-900 font-black text-base">
                        <span>Total Payable at Doorstep:</span>
                        <span className="text-blue-600">₹{checkoutProduct.discountedPrice}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Product Features</span>
                    <ul className="flex flex-col gap-2 text-[11px] text-gray-600 font-medium">
                      {checkoutProduct.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-4 h-4 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold">
                            ✓
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Secure purchase assurances */}
                <div className="bg-amber-50/50 border border-amber-200/40 rounded-3xl p-5 flex items-start gap-3">
                  <Gift className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <h4 className="font-black text-amber-900">7-Day Replacement Policy Guarantee</h4>
                    <p className="text-amber-800 leading-relaxed mt-1 font-medium">
                      If you receive any damaged, broken, or defective piece, simply contact our WhatsApp support line and we will arrange a replacement at your doorstep within 48 hours for absolutely free!
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT: COD Form */}
              <div className="lg:col-span-6">
                <CODForm
                  product={checkoutProduct}
                  onOrderSuccess={handleOrderSuccess}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Store Introduction Heading */}
            <div className="w-full text-center flex flex-col items-center gap-2.5 mt-2">
              <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-blue-500" />
                3D Interactive Product Catalog
              </span>
              <h2 className="text-gray-950 font-black text-3xl md:text-4xl tracking-tight leading-tight max-w-2xl">
                Flip & Explore Our Premium Problem-Solving Gadgets
              </h2>
              <p className="text-gray-600 text-sm max-w-lg leading-relaxed font-bold">
                ഓർഡർ ചെയ്യാൻ താഴെയുള്ള <span className="text-blue-600">"ORDER NOW"</span> ബട്ടൺ ക്ലിക്ക് ചെയ്ത് വിലാസം നൽകുക. <br/>
                <span className="text-xs text-gray-400 font-semibold">(Click "ORDER NOW" below to fill out the contact form & place your order easily)</span>
              </p>
            </div>

            {/* Notification alert on card selection */}
            {justSelected && (
              <div className="w-full max-w-3xl mx-auto bg-blue-50 border-2 border-blue-500/20 text-blue-950 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md animate-pulse">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-sm shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="text-sm font-black">Selected for COD: {activeProduct.name}</p>
                    <p className="text-xs text-blue-700 font-bold">We loaded this product into your Cash on Delivery form below!</p>
                  </div>
                </div>
                <button 
                  onClick={() => scrollToCheckout()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer whitespace-nowrap"
                >
                  Go to Checkout Form ↓
                </button>
              </div>
            )}

            {/* 3D Flip Card Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-1">
              {productsList.map((prod) => (
                <ProductFlipCard
                  key={prod.id}
                  product={prod}
                  isSelected={activeProduct.id === prod.id}
                  onSelect={() => {
                    setActiveProduct(prod);
                    setCheckoutProduct(prod);
                  }}
                />
              ))}
            </div>

            {/* FAQs and Customer Reviews Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-12">
              {/* FAQ Block */}
              <FAQSection />

              {/* Reviews Testimonials Board */}
              <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-gray-900 font-black text-lg tracking-tight">Customer Testimonials</h3>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">What Indian Homemakers Say</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-gray-900">4.8</p>
                    <div className="flex text-amber-500 justify-end -mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  {REVIEWS.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-5 last:border-none last:pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center font-black text-xs">
                            {review.author[0]}
                          </div>
                          <div>
                            <p className="text-gray-950 font-extrabold text-sm flex items-center gap-1.5">
                              {review.author}
                              {review.verified && (
                                <span className="bg-blue-100 text-blue-800 text-[9px] font-black tracking-wide uppercase px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
                                  <Check className="w-2.5 h-2.5 stroke-[3px]" /> Verified
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-gray-400 font-bold">{review.location} • {review.date}</p>
                          </div>
                        </div>
                        <div className="flex text-amber-500">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-xs leading-relaxed mt-2.5 pl-10 font-medium">
                        "{review.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Global Store Trust Badges */}
        <div className="mt-6">
          <TrustBadges />
        </div>
      </main>

      {/* Trust & Details Footer */}
      <footer className="w-full bg-gray-900 text-gray-400 py-10 px-4 mt-16 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-800 pb-8">
            {/* Column 1 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center border border-gray-700">
                  <img
                    src="https://i.ibb.co/Y4V31vLX/Whats-App-Image-2026-08-22-at-10-27-32-AM.jpg"
                    alt="Smart Supply Logo"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-xl font-black text-white tracking-tight">
                  SMART<span className="text-blue-500">SUPPLY</span>
                </span>
              </div>
              <p className="text-xs leading-relaxed text-gray-400">
                Bringing the world's cleverest, time-saving kitchen accessories and gadgets to your home with zero prepaid risk. We deliver genuine quality products that make your life simpler.
              </p>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-3">
              <span className="text-white font-extrabold text-sm tracking-tight">Support Contacts</span>
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

            {/* Column 3 */}
            <div className="flex flex-col gap-3">
              <span className="text-white font-extrabold text-sm tracking-tight">100% Secure Checkout</span>
              <p className="text-xs leading-relaxed text-gray-400">
                You do not need to share debit cards, credit cards, or net-banking info. We support 100% safe Pay on Delivery. Pay only when you physically check the parcel!
              </p>
              <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 p-2.5 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-[10px] text-blue-400 font-bold leading-normal">
                  OFFICIAL SMART SUPPLY GENUINE BRAND GUARANTEE
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <p>© 2026 Smart Supply Kitchen Solvers. All Rights Reserved.</p>
              <button
                onClick={() => setIsAdminMode(true)}
                className="p-1.5 text-gray-600 hover:text-gray-400 rounded-lg hover:bg-gray-800/50 transition-colors focus:outline-none cursor-pointer"
                title="Logistics Panel"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex gap-4 font-bold text-gray-500">
              <span className="hover:text-gray-300 transition-colors cursor-pointer">Return Policy</span>
              <span>•</span>
              <span className="hover:text-gray-300 transition-colors cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-gray-300 transition-colors cursor-pointer">Privacy Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
