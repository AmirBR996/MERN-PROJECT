import { CATEGORIES } from "../../utils/helpers";

const CategoryFilter = ({ selected, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            selected === cat
              ? "bg-leaf-600 text-white shadow-md shadow-leaf-600/20"
              : "bg-white text-mist border border-soil-200 hover:border-leaf-300 hover:text-leaf-700"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
