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
      ApiResponse<T> | (PaginationResultDto<T> & Pick<ApiResponse<T>, 'message' | 'timestamp'>)
    >
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<
    ApiResponse<T> | (PaginationResultDto<T> & Pick<ApiResponse<T>, 'message' | 'timestamp'>)
  > {
    return next.handle().pipe(
      map(
        (
          data,
        ):
          | ApiResponse<T>
          | (PaginationResultDto<T> & Pick<ApiResponse<T>, 'message' | 'timestamp'>) => {
          if (data && typeof data === 'object' && 'meta' in data && 'data' in data) {
            const paginated = data as PaginationResultDto<T>;
            return {
              ...paginated,
              message: 'Success',
              timestamp: new Date().toISOString(),
            };
          }

          return {
            data: data as T,
            message: 'Success',
            timestamp: new Date().toISOString(),
          } satisfies ApiResponse<T>;
        },
      ),
    );
  }
}
