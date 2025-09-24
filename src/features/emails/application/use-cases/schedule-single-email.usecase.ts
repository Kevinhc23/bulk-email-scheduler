import { EmailRepository } from '@/features/emails/domain/repositories/email.repository';
import { EmailEntity } from '@/features/emails/domain/entities/email';
import { JobQueue } from '@/features/emails/domain/services/job-queue';

export class ScheduleSingleEmailUseCase {
  constructor(
    private readonly emailRepo: EmailRepository,
    private readonly jobQueue: JobQueue,
  ) {}

  async execute(email: {
    to: string;
    subject: string;
    template: string;
    vars: Record<string, any>;
  }) {
    const entity = new EmailEntity(
      crypto.randomUUID(),
      email.to,
      email.subject,
      email.template,
      'pending',
      email.vars,
      new Date(),
      new Date(),
    );

    await this.emailRepo.save(entity);

    await this.jobQueue.add(
      'sendEmail',
      {
        emailId: entity.emailId,
      },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: {
          age: 3600,
          count: 5000,
        },
        removeOnFail: { age: 24 * 3600 },
      },
    );

    return { success: true, emailId: entity.emailId };
  }
}
