import { BannerEntity } from '../../../../domain/entities/banner.entity';
import { IBannerRepository } from '../../../../domain/repositories';
export declare class JsonBannerRepository implements IBannerRepository {
    private readonly store;
    constructor(dataDir: string);
    findAll(): Promise<BannerEntity[]>;
}
