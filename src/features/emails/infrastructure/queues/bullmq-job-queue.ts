import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { JobQueue } from '@/features/emails/domain/services/job-queue';

@Injectable()
export class BullmqJobQueue implements JobQueue {
  constructor(@InjectQueue('email') private readonly queue: Queue) {}

  async add(jobName: string, payload: any, options?: any): Promise<void> {
    await this.queue.add(jobName, payload, options);
  }

  async addBulk(
    jobs: {
      name: string;
      data: Record<string, any>;
      opts?: Record<string, any>;
    }[],
  ): Promise<void> {
    await this.queue.addBulk(jobs);
  }
}
