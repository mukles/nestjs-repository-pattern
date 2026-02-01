import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDto {
  @ApiProperty({
    description: "Refresh token issued during login or previous token refresh",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsInNlc3Npb25JZCI6IjIzN2EzNWVkLTY1MWYtNDZmMC1iYWYyLTkxY2EwY2YzYjhmMiIsImlhdCI6MTc1OTA1OTk0OSwiZXhwIjoxNzU5MTQ2MzQ5LCJhdWQiOiJ1cm46aW5uby1iYXB1czphdWRpZW5jZSIsImlzcyI6InVybjppbm5vLWJhcHVzOmlzc3VlciJ9._1DQ2GBFojSPQBFKWB2-m8ZTXNrz9DZ4XRFLSOtZhdM",
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
