import { MailProvider } from '@/features/emails/domain/services/mail-provider';
import { Resend } from 'resend';
import { compile } from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { Injectable, Logger } from '@nestjs/common';

/**
 * Implementación de MailProvider usando Resend + Handlebars
 * Cumple con SRP, OCP y DIP (SOLID).
 */
@Injectable()
export class ResendProvider implements MailProvider {
  private readonly resend: Resend;
  private readonly logger = new Logger(ResendProvider.name);
  private readonly templatesCache = new Map<
    string,
    HandlebarsTemplateDelegate
  >();
  private readonly templatesPath: string;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.templatesPath =
      process.env.EMAIL_TEMPLATES_PATH ??
      path.join(process.cwd(), 'src', 'templates', 'emails');
  }

  async send(
    to: string,
    subject: string,
    templateName: string,
    variables: Record<string, any>,
  ): Promise<void> {
    const compiledTemplate = this.getTemplate(templateName);
    const templateHtml = compiledTemplate(variables);

    const { data, error } = await this.resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL as string,
      to,
      subject,
      html: templateHtml,
    });

    if (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    this.logger.log(`Email sent successfully to ${to} with ID ${data?.id}`);
  }

  /**
   * Obtiene y cachea una plantilla Handlebars.
   * Si no existe, lanza un error claro de dominio.
   */
  private getTemplate(templateName: string): HandlebarsTemplateDelegate {
    if (this.templatesCache.has(templateName)) {
      return this.templatesCache.get(templateName)!;
    }

    const templatePath = path.join(this.templatesPath, `${templateName}.hbs`);

    if (!fs.existsSync(templatePath)) {
      throw new Error(
        `Email template "${templateName}" not found at ${templatePath}`,
      );
    }

    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    const compiled = compile(templateContent);

    this.templatesCache.set(templateName, compiled);
    return compiled;
  }
}
