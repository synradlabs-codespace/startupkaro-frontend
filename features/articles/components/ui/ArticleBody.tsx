// features/articles/components/ui/ArticleBody.tsx

import type { ArticleBlock } from "@/features/articles/data/types";

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
    return (
        <div className="space-y-5 text-gray-700">
            {blocks.map((block, i) => {
                switch (block.type) {
                    case "paragraph":
                        return (
                            <p key={i} className="text-base leading-relaxed">
                                {block.text}
                            </p>
                        );

                    case "heading":
                        return block.level === 2 ? (
                            <h2 key={i} className="font-serif text-xl font-normal text-gray-900 pt-2">
                                {block.text}
                            </h2>
                        ) : (
                            <h3 key={i} className="text-base font-semibold text-gray-900 pt-1">
                                {block.text}
                            </h3>
                        );

                    case "quote":
                        return (
                            <blockquote
                                key={i}
                                className="border-l-4 border-[#FF9933] pl-5 py-0.5"
                            >
                                <p className="text-base italic text-gray-600 leading-relaxed">
                                    {block.text}
                                </p>
                                {block.cite && (
                                    <cite className="text-xs text-gray-400 not-italic mt-2 block">
                                        — {block.cite}
                                    </cite>
                                )}
                            </blockquote>
                        );

                    case "list":
                        return block.style === "bullet" ? (
                            <ul key={i} className="space-y-2 pl-5 list-disc marker:text-[#FF9933]">
                                {block.items.map((item, j) => (
                                    <li key={j} className="text-base leading-relaxed">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <ol key={i} className="space-y-2 pl-5 list-decimal marker:text-[#FF9933]">
                                {block.items.map((item, j) => (
                                    <li key={j} className="text-base leading-relaxed">
                                        {item}
                                    </li>
                                ))}
                            </ol>
                        );

                    case "image":
                        return (
                            <figure key={i} className="my-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={block.src}
                                    alt={block.alt}
                                    className="w-full rounded-2xl object-cover"
                                />
                                {block.caption && (
                                    <figcaption className="text-xs text-gray-400 text-center mt-2">
                                        {block.caption}
                                    </figcaption>
                                )}
                            </figure>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
}
