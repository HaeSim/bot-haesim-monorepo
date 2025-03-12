import { Injectable, Logger } from '@nestjs/common';
import { WebhookLogsService } from '../webhook-logs/webhook-logs.service';
import { MessagesService } from '../../messages/messages.service';
import { BotService } from '../bot/bot.service';
import { ErrorWithMessage } from '../interfaces/webex-types';
import { BotStatus, MonitorStats, Room } from './monitor.types';

@Injectable()
export class MonitorService {
  private readonly logger = new Logger(MonitorService.name);
  private startTime: Date = new Date();

  constructor(
    private webhookLogsService: WebhookLogsService,
    private messagesService: MessagesService,
    private botService: BotService,
  ) {}

  async getMonitorStats(): Promise<MonitorStats> {
    try {
      // 최근 웹훅 로그 가져오기
      const recentWebhookLogs = await this.webhookLogsService.findAll();

      // 최근 메시지 가져오기
      const recentMessages = await this.messagesService.findAll();

      // 이벤트 유형별 분류
      const eventBreakdown: { [key: string]: number } = {};
      const resourceBreakdown: { [key: string]: number } = {};

      recentWebhookLogs.forEach((log) => {
        // 이벤트 타입 분류
        if (log.eventType) {
          eventBreakdown[log.eventType] =
            (eventBreakdown[log.eventType] || 0) + 1;
        }

        // 리소스 타입 분류
        if (log.resourceType) {
          resourceBreakdown[log.resourceType] =
            (resourceBreakdown[log.resourceType] || 0) + 1;
        }
      });

      // 현재 접속 중인 룸 정보 가져오기
      const activeRooms = await this.getActiveRooms();

      // 봇 상태 정보
      const botStatus: BotStatus = {
        isOnline: true, // 실제 상태는 봇 서비스에서 가져오는 것이 좋습니다
        lastActivity:
          recentWebhookLogs.length > 0 ? recentWebhookLogs[0].createdAt : null,
        totalWebhookLogs: recentWebhookLogs.length,
        totalMessages: recentMessages.length,
        startTime: this.startTime,
      };

      return {
        botStatus,
        recentWebhookLogs: recentWebhookLogs.slice(0, 20), // 최근 20개만
        recentMessages: recentMessages.slice(0, 20), // 최근 20개만
        eventBreakdown,
        resourceBreakdown,
        activeRooms,
      };
    } catch (err) {
      const error = err as ErrorWithMessage;
      this.logger.error(`모니터링 통계 수집 중 오류 발생: ${error.message}`);
      throw new Error(`모니터링 통계 수집 실패: ${error.message}`);
    }
  }

  /**
   * 현재 봇이 접속 중인 룸 목록을 가져옵니다.
   */
  private async getActiveRooms(): Promise<Room[]> {
    try {
      // 봇 서비스를 통해 룸 목록 가져오기
      const rooms = await this.botService.listRooms();

      // 필요한 정보만 추출하여 반환
      return rooms.map((room) => ({
        id: room.id,
        title: room.title || '제목 없음',
        type: room.type || '알 수 없음',
        created: new Date(room.created || Date.now()),
        lastActivity: new Date(room.lastActivity || Date.now()),
      }));
    } catch (error) {
      const err = error as ErrorWithMessage;
      this.logger.error(`룸 목록 가져오기 실패: ${err.message}`);
      return []; // 오류 발생 시 빈 배열 반환
    }
  }
}
