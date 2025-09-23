import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EmailController } from '@/features/emails/infrastructure/controllers/email.controller';
import { PrismaEmailRepository } from '@/features/emails/infrastructure/repositories/prisma-email.repository';
import { BullmqJobQueue } from '@/features/emails/infrastructure/queues/bullmq-job-queue';
import { ResendProvider } from '@/features/emails/infrastructure/providers/resend.provider';
import { EmailProcessor } from '@/features/emails/infrastructure/processors/email.processor';
import { ScheduleBulkEmailsUseCase } from '@/features/emails/application/use-cases/schedule-bulk-emails.usecase';
import { PrismaModule } from '@/common/database/prisma.module';
import { EmailRepository } from '@/features/emails/domain/repositories/email.repository';

@Module({
  imports: [BullModule.registerQueue({ name: 'email' }), PrismaModule],
  providers: [
    {
      provide: 'EmailRepository',
      useClass: PrismaEmailRepository,
    },
    {
      provide: 'MailProvider',
      useClass: ResendProvider,
    },
    BullmqJobQueue,
    {
      provide: ScheduleBulkEmailsUseCase,
      useFactory: (repo: EmailRepository, queue: BullmqJobQueue) =>
        new ScheduleBulkEmailsUseCase(repo, queue),
      inject: ['EmailRepository', BullmqJobQueue],
    },
    EmailProcessor,
  ],
  controllers: [EmailController],
})
export class EmailModule {}
