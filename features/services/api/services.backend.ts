export interface BackendService {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number; // paise
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export async function getBackendServices(): Promise<BackendService[]> {
    try {
        const res = await fetch(`${API_URL}/customer/services`, {
            next: { revalidate: 300, tags: ["backend-service"] },
        });
        if (!res.ok) return [];
        const json = await res.json();
        return (json?.data ?? []) as BackendService[];
    } catch {
        return [];
    }
}

// Fetches the list and finds by slug.
// Structured so it can switch to GET /customer/services/:slug once that endpoint ships
// without touching any callers — just replace the body here.
export async function getBackendServiceBySlug(slug: string): Promise<BackendService | undefined> {
    const services = await getBackendServices();
    return services.find((s) => s.slug === slug);
}
