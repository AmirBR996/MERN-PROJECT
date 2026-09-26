import React from "react";
import { CheckCircle2, Leaf, MapPin } from "lucide-react";

const BADGE_CONFIG = {
  verified: {
    icon: CheckCircle2,
    color: "bg-blue-100 text-blue-700",
    label: "Verified",
  },
  organic: {
    icon: Leaf,
    color: "bg-green-100 text-green-700",
    label: "Organic",
  },
  local: {
    icon: MapPin,
    color: "bg-orange-100 text-orange-700",
    label: "Local",
  },
};

const TrustBadge = ({ type }) => {
  const config = BADGE_CONFIG[type] || BADGE_CONFIG.verified;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${config.color}`}>
      <Icon className="h-3 w-3" />
      <span className="text-[10px] font-bold uppercase tracking-wider">{config.label}</span>
    </div>
  );
};

export default TrustBadge;
