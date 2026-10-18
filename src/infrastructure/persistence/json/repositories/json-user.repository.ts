import { UserEntity } from '../../../../domain/entities/user.entity';
import { IUserRepository } from '../../../../domain/repositories';
import { JsonFileStore } from '../json-file-store';

export class JsonUserRepository implements IUserRepository {
  private readonly store: JsonFileStore<UserEntity>;

  constructor(dataDir: string) {
    this.store = new JsonFileStore<UserEntity>('users', dataDir);
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.store.findById(id);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const normalized = email.trim().toLowerCase();
    return this.store.findOne((u) => u.email.trim().toLowerCase() === normalized);
  }

  async create(user: UserEntity): Promise<UserEntity> {
    return this.store.insert(user);
  }

  async update(id: string, partial: Partial<UserEntity>): Promise<UserEntity | null> {
    return this.store.update(id, { ...partial, updatedAt: new Date().toISOString() });
  }

  async delete(id: string): Promise<boolean> {
    return this.store.delete(id);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.store.readAll();
  }
}
