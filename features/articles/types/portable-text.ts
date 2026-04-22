import type { ArbitraryTypedObject } from "@portabletext/types";

export interface ImageBlock extends ArbitraryTypedObject {
    _type: "image";
    url: string;
    alt: string;
    caption?: string;
    lqip?: string;
    dimensions?: { width: number; height: number; aspectRatio: number };
}

export interface QuoteBlock extends ArbitraryTypedObject {
    _type: "quote";
    text: string;
    cite?: string;
}

export interface EmbedInstagramBlock extends ArbitraryTypedObject {
    _type: "embedInstagram";
    url: string;
}

export interface EmbedYouTubeBlock extends ArbitraryTypedObject {
    _type: "embedYouTube";
    url: string;
    title?: string;
}
