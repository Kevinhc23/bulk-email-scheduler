/**
 * Job Queue interface for adding jobs to the queue.
 * This interface defines the contract for adding jobs to a job queue system.
 * @category Services
 * @subcategory Emails
 * @see BullMQ
 * @module JobQueue
 * @version 1.0.0
 * @since 2025-09-22
 */
export interface JobQueue {
  add(jobName: string, payload: any, options?: any): Promise<void>;
}
