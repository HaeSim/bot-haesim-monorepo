'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // 사용자 메시지 추가
    const userMessage = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    
    // 로딩 시작
    setIsLoading(true);
    
    // 초기 응답 메시지 (빈 내용)
    const assistantMessage = { role: 'assistant' as const, content: '' };
    setMessages((prev) => [...prev, assistantMessage]);
    
    try {
      // SSE 연결 설정
      const eventSource = new EventSource(
        `/api/ollama/chat/stream?prompt=${encodeURIComponent(input)}`
      );
      
      // 새 메시지 수신 시
      eventSource.onmessage = (event) => {
        const text = event.data;
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          const lastMessage = newMessages[newMessages.length - 1];
          
          // 마지막 메시지가 assistant의 것인지 확인
          if (lastMessage && lastMessage.role === 'assistant') {
            // 이전 내용에 새 내용 추가
            lastMessage.content += text;
          }
          
          return newMessages;
        });
      };
      
      // 에러 발생 시
      eventSource.onerror = (error) => {
        console.error('SSE Error:', error);
        eventSource.close();
        setIsLoading(false);
      };
      
      // 완료 시
      eventSource.addEventListener('complete', () => {
        eventSource.close();
        setIsLoading(false);
      });
      
      // 입력 초기화
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      <div className="bg-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">Ollama Chat</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>채팅을 시작하세요</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-100 ml-auto max-w-[80%]'
                  : 'bg-gray-200 mr-auto max-w-[80%]'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? '보내는 중...' : '보내기'}
          </button>
        </form>
      </div>
    </div>
  );
}