import { NotificationEntity } from '../../../../domain/entities/notification.entity';
import { INotificationRepository } from '../../../../domain/repositories';
import { JsonFileStore } from '../json-file-store';

export class JsonNotificationRepository implements INotificationRepository {
  private readonly store: JsonFileStore<NotificationEntity>;

  constructor(dataDir: string) {
    this.store = new JsonFileStore<NotificationEntity>('notifications', dataDir);
  }

  async findByUserId(userId: string): Promise<NotificationEntity[]> {
    const list = await this.store.filter((n) => n.userId === userId);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async create(notification: NotificationEntity): Promise<NotificationEntity> {
    return this.store.insert(notification);
  }

  async markAllRead(userId: string): Promise<void> {
    const all = await this.store.readAll();
    let modified = false;
    for (let i = 0; i < all.length; i++) {
      if (all[i].userId === userId && !all[i].isRead) {
        all[i].isRead = true;
        modified = true;
      }
    }
    if (modified) {
      await this.store.writeAll(all);
    }
  }
}
