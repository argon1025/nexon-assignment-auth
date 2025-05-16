import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, httpVersion } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(`HTTP/${httpVersion} ${method} ${statusCode} ${originalUrl}`);
    });

    next();
  }
}
