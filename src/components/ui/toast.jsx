"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { cn, getCurrentDateTime, getCurrentUser } from "@/lib/utils";
import { X } from "lucide-react";


const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, description, variant = "default" }) => {
    const id = Math.random().toString(36).substr(2, 9);
    const timestamp = getCurrentDateTime(); // Get current datetime dynamically
    
    setToasts((prev) => [
      ...prev, 
      { 
        id, 
        title, 
        description, 
        variant,
        timestamp,
        user: getCurrentUser() // Get current user dynamically
      }
    ]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "flex items-center justify-between gap-4 rounded-md px-6 py-4 text-sm shadow-lg transition-all min-w-[300px]",
              {
                "bg-background text-foreground border": toast.variant === "default",
                "bg-destructive text-destructive-foreground": toast.variant === "destructive",
                "bg-green-600 text-white": toast.variant === "success",
              }
            )}
          >
            <div className="flex flex-col gap-1">
              {toast.title && (
                <p className="font-semibold">{toast.title}</p>
              )}
              {toast.description && (
                <p className="text-sm opacity-90">{toast.description}</p>
              )}
              <p className="text-xs opacity-75">
                {toast.timestamp} • {toast.user}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-current hover:opacity-75"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return {
    toast: (props) => context.addToast({ ...props }),
  };
}