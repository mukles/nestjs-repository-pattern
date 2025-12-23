import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T = any> {
  @ApiProperty({ description: 'Response data' })
  data: T;

  @ApiProperty({ description: 'Response message', example: 'Success' })
  message: string;

  @ApiProperty({
    description: 'Response timestamp',
    example: '2025-12-24T10:00:00.000Z',
    format: 'date-time',
  })
  timestamp: string;

  @ApiProperty({ description: 'HTTP status code', example: 200 })
  statusCode: number;
}
