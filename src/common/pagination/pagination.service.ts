import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

import { PaginationDto, SortOrder } from './pagination.dto';
import { PaginationResultDto } from './pagination-result.dto';

export class PaginationService {
  static async paginate<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    pagination: PaginationDto,
  ): Promise<PaginationResultDto<T>> {
    const page = pagination.page || 1;
    const pageSize = pagination.pageSize || 10;
    const orderBy = pagination.orderBy || 'id';
    const sortOrder = pagination.sortOrder || SortOrder.ASC;

    queryBuilder.orderBy(orderBy, sortOrder);
    queryBuilder.skip((page - 1) * pageSize).take(pageSize);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      pageSize,
    };
  }
}
