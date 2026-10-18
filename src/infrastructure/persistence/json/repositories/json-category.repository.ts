import { CategoryEntity } from '../../../../domain/entities/category.entity';
import { ICategoryRepository } from '../../../../domain/repositories';
import { JsonFileStore } from '../json-file-store';

export class JsonCategoryRepository implements ICategoryRepository {
  private readonly store: JsonFileStore<CategoryEntity>;

  constructor(dataDir: string) {
    this.store = new JsonFileStore<CategoryEntity>('categories', dataDir);
  }

  async findAll(): Promise<CategoryEntity[]> {
    const list = await this.store.readAll();
    return list.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    return this.store.findById(id);
  }
}
