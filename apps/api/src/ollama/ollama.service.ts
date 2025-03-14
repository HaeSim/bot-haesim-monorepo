import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { Observable, catchError, map, throwError, switchMap } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';

import { ConfigService } from '../config/config.service';

// 시스템 메시지를 상수로 선언
const DEFAULT_SYSTEM_MESSAGE =
  `You are DEAN(발음은 '딘'), a friendly front-end developer working in a corporate environment. 
Keep your responses concise, under 100 characters when possible.
You speak warmly and kindly to your colleagues.

사용자 정보:
- 직업: LOTTE 소속 프론트엔드 개발자 (경력 4년)
- 산업: 블록체인/NFT
- 전공: 정보통신공학
- 업무 스타일: 창의적이고 직관적인 접근을 선호하며, 분석과 구조화된 프로세스를 중시
- 커뮤니케이션: 짧고 빠른 피드백을 선호하며, 생산성과 효율성을 중시

기술 및 프로젝트:
- FIDO2 인증 간소화를 위한 B2B 솔루션 "Lidentia" 개발 중
- Next.js 15.0.3 기반 개인 블로그 개발 중 (TypeScript, Prisma(PostgreSQL), Supabase 활용)

업무 및 협업:
- 인하우스 조직에 속해 있으며, 컨설팅과 시스템 팀으로 구성됨
- GitLab 이슈를 중심으로 팀 전체의 업무 관리를 체계화하는 미션 수행 중
- 협업 툴로 MS Teams 사용` as const;

@Injectable()
export class OllamaService {
  private readonly logger = new Logger(OllamaService.name);
  private readonly apiUrl: string;
  private readonly defaultModel = 'huihui_ai/kanana-nano-abliterated'; // 기본 모델

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.apiUrl =
      this.configService.get('OLLAMA_API_URL') || 'http://ollama:11434';
    this.logger.log(`Ollama API URL: ${this.apiUrl}`);
  }

  generateChatCompletion(
    prompt: string,
    model = this.defaultModel,
    systemMessage = DEFAULT_SYSTEM_MESSAGE
  ): Observable<string> {
    const url = `${this.apiUrl}/api/chat`;

    return this.httpService
      .post(url, {
        model,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt },
        ],
        stream: false,
      })
      .pipe(
        map((response: AxiosResponse) => response.data.message.content),
        catchError((error: AxiosError) => {
          this.logger.error(
            `Error calling Ollama API: ${error.message}`,
            error.stack
          );
          return throwError(
            () => new Error('Failed to generate chat completion')
          );
        })
      );
  }

  streamChatCompletion(
    prompt: string,
    model = this.defaultModel,
    systemMessage = DEFAULT_SYSTEM_MESSAGE
  ): Observable<string> {
    const url = `${this.apiUrl}/api/chat`;

    return this.httpService
      .post(
        url,
        {
          model,
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: prompt },
          ],
          stream: true,
        },
        {
          responseType: 'stream',
        }
      )
      .pipe(
        switchMap((response: AxiosResponse) => {
          const stream = response.data;
          return new Observable<string>((subscriber) => {
            let buffer = '';

            stream.on('data', (chunk: Buffer) => {
              const chunkStr = chunk.toString();
              buffer += chunkStr;

              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              for (const line of lines) {
                if (line.trim() === '') continue;

                try {
                  const json = JSON.parse(line);
                  if (json.message?.content) {
                    subscriber.next(json.message.content);
                  }

                  if (json.done) {
                    subscriber.complete();
                  }
                } catch (e) {
                  this.logger.error(`Failed to parse JSON: ${line}`, e);
                }
              }
            });

            stream.on('end', () => {
              subscriber.complete();
            });

            stream.on('error', (err) => {
              this.logger.error(`Stream error: ${err.message}`, err.stack);
              subscriber.error(err);
            });

            return () => {
              stream.destroy();
            };
          });
        }),
        catchError((error: AxiosError) => {
          this.logger.error(
            `Error calling Ollama stream API: ${error.message}`,
            error.stack
          );
          return throwError(
            () => new Error('Failed to stream chat completion')
          );
        })
      );
  }
}
