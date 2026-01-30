import { PaginationDto } from "../../common/pagination/pagination.dto";

export class ResultPaginationDto extends PaginationDto {
  courseId?: number;
  studentId?: number;
  batchId?: number;
  enrollmentId?: number;
}
