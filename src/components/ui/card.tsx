import React from "react";

function cn(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-card text-card-foreground border border-border rounded-2xl shadow-md", className)}
      {...props}
    >
      {children}
    </div>
  );
}