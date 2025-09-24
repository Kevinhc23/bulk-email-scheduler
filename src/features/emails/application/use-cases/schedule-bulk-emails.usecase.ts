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
    // 1. Crear todas las entidades
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

    // 2. Guardar en DB en bloques de 500
    const entityChunks = chunk(entities, 500);
    for (const c of entityChunks) {
      await this.emailRepo.saveMany(c);
    }

    // 3. Encolar jobs en bloques
    const jobChunks = chunk(emails, 1000);
    for (const c of jobChunks) {
      await this.jobQueue.addBulk(
        c.map((e) => ({
          name: 'sendEmail',
          data: { emailId: e.id },
          opts: { attempts: 3, backoff: { type: 'exponential', delay: 3000 } },
        })),
      );
    }
  }
}
