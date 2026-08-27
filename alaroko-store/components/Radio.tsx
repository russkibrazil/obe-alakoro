import type { InputHTMLAttributes } from "react";

interface RadioProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

function Radio({
  label,
  error,
  className = "",
  id,
  ...props
}: RadioProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className={`
          flex
          items-center
          gap-2
          cursor-pointer
          text-sm
          font-medium
          text-gray-700
          ${props.disabled ? "cursor-not-allowed opacity-50" : ""}
        `}
      >
        <input
          id={id}
          type="radio"
          className={`
            h-4
            w-4
            cursor-pointer
            border-gray-300
            text-violet-600
            focus:ring-2
            focus:ring-violet-200
            disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />

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

export default Radio;