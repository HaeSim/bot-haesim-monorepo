import React from 'react';
import Link from 'next/link';
import { Toaster } from 'ui';
import { Separator } from 'ui';
import { Button } from 'ui';
import { Avatar, AvatarFallback, AvatarImage } from 'ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'ui';

export const metadata = {
  title: '관리자 대시보드',
  description: '관리자 대시보드 페이지',
};

interface SidebarItemProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const SidebarItem = ({ href, children, icon }: SidebarItemProps) => (
  <Link href={href} className='block w-full'>
    <Button variant='ghost' className='w-full justify-start'>
      {icon && <span className='mr-2'>{icon}</span>}
      {children}
    </Button>
  </Link>
);

const Sidebar = () => {
  return (
    <aside className='w-64 h-screen border-r bg-background'>
      <div className='p-6 flex items-center'>
        <Avatar className='h-8 w-8 mr-2'>
          <AvatarFallback>H</AvatarFallback>
        </Avatar>
        <h1 className='text-2xl font-bold'>관리자</h1>
      </div>
      <Separator />
      <nav className='p-2'>
        <SidebarItem
          href='/admin'
          icon={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='w-4 h-4'
            >
              <rect width='7' height='9' x='3' y='3' rx='1' />
              <rect width='7' height='5' x='14' y='3' rx='1' />
              <rect width='7' height='9' x='14' y='12' rx='1' />
              <rect width='7' height='5' x='3' y='16' rx='1' />
            </svg>
          }
        >
          대시보드
        </SidebarItem>
        <SidebarItem
          href='/admin/users'
          icon={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='w-4 h-4'
            >
              <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
              <circle cx='9' cy='7' r='4' />
              <path d='M22 21v-2a4 4 0 0 0-3-3.87' />
              <path d='M16 3.13a4 4 0 0 1 0 7.75' />
            </svg>
          }
        >
          사용자 관리
        </SidebarItem>
        <SidebarItem
          href='/admin/settings'
          icon={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='w-4 h-4'
            >
              <path d='M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z' />
              <circle cx='12' cy='12' r='3' />
            </svg>
          }
        >
          설정
        </SidebarItem>
        <SidebarItem
          href='/admin/analytics'
          icon={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='w-4 h-4'
            >
              <path d='M3 3v18h18' />
              <path d='m19 9-5 5-4-4-3 3' />
            </svg>
          }
        >
          통계
        </SidebarItem>
      </nav>

      <Separator className='my-4' />

      <div className='px-3'>
        <h3 className='mb-2 px-4 text-xs font-semibold text-muted-foreground'>
          기타
        </h3>
        <nav>
          <SidebarItem
            href='/'
            icon={
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='w-4 h-4'
              >
                <path d='m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
                <polyline points='9 22 9 12 15 12 15 22' />
              </svg>
            }
          >
            홈으로 이동
          </SidebarItem>
          <SidebarItem
            href='/dashboard'
            icon={
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='w-4 h-4'
              >
                <path d='M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z' />
                <path d='m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9' />
                <path d='M12 3v6' />
              </svg>
            }
          >
            대시보드
          </SidebarItem>
        </nav>
      </div>
    </aside>
  );
};

const AdminHeader = () => {
  return (
    <header className='h-14 border-b px-6 flex items-center justify-between'>
      <div></div>
      <div className='flex items-center gap-4'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 rounded-full'>
              <Avatar className='h-8 w-8'>
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>내 계정</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>프로필</DropdownMenuItem>
            <DropdownMenuItem>설정</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>로그아웃</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen bg-muted/10'>
      <Sidebar />
      <div className='flex-1 flex flex-col'>
        <AdminHeader />
        <main className='flex-1 p-6 overflow-auto'>{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
