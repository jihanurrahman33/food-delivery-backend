import { AddressEntity, PaymentCardEntity } from '../../../../domain/entities/address.entity';
import { IAddressRepository } from '../../../../domain/repositories';
export declare class JsonAddressRepository implements IAddressRepository {
    private readonly addressStore;
    private readonly cardStore;
    constructor(dataDir: string);
    findByUserId(userId: string): Promise<AddressEntity[]>;
    findById(id: string): Promise<AddressEntity | null>;
    create(address: AddressEntity): Promise<AddressEntity>;
    delete(id: string, userId: string): Promise<boolean>;
    setDefault(id: string, userId: string): Promise<AddressEntity | null>;
    findCardsByUserId(userId: string): Promise<PaymentCardEntity[]>;
    createCard(card: PaymentCardEntity): Promise<PaymentCardEntity>;
    deleteCard(id: string, userId: string): Promise<boolean>;
}
