// 메시지 엔티티
export { Message } from './messages/message.entity';

// Webex 엔티티
export { WebhookLog } from './webex/webhook-log.entity';

// 엔티티 목록 (TypeORM 설정용)
export const entities = [
  // 메시지
  require('./messages/message.entity').Message,
  
  // Webex
  require('./webex/webhook-log.entity').WebhookLog,
];