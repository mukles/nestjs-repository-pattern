import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Permissions } from '../auth/decorators/permissions.decorator';
import type { JwtPayload } from '../auth/interface/jwt-interface';
import { ApiPaginatedResponse } from '../common/pagination/pagination.service';
import { PaginationResultDto } from '../common/pagination/pagination-result.dto';
import { ApiResponse } from '../common/response';
import { Permission } from '../role/enums/permission.enum';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentPaginationDto } from './dto/enrollment-pagination.dto';
import { EnrollResponseDto } from './dto/enrollment-response.dto';
import { UpdateEnrollmentStatusDto } from './dto/update-enrollment-status.dto';
import { EnrollmentService } from './enrollment.service';

@ApiBearerAuth('JWT-auth')
@ApiTags('Enrollment')
@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post('/course/:courseId/batch/:batchId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new enrollment for a student in a batch' })
  @ApiResponse(EnrollResponseDto)
  @Permissions(Permission.CREATE_ENROLLMENT)
  async create(
    @Param('courseId') courseId: string,
    @Param('batchId') batchId: string,
    @Body() createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<EnrollResponseDto> {
    return await this.enrollmentService.create(
      +courseId,
      +batchId,
      createEnrollmentDto,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get paginated list of enrollments with filters',
    description:
      'Filter by courseId, batchId, studentId, status, or date range using query parameters',
  })
  @ApiPaginatedResponse(EnrollResponseDto)
  @Permissions(Permission.READ_ENROLLMENT)
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Query() filter: EnrollmentPaginationDto,
  ): Promise<PaginationResultDto<EnrollResponseDto>> {
    return this.enrollmentService.findPaginatedEnrollments(filter, user);
  }

  @Get('/course/:courseId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get enrollments for a specific course' })
  @ApiPaginatedResponse(EnrollResponseDto)
  @Permissions(Permission.READ_ENROLLMENT)
  async findByCourse(
    @CurrentUser() user: JwtPayload,
    @Param('courseId') courseId: string,
    @Query() filter: EnrollmentPaginationDto,
  ): Promise<PaginationResultDto<EnrollResponseDto>> {
    filter.courseId = +courseId;
    return this.enrollmentService.findPaginatedEnrollments(filter, user);
  }

  @Get('/batch/:batchId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get enrollments for a specific batch' })
  @ApiPaginatedResponse(EnrollResponseDto)
  @Permissions(Permission.READ_ENROLLMENT)
  async findByBatch(
    @CurrentUser() user: JwtPayload,
    @Param('batchId') batchId: string,
    @Query() filter: EnrollmentPaginationDto,
  ): Promise<PaginationResultDto<EnrollResponseDto>> {
    filter.batchId = +batchId;
    return this.enrollmentService.findPaginatedEnrollments(filter, user);
  }

  @Get('/student/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get enrollments for a specific student' })
  @ApiPaginatedResponse(EnrollResponseDto)
  @Permissions(Permission.READ_ENROLLMENT)
  async findByStudent(
    @CurrentUser() user: JwtPayload,
    @Param('studentId') studentId: string,
    @Query() filter: EnrollmentPaginationDto,
  ): Promise<PaginationResultDto<EnrollResponseDto>> {
    filter.studentId = +studentId;
    return this.enrollmentService.findPaginatedEnrollments(filter, user);
  }

  @Get('/:enrollmentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get enrollment details by ID' })
  @ApiResponse(EnrollResponseDto)
  @Permissions(Permission.READ_ENROLLMENT)
  async findOne(
    @Param('enrollmentId') enrollmentId: string,
  ): Promise<EnrollResponseDto> {
    return await this.enrollmentService.findOne(+enrollmentId);
  }

  @Patch('/:enrollmentId/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update enrollment status',
    description:
      'Update enrollment status. When setting status to SUSPENDED, suspensionReason is required.',
  })
  @ApiResponse(EnrollResponseDto)
  @Permissions(Permission.UPDATE_ENROLLMENT)
  async updateEnrollmentStatus(
    @Param('enrollmentId') enrollmentId: string,
    @Body() updateStatusDto: UpdateEnrollmentStatusDto,
  ): Promise<EnrollResponseDto> {
    return this.enrollmentService.updateEnrollmentStatus(
      +enrollmentId,
      updateStatusDto,
    );
  }
}
