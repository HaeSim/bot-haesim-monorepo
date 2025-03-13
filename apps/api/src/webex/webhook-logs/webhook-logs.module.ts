import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookLog } from '../../entities/webex/webhook-log.entity';
import { WebhookLogsService } from './webhook-logs.service';
import { WebhookLogsController } from './webhook-logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WebhookLog])],
  controllers: [WebhookLogsController],
  providers: [WebhookLogsService],
  exports: [WebhookLogsService],
})
export class WebhookLogsModule {}
