import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type WebhookBody = {
    _type: string;
    slug?: { current?: string };
};

export async function POST(req: NextRequest) {
    try {
        const secret = process.env.SANITY_REVALIDATE_SECRET;
        const { isValidSignature, body } = await parseBody<WebhookBody>(req, secret);

        if (secret && !isValidSignature) {
            return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
        }

        if (!body?._type) {
            return NextResponse.json({ message: "Missing _type in body" }, { status: 400 });
        }

        const { _type, slug } = body;

        if (_type === "article") {
            revalidateTag("article", "default");
            if (slug?.current) revalidateTag(`article:${slug.current}`, "default");
        } else if (_type === "category") {
            revalidateTag("category", "default");
            revalidateTag("article", "default");
        } else if (_type === "author") {
            revalidateTag("article", "default");
        } else if (_type === "job") {
            revalidateTag("job", "default");
            if (slug?.current) revalidateTag(`job:${slug.current}`, "default");
        }

        return NextResponse.json({
            revalidated: true,
            type: _type,
            slug: slug?.current ?? null,
            now: Date.now(),
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ message }, { status: 500 });
    }
}
