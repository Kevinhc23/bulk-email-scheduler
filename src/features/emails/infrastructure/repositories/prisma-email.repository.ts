import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/connection';
import { EmailRepository } from '@/features/emails/domain/repositories/email.repository';
import { EmailEntity } from '@/features/emails/domain/entities/email';

@Injectable()
export class PrismaEmailRepository implements EmailRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(email: EmailEntity): Promise<void> {
    await this.prisma.email.create({
      data: {
        emailId: email.emailId,
        to: email.to,
        subject: email.subject,
        template: email.template,
        variables: email.variables,
        status: email.status,
        createdAt: email.createdAt,
        updatedAt: email.updatedAt,
      },
    });
  }

  async updateEmailStatus(
    emailId: string,
    status: 'pending' | 'delivery' | 'failed',
  ): Promise<void> {
    await this.prisma.email.update({
      where: { emailId },
      data: { status, updatedAt: new Date() },
    });
  }

  async getEmailById(emailId: string): Promise<EmailEntity | null> {
    const email = await this.prisma.email.findUnique({
      where: { emailId },
    });

    if (!email) {
      throw new Error('Email not found');
    }
    return new EmailEntity(
      email.id,
      email.to,
      email.subject,
      email.template,
      email.status as 'pending' | 'delivery' | 'failed',
      email.variables as Record<string, any>,
      email.createdAt,
      email.updatedAt,
    );
  }
}
