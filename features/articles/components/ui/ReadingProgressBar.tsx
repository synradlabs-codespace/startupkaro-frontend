// features/articles/components/ui/ReadingProgressBar.tsx

"use client";

import { useEffect, useState } from "react";

export function ReadingProgressBar({ endElementId }: { endElementId?: string }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        function update() {
            const scrollTop = window.scrollY;
            const el = endElementId ? document.getElementById(endElementId) : null;
            const documentEnd = document.documentElement.scrollHeight - window.innerHeight;
            const targetTop = el
                ? el.getBoundingClientRect().top + window.scrollY
                : documentEnd;
            const target = el
                ? Math.max(1, targetTop - window.innerHeight + 1)
                : documentEnd;

            setProgress(target > 0 ? Math.min(100, (scrollTop / target) * 100) : 0);
        }

        window.addEventListener("scroll", update, { passive: true });
        update();
        return () => window.removeEventListener("scroll", update);
    }, [endElementId]);

    return (
        <div className="pointer-events-none fixed left-0 top-0 z-60 h-1 w-screen bg-hairline">
            <div
                className="h-full origin-left bg-primary-brand transition-all duration-75"
                style={{
                    width: `${progress}%`,
                }}
            />
        </div>
    );
}
