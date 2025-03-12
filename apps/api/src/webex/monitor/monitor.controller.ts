import {
  Controller,
  Get,
  Render,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { ErrorWithMessage } from '../interfaces/webex-types';
import { MonitorStats } from './monitor.types';

@Controller('webex/monitor')
export class MonitorController {
  private readonly logger = new Logger(MonitorController.name);

  constructor(private readonly monitorService: MonitorService) {}

  @Get()
  @Render('monitor/dashboard')
  async getDashboard(): Promise<{
    title: string;
    stats: MonitorStats | null;
    error?: string;
  }> {
    try {
      const stats = await this.monitorService.getMonitorStats();
      return {
        title: 'Webex Bot 모니터링 대시보드',
        stats,
      };
    } catch (err) {
      const error = err as ErrorWithMessage;
      this.logger.error(`대시보드 렌더링 중 오류 발생: ${error.message}`);
      return {
        title: 'Webex Bot 모니터링 대시보드',
        error: `데이터를 불러오는 중 오류가 발생했습니다: ${error.message}`,
        stats: null,
      };
    }
  }

  @Get('api/stats')
  async getStats(): Promise<MonitorStats> {
    try {
      return await this.monitorService.getMonitorStats();
    } catch (err) {
      const error = err as ErrorWithMessage;
      this.logger.error(`API 통계 조회 중 오류 발생: ${error.message}`);
      throw new HttpException(
        `모니터링 데이터를 불러오는 중 오류가 발생했습니다: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
