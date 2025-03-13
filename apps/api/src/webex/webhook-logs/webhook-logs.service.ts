import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebhookLog } from '../../entities/webex/webhook-log.entity';
import { WebhookData } from '../interfaces/webex-types';

// 오류 처리를 위한 타입 정의
interface ErrorWithMessage {
  message: string;
}

@Injectable()
export class WebhookLogsService {
  private readonly logger = new Logger(WebhookLogsService.name);

  constructor(
    @InjectRepository(WebhookLog)
    private webhookLogsRepository: Repository<WebhookLog>,
  ) {}

  /**
   * Webhook 이벤트 데이터를 로그로 저장
   * @param webhookData Webex에서 수신한 Webhook 데이터
   * @returns 저장된 로그 엔티티
   */
  async saveWebhookLog(webhookData: WebhookData): Promise<WebhookLog> {
    try {
      // 엔티티 생성
      const webhookLog = this.webhookLogsRepository.create({
        webhookId: webhookData.id,
        rawData: JSON.stringify(webhookData),
        eventType: webhookData.event,
        resourceType: webhookData.resource,
      });

      // 저장
      return await this.webhookLogsRepository.save(webhookLog);
    } catch (err) {
      const error = err as ErrorWithMessage;
      this.logger.error(`Webhook 로그 저장 실패: ${error.message}`);
      throw new Error(`Webhook 로그 저장 중 오류 발생: ${error.message}`);
    }
  }

  /**
   * 모든 Webhook 로그 조회
   */
  async findAll(): Promise<WebhookLog[]> {
    try {
      return await this.webhookLogsRepository.find({
        order: {
          createdAt: 'DESC',
        },
        take: 100, // 최대 100개까지만 조회
      });
    } catch (err) {
      const error = err as ErrorWithMessage;
      this.logger.error(`Webhook 로그 조회 실패: ${error.message}`);
      throw new Error(`Webhook 로그 조회 중 오류 발생: ${error.message}`);
    }
  }

  /**
   * 특정 이벤트 타입의 Webhook 로그 조회
   * @param eventType 이벤트 타입 (created, updated 등)
   */
  async findByEventType(eventType: string): Promise<WebhookLog[]> {
    try {
      return await this.webhookLogsRepository.find({
        where: { eventType },
        order: {
          createdAt: 'DESC',
        },
        take: 50, // 최대 50개까지만 조회
      });
    } catch (err) {
      const error = err as ErrorWithMessage;
      this.logger.error(`Webhook 로그 조회 실패: ${error.message}`);
      throw new Error(`Webhook 로그 조회 중 오류 발생: ${error.message}`);
    }
  }

  /**
   * 특정 리소스 타입의 Webhook 로그 조회
   * @param resourceType 리소스 타입 (messages, memberships 등)
   */
  async findByResourceType(resourceType: string): Promise<WebhookLog[]> {
    try {
      return await this.webhookLogsRepository.find({
        where: { resourceType },
        order: {
          createdAt: 'DESC',
        },
        take: 50, // 최대 50개까지만 조회
      });
    } catch (err) {
      const error = err as ErrorWithMessage;
      this.logger.error(`Webhook 로그 조회 실패: ${error.message}`);
      throw new Error(`Webhook 로그 조회 중 오류 발생: ${error.message}`);
    }
  }
}
