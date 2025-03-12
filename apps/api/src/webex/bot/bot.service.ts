import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
const Framework = require('webex-node-bot-framework');
import axios from 'axios';
import {
  Bot,
  Trigger,
  WebexFramework,
  WebhookData,
  MessageDetails,
  PersonDetails,
  ErrorWithMessage,
  MessageResponse,
} from '../interfaces/webex-types';
import { CommandsService } from '../commands/commands.service';
import { WebhookLogsService } from '../webhook-logs/webhook-logs.service';

@Injectable()
export class BotService implements OnModuleInit {
  private readonly logger = new Logger(BotService.name);
  private framework: WebexFramework;
  private readonly apiUrl = 'https://webexapis.com/v1';

  constructor(
    private configService: ConfigService,
    private webexCommands: CommandsService,
    private webhookLogsService: WebhookLogsService
  ) {
    // Webex 프레임워크 초기화
    const config = {
      token: this.configService.get<string>('BOT_ACCESS_TOKEN'),
      webhookUrl: `https://${this.configService.get<string>('DOMAIN_NAME')}/webex-bot/webhook`,
      removeWebhooksOnStart: true,
    };

    // CommonJS 모듈 방식으로 가져온 Framework 사용
    this.framework = new Framework(config);
    this.logger.log('Webex Bot 프레임워크 초기화됨');
  }

  onModuleInit() {
    this.setupFrameworkListeners();
    this.registerCommandsToFramework();

    // 프레임워크 시작
    this.framework
      .start()
      .then(() => {
        this.logger.log('Webex Bot 프레임워크 시작됨');
      })
      .catch((err: unknown) => {
        const error = err as ErrorWithMessage;
        this.logger.error(`Webex Bot 프레임워크 시작 실패: ${error.message}`);
        this.logger.debug(
          `프레임워크 시작 실패 스택 트레이스: ${error.stack || '스택 정보 없음'}`
        );
      });
  }

  private registerCommandsToFramework() {
    try {
      // 모든 명령어 가져오기
      const commands = this.webexCommands.getCommands();

      // 각 명령어를 프레임워크에 등록
      commands.forEach((command) => {
        this.framework.hears(
          command.pattern,
          (bot: Bot, trigger: Trigger) => {
            void (async () => {
              try {
                this.logger.log(
                  `명령어 실행: ${command.pattern} - 사용자: ${trigger.person.displayName}`
                );
                const result = await command.execute(bot, trigger);
                if (result) {
                  await bot.say(result);
                }
              } catch (err) {
                const error = err as ErrorWithMessage;
                this.logger.error(
                  `명령어 실행 오류 [${command.pattern}]: ${error.message}`
                );
                this.logger.debug(
                  `명령어 실행 오류 스택 트레이스 [${command.pattern}]: ${error.stack || '스택 정보 없음'}`
                );
                await bot.say(
                  `명령 실행 중 오류가 발생했습니다: ${error.message}`
                );
              }
            })();
          },
          command.helpText,
          command.priority
        );
      });

      this.logger.log(`${commands.length}개의 명령어가 등록됨`);
    } catch (err) {
      const error = err as ErrorWithMessage;
      this.logger.error(`명령어 등록 실패: ${error.message}`);
      this.logger.debug(
        `명령어 등록 실패 스택 트레이스: ${error.stack || '스택 정보 없음'}`
      );
    }
  }

  private setupFrameworkListeners() {
    // 메시지 생성 이벤트 리스너
    this.framework.on('message', (bot: Bot, trigger: Trigger) => {
      void (async () => {
        try {
          // 명령어 매칭 (텍스트가 있을 경우)
          if (trigger.text) {
            const command = this.webexCommands.findMatchingCommand(
              trigger.text
            );
            if (!command) {
              // 매칭되는 명령어가 없으면 도움말 제안
              this.logger.log(
                `매칭되는 명령어 없음: "${trigger.text}" - 사용자: ${trigger.person.displayName}`
              );
              await bot.say(
                '이 명령어를 이해할 수 없습니다. "/도움말"을 입력하여 사용 가능한 명령어를 확인하세요.'
              );
            }
          }
        } catch (err) {
          const error = err as ErrorWithMessage;
          this.logger.error(`메시지 처리 오류: ${error.message}`);
          this.logger.debug(
            `메시지 처리 오류 스택 트레이스: ${error.stack || '스택 정보 없음'}`
          );
        }
      })();
    });
  }

  async processWebhook(webhookData: WebhookData): Promise<any> {
    try {
      this.logger.debug(`웹훅 처리 시작: ${webhookData.id}`);
      this.logger.debug(`웹훅 데이터: ${JSON.stringify(webhookData)}`);

      // 웹훅 로그 저장 - WebhookData 객체를 직접 전달
      await this.webhookLogsService.saveWebhookLog(webhookData);

      this.logger.debug(`Webhook 로그 저장 완료: ${webhookData.id}`);

      // 메시지 생성 이벤트만 처리
      if (
        webhookData.resource === 'messages' &&
        webhookData.event === 'created'
      ) {
        const messageId = webhookData.data.id;
        this.logger.debug(`메시지 ID: ${messageId}`);

        // 메시지 세부 정보 가져오기
        const messageDetails = await this.getMessageDetails(messageId);
        this.logger.debug(`메시지 세부정보: ${JSON.stringify(messageDetails)}`);

        // 봇 자신이 보낸 메시지인지 확인
        const botEmailAddress = this.configService.get<string>('BOT_USERNAME');
        if (messageDetails.personEmail === botEmailAddress) {
          this.logger.debug('봇이 보낸 메시지이므로 처리하지 않습니다.');
          return { success: true, ignored: true };
        }

        // 사용자 세부 정보 가져오기
        const person = await this.getPersonDetails(webhookData.data.personId);

        // 메시지 텍스트 전처리 - 봇 이름 제거
        let text = messageDetails.text || '';

        // 봇 이름 추출 (설정에서 가져오거나 기본값 사용)
        const botName = this.configService.get<string>('BOT_NAME') || 'DEAN';

        // 봇 이름으로 시작하는 경우 제거 (대소문자 구분 없이)
        const botNameRegex = new RegExp(`^${botName}\\s*`, 'i');
        text = text.replace(botNameRegex, '');

        // 멘션 형태로 시작하는 경우 (@봇이름) 제거
        const mentionRegex = /^@\S+\s*/;
        text = text.replace(mentionRegex, '');

        this.logger.debug(`전처리된 메시지 텍스트: "${text}"`);

        // 명령어 검색 및 실행
        const matchingCommand = this.webexCommands.findMatchingCommand(text);

        if (matchingCommand) {
          this.logger.log(
            `명령어 실행: ${
              typeof matchingCommand.pattern === 'string'
                ? matchingCommand.pattern
                : matchingCommand.pattern.toString()
            } - 사용자: ${person.displayName}`
          );

          try {
            // 명령어 실행 (직접 실행)
            const result = await matchingCommand.execute(
              {
                say: async (message) =>
                  this.sendMessage(webhookData.data.roomId, message),
                room: { id: webhookData.data.roomId },
              } as Bot,
              {
                text,
                person: {
                  ...person,
                  email: person.emails?.[0] || '',
                },
                message: {
                  text,
                  id: messageId,
                },
              } as Trigger
            );

            if (result) {
              await this.sendMessage(webhookData.data.roomId, result);
            }
          } catch (err) {
            const error = err as ErrorWithMessage;
            this.logger.error(
              `명령어 실행 오류 [${
                typeof matchingCommand.pattern === 'string'
                  ? matchingCommand.pattern
                  : matchingCommand.pattern.toString()
              }]: ${error.message}`
            );
            await this.sendMessage(
              webhookData.data.roomId,
              `명령 실행 중 오류가 발생했습니다: ${error.message}`
            );
          }
        } else {
          this.logger.log(
            `매칭되는 명령어 없음: "${text}" - 사용자: ${person.displayName}`
          );
          await this.sendMessage(
            webhookData.data.roomId,
            '이 명령어를 이해할 수 없습니다. "/도움말"을 입력하여 사용 가능한 명령어를 확인하세요.'
          );
        }
      }

      return { success: true };
    } catch (err) {
      const error = err as ErrorWithMessage;
      this.logger.error(`웹훅 처리 오류: ${error.message}`);
      this.logger.debug(
        `웹훅 처리 오류 스택 트레이스: ${error.stack || '스택 정보 없음'}`
      );
      throw new Error(`웹훅 처리 실패: ${error.message}`);
    }
  }

  private async sendMessage(
    roomId: string,
    message: string | Record<string, unknown>
  ): Promise<MessageResponse> {
    try {
      this.logger.debug(`메시지 전송 시작 - Room ID: ${roomId}`);
      let messagePayload: Record<string, unknown>;

      if (typeof message === 'string') {
        messagePayload = {
          roomId,
          text: message,
        };
      } else {
        messagePayload = {
          roomId,
          ...message,
        };
      }

      this.logger.debug(`메시지 페이로드: ${JSON.stringify(messagePayload)}`);

      const response = await axios.post<MessageResponse>(
        `${this.apiUrl}/messages`,
        messagePayload,
        {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>(
              'BOT_ACCESS_TOKEN'
            )}`,
            'Content-Type': 'application/json',
          },
        }
      );

      this.logger.debug(`메시지 전송 응답: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (err) {
      const error = err as ErrorWithMessage;
      this.logger.error(`메시지 전송 실패: ${error.message}`);
      this.logger.debug(
        `메시지 전송 오류 스택 트레이스: ${error.stack || '스택 정보 없음'}`
      );
      throw new Error(`메시지 전송 실패: ${error.message}`);
    }
  }

  async getMessageDetails(messageId: string): Promise<MessageDetails> {
    try {
      this.logger.debug(`메시지 세부정보 가져오기 시작: ${messageId}`);

      const response = await axios.get<MessageDetails>(
        `${this.apiUrl}/messages/${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>(
              'BOT_ACCESS_TOKEN'
            )}`,
          },
        }
      );

      this.logger.debug(`메시지 응답 받음: ${JSON.stringify(response.data)}`);

      if (!response.data) {
        this.logger.warn(
          `메시지 응답에 데이터가 없음: ${JSON.stringify(response.data)}`
        );
        throw new Error('메시지 응답 데이터가 유효하지 않습니다');
      }

      return {
        text: response.data.text || '',
        personEmail: response.data.personEmail,
      };
    } catch (err) {
      const error = err as ErrorWithMessage;
      this.logger.error(`메시지 세부정보 가져오기 실패: ${error.message}`);
      this.logger.debug(
        `메시지 상세정보 오류 스택 트레이스: ${error.stack || '스택 정보 없음'}`
      );
      throw new Error(`메시지 세부정보 가져오기 실패: ${error.message}`);
    }
  }

  async getPersonDetails(personId: string): Promise<PersonDetails> {
    try {
      this.logger.debug(`사용자 세부정보 가져오기 시작: ${personId}`);

      const response = await axios.get<PersonDetails>(
        `${this.apiUrl}/people/${personId}`,
        {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>(
              'BOT_ACCESS_TOKEN'
            )}`,
          },
        }
      );

      this.logger.debug(`사용자 응답 받음: ${JSON.stringify(response.data)}`);

      if (!response.data) {
        this.logger.warn(
          `사용자 응답에 데이터가 없음: ${JSON.stringify(response.data)}`
        );
        throw new Error('사용자 응답 데이터가 유효하지 않습니다');
      }

      const person = response.data;
      return {
        id: person.id,
        emails: person.emails,
        displayName: person.displayName,
        firstName: person.firstName,
        lastName: person.lastName,
        avatar: person.avatar,
        orgId: person.orgId,
        created: person.created,
      };
    } catch (err) {
      const error = err as ErrorWithMessage;
      this.logger.error(`사용자 세부정보 가져오기 실패: ${error.message}`);
      this.logger.debug(
        `사용자 세부정보 오류 스택 트레이스: ${error.stack || '스택 정보 없음'}`
      );
      throw new Error(`사용자 세부정보 가져오기 실패: ${error.message}`);
    }
  }

  /**
   * 봇이 참여하고 있는 모든 룸 목록을 가져옵니다.
   * @returns 룸 목록
   */
  async listRooms(): Promise<
    Array<{
      id: string;
      title: string;
      type: string;
      created: string;
      lastActivity: string;
    }>
  > {
    try {
      this.logger.debug('룸 목록 가져오기 시작');

      // 응답 타입을 명시적으로 정의
      interface RoomsResponse {
        items: Array<{
          id: string;
          title: string;
          type: string;
          created: string;
          lastActivity: string;
        }>;
      }

      const response = await axios.get<RoomsResponse>(`${this.apiUrl}/rooms`, {
        headers: {
          Authorization: `Bearer ${this.configService.get<string>('BOT_ACCESS_TOKEN')}`,
        },
        params: {
          max: 100, // 최대 100개 룸 가져오기
        },
      });

      this.logger.debug(
        `룸 목록 응답 받음: ${response.data.items.length}개 룸`
      );

      if (!response.data || !response.data.items) {
        this.logger.warn('룸 목록 응답에 데이터가 없음');
        throw new Error('룸 목록 응답 데이터가 유효하지 않습니다');
      }

      return response.data.items;
    } catch (err) {
      const error = err as ErrorWithMessage;
      this.logger.error(`룸 목록 가져오기 실패: ${error.message}`);
      this.logger.debug(
        `룸 목록 오류 스택 트레이스: ${error.stack || '스택 정보 없음'}`
      );
      throw new Error(`룸 목록 가져오기 실패: ${error.message}`);
    }
  }
}
