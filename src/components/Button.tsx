import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

type ButtonProps = {
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
  ref?: React.RefObject<HTMLButtonElement>;
};

function Button({
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
  ref,
}: ButtonProps) {
  const sizeClass = {
    xs: "text-xs px-2 py-1 font-medium",
    sm: "text-xs px-3 py-1.5 font-medium",
    md: "text-sm px-3.5 py-1.5 font-medium",
    lg: "text-sm px-4 py-2 font-medium",
  };
  const variantClass = {
    primary: outline
      ? `text-(--bg-btn-primary) hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-(--bg-btn-primary)/50`
      : `bg-(--bg-btn-primary) text-white hover:opacity-85`,
    secondary: outline
      ? `text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-600`
      : `bg-slate-500 text-white hover:bg-slate-600`,
    success: outline
      ? `text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 border border-green-300`
      : `bg-green-500 text-white hover:bg-green-600`,
    danger: outline
      ? `text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-300 dark:border-red-800`
      : `bg-red-500 text-white hover:bg-red-600`,
    warning: outline
      ? `text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 border border-yellow-300`
      : `bg-yellow-500 text-white hover:bg-yellow-600`,
    outline: `text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700`,
  };

  if (asChild) {
    return (
      <button
        ref={ref}
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
        `${sizeClass[size]} ${variantClass[variant]} disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-lg transition-all flex items-center gap-1.5`,
        className,
      )}
      ref={ref}
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

type ButtonConfirmProps = {
  title?: string;
  titleConfirm?: string;
  onConfirm?: () => void;
  variant?: "danger" | "warning" | "primary" | "success";
};

function ButtonConfirm({
  title,
  titleConfirm,
  onConfirm,
  variant,
}: ButtonConfirmProps) {
  const [isConfirm, setIsConfirm] = useState(false);

  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isConfirm) {
      setTimeout(() => {
        setIsConfirm(false);
      }, 3000);
    }
  }, [isConfirm]);

  return (
    <Button
      text={isConfirm ? titleConfirm : title}
      variant={variant ? variant : isConfirm ? "danger" : "primary"}
      onClick={() => {
        if (!isConfirm) {
          setIsConfirm(true);
        } else {
          onConfirm?.();
        }
      }}
      ref={ref}
    />
  );
}

export { Button, ButtonConfirm };
