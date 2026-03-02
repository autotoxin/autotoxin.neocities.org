export type VisitorCountData = {
    total: number;
    unique: number;
    readonly: boolean;
};

export type ViewCounterApiJsonResponse = {
    data?: VisitorCountData;
};

export type ViewCounterApiJsonErrorResponse = {
    error?: string;
};
