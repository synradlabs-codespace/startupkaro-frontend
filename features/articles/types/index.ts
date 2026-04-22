import type { PortableTextBlock } from "@portabletext/types";

export interface Category {
    title: string;
    slug: string;
    accentColor?: string;
    iconName?: string;
}

export interface Author {
    name: string;
    designation: string;
    avatar?: string;
    bio?: string;
}

export interface SanityImage {
    url: string;
    alt?: string;
    lqip?: string;
    dimensions?: {
        width: number;
        height: number;
        aspectRatio: number;
    };
}

export interface ArticleCard {
    _id: string;
    slug: string;
    title: string;
    summary: string;
    publishedAt: string;
    readTime?: number;
    coverImage: SanityImage;
    author: Pick<Author, "name" | "designation">;
    categories: Category[];
}

export interface Article extends Omit<ArticleCard, "author"> {
    updatedAt?: string;
    author: Author;
    body: PortableTextBlock[];
    seo?: {
        title?: string;
        description?: string;
        keywords?: string[];
        ogImage?: string;
    };
}
