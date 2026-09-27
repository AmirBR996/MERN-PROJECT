import { Link } from "react-router-dom";
import { Leaf, MapPin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-auto w-full bg-green-900 text-green-50">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700">
              <Leaf className="h-5 w-5 text-green-200" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">
              Krishik Bazar
            </h3>
          </div>

          <p className="max-w-sm text-sm leading-6 text-green-100">
            Connecting farmers and consumers across Nepal with trust,
            transparency, and fair pricing.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
            Quick Links
          </h4>

          <ul className="space-y-3 text-sm">
            <li>
              <Link
                to="/"
                className="text-green-100 transition hover:text-white"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="text-green-100 transition hover:text-white"
              >
                Marketplace
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="text-green-100 transition hover:text-white"
              >
                Join as Farmer
              </Link>
            </li>
            <li>
              <Link
                to="/orders"
                className="text-green-100 transition hover:text-white"
              >
                My Orders
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
            Contact Us
          </h4>

          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green-300" />
              <span className="text-green-100">Kathmandu, Nepal</span>
            </li>

            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-green-300" />
              <a
                href="mailto:support@krishikbazar.com"
                className="text-green-100 transition hover:text-white"
              >
                support@krishikbazar.com
              </a>
            </li>

            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-green-300" />
              <a
                href="tel:+9779811111111"
                className="text-green-100 transition hover:text-white"
              >
                +977-9811111111
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-green-700">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-center text-xs text-green-200 sm:px-6 md:flex-row lg:px-8">
          <p>
            © {new Date().getFullYear()} Krishik Bazar. All rights reserved.
          </p>

          <div className="flex gap-5">
            <Link
              to="/privacy"
              className="transition hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="transition hover:text-white"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
