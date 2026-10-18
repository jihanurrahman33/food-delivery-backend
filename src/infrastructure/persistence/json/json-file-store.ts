import fs from 'fs';
import path from 'path';
import { logger } from '../../../core/utils/logger';

/**
 * Robust JSON File Store with In-Memory Write-Queue & Atomic File Replacement
 *
 * Guarantees:
 * 1. Safe concurrent operations (serialized write queue per file)
 * 2. Atomic writes (write to .tmp then rename)
 * 3. Graceful handling of missing/corrupt files
 * 4. Easy swap for SQL/NoSQL databases via repository interfaces
 */
export class JsonFileStore<T extends { id: string }> {
  private readonly filePath: string;
  private readonly tmpFilePath: string;
  private cache: T[] | null = null;
  private writeQueue: Promise<void> = Promise.resolve();

  constructor(fileName: string, baseDir: string) {
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }
    this.filePath = path.join(baseDir, fileName.endsWith('.json') ? fileName : `${fileName}.json`);
    this.tmpFilePath = `${this.filePath}.tmp`;
    this.ensureFileExists();
  }

  private ensureFileExists(): void {
    if (!fs.existsSync(this.filePath)) {
      try {
        fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), 'utf-8');
      } catch (err) {
        logger.error(`Failed to initialize file ${this.filePath}:`, err);
      }
    }
  }

  public async readAll(): Promise<T[]> {
    if (this.cache !== null) {
      return [...this.cache];
    }

    try {
      if (!fs.existsSync(this.filePath)) {
        this.cache = [];
        return [];
      }
      const raw = await fs.promises.readFile(this.filePath, 'utf-8');
      if (!raw || raw.trim().length === 0) {
        this.cache = [];
        return [];
      }
      this.cache = JSON.parse(raw);
      return [...this.cache!];
    } catch (err) {
      logger.error(`Failed to read/parse ${this.filePath}, returning empty array:`, err);
      this.cache = [];
      return [];
    }
  }

  public async writeAll(items: T[]): Promise<void> {
    this.cache = [...items];

    // Enqueue write to guarantee serialized atomic filesystem writes
    this.writeQueue = this.writeQueue.then(async () => {
      try {
        const payload = JSON.stringify(items, null, 2);
        // Write to temporary file first
        await fs.promises.writeFile(this.tmpFilePath, payload, 'utf-8');
        // Atomically replace target file
        await fs.promises.rename(this.tmpFilePath, this.filePath);
      } catch (err) {
        logger.error(`Atomic write failure for ${this.filePath}:`, err);
        throw err;
      }
    });

    return this.writeQueue;
  }

  public async findById(id: string): Promise<T | null> {
    const all = await this.readAll();
    const item = all.find((x) => x.id === id);
    return item ? { ...item } : null;
  }

  public async findOne(predicate: (item: T) => boolean): Promise<T | null> {
    const all = await this.readAll();
    const item = all.find(predicate);
    return item ? { ...item } : null;
  }

  public async filter(predicate: (item: T) => boolean): Promise<T[]> {
    const all = await this.readAll();
    return all.filter(predicate).map((item) => ({ ...item }));
  }

  public async insert(item: T): Promise<T> {
    const all = await this.readAll();
    all.push(item);
    await this.writeAll(all);
    return { ...item };
  }

  public async update(id: string, partial: Partial<T>): Promise<T | null> {
    const all = await this.readAll();
    const index = all.findIndex((x) => x.id === id);
    if (index === -1) return null;

    all[index] = { ...all[index], ...partial };
    await this.writeAll(all);
    return { ...all[index] };
  }

  public async delete(id: string): Promise<boolean> {
    const all = await this.readAll();
    const index = all.findIndex((x) => x.id === id);
    if (index === -1) return false;

    all.splice(index, 1);
    await this.writeAll(all);
    return true;
  }

  public clearCache(): void {
    this.cache = null;
  }
}
