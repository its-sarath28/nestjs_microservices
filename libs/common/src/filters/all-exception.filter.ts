import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof RpcException) {
      const error = exception.getError();

      if (
        typeof error === 'object' &&
        error !== null &&
        'statusCode' in error
      ) {
        return response.status(error['statusCode']).json(error);
      }
      return response.status(400).json({ message: error });
    }

    if (exception instanceof HttpException) {
      return response
        .status(exception.getStatus())
        .json(exception.getResponse());
    }

    return response.status(500).json({ message: 'Internal server error' });
  }
}
