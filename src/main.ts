import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(`🚀 App running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap().catch((err) => {
  Logger.error('Error during application bootstrap', err, 'Bootstrap');
});
