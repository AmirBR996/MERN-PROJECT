import { Link } from "react-router-dom";

const Button = ({
  children,
  variant = "primary",
  className = "",
  as: Component = "button",
  ...props
}) => {
  const variants = {
    primary:
      "bg-stone-900 text-amber-50 hover:bg-emerald-800 shadow-sm",
    secondary:
      "bg-stone-100 text-stone-900 hover:bg-stone-200 border border-stone-200",
    outline:
      "border-2 border-emerald-700 text-emerald-800 hover:bg-emerald-50",
    harvest:
      "bg-orange-600 text-white hover:bg-orange-700 shadow-sm",
    ghost: "text-stone-500 hover:text-stone-900 hover:bg-stone-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;
