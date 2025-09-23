/**
 * Email Entity representing an email in the system.
 * @category Domain
 * @subcategory Emails
 * @module EmailEntity
 * @version 1.0.0
 * @since 2025-09-22
 */
export class EmailEntity {
  constructor(
    public emailId: string,
    public to: string,
    public subject: string,
    public template: string,
    public status: 'pending' | 'delivery' | 'failed',
    public variables: Record<string, string | number | boolean>,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  markAsDelivered() {
    this.status = 'delivery';
    this.updatedAt = new Date();
  }

  markAsFailed() {
    this.status = 'failed';
    this.updatedAt = new Date();
  }
}
