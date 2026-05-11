"use client";

import { Rocket, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ColorVariant = "saffron" | "navy" | "green";

const colorMap: Record<ColorVariant, string> = {
    saffron: "#ff7759",
    navy: "#17171c",
    green: "#003c33",
};

interface FlowButtonProps {
    text?: string;
    icon?: LucideIcon;
    href?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    className?: string;
    wrapperClassName?: string;
    disabled?: boolean;
    colorVariant?: ColorVariant;
}

export function FlowButton({
    text = "Book Now",
    icon: Icon = Rocket,
    href,
    onClick,
    type = "button",
    disabled,
    className,
    wrapperClassName,
    colorVariant = "saffron",
}: FlowButtonProps) {
    const hex = colorMap[colorVariant];

    const applyHover = (el: HTMLElement, entering: boolean) => {
        el.style.backgroundColor = entering ? "white" : hex;
        el.style.borderColor = hex;
        el.style.color = entering ? hex : "white";
        const icons = el.querySelectorAll<HTMLElement>(".flow-icon");
        const textEl = el.querySelector<HTMLElement>(".flow-text");
        icons.forEach((icon) => {
            icon.style.color = entering ? hex : "white";
        });
                if (textEl) {
                    textEl.style.color = entering ? hex : "white";
                    textEl.style.transform = entering ? "translateX(1rem)" : "translateX(0)";
                }
    };

    const base = cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full border-[1.5px] px-8 py-3 text-sm font-medium cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        className,
        disabled && "opacity-60 pointer-events-none"
    );

    const defaultStyle = {
        backgroundColor: hex,
        borderColor: hex,
        color: "white",
    };

    const renderBtn = () => (
        <span
            className={base}
            style={defaultStyle}
            onMouseEnter={(e) => applyHover(e.currentTarget, true)}
            onMouseLeave={(e) => applyHover(e.currentTarget, false)}
        >
            <Icon
                className="flow-icon absolute left-[-25%] w-4 h-4 rotate-[-90deg] z-[9] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:left-4 group-hover:rotate-0"
            />
            <span className="flow-text relative z-[1] -translate-x-3 transition-all duration-[800ms] ease-out">
                {text}
            </span>
            <Icon
                className="flow-icon absolute right-4 w-4 h-4 rotate-[-90deg] z-[9] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:right-[-25%] group-hover:rotate-0"
            />
        </span>
    );

    if (href) {
        return (
            <Link href={href} className={cn("group inline-flex", wrapperClassName)}>
                {renderBtn()}
            </Link>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={cn("group inline-flex", wrapperClassName)}
        >
            {renderBtn()}
        </button>
    );
}
