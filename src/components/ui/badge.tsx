import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "neutral",
  children,
}: {
  className?: string;
  tone?: "neutral" | "accent" | "success" | "warning" | "destructive";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tone === "neutral" && "bg-secondary text-secondary-foreground",
        tone === "accent" && "bg-accent/15 text-accent-text",
        tone === "success" && "bg-success/15 text-success-text",
        tone === "warning" && "bg-warning/15 text-warning-text",
        tone === "destructive" && "bg-destructive/15 text-destructive-text",
        className
      )}
    >
      {children}
    </span>
  );
}
