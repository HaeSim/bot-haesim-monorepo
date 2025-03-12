// 가장 먼저 패치 파일을 가져옵니다
import './webex/webex-patch';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { registerHandlebarsHelpers } from './common/utils/handlebars-helpers';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // JSON 요청 처리를 위한 bodyParser 설정
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));

  // 정적 파일 제공 설정
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // 뷰 엔진 설정
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // Handlebars 헬퍼 등록
  registerHandlebarsHelpers();

  // 환경 변수에서 포트 가져오기, 없으면 8080 사용
  const port = process.env.PORT || 8080;

  await app.listen(port);
  console.log(`애플리케이션이 포트 ${port}에서 실행 중입니다.`);
}
void bootstrap();
