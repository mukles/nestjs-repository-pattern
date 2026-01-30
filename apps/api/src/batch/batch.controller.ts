import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiResponse as ApiSwaggerResponse,
  ApiTags,
} from "@nestjs/swagger";

import { Permissions } from "../auth/decorators/permissions.decorator";
import { ApiResponse } from "../common/response";
import { Permission } from "../role/enums/permission.enum";
import { BatchService } from "./batch.service";
import { BatchResponseDto } from "./dto/batch-response.dto";
import { CreateBatchDto } from "./dto/create-batch.dto";
import { UpdateBatchDto } from "./dto/update-batch.dto";

@ApiBearerAuth("JWT-auth")
@ApiTags("Batch")
@Controller("courses/:courseId/batches")
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse(BatchResponseDto)
  @Permissions(Permission.CREATE_COURSE)
  async create(
    @Param("courseId", ParseIntPipe) courseId: number,
    @Body() createBatchDto: CreateBatchDto,
  ): Promise<BatchResponseDto> {
    return this.batchService.create(courseId, createBatchDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiSwaggerResponse({ type: [BatchResponseDto] })
  async findAll(
    @Param("courseId", ParseIntPipe) courseId: number,
  ): Promise<BatchResponseDto[]> {
    return this.batchService.findAll(courseId);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponse(BatchResponseDto)
  async findOne(
    @Param("courseId", ParseIntPipe) courseId: number,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<BatchResponseDto> {
    return this.batchService.findOne(courseId, id);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponse(BatchResponseDto)
  @Permissions(Permission.UPDATE_COURSE)
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Param("courseId", ParseIntPipe) courseId: number,
    @Body() updateBatchDto: UpdateBatchDto,
  ): Promise<BatchResponseDto> {
    return this.batchService.update(id, updateBatchDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions(Permission.DELETE_COURSE)
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.batchService.remove(id);
  }
}
