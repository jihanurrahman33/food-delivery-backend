import { CategoryEntity } from '../../../../domain/entities/category.entity';
import { ICategoryRepository } from '../../../../domain/repositories';
export declare class JsonCategoryRepository implements ICategoryRepository {
    private readonly store;
    constructor(dataDir: string);
    findAll(): Promise<CategoryEntity[]>;
    findById(id: string): Promise<CategoryEntity | null>;
}
