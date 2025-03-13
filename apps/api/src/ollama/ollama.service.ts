import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { Observable, catchError, map, throwError, switchMap } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';

import { ConfigService } from '../config/config.service';

@Injectable()
export class OllamaService {
  private readonly logger = new Logger(OllamaService.name);
  private readonly apiUrl: string;
  private readonly defaultModel = 'kanana-nano-abliterated'; // 기본 모델

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
    model = this.defaultModel
  ): Observable<string> {
    const url = `${this.apiUrl}/api/generate`;

    return this.httpService
      .post(url, {
        model,
        prompt,
        stream: false,
      })
      .pipe(
        map((response: AxiosResponse) => response.data.response),
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
    model = this.defaultModel
  ): Observable<string> {
    const url = `${this.apiUrl}/api/generate`;

    return this.httpService
      .post(
        url,
        {
          model,
          prompt,
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
                  if (json.response) {
                    subscriber.next(json.response);
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
