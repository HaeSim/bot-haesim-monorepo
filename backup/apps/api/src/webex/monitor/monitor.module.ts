import { Module } from '@nestjs/common';
import { MonitorController } from './monitor.controller';
import { MonitorService } from './monitor.service';
import { WebhookLogsModule } from '../webhook-logs/webhook-logs.module';
import { MessagesModule } from '../../messages/messages.module';
import { BotModule } from '../bot/bot.module';

@Module({
  imports: [WebhookLogsModule, MessagesModule, BotModule],
  controllers: [MonitorController],
  providers: [MonitorService],
  exports: [MonitorService],
})
export class MonitorModule {}
