import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'ui';
import { Input } from 'ui';
import { Label } from 'ui';
import { Button } from 'ui';
import { Switch } from 'ui';
import { Separator } from 'ui';

export default function SettingsPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>설정</h1>
        <p className='text-muted-foreground'>시스템 설정을 관리합니다.</p>
      </div>

      <Tabs defaultValue='general'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='general'>일반</TabsTrigger>
          <TabsTrigger value='security'>보안</TabsTrigger>
          <TabsTrigger value='advanced'>고급</TabsTrigger>
        </TabsList>

        <TabsContent value='general'>
          <Card>
            <CardHeader>
              <CardTitle>일반 설정</CardTitle>
              <CardDescription>기본 사이트 설정을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='site-name'>사이트 이름</Label>
                <Input
                  id='site-name'
                  placeholder='사이트 이름'
                  defaultValue='내 웹사이트'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='site-description'>사이트 설명</Label>
                <Input
                  id='site-description'
                  placeholder='사이트 설명'
                  defaultValue='사이트 설명을 입력하세요'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='contact-email'>연락처 이메일</Label>
                <Input
                  id='contact-email'
                  type='email'
                  placeholder='admin@example.com'
                />
              </div>
              <div className='flex items-center space-x-2'>
                <Switch id='maintenance-mode' />
                <Label htmlFor='maintenance-mode'>유지보수 모드 활성화</Label>
              </div>
            </CardContent>
            <CardFooter className='flex justify-between'>
              <Button variant='outline'>초기화</Button>
              <Button>변경사항 저장</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value='security'>
          <Card>
            <CardHeader>
              <CardTitle>보안 설정</CardTitle>
              <CardDescription>보안 및 인증 설정을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='session-timeout'>세션 타임아웃 (분)</Label>
                <Input id='session-timeout' type='number' defaultValue='30' />
              </div>
              <div className='flex items-center space-x-2'>
                <Switch id='force-2fa' />
                <Label htmlFor='force-2fa'>2단계 인증 강제 적용</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Switch id='password-expiry' />
                <Label htmlFor='password-expiry'>
                  비밀번호 만료 활성화 (90일)
                </Label>
              </div>
              <Separator />
              <div className='space-y-2'>
                <h3 className='text-lg font-medium'>로그인 제한</h3>
                <div className='space-y-2'>
                  <Label htmlFor='max-attempts'>최대 로그인 시도 횟수</Label>
                  <Input id='max-attempts' type='number' defaultValue='5' />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='lockout-time'>잠금 시간 (분)</Label>
                  <Input id='lockout-time' type='number' defaultValue='30' />
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex justify-between'>
              <Button variant='outline'>초기화</Button>
              <Button>변경사항 저장</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value='advanced'>
          <Card>
            <CardHeader>
              <CardTitle>고급 설정</CardTitle>
              <CardDescription>
                고급 시스템 설정입니다. 변경 시 주의하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='api-url'>API URL</Label>
                <Input id='api-url' defaultValue='https://api.example.com' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='max-upload'>최대 업로드 크기 (MB)</Label>
                <Input id='max-upload' type='number' defaultValue='5' />
              </div>
              <div className='flex items-center space-x-2'>
                <Switch id='debug-mode' />
                <Label htmlFor='debug-mode'>디버그 모드 활성화</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Switch id='enable-cache' defaultChecked />
                <Label htmlFor='enable-cache'>캐싱 활성화</Label>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='log-level'>로그 레벨</Label>
                <select className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'>
                  <option>정보 (INFO)</option>
                  <option>경고 (WARNING)</option>
                  <option>오류 (ERROR)</option>
                  <option>디버그 (DEBUG)</option>
                </select>
              </div>
            </CardContent>
            <CardFooter className='flex justify-between'>
              <Button variant='outline'>초기화</Button>
              <Button>변경사항 저장</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
