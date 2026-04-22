import { defineQuery } from "next-sanity";

// Shared projection for a category reference
const CATEGORY_PROJECTION = `{
  title,
  "slug": slug.current,
  accentColor,
  iconName
}`;

// Shared projection for article cards (used in list + related)
const ARTICLE_CARD_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  summary,
  publishedAt,
  readTime,
  "coverImage": {
    "url": coverImage.asset->url,
    "alt": coverImage.alt,
    "lqip": coverImage.asset->metadata.lqip,
    "dimensions": coverImage.asset->metadata.dimensions
  },
  "author": author->{ name, designation },
  "categories": categories[]-> ${CATEGORY_PROJECTION}
}`;

export const ARTICLES_LIST_QUERY = defineQuery(`
  *[_type == "article" && defined(slug.current) && defined(publishedAt)
    && ($categorySlug == null || $categorySlug in categories[]->slug.current)]
  | order(publishedAt desc)
  [$start...$end] ${ARTICLE_CARD_PROJECTION}
`);

export const ARTICLES_COUNT_QUERY = defineQuery(`
  count(*[_type == "article" && defined(slug.current) && defined(publishedAt)
    && ($categorySlug == null || $categorySlug in categories[]->slug.current)])
`);

export const ARTICLE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    summary,
    publishedAt,
    updatedAt,
    readTime,
    "coverImage": {
      "url": coverImage.asset->url,
      "alt": coverImage.alt,
      "lqip": coverImage.asset->metadata.lqip,
      "dimensions": coverImage.asset->metadata.dimensions
    },
    "author": author->{ name, designation, "avatar": avatar.asset->url, bio },
    "categories": categories[]-> ${CATEGORY_PROJECTION},
    body[] {
      ...,
      _type == "image" => {
        "url": asset->url,
        alt,
        caption,
        "lqip": asset->metadata.lqip,
        "dimensions": asset->metadata.dimensions
      }
    },
    seo {
      title,
      description,
      keywords,
      "ogImage": ogImage.asset->url
    },
    "relatedManual": relatedArticles[]-> ${ARTICLE_CARD_PROJECTION}
  }
`);

export const RELATED_FALLBACK_QUERY = defineQuery(`
  *[_type == "article"
    && slug.current != $currentSlug
    && !(_id in $excludeIds)
    && count((categories[]->slug.current)[@ in $categorySlugs]) > 0]
  | order(publishedAt desc)
  [0...$limit] ${ARTICLE_CARD_PROJECTION}
`);

export const ALL_SLUGS_QUERY = defineQuery(`
  *[_type == "article" && defined(slug.current)]{ "slug": slug.current }
`);

export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(title asc) {
    title,
    "slug": slug.current,
    accentColor,
    iconName
  }
`);
