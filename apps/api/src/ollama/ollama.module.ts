import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OllamaService } from './ollama.service';
import { OllamaController } from './ollama.controller';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  providers: [OllamaService],
  controllers: [OllamaController],
  exports: [OllamaService],
})
export class OllamaModule {}