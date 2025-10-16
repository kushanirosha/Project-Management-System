import React, { useState, useEffect, useRef } from "react";
import { Headphones, Phone, MessageCircle } from "lucide-react";

const ADMIN_NAME = "Pubudu Wijerathne";
const HOTLINE = "+94759929718";
const WHATSAPP_NUMBER = "+94759929718";
const WHATSAPP_MESSAGE = encodeURIComponent("Hello Pubudu, I need assistance.");

const AssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Close widget when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={widgetRef}
      className="fixed right-2 top-1/2 transform -translate-y-1/2 z-50 flex flex-col items-start"
    >
      {/* Floating Online Support Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-[#3cef3c] text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:bg-[#157a09] hover:scale-110 ${
          isOpen ? "rotate-45" : "rotate-0"
        } animate-bounce`}
        title="Online Support Team"
      >
        <Headphones size={22} />
      </button>

      {/* Expandable Info Card */}
      <div
        className={`absolute right-14 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-64 transition-all duration-500 origin-right ${
          isOpen
            ? "opacity-100 scale-100 translate-x-0"
            : "opacity-0 scale-90 -translate-x-5 pointer-events-none"
        }`}
      >
        <h3 className="font-semibold text-gray-800 text-base">
          Online Support Team
        </h3>
        <p className="text-sm text-gray-600 mt-1">{ADMIN_NAME}</p>

        <div className="flex items-center gap-2 text-gray-700 mt-3">
          <Phone size={16} className="text-[#3c405b]" />
          <span className="text-sm">{HOTLINE}</span>
        </div>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
        >
          <MessageCircle size={16} />
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
};

export default AssistantWidget;
