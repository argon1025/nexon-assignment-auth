import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClsService } from 'nestjs-cls';

import { AppModule } from './app.module';
import { CustomLogger } from './common/logger/custom-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // ConfigService
  const configService = app.get(ConfigService);
  const SERVICE_NAME = configService.getOrThrow<string>('SERVICE_NAME');
  const PORT = configService.getOrThrow<string>('PORT');
  const ENV = configService.getOrThrow<string>('NODE_ENV');

  // Logger
  const cls = app.get(ClsService);
  app.useLogger(new CustomLogger(cls, configService));

  // Swagger
  if (ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle(SERVICE_NAME)
      .setDescription(`${SERVICE_NAME} Service API Docs`)
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api', app, document, {
      customSiteTitle: `${SERVICE_NAME} Service API Docs`,
    });
  }

  await app.listen(PORT);
  Logger.log(`${SERVICE_NAME} is running on port ${PORT} in ${ENV}`, 'Bootstrap');
  Logger.log(`API Docs: http://localhost:${PORT}/api`);
}
bootstrap();
