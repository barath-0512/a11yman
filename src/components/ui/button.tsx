import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "default" | "sm" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
          variant === "primary" &&
            "bg-accent text-accent-foreground hover:opacity-90",
          variant === "outline" &&
            "border border-border bg-transparent hover:bg-secondary",
          variant === "ghost" && "hover:bg-secondary",
          size === "default" && "h-10 px-4 py-2",
          size === "sm" && "h-9 px-3 text-sm",
          size === "icon" && "h-10 w-10",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
