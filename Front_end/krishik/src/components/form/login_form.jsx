import React, { useState, useContext } from "react";
import { login as apiLogin } from "../../api/auth.api";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { AuthContext } from "../footer./authcontext.jsx";

const Login_form = () => {
  const navigate = useNavigate();
  const { login: loginContext } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handlechange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiLogin(formData);

      // Update context + localStorage
      loginContext(response.user, response.access_token);

      toast.success(response.message || "Login Success");

      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || err.message || "Login Failed");
    }
  };

  return (
    <div className="mt-10">
      <form className="flex flex-col gap-3" onSubmit={handlesubmit}>
        
        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-[16px] font-semibold" htmlFor="email">
            Email
          </label>
          <input
            className="border border-gray-400 px-2 py-2.5 rounded-md focus:outline-green-500"
            onChange={handlechange}
            id="email"
            name="email"
            type="email"
            placeholder="johndoe@example.com"
            required
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-[16px] font-semibold" htmlFor="password">
            Password
          </label>
          <input
            className="border border-gray-400 px-2 py-2.5 rounded-md focus:outline-green-500"
            onChange={handlechange}
            id="password"
            type="password"
            name="password"
            placeholder="enter password"
            required
          />
        </div>

        {/* Submit */}
        <div className="w-full mt-4">
          <button
            className="w-full bg-green-500 py-3.5 text-white font-bold rounded-sm"
            type="submit"
          >
            Login
          </button>
        </div>

      </form>
    </div>
  );
};

export default Login_form;
