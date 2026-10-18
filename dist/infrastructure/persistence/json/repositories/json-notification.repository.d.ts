import { NotificationEntity } from '../../../../domain/entities/notification.entity';
import { INotificationRepository } from '../../../../domain/repositories';
export declare class JsonNotificationRepository implements INotificationRepository {
    private readonly store;
    constructor(dataDir: string);
    findByUserId(userId: string): Promise<NotificationEntity[]>;
    create(notification: NotificationEntity): Promise<NotificationEntity>;
    markAllRead(userId: string): Promise<void>;
}
