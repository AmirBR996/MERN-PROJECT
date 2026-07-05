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
      "bg-leaf-600 text-white hover:bg-leaf-700 shadow-md shadow-leaf-600/20",
    secondary:
      "bg-soil-100 text-bark hover:bg-soil-200 border border-soil-200",
    outline:
      "border-2 border-leaf-600 text-leaf-700 hover:bg-leaf-50",
    harvest:
      "bg-harvest-500 text-white hover:bg-harvest-600 shadow-md shadow-harvest-500/20",
    ghost: "text-mist hover:text-bark hover:bg-soil-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;
