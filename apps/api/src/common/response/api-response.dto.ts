import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ApiResponseDto<T = any> {
  @ApiProperty({ description: "Response data" })
  data: T;

  @ApiProperty({ description: "Response message", example: "Success" })
  message: string;

  @ApiProperty({
    description: "Response timestamp",
    example: "2025-12-24T10:00:00.000Z",
    format: "date-time",
  })
  timestamp: string;

  @ApiProperty({ description: "HTTP status code", example: 200 })
  statusCode: number;

  constructor(data: T, message: string, statusCode: number) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
}

export class ApiErrorResponseDto {
  @ApiProperty({ description: "HTTP status code", example: 400 })
  statusCode: number;

  @ApiProperty({
    description: "Error message",
    example: "Bad Request",
  })
  message: string;

  @ApiProperty({
    description: "Response timestamp",
    example: "2025-12-24T10:00:00.000Z",
    format: "date-time",
  })
  timestamp: string;

  @ApiPropertyOptional({
    description: "Request path",
    example: "/api/v1/students",
  })
  path?: string;

  @ApiPropertyOptional({
    description: "Error type",
    example: "Bad Request",
  })
  error?: string;

  @ApiPropertyOptional({
    description: "Detailed error messages",
    example: ["Field name is required", "Email must be valid"],
    type: [String],
  })
  details?: string[];

  constructor(
    statusCode: number,
    message: string,
    error?: string,
    path?: string,
    details?: string[],
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
    this.path = path;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}
