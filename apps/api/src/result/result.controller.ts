import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ApiPaginatedResponse } from '../common/pagination/pagination.service';
import { PaginationResultDto } from '../common/pagination/pagination-result.dto';
import { CreateResultDto } from './dto/create-result.dto';
import { ResultPaginationDto } from './dto/result-pagination.dto';
import { ResultResponseDto } from './dto/result-response.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { ResultService } from './result.service';

@ApiBearerAuth('JWT-auth')
@ApiTags('Result')
@Controller('result')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Post()
  create(@Body() createResultDto: CreateResultDto) {
    return this.resultService.create(createResultDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(ResultResponseDto)
  async findAll(
    @Query() filter: ResultPaginationDto,
  ): Promise<PaginationResultDto<ResultResponseDto>> {
    return this.resultService.findPaginatedResults(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResultDto: UpdateResultDto) {
    return this.resultService.update(+id, updateResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resultService.remove(+id);
  }
}
