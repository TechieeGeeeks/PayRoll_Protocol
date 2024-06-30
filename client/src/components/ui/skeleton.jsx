import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-full opacity-10 bg-white dark:bg-darkBg border-2 border-border dark:border-darkBorder",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
