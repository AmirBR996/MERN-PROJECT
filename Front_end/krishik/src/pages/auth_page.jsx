import React from "react";
import Login_form from "../components/form/login_form";
import RegisterForm from "../components/form/register_form";

const AuthPage = ({ initialMode }) => {
  const [mode, setMode] = React.useState(initialMode || "login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === "login" ? "Sign in to your account" : "Create a new account"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {mode === "login"
              ? "Enter your details to get started"
              : "Join our farming community today"}
          </p>
        </div>
        <div className="mt-8">
          {mode === "login" ? <Login_form /> : <RegisterForm />}
        </div>
        <div className="text-center">
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-sm font-medium text-primary hover:underline"
          >
            {mode === "login"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
