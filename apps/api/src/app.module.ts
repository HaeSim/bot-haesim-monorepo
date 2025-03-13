import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { MessagesModule } from './messages/messages.module';
import { WebexModule } from './webex/webex.module';
import { HealthModule } from './health/health.module';
import { OllamaModule } from './ollama/ollama.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    MessagesModule,
    WebexModule,
    HealthModule,
    OllamaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
