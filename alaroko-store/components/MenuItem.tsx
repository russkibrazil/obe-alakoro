import Link from "next/link";
import type { ReactNode } from "react";

interface MenuItemProps {
  label: string;
  href?: string;
  icon?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

function MenuItem({
  label,
  href,
  icon,
  active = false,
  disabled = false,
  onClick,
}: MenuItemProps) {
  const className = `
    group
    flex
    w-full
    items-center
    gap-3
    rounded-lg
    px-3
    py-2.5
    text-sm
    font-medium
    transition-colors
    duration-200
    ${
      active
        ? "bg-violet-100 text-violet-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }
    ${
      disabled
        ? "pointer-events-none cursor-not-allowed opacity-50"
        : "cursor-pointer"
    }
  `;

  const content = (
    <>
      {icon && (
        <span
          className={`
            flex
            h-5
            w-5
            shrink-0
            items-center
            justify-center
            ${
              active
                ? "text-violet-600"
                : "text-gray-500 group-hover:text-gray-700"
            }
          `}
        >
          {icon}
        </span>
      )}

      <span className="truncate">
        {label}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={className}
        aria-current={active ? "page" : undefined}
        aria-disabled={disabled}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-current={active ? "page" : undefined}
    >
      {content}
    </button>
  );
}

export default MenuItem;