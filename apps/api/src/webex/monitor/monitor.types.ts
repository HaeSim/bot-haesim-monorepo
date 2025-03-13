import { WebhookLog } from '../../entities/webex/webhook-log.entity';
import { Message } from '../../entities/messages/message.entity';

export interface BotStatus {
  isOnline: boolean;
  lastActivity: Date | null;
  totalWebhookLogs: number;
  totalMessages: number;
  startTime: Date;
}

export interface Room {
  id: string;
  title: string;
  type: string;
  created: Date;
  lastActivity: Date;
}

export interface MonitorStats {
  botStatus: BotStatus;
  recentWebhookLogs: WebhookLog[];
  recentMessages: Message[];
  eventBreakdown: { [key: string]: number };
  resourceBreakdown: { [key: string]: number };
  activeRooms: Room[];
}
