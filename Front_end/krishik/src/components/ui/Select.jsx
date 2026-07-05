const Select = ({ label, error, id, children, className = "", ...props }) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-bark">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`rounded-xl border border-soil-200 bg-white px-4 py-3 text-sm text-bark outline-none transition focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200 ${error ? "border-red-400" : ""} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
