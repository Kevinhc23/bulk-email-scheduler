import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EmailRepository } from '@/features/emails/domain/repositories/email.repository';
import { MailProvider } from '@/features/emails/domain/services/mail-provider';

@Injectable()
@Processor('email')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(
    @Inject('EmailRepository') private readonly emailRepo: EmailRepository,
    @Inject('MailProvider') private readonly mailProvider: MailProvider,
  ) {
    super();
  }

  /**
   * Método que procesa todos los jobs de la cola "email".
   * BullMQ no usa @Process como Bull clásico.
   */
  async process(job: Job<{ emailId: string }>): Promise<void> {
    this.logger.log(`Processing job ${job.id} for emailId ${job.data.emailId}`);

    const email = await this.emailRepo.getEmailById(job.data.emailId);
    if (!email) {
      this.logger.error(`Email with id ${job.data.emailId} not found`);
      throw new Error('Email not found');
    }

    try {
      await this.mailProvider.send(
        email.to,
        email.subject,
        email.template,
        email.variables,
      );

      await this.emailRepo.updateEmailStatus(email.emailId, 'delivery');
      this.logger.log(`Email ${email.emailId} sent successfully`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        await this.emailRepo.updateEmailStatus(email.emailId, 'failed');
        this.logger.error(
          `Failed to send email ${email.emailId}: ${err.message}`,
        );
      }
      throw err;
    }
  }
}
