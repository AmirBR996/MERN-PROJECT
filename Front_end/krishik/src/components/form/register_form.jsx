import React, { useState, useContext } from "react";
import { register } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthContext } from "../footer/authcontext.jsx";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { User, Mail, Lock, MapPin } from "lucide-react";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { login: loginContext } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
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
    try {
      const response = await register(formData);
      if (response.user && response.access_token) {
        loginContext(response.user, response.access_token);
      }
      toast.success("Account created successfully!");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handlesubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="First Name"
          id="first_name"
          name="first_name"
          placeholder="Ram"
          value={formData.first_name}
          onChange={handlechange}
          icon={User}
          required
        />
        <Input
          label="Last Name"
          id="last_name"
          name="last_name"
          placeholder="Sharma"
          value={formData.last_name}
          onChange={handlechange}
          icon={User}
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
        icon={MapPin}
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
        icon={Mail}
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
        icon={Lock}
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
        icon={Lock}
        error={errors.c_password}
        required
      />

      <Button type="submit" className="w-full mt-2 py-4 rounded-xl shadow-lg" disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
};

export default RegisterForm;
