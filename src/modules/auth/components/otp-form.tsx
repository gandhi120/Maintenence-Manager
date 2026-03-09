"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    verifyOtp: (
      otp: number,
      onSuccess?: (data: unknown) => void,
      onError?: (error: unknown) => void,
      reqId?: string,
    ) => void;
    retryOtp: (
      channel: string | null,
      onSuccess?: (data: unknown) => void,
      onError?: (error: unknown) => void,
      reqId?: string,
    ) => void;
    initSendOTP: (config: unknown) => void;
  }
}

export function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";
  const requestId = searchParams.get("requestId") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [widgetReady, setWidgetReady] = useState(false);

  useEffect(() => {
    if (!phone) {
      router.push("/login");
    }
  }, [phone, router]);

  // Check if MSG91 verifyOtp is available (initialized on login page)
  useEffect(() => {
    if (window.verifyOtp) {
      setWidgetReady(true);
      console.log("MSG91 verifyOtp already available");
    } else {
      // Poll until available (in case of page refresh)
      const interval = setInterval(() => {
        if (window.verifyOtp) {
          setWidgetReady(true);
          console.log("MSG91 verifyOtp became available");
          clearInterval(interval);
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError("");

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pastedData.length === 6) {
      setOtp(pastedData.split(""));
      const lastInput = document.getElementById("otp-5");
      lastInput?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Enter complete 6-digit OTP");
      return;
    }

    if (!widgetReady || !window.verifyOtp) {
      setError("Verification service loading, please try again");
      return;
    }

    setLoading(true);
    setError("");

    console.log("Verifying OTP:", otpCode, "requestId:", requestId);

    window.verifyOtp(
      parseInt(otpCode, 10),
      async (data: unknown) => {
        console.log("OTP verified by MSG91:", data);

        // Extract token from MSG91 response
        const token = (data as { message?: string })?.message || "";

        // Now create Supabase session
        try {
          const res = await fetch("/api/auth/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, token }),
          });

          const result = await res.json();
          console.log("Supabase session result:", result);

          if (!res.ok || result.error) {
            setError(result.error || "Failed to create session");
            setLoading(false);
            return;
          }

          // Full page navigation so middleware picks up new cookies
          window.location.href = "/dashboard";
        } catch (err) {
          console.error("Session creation error:", err);
          setError("Something went wrong. Please try again.");
          setLoading(false);
        }
      },
      (err: unknown) => {
        console.error("OTP verify error:", err);
        setError("Invalid OTP. Please try again.");
        setLoading(false);
      },
      requestId || undefined,
    );
  };

  const handleResend = () => {
    setTimer(60);
    setError("");

    const mobile = phone.startsWith("+") ? phone.slice(1) : phone;

    if (window.retryOtp) {
      window.retryOtp(
        mobile,
        (data) => console.log("OTP resent:", data),
        (err) => {
          console.error("Resend error:", err);
          setError("Failed to resend OTP");
        },
      );
    }
  };

  // Format phone for display
  const displayPhone = phone
    ? `${phone.slice(0, 3)} ${phone.slice(3, 8)} ${phone.slice(8)}`
    : "";

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-4">
      <Script
        src="https://verify.msg91.com/otp-provider.js"
        strategy="afterInteractive"
      />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-[#FAFAFA] mb-2">
            Enter Verification Code
          </h1>
          <p className="text-sm text-[#A1A1AA]">Code sent to {displayPhone}</p>
        </div>

        <div className="flex gap-2 justify-center mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-14 text-center text-xl border border-[#3F3F46] bg-[#18181B] rounded-lg focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA]"
              maxLength={1}
            />
          ))}
        </div>

        {error && (
          <p className="text-sm text-[#F43F5E] text-center mb-4">{error}</p>
        )}

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full h-12 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-all font-medium mb-6 shadow-lg shadow-[#8B5CF6]/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>

        <div className="text-center space-y-2">
          <p className="text-sm text-[#A1A1AA]">
            {timer > 0 ? (
              <>Resend in 0:{timer.toString().padStart(2, "0")}</>
            ) : (
              <button
                className="text-[#8B5CF6] hover:underline"
                onClick={handleResend}
              >
                Resend OTP
              </button>
            )}
          </p>
          <button
            className="text-sm text-[#8B5CF6] hover:underline"
            onClick={() => router.push("/login")}
          >
            Change Number
          </button>
        </div>
      </div>
    </div>
  );
}
