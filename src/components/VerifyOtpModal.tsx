"use client";
import { useState } from "react";

export function VerifyOtpModal({
  email,
  onSuccess,
}: {
  email: string;
  onSuccess: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const verify = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, verificationCode: otp }),
      });

      const result = await res.json();
      if (res.ok) {
        onSuccess(); // ✅ Call parent handler
      } else {
        setError(result.error || "Invalid code");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold text-purple-700 text-center mb-4">
          🦋 Verify Your Email
        </h2>
        <p className="text-center mb-4 text-gray-600">
          We sent a code to <strong>{email}</strong>
        </p>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full border px-4 py-2 rounded mb-3"
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={verify}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>
      </div>
    </div>
  );
}
