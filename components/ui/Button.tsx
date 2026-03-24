import Link from "next/link";
import { type ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: Variant;
  size?: Size;
}

interface ButtonAsButton extends ButtonBaseProps, Omit<ComponentPropsWithoutRef<"button">, keyof ButtonBaseProps> {
  href?: undefined;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm",
  secondary:
    "bg-navy-800 text-white hover:bg-navy-700 active:bg-navy-900 shadow-sm",
  outline:
    "border border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100",
  ghost:
    "text-slate-600 hover:text-navy-800 hover:bg-slate-100",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-2.5 text-sm rounded-lg",
  lg: "px-8 py-3.5 text-base rounded-xl",
};

const base = "inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

export default function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", children } = props;
  const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${(props as ButtonAsLink).className ?? ""}`;

  if ("href" in props && props.href !== undefined) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, ...rest } = props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
