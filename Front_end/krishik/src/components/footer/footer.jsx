import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-auto w-full border-t border-border bg-card text-muted-foreground">
      <div className="mx-auto grid w-full gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            <h3 className="font-display text-xl font-bold text-foreground">Krishik Bazar</h3>
          </div>
          <p className="text-sm leading-relaxed">
            Connecting farmers and consumers across India with trust, transparency, and fair pricing.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-primary transition">Home</Link></li>
            <li><Link to="/products" className="hover:text-primary transition">Marketplace</Link></li>
            <li><Link to="/register" className="hover:text-primary transition">Join as Farmer</Link></li>
            <li><Link to="/orders" className="hover:text-primary transition">My Orders</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="font-medium text-foreground">Location:</span>
              <span>Kathmandu, Nepal</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium text-foreground">Email:</span>
              <span>support@krishikbazar.com</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium text-foreground">Phone:</span>
              <span>+91-9811111111</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full border-t border-border">
        <div className="mx-auto px-4 py-6 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Krishik Bazar. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
