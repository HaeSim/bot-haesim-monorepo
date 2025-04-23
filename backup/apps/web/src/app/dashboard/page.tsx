import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui';
import { Badge } from 'ui';
import { Alert, AlertDescription, AlertTitle } from 'ui';

// 메시지, 웹훅 로그, 대화방 등의 타입 정의
interface Message {
  id: string;
  createdAt: string;
  personEmail: string;
  text: string;
}

interface WebhookLog {
  id: string;
  createdAt: string;
  resource: string;
  event: string;
}

interface Room {
  id: string;
  title: string;
  type: string;
  created: string;
  lastActivity: string;
}

interface BotStatus {
  isOnline: boolean;
  displayName: string;
  startTime: string;
  lastActivity: string;
  totalWebhookLogs: number;
  totalMessages: number;
}

interface MonitoringStats {
  botStatus: BotStatus;
  recentMessages: Message[];
  recentWebhookLogs: WebhookLog[];
  activeRooms: Room[];
  eventBreakdown: Record<string, number>;
  resourceBreakdown: Record<string, number>;
}

async function fetchMonitoringStats(): Promise<MonitoringStats | null> {
  const apiUrl = process.env.API_SERVER_URL || 'http://localhost:8080';
  try {
    const response = await fetch(`${apiUrl}/monitor/stats`, {
      next: { revalidate: 60 }, // 60초마다 재검증
    });

    if (!response.ok) {
      throw new Error('API 응답이 정상적이지 않습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('모니터링 통계 가져오기 실패:', error);
    return null;
  }
}

export default async function Dashboard() {
  const stats = await fetchMonitoringStats();
  const connected = stats !== null;

  // 날짜 포맷 함수
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '없음';
    const date = new Date(dateStr);
    return date.toLocaleString('ko-KR');
  };

  return (
    <div className='container mx-auto py-6'>
      <div className='flex flex-col space-y-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>봇 대시보드</h1>
          <p className='text-muted-foreground'>
            봇 상태와 활동을 모니터링합니다.
          </p>
        </div>

        {!connected ? (
          <Alert variant='destructive'>
            <AlertTitle>연결 오류</AlertTitle>
            <AlertDescription>
              API 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.
            </AlertDescription>
          </Alert>
        ) : (
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>상태</CardTitle>
                <Badge
                  variant={stats.botStatus.isOnline ? 'default' : 'destructive'}
                >
                  {stats.botStatus.isOnline ? '온라인' : '오프라인'}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {stats.botStatus.displayName || '봇'}
                </div>
                <p className='text-xs text-muted-foreground'>
                  {formatDate(stats.botStatus.startTime)} 부터 실행 중
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  마지막 활동
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {formatDate(stats.botStatus.lastActivity)}
                </div>
                <p className='text-xs text-muted-foreground'>
                  마지막 메시지 확인 시간
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Webhook 로그
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {stats.botStatus.totalWebhookLogs.toLocaleString()}
                </div>
                <p className='text-xs text-muted-foreground'>
                  수신된 총 webhook 수
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>총 메시지</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {stats.botStatus.totalMessages.toLocaleString()}
                </div>
                <p className='text-xs text-muted-foreground'>
                  처리된 총 메시지 수
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {connected && (
          <Tabs defaultValue='activities'>
            <TabsList>
              <TabsTrigger value='activities'>활동</TabsTrigger>
              <TabsTrigger value='rooms'>대화방</TabsTrigger>
              <TabsTrigger value='analytics'>통계</TabsTrigger>
            </TabsList>

            <TabsContent value='activities' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>최근 메시지</CardTitle>
                  <CardDescription>
                    봇이 최근에 받은 메시지 목록입니다.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>시간</TableHead>
                        <TableHead>사용자</TableHead>
                        <TableHead>내용</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.recentMessages.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className='text-center'>
                            메시지가 없습니다.
                          </TableCell>
                        </TableRow>
                      ) : (
                        stats.recentMessages.map((msg: Message) => (
                          <TableRow key={msg.id}>
                            <TableCell className='whitespace-nowrap'>
                              {formatDate(msg.createdAt)}
                            </TableCell>
                            <TableCell className='whitespace-nowrap'>
                              {msg.personEmail.split('@')[0]}
                            </TableCell>
                            <TableCell className='max-w-xs truncate'>
                              {msg.text}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>최근 Webhook 로그</CardTitle>
                  <CardDescription>
                    Webex로부터 수신된 최근 웹훅 이벤트입니다.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>시간</TableHead>
                        <TableHead>리소스</TableHead>
                        <TableHead>이벤트</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.recentWebhookLogs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className='text-center'>
                            Webhook 로그가 없습니다.
                          </TableCell>
                        </TableRow>
                      ) : (
                        stats.recentWebhookLogs.map((log: WebhookLog) => (
                          <TableRow key={log.id}>
                            <TableCell className='whitespace-nowrap'>
                              {formatDate(log.createdAt)}
                            </TableCell>
                            <TableCell>
                              <Badge variant='outline'>{log.resource}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant='secondary'>{log.event}</Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='rooms' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>활성 대화방</CardTitle>
                  <CardDescription>
                    봇이 참여하고 있는 대화방 목록입니다.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>대화방 이름</TableHead>
                        <TableHead>유형</TableHead>
                        <TableHead>생성 일자</TableHead>
                        <TableHead>마지막 활동</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.activeRooms.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className='text-center'>
                            참여중인 대화방이 없습니다.
                          </TableCell>
                        </TableRow>
                      ) : (
                        stats.activeRooms.map((room: Room) => (
                          <TableRow key={room.id}>
                            <TableCell>{room.title}</TableCell>
                            <TableCell>
                              <Badge variant='outline'>
                                {room.type === 'group' ? '그룹' : '1:1'}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(room.created)}</TableCell>
                            <TableCell>
                              {formatDate(room.lastActivity)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='analytics' className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Card>
                  <CardHeader>
                    <CardTitle>이벤트 분석</CardTitle>
                    <CardDescription>
                      Webex 이벤트 유형별 발생 빈도
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-2'>
                      {Object.entries(stats.eventBreakdown).map(
                        ([event, count]: [string, number]) => (
                          <div
                            key={event}
                            className='flex items-center justify-between'
                          >
                            <div className='space-x-2'>
                              <Badge variant='outline'>{event}</Badge>
                              <span className='text-sm text-muted-foreground'>
                                {count}회
                              </span>
                            </div>
                            <div className='w-full max-w-[200px] h-2 rounded-full bg-secondary'>
                              <div
                                className='h-full rounded-full bg-primary'
                                style={{
                                  width: `${Math.min(100, (count / Math.max(...Object.values(stats.eventBreakdown))) * 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>리소스 분석</CardTitle>
                    <CardDescription>
                      Webex 리소스 유형별 발생 빈도
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-2'>
                      {Object.entries(stats.resourceBreakdown).map(
                        ([resource, count]: [string, number]) => (
                          <div
                            key={resource}
                            className='flex items-center justify-between'
                          >
                            <div className='space-x-2'>
                              <Badge variant='outline'>{resource}</Badge>
                              <span className='text-sm text-muted-foreground'>
                                {count}회
                              </span>
                            </div>
                            <div className='w-full max-w-[200px] h-2 rounded-full bg-secondary'>
                              <div
                                className='h-full rounded-full bg-primary'
                                style={{
                                  width: `${Math.min(100, (count / Math.max(...Object.values(stats.resourceBreakdown))) * 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
