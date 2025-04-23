import { Module } from '@nestjs/common';

import { WebhookLogsModule } from './webhook-logs/webhook-logs.module';
import { CommandsModule } from './commands/commands.module';
import { BotModule } from './bot/bot.module';
import { MonitorModule } from './monitor/monitor.module';

@Module({
  imports: [BotModule, CommandsModule, WebhookLogsModule, MonitorModule],
  exports: [BotModule, CommandsModule, WebhookLogsModule, MonitorModule],
})
export class WebexModule {}
