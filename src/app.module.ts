import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EmailModule } from '@/features/emails/infrastructure/email.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueueAsync({
      name: 'transactional',
    }),
    EmailModule,
  ],
})
export class AppModule {}
