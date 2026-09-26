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
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm",
    outline:
      "border-2 border-primary text-primary hover:bg-primary/5",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-muted",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  };

  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;
