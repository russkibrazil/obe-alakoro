import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

function Button({
  children,
  variant = "primary",
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-violet-600 text-white hover:bg-violet-700",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300",
  };

  return (
    <button
      type={type}
      className={`
        px-5 py-2.5
        rounded-lg
        font-semibold
        text-base
        transition-colors
        duration-200
        cursor-pointer
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;