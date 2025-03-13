import { Controller, Get, Param, Logger } from '@nestjs/common';
import { WebhookLogsService } from './webhook-logs.service';
import { WebhookLog } from '../../entities/webex/webhook-log.entity';

@Controller('webhook-logs')
export class WebhookLogsController {
  private readonly logger = new Logger(WebhookLogsController.name);

  constructor(private readonly webhookLogsService: WebhookLogsService) {}

  /**
   * 전체 Webhook 로그 조회 (최근 100개)
   */
  @Get()
  async findAll(): Promise<WebhookLog[]> {
    this.logger.log('전체 Webhook 로그 조회');
    return this.webhookLogsService.findAll();
  }

  /**
   * 이벤트 타입별 Webhook 로그 조회
   * @param eventType 이벤트 타입 (created, updated 등)
   */
  @Get('event/:eventType')
  async findByEventType(
    @Param('eventType') eventType: string,
  ): Promise<WebhookLog[]> {
    this.logger.log(`이벤트 타입 ${eventType}의 Webhook 로그 조회`);
    return this.webhookLogsService.findByEventType(eventType);
  }

  /**
   * 리소스 타입별 Webhook 로그 조회
   * @param resourceType 리소스 타입 (messages, memberships 등)
   */
  @Get('resource/:resourceType')
  async findByResourceType(
    @Param('resourceType') resourceType: string,
  ): Promise<WebhookLog[]> {
    this.logger.log(`리소스 타입 ${resourceType}의 Webhook 로그 조회`);
    return this.webhookLogsService.findByResourceType(resourceType);
  }
}
