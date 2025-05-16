import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  private readonly SERVICE_NAME: string;

  constructor(
    private readonly cls: ClsService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.SERVICE_NAME = this.configService.getOrThrow<string>('SERVICE_NAME');
  }

  log(message: string, context?: string) {
    const requestId = this.cls.getId() ?? 'N/A';
    const contextText = context || this.SERVICE_NAME;
    super.log(`[${requestId}] ${message}`, contextText);
  }

  error(message: string, stack?: string, context?: string) {
    const requestId = this.cls.getId() ?? 'N/A';
    const contextText = context || this.SERVICE_NAME;
    super.error(`[${requestId}] ${message}`, stack, contextText);
  }

  warn(message: string, context?: string) {
    const requestId = this.cls.getId() ?? 'N/A';
    const contextText = context || this.SERVICE_NAME;
    super.warn(`[${requestId}] ${message}`, contextText);
  }

  debug(message: string, context?: string) {
    const requestId = this.cls.getId() ?? 'N/A';
    const contextText = context || this.SERVICE_NAME;
    super.debug(`[${requestId}] ${message}`, contextText);
  }

  verbose(message: string, context?: string) {
    const requestId = this.cls.getId() ?? 'N/A';
    const contextText = context || this.SERVICE_NAME;
    super.verbose(`[${requestId}] ${message}`, contextText);
  }
}
