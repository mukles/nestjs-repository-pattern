import { ApiProperty } from "@nestjs/swagger";

export class HealthResponseDto {
  @ApiProperty({
    description: "Health status message",
    example: "Hello World!",
  })
  message: string;
}
