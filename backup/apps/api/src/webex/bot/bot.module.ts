import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { CommandsModule } from '../commands/commands.module';
import { ConfigModule } from '../../config/config.module';
import { WebhookLogsModule } from '../webhook-logs/webhook-logs.module';
import { OllamaModule } from '../../ollama/ollama.module';
import { MessagesModule } from '../../messages/messages.module';

@Module({
  imports: [CommandsModule, ConfigModule, WebhookLogsModule, OllamaModule, MessagesModule],
  controllers: [BotController],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
