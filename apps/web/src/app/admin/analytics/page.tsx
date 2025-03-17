import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui';

export default function AnalyticsPage() {
  // 모의 데이터 - 실제로는 API 호출 등을 통해 데이터를 가져올 것입니다
  const monthlyData = [
    { month: '1월', users: 120, sessions: 450, pageViews: 1200 },
    { month: '2월', users: 150, sessions: 550, pageViews: 1500 },
    { month: '3월', users: 180, sessions: 600, pageViews: 1800 },
    { month: '4월', users: 210, sessions: 700, pageViews: 2100 },
    { month: '5월', users: 250, sessions: 850, pageViews: 2500 },
  ];

  const topPages = [
    { url: '/home', views: 1250, uniqueVisitors: 980 },
    { url: '/products', views: 950, uniqueVisitors: 780 },
    { url: '/about', views: 700, uniqueVisitors: 650 },
    { url: '/contact', views: 550, uniqueVisitors: 510 },
    { url: '/blog', views: 480, uniqueVisitors: 420 },
  ];

  const devices = [
    { type: '데스크탑', percentage: 65 },
    { type: '모바일', percentage: 30 },
    { type: '태블릿', percentage: 5 },
  ];

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>통계</h1>
        <p className='text-muted-foreground'>
          시스템 사용 통계 및 분석 데이터를 확인하세요.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>총 방문자</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>12,345</div>
            <p className='text-xs text-muted-foreground'>
              +15% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>총 페이지뷰</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>48,567</div>
            <p className='text-xs text-muted-foreground'>+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>
              평균 체류 시간
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>2분 45초</div>
            <p className='text-xs text-muted-foreground'>-2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>이탈률</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>32.5%</div>
            <p className='text-xs text-muted-foreground'>-5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue='overview'>
        <TabsList>
          <TabsTrigger value='overview'>개요</TabsTrigger>
          <TabsTrigger value='pages'>페이지</TabsTrigger>
          <TabsTrigger value='devices'>기기</TabsTrigger>
        </TabsList>

        <TabsContent value='overview'>
          <Card>
            <CardHeader>
              <CardTitle>월별 통계</CardTitle>
              <CardDescription>지난 5개월간의 통계 데이터</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='relative h-80 overflow-hidden rounded-lg border bg-background p-4'>
                <div className='h-full w-full'>
                  {/* 실제 구현에서는 Chart.js, Recharts 등의 차트 라이브러리 사용 */}
                  <div className='flex h-full flex-col justify-end'>
                    <div className='flex h-full items-end gap-2'>
                      {monthlyData.map((data, i) => (
                        <div
                          key={i}
                          className='relative flex flex-col items-center'
                        >
                          <div className='flex gap-1'>
                            <div
                              className='w-12 bg-primary'
                              style={{ height: `${data.users}px` }}
                            ></div>
                            <div
                              className='w-12 bg-blue-400'
                              style={{ height: `${data.sessions / 2}px` }}
                            ></div>
                            <div
                              className='w-12 bg-blue-200'
                              style={{ height: `${data.pageViews / 5}px` }}
                            ></div>
                          </div>
                          <span className='absolute -bottom-6 text-xs'>
                            {data.month}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='absolute bottom-4 right-4 flex items-center gap-2 text-xs'>
                    <div className='flex items-center gap-1'>
                      <div className='h-2 w-2 bg-primary'></div>
                      <span>사용자</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <div className='h-2 w-2 bg-blue-400'></div>
                      <span>세션</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <div className='h-2 w-2 bg-blue-200'></div>
                      <span>페이지뷰</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='pages'>
          <Card>
            <CardHeader>
              <CardTitle>인기 페이지</CardTitle>
              <CardDescription>가장 많이 방문한 페이지</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='rounded-md border'>
                <div className='grid grid-cols-3 p-4 font-medium'>
                  <div>페이지</div>
                  <div className='text-right'>조회수</div>
                  <div className='text-right'>방문자 수</div>
                </div>
                {topPages.map((page, i) => (
                  <div key={i} className='grid grid-cols-3 border-t p-4'>
                    <div className='truncate'>{page.url}</div>
                    <div className='text-right'>
                      {page.views.toLocaleString()}
                    </div>
                    <div className='text-right'>
                      {page.uniqueVisitors.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='devices'>
          <Card>
            <CardHeader>
              <CardTitle>기기별 사용자</CardTitle>
              <CardDescription>기기 유형별 방문자 비율</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-8'>
                {devices.map((device, i) => (
                  <div key={i} className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div className='font-medium'>{device.type}</div>
                      <div className='text-sm text-muted-foreground'>
                        {device.percentage}%
                      </div>
                    </div>
                    <div className='h-2 w-full overflow-hidden rounded-full bg-secondary'>
                      <div
                        className='h-full bg-primary'
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
