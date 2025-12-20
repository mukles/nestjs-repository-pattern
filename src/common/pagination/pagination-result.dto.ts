export class PaginationResultDto<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
