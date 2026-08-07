"use client";

import { useEffect, useRef, type CSSProperties, type HTMLAttributes } from "react";

type MagnetLineStyle = CSSProperties & {
    "--rotate": string;
};

interface MagnetLinesProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "className"> {
    rows?: number;
    columns?: number;
    containerSize?: string;
    lineColor?: string;
    lineWidth?: string;
    lineHeight?: string;
    baseAngle?: number;
    className?: string;
    style?: CSSProperties;
}

export function MagnetLines({
    rows = 9,
    columns = 9,
    containerSize = "80vmin",
    lineColor = "#efefef",
    lineWidth = "1vmin",
    lineHeight = "6vmin",
    baseAngle = -10,
    className = "",
    style = {},
    ...props
}: MagnetLinesProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const items = Array.from(container.querySelectorAll<HTMLSpanElement>("span"));
        if (!items.length) return;

        let isVisible = true;
        const visibilityObserver = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
        });
        visibilityObserver.observe(container);

        // Re-measure every span's center fresh each time we actually apply an update
        // (not on every raw pointermove) — the container's on-screen position can
        // shift from an ancestor's scroll-reveal transform without the container's
        // own size changing, so a cache keyed only on size/mount goes stale.
        const applyPointer = (pointer: { x: number; y: number }) => {
            items.forEach((item) => {
                const rect = item.getBoundingClientRect();
                const centerX = rect.x + rect.width / 2;
                const centerY = rect.y + rect.height / 2;

                const b = pointer.x - centerX;
                const a = pointer.y - centerY;
                const c = Math.sqrt(a * a + b * b) || 1;
                const r = ((Math.acos(b / c) * 180) / Math.PI) * (pointer.y > centerY ? 1 : -1);

                item.style.setProperty("--rotate", `${r}deg`);
            });
        };

        // Coalesce pointermove events to at most one measure+update pass per frame —
        // pointermove can fire far more often than the screen repaints, so this is
        // the expensive part to cut, not the geometry read itself.
        let rafId: number | null = null;
        let latestPointer: { x: number; y: number } | null = null;

        const handlePointerMove = (e: PointerEvent) => {
            if (!isVisible) return;
            latestPointer = { x: e.x, y: e.y };
            if (rafId !== null) return;
            rafId = requestAnimationFrame(() => {
                rafId = null;
                if (latestPointer) applyPointer(latestPointer);
            });
        };

        window.addEventListener("pointermove", handlePointerMove, { passive: true });

        const middleIndex = Math.floor(items.length / 2);
        const middleRect = items[middleIndex].getBoundingClientRect();
        applyPointer({ x: middleRect.x, y: middleRect.y });

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            visibilityObserver.disconnect();
            if (rafId !== null) cancelAnimationFrame(rafId);
        };
    }, [rows, columns]);

    const total = rows * columns;
    const spans = Array.from({ length: total }, (_, i) => (
        <span
            key={i}
            className="block origin-center transition-transform duration-150"
            style={{
                backgroundColor: lineColor,
                width: lineWidth,
                height: lineHeight,
                "--rotate": `${baseAngle}deg`,
                transform: "rotate(var(--rotate))",
            } as MagnetLineStyle}
        />
    ));

    return (
        <div
            ref={containerRef}
            className={`grid place-items-center ${className}`}
            style={{
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                width: containerSize,
                height: containerSize,
                ...style,
            }}
            {...props}
        >
            {spans}
        </div>
    );
}

export default MagnetLines;
