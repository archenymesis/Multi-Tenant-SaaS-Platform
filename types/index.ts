export type AnalysisType =
    "summary" |
    "qna" |
    "sentiment" |
    "entities" |
    "extract";

export interface Document {
    id: string;
    documentName: string;
    fileUrl?: string;
    fileSize?: number;
    fileType?: string;
    aiSummary?: string;
    aiKeywords: string[];
    sentiment?: string;
    createdAt: string;
    user: {
        firstName?: string;
        email: string;
    };
}