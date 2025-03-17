import Link from 'next/link';
import { Button } from 'ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui';
import { Badge } from 'ui';

export default function Home() {
  return (
    <div className='container mx-auto py-10 px-4'>
      <section className='space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-16'>
        <div className='flex max-w-[980px] flex-col items-center gap-4 text-center'>
          <Badge className='mb-4' variant='outline'>
            Webex 통합 봇 플랫폼
          </Badge>
          <h1 className='text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl'>
            Bot Haesim
          </h1>
          <p className='max-w-[700px] text-lg text-muted-foreground sm:text-xl'>
            효율적인 Webex 통합형 봇 솔루션과 관리 시스템
          </p>
          <div className='flex w-full items-center justify-center space-x-4 py-4'>
            <Link href='/dashboard'>
              <Button size='lg'>시작하기</Button>
            </Link>
            <Link href='/chat'>
              <Button variant='outline' size='lg'>
                채팅 인터페이스
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Tabs defaultValue='services' className='w-full'>
        <TabsList className='mb-6 grid w-full grid-cols-2 md:w-[400px]'>
          <TabsTrigger value='services'>서비스</TabsTrigger>
          <TabsTrigger value='features'>주요 기능</TabsTrigger>
        </TabsList>

        <TabsContent value='services' className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle>NestJS API (Webex Bot)</CardTitle>
                <CardDescription>
                  Webex 봇 및 모니터링 대시보드를 제공하는 NestJS 애플리케이션
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>
                  실시간 메시지 처리와 상태 모니터링을 지원합니다. 봇의 모든
                  활동을 추적하고 관리할 수 있습니다.
                </p>
              </CardContent>
              <CardFooter className='flex justify-between'>
                <Link
                  href={
                    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
                  }
                  target='_blank'
                >
                  <Button variant='outline'>API 방문</Button>
                </Link>
                <Link
                  href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/health`}
                  target='_blank'
                >
                  <Button variant='secondary'>헬스 체크</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>NextJS 웹 애플리케이션</CardTitle>
                <CardDescription>
                  향상된 사용자 인터페이스와 관리 기능을 제공하는 NextJS
                  애플리케이션
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>
                  직관적인 봇 관리와 실시간 대시보드를 제공합니다. API와 Docker
                  네트워크를 통해 통신합니다.
                </p>
              </CardContent>
              <CardFooter className='flex justify-between'>
                <Link href='/dashboard'>
                  <Button variant='outline'>대시보드</Button>
                </Link>
                <Link href='/chat'>
                  <Button variant='secondary'>채팅 인터페이스</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='features' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>주요 기능</CardTitle>
              <CardDescription>
                Bot Haesim이 제공하는 핵심 기능들
              </CardDescription>
            </CardHeader>
            <CardContent className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='p-4 rounded-lg bg-accent'>
                <h3 className='text-lg font-medium mb-2'>Webex 통합</h3>
                <p className='text-sm text-muted-foreground'>
                  Webex 메시징 플랫폼과 완벽하게 통합된 봇 솔루션을 제공합니다.
                </p>
              </div>
              <div className='p-4 rounded-lg bg-accent'>
                <h3 className='text-lg font-medium mb-2'>Ollama AI 지원</h3>
                <p className='text-sm text-muted-foreground'>
                  로컬 LLM 모델을 활용한 AI 응답 지원으로 프라이버시를
                  보장합니다.
                </p>
              </div>
              <div className='p-4 rounded-lg bg-accent'>
                <h3 className='text-lg font-medium mb-2'>실시간 모니터링</h3>
                <p className='text-sm text-muted-foreground'>
                  봇 활동과 사용 통계를 실시간으로 모니터링하고 분석합니다.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>모노레포 구조</CardTitle>
              <CardDescription>프로젝트의 코드 구조</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className='bg-muted p-4 rounded-md overflow-x-auto text-xs md:text-sm font-mono'>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
