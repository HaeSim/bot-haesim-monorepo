import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic'; // No caching

export async function GET(request: NextRequest) {
  // Request URL 쿼리 파라미터에서 prompt와 model 추출
  const searchParams = request.nextUrl.searchParams;
  const prompt = searchParams.get('prompt');
  const model = searchParams.get('model');

  if (!prompt) {
    return new Response('Prompt is required', { status: 400 });
  }

  // API 서버 URL 설정
  const apiServerUrl = process.env.API_SERVER_URL || 'http://localhost:8080';
  const url = new URL(`/ollama/chat/stream`, apiServerUrl);
  
  // 쿼리 파라미터 추가
  url.searchParams.append('prompt', prompt);
  if (model) {
    url.searchParams.append('model', model);
  }

  try {
    // NestJS API 요청을 대신 프록시
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    // SSE 응답 스트림 생성
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              break;
            }
            
            controller.enqueue(value);
          }
        } catch (error) {
          console.error('Stream reading error:', error);
        } finally {
          controller.close();
          reader.releaseLock();
        }
      }
    });

    // SSE 헤더와 함께 스트림 반환
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error proxying to API:', error);
    return new Response('Error connecting to API', { status: 500 });
  }
}