// 가장 먼저 패치 파일을 가져옵니다
import './webex/webex-patch';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS 설정
  app.enableCors();

  // JSON 요청 처리를 위한 bodyParser 설정
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));

  // API 프리픽스 설정
  // Nginx 리버스 프록시 설정에 따라 /api/v1 형태로 요청이 들어옴
  // 환경 변수에서 API_PREFIX를 가져와 설정하거나 기본값 사용
  const apiPrefix = process.env.API_PREFIX || '';
  if (apiPrefix) {
    console.log(`API 프리픽스 설정: ${apiPrefix}`);
    app.setGlobalPrefix(apiPrefix);
  }

  // 항상 8080 포트 사용
  const port = 8080;

  await app.listen(port);
  console.log(`애플리케이션이 포트 ${port}에서 실행 중입니다.`);
}
void bootstrap();
