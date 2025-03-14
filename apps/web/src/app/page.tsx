import Link from 'next/link';
import Image from 'next/image';
import { Button } from 'ui';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-8 bg-gray-50 dark:bg-gray-900'>
      <div className='w-full max-w-5xl'>
        <header className='flex flex-col items-center mb-12'>
          <div className='w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-xl'>
            <span className='text-4xl font-bold text-white'>H</span>
          </div>
          <h1 className='text-5xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            Bot Haesim
          </h1>
          <p className='text-gray-500 dark:text-gray-400 text-xl'>
            Webex 통합 봇 플랫폼
          </p>
          <div className='mt-6 flex gap-4'>
            <Button variant='default'>시작하기</Button>
            <Button variant='outline'>더 알아보기</Button>
          </div>
        </header>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
          <div className='bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 border border-transparent hover:border-blue-500'>
            <div className='flex items-center mb-4'>
              <div className='rounded-full bg-blue-100 dark:bg-blue-900 p-3 mr-4'>
                <Image
                  src='/globe.svg'
                  width={24}
                  height={24}
                  alt='API'
                  className='text-blue-600'
                />
              </div>
              <h2 className='text-2xl font-semibold'>NestJS API (Webex Bot)</h2>
            </div>
            <p className='mb-4 text-gray-600 dark:text-gray-300'>
              Webex 봇 및 모니터링 대시보드를 제공하는 NestJS 애플리케이션으로,
              실시간 메시지 처리와 상태 모니터링을 지원합니다.
            </p>
            <div className='flex space-x-4'>
              <Link
                href={
                  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
                }
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center'
                target='_blank'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 mr-2'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                  />
                </svg>
                API 방문
              </Link>
              <Link
                href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/health`}
                className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center'
                target='_blank'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 mr-2'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                헬스 체크
              </Link>
            </div>
          </div>

          <div className='bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 border border-transparent hover:border-indigo-500'>
            <div className='flex items-center mb-4'>
              <div className='rounded-full bg-indigo-100 dark:bg-indigo-900 p-3 mr-4'>
                <Image
                  src='/window.svg'
                  width={24}
                  height={24}
                  alt='Web App'
                  className='text-indigo-600'
                />
              </div>
              <h2 className='text-2xl font-semibold'>NextJS 웹 애플리케이션</h2>
            </div>
            <p className='mb-4 text-gray-600 dark:text-gray-300'>
              향상된 사용자 인터페이스와 관리 기능을 제공하는 NextJS
              애플리케이션으로, 직관적인 봇 관리와 실시간 대시보드를 제공합니다.
            </p>
            <p className='text-sm text-gray-500 mb-4'>
              API와 Docker 네트워크를 통해 통신합니다.
            </p>
            <div className='flex space-x-4'>
              <Link
                href='/dashboard'
                className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 mr-2'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                  />
                </svg>
                대시보드
              </Link>
              <Link
                href='/chat'
                className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 mr-2'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
                  />
                </svg>
                채팅 인터페이스
              </Link>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg mb-12'>
          <h2 className='text-2xl font-semibold mb-6 border-b pb-3 dark:border-gray-700'>
            주요 기능
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20'>
              <h3 className='text-lg font-medium mb-2 text-blue-700 dark:text-blue-300'>
                Webex 통합
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Webex 메시징 플랫폼과 완벽하게 통합된 봇 솔루션을 제공합니다.
              </p>
            </div>
            <div className='p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20'>
              <h3 className='text-lg font-medium mb-2 text-purple-700 dark:text-purple-300'>
                Ollama AI 지원
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                로컬 LLM 모델을 활용한 AI 응답 지원으로 프라이버시를 보장합니다.
              </p>
            </div>
            <div className='p-4 rounded-lg bg-green-50 dark:bg-green-900/20'>
              <h3 className='text-lg font-medium mb-2 text-green-700 dark:text-green-300'>
                실시간 모니터링
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                봇 활동과 사용 통계를 실시간으로 모니터링하고 분석합니다.
              </p>
            </div>
          </div>
        </div>

        <div className='p-6 bg-gray-100 dark:bg-slate-700 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-4 flex items-center'>
            <Image
              src='/file.svg'
              width={20}
              height={20}
              alt='Code'
              className='mr-2'
            />
            모노레포 구조
          </h2>
          <pre className='bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto'>
            {`bot-haesim-monorepo/
├── apps/
│   ├── api/        # NestJS 애플리케이션
│   ├── ollama/     # Ollama AI 컨테이너
│   └── web/        # NextJS 애플리케이션
├── packages/
│   ├── eslint-config/
│   ├── typescript-config/
│   └── ui/         # 공유 컴포넌트
├── turbo.json
└── package.json`}
          </pre>
        </div>
      </div>

      <footer className='mt-12 text-center text-gray-500 text-sm'>
        <p>© 2025 Bot Haesim - Webex 통합 봇 플랫폼</p>
      </footer>
    </main>
  );
}
