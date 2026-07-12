import { useState } from "react";
import { Leaf } from "lucide-react";
import Login_form from "../components/form/login_form";
import RegisterForm from "../components/form/register_form";

const AuthPage = ({ initialMode = "login" }) => {
  const [mode, setMode] = useState(initialMode);

  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-stone-50 px-4 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm lg:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-emerald-900 via-emerald-800 to-stone-800 p-10 text-stone-100 lg:flex">
          <div className="absolute inset-0 opacity-20 texture-market" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-md bg-white/15 px-4 py-2 text-sm backdrop-blur">
              <Leaf className="h-4 w-4" />
              Nepal&apos;s farmer marketplace
            </div>
            <h1 className="mt-8 font-serif text-4xl font-bold leading-tight text-stone-50">
              Fresh from the field to your table
            </h1>
            <p className="mt-4 text-stone-100/80 leading-relaxed">
              Join Krishik Bazar to buy directly from local farmers or list your harvest for buyers across Nepal.
            </p>
          </div>
          <div className="relative mt-8 space-y-3 text-sm text-stone-100/70">
            <p>✓ Verified farmer profiles</p>
            <p>✓ Fair prices, no middlemen</p>
            <p>✓ Secure Khalti payments</p>
          </div>
        </div>

        {/* Form panel */}
        <div className="p-8 sm:p-10">
          <div className="mb-8 text-center lg:text-left">
            <p className="font-serif text-2xl font-bold text-stone-900 lg:hidden">Krishik Bazar</p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-stone-900">
              {mode === "login" ? "Namaste, welcome back" : "Create your account"}
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              {mode === "login"
                ? "Sign in to browse produce and manage your orders"
                : "Register as a buyer or farmer to get started"}
            </p>
          </div>

          {/* Toggle tabs */}
          <div className="mb-8 flex rounded-md bg-stone-100/50 p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-md py-2.5 text-sm font-semibold transition ${
                mode === "login"
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 rounded-md py-2.5 text-sm font-semibold transition ${
                mode === "register"
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Register
            </button>
          </div>

          {mode === "login" ? <Login_form /> : <RegisterForm />}

          <p className="mt-6 text-center text-sm text-stone-500">
            {mode === "login" ? (
              <>
                New here?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </main>
  );
};

export default AuthPage;
