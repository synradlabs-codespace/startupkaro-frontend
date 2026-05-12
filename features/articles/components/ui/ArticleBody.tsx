// features/articles/components/ui/ArticleBody.tsx

import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/features/articles/lib/portable-text-components";
import type { ArticleHeading } from "@/features/articles/lib/article-headings";
import type { PortableTextBlock } from "@portabletext/types";

interface ArticleBodyProps {
    blocks: PortableTextBlock[];
    headings?: ArticleHeading[];
}

type HeadingBlockWithId = PortableTextBlock & {
    headingId?: string;
};

export function ArticleBody({ blocks, headings = [] }: ArticleBodyProps) {
    const headingIdsByKey = new Map(headings.map((heading) => [heading.key, heading.id]));
    const blocksWithHeadingIds = blocks.map((block) => {
        const headingId = block._key ? headingIdsByKey.get(block._key) : undefined;
        if (!headingId) return block;

        return {
            ...(block as HeadingBlockWithId),
            headingId,
        };
    });

    return (
        <div className="space-y-5">
            <PortableText value={blocksWithHeadingIds} components={portableTextComponents} />
        </div>
    );
}
