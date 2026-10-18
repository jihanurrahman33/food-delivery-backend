import { ChatMessageEntity } from '../../../../domain/entities/chat-message.entity';
import { IChatMessageRepository } from '../../../../domain/repositories';
export declare class JsonChatMessageRepository implements IChatMessageRepository {
    private readonly store;
    constructor(dataDir: string);
    findByOrderId(orderId: string): Promise<ChatMessageEntity[]>;
    create(message: ChatMessageEntity): Promise<ChatMessageEntity>;
}
