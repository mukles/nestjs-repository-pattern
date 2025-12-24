import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import { HealthResponseDto } from './common/dto/health-response.dto';
import { ApiResponse } from './common/response';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  @Public()
  @ApiResponse(HealthResponseDto)
  getHello(): HealthResponseDto {
    return this.appService.getHello();
  }
}
