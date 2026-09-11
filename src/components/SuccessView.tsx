import { CheckCircle, PhoneCall, Gift, ChevronRight, MessageCircle } from "lucide-react";

interface SuccessViewProps {
  orderId: string;
  quantity: number;
  totalPrice: number;
  orderDetails: {
    name: string;
    phone: string;
    address: string;
    pincode: string;
    productName: string;
    timestamp: string;
  };
  onReset: () => void;
}

export default function SuccessView({ orderId, quantity, totalPrice, orderDetails, onReset }: SuccessViewProps) {
  // Generate WhatsApp text for tracking
  const waMessage = encodeURIComponent(
    `Hello Hovozon Support,\nI just placed an order on your store! Please confirm and dispatch it fast.\n\n📦 Order Details:\n🆔 Order ID: ${orderId}\n🛍️ Product: ${orderDetails.productName}\n🔢 Qty: ${quantity}\n💵 Total Amount: ₹${totalPrice}\n👤 Name: ${orderDetails.name}\n📞 Phone: ${orderDetails.phone}\n📍 Address: ${orderDetails.address}, ${orderDetails.pincode}`
  );

  return (
    <div className="max-w-xl mx-auto bg-white border border-gray-150 rounded-3xl shadow-xl overflow-hidden mt-6 animate-fade-in">
      {/* Top Header Card */}
      <div className="bg-blue-600 text-white p-8 text-center flex flex-col items-center gap-3 relative">
        {/* Animated Celebration check */}
        <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center border-2 border-blue-200 shadow-inner">
          <CheckCircle className="w-9 h-9 text-white animate-bounce" />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight leading-tight">🎉 ORDER PLACED!</h2>
          <p className="text-xs text-blue-100 font-semibold mt-1 tracking-wide uppercase">
            100% Cash on Delivery Verified
          </p>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6">
        {/* Order Info Callout */}
        <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-4 text-center">
          <p className="text-gray-500 text-[11px] font-extrabold uppercase tracking-widest">YOUR ORDER ID</p>
          <p className="text-gray-900 font-black text-xl tracking-wider select-all mt-0.5">{orderId}</p>
          <p className="text-xs text-blue-700 font-bold mt-1.5 flex items-center justify-center gap-1">
            <span>Pay on delivery:</span>
            <span className="text-sm font-black">₹{totalPrice}</span>
          </p>
        </div>

        {/* WhatsApp VIP Group Banner */}
        <div className="bg-blue-50/20 border-2 border-blue-500/20 rounded-2xl p-4.5 flex flex-col gap-3 relative overflow-hidden shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-md shrink-0 animate-pulse">
              <MessageCircle className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h4 className="font-black text-blue-950 text-sm leading-tight">Join Our Official WhatsApp Group!</h4>
              <p className="text-blue-800 text-[11px] leading-relaxed mt-1 font-semibold">
                To get live delivery updates, track your order package, and receive exclusive offers, click below to join our official WhatsApp group.
              </p>
            </div>
          </div>
          <a
            href="https://chat.whatsapp.com/CUkWvM2pcRB4eOISnItBAB?s=cl&p=a&ilr=4"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-5 rounded-xl text-xs tracking-wide uppercase transition-all flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>🟢 CLICK HERE TO JOIN WHATSAPP GROUP</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Timeline What Happens Next */}
        <div className="flex flex-col gap-3">
          <h3 className="text-gray-900 font-extrabold text-sm tracking-tight">📦 What Happens Next?</h3>
          <div className="relative border-l-2 border-blue-100 ml-4.5 pl-5 py-1 flex flex-col gap-5">
            {/* Step 1 */}
            <div className="relative">
              <span className="absolute -left-[27px] top-0 w-4 h-4 rounded-full bg-blue-600 border-2 border-white ring-4 ring-blue-100 flex items-center justify-center" />
              <div>
                <p className="text-gray-900 font-bold text-xs">Step 1: Phone Verification</p>
                <p className="text-gray-500 text-[11px] mt-0.5">
                  Our service executive will call your mobile <b>{orderDetails.phone}</b> in 1-2 hours to verify address. Please keep your phone nearby.
                </p>
              </div>
            </div>
 
            {/* Step 2 */}
            <div className="relative">
              <span className="absolute -left-[27px] top-0 w-4 h-4 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center" />
              <div>
                <p className="text-gray-900 font-bold text-xs">Step 2: Dispatch within 24 Hours</p>
                <p className="text-gray-500 text-[11px] mt-0.5">
                  Once verified, your package will be handed over to BlueDart / Delhivery / Xpressbees courier.
                </p>
              </div>
            </div>
 
            {/* Step 3 */}
            <div className="relative">
              <span className="absolute -left-[27px] top-0 w-4 h-4 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center" />
              <div>
                <p className="text-gray-900 font-bold text-xs">Step 3: Doorstep Pay on Delivery (3-5 Days)</p>
                <p className="text-gray-500 text-[11px] mt-0.5">
                  The delivery boy will hand over the parcel. You can pay <b>₹{totalPrice}</b> via cash or PhonePe/GPay UPI scan at doorstep.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-gray-50 rounded-2xl p-4.5 border border-gray-150 flex flex-col gap-2.5 text-xs">
          <p className="text-gray-900 font-black uppercase text-[10px] tracking-wider border-b border-gray-200 pb-1.5">
            Delivery Summary
          </p>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Customer:</span>
            <span className="text-gray-800 font-bold">{orderDetails.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Phone:</span>
            <span className="text-gray-800 font-bold">+91 {orderDetails.phone}</span>
          </div>
          <div className="flex justify-between items-start gap-4">
            <span className="text-gray-500 font-medium shrink-0">Address:</span>
            <span className="text-gray-800 font-bold text-right leading-normal">{orderDetails.address}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Pincode:</span>
            <span className="text-gray-800 font-bold">{orderDetails.pincode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Product Ordered:</span>
            <span className="text-blue-700 font-extrabold">{orderDetails.productName} (Qty: {quantity})</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <a
            href="https://chat.whatsapp.com/CUkWvM2pcRB4eOISnItBAB?s=cl&p=a&ilr=4"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 text-sm tracking-wide"
          >
            <MessageCircle className="w-5 h-5 fill-white animate-pulse" />
            <span>🟢 JOIN OFFICIAL WHATSAPP GROUP</span>
          </a>

          <a
            href={`https://wa.me/919946597203?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-extrabold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-98 text-xs"
          >
            <MessageCircle className="w-4 h-4 fill-blue-600 text-blue-600" />
            <span>💬 Track Order & Support Chat</span>
          </a>

          <button
            onClick={onReset}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-2xl text-xs transition-all active:scale-98 mt-1.5"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
