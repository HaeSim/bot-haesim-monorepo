'use client';

import { useState, useRef, useEffect } from 'react';

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
    <div className='flex flex-col h-screen max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
      <div className='bg-white dark:bg-gray-800 p-4 shadow-md'>
        <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-100'>
          Ollama Chat
        </h1>
      </div>

      <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900'>
        {messages.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400'>
            <div className='w-16 h-16 mb-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-8 h-8 text-blue-500 dark:text-blue-300'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z'
                />
              </svg>
            </div>
            <p className='text-lg'>무엇이든 물어보세요</p>
            <p className='text-sm mt-2'>AI 어시스턴트가 도와드립니다</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-4 rounded-lg max-w-[85%] ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white dark:bg-blue-600'
                    : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100'
                }`}
              >
                <p className='whitespace-pre-wrap'>
                  {message.content ||
                    (isLoading && index === messages.length - 1 ? (
                      <span className='inline-flex items-center'>
                        <span className='animate-pulse'>생각 중</span>
                        <span className='ml-1 animate-bounce delay-100'>.</span>
                        <span className='animate-bounce delay-200'>.</span>
                        <span className='animate-bounce delay-300'>.</span>
                      </span>
                    ) : (
                      ''
                    ))}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className='p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 shadow-md'>
        <form onSubmit={handleSubmit} className='flex space-x-2'>
          <div className='flex-1 relative'>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder='메시지를 입력하세요...'
              className='w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-blue-500 resize-none min-h-[44px] max-h-[200px] pr-12'
              disabled={isLoading}
              rows={1}
            />
            <div className='absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500'>
              {isLoading ? '' : 'Enter = 전송, Shift+Enter = 줄바꿈'}
            </div>
          </div>
          <button
            type='submit'
            disabled={isLoading || !input.trim()}
            className='px-4 py-2 h-full bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-gray-600'
          >
            {isLoading ? (
              <span className='flex items-center'>
                <svg
                  className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                전송 중
              </span>
            ) : (
              '전송'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
