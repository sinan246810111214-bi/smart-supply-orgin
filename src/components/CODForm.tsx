import React, { useState, useEffect } from "react";
import { Check, ShieldCheck, Truck, AlertCircle, ShoppingBag, Gift, Sparkles } from "lucide-react";
import { Product, OrderResponse } from "../types";

interface CODFormProps {
  product: Product;
  onOrderSuccess: (orderId: string, quantity: number, total: number, orderDetails: any) => void;
  formRef?: React.RefObject<HTMLDivElement | null>;
}

export default function CODForm({ product, onOrderSuccess, formRef }: CODFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [houseName, setHouseName] = useState("");
  const [post, setPost] = useState("");
  const [district, setDistrict] = useState("");
  const [pincode, setPincode] = useState("");
  const [estDate, setEstDate] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Bundle incentives calculations
  const getBundleDetails = () => {
    const basePrice = product.discountedPrice;
    if (quantity === 1) {
      return {
        unitPrice: basePrice,
        totalPrice: basePrice,
        discount: 0,
        gift: null
      };
    } else if (quantity === 2) {
      const discount = product.id === "chopper-12in1" ? 100 : 50;
      return {
        unitPrice: Math.round((basePrice * 2 - discount) / 2),
        totalPrice: basePrice * 2 - discount,
        discount,
        gift: "✨ Free Double-Sided Scrub Sponge"
      };
    } else {
      const discount = product.id === "chopper-12in1" ? 300 : product.id === "water-pump" ? 200 : 150;
      return {
        unitPrice: Math.round((basePrice * 3 - discount) / 3),
        totalPrice: basePrice * 3 - discount,
        discount,
        gift: "🎁 Free Premium Stainless Steel Peeler + Scrub"
      };
    }
  };

  const { totalPrice, discount, gift } = getBundleDetails();

  // Reset quantity when active product changes
  useEffect(() => {
    setQuantity(1);
  }, [product.id]);

  // Update expected delivery date when pincode changes
  useEffect(() => {
    const cleanPin = pincode.replace(/\D/g, "");
    if (cleanPin.length === 6) {
      const firstDigit = parseInt(cleanPin[0]);
      if (firstDigit >= 1 && firstDigit <= 9) {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3 + (parseInt(cleanPin[5]) % 3));
        const formatted = deliveryDate.toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "short"
        });
        setEstDate(formatted);
      } else {
        setEstDate("");
      }
    } else {
      setEstDate("");
    }
  }, [pincode]);

  // Smart phone formatting that automatically strips +91, 91 or 0 prefix
  const handlePhoneChange = (val: string) => {
    let digits = val.replace(/\D/g, "");
    
    // Auto strip leading zero (0)
    if (digits.length === 11 && digits.startsWith("0")) {
      digits = digits.substring(1);
    }
    // Auto strip country code (91)
    else if (digits.length === 12 && digits.startsWith("91")) {
      digits = digits.substring(2);
    }
    
    // Limit to max 10 digits
    if (digits.length > 10) {
      digits = digits.substring(0, 10);
    }
    
    setPhone(digits);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Please enter your Name";
    }

    if (!houseName.trim()) {
      newErrors.houseName = "Please enter House Name";
    }

    if (!post.trim()) {
      newErrors.post = "Please enter Post Office";
    }

    if (!district.trim()) {
      newErrors.district = "Please enter District";
    }

    if (pincode.length !== 6) {
      newErrors.pincode = "Please enter a valid 6-digit Pincode";
    }

    if (phone.length !== 10) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    const combinedAddress = `${houseName.trim()}, ${post.trim()} (PO), ${district.trim()} (Dist)`;

    const orderPayload = {
      name: name.trim(),
      phone,
      address: combinedAddress,
      pincode,
      productName: product.name,
      quantity,
      totalPrice,
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    };

    try {
      const response = await fetch("/api/confirm-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });

      const data: OrderResponse = await response.json();

      if (data.success) {
        onOrderSuccess(data.orderId, quantity, totalPrice, orderPayload);
      } else {
        setErrors({ submit: data.message || "Failed to place order. Please try again." });
      }
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Network error. Please check your internet connection." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      ref={formRef}
      id="cod-checkout-container"
      className="bg-white rounded-3xl border-2 border-blue-600/20 shadow-2xl overflow-hidden scroll-mt-24"
    >
      {/* Checkout Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-700 text-white px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-blue-100" />
          </div>
          <div>
            <h3 className="font-black text-lg tracking-tight leading-snug">Quick Cash on Delivery Form</h3>
            <p className="text-[11px] text-blue-100 font-bold tracking-wide uppercase mt-0.5">
              Item Selected: <span className="text-amber-300 font-extrabold">{product.name}</span>
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
        {/* Delivery Address Header */}
        <div className="flex flex-col gap-4">
          <label className="text-gray-950 font-black text-sm flex items-center gap-1.5 border-b border-gray-100 pb-2">
            Delivery Address (വിലാസം നൽകുക)
          </label>

          <div className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-black text-gray-700 flex items-center gap-1">
                Name (പേര്) <span className="text-rose-500">*</span>
              </span>
              <input
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 bg-gray-50/50 border-2 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 font-extrabold ${
                  errors.name ? "border-rose-400 bg-rose-50/5" : "border-gray-200"
                }`}
              />
              {errors.name && (
                <p className="text-rose-600 text-[11px] font-bold flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* House Name */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-black text-gray-700 flex items-center gap-1">
                House name (വീട്ടുപേര്) <span className="text-rose-500">*</span>
              </span>
              <input
                type="text"
                placeholder="Enter house name"
                value={houseName}
                onChange={(e) => setHouseName(e.target.value)}
                className={`w-full px-4 py-3 bg-gray-50/50 border-2 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 font-bold ${
                  errors.houseName ? "border-rose-400 bg-rose-50/5" : "border-gray-200"
                }`}
              />
              {errors.houseName && (
                <p className="text-rose-600 text-[11px] font-bold flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.houseName}
                </p>
              )}
            </div>

            {/* Post */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-black text-gray-700 flex items-center gap-1">
                Post (പോസ്റ്റ്) <span className="text-rose-500">*</span>
              </span>
              <input
                type="text"
                placeholder="Enter post office name"
                value={post}
                onChange={(e) => setPost(e.target.value)}
                className={`w-full px-4 py-3 bg-gray-50/50 border-2 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 font-bold ${
                  errors.post ? "border-rose-400 bg-rose-50/5" : "border-gray-200"
                }`}
              />
              {errors.post && (
                <p className="text-rose-600 text-[11px] font-bold flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.post}
                </p>
              )}
            </div>

            {/* District */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-black text-gray-700 flex items-center gap-1">
                District (ജില്ല) <span className="text-rose-500">*</span>
              </span>
              <input
                type="text"
                placeholder="Enter district name"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={`w-full px-4 py-3 bg-gray-50/50 border-2 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 font-bold ${
                  errors.district ? "border-rose-400 bg-rose-50/5" : "border-gray-200"
                }`}
              />
              {errors.district && (
                <p className="text-rose-600 text-[11px] font-bold flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.district}
                </p>
              )}
            </div>

            {/* Pincode */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-black text-gray-700 flex items-center gap-1">
                Pincode (പിൻകോഡ്) <span className="text-rose-500">*</span>
              </span>
              <input
                type="text"
                maxLength={6}
                placeholder="6-digit pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                className={`w-full px-4 py-3 bg-gray-50/50 border-2 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-black text-gray-950 tracking-widest ${
                  errors.pincode ? "border-rose-400 bg-rose-50/5" : "border-gray-200"
                }`}
              />
              
              {/* Live Delivery Date Estimate indicator */}
              {estDate && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2.5 animate-fade-in text-xs">
                  <Truck className="w-4.5 h-4.5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-800 font-black">🟢 COD Available (വീട്ടുപടിക്കൽ പണം നൽകാം!)</p>
                    <p className="text-blue-700 text-[11px] mt-0.5">Estimated Delivery Date: <b>{estDate}</b></p>
                  </div>
                </div>
              )}
              
              {errors.pincode && (
                <p className="text-rose-600 text-[11px] font-bold flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.pincode}
                </p>
              )}
            </div>

            {/* Mobile */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-black text-gray-700 flex items-center gap-1">
                Mobile number (ഫോൺ നമ്പർ) <span className="text-rose-500">*</span>
              </span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-gray-500 border-r-2 border-gray-200 pr-3">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className={`w-full pl-[68px] pr-4 py-3 bg-gray-50/50 border-2 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-black text-gray-950 tracking-wide ${
                    errors.phone ? "border-rose-400 bg-rose-50/5" : "border-gray-200"
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-rose-600 text-[11px] font-bold flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Rewards / Free Gifts */}
        {gift && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <Gift className="w-6 h-6 text-amber-600 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <p className="text-amber-900 text-xs font-black uppercase tracking-wider">🎉 Your Free Bonus Gift!</p>
              <p className="text-amber-800 text-sm font-black mt-1">{gift}</p>
              <p className="text-[10px] text-amber-600">Will be packed inside your box automatically.</p>
            </div>
          </div>
        )}

        {/* Step 3: Order Review Card */}
        <div className="bg-gray-50 border-2 border-gray-150 rounded-2xl p-4.5 flex flex-col gap-2.5">
          <div className="flex justify-between text-xs text-gray-500 font-bold">
            <span>Product Subtotal ({quantity === 1 ? "1 item" : `${quantity} items`})</span>
            <span className="text-gray-800 font-extrabold">₹{product.discountedPrice * quantity}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-xs font-bold text-blue-600">
              <span>Bundle Promo Savings</span>
              <span>-₹{discount}</span>
            </div>
          )}
          <div className="flex justify-between text-xs text-gray-500 font-bold">
            <span>Shipping & Courier</span>
            <span className="text-blue-600 flex items-center gap-1 font-black">
              <Truck className="w-3.5 h-3.5" /> FREE Delivery
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 font-bold">
            <span>Cash on Delivery Fee</span>
            <span className="text-blue-600 font-black">FREE COD</span>
          </div>
          <div className="h-[1px] bg-gray-200 my-1" />
          <div className="flex justify-between items-center text-gray-900 font-black">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-black uppercase">Total Bill to Pay</span>
              <span className="text-[10px] text-blue-600 font-extrabold">Pay cash or UPI at your doorstep</span>
            </div>
            <span className="text-2xl text-blue-600">₹{totalPrice}</span>
          </div>
        </div>

        {/* Errors / Warnings */}
        {errors.submit && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span>{errors.submit}</span>
          </div>
        )}

        {/* Cash On Delivery Confirmation Button */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-4.5 px-6 rounded-2xl text-white font-black text-base tracking-wide shadow-xl flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] cursor-pointer ${
            submitting
              ? "bg-gray-400 shadow-none cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:-translate-y-0.5"
          }`}
        >
          {submitting ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Placing Order...</span>
            </div>
          ) : (
            <>
              <Check className="w-5 h-5 stroke-[4px]" />
              <span>⚡ ORDER NOW (CASH ON DELIVERY)</span>
            </>
          )}
        </button>

        {/* Security / Quality Guarantee badge */}
        <div className="flex items-center justify-center gap-2 text-gray-500 text-[10px] font-bold">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>🔒 Safe Doorstep COD Checkout • 7 Days Replacement Warranty</span>
        </div>
      </form>
    </div>
  );
}
