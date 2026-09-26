import React from "react";

const CategoryChips = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`flex items-center gap-2 whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
            activeCategory === category.id
              ? "bg-primary text-white border-primary shadow-md scale-105"
              : "bg-white text-stone-600 border-stone-200 hover:border-primary hover:text-primary hover:bg-stone-50"
          }`}
        >
          {category.icon && <span className="text-lg">{category.icon}</span>}
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryChips;
