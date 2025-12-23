import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiResponse } from '../interfaces/api-response.interface';
import { PaginationResultDto } from '../pagination/pagination-result.dto';

@Injectable()
export class ResponseInterceptor<T>
  implements
    NestInterceptor<
      T,
      | ApiResponse<T>
      | (PaginationResultDto<T> & Pick<ApiResponse<T>, 'message' | 'timestamp' | 'statusCode'>)
    >
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<
    | ApiResponse<T>
    | (PaginationResultDto<T> & Pick<ApiResponse<T>, 'message' | 'timestamp' | 'statusCode'>)
  > {
    const http = context.switchToHttp();
    const response = http.getResponse<Response>();
    const statusCode = response.status ?? 200;

    return next.handle().pipe(
      map((data) => {
        const timestamp = new Date().toISOString();

        if (data && typeof data === 'object' && 'meta' in data && 'data' in data) {
          const paginated = data as PaginationResultDto<T>;
          return {
            ...paginated,
            message: 'Success',
            timestamp,
            statusCode,
          };
        }

        return {
          data: data as T,
          message: 'Success',
          timestamp,
          statusCode,
        } satisfies ApiResponse<T>;
      }),
    );
  }
}
