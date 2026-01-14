"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "./ui/toast";

export default function ScheduleMeetingButton({ size = 50 }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState(new Date());
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const btnSize = typeof size === "number" ? size : parseInt(size, 10);

  const handleSchedule = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !number || !email || !message || !date) {
      alert("⚠️ Please fill in all fields before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: number,
          message,
          date: date.toISOString(), // store in ISO format
        }),
      });

      if (res.ok) {
        toast({
          title: "Success",
          description: `✅ Meeting scheduled successfully!`,
        });
        // Reset fields
        setName("");
        setNumber("");
        setEmail("");
        setMessage("");
        setDate(new Date());
        setIsOpen(false);
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: "❌ Failed to schedule meeting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed right-6 bottom-30 z-50">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Schedule a meeting"
        style={{ width: btnSize, height: btnSize }}
        disabled={isSubmitting}
        className={`relative flex items-center justify-center rounded-full shadow-2xl 
          bg-gradient-to-br from-blue-500 to-blue-600 text-white 
          focus:outline-none focus:ring-4 focus:ring-blue-300/40 
          transition-transform transform hover:-translate-y-0.5 
          active:translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed`}
      >
        {/* Calendar Icon */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7 text-white"
        >
          <path
            d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 
                   0-2 .9-2 2v14c0 1.1.9 2 
                   2 2h14c1.1 0 2-.9 
                   2-2V6c0-1.1-.9-2-2-2zm0 
                   16H5V9h14v11z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl relative max-h-[70vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => !isSubmitting && setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Schedule a Meeting
            </h2>

            <form onSubmit={handleSchedule} className="p-4 space-y-6">
              <fieldset
                disabled={isSubmitting}
                className=" disabled:opacity-80 cursor-not-allowed"
              >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Date Picker */}
                <div className="flex justify-center">
                  <div className="rounded-lg border p-2 inline-block">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="!w-auto !h-auto"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div>
                  <label className="block mb-2 text-sm text-gray-600">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    required
                    disabled={isSubmitting}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                  />

                  <label className="block mb-2 text-sm text-gray-600">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={number}
                    required
                    disabled={isSubmitting}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                  />

                  <label className="block mb-2 text-sm text-gray-600">
                    E-mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    required
                    disabled={isSubmitting}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                  />

                  <label className="block mb-2 text-sm text-gray-600">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={message}
                    required
                    disabled={isSubmitting}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border rounded-lg p-2 mb-4 min-h-[80px] focus:ring-2 focus:ring-blue-500 outline-none"
                  />

                  {/* Confirm Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 cursor-pointer text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                          ></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      "Confirm"
                    )}
                  </button>
                </div>
              </div>
              </fieldset>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
