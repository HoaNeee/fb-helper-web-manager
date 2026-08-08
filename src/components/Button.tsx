import { cn } from "@/lib/utils";
import { Link } from "react-router";

export default function Button({
  title,
  icon,
  className,
  onClick,
  text,
  variant = "primary",
  outline = false,
  size = "sm",
  disabled = false,
  children,
  asChild = false,
  link = false,
  to,
  type = "button",
}: {
  title?: string;
  icon?: React.ReactNode;
  text?: string;
  className?: string;
  onClick?: () => void;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "outline";
  outline?: boolean;
  size?: "sm" | "md" | "lg" | "xs";
  disabled?: boolean;
  children?: React.ReactNode;
  asChild?: boolean;
  link?: boolean;
  to?: string;
  type?: "button" | "submit" | "reset";
}) {
  const sizeClass = {
    xs: "text-xs px-1.5 py-1",
    sm: "text-xs px-2 py-1.5",
    md: "text-xs px-2.5 py-2",
    lg: "text-sm px-3 py-2.5",
  };
  const variantClass = {
    primary: outline
      ? `text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30`
      : `bg-(--bg-btn-primary) text-white hover:bg-(--bg-btn-primary)/70 dark:hover:bg-(--bg-btn-primary)/70`,
    secondary: outline
      ? `text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-950/30`
      : `bg-slate-500 text-white hover:bg-slate-600 dark:hover:bg-slate-950/30`,
    success: outline
      ? `text-green-500 hover:bg-green-50 dark:hover:bg-green-950/30`
      : `bg-green-500 text-white hover:bg-green-600 dark:hover:bg-green-950/30`,
    danger: outline
      ? `text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-100 dark:border-red-900/30`
      : `bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-950/30 border border-red-100 dark:border-red-900/30`,
    warning: outline
      ? `text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 border border-yellow-100 dark:border-yellow-900/30`
      : `bg-yellow-500 text-white hover:bg-yellow-600 dark:hover:bg-yellow-950/30 border border-yellow-100 dark:border-yellow-900/30`,
    outline: `text-neutral-700 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700`,
  };

  if (asChild) {
    return (
      <button
        className={`cursor-pointer rounded-lg transition-colors flex items-center gap-1 ${className || ""}`}
        title={title}
        onClick={onClick}
        type={type}
      >
        {children}
      </button>
    );
  }

  if (link) {
    return (
      <Link
        to={to || "/"}
        className={`${sizeClass[size]} border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:bg-(--bg-secondary) dark:hover:bg-(--bg-secondary)/70 dark:text-white cursor-pointer ${size === "xs" ? "rounded-md" : "rounded-lg"} transition-colors flex items-center gap-1 ${className || ""}`}
      >
        {icon || null}
        {text || ""}
      </Link>
    );
  }

  return (
    <button
      className={cn(
        `${sizeClass[size]} ${variantClass[variant]} disabled:bg-gray-500 cursor-pointer rounded-md transition-colors flex items-center gap-1`,
        className,
      )}
      title={title}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children ? (
        children
      ) : (
        <>
          {icon || null}
          {text || ""}
        </>
      )}
    </button>
  );
}
