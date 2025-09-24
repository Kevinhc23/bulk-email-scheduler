import { EmailEntity } from '@/features/emails/domain/entities/email';

/**
 * Repository interface for Email entity operations.
 * This interface defines the contract for saving, updating, and retrieving email entities.
 * Implementations of this interface should handle the actual data storage and retrieval logic.
 * Methods:
 * - save(email): Saves a new email entity to the repository.
 * - updateEmailStatus(emailId, status): Updates the status of an existing email entity.
 * - getEmailById(emailId): Retrieves an email entity by its unique identifier.
 * Parameters:
 * - email: EmailEntity object to be saved.
 * - emailId: Unique identifier of the email entity.
 * - status: New status for the email entity ('pending', 'delivery', 'failed').
 * Returns: Promise<void> for save and update methods, Promise<EmailEntity | null> for get method.
 * Errors: Implementations should handle and throw errors for any data operation failures.
 * Example usage:
 * const emailRepo: EmailRepository = new EmailRepositoryImpl();
 * await emailRepo.save(emailEntity);
 * const email = await emailRepo.getEmailById(emailId);
 * await emailRepo.updateEmailStatus(emailId, 'delivery');
 * @category Repositories
 * @subcategory Emails
 * @see EmailEntity
 * @module EmailRepository
 * @version 1.0.0
 * @since 2025-09-22
 **/
export interface EmailRepository {
  save(email: EmailEntity): Promise<void>;
  updateEmailStatus(
    emailId: string,
    status: 'pending' | 'delivery' | 'failed',
  ): Promise<void>;
  getEmailById(emailId: string): Promise<EmailEntity | null>;
  saveMany(emails: EmailEntity[]): Promise<void>;
}
