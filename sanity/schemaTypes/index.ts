import { categoryType } from "./category";
import { authorType } from "./author";
import { articleType } from "./article";
import { jobType } from "./job";
import { serviceType } from "./service";
import { seoType } from "./objects/seo";
import { portableTextBodyType } from "./objects/portableTextBody";
import { embedInstagramType } from "./objects/embedInstagram";
import { embedYouTubeType } from "./objects/embedYouTube";

export const schemaTypes = [
    // Documents
    categoryType,
    authorType,
    articleType,
    jobType,
    serviceType,
    // Objects
    seoType,
    portableTextBodyType,
    embedInstagramType,
    embedYouTubeType,
];
