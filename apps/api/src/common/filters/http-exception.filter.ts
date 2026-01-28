import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const response = isHttpException ? exception.getResponse() : null;

    const responseMessage = isHttpException
      ? typeof response === 'string'
        ? response
        : ((response as { message?: string | string[] })?.message ?? 'Error')
      : 'Internal server error';

    const normalizedMessage = Array.isArray(responseMessage)
      ? (responseMessage[0] ?? 'Error')
      : (responseMessage ?? 'Error');

    const details: string[] = [];

    if (Array.isArray(responseMessage)) {
      details.push(
        ...responseMessage.filter(
          (item): item is string => typeof item === 'string',
        ),
      );
    }

    const stack = (exception as { stack?: string })?.stack ?? '';

    if (process.env.NODE_ENV !== 'production' && stack) {
      // will do something later;
    }

    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message: normalizedMessage,
      timestamp: new Date().toISOString(),
      path: req.url,
      details: [...details],
      stack,
    });
  }
}
