import { getTechArticles } from "@/features/articles/api/articles.service";
import { TechServicesPage } from "@/features/marketing/components/TechServicesPage";

export default async function Page() {
    const articles = await getTechArticles(3);
    return <TechServicesPage articles={articles} />;
}
