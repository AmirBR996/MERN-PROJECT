import React, { useState, useContext } from "react";
import { login as apiLogin } from "../../api/auth.api";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthContext } from "../footer./authcontext.jsx";
import Input from "../ui/Input";
import Button from "../ui/Button";

const Login_form = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: loginContext } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handlechange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiLogin(formData);
      loginContext(response.user, response.access_token);
      toast.success(response.message || "Welcome back!");
      const redirect = location.state?.from || "/";
      navigate(redirect, { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handlesubmit}>
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
      <Input
        label="Password"
        id="password"
        name="password"
        type="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handlechange}
        required
      />
      <Button type="submit" className="w-full mt-2" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};

export default Login_form;
