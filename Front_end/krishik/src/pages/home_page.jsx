import React from "react";
import Footer from "../components/footer./footer";
import { Link } from "react-router";
export const Home_page = () => {
  return (
    <main className="min-h-screen flex flex-col">
      {/* HERO SECTION */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 py-20 bg-linear-to-r from-green-50 to-white">
        <div className="max-w-xl space-y-6">
          <p className="text-green-600 font-semibold uppercase tracking-wide">
            Empowering Nepal&apos;s Agricultural Community
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Fresh, organic produce <br />
            <span className="text-green-600">directly from farmers</span>
          </h1>

          <p className="text-gray-600">
            Discover locally grown products, support Nepali farmers,
            and enjoy fair prices without middlemen.
          </p>

          <div className="flex gap-4">
            <button className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
              Shop Now
            </button>
            <Link to ={'/register'}>
            <button className="px-6 py-3 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition">
              Create Profile
            </button>
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-10 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          How Krishik Bazar Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 border rounded-lg hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              1. Farmers List Products
            </h3>
            <p className="text-gray-600">
              Local farmers upload fresh produce directly to the platform.
            </p>
          </div>

          <div className="p-6 border rounded-lg hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              2. Customers Order
            </h3>
            <p className="text-gray-600">
              Buyers browse, compare prices, and place orders easily.
            </p>
          </div>

          <div className="p-6 border rounded-lg hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              3. Direct Delivery
            </h3>
            <p className="text-gray-600">
              Products reach customers fresh — no middlemen involved.
            </p>
          </div>
        </div>
      </section>

      <footer>
        <Footer/>
      </footer>
    </main>
  );
};
