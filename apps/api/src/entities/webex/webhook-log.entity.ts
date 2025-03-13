import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('WEBHOOK_LOGS') // Oracle에서는 대문자 테이블명 권장
export class WebhookLog {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ name: 'WEBHOOK_ID', type: 'varchar2', length: 100 })
  webhookId: string;

  @Column({ name: 'RAW_DATA', type: 'clob' })
  rawData: string;

  @Column({ name: 'EVENT_TYPE', type: 'varchar2', length: 100, nullable: true })
  eventType: string;

  @Column({
    name: 'RESOURCE_TYPE',
    type: 'varchar2',
    length: 100,
    nullable: true,
  })
  resourceType: string;

  @CreateDateColumn({ name: 'CREATED_AT', type: 'timestamp' })
  createdAt: Date;
}