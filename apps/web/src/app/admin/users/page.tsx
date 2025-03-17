import React from 'react';
import { Button } from 'ui';
import { Input } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui';
import { Checkbox } from 'ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'ui';

const USERS = [
  {
    id: '1',
    name: '김철수',
    email: 'kim@example.com',
    role: '관리자',
    status: '활성',
    lastActive: '2023-05-20T13:45:30',
  },
  {
    id: '2',
    name: '이영희',
    email: 'lee@example.com',
    role: '사용자',
    status: '활성',
    lastActive: '2023-05-19T10:23:12',
  },
  {
    id: '3',
    name: '박민준',
    email: 'park@example.com',
    role: '편집자',
    status: '비활성',
    lastActive: '2023-05-15T09:15:45',
  },
  {
    id: '4',
    name: '최지우',
    email: 'choi@example.com',
    role: '사용자',
    status: '활성',
    lastActive: '2023-05-18T16:30:00',
  },
  {
    id: '5',
    name: '정도윤',
    email: 'jung@example.com',
    role: '사용자',
    status: '활성',
    lastActive: '2023-05-20T08:50:22',
  },
];

export default function UsersPage() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>사용자 관리</h1>
          <p className='text-muted-foreground'>시스템 사용자를 관리합니다.</p>
        </div>
        <Button>새 사용자 추가</Button>
      </div>

      <div className='flex items-center gap-2'>
        <Input placeholder='사용자 검색...' className='max-w-sm' />
        <Button variant='outline'>검색</Button>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[50px]'>
                <Checkbox />
              </TableHead>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>역할</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>마지막 활동</TableHead>
              <TableHead className='w-[100px]'>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {USERS.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === '활성'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(user.lastActive).toLocaleString('ko-KR')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='sm'>
                        •••
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuLabel>작업</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>편집</DropdownMenuItem>
                      <DropdownMenuItem>비밀번호 재설정</DropdownMenuItem>
                      <DropdownMenuItem className='text-red-600'>
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
