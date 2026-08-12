// components/seo/JsonLd.tsx
//
// Renders a single JSON-LD <script> block. Server component — no client JS.

export function JsonLd({ data }: { data: object }) {
    return (
        <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
