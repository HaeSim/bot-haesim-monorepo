import { Body, Controller, Post, Query, Sse } from '@nestjs/common';
import { Observable, firstValueFrom, map } from 'rxjs';
import { OllamaService } from './ollama.service';

interface ChatRequestDto {
  prompt: string;
  model?: string;
}

interface MessageEvent {
  data: string;
}

@Controller('ollama')
export class OllamaController {
  constructor(private readonly ollamaService: OllamaService) {}

  @Post('chat')
  async generateChat(@Body() chatRequest: ChatRequestDto) {
    const result = await firstValueFrom(this.ollamaService.generateChatCompletion(
      chatRequest.prompt,
      chatRequest.model,
    ));
    
    return { response: result };
  }

  @Sse('chat/stream')
  streamChat(@Query('prompt') prompt: string, @Query('model') model?: string): Observable<MessageEvent> {
    return this.ollamaService.streamChatCompletion(
      prompt,
      model,
    ).pipe(
      map((data) => {
        return { data };
      }),
    );
  }
}