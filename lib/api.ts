// API Configuration and Client for CI/CD Fixer Agent
import type {
    HealthResponse,
    FailuresResponse,
    FailureDetailResponse,
    FixesResponse,
    FixActionResponse,
    DashboardResponse,
    PatternsResponse,
    EffectivenessResponse,
    RepositoryAnalyticsResponse,
    AnalysisResponse,
} from "./types";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://ci-cd-fixer-agent-backend.onrender.com";

// API Client
class APIClient {
    private baseURL: string;

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    private async request<T>(
        endpoint: string,
        options?: RequestInit
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(
                `API Error: ${response.status} ${response.statusText}`
            );
        }

        return response.json();
    }

    // Health Check
    async getHealth(): Promise<HealthResponse> {
        return this.request<HealthResponse>("/health");
    }

    // Failures
    async getFailures(params?: {
        limit?: number;
        offset?: number;
        status?: string;
    }): Promise<FailuresResponse> {
        const searchParams = new URLSearchParams();
        if (params?.limit) searchParams.set("limit", params.limit.toString());
        if (params?.offset)
            searchParams.set("offset", params.offset.toString());
        if (params?.status) searchParams.set("status", params.status);

        const query = searchParams.toString();
        return this.request<FailuresResponse>(
            `/failures${query ? `?${query}` : ""}`
        );
    }

    async getFailure(id: string): Promise<FailureDetailResponse> {
        return this.request<FailureDetailResponse>(`/failures/${id}`);
    }

    // Fixes
    async getFixes(): Promise<FixesResponse> {
        return this.request<FixesResponse>("/fixes");
    }

    async approveFix(id: string, comment?: string): Promise<FixActionResponse> {
        return this.request<FixActionResponse>(`/fixes/${id}/approve`, {
            method: "POST",
            body: JSON.stringify({ action: "approve", comment }),
        });
    }

    async rejectFix(id: string, comment?: string): Promise<FixActionResponse> {
        return this.request<FixActionResponse>(`/fixes/${id}/reject`, {
            method: "POST",
            body: JSON.stringify({ action: "reject", comment }),
        });
    }

    // Analytics
    async getDashboard(): Promise<DashboardResponse> {
        return this.request<DashboardResponse>("/analytics/dashboard");
    }

    async getAnalytics(): Promise<EffectivenessResponse> {
        return this.request<EffectivenessResponse>("/analytics/effectiveness");
    }

    async getPatterns(daysBack?: number): Promise<PatternsResponse> {
        const query = daysBack ? `?days_back=${daysBack}` : "";
        return this.request<PatternsResponse>(`/analytics/patterns${query}`);
    }

    async getEffectiveness(): Promise<EffectivenessResponse> {
        return this.request<EffectivenessResponse>("/analytics/effectiveness");
    }

    async getRepositoryAnalytics(
        owner: string,
        repo: string
    ): Promise<RepositoryAnalyticsResponse> {
        return this.request<RepositoryAnalyticsResponse>(
            `/analytics/repository/${owner}/${repo}`
        );
    }

    // Manual Analysis
    async triggerAnalysis(data: {
        owner: string;
        repo: string;
        run_id: number;
    }): Promise<AnalysisResponse> {
        return this.request<AnalysisResponse>("/analyze", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
}

export const apiClient = new APIClient();

// Export individual API functions for use with SWR
export const api = {
    getHealth: () => apiClient.getHealth(),
    getFailures: (params?: Parameters<typeof apiClient.getFailures>[0]) =>
        apiClient.getFailures(params),
    getFailure: (id: string) => apiClient.getFailure(id),
    getFixes: () => apiClient.getFixes(),
    approveFix: (id: string, comment?: string) =>
        apiClient.approveFix(id, comment),
    rejectFix: (id: string, comment?: string) =>
        apiClient.rejectFix(id, comment),
    getDashboard: () => apiClient.getDashboard(),
    getAnalytics: () => apiClient.getAnalytics(),
    getPatterns: (daysBack?: number) => apiClient.getPatterns(daysBack),
    getEffectiveness: () => apiClient.getEffectiveness(),
    getRepositoryAnalytics: (owner: string, repo: string) =>
        apiClient.getRepositoryAnalytics(owner, repo),
};
