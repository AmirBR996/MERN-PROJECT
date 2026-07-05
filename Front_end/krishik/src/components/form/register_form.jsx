import React, { useState, useContext } from "react";
import { sendOtp, verifyOtp } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthContext } from "../footer./authcontext.jsx";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import OtpVerification from "./OtpVerification";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { login: loginContext } = useContext(AuthContext);
  const [step, setStep] = useState("form");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [devNotice, setDevNotice] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    location: "",
    email: "",
    user_type: "",
    password: "",
    c_password: "",
  });

  const handlechange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (formData.password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.c_password) {
      next.c_password = "Passwords do not match";
    }
    if (!formData.user_type) {
      next.user_type = "Please select a user type";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setOtpError("");
    setDevOtp("");
    setDevNotice("");
    try {
      const response = await sendOtp(formData);
      if (response.devOtp) {
        setDevOtp(response.devOtp);
        setDevNotice(response.devNotice || "");
        toast.success("Development OTP generated — enter the code shown below");
      } else {
        toast.success(response.message || "Verification code sent!");
      }
      setStep("otp");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not send verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (otp) => {
    setLoading(true);
    setOtpError("");
    try {
      const response = await verifyOtp({ email: formData.email, otp });
      loginContext(response.user, response.access_token);
      toast.success("Account created!");
      navigate("/", { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || "Verification failed";
      setOtpError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setOtpError("");
    try {
      const response = await sendOtp(formData);
      if (response.devOtp) {
        setDevOtp(response.devOtp);
        setDevNotice(response.devNotice || "");
      }
      toast.success(response.message || "New code sent!");
    } catch (err) {
      const message = err?.response?.data?.message || "Could not resend code";
      setOtpError(message);
      toast.error(message);
    } finally {
      setResendLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-bark">Verify your email</h2>
          <p className="mt-1 text-sm text-mist">Step 2 of 2 — confirm it&apos;s really you</p>
        </div>
        <OtpVerification
          email={formData.email}
          onVerify={handleVerify}
          onResend={handleResend}
          loading={loading}
          resendLoading={resendLoading}
          error={otpError}
        />
        {devOtp && (
          <div className="rounded-xl border border-harvest-200 bg-harvest-50 px-4 py-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-harvest-700">
              Development mode
            </p>
            <p className="mt-1 text-sm text-harvest-800">{devNotice}</p>
            <p className="mt-2 font-mono text-2xl font-bold tracking-[0.3em] text-bark">{devOtp}</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            setStep("form");
            setOtpError("");
          }}
          className="text-sm text-mist hover:text-bark"
        >
          ← Back to registration form
        </button>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handlesubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="First Name"
          id="first_name"
          name="first_name"
          placeholder="Ram"
          value={formData.first_name}
          onChange={handlechange}
          required
        />
        <Input
          label="Last Name"
          id="last_name"
          name="last_name"
          placeholder="Sharma"
          value={formData.last_name}
          onChange={handlechange}
          required
        />
      </div>

      <Input
        label="Location"
        id="location"
        name="location"
        placeholder="Kathmandu, Nepal"
        value={formData.location}
        onChange={handlechange}
        required
      />

      <Input
        label="Email"
        id="email"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={handlechange}
        required
      />

      <Select
        label="Register As"
        id="user_type"
        name="user_type"
        value={formData.user_type}
        onChange={handlechange}
        error={errors.user_type}
        required
      >
        <option value="" disabled>
          Select user type
        </option>
        <option value="buyer">Buyer — I want to purchase produce</option>
        <option value="seller">Farmer/Seller — I want to list products</option>
      </Select>

      <Input
        label="Password"
        id="password"
        name="password"
        type="password"
        placeholder="At least 6 characters"
        value={formData.password}
        onChange={handlechange}
        error={errors.password}
        required
      />

      <Input
        label="Confirm Password"
        id="c_password"
        name="c_password"
        type="password"
        placeholder="Re-type password"
        value={formData.c_password}
        onChange={handlechange}
        error={errors.c_password}
        required
      />

      <Button type="submit" className="w-full mt-2" disabled={loading}>
        {loading ? "Sending code..." : "Create Account"}
      </Button>
    </form>
  );
};

export default RegisterForm;
