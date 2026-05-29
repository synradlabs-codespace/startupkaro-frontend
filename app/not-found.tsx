import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
        {/* Blue chevron decorations */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-64 bg-primary-brand hidden lg:block"
          style={{ clipPath: "polygon(0 0, 60% 0, 100% 100%, 40% 100%)" }}
        />
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-64 bg-primary-brand hidden lg:block"
          style={{ clipPath: "polygon(40% 0, 100% 0, 60% 100%, 0 100%)" }}
        />

        {/* Card */}
        <div className="bg-paper rounded-xl shadow-[0_2px_8px_rgba(26,26,26,0.08)] border border-hairline px-8 py-12 max-w-lg w-full text-center">
          {/* 404 display */}
          <p className="font-display font-medium text-primary-brand text-[72px] leading-none tracking-tight select-none">
            404
          </p>

          <h1 className="font-display font-medium text-ink text-[32px] leading-tight mt-4">
            Page not found
          </h1>

          <p className="font-sans text-graphite text-base leading-snug mt-4">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>

          {/* Home button */}
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-primary-brand text-white font-sans font-semibold text-sm uppercase tracking-[0.7px] px-6 py-3 rounded-md h-11 transition-colors hover:bg-primary-deep"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
