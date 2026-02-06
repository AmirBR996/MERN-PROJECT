import React from "react";
import RegisterForm from "../components/form/register_form";
import { Link } from "react-router";

const RegisterPage = () => {
  return (
    <main className="h-full w-full flex justify-center items-center ">
      <div className="shadow-md border border-green-500  py-5 px-6 min-h-140 min-w-120 rounded-md">
        <h1 className="text-3xl font-bold text-center ">Create Account</h1>
        <p className="mt-1 text-center text-[16px]">
          To create account fill the form below
        </p>

        {/* form */}
       <RegisterForm/>

        {/* link to login page */}
        <div className="mt-1">
          <p className="text-center">
            Already have an account?{" "}
            <Link to={'/login'}>
            <span className="text-green-500 italic font-semibold">login</span>
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;