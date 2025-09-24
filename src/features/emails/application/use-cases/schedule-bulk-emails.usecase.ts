import { EmailRepository } from '@/features/emails/domain/repositories/email.repository';
import { EmailEntity } from '@/features/emails/domain/entities/email';
import { JobQueue } from '@/features/emails/domain/services/job-queue';
import { chunk } from 'lodash';

export class ScheduleBulkEmailsUseCase {
  constructor(
    private readonly emailRepo: EmailRepository,
    private readonly jobQueue: JobQueue,
  ) {}

  async execute(
    emails: {
      id: string;
      to: string;
      subject: string;
      template: string;
      vars: Record<string, any>;
    }[],
  ) {
    const entities = emails.map(
      (e) =>
        new EmailEntity(
          e.id,
          e.to,
          e.subject,
          e.template,
          'pending',
          e.vars,
          new Date(),
          new Date(),
        ),
    );

    const entityChunks = chunk(entities, 500);
    for (const c of entityChunks) {
      await this.emailRepo.saveMany(c);
    }

    const jobChunks = chunk(emails, 1000);
    for (const c of jobChunks) {
      await this.jobQueue.addBulk(
        c.map((e) => ({
          name: 'sendEmail',
          data: { emailId: e.id },
          opts: {
            attempts: 5,
            backoff: { type: 'exponential', delay: 5000 },
            removeOnComplete: {
              age: 3600,
              count: 5000,
            },
            removeOnFail: { age: 24 * 3600 },
          },
        })),
      );
    }
  }
}
