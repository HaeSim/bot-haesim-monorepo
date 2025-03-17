'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from 'ui';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from 'ui';
import { Textarea } from 'ui';
import { Avatar, AvatarFallback } from 'ui';

export default function ChatPage() {
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const adjustTextareaHeight = () => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);

    const assistantMessage = { role: 'assistant' as const, content: '' };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const apiUrl =
        typeof window !== 'undefined'
          ? process.env.NEXT_PUBLIC_API_URL || '/api'
          : process.env.API_SERVER_URL || 'http://api:8080';

      const eventSource = new EventSource(
        `${apiUrl}/ollama/chat/stream?prompt=${encodeURIComponent(input)}`
      );

      eventSource.onmessage = (event) => {
        const text = event.data;
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          const lastMessage = newMessages[newMessages.length - 1];

          if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.content += text;
          }

          return newMessages;
        });
      };

      eventSource.onerror = (error) => {
        console.error('SSE Error:', error);
        eventSource.close();
        setIsLoading(false);
      };

      eventSource.addEventListener('complete', () => {
        eventSource.close();
        setIsLoading(false);
      });

      setInput('');
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className='container mx-auto py-6'>
      <Card className='h-[calc(100vh-10rem)]'>
        <CardHeader>
          <CardTitle>Ollama 채팅</CardTitle>
          <CardDescription>
            로컬 LLM 모델을 활용한 대화형 AI 인터페이스입니다.
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col h-[calc(100%-10rem)]'>
          <div className='flex-1 overflow-y-auto pr-4'>
            <div className='space-y-4 mb-4'>
              {messages.length === 0 ? (
                <div className='text-center py-12'>
                  <p className='text-2xl font-semibold text-muted-foreground mb-2'>
                    Ollama와 대화를 시작하세요
                  </p>
                  <p className='text-muted-foreground'>
                    메시지를 입력하면 AI가 응답합니다
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`flex ${
                        message.role === 'user'
                          ? 'flex-row-reverse'
                          : 'flex-row'
                      } items-start gap-2 max-w-[80%]`}
                    >
                      <Avatar className='h-8 w-8'>
                        <AvatarFallback>
                          {message.role === 'user' ? 'U' : 'AI'}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className='whitespace-pre-wrap break-words'>
                          {message.content || (
                            <span className='text-muted-foreground italic'>
                              {isLoading && message.role === 'assistant'
                                ? '생각 중...'
                                : ''}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </CardContent>
        <CardFooter className='border-t pt-4'>
          <form className='w-full flex gap-2' onSubmit={handleSubmit}>
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder='메시지를 입력하세요...'
              className='min-h-[40px] resize-none flex-1'
              disabled={isLoading}
            />
            <Button type='submit' disabled={isLoading || !input.trim()}>
              전송
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
