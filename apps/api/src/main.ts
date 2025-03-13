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

  // CORS 설정
  app.enableCors();

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

  // Nginx에서 프록시 설정이 있는 경우는
  // rewrite 규칙으로 처리하므로 여기서는 별도 처리가 필요하지 않음
  // 필요한 경우 주석을 해제하여 사용
  // if (process.env.NODE_ENV === 'production' && process.env.API_PREFIX) {
  //   app.setGlobalPrefix(process.env.API_PREFIX);
  // }

  // 항상 8080 포트 사용
  const port = 8080;

  await app.listen(port);
  console.log(`애플리케이션이 포트 ${port}에서 실행 중입니다.`);
}
void bootstrap();
