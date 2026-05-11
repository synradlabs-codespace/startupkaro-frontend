import Image from "next/image";
import type { PortableTextComponents } from "@portabletext/react";
import type {
    ImageBlock,
    QuoteBlock,
    EmbedInstagramBlock,
    EmbedYouTubeBlock,
} from "@/features/articles/types/portable-text";

function extractYouTubeId(url: string): string | null {
    const match = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );
    return match?.[1] ?? null;
}

function extractInstagramId(url: string): string | null {
    const match = url.match(/instagram\.com\/(?:reel|p)\/([A-Za-z0-9_-]+)/);
    return match?.[1] ?? null;
}

export const portableTextComponents: PortableTextComponents = {
    types: {
        image: ({ value }: { value: ImageBlock }) => (
            <figure className="my-6">
                <div
                    className="relative w-full overflow-hidden rounded-2xl"
                    style={{ aspectRatio: value.dimensions?.aspectRatio ?? 16 / 9 }}
                >
                    <Image
                        src={value.url}
                        alt={value.alt || ""}
                        fill
                        className="object-cover"
                        placeholder={value.lqip ? "blur" : "empty"}
                        blurDataURL={value.lqip}
                        sizes="(max-width: 768px) 100vw, 800px"
                    />
                </div>
                {value.caption && (
                    <figcaption className="text-xs text-gray-400 text-center mt-2">
                        {value.caption}
                    </figcaption>
                )}
            </figure>
        ),

        quote: ({ value }: { value: QuoteBlock }) => (
            <blockquote className="border-l-4 border-[#ff7759] pl-5 py-0.5 my-5">
                <p className="text-base italic text-gray-600 leading-relaxed">{value.text}</p>
                {value.cite && (
                    <cite className="text-xs text-gray-400 not-italic mt-2 block">
                        — {value.cite}
                    </cite>
                )}
            </blockquote>
        ),

        embedYouTube: ({ value }: { value: EmbedYouTubeBlock }) => {
            const videoId = extractYouTubeId(value.url);
            if (!videoId) {
                return (
                    <p className="text-sm text-gray-400 my-4">
                        [Invalid YouTube URL: {value.url}]
                    </p>
                );
            }
            return (
                <figure className="my-6">
                    <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                        <iframe
                            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                            title={value.title || "YouTube video"}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full rounded-2xl"
                        />
                    </div>
                    {value.title && (
                        <figcaption className="text-xs text-gray-400 text-center mt-2">
                            {value.title}
                        </figcaption>
                    )}
                </figure>
            );
        },

        embedInstagram: ({ value }: { value: EmbedInstagramBlock }) => {
            const reelId = extractInstagramId(value.url);
            if (!reelId) {
                return (
                    <p className="text-sm text-gray-400 my-4">
                        [Invalid Instagram URL: {value.url}]
                    </p>
                );
            }
            return (
                <figure className="my-6 flex justify-center">
                    <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-gray-50">
                        <div className="relative" style={{ paddingBottom: "177.78%" }}>
                            <iframe
                                src={`https://www.instagram.com/reel/${reelId}/embed/`}
                                scrolling="no"
                                allowTransparency
                                allowFullScreen
                                className="absolute inset-0 w-full h-full border-0"
                                title="Instagram Reel"
                            />
                        </div>
                    </div>
                </figure>
            );
        },
    },

    block: {
        normal: ({ children }) => (
            <p className="text-base leading-relaxed text-gray-700">{children}</p>
        ),
        h2: ({ children }) => (
            <h2 className="font-serif text-xl font-normal text-gray-900 pt-2">{children}</h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-base font-semibold text-gray-900 pt-1">{children}</h3>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#ff7759] pl-5 py-0.5">
                <p className="text-base italic text-gray-600 leading-relaxed">{children}</p>
            </blockquote>
        ),
    },

    list: {
        bullet: ({ children }) => (
            <ul className="space-y-2 pl-5 list-disc marker:text-[#ff7759] text-gray-700">
                {children}
            </ul>
        ),
        number: ({ children }) => (
            <ol className="space-y-2 pl-5 list-decimal marker:text-[#ff7759] text-gray-700">
                {children}
            </ol>
        ),
    },

    listItem: {
        bullet: ({ children }) => (
            <li className="text-base leading-relaxed">{children}</li>
        ),
        number: ({ children }) => (
            <li className="text-base leading-relaxed">{children}</li>
        ),
    },

    marks: {
        link: ({ children, value }) => (
            <a
                href={value?.href}
                target={value?.blank ? "_blank" : undefined}
                rel={value?.blank ? "noreferrer noopener" : undefined}
                className="text-[#17171c] underline underline-offset-2 hover:text-[#ff7759] transition-colors"
            >
                {children}
            </a>
        ),
        code: ({ children }) => (
            <code className="bg-gray-100 rounded px-1 py-0.5 text-sm font-mono text-gray-800">
                {children}
            </code>
        ),
    },
};
