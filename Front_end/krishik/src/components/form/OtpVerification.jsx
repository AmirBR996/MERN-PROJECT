import { useEffect, useRef, useState } from "react";
import Button from "../ui/Button";

const OtpVerification = ({ email, onVerify, onResend, loading, resendLoading, error }) => {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...digits];
    next[index] = value;
    setDigits(next);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const next = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
    setDigits(next);
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const otp = digits.join("");
  const isComplete = otp.length === 6;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isComplete) onVerify(otp);
  };

  const handleResend = async () => {
    await onResend();
    setCountdown(60);
    setDigits(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div>
        <p className="text-sm text-mist">
          We sent a 6-digit code to{" "}
          <strong className="text-bark">{email}</strong>. Enter it below to create your account.
        </p>
      </div>

      <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`h-12 w-10 rounded-xl border-2 text-center text-lg font-bold outline-none transition sm:h-14 sm:w-12 ${
              error
                ? "border-red-400 bg-red-50 text-red-700"
                : "border-soil-200 bg-white text-bark focus:border-leaf-500"
            }`}
            aria-label={`Digit ${index + 1}`}
          />
        ))}
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={loading || !isComplete}>
        {loading ? "Verifying..." : "Verify & Create Account"}
      </Button>

      <div className="text-center text-sm text-mist">
        Didn&apos;t receive the code?{" "}
        {countdown > 0 ? (
          <span>Resend in {countdown}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="font-semibold text-leaf-600 hover:text-leaf-700 disabled:opacity-50"
          >
            {resendLoading ? "Sending..." : "Resend OTP"}
          </button>
        )}
      </div>
    </form>
  );
};

export default OtpVerification;
