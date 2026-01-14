"use client"
import React from "react";

export default function WhatsAppChatButton({
  phone = "+13127888738",
  message = "Hi! I found you on your website — can we chat?",
  size = 10,
  // showPopup = true,
}) {
  const encoded = encodeURIComponent(message);
  const waURL = `https://wa.me/${phone}?text=${encoded}`;
  const btnSize = typeof size === "number" ? size : parseInt(size, 10);

  
  const handleOpen = () => {
        window.open(waURL, "_blank");

  };

 

  return (
    <div className="fixed right-6 bottom-10 z-50">
     

      {/* Floating Button */}
      <button
        onClick={handleOpen}
        aria-label="Chat on WhatsApp"
        style={{ width: btnSize, height: btnSize }}
        className="relative flex items-center justify-center rounded-full shadow-2xl focus:outline-none focus:ring-4 focus:ring-green-300/40 transition-transform transform hover:-translate-y-0.5 active:translate-y-0.5"
      >
        {/* Green glossy background */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500 to-green-600"></span>
        {/* subtle inner glow */}
        <span
          className="absolute inset-0 rounded-full opacity-40"
          style={{ boxShadow: "0 6px 18px rgba(16,185,129,0.25)" }}
        />

        {/* icon (SVG) */}
        <span className="relative z-10 w-3/5 h-3/5 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-full h-full text-white"
            aria-hidden
          >
            <path d="M20.52 3.48A11.88 11.88 0 0012 0C5.37 0 .04 5.34.03 12A11.9 11.9 0 002.7 18.9L0 24l5.32-2.69A11.94 11.94 0 0012 24c6.63 0 11.96-5.34 11.97-12 0-3.2-1.24-6.2-3.45-8.52zM12 21.5c-1.6 0-3.18-.38-4.57-1.1l-.33-.17-3.15 1.6 1.41-3.07-.22-.36A9.5 9.5 0 012.5 12C2.5 6.2 6.72 2 12 2c5.29 0 9.5 4.2 9.5 10s-4.21 9.5-9.5 9.5z" />
            <path d="M17.53 14.14c-.28-.14-1.66-.82-1.92-.91-.27-.09-.47-.14-.67.14-.2.28-.77.91-.95 1.1-.17.2-.34.22-.63.07-.28-.15-1.18-.43-2.25-1.39-.83-.74-1.39-1.66-1.55-1.93-.16-.28-.02-.43.12-.57.12-.12.28-.33.42-.5.14-.17.18-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.67-1.62-.92-2.22-.24-.58-.48-.5-.66-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.35-.27.29-1.03 1.01-1.03 2.47 0 1.45 1.05 2.85 1.2 3.05.15.2 2.08 3.37 5.05 4.72 2.96 1.35 3.0.9 3.56.84.56-.07 1.8-.73 2.05-1.44.25-.71.25-1.32.18-1.45-.07-.14-.27-.22-.55-.36z" />
          </svg>
        </span>

        {/* Pulse ring */}
        {/* <span className="absolute -inset-1 rounded-full animate-ping opacity-30 bg-green-400" /> */}
      </button>
    </div>
  );


}