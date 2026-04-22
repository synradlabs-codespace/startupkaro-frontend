// features/articles/components/ui/ArticleBody.tsx

import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/features/articles/lib/portable-text-components";
import type { PortableTextBlock } from "@portabletext/types";

export function ArticleBody({ blocks }: { blocks: PortableTextBlock[] }) {
    return (
        <div className="space-y-5">
            <PortableText value={blocks} components={portableTextComponents} />
        </div>
    );
}
