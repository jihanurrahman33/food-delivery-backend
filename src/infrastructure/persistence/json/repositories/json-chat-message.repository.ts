import { ChatMessageEntity } from '../../../../domain/entities/chat-message.entity';
import { IChatMessageRepository } from '../../../../domain/repositories';
import { JsonFileStore } from '../json-file-store';

export class JsonChatMessageRepository implements IChatMessageRepository {
  private readonly store: JsonFileStore<ChatMessageEntity>;

  constructor(dataDir: string) {
    this.store = new JsonFileStore<ChatMessageEntity>('chat_messages', dataDir);
  }

  async findByOrderId(orderId: string): Promise<ChatMessageEntity[]> {
    const list = await this.store.filter((m) => m.orderId === orderId);
    return list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async create(message: ChatMessageEntity): Promise<ChatMessageEntity> {
    return this.store.insert(message);
  }
}
