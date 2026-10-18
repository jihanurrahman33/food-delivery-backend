/**
 * Robust JSON File Store with In-Memory Write-Queue & Atomic File Replacement
 *
 * Guarantees:
 * 1. Safe concurrent operations (serialized write queue per file)
 * 2. Atomic writes (write to .tmp then rename)
 * 3. Graceful handling of missing/corrupt files
 * 4. Easy swap for SQL/NoSQL databases via repository interfaces
 */
export declare class JsonFileStore<T extends {
    id: string;
}> {
    private readonly fileName;
    private readonly filePath;
    private readonly tmpFilePath;
    private cache;
    private writeQueue;
    constructor(fileName: string, baseDir: string);
    private ensureFileExists;
    readAll(): Promise<T[]>;
    writeAll(items: T[]): Promise<void>;
    findById(id: string): Promise<T | null>;
    findOne(predicate: (item: T) => boolean): Promise<T | null>;
    filter(predicate: (item: T) => boolean): Promise<T[]>;
    insert(item: T): Promise<T>;
    update(id: string, partial: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    clearCache(): void;
}
