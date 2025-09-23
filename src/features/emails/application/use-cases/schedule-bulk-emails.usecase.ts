import { EmailRepository } from '@/features/emails/domain/repositories/email.repository';
import { EmailEntity } from '@/features/emails/domain/entities/email';
import { JobQueue } from '@/features/emails/domain/services/job-queue';

/**
 * Use case to schedule bulk emails by saving them to the repository and adding them to the job queue.
 * This class handles the creation of email entities and queues them for sending.
 * It ensures that each email is saved and queued with retry logic.
 * Dependencies:
 * - EmailRepository: Interface for email data operations.
 * - JobQueue: Interface for job queue operations.
 * Methods:
 * - execute(emails): Schedules the provided emails for sending.
 * Parameters:
 * - emails: Array of email data objects containing id, to, subject, template, and vars.
 * Returns: Promise<void>
 * Errors: Throws error if saving to repository or adding to queue fails.
 * Example usage:
 * const useCase = new ScheduleBulkEmailsUseCase(emailRepo, jobQueue);
 * await useCase.execute(emailList);
 * @category Use Cases
 * @subcategory Emails
 * @see EmailRepository
 * @see JobQueue
 * @see EmailEntity
 * @module ScheduleBulkEmailsUseCase
 * @version 1.0.0
 * @since 2025-09-22
 */
export class ScheduleBulkEmailsUseCase {
  constructor(
    private readonly emailRepo: EmailRepository,
    private readonly jobQueue: JobQueue,
  ) {}

  /**
   * Schedules bulk emails by saving them to the repository and adding them to the job queue.
   * @param emails Array of email data objects to be scheduled.
   * Each object should contain:
   * - id: Unique identifier for the email.
   * - to: Recipient email address.
   * - subject: Subject of the email.
   * - template: Template identifier for the email content.
   * - vars: Variables to be used in the email template.
   * @returns Promise<void>
   * @throws Error if saving to repository or adding to queue fails.
   */
  async execute(
    emails: {
      id: string;
      to: string;
      subject: string;
      template: string;
      vars: Record<string, any>;
    }[],
  ) {
    const tasks = emails.map(async (e) => {
      const entity = new EmailEntity(
        e.id,
        e.to,
        e.subject,
        e.template,
        'pending',
        e.vars,
        new Date(),
        new Date(),
      );

      await this.emailRepo.save(entity);

      await this.jobQueue.add(
        'send-email',
        { emailId: e.id },
        { attempts: 3, backoff: { type: 'exponential', delay: 2000 } },
      );
    });

    await Promise.all(tasks);
  }
}
