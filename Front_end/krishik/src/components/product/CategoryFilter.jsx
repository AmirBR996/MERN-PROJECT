import { CATEGORIES } from "../../utils/helpers";

const CategoryFilter = ({ selected, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          className={`rounded-full px-5 py-2 text-sm font-medium transition ${
            selected === cat
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-background text-muted-foreground border border-border hover:border-primary hover:text-primary"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
