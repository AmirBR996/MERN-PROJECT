import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-auto w-full border-t border-soil-200 bg-bark text-soil-200">
      <div className="mx-auto grid w-full gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-leaf-400" />
            <h3 className="font-display text-xl font-bold text-white">Krishik Bazar</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-soil-300">
            Connecting farmers and consumers across Nepal with trust, transparency, and fair pricing.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/products" className="hover:text-white transition">Marketplace</Link></li>
            <li><Link to="/register" className="hover:text-white transition">Join as Farmer</Link></li>
            <li><Link to="/orders" className="hover:text-white transition">My Orders</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Kathmandu, Nepal</li>
            <li>support@krishikbazar.com</li>
            <li>+977-98XXXXXXXX</li>
          </ul>
        </div>
      </div>

      <div className="w-full border-t border-soil-700">
        <div className="mx-auto px-4 py-4 text-center text-xs text-soil-400 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Krishik Bazar. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
