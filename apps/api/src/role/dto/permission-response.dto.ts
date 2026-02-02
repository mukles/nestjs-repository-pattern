import { ApiProperty } from "@nestjs/swagger";
import { Permission } from "@repo/shared-types";

export class PermissionResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: Permission;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isActive: boolean;
}
