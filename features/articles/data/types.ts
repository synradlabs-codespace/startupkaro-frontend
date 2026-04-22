// features/articles/data/types.ts

export type ArticleCategory = "Tax" | "Legal" | "Compliance" | "Startup" | "Finance" | "Business";

export interface ArticleAuthor {
    name: string;
    role: string;
    avatarUrl?: string;
    bio?: string;
}

export type ArticleBlock =
    | { type: "paragraph"; text: string }
    | { type: "heading"; level: 2 | 3; text: string }
    | { type: "quote"; text: string; cite?: string }
    | { type: "list"; style: "bullet" | "number"; items: string[] }
    | { type: "image"; src: string; alt: string; caption?: string };

export interface Article {
    slug: string;
    title: string;
    excerpt: string;
    category: ArticleCategory;
    author: ArticleAuthor;
    publishedAt: string;
    readTimeMinutes: number;
    coverImageUrl?: string;
    tags?: string[];
    body: ArticleBlock[];
    seo?: { title?: string; description?: string };
}
