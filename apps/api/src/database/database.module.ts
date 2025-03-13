import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { entities } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'oracle',
        username: configService.get<string>('DB_USERNAME', 'ADMIN'),
        password: configService.get<string>('DB_PASSWORD'),
        // TLS 연결 문자열 (포트 1521 사용)
        connectString: `(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1521)(host=adb.ap-chuncheon-1.oraclecloud.com))(connect_data=(service_name=gbf7daacac132c8_botdb_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))`,
        // 애플리케이션 실행 시 스키마와 데이터베이스를 동기화
        synchronize: true,
        logging: configService.get<string>('NODE_ENV') !== 'production',
        entities: entities,
        // TLS 설정
        ssl: true,
        // extra 옵션에서 walletLocation 제거
        extra: {},
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
