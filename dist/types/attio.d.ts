/**
 * Common type definitions for Attio API responses and entities
 */
/**
 * Base interface for Attio record values
 */
export interface AttioValue<T> {
    value: T;
    [key: string]: any;
}
/**
 * Base interface for Attio records (common between people and companies)
 */
export interface AttioRecord {
    id: {
        record_id: string;
        [key: string]: any;
    };
    values: {
        name?: Array<AttioValue<string>>;
        email?: Array<AttioValue<string>>;
        phone?: Array<AttioValue<string>>;
        industry?: Array<AttioValue<string>>;
        website?: Array<AttioValue<string>>;
        [key: string]: any;
    };
    [key: string]: any;
}
/**
 * Person record type
 */
export interface Person extends AttioRecord {
}
/**
 * Company record type
 */
export interface Company extends AttioRecord {
}
/**
 * Note record type
 */
export interface AttioNote {
    id: {
        note_id: string;
        [key: string]: any;
    };
    title: string;
    content: string;
    format: string;
    parent_object: string;
    parent_record_id: string;
    created_at: string;
    updated_at: string;
    [key: string]: any;
}
/**
 * Resource type enum for better type safety
 */
export declare enum ResourceType {
    PEOPLE = "people",
    COMPANIES = "companies"
}
/**
 * API error response shape
 */
export interface AttioErrorResponse {
    status?: number;
    data?: any;
    headers?: Record<string, string>;
    error?: string;
    message?: string;
    details?: any;
    [key: string]: any;
}
/**
 * API response containing a list of records
 */
export interface AttioListResponse<T> {
    data: T[];
    pagination?: {
        total_count: number;
        next_cursor?: string;
        [key: string]: any;
    };
    [key: string]: any;
}
/**
 * API response containing a single record
 */
export interface AttioSingleResponse<T> {
    data: T;
    [key: string]: any;
}
//# sourceMappingURL=attio.d.ts.map