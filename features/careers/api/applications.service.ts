import { apiClient } from "@/services/api-client";
import type { ApiResponse } from "@/types/api.types";
import type { ApplicationPayload } from "@/features/careers/types/application.types";

export async function submitJobApplication(payload: ApplicationPayload) {
    const { data } = await apiClient.post<ApiResponse<{ id: string }>>(
        "/careers/applications",
        payload,
    );
    return data;
}
