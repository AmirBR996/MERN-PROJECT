import { CATEGORIES } from "../../utils/helpers";

const CategoryFilter = ({ selected, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            selected === cat
              ? "bg-emerald-800 text-white shadow-sm"
              : "bg-white text-stone-500 border border-stone-200 hover:border-emerald-600 hover:text-emerald-800"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
