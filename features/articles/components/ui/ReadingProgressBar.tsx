// features/articles/components/ui/ReadingProgressBar.tsx

"use client";

import { useEffect, useState } from "react";

export function ReadingProgressBar({ endElementId }: { endElementId?: string }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        function update() {
            const scrollTop = window.scrollY;
            const el = endElementId ? document.getElementById(endElementId) : null;
            const target = el
                ? el.getBoundingClientRect().top + window.scrollY
                : document.documentElement.scrollHeight - window.innerHeight;
            setProgress(target > 0 ? Math.min(100, (scrollTop / target) * 100) : 0);
        }

        window.addEventListener("scroll", update, { passive: true });
        return () => window.removeEventListener("scroll", update);
    }, [endElementId]);

    return (
        <div className="fixed top-0 left-0 z-60 h-0.75 w-screen pointer-events-none">
            <div
                className="h-full transition-all duration-75 origin-left"
                style={{
                    width: `${progress}%`,
                    background: "linear-gradient(to right, #ff7759 33.33%, #17171c 33.33%, #17171c 66.66%, #003c33 66.66%)",
                    backgroundSize: "100vw 100%",
                    backgroundAttachment: "fixed",
                }}
            />
        </div>
    );
}
