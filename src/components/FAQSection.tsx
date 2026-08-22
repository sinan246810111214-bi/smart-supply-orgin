import { useState } from "react";
import { ChevronDown, HelpCircle, ShieldCheck } from "lucide-react";
import { FAQS } from "../data";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full flex flex-col gap-6 bg-white rounded-3xl border border-gray-100 p-6 shadow-md">
      <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
        <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 shrink-0">
          <HelpCircle className="w-4.5 h-4.5" />
        </div>
        <div>
          <h3 className="text-gray-900 font-extrabold text-base tracking-tight">Got Questions? We Have Answers!</h3>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Frequently Asked Questions (FAQ)</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                isOpen ? "border-emerald-500 bg-emerald-50/5" : "border-gray-150 hover:border-gray-250"
              }`}
            >
              {/* Accordion Trigger Header */}
              <button
                type="button"
                onClick={() => toggleIndex(idx)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-gray-800 text-sm transition-colors cursor-pointer select-none"
              >
                <span className="leading-snug">{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-emerald-600" : ""
                  }`}
                />
              </button>

              {/* Accordion Content Panel */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isOpen ? "max-h-[500px] border-t border-gray-100" : "max-h-0"
                }`}
              >
                <div className="p-5 text-gray-600 text-xs leading-relaxed bg-gray-50/30">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security note */}
      <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-gray-900 font-bold text-xs">Our 7-Day Replacement Policy (रिप्लेसमेंट पॉलिसी)</p>
          <p className="text-gray-500 text-[11px] leading-relaxed mt-0.5">
            If you face any issues, just message us on WhatsApp with an unboxing video or photo within 7 days of delivery. We will issue a free replacements. No questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}
