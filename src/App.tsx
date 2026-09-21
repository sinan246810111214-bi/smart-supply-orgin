import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useSearchParams } from "react-router-dom";
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
import AdsCatalog from "./components/AdsCatalog";

import {
  subscribeToProducts,
  saveProductToFirestore,
  saveOrderToFirestore
} from "./lib/firebase";

function ProductRouteWrapper({
  productsList,
  activeProduct,
  setActiveProduct,
  checkoutProduct,
  setCheckoutProduct,
  setLightboxImage,
  setLightboxTitle,
  pincodeInput,
  setPincodeInput,
  pincodeStatus,
  setPincodeStatus,
  handlePincodeCheck,
  estimatedDate,
  getWhatsAppOrderUrl,
  handleOrderSuccess,
  orderSuccess,
  orderId,
  orderedQty,
  orderedTotal,
  orderDetails,
  resetOrderState,
  formSectionRef,
  scrollToCheckout,
  setPromoToastMsg,
  setShowPromoToast
}: any) {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (productsList.length > 0 && id) {
      const matched = productsList.find((p) => p.id === id);
      if (matched) {
        setActiveProduct(matched);
        setCheckoutProduct(matched);

        if (id === "2-item-combo") {
          setPromoToastMsg(`🎉 Special URL Offer Activated: ${matched.name}!`);
          setShowPromoToast(true);
          const t = setTimeout(() => setShowPromoToast(false), 5000);
          return () => clearTimeout(t);
        }
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [id, productsList]);

  if (!checkoutProduct || checkoutProduct.id !== id) {
    return (
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 text-xs font-bold mt-4 animate-pulse">Loading Product Checkout Details...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 md:py-10 flex flex-col gap-10">
      <div className="w-full flex flex-col gap-8 animate-fade-in">
        {orderSuccess && orderDetails ? (
          <SuccessView
            orderId={orderId}
            quantity={orderedQty}
            totalPrice={orderedTotal}
            orderDetails={orderDetails}
            onReset={() => {
              resetOrderState();
              setCheckoutProduct(null);
              navigate("/");
            }}
          />
        ) : (
          <>
            {/* Header / Breadcrumb navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-150 p-5 rounded-3xl shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setCheckoutProduct(null);
                    navigate("/");
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-gray-200"
                >
                  ← Back to Home
                </button>
                <div className="h-6 w-[1px] bg-gray-200 hidden sm:block" />
                <button
                  onClick={scrollToCheckout}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-blue-100"
                >
                  ORDER NOW
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
                    <div 
                      onClick={() => {
                        setLightboxImage(checkoutProduct.imageUrl);
                        setLightboxTitle(checkoutProduct.name);
                      }}
                      className="relative w-24 h-24 rounded-2xl overflow-hidden border border-gray-150 shrink-0 cursor-zoom-in group/chkimg"
                      title="Click to view full screen (വലുതായി കാണാൻ ക്ലിക്ക് ചെയ്യുക)"
                    >
                      <img
                        src={checkoutProduct.imageUrl}
                        alt={checkoutProduct.name}
                        className="w-full h-full object-cover group-hover/chkimg:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/15 opacity-0 group-hover/chkimg:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[9px] text-white font-extrabold tracking-wider bg-black/50 px-1.5 py-0.5 rounded uppercase">🔎 ZOOM</span>
                      </div>
                    </div>
                    <div>
                      <span className="bg-blue-50 text-blue-700 text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wide">
                        {checkoutProduct.tag}
                      </span>
                      <h3 className="text-gray-900 font-black text-base tracking-tight leading-snug mt-1.5">
                        {checkoutProduct.name}
                      </h3>
                      <p className="text-xs text-blue-600 font-bold tracking-wide mt-1">
                        ₹{checkoutProduct.discountedPrice}{" "}
                        <span className="text-gray-400 line-through font-medium text-[11px] ml-1.5">
                          ₹{checkoutProduct.originalPrice}
                        </span>{" "}
                        <span className="text-emerald-600 font-extrabold ml-1.5 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                          Save {checkoutProduct.discountPercent}% OFF
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Product Description</h4>
                    <p className="text-gray-600 text-xs leading-relaxed font-semibold">
                      {checkoutProduct.description}
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Highlight Features</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-gray-700">
                      {checkoutProduct.features.map((feat: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Specifications Block */}
                <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
                    Product Technical Specifications
                  </h4>
                  <div className="flex flex-col gap-2.5">
                    {Object.entries(checkoutProduct.specs).map(([key, val]: any, index) => (
                      <div key={index} className="flex justify-between items-center text-xs py-1 border-b border-gray-50 last:border-none">
                        <span className="text-gray-400 font-extrabold uppercase tracking-wide text-[10px]">{key}</span>
                        <span className="text-gray-900 font-black text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: COD Checkout form */}
              <div id="cod-checkout-container" className="lg:col-span-6">
                <div ref={formSectionRef}>
                  <CODForm
                    product={checkoutProduct}
                    onOrderSuccess={handleOrderSuccess}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function AdminRouteWrapper({ productsList, setProductsList }: any) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "ss2468") {
      setIsAdminAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Incorrect Admin Password. Access Denied.");
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-12 md:py-20 flex items-center justify-center min-h-[55vh]">
        <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden flex flex-col p-8 animate-fade-in">
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
                  autoFocus
                  placeholder="Enter admin password..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-gray-50 hover:bg-gray-100/80 focus:bg-white border-2 border-gray-100 focus:border-blue-500 text-sm font-black py-3.5 px-4 rounded-xl transition-all outline-none text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {passwordError && (
              <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-pulse">
                <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
                <p className="font-extrabold">{passwordError}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  setPasswordInput("");
                  setPasswordError("");
                  navigate("/");
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
      </main>
    );
  }

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 md:py-10 flex flex-col gap-10">
      <AdminPanel
        onBackToShop={() => {
          setIsAdminAuthenticated(false);
          setPasswordInput("");
          navigate("/");
        }}
        productsList={productsList}
        onProductsUpdate={setProductsList}
      />
    </main>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const navigate = useNavigate();
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

  // Lightbox Image viewer states
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string>("");

  // Countdown timer state
  const [minutes, setMinutes] = useState(14);
  const [seconds, setSeconds] = useState(52);

  // Floating promotion toast states
  const [showPromoToast, setShowPromoToast] = useState(false);
  const [promoToastMsg, setPromoToastMsg] = useState("");

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

  // Sync products list in real-time with Firestore, fallback/seed if database is empty
  useEffect(() => {
    const unsubscribe = subscribeToProducts((products) => {
      if (products.length > 0) {
        setProductsList(products);
        // Ensure "2-item-combo" is seeded even if other products already exist in Firestore
        const has2ItemCombo = products.some((p) => p.id === "2-item-combo");
        if (!has2ItemCombo) {
          const combo2Item = PRODUCTS.find((p) => p.id === "2-item-combo");
          if (combo2Item) {
            saveProductToFirestore(combo2Item).catch((err) => console.error("Error seeding 2-item-combo:", err));
          }
        }
      } else {
        // If Firestore is empty, seed it with default products list
        PRODUCTS.forEach((p) => {
          saveProductToFirestore(p).catch((err) => console.error("Error seeding product:", err));
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Trigger ViewContent event on Meta Pixel whenever activeProduct changes
  useEffect(() => {
    if (activeProduct) {
      try {
        if (typeof window !== "undefined" && (window as any).fbq) {
          (window as any).fbq("track", "ViewContent", {
            content_name: activeProduct.name,
            content_ids: [activeProduct.id],
            content_type: "product",
            value: activeProduct.discountedPrice,
            currency: "INR"
          });
        }
      } catch (err) {
        console.error("[Meta Pixel] ViewContent track failed:", err);
      }
    }
  }, [activeProduct]);



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

    // Instantly persist into Firestore Orders ledger
    try {
      const newOrder = {
        id: newOrderId,
        name: details.name || "Unknown Buyer",
        phone: details.phone || "No phone",
        address: details.address || "No address",
        pincode: details.pincode || "000000",
        productName: details.productName || activeProduct.name,
        quantity: quantity,
        totalPrice: total,
        status: "Pending" as const,
        timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
      };
      saveOrderToFirestore(newOrder).catch((err) => console.error("Error saving order to Firestore:", err));
    } catch (err) {
      console.error("Failed to append placed order into admin storage:", err);
    }

    // Trigger Meta Pixel Purchase Conversion tracking
    try {
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Purchase", {
          value: total,
          currency: "INR",
          content_name: details.productName || activeProduct.name,
          content_type: "product",
          num_items: quantity
        });
        console.log("[Meta Pixel] Purchase event tracked successfully:", total);
      }
    } catch (pixelErr) {
      console.error("[Meta Pixel] Tracking failed:", pixelErr);
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800 antialiased selection:bg-blue-500 selection:text-white relative">
      {/* Universal Sticky / Float Top Header */}
      <Header onAdminClick={() => setIsAdminMode(true)} />

      {/* Floating Animated Promo Toast */}
      {showPromoToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce max-w-sm w-[90%] md:max-w-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl p-4 rounded-2xl flex items-center gap-3.5 border border-white/20">
          <div className="bg-white/20 p-2 rounded-xl text-white">
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-200">Exclusive URL Combo Offer Activated!</h4>
            <p className="text-[11px] font-bold mt-0.5 leading-snug">{promoToastMsg}</p>
          </div>
          <button 
            onClick={() => setShowPromoToast(false)} 
            className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg cursor-pointer font-black text-xs"
          >
            ✕
          </button>
        </div>
      )}

      <Routes>
        <Route path="/" element={
          <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 md:py-10 flex flex-col gap-10 animate-fade-in">
            {/* Urgency Announcement Bar / Slider Hero */}
            <div className="w-full bg-gradient-to-r from-rose-600 to-amber-500 text-white rounded-3xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden select-none">
              {/* Background graphic flare */}
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none transform translate-x-16" />
              <div className="flex items-center gap-4 text-center md:text-left shrink-0">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center font-black animate-pulse shadow-md">
                  ⏱️
                </div>
                <div>
                  <span className="text-[9px] bg-white/20 text-white font-black tracking-widest px-2 py-0.5 rounded-full uppercase">💥 SPECIAL MONTHLY OFFER 💥</span>
                  <h3 className="font-black text-lg md:text-xl tracking-tight leading-none mt-1">ഈ മാസത്തെ ഏറ്റവും വലിയ വിലക്കുറവ്! (Special Monthly Offer)</h3>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-black/20 px-5 py-3 rounded-2xl border border-white/10 shadow-inner">
                <Clock className="w-4.5 h-4.5 text-amber-300 animate-spin" />
                <span className="text-xs font-black uppercase tracking-wider text-amber-100">Offer Ends In:</span>
                <span className="text-sm font-black tracking-tight text-white font-mono bg-black/40 px-2 py-1 rounded-lg">
                  {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Store Introduction Heading */}
            <div className="w-full text-center flex flex-col items-center gap-2.5 mt-2">
              <h2 className="text-gray-950 font-black text-3xl md:text-4xl tracking-tight leading-tight max-w-2xl">
                Flip & Explore Our Premium Problem-Solving Gadgets
              </h2>
              <p className="text-gray-600 text-sm max-w-lg leading-relaxed font-bold">
                ഓർഡർ ചെയ്യാൻ താഴെയുള്ള <span className="text-blue-600">"ORDER NOW"</span> ബട്ടൺ ക്ലിക്ക് ചെയ്ത് വിലാസം നൽകുക. <br/>
                <span className="text-xs text-gray-400 font-semibold">(Click "ORDER NOW" below to fill out the contact form & place your order easily)</span>
              </p>
            </div>

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
                    navigate(`/products/${prod.id}`);
                  }}
                  onImageClick={(url, name) => {
                    setLightboxImage(url);
                    setLightboxTitle(name);
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

            {/* Global Store Trust Badges */}
            <div className="mt-6">
              <TrustBadges />
            </div>
          </main>
        } />

        <Route path="/products/:id" element={
          <ProductRouteWrapper
            productsList={productsList}
            activeProduct={activeProduct}
            setActiveProduct={setActiveProduct}
            checkoutProduct={checkoutProduct}
            setCheckoutProduct={setCheckoutProduct}
            setLightboxImage={setLightboxImage}
            setLightboxTitle={setLightboxTitle}
            pincodeInput={pincodeInput}
            setPincodeInput={setPincodeInput}
            pincodeStatus={pincodeStatus}
            setPincodeStatus={setPincodeStatus}
            handlePincodeCheck={handlePincodeCheck}
            estimatedDate={estimatedDate}
            getWhatsAppOrderUrl={getWhatsAppOrderUrl}
            handleOrderSuccess={handleOrderSuccess}
            orderSuccess={orderSuccess}
            orderId={orderId}
            orderedQty={orderedQty}
            orderedTotal={orderedTotal}
            orderDetails={orderDetails}
            resetOrderState={resetOrderState}
            formSectionRef={formSectionRef}
            scrollToCheckout={scrollToCheckout}
            setPromoToastMsg={setPromoToastMsg}
            setShowPromoToast={setShowPromoToast}
          />
        } />

        <Route path="/admin" element={
          <AdminRouteWrapper
            productsList={productsList}
            setProductsList={setProductsList}
          />
        } />

        <Route path="/ads-catalog" element={
          <AdsCatalog />
        } />
      </Routes>

      {/* Trust & Details Footer */}
      <footer className="w-full bg-gray-900 text-gray-400 py-10 px-4 mt-16 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-800 pb-8">
            {/* Column 1 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center">
                <img
                  src="https://i.ibb.co/kWGHYB6/Chat-GPT-Image-Sep-11-2026-10-20-38-AM-removebg-preview.png"
                  alt="Hovozon Logo"
                  className="h-10 w-auto object-contain block brightness-0 invert"
                  referrerPolicy="no-referrer"
                />
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
                  OFFICIAL HOVOZON GENUINE BRAND GUARANTEE
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <p>© 2026 Hovozon Kitchen Solvers. All Rights Reserved.</p>
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

      {/* Lightbox Fullscreen Image Modal */}
      {lightboxImage && (
        <div 
          onClick={() => {
            setLightboxImage(null);
            setLightboxTitle("");
          }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 md:p-8 animate-fade-in select-none"
        >
          {/* Close button top-right */}
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxImage(null);
              setLightboxTitle("");
            }}
            className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 active:scale-95 text-white p-3 rounded-full transition-all cursor-pointer border border-white/10 shadow-lg"
            title="Close (അടയ്ക്കുക)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal Container */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative w-full max-w-4xl max-h-[85vh] flex flex-col items-center gap-4 animate-scale-in"
          >
            {/* Header Title */}
            {lightboxTitle && (
              <div className="bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 text-center max-w-lg shadow-xl">
                <span className="text-white font-black text-sm tracking-tight">{lightboxTitle}</span>
              </div>
            )}

            {/* Display Image */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-zinc-950 flex items-center justify-center max-w-full max-h-[75vh]">
              <img 
                src={lightboxImage} 
                alt={lightboxTitle || "Product View"} 
                className="max-w-full max-h-[70vh] object-contain block select-none"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Click to Dismiss helper text */}
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider text-center mt-2 animate-pulse">
              📍 Click anywhere outside to close (തിരികെ പോകാൻ പുറത്തു ക്ലിക്ക് ചെയ്യുക)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
