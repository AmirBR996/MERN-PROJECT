import React from 'react'

const Footer = () => {
  return (
    <main className="mt-auto bg-gray-900 text-gray-300 px-10 py-12">
        <div className="grid md:grid-cols-3 gap-10">
          
          {/* BRAND */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Krishik Bazar
            </h3>
            <p className="text-sm">
              Connecting farmers and consumers across Nepal with trust,
              transparency, and fair pricing.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Home</li>
              <li className="hover:text-white cursor-pointer">Products</li>
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Profile</li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">
              Contact Us
            </h4>
            <p className="text-sm">📍 Kathmandu, Nepal</p>
            <p className="text-sm">📧 support@krishikbazar.com</p>
            <p className="text-sm">📞 +977-98XXXXXXXX</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm">
          © {new Date().getFullYear()} Krishik Bazar. All rights reserved.
        </div>
      </main>
  )
}

export default Footer