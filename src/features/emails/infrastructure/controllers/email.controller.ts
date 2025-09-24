import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ScheduleBulkEmailsUseCase } from '@/features/emails/application/use-cases/schedule-bulk-emails.usecase';
import { ScheduleSingleEmailUseCase } from '@/features/emails/application/use-cases/schedule-single-email.usecase';

@Controller('emails')
export class EmailController {
  constructor(
    private readonly scheduleBulkEmails: ScheduleBulkEmailsUseCase,
    private readonly scheduleSingleEmail: ScheduleSingleEmailUseCase,
  ) {}

  @Post('send-bulk')
  async sendBulk(
    @Body()
    body: {
      recipients: {
        to: string;
        subject: string;
        template: string;
        vars: Record<string, any>;
      }[];
    },
  ) {
    if (!body?.recipients?.length) {
      throw new BadRequestException('Debe enviar al menos un destinatario');
    }
    const emails = body.recipients.map((r) => ({
      id: randomUUID(),
      to: r.to,
      subject: r.subject,
      template: r.template,
      vars: r.vars,
    }));

    await this.scheduleBulkEmails.execute(emails);

    return { message: 'Emails scheduled successfully', count: emails.length };
  }

  @Post('send-one')
  async sendOne(
    @Body()
    body: {
      id: string;
      to: string;
      subject: string;
      template: string;
      vars: Record<string, any>;
    },
  ) {
    return await this.scheduleSingleEmail.execute(body);
  }
}
