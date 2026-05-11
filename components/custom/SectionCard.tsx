import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tint = "sky" | "mint" | "peach" | "cream" | "lavender" | "white";

const tintClasses: Record<Tint, string> = {
  sky: "bg-tint-sky",
  mint: "bg-tint-mint",
  peach: "bg-tint-peach",
  cream: "bg-tint-cream",
  lavender: "bg-tint-lavender",
  white: "bg-canvas",
};

interface SectionCardProps {
  tint?: Tint;
  className?: string;
  children: ReactNode;
}

export function SectionCard({ tint = "white", className, children }: SectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl px-6 py-12 md:px-12 md:py-20 lg:px-16",
        tintClasses[tint],
        className
      )}
    >
      {children}
    </section>
  );
}
