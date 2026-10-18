export interface ChatMessageEntity {
  id: string;
  orderId: string;
  senderId: string;
  senderRole: 'customer' | 'rider' | 'restaurant';
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}
