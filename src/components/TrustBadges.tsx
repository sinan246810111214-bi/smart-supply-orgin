import { CheckCircle, Truck, RotateCcw, ShieldCheck, HeartHandshake } from "lucide-react";

export default function TrustBadges() {
  const badgeList = [
    {
      icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
      title: "100% COD Available",
      desc: "Pay only after you receive the product at your door."
    },
    {
      icon: <Truck className="w-6 h-6 text-emerald-600" />,
      title: "3-5 Days Shipping",
      desc: "Express home delivery all over India with full tracking."
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-emerald-600" />,
      title: "7 Days Replacement",
      desc: "Instant replacement if you get damaged or incomplete items."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: "100% Secure Shopping",
      desc: "Zero prepaid risks. Verified genuine kitchen accessories."
    }
  ];

  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4">
      {badgeList.map((badge, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-100 rounded-2xl p-4.5 text-center flex flex-col items-center gap-2.5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
            {badge.icon}
          </div>
          <div>
            <h4 className="text-gray-900 font-extrabold text-xs tracking-tight">
              {badge.title}
            </h4>
            <p className="text-gray-500 text-[10px] leading-relaxed mt-1">
              {badge.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
