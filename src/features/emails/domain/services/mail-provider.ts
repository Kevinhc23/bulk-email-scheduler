export interface MailProvider {
  send(
    to: string,
    subject: string,
    template: string,
    variables: Record<string, any>,
  ): Promise<void>;
}
