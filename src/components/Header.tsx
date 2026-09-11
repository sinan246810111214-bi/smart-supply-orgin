import { useState, useEffect } from "react";
import { Phone, MessageCircle, ShoppingBag, Sparkles, Settings } from "lucide-react";

interface HeaderProps {
  onAdminClick?: () => void;
}

export default function Header({ onAdminClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full flex flex-col z-40 relative print:hidden">


      {/* Main Header Row */}
      <div
        className={`w-full bg-white border-b border-gray-100 px-4 py-3 md:py-4 transition-all duration-300 ${
          scrolled ? "sticky top-0 shadow-md backdrop-blur-md bg-white/95 z-50" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center">
            <img
              src="https://i.ibb.co/nMzqCQkJ/Chat-GPT-Image-Sep-11-2026-10-20-38-AM.png"
              alt="Hovozon Logo"
              className="h-12 md:h-16 w-auto object-contain block"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Quick Support & Contact Desktop Block */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex flex-col text-right mr-2">
              <span className="text-[10px] text-gray-400 font-bold">Helpline (9AM - 9PM)</span>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                <a href="tel:+919946597203" className="hover:text-blue-600 transition-colors">
                  +91 9946597203
                </a>
              </div>
            </div>

            <a
              href="https://wa.me/919946597203"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-full transition-all shadow-md shadow-blue-100 hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Quick Click Call Support for Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="tel:+919946597203"
              className="flex items-center justify-center w-11 h-11 bg-gray-50 border border-gray-200 rounded-full text-gray-700 active:scale-95 transition-transform shadow-sm"
              title="Call Helpline"
            >
              <Phone className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/919946597203"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-11 h-11 bg-blue-600 rounded-full text-white shadow-md shadow-blue-100 active:scale-95 transition-transform"
              title="WhatsApp Support"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
