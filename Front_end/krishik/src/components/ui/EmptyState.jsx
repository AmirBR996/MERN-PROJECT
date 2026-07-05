import { Link } from "react-router-dom";
import { PackageOpen } from "lucide-react";
import Button from "./Button";

const EmptyState = ({ title, description, actionLabel, actionTo, icon: Icon = PackageOpen }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-soil-200 bg-soil-50/50 px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-600">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="font-display text-xl font-bold text-bark">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-mist">{description}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="mt-6">
          <Button>{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
