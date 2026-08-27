import type {
  ReactNode,
  SelectHTMLAttributes,
} from "react";

interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

function Select({
  label,
  error,
  className = "",
  id,
  children,
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <select
        id={id}
        className={`
          w-full
          rounded-lg
          border
          bg-white
          px-4
          py-2.5
          text-base
          text-gray-900
          outline-none
          transition-colors
          duration-200
          focus:ring-2
          disabled:cursor-not-allowed
          disabled:bg-gray-100
          disabled:text-gray-500
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-violet-600 focus:ring-violet-200"
          }
          ${className}
        `}
        {...props}
      >
        {children}
      </select>

      {error && (
        <span className="text-sm text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}

export default Select;