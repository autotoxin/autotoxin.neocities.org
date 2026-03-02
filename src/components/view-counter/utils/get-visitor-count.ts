import type { VisitorCountData } from "../view-counter.d";

const VISITOR_COUNT_API_ENDPOINT = import.meta.env.PUBLIC_VISITOR_COUNT_API_ENDPOINT;

export const getVisitorCount = async (): Promise<VisitorCountData> => {
    const response = await fetch(VISITOR_COUNT_API_ENDPOINT);
    if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

    return await response.json();
};
