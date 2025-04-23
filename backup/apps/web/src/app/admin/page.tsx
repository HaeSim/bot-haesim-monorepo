import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from 'ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui';
import { Button } from 'ui';
import { Badge } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui';

export default function AdminDashboard() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>관리자 대시보드</h1>
          <p className='text-muted-foreground'>
            시스템 개요 및 주요 지표를 확인하세요.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button size='sm' variant='outline'>
            새로고침
          </Button>
          <Button size='sm'>새 사용자 추가</Button>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>총 사용자</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
              <circle cx='9' cy='7' r='4' />
              <path d='M22 21v-2a4 4 0 0 0-3-3.87' />
              <path d='M16 3.13a4 4 0 0 1 0 7.75' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>1,234</div>
            <p className='text-xs text-muted-foreground'>
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>신규 가입자</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
              <circle cx='12' cy='7' r='4' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>+145</div>
            <p className='text-xs text-muted-foreground'>+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>활성 세션</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>324</div>
            <p className='text-xs text-muted-foreground'>
              +18% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>서버 업타임</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <rect width='20' height='14' x='2' y='5' rx='2' />
              <path d='M2 10h20' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>99.9%</div>
            <p className='text-xs text-muted-foreground'>지난 30일</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue='overview'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='overview'>시스템 개요</TabsTrigger>
          <TabsTrigger value='activity'>최근 활동</TabsTrigger>
          <TabsTrigger value='servers'>서버 상태</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>시스템 리소스</CardTitle>
              <CardDescription>현재 시스템 성능 및 활용 통계</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div className='w-2 h-2 rounded-full bg-green-500'></div>
                      <span className='text-sm font-medium'>CPU 사용량</span>
                    </div>
                    <span className='text-sm'>32%</span>
                  </div>
                  <div className='w-full h-2 rounded-full bg-muted'>
                    <div className='h-full w-[32%] rounded-full bg-green-500'></div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div className='w-2 h-2 rounded-full bg-blue-500'></div>
                      <span className='text-sm font-medium'>메모리 사용량</span>
                    </div>
                    <span className='text-sm'>68%</span>
                  </div>
                  <div className='w-full h-2 rounded-full bg-muted'>
                    <div className='h-full w-[68%] rounded-full bg-blue-500'></div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div className='w-2 h-2 rounded-full bg-yellow-500'></div>
                      <span className='text-sm font-medium'>디스크 사용량</span>
                    </div>
                    <span className='text-sm'>45%</span>
                  </div>
                  <div className='w-full h-2 rounded-full bg-muted'>
                    <div className='h-full w-[45%] rounded-full bg-yellow-500'></div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div className='w-2 h-2 rounded-full bg-purple-500'></div>
                      <span className='text-sm font-medium'>
                        네트워크 트래픽
                      </span>
                    </div>
                    <span className='text-sm'>28%</span>
                  </div>
                  <div className='w-full h-2 rounded-full bg-muted'>
                    <div className='h-full w-[28%] rounded-full bg-purple-500'></div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant='outline' size='sm' className='ml-auto'>
                자세히 보기
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value='activity' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>최근 활동</CardTitle>
              <CardDescription>
                시스템에서 일어난 최근 활동입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>시간</TableHead>
                    <TableHead>이벤트</TableHead>
                    <TableHead>사용자</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      time: '10분 전',
                      event: '로그인',
                      user: 'admin@example.com',
                      status: '성공',
                    },
                    {
                      time: '25분 전',
                      event: '사용자 생성',
                      user: 'admin@example.com',
                      status: '성공',
                    },
                    {
                      time: '1시간 전',
                      event: '설정 변경',
                      user: 'user@example.com',
                      status: '성공',
                    },
                    {
                      time: '2시간 전',
                      event: '로그인 시도',
                      user: 'visitor@example.com',
                      status: '실패',
                    },
                    {
                      time: '1일 전',
                      event: '시스템 업데이트',
                      user: 'system',
                      status: '성공',
                    },
                  ].map((activity, i) => (
                    <TableRow key={i}>
                      <TableCell>{activity.time}</TableCell>
                      <TableCell>{activity.event}</TableCell>
                      <TableCell>{activity.user}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            activity.status === '성공'
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {activity.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant='outline' size='sm' className='ml-auto'>
                더 보기
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value='servers' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>서버 상태</CardTitle>
              <CardDescription>
                시스템 서버의 현재 상태를 확인합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>서버명</TableHead>
                    <TableHead>역할</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>마지막 체크</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      name: 'api-server-01',
                      role: 'API',
                      status: '정상',
                      lastCheck: '1분 전',
                    },
                    {
                      name: 'web-server-01',
                      role: '웹',
                      status: '정상',
                      lastCheck: '2분 전',
                    },
                    {
                      name: 'db-server-01',
                      role: '데이터베이스',
                      status: '정상',
                      lastCheck: '3분 전',
                    },
                    {
                      name: 'cache-server-01',
                      role: '캐시',
                      status: '정상',
                      lastCheck: '1분 전',
                    },
                    {
                      name: 'worker-server-01',
                      role: '작업자',
                      status: '주의',
                      lastCheck: '5분 전',
                    },
                  ].map((server, i) => (
                    <TableRow key={i}>
                      <TableCell className='font-medium'>
                        {server.name}
                      </TableCell>
                      <TableCell>{server.role}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            server.status === '정상'
                              ? 'default'
                              : server.status === '주의'
                                ? 'secondary'
                                : 'destructive'
                          }
                        >
                          {server.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{server.lastCheck}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant='outline' size='sm' className='ml-auto'>
                모든 서버 보기
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
