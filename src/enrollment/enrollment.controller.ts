import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/pagination/pagination.service';
import { PaginationResultDto } from 'src/common/pagination/pagination-result.dto';

import { Permissions } from '../auth/decorators/permissions.decorator';
import { ApiResponse } from '../common/response';
import { Permission } from '../role/enums/permission.enum';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentPaginationDto } from './dto/enrollment-pagination.dto';
import { EnrollResponseDto } from './dto/enrollment-response.dto';
import { EnrollmentService } from './enrollment.service';

@ApiBearerAuth('JWT-auth')
@ApiTags('Enrollment')
@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Get('/:courseId')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(EnrollResponseDto)
  async findAll(
    @Query() filter: EnrollmentPaginationDto,
  ): Promise<PaginationResultDto<EnrollResponseDto>> {
    return this.enrollmentService.findPaginatedEnrollments(filter);
  }

  @Patch('/:enrollmentId/status')
  @HttpCode(HttpStatus.OK)
  @ApiResponse(EnrollResponseDto)
  @Permissions(Permission.UPDATE_ENROLLMENT)
  async updateEnrollmentStatus(
    @Param('enrollmentId') enrollmentId: string,
    @Body() enrollment: CreateEnrollmentDto,
  ): Promise<EnrollResponseDto> {
    return this.enrollmentService.updateEnrollmentStatus(enrollmentId, enrollment);
  }
}
