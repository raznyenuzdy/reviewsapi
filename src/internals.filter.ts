import { ExceptionFilter, Catch, ArgumentsHost, HttpException, InternalServerErrorException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';

// @Catch()
// export class InternalsFilter<T> implements ExceptionFilter {
//     catch(exception: T, host: ArgumentsHost) { }
// }

@Catch(HttpException)
export class InternalsFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception instanceof HttpException ? exception.getStatus() : 500;
        response
            .status(status)
            .json({
                name: exception.name,
                message: exception.message,
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
    }
}

// @Catch()
// export class InternalsFilter extends BaseExceptionFilter {
//   catch(exception: unknown, host: ArgumentsHost) {
//     super.catch(exception, host);
//   }
// }
// AllExceptionsFilter
