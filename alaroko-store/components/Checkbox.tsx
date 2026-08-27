import type { InputHTMLAttributes } from "react";

interface CheckboxProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

function Checkbox({
  label,
  error,
  className = "",
  id,
  disabled,
  ...props
}: CheckboxProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className={`
          flex
          items-center
          gap-3
          text-sm
          font-medium
          text-gray-700
          ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        `}
      >
        <div className="relative">
          <input
            id={id}
            type="checkbox"
            disabled={disabled}
            className={`
              peer
              sr-only
              ${className}
            `}
            {...props}
          />

          <div
            className="
              h-6
              w-11
              rounded-full
              bg-gray-300
              transition-colors
              duration-200
              peer-checked:bg-violet-600
              peer-focus-visible:ring-2
              peer-focus-visible:ring-violet-300
              peer-disabled:cursor-not-allowed
              peer-disabled:opacity-50
            "
          />

          <div
            className="
              absolute
              left-1
              top-1
              h-4
              w-4
              rounded-full
              bg-white
              shadow-sm
              transition-transform
              duration-200
              peer-checked:translate-x-5
            "
          />
        </div>

        {label && <span>{label}</span>}
      </label>

      {error && (
        <span className="text-sm text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}

export default Checkbox;