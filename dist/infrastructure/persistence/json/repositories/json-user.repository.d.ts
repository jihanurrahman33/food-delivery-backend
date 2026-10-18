import { UserEntity } from '../../../../domain/entities/user.entity';
import { IUserRepository } from '../../../../domain/repositories';
export declare class JsonUserRepository implements IUserRepository {
    private readonly store;
    constructor(dataDir: string);
    findById(id: string): Promise<UserEntity | null>;
    findByEmail(email: string): Promise<UserEntity | null>;
    create(user: UserEntity): Promise<UserEntity>;
    update(id: string, partial: Partial<UserEntity>): Promise<UserEntity | null>;
    delete(id: string): Promise<boolean>;
    findAll(): Promise<UserEntity[]>;
}
