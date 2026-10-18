import { BannerEntity } from '../../../../domain/entities/banner.entity';
import { IBannerRepository } from '../../../../domain/repositories';
import { JsonFileStore } from '../json-file-store';

export class JsonBannerRepository implements IBannerRepository {
  private readonly store: JsonFileStore<BannerEntity>;

  constructor(dataDir: string) {
    this.store = new JsonFileStore<BannerEntity>('banners', dataDir);
  }

  async findAll(): Promise<BannerEntity[]> {
    return this.store.readAll();
  }
}
