"use client";

import { ArrowRight, Briefcase, LogIn, MessageCircle, Rocket, UserRound, Zap, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ColorVariant = "primary" | "ink" | "storm";
type IconName = "arrow-right" | "briefcase" | "log-in" | "message-circle" | "rocket" | "user-round" | "zap";

const colorMap: Record<ColorVariant, string> = {
    primary: "#296ef9",
    ink: "#1a1a1a",
    storm: "#356373",
};

const iconMap: Record<IconName, LucideIcon> = {
    "arrow-right": ArrowRight,
    briefcase: Briefcase,
    "log-in": LogIn,
    "message-circle": MessageCircle,
    rocket: Rocket,
    "user-round": UserRound,
    zap: Zap,
};

interface FlowButtonProps {
    text?: string;
    icon?: LucideIcon;
    iconName?: IconName;
    href?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    className?: string;
    wrapperClassName?: string;
    disabled?: boolean;
    colorVariant?: ColorVariant;
}

interface FlowSecondaryButtonProps {
    text?: string;
    icon?: LucideIcon;
    iconName?: IconName;
    showIcon?: boolean;
    href?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    className?: string;
    wrapperClassName?: string;
    disabled?: boolean;
}

export function FlowButton({
    text = "Book Now",
    icon,
    iconName = "rocket",
    href,
    onClick,
    type = "button",
    disabled,
    className,
    wrapperClassName,
    colorVariant = "primary",
}: FlowButtonProps) {
    const hex = colorMap[colorVariant];
    const Icon = icon ?? iconMap[iconName];

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
                    textEl.style.transform = entering ? "translateX(1.5rem)" : "translateX(0)";
                }
    };

    const base = cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-md border-[1.5px] px-8 py-3 text-sm font-medium cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
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
            <Link href={href} onClick={onClick} className={cn("group inline-flex", wrapperClassName)}>
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

export function FlowSecondaryButton({
    text = "Learn More",
    icon,
    iconName = "arrow-right",
    showIcon = true,
    href,
    onClick,
    type = "button",
    disabled,
    className,
    wrapperClassName,
}: FlowSecondaryButtonProps) {
    const Icon = icon ?? iconMap[iconName];

    const base = cn(
        "group inline-flex items-center justify-center gap-2 rounded-md border-[1.5px] border-primary-brand bg-canvas/65 px-8 py-3 text-sm font-medium text-primary-brand cursor-pointer transition-all duration-[450ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-primary-brand hover:text-white active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-brand focus-visible:ring-offset-2",
        className,
        disabled && "opacity-60 pointer-events-none"
    );

    const content = (
        <>
            <span className="relative z-[1]">{text}</span>
            {showIcon && <Icon className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />}
        </>
    );

    if (href) {
        return (
            <Link href={href} onClick={onClick} className={cn("group inline-flex", wrapperClassName)}>
                <span className={base}>{content}</span>
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
            <span className={base}>{content}</span>
        </button>
    );
}
