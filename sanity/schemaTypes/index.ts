import { categoryType } from "./category";
import { authorType } from "./author";
import { articleType } from "./article";
import { seoType } from "./objects/seo";
import { portableTextBodyType } from "./objects/portableTextBody";
import { embedInstagramType } from "./objects/embedInstagram";
import { embedYouTubeType } from "./objects/embedYouTube";

export const schemaTypes = [
    // Documents
    categoryType,
    authorType,
    articleType,
    // Objects
    seoType,
    portableTextBodyType,
    embedInstagramType,
    embedYouTubeType,
];
