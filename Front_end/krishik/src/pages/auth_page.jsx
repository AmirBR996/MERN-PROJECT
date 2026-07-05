import { useState } from "react";
import { Leaf } from "lucide-react";
import Login_form from "../components/form/login_form";
import RegisterForm from "../components/form/register_form";

const AuthPage = ({ initialMode = "login" }) => {
  const [mode, setMode] = useState(initialMode);

  return (
    <main className="texture-market min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-soil-200 bg-white shadow-xl shadow-soil-300/30 lg:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-leaf-700 via-leaf-600 to-soil-700 p-10 text-white lg:flex">
          <div className="absolute inset-0 opacity-20 texture-market" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">
              <Leaf className="h-4 w-4" />
              Nepal&apos;s farmer marketplace
            </div>
            <h1 className="mt-8 font-display text-4xl font-bold leading-tight">
              Fresh from the field to your table
            </h1>
            <p className="mt-4 text-white/80 leading-relaxed">
              Join Krishik Bazar to buy directly from local farmers or list your harvest for buyers across Nepal.
            </p>
          </div>
          <div className="relative mt-8 space-y-3 text-sm text-white/70">
            <p>✓ Verified farmer profiles</p>
            <p>✓ Fair prices, no middlemen</p>
            <p>✓ Secure Khalti payments</p>
          </div>
        </div>

        {/* Form panel */}
        <div className="p-8 sm:p-10">
          <div className="mb-8 text-center lg:text-left">
            <p className="font-display text-2xl font-bold text-bark lg:hidden">Krishik Bazar</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-bark">
              {mode === "login" ? "Namaste, welcome back" : "Create your account"}
            </h2>
            <p className="mt-1 text-sm text-mist">
              {mode === "login"
                ? "Sign in to browse produce and manage your orders"
                : "Register as a buyer or farmer to get started"}
            </p>
          </div>

          {/* Toggle tabs */}
          <div className="mb-8 flex rounded-xl bg-soil-50 p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                mode === "login"
                  ? "bg-white text-leaf-700 shadow-sm"
                  : "text-mist hover:text-bark"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                mode === "register"
                  ? "bg-white text-leaf-700 shadow-sm"
                  : "text-mist hover:text-bark"
              }`}
            >
              Register
            </button>
          </div>

          {mode === "login" ? <Login_form /> : <RegisterForm />}

          <p className="mt-6 text-center text-sm text-mist">
            {mode === "login" ? (
              <>
                New here?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="font-semibold text-leaf-600 hover:text-leaf-700"
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
                  className="font-semibold text-leaf-600 hover:text-leaf-700"
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
