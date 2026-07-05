import { Minus, Plus } from "lucide-react";

const QuantitySelector = ({ value, onChange, min = 1, max = 99, disabled = false }) => {
  return (
    <div className="inline-flex items-center rounded-xl border border-soil-200 bg-white">
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="rounded-l-xl px-3 py-2 text-mist transition hover:bg-soil-50 hover:text-bark disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-10 px-2 text-center text-sm font-semibold text-bark">
        {value}
      </span>
      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="rounded-r-xl px-3 py-2 text-mist transition hover:bg-soil-50 hover:text-bark disabled:opacity-40"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
};

export default QuantitySelector;
