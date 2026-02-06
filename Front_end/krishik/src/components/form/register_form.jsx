import React, { useState } from "react";
import { register } from "../../api/auth.api";
import { useNavigate } from "react-router";
const RegisterForm = () => {
  const navigate = useNavigate();
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
  };
  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(formData);
      console.log(response);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="mt-10 ">
      <form  className="flex flex-col gap-3" onSubmit={handlesubmit}>
        {/* first name */}
        <div className="flex flex-col gap-1">
          {/* label */}
          <label className="text-[16px] font-semibold" htmlFor="first_name">
            First Name
          </label>
          {/* input */}
          <input
            name="first_name"
            className="border border-gray-400 px-2 py-2.5 rounded-md focus:outline-green-500"
            onChange={handlechange}
            id="first_name"
            type="text"
            placeholder="John"
            required
          />
        </div>

        {/* last  name */}
        <div className="flex flex-col gap-1">
          {/* label */}
          <label className="text-[16px] font-semibold" htmlFor="last_name">
            Last Name
          </label>
          {/* input */}
          <input
              onChange={handlechange}
            name="last_name"
            className="border border-gray-400 px-2 py-2.5 rounded-md focus:outline-green-500"
            id="last_name"
            type="text"
            placeholder="Doe"
            required
          />
        </div>

        {/* location */}
        <div className="flex flex-col gap-1">
          {/* label */}
          <label className="text-[16px] font-semibold" htmlFor="last_name">
            Location
          </label>
          {/* input */}
          <input
            name="location"
            onChange={handlechange}
            className="border border-gray-400 px-2 py-2.5 rounded-md focus:outline-green-500"
            id="location"
            type="text"
            placeholder="kathmandu"
            required
          />
        </div>

        {/* email */}
        <div className="flex flex-col gap-1">
          {/* label */}
          <label className="text-[16px] font-semibold" htmlFor="email">
            Email
          </label>
          {/* input */}
          <input
            name="email"
            onChange={handlechange}
            className="border border-gray-400 px-2 py-2.5 rounded-md focus:outline-green-500"
            id="email"
            type="email"
            placeholder="johndoe@example.com"
            required
          />
        </div>
        
        {/* user - type */}
        <div className="flex flex-col gap-1">
            {/* label */}
            <label className="text-[16px] font-semibold" htmlFor="user_type">
                Register As
            </label>
            {/* select */}
            <select 
              name="user_type" 
              onChange={handlechange}
              id="user_type" 
              className="border border-gray-400 px-2 py-2.5 rounded-md focus:outline-green-500"
              required
            >
                <option value="" disabled selected>Select user type</option>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
            </select>
        </div>

        {/* password */}
        <div className="flex flex-col gap-1">
          {/* label */}
          <label className="text-[16px] font-semibold" htmlFor="password">
            Password
          </label>
          {/* input */}
          <input
            onChange={handlechange}
            name="password"
            className="border border-gray-400 px-2 py-2.5 rounded-md focus:outline-green-500"
            id="password"
            type="password"
            placeholder="enter password"
            required
          />
        </div>

        {/*retype  password */}
        <div className="flex flex-col gap-1">
          {/* label */}
          <label className="text-[16px] font-semibold" htmlFor="c_password">
            Re-type Password
          </label>
          {/* input */}
          <input
            onChange={handlechange}
            name="c_password"
            className="border border-gray-400 px-2 py-2.5 rounded-md focus:outline-green-500"
            id="c_password"
            type="password"
            placeholder="retype password"
            required
          />
        </div>

        {/* submit button */}
        <div className="w-full mt-4">
          <button
            className="w-full bg-green-500 py-3.5 text-white font-bold rounded-sm cursor-pointer"
            type="submit"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;