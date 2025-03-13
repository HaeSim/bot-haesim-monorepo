'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { fetchMonitoringStats } from '../api';

// Define types for the monitoring data
interface BotStatus {
  isOnline: boolean;
  lastActivity: Date | null;
  totalWebhookLogs: number;
  totalMessages: number;
  startTime: Date;
  avatar?: string;
  displayName?: string;
  personId?: string;
}

interface Room {
  id: string;
  title: string;
  type: string;
  created: Date;
  lastActivity: Date;
}

interface WebhookLog {
  id: number;
  createdAt: Date;
  resource: string;
  event: string;
  data: unknown;
}

interface Message {
  id: number;
  messageId: string;
  roomId: string;
  personId: string;
  personEmail: string;
  text: string;
  createdAt: Date;
}

interface MonitorStats {
  botStatus: BotStatus;
  recentWebhookLogs: WebhookLog[];
  recentMessages: Message[];
  eventBreakdown: { [key: string]: number };
  resourceBreakdown: { [key: string]: number };
  activeRooms: Room[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<MonitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [apiUrl, setApiUrl] = useState<string | null>(null);

  useEffect(() => {
    // API URL 설정 및 확인
    const publicApiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    setApiUrl(publicApiUrl);

    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await fetchMonitoringStats();
        setStats(data);
        setConnected(true);
        setError(null);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError(
          'API 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.'
        );
        setConnected(false);
      } finally {
        setLoading(false);
      }
    };

    loadStats();

    // 60초마다 데이터 새로고침
    const interval = setInterval(loadStats, 60000);
    return () => clearInterval(interval);
  }, []);

  // 날짜 포맷 함수
  const formatDate = (dateStr: string | Date) => {
    if (!dateStr) return '없음';
    const date = new Date(dateStr);
    return date.toLocaleString('ko-KR');
  };

  return (
    <main className='flex min-h-screen flex-col items-center p-8'>
      <div className='w-full max-w-6xl'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold'>봇 모니터링 대시보드</h1>
          <Link
            href='/'
            className='px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600'
          >
            홈으로
          </Link>
        </div>

        {loading && !stats && (
          <div className='text-center py-10'>
            <p className='text-lg'>데이터를 불러오는 중...</p>
          </div>
        )}

        {error && (
          <div className='bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-6'>
            <p>{error}</p>
          </div>
        )}

        {stats && (
          <>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
              <div className='bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg'>
                <h2 className='text-xl font-semibold mb-2'>총 메시지 수</h2>
                <p className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
                  {stats.botStatus.totalMessages}
                </p>
                <p className='text-sm text-gray-500 mt-2'>
                  {stats.recentMessages.length > 0
                    ? `최근 메시지: ${formatDate(stats.recentMessages[0].createdAt)}`
                    : '최근 메시지 없음'}
                </p>
              </div>

              <div className='bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg'>
                <h2 className='text-xl font-semibold mb-2'>웹훅 이벤트</h2>
                <p className='text-3xl font-bold text-green-600 dark:text-green-400'>
                  {stats.botStatus.totalWebhookLogs}
                </p>
                <p className='text-sm text-gray-500 mt-2'>
                  {stats.recentWebhookLogs.length > 0
                    ? `최근 이벤트: ${formatDate(stats.recentWebhookLogs[0].createdAt)}`
                    : '최근 이벤트 없음'}
                </p>
              </div>

              <div className='bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg'>
                <h2 className='text-xl font-semibold mb-2'>활성 룸</h2>
                <p className='text-3xl font-bold text-purple-600 dark:text-purple-400'>
                  {stats.activeRooms.length}
                </p>
                <p className='text-sm text-gray-500 mt-2'>
                  {stats.activeRooms.length > 0
                    ? `최근 활동: ${formatDate(stats.activeRooms[0].lastActivity)}`
                    : '활성 룸 없음'}
                </p>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
              <div className='bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg'>
                <h2 className='text-2xl font-semibold mb-4'>봇 상태</h2>
                <div className='flex items-start mb-6'>
                  <div className='mr-4'>
                    {stats.botStatus.avatar ? (
                      <div className="w-16 h-16 rounded-full border-2 border-blue-500 relative overflow-hidden">
                        <Image 
                          src={stats.botStatus.avatar}
                          alt="Bot Avatar" 
                          className="object-cover"
                          width={64}
                          height={64}
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                        {stats.botStatus.displayName ? stats.botStatus.displayName.charAt(0) : 'B'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className='text-lg font-medium mb-1'>{stats.botStatus.displayName || 'Bot Haesim'}</h3>
                    <div className='flex items-center'>
                      <div
                        className={`w-3 h-3 rounded-full ${stats.botStatus.isOnline ? 'bg-green-500' : 'bg-red-500'} mr-2`}
                      ></div>
                      <p className='text-sm'>{stats.botStatus.isOnline ? '온라인' : '오프라인'}</p>
                    </div>
                  </div>
                </div>
                <div className='border-t dark:border-gray-700 pt-4 mt-2'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2 text-sm'>
                      <p>
                        <span className='font-medium'>시작 시간:</span><br />
                        {formatDate(stats.botStatus.startTime)}
                      </p>
                      <p>
                        <span className='font-medium'>마지막 활동:</span><br />
                        {stats.botStatus.lastActivity
                          ? formatDate(stats.botStatus.lastActivity)
                          : '없음'}
                      </p>
                    </div>
                    <div className='space-y-2 text-sm'>
                      <p>
                        <span className='font-medium'>총 메시지:</span><br />
                        <span className='text-lg font-bold text-blue-600 dark:text-blue-400'>{stats.botStatus.totalMessages}</span>
                      </p>
                      <p>
                        <span className='font-medium'>총 웹훅 로그:</span><br />
                        <span className='text-lg font-bold text-green-600 dark:text-green-400'>{stats.botStatus.totalWebhookLogs}</span>
                      </p>
                    </div>
                  </div>
                </div>
                {stats.botStatus.personId && (
                  <div className='mt-4 text-xs text-gray-500'>
                    <p>Bot ID: {stats.botStatus.personId.slice(0, 12)}...</p>
                  </div>
                )}
              </div>

              <div className='bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg'>
                <h2 className='text-2xl font-semibold mb-4'>이벤트 분석</h2>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <h3 className='text-lg font-medium mb-2'>이벤트 유형</h3>
                    <ul className='space-y-1 text-sm'>
                      {Object.entries(stats.eventBreakdown).map(
                        ([event, count]) => (
                          <li key={event} className='flex justify-between'>
                            <span>{event}</span>
                            <span className='font-medium'>{count}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className='text-lg font-medium mb-2'>리소스 유형</h3>
                    <ul className='space-y-1 text-sm'>
                      {Object.entries(stats.resourceBreakdown).map(
                        ([resource, count]) => (
                          <li key={resource} className='flex justify-between'>
                            <span>{resource}</span>
                            <span className='font-medium'>{count}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-8 mb-8'>
              <div className='bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg overflow-x-auto'>
                <h2 className='text-2xl font-semibold mb-4'>활성 룸</h2>
                {stats.activeRooms.length > 0 ? (
                  <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                    <thead>
                      <tr>
                        <th className='px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider'>
                          룸 ID
                        </th>
                        <th className='px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider'>
                          제목
                        </th>
                        <th className='px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider'>
                          유형
                        </th>
                        <th className='px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider'>
                          생성일
                        </th>
                        <th className='px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider'>
                          마지막 활동
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                      {stats.activeRooms.map((room) => (
                        <tr key={room.id}>
                          <td className='px-4 py-2 text-sm'>
                            {room.id.slice(0, 8)}...
                          </td>
                          <td className='px-4 py-2 text-sm'>{room.title}</td>
                          <td className='px-4 py-2 text-sm'>{room.type}</td>
                          <td className='px-4 py-2 text-sm'>
                            {formatDate(room.created)}
                          </td>
                          <td className='px-4 py-2 text-sm'>
                            {formatDate(room.lastActivity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className='text-gray-500'>활성 룸이 없습니다.</p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg'>
                <h2 className='text-2xl font-semibold mb-4'>최근 웹훅 로그</h2>
                {stats.recentWebhookLogs.length > 0 ? (
                  <ul className='space-y-3'>
                    {stats.recentWebhookLogs.slice(0, 5).map((log) => (
                      <li
                        key={log.id}
                        className='border-b border-gray-200 dark:border-gray-700 pb-2'
                      >
                        <div className='flex justify-between'>
                          <span className='font-medium'>
                            {log.resource} / {log.event}
                          </span>
                          <span className='text-sm text-gray-500'>
                            {formatDate(log.createdAt)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className='text-gray-500'>최근 웹훅 로그가 없습니다.</p>
                )}
              </div>

              <div className='bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg'>
                <h2 className='text-2xl font-semibold mb-4'>최근 메시지</h2>
                {stats.recentMessages.length > 0 ? (
                  <ul className='space-y-3'>
                    {stats.recentMessages.slice(0, 5).map((message) => (
                      <li
                        key={message.id}
                        className='border-b border-gray-200 dark:border-gray-700 pb-2'
                      >
                        <div className='flex justify-between'>
                          <span className='font-medium'>
                            {message.personEmail}
                          </span>
                          <span className='text-sm text-gray-500'>
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                        <p className='text-sm truncate'>{message.text}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className='text-gray-500'>최근 메시지가 없습니다.</p>
                )}
              </div>
            </div>
          </>
        )}

        <div className='mt-8 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg'>
          <h2 className='text-2xl font-semibold mb-4'>연결 정보</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <h3 className='text-lg font-medium mb-2'>API 서버</h3>
              <p className='flex items-center'>
                <span
                  className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} mr-2`}
                ></span>
                <span>{connected ? '연결됨' : '연결되지 않음'}</span>
              </p>
              <p className='text-sm text-gray-500 mt-1'>
                URL: {apiUrl || 'NEXT_PUBLIC_API_URL가 없음'}
              </p>
            </div>
            <div>
              <h3 className='text-lg font-medium mb-2'>Webex 봇 상태</h3>
              {stats ? (
                <p className='flex items-center'>
                  <span
                    className={`w-3 h-3 rounded-full ${stats.botStatus.isOnline ? 'bg-green-500' : 'bg-red-500'} mr-2`}
                  ></span>
                  <span>
                    {stats.botStatus.isOnline ? '온라인' : '오프라인'}
                  </span>
                </p>
              ) : (
                <p className='text-sm text-gray-500'>API 연결 후 확인 가능</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
