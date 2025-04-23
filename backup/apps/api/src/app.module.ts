import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // /api 접두사가 포함된 요청을 해당 컨트롤러로 리다이렉트하는 미들웨어
    consumer
      .apply((req, res, next) => {
        // /api 접두사가 있으면 접두사를 제거하고 다음 핸들러로 전달
        if (req.url.startsWith('/api/')) {
          req.url = req.url.substring(4); // '/api/' 제거 (4 글자)
        }
        next();
      })
      .forRoutes({ path: 'api/*', method: RequestMethod.ALL });
  }
}
