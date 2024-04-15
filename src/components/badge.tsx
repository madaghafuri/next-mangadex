"use client";
import { cn } from "@/lib/utils";

export const Badge = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "rounded text-sm px-2 py-1 bg-zinc-800",
        "hover:bg-foreground hover:text-background",
        className
      )}
    >
      {title}
    </span>
  );
};
