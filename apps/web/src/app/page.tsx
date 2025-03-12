import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-8'>
      <div className='w-full max-w-5xl'>
        <h1 className='text-4xl font-bold mb-8 text-center'>
          Bot Haesim 모노레포
        </h1>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg'>
            <h2 className='text-2xl font-semibold mb-4'>
              NestJS API (Webex Bot)
            </h2>
            <p className='mb-4'>
              Webex 봇 및 모니터링 대시보드를 제공하는 NestJS 애플리케이션
            </p>
            <div className='flex space-x-4'>
              <Link
                href='http://localhost:3000'
                className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                target='_blank'
              >
                API 방문
              </Link>
              <Link
                href='http://localhost:3000/health'
                className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
                target='_blank'
              >
                헬스 체크
              </Link>
            </div>
          </div>

          <div className='bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg'>
            <h2 className='text-2xl font-semibold mb-4'>
              NextJS 웹 애플리케이션
            </h2>
            <p className='mb-4'>
              향상된 사용자 인터페이스와 관리 기능을 제공하는 NextJS
              애플리케이션
            </p>
            <p className='text-sm text-gray-500 mb-4'>
              API와 Docker 네트워크를 통해 통신합니다.
            </p>
            <div className='flex space-x-4'>
              <Link
                href='/dashboard'
                className='px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700'
              >
                대시보드
              </Link>
            </div>
          </div>
        </div>

        <div className='mt-12 p-6 bg-gray-100 dark:bg-slate-700 rounded-lg'>
          <h2 className='text-xl font-semibold mb-4'>모노레포 구조</h2>
          <pre className='bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto'>
            {`bot-haesim-monorepo/
├── apps/
│   ├── api/        # NestJS 애플리케이션
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
    </main>
  );
}
